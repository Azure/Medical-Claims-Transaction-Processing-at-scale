#!/usr/bin/pwsh

Param(
    [parameter(Mandatory=$true)][string]$resourceGroup,
    [parameter(Mandatory=$true)][string]$location,
    [parameter(Mandatory=$true)][string]$subscription,
    [parameter(Mandatory=$true)][string]$suffix="demo",
    [parameter(Mandatory=$false)][bool]$stepDeployBicep=$true,
    [parameter(Mandatory=$false)][bool]$stepPublishFunctionApp=$true,
    [parameter(Mandatory=$false)][bool]$stepSetupSynapse=$true,
    [parameter(Mandatory=$false)][bool]$stepLoginAzure=$true
)

Push-Location $($MyInvocation.InvocationName | Split-Path)

if ($stepLoginAzure) {
    az login
}

az account set --subscription $subscription

if ($stepDeployBicep) {
    & ./Deploy-Bicep.ps1 -resourceGroup $resourceGroup -location $location -suffix $suffix
}

& ./Generate-Config.ps1 -resourceGroup $resourceGroup

if ($stepPublishFunctionApp) {
    & ./Publish-FunctionApp.ps1 -resourceGroup $resourceGroup -functionAppPath "..,..,src,CoreClaims.FunctionApp"
}

if ($stepSetupSynapse) {
    & ./Setup-Synapse.ps1 -resourceGroup $resourceGroup
}

Pop-Location