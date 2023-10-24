#!/usr/bin/pwsh

Param(
    [parameter(Mandatory=$true)][string]$resourceGroup,
    [parameter(Mandatory=$true)][string]$location,
    [parameter(Mandatory=$true)][string]$subscription,
    [parameter(Mandatory=$false)][string]$acrName=$null,
    [parameter(Mandatory=$false)][string]$suffix,
    [parameter(Mandatory=$false)][string]$openAiName=$null,
    [parameter(Mandatory=$false)][string]$openAiRg=$null,
    [parameter(Mandatory=$false)][string]$openAiCompletionsDeployment=$null,
    [parameter(Mandatory=$false)][bool]$deployAks=$false,
    [parameter(Mandatory=$false)][bool]$stepDeployOpenAi=$true,
    [parameter(Mandatory=$false)][bool]$stepDeployBicep=$true,
    [parameter(Mandatory=$false)][bool]$stepBuildPush=$true,
    [parameter(Mandatory=$false)][bool]$stepDeployCertManager=$true,
    [parameter(Mandatory=$false)][bool]$stepDeployTls=$true,
    [parameter(Mandatory=$false)][bool]$stepDeployImages=$true,
    [parameter(Mandatory=$false)][bool]$stepSetupSynapse=$true,
    [parameter(Mandatory=$false)][bool]$stepPublishSite=$true,
    [parameter(Mandatory=$false)][bool]$stepLoginAzure=$true
)

az extension add --name  application-insights
az extension update --name  application-insights

az extension add --name storage-preview
az extension update --name storage-preview

winget install --id=Kubernetes.kubectl  -e --accept-package-agreements --accept-source-agreements --silent
winget install --id=Microsoft.Azure.Kubelogin  -e --accept-package-agreements --accept-source-agreements --silent

az extension add --name containerapp
az extension update --name containerapp

$gValuesFile="configFile.yaml"

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

$rg = $(az group show -g $resourceGroup -o json | ConvertFrom-Json)
if (-not $rg) {
    $rg=$(az group create -g $resourceGroup -l $location --subscription $subscription)
}

if ($stepDeployOpenAi) {
    if (-not $openAiRg) {
        $openAiRg=$resourceGroup
    }

    if (-not $openAiName) {
        $openAiName = "openai-$($suffix)"
    }

    if (-not $openAiCompletionsDeployment) {
        $openAiCompletionsDeployment = "completions"
    }

    & ./Deploy-OpenAi.ps1 -name $openAiName -resourceGroup $openAiRg -location $location -completionsDeployment $openAiCompletionsDeployment
}

## Getting OpenAI info
if ($openAiName) {
    $openAi=$(az cognitiveservices account show -n $openAiName -g $openAiRg -o json | ConvertFrom-Json)
} else {
    $openAi=$(az cognitiveservices account list -g $resourceGroup -o json | ConvertFrom-Json)
    $openAiRg=$resourceGroup
}

$openAiKey=$(az cognitiveservices account keys list -g $openAiRg -n $openAi.name -o json --query key1 | ConvertFrom-Json)

if ($stepDeployBicep) {
    & ./Deploy-Bicep.ps1 -resourceGroup $resourceGroup -location $location -suffix $suffix -openAiName $openAiName -openAiCompletionsDeployment $openAiCompletionsDeployment -openAiRg $openAiRg -deployAks $deployAks
}

if ($deployAks)
{
    # Connecting kubectl to AKS
    Write-Host "Retrieving Aks Name" -ForegroundColor Yellow
    $aksName = $(az aks list -g $resourceGroup -o json | ConvertFrom-Json).name
    Write-Host "The name of your AKS: $aksName" -ForegroundColor Yellow

    # Write-Host "Retrieving credentials" -ForegroundColor Yellow
    az aks get-credentials -n $aksName -g $resourceGroup --overwrite-existing --admin
}
# Generate Config
New-Item -ItemType Directory -Force -Path $(./Join-Path-Recursively.ps1 -pathParts ..,..,__values)
$gValuesLocation=$(./Join-Path-Recursively.ps1 -pathParts ..,..,__values,$gValuesFile)
& ./Generate-Config.ps1 -resourceGroup $resourceGroup -suffix $suffix -outputFile $gValuesLocation -openAiName $openAiName -openAiCompletionsDeployment $openAiCompletionsDeployment -openAiRg $openAiRg -deployAks $deployAks

# Create Secrets
if ([string]::IsNullOrEmpty($acrName))
{
    $acrName = $(az acr list --resource-group $resourceGroup -o json | ConvertFrom-Json).name
}

Write-Host "The Name of your ACR: $acrName" -ForegroundColor Yellow

if ($deployAks -And $stepDeployCertManager) {
    # Deploy Cert Manager
    & ./DeployCertManager.ps1
}

if ($deployAks -And $stepDeployTls) {
    # Deploy TLS
    & ./DeployTlsSupport.ps1 -sslSupport prod -resourceGroup $resourceGroup -aksName $aksName
}

if ($stepBuildPush) {
    # Build an Push
    & ./BuildPush.ps1 -resourceGroup $resourceGroup -acrName $acrName
}

if ($stepDeployImages) {
    # Deploy images in AKS
    $gValuesLocation=$(./Join-Path-Recursively.ps1 -pathParts ..,..,__values,$gValuesFile)
    $chartsToDeploy = "*"

    if ($deployAks) {
        & ./Deploy-Images-Aks.ps1 -aksName $aksName -resourceGroup $resourceGroup -charts $chartsToDeploy -acrName $acrName -valuesFile $gValuesLocation
    }
    else
    {
        & ./Deploy-Images-Aca.ps1 -resourceGroup $resourceGroup -acrName $acrName -suffix $suffix
    }
}

if ($stepSetupSynapse) {
    & ./Setup-Synapse.ps1 -resourceGroup $resourceGroup
}

if ($stepPublishSite) {
    & ./Publish-Site.ps1 -resourceGroup $resourceGroup -storageAccount "webcoreclaims$suffix"
}

Pop-Location