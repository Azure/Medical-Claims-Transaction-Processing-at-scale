@description('Cosmos DB account name')
param cosmosAccountName string

@description('Event Hub namespace name')
param eventHubNamespaceName string

@description('OpenAI service name')
param openAiName string

@description('OpenAI resource group')
param openAiResourceGroup string

@description('API principal ID')
param apiPrincipalId string

@description('Worker principal ID')
param workerPrincipalId string

@description('Deployer user principal ID for local development')
param deployerPrincipalId string = ''

// Get existing resources in current resource group
resource cosmosAccount 'Microsoft.DocumentDB/databaseAccounts@2024-05-15' existing = {
  name: cosmosAccountName
}

resource eventHubNamespace 'Microsoft.EventHub/namespaces@2024-01-01' existing = {
  name: eventHubNamespaceName
}

// Cosmos DB SQL Role Definition (Contributor)
resource cosmosDbSqlRoleDefinition 'Microsoft.DocumentDB/databaseAccounts/sqlRoleDefinitions@2024-05-15' existing = {
  parent: cosmosAccount
  name: '00000000-0000-0000-0000-000000000002' // Cosmos DB Built-in Data Contributor
}

// Assign Cosmos DB permissions to API
resource apiCosmosAssignment 'Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments@2024-05-15' = {
  parent: cosmosAccount
  name: guid(cosmosAccount.id, apiPrincipalId, cosmosDbSqlRoleDefinition.id)
  properties: {
    roleDefinitionId: cosmosDbSqlRoleDefinition.id
    principalId: apiPrincipalId
    scope: cosmosAccount.id
  }
}

// Assign Cosmos DB permissions to Worker
resource workerCosmosAssignment 'Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments@2024-05-15' = {
  parent: cosmosAccount
  name: guid(cosmosAccount.id, workerPrincipalId, cosmosDbSqlRoleDefinition.id)
  properties: {
    roleDefinitionId: cosmosDbSqlRoleDefinition.id
    principalId: workerPrincipalId
    scope: cosmosAccount.id
  }
}

// Assign Cosmos DB permissions to Deployer (for local development)
resource deployerCosmosAssignment 'Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments@2024-05-15' = if (!empty(deployerPrincipalId)) {
  parent: cosmosAccount
  name: guid(cosmosAccount.id, deployerPrincipalId, cosmosDbSqlRoleDefinition.id)
  properties: {
    roleDefinitionId: cosmosDbSqlRoleDefinition.id
    principalId: deployerPrincipalId
    scope: cosmosAccount.id
  }
}

// Event Hub Data Owner role
var eventHubDataOwnerRoleId = 'f526a384-b230-433a-b45c-95f59c4a2dec'

// Assign Event Hub permissions to API
resource apiEventHubAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(eventHubNamespace.id, apiPrincipalId, eventHubDataOwnerRoleId)
  scope: eventHubNamespace
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', eventHubDataOwnerRoleId)
    principalId: apiPrincipalId
    principalType: 'ServicePrincipal'
  }
}

// Assign Event Hub permissions to Worker
resource workerEventHubAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(eventHubNamespace.id, workerPrincipalId, eventHubDataOwnerRoleId)
  scope: eventHubNamespace
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', eventHubDataOwnerRoleId)
    principalId: workerPrincipalId
    principalType: 'ServicePrincipal'
  }
}

// Assign Event Hub permissions to Deployer (for local development)
resource deployerEventHubAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = if (!empty(deployerPrincipalId)) {
  name: guid(eventHubNamespace.id, deployerPrincipalId, eventHubDataOwnerRoleId)
  scope: eventHubNamespace
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', eventHubDataOwnerRoleId)
    principalId: deployerPrincipalId
    principalType: 'User'
  }
}

// OpenAI permissions (requires helper module for cross-resource-group)
module openAiPermissions './helpers/openai-permissions.bicep' = {
  name: 'openAiPermissions'
  scope: resourceGroup(openAiResourceGroup)
  params: {
    openAiName: openAiName
    apiPrincipalId: apiPrincipalId
    workerPrincipalId: workerPrincipalId
  }
}
