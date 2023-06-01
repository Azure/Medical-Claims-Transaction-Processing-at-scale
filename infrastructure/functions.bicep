@description('Function app name')
param functionAppName string

@description('Service plan name')
param servicePlanName string

@description('Storage account name')
param storageAccountName string

@description('Cosmos DB account name')
param cosmosAccountName string

@description('Event Hub namespace name')
param eventHubNamespaceName string

@description('Resource location')
param location string = resourceGroup().location

@description('Function App Service Plan SKU')
@allowed(['Y1', 'B1'])
param appServicePlanSku string = 'Y1'

resource plan 'Microsoft.Web/serverfarms@2020-12-01' = {
  name: servicePlanName
  location: location
  kind: 'functionapp'
  sku: {
    name: appServicePlanSku
  }
}

resource blob 'Microsoft.Storage/storageAccounts@2022-09-01' existing = {
  name: storageAccountName
}

resource functionApp 'Microsoft.Web/sites@2022-03-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: plan.id
    siteConfig: {
      use32BitWorkerProcess: false
      
      appSettings: [
        {
          name: 'BusinessRuleOptions__AutoApproveThreshold'
          value: '200'
        }
        {
          name: 'BusinessRuleOptions__RequireManagerApproval'
          value: '500'
        }
        {
          name: 'AzureWebJobsStorage__accountName'
          value: storageAccountName
        }
        // Needed if publishing from linux
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${blob.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${blob.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${blob.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${blob.listKeys().keys[0].value}'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'dotnet'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'CoreClaimsCosmosDB__accountEndpoint'
          value: 'https://${cosmosAccountName}.documents.azure.com:443/'
        }
        {
          name: 'CoreClaimsEventHub__fullyQualifiedNamespace'
          value: '${eventHubNamespaceName}.servicebus.windows.net'
        }           
      ]
    }
    httpsOnly: true
  }
}

// Grant Permissions to Identity for EventHub
resource eventHub 'Microsoft.EventHub/namespaces@2022-10-01-preview' existing = {
  name: eventHubNamespaceName
}

@description('This is the built-in "Azure Event Hubs Data Owner" role. See https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-owner')
resource eventHubDataOwnerRole 'Microsoft.Authorization/roleDefinitions@2018-01-01-preview' existing = {
  scope: subscription()
  name: 'f526a384-b230-433a-b45c-95f59c4a2dec'
}

resource eventHubRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(eventHub.id, 'FunctionOwner')
  scope: eventHub
  properties: {
    roleDefinitionId: eventHubDataOwnerRole.id
    principalId: functionApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

// Grant Permissions to Identity for CosmosDB
resource cosmos 'Microsoft.DocumentDB/databaseAccounts@2022-08-15' existing = {
  name: cosmosAccountName
}

@description('This is the built-in "Cosmos DB Built-in Data Contributor" role. https://learn.microsoft.com/en-us/azure/cosmos-db/how-to-setup-rbac#built-in-role-definitions')
resource roleDefinition 'Microsoft.DocumentDB/databaseAccounts/sqlRoleDefinitions@2022-11-15' existing = {
  parent: cosmos
  name: '00000000-0000-0000-0000-000000000002'
}

resource roleAssignmentCosmos 'Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments@2022-08-15' = {
  name: guid(roleDefinition.id, cosmos.id)
  parent: cosmos
  properties: {
    scope: cosmos.id
    roleDefinitionId: roleDefinition.id 
    principalId: functionApp.identity.principalId
  }
}

// Grant Permissions to Identity for Storage
@description('This is the built-in "Storage Blob Data Contributor" role. See https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#storage-blob-data-contributor')
resource contributorRoleDefinition 'Microsoft.Authorization/roleDefinitions@2018-01-01-preview' existing = {
  scope: subscription()
  name: 'ba92f5b4-2d11-453d-a403-e96b0029c9fe'
}

resource storage 'Microsoft.Storage/storageAccounts@2022-09-01' existing = {
  name: storageAccountName
}

resource roleAssignmentStorage 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: storage
  name: guid(storage.id, 'FunctionOwner')
  properties: {
    roleDefinitionId: contributorRoleDefinition.id
    principalId: functionApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}
