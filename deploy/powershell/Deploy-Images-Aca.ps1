#! /usr/bin/pwsh

Param(
    [parameter(Mandatory=$false)][string]$resourceGroup,
    [parameter(Mandatory=$false)][string]$acrName,
    [parameter(Mandatory=$false)][string]$acrResourceGroup=$resourceGroup,
    [parameter(Mandatory=$true)][string]$suffix,
    [parameter(Mandatory=$false)][string]$tag="latest"
)

function validate {
    $valid = $true

    if ([string]::IsNullOrEmpty($resourceGroup))  {
        Write-Host "No resource group. Use -resourceGroup to specify resource group." -ForegroundColor Red
        $valid=$false
    }

    if ([string]::IsNullOrEmpty($acrLogin))  {
        Write-Host "ACR login server can't be found. Are you using right ACR ($acrName) and RG ($resourceGroup)?" -ForegroundColor Red
        $valid=$false
    }

    if ($valid -eq $false) {
        exit 1
    }
}

Write-Host "--------------------------------------------------------" -ForegroundColor Yellow
Write-Host " Deploying images on Aca"  -ForegroundColor Yellow
Write-Host " "  -ForegroundColor Yellow
Write-Host " Additional parameters are:"  -ForegroundColor Yellow
Write-Host " Images tag: $tag"  -ForegroundColor Yellow
Write-Host " --------------------------------------------------------" 

if ($acrName -ne "bydtochatgptcr") {
    $acrLogin=$(az acr show -n $acrName -g $acrResourceGroup -o json| ConvertFrom-Json).loginServer
    Write-Host "acr login server is $acrLogin" -ForegroundColor Yellow
}
else {
    $acrLogin="bydtochatgptcr.azurecr.io"
}

validate

Push-Location $($MyInvocation.InvocationName | Split-Path)

Write-Host "Deploying images..." -ForegroundColor Yellow

Write-Host "API deployment - api" -ForegroundColor Yellow
$command = "az containerapp update --name aca-api-coreclaims-${suffix} --resource-group $resourceGroup --image $acrLogin/claims-api:$tag"
Invoke-Expression "$command"

Write-Host "Webapp deployment - worker" -ForegroundColor Yellow
$command = "az containerapp update --name aca-worker-coreclaims-${suffix} --resource-group $resourceGroup --image $acrLogin/claims-worker:$tag"
Invoke-Expression "$command"

Pop-Location

Write-Host "Microservices deployed to ACA" -ForegroundColor Yellow