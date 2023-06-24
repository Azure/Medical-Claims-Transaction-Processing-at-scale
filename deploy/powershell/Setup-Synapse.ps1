#!/usr/bin/pwsh

Param(
    [parameter(Mandatory=$true)][string]$resourceGroup, 
    [parameter(Mandatory=$false)][string]$synapseWorkspace,
    [parameter(Mandatory=$false)][string]$suffix
)

$synapsePath="..,..,synapse"
Push-Location $($MyInvocation.InvocationName | Split-Path)
Push-Location $(./Join-Path-Recursively.ps1 -pathParts $synapsePath.Split(","))

$workspaceName = $synapseWorkspace
if (-not $workspaceName) {
    $workspaceName=$(az synapse workspace list -g $resourceGroup -o json | ConvertFrom-Json).name
    $suffix=""
}

az synapse linked-service create --workspace-name $workspaceName --name CoreClaimsDataLake$suffix --file $(jq '.' "linkedService/CoreClaimsDataLake.json")
az synapse linked-service create --workspace-name $workspaceName --name CoreClaimsCosmosDb$suffix --file "linkedService/CoreClaimsCosmosDb.json"

$datasets = Get-ChildItem ./dataset
foreach ($dataset in $datasets) {
    az synapse dataset create --workspace-name $workspaceName --name "${dataset.BaseName}${suffix}" --file "dataset/$dataset"
}

Pop-Location

az synapse notebook create --workspace-name $workspaceName --file "../Synthea-CSV-to-Json.ipynb" --name Synthea-CSV-to-Json$suffix --folder-path 'Ingestion' --spark-pool-name ingestion

Push-Location $(./Join-Path-Recursively.ps1 -pathParts $synapsePath.Split(","))

az synapse pipeline create --workspace-name $workspaceName --file "pipeline/Initial-Ingestion.json" --name Initial-Ingestion$suffix

Pop-Location
Pop-Location
