
@description('Suffix for resource deployment')
param suffix string = uniqueString(resourceGroup().id)

@description('Location for resource deployment')
param location string = resourceGroup().location

@description('Function App Service Plan SKU')
@allowed(['Y1', 'B1'])
param appServicePlanSku string = 'Y1'

@description('OpenAI service name')
param openAiName string = 'openaipayments${suffix}'

@description('OpenAi Deployment')
param openAiDeployment string = 'completions'

@description('OpenAI Resource Group')
param openAiResourceGroup string

var appName = 'coreclaims-${suffix}'
var serviceNames = {
  cosmosDb: replace('db-${appName}', '-', '')
  functionApp: replace('fa-${appName}', '-', '')
  servicePlan: 'asp-${appName}'
  eventHub: replace('eh-${appName}', '-', '')
  storage: replace('adl-${appName}', '-', '')
  synapse: 'synapse-${appName}'
  identity: 'id-${appName}'
  webStorage: replace('web-${appName}', '-', '')
}

module storage 'storage.bicep' = {
  scope: resourceGroup()
  name: 'storageDeploy'
  params: {
    storageAccountName: serviceNames.storage
    location: location
  }
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

// TODO: Deploy via Bicep. Presently, attempting this results in the following error:
//   {"code": "ApiSetDisabledForCreation", "message": "It's not allowed to create new accounts with type 'OpenAI'."}
// module openAi 'openai.bicep' = {
//   name: 'openAiDeploy'
//   params: {
//     openAiName: openAiName
//     location: locArray[0]
//     deployments: [
//       {
//         name: 'completions'
//         model: 'text-davinci-003'
//         version: '1'
//         sku: {
//           name: 'Standard'
//           capacity: 60
//         }
//       }
//     ]
//   }
// }

module functionApp 'functions.bicep' = {
  scope: resourceGroup()
  name: 'functionDeploy'
  params: {
    cosmosAccountName: serviceNames.cosmosDb
    eventHubNamespaceName: serviceNames.eventHub
    functionAppName: serviceNames.functionApp
    servicePlanName: serviceNames.servicePlan
    storageAccountName: serviceNames.storage
    location: location
    appServicePlanSku: appServicePlanSku
    openAiName: openAiName
    openAiDeployment: openAiDeployment
    openAiResourceGroup: openAiResourceGroup
  }
  dependsOn: [storage, cosmosDb]
}

module staticwebsite 'staticwebsite.bicep' = {
  name: 'staticwebsiteDeploy'
  params: {
    storageAccountName: serviceNames.webStorage
    location: location
  }
}

output staticWebsiteUrl string = staticwebsite.outputs.staticWebsiteUrl
