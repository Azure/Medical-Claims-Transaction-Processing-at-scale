#!/usr/bin/pwsh

Param(
    [parameter(Mandatory=$true)][string]$resourceGroup,
    [parameter(Mandatory=$true)][string]$location,
    [parameter(Mandatory=$true)][string]$subscription,
    [parameter(Mandatory=$false)][string]$acrName=$null,
    [parameter(Mandatory=$false)][string]$suffix,
    [parameter(Mandatory=$false)][string]$openAiName=$null,
    [parameter(Mandatory=$false)][string]$openAiRg=$null,
    [parameter(Mandatory=$false)][string]$openAiCompletionsDeployment="completions",
    [parameter(Mandatory=$false)][bool]$deployAks=$false,
    [parameter(Mandatory=$false)][bool]$stepDeployBicep=$true,
    [parameter(Mandatory=$false)][bool]$stepBuildPush=$true,
    [parameter(Mandatory=$false)][bool]$stepDeployCertManager=$true,
    [parameter(Mandatory=$false)][bool]$stepDeployTls=$true,
    [parameter(Mandatory=$false)][bool]$stepDeployImages=$true,
    [parameter(Mandatory=$false)][bool]$stepPublishSite=$true,
    [parameter(Mandatory=$false)][bool]$stepLoginAzure=$true
)

# Install Azure CLI extensions (skip update check for speed)
Write-Host "`n=== INITIALIZING DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host "Checking Azure CLI extensions..." -ForegroundColor Gray
$extensions = @('application-insights', 'storage-preview', 'containerapp')
$installedExtensions = (az extension list --query "[].name" -o tsv 2>$null)
$toInstall = $extensions | Where-Object { $installedExtensions -notcontains $_ }
if ($toInstall.Count -gt 0) {
    Write-Host "  Installing: $($toInstall -join ', ')" -ForegroundColor Yellow
    foreach ($ext in $toInstall) {
        az extension add --name $ext --only-show-errors 2>$null | Out-Null
    }
}

# Install kubectl and kubelogin only if deploying to AKS
if ($deployAks) {
    Write-Host "Checking Kubernetes tools..." -ForegroundColor Gray
    winget install --id=Kubernetes.kubectl -e --accept-package-agreements --accept-source-agreements --silent --disable-interactivity 2>$null | Out-Null
    winget install --id=Microsoft.Azure.Kubelogin -e --accept-package-agreements --accept-source-agreements --silent --disable-interactivity 2>$null | Out-Null
}

$gValuesFile="configFile.yaml"

Push-Location $($MyInvocation.InvocationName | Split-Path)

if (-not $suffix) {
    $crypt = New-Object -TypeName System.Security.Cryptography.SHA256Managed
    $utf8 = New-Object -TypeName System.Text.UTF8Encoding
    $hash = [System.BitConverter]::ToString($crypt.ComputeHash($utf8.GetBytes($resourceGroup)))
    $hash = $hash.replace('-','').toLower()
    $suffix = $hash.Substring(0,5)
}

Write-Host "`n=== DEPLOYMENT CONFIGURATION ===" -ForegroundColor Cyan
Write-Host "Resource Group: $resourceGroup" -ForegroundColor White
Write-Host "Location: $location" -ForegroundColor White
Write-Host "Suffix: $suffix" -ForegroundColor White

if ($stepLoginAzure) {
    Write-Host "`nAuthenticating..." -ForegroundColor Gray
    az login --only-show-errors | Out-Null
}

az account set --subscription $subscription 2>$null

$rg = $(az group show -g $resourceGroup -o json 2>$null | ConvertFrom-Json)
if (-not $rg) {
    Write-Host "Creating resource group..." -ForegroundColor Yellow
    $rg=$(az group create -g $resourceGroup -l $location --subscription $subscription --only-show-errors | ConvertFrom-Json)
}

if ($openAiName) {
    $openAiDisplay = if ($openAiRg -and $openAiRg -ne $resourceGroup) { "$openAiName ($openAiRg)" } else { "$openAiName" }
    Write-Host "OpenAI: $openAiDisplay - Deployment: $openAiCompletionsDeployment" -ForegroundColor White
} else {
    Write-Host "OpenAI: will be created..." -ForegroundColor White
}

# Calculate total steps based on deployment mode
$totalSteps = if ($deployAks) { 7 } else { 5 }
$currentStep = 0

if ($stepDeployBicep) {
    $currentStep++
    Write-Host "`n=== [$currentStep/$totalSteps] DEPLOYING INFRASTRUCTURE ===" -ForegroundColor Cyan
    $deployParams = @{
        resourceGroup = $resourceGroup
        location = $location
        suffix = $suffix
        openAiName = $openAiName
        openAiRg = $openAiRg
        openAiCompletionsDeployment = $openAiCompletionsDeployment
        deployAks = $deployAks
    }
    
    & ./Deploy-Bicep.ps1 @deployParams
    if ($LASTEXITCODE -ne 0) { Write-Host "❌ Infrastructure deployment failed" -ForegroundColor Red; exit 1 }
    Write-Host "✓ Infrastructure deployed" -ForegroundColor Green
}

if ($deployAks)
{
    Write-Host "`nConnecting to AKS..." -ForegroundColor Gray
    $aksName = $(az aks list -g $resourceGroup -o json 2>$null | ConvertFrom-Json).name
    az aks get-credentials -n $aksName -g $resourceGroup --overwrite-existing --admin --only-show-errors 2>$null | Out-Null
    Write-Host "✓ Connected to AKS: $aksName" -ForegroundColor Green
}

$currentStep++
Write-Host "`n=== [$currentStep/$totalSteps] GENERATING CONFIGURATION ===" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $(./Join-Path-Recursively.ps1 -pathParts ..,..,__values) | Out-Null
$gValuesLocation=$(./Join-Path-Recursively.ps1 -pathParts ..,..,__values,$gValuesFile)
$configParams = @{
    resourceGroup = $resourceGroup
    suffix = $suffix
    outputFile = $gValuesLocation
    deployAks = $deployAks
}

& ./Generate-Config.ps1 @configParams
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Configuration generation failed" -ForegroundColor Red; exit 1 }
Write-Host "✓ Configuration generated" -ForegroundColor Green

# Get ACR name
if ([string]::IsNullOrEmpty($acrName))
{
    $acrName = $(az acr list --resource-group $resourceGroup -o json 2>$null | ConvertFrom-Json).name
}

if ($deployAks -And $stepDeployCertManager) {
    $currentStep++
    Write-Host "`n=== [$currentStep/$totalSteps] DEPLOYING CERT MANAGER ===" -ForegroundColor Cyan
    & ./DeployCertManager.ps1
    if ($LASTEXITCODE -ne 0) { Write-Host "❌ Cert Manager deployment failed" -ForegroundColor Red; exit 1 }
    Write-Host "✓ Cert Manager deployed" -ForegroundColor Green
}

if ($deployAks -And $stepDeployTls) {
    $currentStep++
    Write-Host "`n=== [$currentStep/$totalSteps] DEPLOYING TLS SUPPORT ===" -ForegroundColor Cyan
    & ./DeployTlsSupport.ps1 -sslSupport prod -resourceGroup $resourceGroup -aksName $aksName
    if ($LASTEXITCODE -ne 0) { Write-Host "❌ TLS deployment failed" -ForegroundColor Red; exit 1 }
    Write-Host "✓ TLS support deployed" -ForegroundColor Green
}

if ($stepBuildPush) {
    $currentStep++
    Write-Host "`n=== [$currentStep/$totalSteps] BUILDING AND PUSHING IMAGES ===" -ForegroundColor Cyan
    Write-Host "ACR: $acrName" -ForegroundColor White
    & ./BuildPush.ps1 -resourceGroup $resourceGroup -acrName $acrName
    if ($LASTEXITCODE -ne 0) { Write-Host "❌ Build/Push failed" -ForegroundColor Red; exit 1 }
    Write-Host "✓ Images built and pushed" -ForegroundColor Green
}

if ($stepDeployImages) {
    $currentStep++
    Write-Host "`n=== [$currentStep/$totalSteps] DEPLOYING APPLICATION ===" -ForegroundColor Cyan
    $gValuesLocation=$(./Join-Path-Recursively.ps1 -pathParts ..,..,__values,$gValuesFile)
    $chartsToDeploy = "*"

    if ($deployAks) {
        & ./Deploy-Images-Aks.ps1 -aksName $aksName -resourceGroup $resourceGroup -charts $chartsToDeploy -acrName $acrName -valuesFile $gValuesLocation
    }
    else
    {
        & ./Deploy-Images-Aca.ps1 -resourceGroup $resourceGroup -acrName $acrName -suffix $suffix
    }
    if ($LASTEXITCODE -ne 0) { Write-Host "❌ Application deployment failed" -ForegroundColor Red; exit 1 }
    Write-Host "✓ Application deployed" -ForegroundColor Green
}

if ($stepPublishSite) {
    $currentStep++
    Write-Host "`n=== [$currentStep/$totalSteps] PUBLISHING STATIC WEBSITE ===" -ForegroundColor Cyan
    & ./Publish-Site.ps1 -resourceGroup $resourceGroup -storageAccount "webcoreclaims$suffix"
    if ($LASTEXITCODE -ne 0) { Write-Host "❌ Site publish failed" -ForegroundColor Red; exit 1 }
    Write-Host "✓ Website published" -ForegroundColor Green
}

Write-Host "`n=== DEPLOYMENT COMPLETED SUCCESSFULLY ===" -ForegroundColor Green

Pop-Location