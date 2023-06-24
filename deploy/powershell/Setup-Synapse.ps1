#!/usr/bin/pwsh

Param(
    [parameter(Mandatory=$true)][string]$resourceGroup
)

$synapsePath="..,..,synapse"
Push-Location $($MyInvocation.InvocationName | Split-Path)
Push-Location $(./Join-Path-Recursively.ps1 -pathParts $synapsePath.Split(","))

$workspaceName=$(az synapse workspace list -g $resourceGroup -o json | ConvertFrom-Json).name
az synapse linked-service create --workspace-name $workspaceName --name CoreClaimsDataLake --file ./linkedService/CoreClaimsDataLake.json
az synapse linked-service create --workspace-name $workspaceName --name CoreClaimsCosmosDb --file ./linkedService/CoreClaimsCosmosDb.json

Pop-Location
Pop-Location
