@description('Deployment suffix')
param suffix string = 'demo'

var cosmosAccountName  = 'db-coreclaims-${suffix}'
var eventHubNamespace  = 'eh-coreclaims-${suffix}'
var storageAccountName = 'adlcoreclaims${suffix}'

@description('Guid identity of the user you\'re trying to give permissions')
param userId string = 'cf220de3-78d3-4b7f-bcef-fec5aba298c0'

resource cosmos 'Microsoft.DocumentDB/databaseAccounts@2022-08-15' existing = {
  name: cosmosAccountName
}

resource roleDefinition 'Microsoft.DocumentDB/databaseAccounts/sqlRoleDefinitions@2022-11-15' existing = {
  parent: cosmos
  name: '00000000-0000-0000-0000-000000000002'
}

resource roleAssignmentCosmos 'Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments@2022-08-15' = {
  name: guid(roleDefinition.id, cosmos.id, userId)
  parent: cosmos
  properties: {
    scope: cosmos.id
    roleDefinitionId: roleDefinition.id 
    principalId: userId
  }
}


// Grant Permissions to Identity for EventHub
resource eventHub 'Microsoft.EventHub/namespaces@2022-10-01-preview' existing = {
  name: eventHubNamespace
}

resource eventHubRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(eventHub.id, 'FunctionOwner', userId)
  scope: eventHub
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'f526a384-b230-433a-b45c-95f59c4a2dec') //Azure Event Hubs Data Owner
    principalId: userId
    principalType: 'User'
  }
}

// Grant permissions for Blob storage
resource contributorRoleDefinition 'Microsoft.Authorization/roleDefinitions@2018-01-01-preview' existing = {
  scope: subscription()
  name: 'ba92f5b4-2d11-453d-a403-e96b0029c9fe'
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' existing = {
  name: storageAccountName
}

resource roleAssignmentStorage 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: storageAccount
  name: guid(storageAccount.id, 'BlobContributor', userId)
  properties: {
    roleDefinitionId: contributorRoleDefinition.id
    principalId: userId
    principalType: 'User'
  }
}


output roleAssignmentEventHubId string = eventHubRoleAssignment.id
output roleAssignmentCosmosId string = roleAssignmentCosmos.id
