#! /usr/bin/pwsh

Param(
    [parameter(Mandatory=$true)][string]$resourceGroup,
    [parameter(Mandatory=$true)][string]$acrName,
    [parameter(Mandatory=$false)][string]$dockerTag="latest"
)

Push-Location $($MyInvocation.InvocationName | Split-Path)

Write-Host "Configuring ACR..." -ForegroundColor Gray
$acrResult = az acr update -n $acrName --admin-enabled true --only-show-errors 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Failed to configure ACR" -ForegroundColor Red
    Write-Host "Error: $acrResult" -ForegroundColor Red
    exit 1
}

# Get source directory (../../src from powershell folder)
$srcPath = (Resolve-Path "../../src").Path

# Define images to build
$images = @(
    @{
        Name = "claims-api"
        Dockerfile = "CoreClaims.WebAPI/Dockerfile"
        Context = $srcPath
    },
    @{
        Name = "claims-worker"
        Dockerfile = "CoreClaims.WorkerService/Dockerfile"
        Context = $srcPath
    }
)

Write-Host "Building and pushing images using ACR Tasks..." -ForegroundColor White
Write-Host "  Tag: $dockerTag" -ForegroundColor Gray

foreach ($image in $images) {
    $imageName = "$($image.Name):$dockerTag"
    Write-Host "`nBuilding $imageName..." -ForegroundColor Cyan
    
    # Use ACR Tasks to build and push in one command
    az acr build `
        --registry $acrName `
        --image $imageName `
        --file "$($image.Context)/$($image.Dockerfile)" `
        $image.Context `
        --only-show-errors 2>&1 | ForEach-Object {
            if ($_ -match "error|ERROR|failed|Failed|unable") {
                Write-Host "  $_" -ForegroundColor Red
            } elseif ($_ -match "Pushed|Successfully tagged|Run ID:") {
                # Show only important success messages
            } elseif ($_ -match "Step \d+/\d+ : ") {
                # Show build steps in gray
                Write-Host "  $_" -ForegroundColor DarkGray
            }
        }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ Failed to build $imageName" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    Write-Host "  ✓ $imageName built and pushed successfully" -ForegroundColor Green
}

Write-Host "`nAll images built and pushed to ACR" -ForegroundColor Green

Pop-Location