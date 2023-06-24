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

$datasets = Get-ChildItem ./dataset
foreach ($dataset in $datasets) {
    az synapse dataset create --workspace-name $workspaceName --name $dataset.BaseName --file ./dataset/$dataset
}

Pop-Location

az synapse notebook create --workspace-name $workspaceName --file "../Synthea-CSV-to-Json.ipynb" --name Synthea-CSV-to-Json --folder-path 'Ingestion' --spark-pool-name ingestion

Push-Location $(./Join-Path-Recursively.ps1 -pathParts $synapsePath.Split(","))

az synapse pipeline create --workspace-name $workspaceName --file ./pipeline/Initial-Ingestion.json --name Initial-Ingestion

Pop-Location
Pop-Location
