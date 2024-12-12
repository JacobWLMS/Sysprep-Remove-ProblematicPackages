$ErrorActionPreference = "SilentlyContinue"
Import-Module Appx
Import-Module Dism

Write-Host "Scanning for problematic apps..." -ForegroundColor Yellow
$allUserPackages = Get-AppxPackage -AllUsers 
$provisionedPackages = Get-AppxProvisionedPackage -Online
$problems = @()

foreach ($package in $allUserPackages) {
    $provMatch = $provisionedPackages | Where-Object { $_.DisplayName -eq $package.Name }
    
    if (-not $provMatch -and -not $package.IsFramework -and $package.PackageUserInformation) {
        # Check if package is from Store or sideloaded
        if ($package.SignatureKind -in @("Store", "Developer")) {
            $uniqueUserStates = $package.PackageUserInformation | Select-Object -Property InstallState -Unique
            
            $problems += @{
                Name = $package.Name
                DisplayName = ($package.Name -split '_')[0]
                PackageFullName = $package.PackageFullName
                Version = $package.Version
                Publisher = $package.Publisher
                PublisherId = $package.PublisherId
                SignatureKind = $package.SignatureKind
                UserInfo = $uniqueUserStates
                Issue = "$($package.SignatureKind) package installed but not provisioned"
                Package = $package
            }
        }
    }
}

if ($problems.Count -eq 0) {
    Write-Host "No problematic apps detected." -ForegroundColor Green
    exit
}

Write-Host "`nFound $($problems.Count) potential Sysprep blockers:" -ForegroundColor Red
foreach ($problem in $problems) {
    Write-Host "`n----------------------------------------"
    Write-Host "Display Name: $($problem.DisplayName)" -ForegroundColor Cyan
    Write-Host "Package Name: $($problem.Name)"
    Write-Host "Publisher: $($problem.Publisher)"
    Write-Host "PublisherId: $($problem.PublisherId)"
    Write-Host "Version: $($problem.Version)"
    Write-Host "Signature: $($problem.SignatureKind)" -ForegroundColor Yellow
    Write-Host "Issue: $($problem.Issue)" -ForegroundColor Yellow
    Write-Host "Install States:"
    $problem.UserInfo | ForEach-Object {
        Write-Host "  - $($_.InstallState)"
    }
    
    $choice = Read-Host "Remove this package? (y/n)"
    if ($choice.ToLower() -eq 'y') {
        Write-Host "Removing package..." -ForegroundColor Yellow
        Remove-AppxPackage -Package $problem.Package.PackageFullName -AllUsers
        Write-Host "Package removed." -ForegroundColor Green
    }
}
