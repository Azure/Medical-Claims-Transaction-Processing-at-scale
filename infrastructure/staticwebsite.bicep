// This template deploys an Azure Storage account for static website hosting.
// The static website feature must be enabled separately via Azure CLI/PowerShell after deployment.

@description('The location into which the resources should be deployed.')
param location string = resourceGroup().location

@description('The name of the storage account to use for site hosting.')
param storageAccountName string = 'stor${uniqueString(resourceGroup().id)}'

@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_ZRS'
  'Premium_LRS'
])
@description('The storage account sku name.')
param storageSku string = 'Standard_LRS'

@description('The principal ID of the user/service principal that will manage the static website')
param deployerPrincipalId string = ''

resource storageAccount 'Microsoft.Storage/storageAccounts@2025-06-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: storageSku
  }
  properties: {
    allowSharedKeyAccess: false
  }
}

// Storage Blob Data Contributor role for deployer
resource storageBlobDataContributorRole 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  scope: subscription()
  name: 'ba92f5b4-2d11-453d-a403-e96b0029c9fe'
}

resource deployerRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = if (!empty(deployerPrincipalId)) {
  scope: storageAccount
  name: guid(storageAccount.id, deployerPrincipalId, storageBlobDataContributorRole.id)
  properties: {
    roleDefinitionId: storageBlobDataContributorRole.id
    principalId: deployerPrincipalId
    principalType: 'User'
  }
}

output storageAccountName string = storageAccount.name
output staticWebsiteUrl string = storageAccount.properties.primaryEndpoints.web
