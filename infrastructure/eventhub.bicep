@description('Event Hub namespace name')
param eventHubNamespace string

@description('Resource location')
param location string = resourceGroup().location

@description('API managed identity service principal Id')
param apiPrincipalId string

@description('Worker managed identity service principal Id')
param workerPrincipalId string

var eventHubs = ['IncomingClaim', 'RejectedClaim', 'ClaimApproved', 'ClaimDenied']

resource namespace 'Microsoft.EventHub/namespaces@2022-10-01-preview' = {
  name: eventHubNamespace
  location: location
  sku: {
    name: 'Standard'
    capacity: 1
    tier: 'Standard'
  }
}

resource hubs 'Microsoft.EventHub/namespaces/eventhubs@2022-10-01-preview' = [for eh in eventHubs: {
  name: eh
  parent: namespace
  properties: {
    partitionCount: 32
    messageRetentionInDays: 1
    status: 'Active'
  }
}]

// Grant Permissions to Identity for EventHub
@description('This is the built-in "Azure Event Hubs Data Owner" role. See https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#azure-event-hubs-data-owner')
resource eventHubDataOwnerRole 'Microsoft.Authorization/roleDefinitions@2018-01-01-preview' existing = {
  scope: subscription()
  name: 'f526a384-b230-433a-b45c-95f59c4a2dec'
}

resource eventHubApiRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(apiPrincipalId, namespace.id, 'FunctionOwner')
  scope: namespace
  properties: {
    roleDefinitionId: eventHubDataOwnerRole.id
    principalId: apiPrincipalId
    principalType: 'ServicePrincipal'
  }
}

resource eventHubWorkerRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(workerPrincipalId, namespace.id, 'FunctionOwner')
  scope: namespace
  properties: {
    roleDefinitionId: eventHubDataOwnerRole.id
    principalId: workerPrincipalId
    principalType: 'ServicePrincipal'
  }
}

