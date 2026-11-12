#!/usr/bin/pwsh

Param(
    [parameter(Mandatory=$true)][string]$resourceGroup,
    [parameter(Mandatory=$true)][string]$location,
    [parameter(Mandatory=$true)][string]$suffix,
    [parameter(Mandatory=$false)][string]$openAiName='',
    [parameter(Mandatory=$false)][string]$openAiRg='',
    [parameter(Mandatory=$false)][string]$openAiCompletionsDeployment='completions',
    [parameter(Mandatory=$true)][bool]$deployAks
)

Push-Location $($MyInvocation.InvocationName | Split-Path)
$sourceFolder=$(Join-Path -Path ../.. -ChildPath infrastructure)

$env:BICEP_RESOURCE_TYPED_PARAMS_AND_OUTPUTS_EXPERIMENTAL="true"
$rg = $(az group show -n $resourceGroup -o json 2>$null | ConvertFrom-Json)
if (-not $rg) {
    Write-Host "Creating resource group $resourceGroup in $location" -ForegroundColor Yellow
    az group create -n $resourceGroup -l $location --only-show-errors | Out-Null
}

# Get current user's principal ID for storage permissions
$currentUser = az ad signed-in-user show --query id -o tsv 2>$null

Push-Location $sourceFolder

$script = if ($deployAks) { "aksmain.bicep" } else { "acamain.bicep" }
$infraType = if ($deployAks) { "AKS" } else { "ACA" }

Write-Host "Deploying $infraType infrastructure..." -ForegroundColor White

# Build parameters array
$paramArgs = @(
    "suffix=$suffix",
    "deployerPrincipalId=$currentUser"
)

# Add OpenAI parameters only if provided
if ($openAiName) { $paramArgs += "openAiName=$openAiName" }
if ($openAiRg) { $paramArgs += "openAiRg=$openAiRg" }
if ($openAiCompletionsDeployment) { $paramArgs += "openAiDeployment=$openAiCompletionsDeployment" }

Write-Host "Running Bicep deployment (this may take several minutes)..." -ForegroundColor Gray
$deploymentResult = az deployment group create -g $resourceGroup --template-file $script --parameters $paramArgs --only-show-errors 2>&1

$deploymentState = $(az deployment group show -g $resourceGroup -n $script.Replace('.bicep','') --query "properties.provisioningState" -o tsv 2>$null)

if ($deploymentState -eq 'Succeeded') {
    Write-Host "Bicep deployment: $deploymentState" -ForegroundColor Green
} else {
    Write-Host "Bicep deployment: $deploymentState" -ForegroundColor Red
    Write-Host "Error details:" -ForegroundColor Red
    $deploymentResult | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    exit 1
}

Pop-Location
Pop-Location