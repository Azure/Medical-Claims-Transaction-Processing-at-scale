#!/usr/bin/pwsh

Param(
    [parameter(Mandatory=$true)][string]$resourceGroup,
    [parameter(Mandatory=$true)][string]$location,
    [parameter(Mandatory=$true)][string]$subscription,
    [parameter(Mandatory=$false)][string]$suffix,
    [parameter(Mandatory=$false)][string]$synapseWorkspace,
    [parameter(Mandatory=$false)][bool]$stepDeployBicep=$true,
    [parameter(Mandatory=$false)][bool]$stepPublishFunctionApp=$true,
    [parameter(Mandatory=$false)][bool]$stepSetupSynapse=$true,
    [parameter(Mandatory=$false)][bool]$stepPublishSite=$true,
    [parameter(Mandatory=$false)][bool]$stepLoginAzure=$true
)

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

if ($stepDeployBicep) {
    & ./Deploy-Bicep.ps1 -resourceGroup $resourceGroup -location $location -suffix $suffix
}

& ./Generate-Config.ps1 -resourceGroup $resourceGroup -suffix $suffix

if ($stepPublishFunctionApp) {
    & ./Publish-FunctionApp.ps1 -resourceGroup $resourceGroup -functionAppPath "..,..,src,CoreClaims.FunctionApp"
}

if ($stepSetupSynapse) {
    & ./Setup-Synapse.ps1 -resourceGroup $resourceGroup -synapseWorkspace $synapseWorkspace -suffix $suffix
}

if ($stepPublishSite) {
    & ./Publish-Site.ps1 -resourceGroup $resourceGroup -storageAccount "webcoreclaims$suffix"
}

Pop-Location