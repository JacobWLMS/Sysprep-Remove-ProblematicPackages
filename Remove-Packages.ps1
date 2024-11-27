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
        $problems += @{
            Name = $package.Name
            PackageFullName = $package.PackageFullName
            UserInfo = $package.PackageUserInformation
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
    Write-Host "`nPackage Name: $($problem.Name)"
    Write-Host "Full Package Name: $($problem.PackageFullName)"
    Write-Host "Issue: $($problem.Issue)" -ForegroundColor Yellow
    Write-Host "Install State:"
    $problem.UserInfo | Format-List

    $choice = Read-Host "Remove this package? (y/n)"
    if ($choice.ToLower() -eq 'y') {
        Write-Host "Removing package..." -ForegroundColor Yellow
        Remove-AppxPackage -Package $problem.Package.PackageFullName -AllUsers
        Write-Host "Package removed." -ForegroundColor Green
    }
}

Write-Host "`nNote: Disconnect from Internet or disable Store updates to prevent automatic app updates." -ForegroundColor Yellow