
@description('Suffix for resource deployment')
param suffix string = uniqueString(resourceGroup().id)

@description('Location for resource deployment')
param location string = resourceGroup().location

@description('The principal ID of the deployer for storage permissions')
param deployerPrincipalId string = ''

@description('OpenAI service name')
param openAiName string = ''

@description('OpenAI deployment name')
param openAiDeployment string = 'completions'

@description('OpenAI resource group (defaults to current resource group)')
param openAiRg string = resourceGroup().name

var appName = 'coreclaims-${suffix}'
var serviceNames = {
  aks: replace('aks-${appName}', '-', '')
  cosmosDb: replace('db-${appName}', '-', '')
  functionApp: replace('fa-${appName}', '-', '')
  servicePlan: 'asp-${appName}'
  eventHub: replace('eh-${appName}', '-', '')
  identity: 'id-${appName}'
  webStorage: replace('web-${appName}', '-', '')
  openAi: 'openai-${appName}'
  apimi: 'mi-api-${appName}'
  workermi: 'mi-worker-${appName}'
  ai: 'ai-${appName}'
}

module cosmosDb 'cosmos.bicep' = {
  scope: resourceGroup()
  name: 'cosmosDeploy'
  params: {
    accountName: serviceNames.cosmosDb
    location: location
  }
}

module eventHub 'eventhub.bicep' = {
  scope: resourceGroup()
  name: 'eventHubDeploy'
  params: {
    eventHubNamespace: serviceNames.eventHub
    location: location
  }
}

module aks 'AKS-Construction/bicep/main.bicep' = {
  name: 'aksconstruction'
  params: {
    location : location
    resourceName: serviceNames.aks
    enable_aad: true
    enableAzureRBAC : true
    registries_sku: 'Basic'
    omsagent: true
    retentionInDays: 30
    agentCount: 1
    
    //Managed workload identity 
    workloadIdentity: true

    //Workload Identity requires OidcIssuer to be configured on AKS
    oidcIssuer: true
    
    //We'll also enable the CSI driver for Key Vault
    keyVaultAksCSI : true

    JustUseSystemPool: true

    httpApplicationRouting: true
  }
}

resource apiIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2022-01-31-preview' = {
  name: serviceNames.apimi
  location: location

  resource fedCreds 'federatedIdentityCredentials' = {
    name: '${serviceNames.apimi}-fed'
    properties: {
      audiences: aks.outputs.aksOidcFedIdentityProperties.audiences
      issuer: aks.outputs.aksOidcFedIdentityProperties.issuer
      subject: 'system:serviceaccount:default:claims-api-sa'
    }
  }
}

resource workerIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2022-01-31-preview' = {
  name: serviceNames.workermi
  location: location

  resource fedCreds 'federatedIdentityCredentials' = {
    name: '${serviceNames.workermi}-fed'
    properties: {
      audiences: aks.outputs.aksOidcFedIdentityProperties.audiences
      issuer: aks.outputs.aksOidcFedIdentityProperties.issuer
      subject: 'system:serviceaccount:default:claims-worker-sa'
    }
  }
}

module staticwebsite 'staticwebsite.bicep' = {
  name: 'staticwebsiteDeploy'
  params: {
    storageAccountName: serviceNames.webStorage
    location: location
    deployerPrincipalId: deployerPrincipalId
  }
}

// Outputs for Generate-Config (eliminates most az cli calls)
output config object = {
  suffix: suffix
  cosmosEndpoint: cosmosDb.outputs.cosmosAccountEndpoint
  eventHubNamespace: '${serviceNames.eventHub}.servicebus.windows.net'
  openAiName: !empty(openAiName) ? openAiName : serviceNames.openAi
  openAiRg: openAiRg
  openAiCompletionsDeployment: openAiDeployment
}

output staticWebsiteUrl string = staticwebsite.outputs.staticWebsiteUrl
