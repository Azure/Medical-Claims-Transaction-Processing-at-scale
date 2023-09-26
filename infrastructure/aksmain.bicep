
@description('Suffix for resource deployment')
param suffix string = uniqueString(resourceGroup().id)

@description('Location for resource deployment')
param location string = resourceGroup().location

@description('OpenAi Name')
param openAiName string = 'openai-coreclaims-${suffix}'

@description('OpenAi Deployment')
param openAiDeployment string = 'completions'

var appName = 'coreclaims-${suffix}'
var serviceNames = {
  aks: replace('aks-${appName}', '-', '')
  cosmosDb: replace('db-${appName}', '-', '')
  functionApp: replace('fa-${appName}', '-', '')
  servicePlan: 'asp-${appName}'
  eventHub: replace('eh-${appName}', '-', '')
  storage: replace('adl-${appName}', '-', '')
  synapse: 'synapse-${appName}'
  identity: 'id-${appName}'
  webStorage: replace('web-${appName}', '-', '')
  openAi: 'openai-${appName}'
  apimi: 'mi-api-${appName}'
  workermi: 'mi-worker-${appName}'
  ai: 'ai-${appName}'
}

module storage 'storage.bicep' = {
  scope: resourceGroup()
  name: 'storageDeploy'
  params: {
    storageAccountName: serviceNames.storage
    location: location
    apiPrincipalId: apiIdentity.properties.principalId
    workerPrincipalId: workerIdentity.properties.principalId
  }
}

module cosmosDb 'cosmos.bicep' = {
  scope: resourceGroup()
  name: 'cosmosDeploy'
  params: {
    accountName: serviceNames.cosmosDb
    location: location
    apiPrincipalId: apiIdentity.properties.principalId
    workerPrincipalId: workerIdentity.properties.principalId
  }
}

module eventHub 'eventhub.bicep' = {
  scope: resourceGroup()
  name: 'eventHubDeploy'
  params: {
    eventHubNamespace: serviceNames.eventHub
    location: location
    apiPrincipalId: apiIdentity.properties.principalId
    workerPrincipalId: workerIdentity.properties.principalId
  }
}

#disable-next-line BCP179
module synapse 'synapse.bicep' = {
  scope: resourceGroup()
  name: 'synapseDeploy'
  params: {
    cosmosAccountName: serviceNames.cosmosDb
    storageAccountName: serviceNames.storage
    synapseServiceName: serviceNames.synapse
    location: location
  }
  dependsOn: [storage, cosmosDb]
}

// module openAi 'openai.bicep' = {
//   name: 'openAiDeploy'
//   scope: resourceGroup() // Deployments with existing OpenAi (different resource group) will have to be properly adjust this
//   params: {
//     openAiName: serviceNames.openAi
//     location: location
//     deployments: [
//       {
//         name: openAiDeployment
//         model: 'gpt-35-turbo'
//         version: '0301'
//         sku: {
//           name: 'Standard'
//           capacity: 60
//         }
//       }
//     ]
//   }
// }

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
  }
  dependsOn: [cosmosDb, storage]
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
  }
}

output staticWebsiteUrl string = staticwebsite.outputs.staticWebsiteUrl
