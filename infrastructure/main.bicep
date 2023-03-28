
@description('Suffix for resource deployment')
param suffix string = uniqueString(resourceGroup().id)

@description('Location for resource deployment')
param location string = resourceGroup().location

@description('Function App Service Plan SKU')
@allowed(['Y1', 'B1'])
param appServicePlanSku string = 'Y1'

var appName = 'coreclaims-${suffix}'
var serviceNames = {
  cosmosDb: 'db-${appName}'
  functionApp: 'fa-${appName}'
  servicePlan: 'asp-${appName}'
  eventHub: 'eh-${appName}'
  storage: replace('adl-${appName}', '-', '')
  synapse: 'synapse-${appName}'
  identity: 'id-${appName}'
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
  }
  dependsOn: [storage, cosmosDb]
}
