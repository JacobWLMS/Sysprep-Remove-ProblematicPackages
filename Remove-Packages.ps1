# Run as administrator
$ErrorActionPreference = "SilentlyContinue"
Import-Module Appx
Import-Module Dism

Write-Host "Scanning for problematic Store apps..." -ForegroundColor Yellow
$allUserPackages = Get-AppxPackage -AllUsers | Where-Object PublisherId -eq "8wekyb3d8bbwe"
$provisionedPackages = Get-AppxProvisionedPackage -Online
$problems = @()

foreach ($package in $allUserPackages) {
    # Skip staged packages
    if ($package.PackageUserInformation.InstallState -eq "Staged") {
        continue
    }
    $provMatch = $provisionedPackages | Where-Object { $_.DisplayName -eq $package.Name }
    if (-not $provMatch -and -not $package.IsFramework -and $package.PackageUserInformation) {
        # Get unique install states
        $uniqueUserStates = $package.PackageUserInformation | Select-Object -Property InstallState -Unique
        
        $problems += @{
            Name = $package.Name
            DisplayName = ($package.Name -split '_')[0]  # Extract friendly name
            PackageFullName = $package.PackageFullName
            Version = $package.Version
            Architecture = $package.Architecture
            UserInfo = $uniqueUserStates
            Issue = "Package installed for user but not provisioned"
            Package = $package
        }
    }
}

if ($problems.Count -eq 0) {
    Write-Host "No Microsoft Store app issues detected." -ForegroundColor Green
    exit
}

Write-Host "`nFound $($problems.Count) potential Sysprep blockers:" -ForegroundColor Red
foreach ($problem in $problems) {
    Write-Host "`n----------------------------------------"
    Write-Host "Display Name: $($problem.DisplayName)" -ForegroundColor Cyan
    Write-Host "Package Name: $($problem.Name)"
    Write-Host "Version: $($problem.Version)"
    Write-Host "Architecture: $($problem.Architecture)"
    Write-Host "Full Package Name: $($problem.PackageFullName)"
    Write-Host "Issue: $($problem.Issue)" -ForegroundColor Yellow
    Write-Host "Install State:"
    $problem.UserInfo | ForEach-Object {
        Write-Host "  State: $($_.InstallState)`n"
    }
    
    $choice = Read-Host "Remove this package? (y/n)"
    if ($choice.ToLower() -eq 'y') {
        Write-Host "Removing package..." -ForegroundColor Yellow
        Remove-AppxPackage -Package $problem.Package.PackageFullName -AllUsers
        Write-Host "Package removed." -ForegroundColor Green
    }
}