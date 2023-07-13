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

az synapse linked-service create --workspace-name $workspaceName --name CoreClaimsDataLake$suffix --file '@"linkedService/CoreClaimsDataLake.json"'
az synapse linked-service create --workspace-name $workspaceName --name CoreClaimsCosmosDb$suffix --file '@"linkedService/CoreClaimsCosmosDb.json"'
az synapse linked-service create --workspace-name $workspaceName --name solliancepublicdata$suffix --file '@"linkedService/solliancepublicdata.json"'

$datasets = Get-ChildItem ./dataset
foreach ($dataset in $datasets) {
    $name = $dataset.BaseName
    az synapse dataset create --workspace-name $workspaceName --name "${name}${suffix}" --file "@""./dataset/$dataset"
}

az synapse pipeline create --workspace-name $workspaceName --file '@"pipeline/Initial-Ingestion.json"' --name Initial-Ingestion$suffix

Pop-Location
Pop-Location
