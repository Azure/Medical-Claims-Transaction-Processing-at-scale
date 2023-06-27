@description('Location for resource deployment')
param location string = resourceGroup().location

@description('Cosmos DB Account Name')
param accountName string

@description('Maximum autoscale throughput')
@maxValue(1000000)
@minValue(1000)
param autoscaleMax int = 1000

@description('Analytics TTL')
@minValue(-1)
@maxValue(2147483647)
param analyticsTTL int = -1

var databaseName = 'CoreClaimsApp'

var containers = [
  {
    name: 'Claim'
    partitionKey: '/claimId'
    dedicated: 2000
  }
  {
    name: 'ClaimLeases'
    partitionKey: '/id'
    dedicated: 2000
  }
  {
    name: 'Member'
    partitionKey: '/memberId'
    dedicated: 1000
  }
  {
    name: 'ClaimProcedure'
    partitionKey: '/code'
    dedicated: 0
  }
  {
    name: 'Payer'
    partitionKey: '/payerId'
    dedicated: 0
  }
  {
    name: 'Provider'
    partitionKey: '/providerId'
    dedicated: 0
  }
  {
    name: 'Adjudicator'
    partitionKey: '/adjudicatorId'
    dedicated: 0
  }
]

resource account 'Microsoft.DocumentDB/databaseAccounts@2022-11-15' = {
  name: toLower(accountName)
  kind: 'GlobalDocumentDB'
  location: location
  properties: {
    databaseAccountOfferType: 'Standard'
    enableAnalyticalStorage: true
    analyticalStorageConfiguration: {
      schemaType: 'FullFidelity'
    }
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
  }
}

resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2022-11-15' = {
  parent: account
  name: databaseName
  properties: {
    options: {
      autoscaleSettings: {
        maxThroughput: autoscaleMax
      }
    }
    resource: {
      id: databaseName
    }
  }
}

resource container 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2022-11-15' = [for (config, i) in containers: {
  parent: database
  name: config.name
  properties: {
    resource:{
      id: config.name
      partitionKey: {
        paths: [ config.partitionKey ]
        kind: 'Hash'
        version: 1
      }
      indexingPolicy: {
        automatic: true
        indexingMode: 'consistent'
      }
    }
    options: (config.dedicated != 0) ? {
      autoscaleSettings: {
        maxThroughput: config.dedicated
      }
    }:{

    }
  }
}]

output cosmosAccountName string = account.name
output cosmosDatabaseName string = database.name
