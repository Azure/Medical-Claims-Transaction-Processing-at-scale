@description('OpenAI service name')
param openAiName string

@description('API principal ID')
param apiPrincipalId string

@description('Worker principal ID')
param workerPrincipalId string

resource openAiAccount 'Microsoft.CognitiveServices/accounts@2024-10-01' existing = {
  name: openAiName
}

// Cognitive Services OpenAI User role
var cognitiveServicesOpenAIUserRoleId = '5e0bd9bd-7b93-4f28-af87-19fc36ad61bd'

// Assign OpenAI permissions to API
resource apiOpenAiAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(openAiAccount.id, apiPrincipalId, cognitiveServicesOpenAIUserRoleId)
  scope: openAiAccount
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', cognitiveServicesOpenAIUserRoleId)
    principalId: apiPrincipalId
    principalType: 'ServicePrincipal'
  }
}

// Assign OpenAI permissions to Worker
resource workerOpenAiAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(openAiAccount.id, workerPrincipalId, cognitiveServicesOpenAIUserRoleId)
  scope: openAiAccount
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', cognitiveServicesOpenAIUserRoleId)
    principalId: workerPrincipalId
    principalType: 'ServicePrincipal'
  }
}
