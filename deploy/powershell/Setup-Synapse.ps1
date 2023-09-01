#!/usr/bin/pwsh

Param(
    [parameter(Mandatory=$true)][string]$resourceGroup
)

$synapsePath="..,..,synapse"
Push-Location $($MyInvocation.InvocationName | Split-Path)
Push-Location $(./Join-Path-Recursively.ps1 -pathParts $synapsePath.Split(","))

Get-Location

$workspaceName=$(az synapse workspace list -g $resourceGroup -o json | ConvertFrom-Json).name

az synapse linked-service create --workspace-name $workspaceName --name CoreClaimsDataLake --file '@./linkedService/CoreClaimsDataLake.json'
az synapse linked-service create --workspace-name $workspaceName --name CoreClaimsCosmosDb --file '@./linkedService/CoreClaimsCosmosDb.json'
az synapse linked-service create --workspace-name $workspaceName --name solliancepublicdata --file '@./linkedService/solliancepublicdata.json'

$datasets = Get-ChildItem ./dataset
foreach ($dataset in $datasets) {
    $name = $dataset.BaseName
    Write-Host "Creating dataset: $dataset" -ForegroundColor Blue
    az synapse dataset create --workspace-name $workspaceName --name "${name}" --file '@./dataset/$($dataset)'
}

az synapse pipeline create --workspace-name $workspaceName --file '@./pipeline/Initial-Ingestion.json' --name Initial-Ingestion

Pop-Location
Pop-Location
