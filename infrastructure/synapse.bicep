@description('Synapse workspace name')
param synapseServiceName string

@description('Storage account with "claimsfs" container')
param storageAccountName string

@description('Resource location')
param location string = resourceGroup().location

var storageContainerName = 'claimsfs'

@description('Cosmos DB account name')
param cosmosAccountName string

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' existing = {
  name: storageAccountName
}

resource blobServices 'Microsoft.Storage/storageAccounts/blobServices@2022-09-01' existing = {
  parent: storageAccount
  name: 'default'
}

resource container 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-09-01' = {
  parent: blobServices
  name: storageContainerName
  properties: {
    publicAccess: 'None'
  }
}

resource synapse 'Microsoft.Synapse/workspaces@2021-06-01' = {
  location: location
  name: synapseServiceName
  properties: {
    defaultDataLakeStorage: {
      resourceId: blobServices.id
      accountUrl: storageAccount.properties.primaryEndpoints.dfs
      filesystem: storageContainerName
    }
  }
  identity: {
    type: 'SystemAssigned'
  }
}

resource sparkPool 'Microsoft.Synapse/workspaces/bigDataPools@2021-06-01' = {
  location: location
  parent: synapse
  name: 'ingestion'
  properties: {
    nodeSize: 'Small'
    nodeSizeFamily: 'MemoryOptimized'
    nodeCount: 4
    sparkVersion: '3.3'
    autoScale: {
      enabled: true
      minNodeCount: 3
      maxNodeCount: 8
    }
    autoPause: {
      delayInMinutes: 15
      enabled: true
    }
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
  name: guid(roleDefinition.id, cosmos.id, 'Synapse')
  parent: cosmos
  properties: {
    scope: cosmos.id
    roleDefinitionId: roleDefinition.id 
    principalId: synapse.identity.principalId
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
  name: guid(storage.id, 'SynapseOwner')
  properties: {
    roleDefinitionId: contributorRoleDefinition.id
    principalId: synapse.identity.principalId
    principalType: 'ServicePrincipal'
  }
}
