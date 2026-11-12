@description('Common name of resources')
param name string

@description('Location of resource')
param location string

@description('Resource suffix')
param suffix string

@description('CosmosDB endpoint')
param cosmosEndpoint string

@description('OpenAI Endpoint')
param openAiEndpoint string

@description('OpenAI Completions deployment')
param openAiCompletionsDeployment string

@description('App Insights connection string')
param aiConnectionString string

@description('Log Analytics Workspace Resource ID')
param laWorkspaceId string

var containerAppConfigs = [
  {
    name: 'api'
    identity: {
      type: 'SystemAssigned'
    }
    ingress: {
      allowInsecure: false
      clientCertificateMode: 'Ignore'
      exposedPort: 0
      external: true
      stickySessions: {
        affinity: 'sticky'
      }
      targetPort: 8080
      traffic: [
        {
          latestRevision: true
          weight: 100
        }
      ]
      transport: 'Auto'
    }
    env: [
      {
        name: 'CoreClaimsCosmosDB__accountEndpoint'
        value: cosmosEndpoint
      }
      {
        name: 'CoreClaimsEventHub__fullyQualifiedNamespace'
        value: 'ehcoreclaims${suffix}.servicebus.windows.net'
      }
      {
        name: 'BusinessRuleOptions__AutoApproveThreshold'
        value: '200'
      }
      {
        name: 'BusinessRuleOptions__RequireManagerApproval'
        value: '500'
      }
      {
        name: 'BusinessRuleOptions__DemoMode'
        value: 'true'
      }
      {
        name: 'BusinessRuleOptions__DemoAdjudicatorId'
        value: 'df166300-5a78-3502-a46a-832842197811'
      }
      {
        name: 'BusinessRuleOptions__DemoManagerAdjudicatorId'
        value: 'a735bf55-83e9-331a-899d-a82a60b9f60c'
      }
      {
        name: 'RulesEngine__OpenAIEndpoint'
        value: openAiEndpoint
      }
      {
        name: 'RulesEngine__OpenAICompletionsDeployment'
        value: openAiCompletionsDeployment
      }
      {
        name: 'ApplicationInsights__ConnectionString'
        value: aiConnectionString
      }
      {
        name: 'ASPNETCORE_ENVIRONMENT'
        value: 'Production'
      }
    ]
  }
  {
    name: 'worker'
    identity: {
      type: 'SystemAssigned'
    }
    ingress: null
    env: [
      {
        name: 'CoreClaimsCosmosDB__accountEndpoint'
        value: cosmosEndpoint
      }
      {
        name: 'CoreClaimsEventHub__fullyQualifiedNamespace'
        value: 'ehcoreclaims${suffix}.servicebus.windows.net'
      }
      {
        name: 'BusinessRuleOptions__AutoApproveThreshold'
        value: '200'
      }
      {
        name: 'BusinessRuleOptions__RequireManagerApproval'
        value: '500'
      }
      {
        name: 'BusinessRuleOptions__DemoMode'
        value: 'true'
      }
      {
        name: 'BusinessRuleOptions__DemoAdjudicatorId'
        value: 'df166300-5a78-3502-a46a-832842197811'
      }
      {
        name: 'BusinessRuleOptions__DemoManagerAdjudicatorId'
        value: 'a735bf55-83e9-331a-899d-a82a60b9f60c'
      }
      {
        name: 'ApplicationInsights__ConnectionString'
        value: aiConnectionString
      }
      {
        name: 'ASPNETCORE_ENVIRONMENT'
        value: 'Production'
      }
    ]
  }
]

resource vnet 'Microsoft.Network/virtualNetworks@2025-01-01' = {
  name: 'vnet-${name}'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.244.0.0/16'
      ]
    }
    subnets: [
      {
        name: 'aca-subnet'
        properties: {
          addressPrefix: '10.244.0.0/16'
          delegations: [
            {
              name: 'Microsoft.App.environments'
              properties: {
                serviceName: 'Microsoft.App/environments'
              }
              type: 'Microsoft.Network/virtualNetworks/subnets/delegations'
            }
          ]
          privateEndpointNetworkPolicies: 'Disabled'
          privateLinkServiceNetworkPolicies: 'Disabled'
        }
      }
    ]
  }
}

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2025-11-01' = {
  location: location
#disable-next-line BCP334
  name: '${replace(name, '-', '')}cr'
  sku: {
    name: 'Standard'
  }
  properties: {
    anonymousPullEnabled: true
  }
}

resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2025-07-01' = {
  name: 'acaenv-${name}'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: reference(laWorkspaceId, '2025-07-01').customerId
        sharedKey: listKeys(laWorkspaceId, '2025-07-01').primarySharedKey
      }
    }
    infrastructureResourceGroup: 'ME_${resourceGroup().name}'
    vnetConfiguration: {
      infrastructureSubnetId: vnet.properties.subnets[0].id
      internal: false
    }
    workloadProfiles: [
      {
        name: 'Consumption'
        workloadProfileType: 'Consumption'
      }
      {
        maximumCount: 10
        minimumCount: 2
        name: 'Warm'
        workloadProfileType: 'E4'
      }
    ]
    zoneRedundant: false
  }
}

resource containerApps 'Microsoft.App/containerApps@2025-07-01' = [for (config, i) in containerAppConfigs: {
  name: 'aca-${config.name}-${name}'
  location: location
  identity: config.identity
  properties: {
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: config.ingress
      secrets: []
    }
    environmentId: containerAppEnvironment.id
    managedEnvironmentId: containerAppEnvironment.id
    template: {
      containers: [
        {
          env: config.env
          image: 'mcr.microsoft.com/k8se/quickstart:latest'
          name: 'aca${name}${config.name}'
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
        }
      ]
      scale: {
        maxReplicas: 10
        minReplicas: 2
      }
      volumes: []
    }
    workloadProfileName: 'Warm'
  }
}]

// Export principal IDs for permission assignment
output apiPrincipalId string = containerApps[0].identity.principalId
output workerPrincipalId string = containerApps[1].identity.principalId

// Export FQDN for configuration
output apiFqdn string = containerApps[0].properties.configuration.ingress.fqdn

// NOTE: INTENTIONALLY NO OUTPUT FOR CREDENTIALS
output mainUrl string = 'https://${containerApps[0].properties.configuration.ingress.fqdn}'
