
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

module logAnalytics 'loganalytics.bicep' = {
  name: 'logAnalyticsDeploy'
  params: {
    name: appName
    location: location
  }
}

resource openAi 'Microsoft.CognitiveServices/accounts@2023-05-01' existing = {
  name: openAiName
}

module containerApps 'containerapp.bicep' = {
  name: 'conatinerApps'
  params: {
    aiConnectionString: logAnalytics.outputs.aiConnectionString
    cosmosEndpoint: cosmosDb.outputs.cosmosAccountEndpoint
    dataLakeAccountName: serviceNames.storage
    laCustomerId: logAnalytics.outputs.laCustomerId
    laSharedKey: logAnalytics.outputs.laSharedKey
    location: location
    name: appName
    openAiCompletionsDeployment: openAiDeployment
    openAiEndpoint: openAi.properties.endpoint
    openAiKey: openAi.listKeys().key1
    suffix: suffix
    workerClientId: workerIdentity.properties.clientId
    apiClientId: apiIdentity.properties.clientId
    apiMiId: apiIdentity.id
    workerMiId: workerIdentity.id
  }
}

resource apiIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2022-01-31-preview' = {
  name: serviceNames.apimi
  location: location
}

resource workerIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2022-01-31-preview' = {
  name: serviceNames.workermi
  location: location
}

module staticwebsite 'staticwebsite.bicep' = {
  name: 'staticwebsiteDeploy'
  params: {
    storageAccountName: serviceNames.webStorage
    location: location
  }
}

output staticWebsiteUrl string = staticwebsite.outputs.staticWebsiteUrl
