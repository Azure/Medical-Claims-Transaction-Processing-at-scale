#!/usr/bin/pwsh

Param(
    [parameter(Mandatory=$false)][string]$acrName="bydtochatgptcr",
    [parameter(Mandatory=$false)][string]$acrResourceGroup="ms-byd-to-chatgpt",
    [parameter(Mandatory=$true)][string]$resourceGroup,
    [parameter(Mandatory=$true)][string]$location,
    [parameter(Mandatory=$true)][string]$subscription,
    [parameter(Mandatory=$false)][string]$openAiName,
    [parameter(Mandatory=$false)][string]$openAiRg,
    [parameter(Mandatory=$false)][string]$openAiDeployment,
    [parameter(Mandatory=$false)][string]$suffix,
    [parameter(Mandatory=$false)][string]$synapseWorkspace,
    [parameter(Mandatory=$false)][bool]$stepDeployBicep=$true,
    [parameter(Mandatory=$false)][bool]$stepDeployOpenAi=$true,
    [parameter(Mandatory=$false)][bool]$stepBuildImages=$false,
    [parameter(Mandatory=$false)][bool]$stepPushImages=$false,
    [parameter(Mandatory=$false)][bool]$stepDeployCertManager=$true,
    [parameter(Mandatory=$false)][bool]$stepDeployTls=$true,
    [parameter(Mandatory=$false)][bool]$stepDeployImages=$true,
    [parameter(Mandatory=$false)][bool]$stepSetupSynapse=$true,
    [parameter(Mandatory=$false)][bool]$stepPublishSite=$true,
    [parameter(Mandatory=$false)][bool]$stepLoginAzure=$true
)

# Update the extension to make sure you have the latest version installed
az extension add --name aks-preview
az extension update --name aks-preview

az extension add --name  application-insights
az extension update --name  application-insights

az extension add --name storage-preview
az extension update --name storage-preview

Push-Location $($MyInvocation.InvocationName | Split-Path)

if (-not $suffix) {
    $crypt = New-Object -TypeName System.Security.Cryptography.SHA256Managed
    $utf8 = New-Object -TypeName System.Text.UTF8Encoding
    $hash = [System.BitConverter]::ToString($crypt.ComputeHash($utf8.GetBytes($resourceGroup)))
    $hash = $hash.replace('-','').toLower()
    $suffix = $hash.Substring(0,5)
}

Write-Host "Resource suffix is $suffix" -ForegroundColor Yellow

if ($stepLoginAzure) {
    az login
}

az account set --subscription $subscription

if ($stepDeployOpenAi) {
    if (-not $openAiName) {
        $openAiName="openai-$suffix"
    }

    if (-not $openAiRg) {
        $openAiRg=$resourceGroup
    }

    & ./Deploy-OpenAi.ps1 -name $openAiName -resourceGroup $openAiRg -location $location -suffix $suffix -deployment $openAiDeployment
}

if ($stepDeployBicep) {
    & ./Deploy-Bicep.ps1 -resourceGroup $resourceGroup -location $location -suffix $suffix -openAiName $openAiName -openAiRg $openAiRg -openAiDeployment $openAiDeployment
}

# Connecting kubectl to AKS
Write-Host "Retrieving Aks Name" -ForegroundColor Yellow
$aksName = $(az aks list -g $resourceGroup -o json | ConvertFrom-Json).name
Write-Host "The name of your AKS: $aksName" -ForegroundColor Yellow

# Write-Host "Retrieving credentials" -ForegroundColor Yellow
az aks get-credentials -n $aksName -g $resourceGroup --overwrite-existing

# Generate Config
New-Item -ItemType Directory -Force -Path $(./Join-Path-Recursively.ps1 -pathParts ..,__values)
$gValuesLocation=$(./Join-Path-Recursively.ps1 -pathParts ..,__values,$gValuesFile)
& ./Generate-Config.ps1 -resourceGroup $resourceGroup -suffix $suffix -openAiName $openAiName -openAiRg $openAiRg -openAiDeployment $openAiDeployment

# Create Secrets
if ([string]::IsNullOrEmpty($acrName))
{
    $acrName = $(az acr list --resource-group $resourceGroup -o json | ConvertFrom-Json).name
}

Write-Host "The Name of your ACR: $acrName" -ForegroundColor Yellow
# & ./Create-Secret.ps1 -resourceGroup $resourceGroup -acrName $acrName
# az aks update -n $aksName -g $resourceGroup --attach-acr $acrName

if ($stepDeployCertManager) {
    # Deploy Cert Manager
    & ./DeployCertManager.ps1
}

if ($stepDeployTls) {
    # Deploy TLS
    & ./DeployTlsSupport.ps1 -sslSupport prod -resourceGroup $resourceGroup -aksName $aksName
}

if ($stepBuildImages) {
    # Build
    & ./BuildImages.ps1 -resourceGroup $acrResourceGroup -acrName $acrName
}

if ($stepPushImages) {
    # Push
    & ./PushImages.ps1 -resourceGroup $acrResourceGroup -acrName $acrName
}

if ($stepDeployImages) {
    # Deploy images in AKS
    $gValuesLocation=$(./Join-Path-Recursively.ps1 -pathParts ..,__values,$gValuesFile)
    $chartsToDeploy = "*"
    & ./Deploy-Images-Aks.ps1 -aksName $aksName -resourceGroup $resourceGroup -charts $chartsToDeploy -acrName $acrName -acrResourceGroup $acrResourceGroup -valuesFile $gValuesLocation
}

if ($stepPublishFunctionApp) {
    & ./Publish-FunctionApp.ps1 -resourceGroup $resourceGroup -projectName "CoreClaims.FunctionApp"
}

if ($stepSetupSynapse) {
    & ./Setup-Synapse.ps1 -resourceGroup $resourceGroup
}

if ($stepPublishSite) {
    & ./Publish-Site.ps1 -resourceGroup $resourceGroup -storageAccount "webcoreclaims$suffix"
}

Pop-Location