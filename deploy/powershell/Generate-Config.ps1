Param(
    [parameter(Mandatory=$true)][string]$resourceGroup,
    [parameter(Mandatory=$true)][string]$suffix,
    [parameter(Mandatory=$false)][string[]]$outputFile=$null,
    [parameter(Mandatory=$false)][string[]]$gvaluesTemplate="..,..,gvalues.template.yml",
    [parameter(Mandatory=$false)][string[]]$dockerComposeTemplate="..,..,docker-compose.template.yml",
    [parameter(Mandatory=$false)][string]$ingressClass="addon-http-application-routing",
    [parameter(Mandatory=$false)][string]$domain
)

function EnsureAndReturnFirstItem($arr, $restype) {
    if (-not $arr -or $arr.Length -ne 1) {
        Write-Host "Fatal: No $restype found (or found more than one)" -ForegroundColor Red
        exit 1
    }

    return $arr[0]
}

# Check the rg
$rg=$(az group show -n $resourceGroup -o json | ConvertFrom-Json)

if (-not $rg) {
    Write-Host "Fatal: Resource group not found" -ForegroundColor Red
    exit 1
}

### Getting Resources
$tokens=@{}

## Getting Datalake info
$dataLakeEndpoint=$(az storage account list -g $resourceGroup -o json | ConvertFrom-Json)[0].primaryEndpoints.dfs
$dataLakeAccountName=$(az storage account list -g $resourceGroup -o json | ConvertFrom-Json)[0].name

## Getting Function App info
$functionAppHostname=$(az functionapp list -g $resourceGroup -o json | ConvertFrom-Json).hostNames

## Getting CosmosDb info
$docdb=$(az cosmosdb list -g $resourceGroup --query "[?kind=='GlobalDocumentDB'].{name: name, kind:kind, documentEndpoint:documentEndpoint}" -o json | ConvertFrom-Json)
$docdb=EnsureAndReturnFirstItem $docdb "CosmosDB (Document Db)"
Write-Host "Document Db Account: $($docdb.name)" -ForegroundColor Yellow

## Getting EventHub info
$eventHubName=$(az eventhubs namespace list -g $resourceGroup -o json | ConvertFrom-Json).name
$eventHubKey=$(az eventhubs namespace authorization-rule keys list -g $resourceGroup --namespace-name $eventHubName --name RootManageSharedAccessKey -o json --query primaryKey | ConvertFrom-Json)

## Getting App Insights instrumentation key, if required
$appinsightsId=@()
$appInsightsName=$(az resource list -g $resourceGroup --resource-type Microsoft.Insights/components --query [].name | ConvertFrom-Json)
if ($appInsightsName -and $appInsightsName.Length -eq 1) {
    $appinsightsConfig=$(az monitor app-insights component show --app $appInsightsName -g $resourceGroup -o json | ConvertFrom-Json)

    if ($appinsightsConfig) {
        $appinsightsId = $appinsightsConfig.instrumentationKey           
        $appinsightsConnectionString = $appinsightsConfig.connectionString 
    }
}
Write-Host "App Insights Instrumentation Key: $appinsightsId" -ForegroundColor Yellow

## Getting OpenAI info
$openAi=$(az cognitiveservices account list -g $resourceGroup --query "[?kind=='OpenAI'].{name: name, kind:kind, endpoint: properties.endpoint}" -o json | ConvertFrom-Json)

$openAiKey=$(az cognitiveservices account keys list -g $resourceGroup -n $openAi.name -o json --query key1 | ConvertFrom-Json)

$openAiDeployment = "completions"

$apiIdentityClientId=$(az identity show -g $resourceGroup -n mi-api-coreclaims-$suffix -o json | ConvertFrom-Json).clientId
$workerIdentityClientId=$(az identity show -g $resourceGroup -n mi-worker-coreclaims-$suffix -o json | ConvertFrom-Json).clientId
$tenantId=$(az account show --query homeTenantId --output tsv)
## Showing Values that will be used

Write-Host "===========================================================" -ForegroundColor Yellow
Write-Host "settings.json files will be generated with values:"

$tokens.suffix=$suffix
$tokens.cosmosEndpoint=$docdb.documentEndpoint
$tokens.dataLakeEndpoint=$dataLakeEndpoint
$tokens.dataLakeAccountName=$dataLakeAccountName
$tokens.eventHubKey=$eventHubKey
$tokens.openAiEndpoint=$openAi.endpoint
$tokens.openAiKey=$openAiKey
$tokens.openAiCompletionsDeployment=$openAiDeployment
$tokens.apiClientId=$apiIdentityClientId
$tokens.workerClientId=$workerIdentityClientId
$tokens.tenantId=$tenantId
$tokens.aiConnectionString=$appinsightsConnectionString

# Standard fixed tokens
$tokens.ingressclass=$ingressClass
$tokens.ingressrewritepath="(/|$)(.*)"
$tokens.ingressrewritetarget="`$2"

if($ingressClass -eq "nginx") {
    $tokens.ingressrewritepath="(/|$)(.*)" 
    $tokens.ingressrewritetarget="`$2"
}

Write-Host ($tokens | ConvertTo-Json) -ForegroundColor Yellow
Write-Host "===========================================================" -ForegroundColor Yellow

Push-Location $($MyInvocation.InvocationName | Split-Path)
$gvaluesTemplatePath=$(./Join-Path-Recursively -pathParts $gvaluesTemplate.Split(","))
Write-Host $gvaluesTemplatePath
$outputFilePath=$(./Join-Path-Recursively -pathParts $outputFile.Split(","))
Write-Host $outputFilePath
& ./Token-Replace.ps1 -inputFile $gvaluesTemplatePath -outputFile $outputFilePath -tokens $tokens
Pop-Location

Push-Location $($MyInvocation.InvocationName | Split-Path)
$dockerComposeTemplatePath=$(./Join-Path-Recursively -pathParts $dockerComposeTemplate.Split(","))
$outputFilePath=$(./Join-Path-Recursively -pathParts ..,..,docker-compose.yml)
& ./Token-Replace.ps1 -inputFile $dockerComposeTemplatePath -outputFile $outputFilePath -tokens $tokens
Pop-Location

$publisherSettingsTemplate="..,..,src,CoreClaims.Publisher,settings.template.json"
$publisherSettings="..,..,src,CoreClaims.Publisher,settings.json"
Push-Location $($MyInvocation.InvocationName | Split-Path)
$publisherSettingsTemplatePath=$(./Join-Path-Recursively -pathParts $publisherSettingsTemplate.Split(","))
$publisherSettingsPath=$(./Join-Path-Recursively -pathParts $publisherSettings.Split(","))
& ./Token-Replace.ps1 -inputFile $publisherSettingsTemplatePath -outputFile $publisherSettingsPath -tokens $tokens
Pop-Location

$functionappSettingsTemplate="..,..,src,CoreClaims.FunctionApp,local.settings.template.json"
$functionappSettings="..,..,src,CoreClaims.FunctionApp,local.settings.json"
Push-Location $($MyInvocation.InvocationName | Split-Path)
$functionappSettingsTemplatePath=$(./Join-Path-Recursively -pathParts $functionappSettingsTemplate.Split(","))
$functionappSettingsPath=$(./Join-Path-Recursively -pathParts $functionappSettings.Split(","))
& ./Token-Replace.ps1 -inputFile $functionappSettingsTemplatePath -outputFile $functionappSettingsPath -tokens $tokens
Pop-Location

$coreClaimsDatalakeTemplate="..,..,synapse,linkedService,CoreClaimsDataLake.template.json"
$coreClaimsDatalake="..,..,synapse,linkedService,CoreClaimsDataLake.json"
Push-Location $($MyInvocation.InvocationName | Split-Path)
$coreClaimsDatalakeTemplatePath=$(./Join-Path-Recursively -pathParts $coreClaimsDatalakeTemplate.Split(","))
$coreClaimsDatalakePath=$(./Join-Path-Recursively -pathParts $coreClaimsDatalake.Split(","))
& ./Token-Replace.ps1 -inputFile $coreClaimsDatalakeTemplatePath -outputFile $coreClaimsDatalakePath -tokens $tokens
Pop-Location

$coreClaimsCosmosDbTemplate="..,..,synapse,linkedService,CoreClaimsCosmosDb.template.json"
$coreClaimsCosmosDb="..,..,synapse,linkedService,CoreClaimsCosmosDb.json"
Push-Location $($MyInvocation.InvocationName | Split-Path)
$coreClaimsCosmosDbTemplatePath=$(./Join-Path-Recursively -pathParts $coreClaimsCosmosDbTemplate.Split(","))
$coreClaimsCosmosDbPath=$(./Join-Path-Recursively -pathParts $coreClaimsCosmosDb.Split(","))
& ./Token-Replace.ps1 -inputFile $coreClaimsCosmosDbTemplatePath -outputFile $coreClaimsCosmosDbPath -tokens $tokens
Pop-Location

$siteSettingsTemplate="..,..,ui,medical-claims-ui,env.template"
$siteSettings="..,..,ui,medical-claims-ui,.env.local"
Push-Location $($MyInvocation.InvocationName | Split-Path)
$siteSettingsTemplatePath=$(./Join-Path-Recursively -pathParts $siteSettingsTemplate.Split(","))
$siteSettingsPath=$(./Join-Path-Recursively -pathParts $siteSettings.Split(","))
& ./Token-Replace.ps1 -inputFile $siteSettingsTemplatePath -outputFile $siteSettingsPath -tokens $tokens
Pop-Location
