
@description('Suffix for resource deployment')
param suffix string = uniqueString(resourceGroup().id)

@description('Location for resource deployment')
param location string = resourceGroup().location

@description('OpenAI service name')
param openAiName string = ''

@description('OpenAI deployment name')
param openAiDeployment string = 'completions'

@description('OpenAI resource group (defaults to current resource group)')
param openAiRg string = resourceGroup().name

@description('The principal ID of the deployer for storage permissions')
param deployerPrincipalId string = ''

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

module logAnalytics 'loganalytics.bicep' = {
  name: 'logAnalyticsDeploy'
  params: {
    name: appName
    location: location
  }
}

// Determine OpenAI configuration (idempotent - always creates if not exists)
var finalOpenAiName = !empty(openAiName) ? openAiName : serviceNames.openAi
var isExternalRg = openAiRg != resourceGroup().name

// Deploy OpenAI in same resource group (idempotent)
module openAi 'openai.bicep' = if (!isExternalRg) {
  name: 'openAiDeploy'
  params: {
    openAiName: finalOpenAiName
    location: location
    deployments: [
      {
        name: openAiDeployment
        model: 'gpt-4o'
        version: '2024-11-20'
      }
    ]
  }
}

// Deploy OpenAI in external resource group (idempotent)
module openAiExternal 'openai.bicep' = if (isExternalRg) {
  name: 'openAiExternalDeploy'
  scope: resourceGroup(openAiRg)
  params: {
    openAiName: finalOpenAiName
    location: location
    deployments: [
      {
        name: openAiDeployment
        model: 'gpt-4o'
        version: '2024-11-20'
      }
    ]
  }
}

module containerApps 'containerapp.bicep' = {
  name: 'conatinerApps'
  params: {
    aiConnectionString: logAnalytics.outputs.aiConnectionString
    cosmosEndpoint: cosmosDb.outputs.cosmosAccountEndpoint
    laWorkspaceId: logAnalytics.outputs.laWorkspaceId
    location: location
    name: appName
    openAiCompletionsDeployment: openAiDeployment
    openAiEndpoint: isExternalRg ? openAiExternal!.outputs.endpoint : openAi!.outputs.endpoint
    suffix: suffix
  }
}

// Assign permissions after Container Apps are created with System-Assigned Identity
module permissions 'permissions.bicep' = {
  name: 'permissionsDeploy'
  params: {
    cosmosAccountName: serviceNames.cosmosDb
    eventHubNamespaceName: serviceNames.eventHub
    openAiName: finalOpenAiName
    openAiResourceGroup: openAiRg
    apiPrincipalId: containerApps.outputs.apiPrincipalId
    workerPrincipalId: containerApps.outputs.workerPrincipalId
    deployerPrincipalId: deployerPrincipalId
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

// Outputs for Generate-Config (eliminates az cli calls)
output config object = {
  suffix: suffix
  cosmosEndpoint: cosmosDb.outputs.cosmosAccountEndpoint
  eventHubNamespace: '${serviceNames.eventHub}.servicebus.windows.net'
  openAiEndpoint: isExternalRg ? openAiExternal!.outputs.endpoint : openAi!.outputs.endpoint
  openAiName: finalOpenAiName
  openAiRg: openAiRg
  openAiCompletionsDeployment: openAiDeployment
  aiConnectionString: logAnalytics.outputs.aiConnectionString
  apiUrl: 'https://${containerApps.outputs.apiFqdn}/api'
  webappHostname: containerApps.outputs.apiFqdn
}

output staticWebsiteUrl string = staticwebsite.outputs.staticWebsiteUrl
