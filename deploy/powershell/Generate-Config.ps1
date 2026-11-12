Param(
    [parameter(Mandatory=$true)][string]$resourceGroup,
    [parameter(Mandatory=$true)][string]$suffix,
    [parameter(Mandatory=$false)][string[]]$outputFile=$null,
    [parameter(Mandatory=$false)][string[]]$gvaluesTemplate="..,..,gvalues.template.yml",
    [parameter(Mandatory=$false)][string]$ingressClass="addon-http-application-routing",
    [parameter(Mandatory=$true)][bool]$deployAks
)

# Get deployment name from target
$deploymentName = if ($deployAks) { "aksmain" } else { "acamain" }

Write-Host "Retrieving deployment outputs..." -ForegroundColor Gray

# Get all config from Bicep outputs (eliminates individual az cli calls)
$bicepConfig = $(az deployment group show -g $resourceGroup -n $deploymentName --query "properties.outputs.config.value" -o json 2>$null | ConvertFrom-Json)

if (-not $bicepConfig) {
    Write-Host "Fatal: Could not retrieve Bicep deployment outputs from $deploymentName" -ForegroundColor Red
    Write-Host "Ensure the deployment completed successfully" -ForegroundColor Yellow
    exit 1
}

Write-Host "Retrieving additional resources..." -ForegroundColor Gray

# Get OpenAI info from Bicep outputs (may be in external RG)
$openAiName = $bicepConfig.openAiName
$openAiRg = $bicepConfig.openAiRg
$openAi = $(az cognitiveservices account show -g $openAiRg -n $openAiName -o json 2>$null | ConvertFrom-Json)
if (-not $openAi) {
    Write-Host "Warning: OpenAI account '$openAiName' not found in resource group '$openAiRg'" -ForegroundColor Yellow
}

# Get App Insights connection string (if needed for AKS)
$appInsightsName = $(az resource list -g $resourceGroup --resource-type Microsoft.Insights/components --query "[0].name" -o tsv 2>$null)
$aiConnectionString = ""
if ($appInsightsName) {
    $aiConnectionString = $(az monitor app-insights component show --app $appInsightsName -g $resourceGroup --query "connectionString" -o tsv 2>$null)
}

# Get webapp hostname (deployment-specific)
if ($deployAks) {
    $aksName = $(az aks list -g $resourceGroup -o json 2>$null | ConvertFrom-Json).name
    $webappHostname = $(az aks show -n $aksName -g $resourceGroup --query "addonProfiles.httpApplicationRouting.config.HTTPApplicationRoutingZoneName" -o tsv 2>$null)
} else {
    $webappHostname = $(az containerapp show -n "aca-api-coreclaims-$suffix" -g $resourceGroup --query "properties.configuration.ingress.fqdn" -o tsv 2>$null)
}
$apiUrl = "https://${webappHostname}/api"

## Build tokens from Bicep outputs + additional resources
$tokens = @{}
$tokens.suffix = $bicepConfig.suffix
$tokens.cosmosEndpoint = $bicepConfig.cosmosEndpoint
$tokens.eventHubNamespace = $bicepConfig.eventHubNamespace
$tokens.openAiEndpoint = $openAi.properties.endpoint
$tokens.openAiCompletionsDeployment = $bicepConfig.openAiCompletionsDeployment
$tokens.aiConnectionString = if ($bicepConfig.aiConnectionString) { $bicepConfig.aiConnectionString } else { $aiConnectionString }
$tokens.apiUrl = $apiUrl

# Standard fixed tokens
$tokens.ingressclass = $ingressClass
$tokens.ingressrewritepath = if ($ingressClass -eq "nginx") { "(.*)" } else { "(.*)" }
$tokens.ingressrewritetarget = "`$1"

Write-Host "===========================================================" -ForegroundColor Yellow
Write-Host "Configuration values:" -ForegroundColor Yellow
Write-Host ($tokens | ConvertTo-Json) -ForegroundColor Yellow
Write-Host "===========================================================" -ForegroundColor Yellow

Push-Location $($MyInvocation.InvocationName | Split-Path)

# Generate all configuration files
$configFiles = @(
    @{ template = $gvaluesTemplate; output = $outputFile; name = "gvalues" }
    @{ template = "..,..,src,CoreClaims.Publisher,settings.template.json"; output = "..,..,src,CoreClaims.Publisher,settings.json"; name = "Publisher settings" }
    @{ template = "..,..,src,CoreClaims.WebAPI,appsettings.Development.template.json"; output = "..,..,src,CoreClaims.WebAPI,appsettings.Development.json"; name = "WebAPI settings" }
    @{ template = "..,..,src,CoreClaims.WorkerService,appsettings.Development.template.json"; output = "..,..,src,CoreClaims.WorkerService,appsettings.Development.json"; name = "WorkerService settings" }
    @{ template = "..,..,ui,medical-claims-ui,env.template"; output = "..,..,ui,medical-claims-ui,.env.local"; name = "UI env" }
)

foreach ($config in $configFiles) {
    Write-Host "Generating $($config.name)..." -ForegroundColor Gray
    $templatePath = $(./Join-Path-Recursively -pathParts $config.template.Split(","))
    $outputPath = $(./Join-Path-Recursively -pathParts $config.output.Split(","))
    & ./Token-Replace.ps1 -inputFile $templatePath -outputFile $outputPath -tokens $tokens
}

Pop-Location

Write-Host "✓ Configuration files generated successfully" -ForegroundColor Green
