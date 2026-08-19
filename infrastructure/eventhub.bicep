@description('Event Hub namespace name')
param eventHubNamespace string

@description('Resource location')
param location string = resourceGroup().location

var eventHubs = ['IncomingClaim', 'RejectedClaim', 'ClaimApproved', 'ClaimDenied', 'AdjudicatorChanged']

resource namespace 'Microsoft.EventHub/namespaces@2024-01-01' = {
  name: eventHubNamespace
  location: location
  sku: {
    name: 'Standard'
    capacity: 1
    tier: 'Standard'
  }
}

resource hubs 'Microsoft.EventHub/namespaces/eventhubs@2024-01-01' = [for eh in eventHubs: {
  name: eh
  parent: namespace
  properties: {
    partitionCount: 32
    messageRetentionInDays: 1
    status: 'Active'
  }
}]


