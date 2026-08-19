#!/usr/bin/pwsh
 
 Param(
    [parameter(Mandatory=$true)][string]$resourceGroup,
    [parameter(Mandatory=$true)][string]$storageAccount
 )

Push-Location $($MyInvocation.InvocationName | Split-Path)
Push-Location $(./Join-Path-Recursively.ps1 -pathParts "..,..,ui,medical-claims-ui".Split(","))

Write-Host "Building website..." -ForegroundColor Gray
if (Test-Path ./out) {
   Remove-Item -Path ./out -Recurse -Force 2>$null
}

$npmInstallResult = npm ci 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ npm ci failed" -ForegroundColor Red
    Write-Host "Error: $npmInstallResult" -ForegroundColor Red
    Pop-Location
    Pop-Location
    exit 1
}

$npmBuildResult = npm run build 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Build failed" -ForegroundColor Red
    Write-Host "Error: $npmBuildResult" -ForegroundColor Red
    Pop-Location
    Pop-Location
    exit 1
}
Write-Host "  ✓ Build completed" -ForegroundColor Green

Write-Host "Configuring storage account..." -ForegroundColor Gray
$configResult = az storage blob service-properties update `
    --account-name $storageAccount `
    --static-website `
    --index-document index.html `
    --404-document index.html `
    --auth-mode login `
    --only-show-errors 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Failed to enable static website" -ForegroundColor Red
    Write-Host "Error: $configResult" -ForegroundColor Red
    Pop-Location
    Pop-Location
    exit 1
}

Write-Host "Uploading files..." -ForegroundColor Gray
$uploadResult = az storage blob upload-batch `
    -d '$web' `
    --account-name $storageAccount `
    -s ./out `
    --auth-mode login `
    --only-show-errors `
    --no-progress 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Upload failed" -ForegroundColor Red
    Write-Host "Error: $uploadResult" -ForegroundColor Red
    Pop-Location
    Pop-Location
    exit 1
}

$webUri=(az storage account show --name $storageAccount --resource-group $resourceGroup --query "primaryEndpoints.web" -o tsv 2>$null)
Write-Host "  ✓ Website published" -ForegroundColor Green
Write-Host "  URL: $webUri" -ForegroundColor Cyan

Pop-Location
Pop-Location