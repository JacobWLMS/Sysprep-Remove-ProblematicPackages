# Sysprep Store App Fix

PowerShell script to detect and fix Microsoft Store app issues that prevent Windows Sysprep from completing successfully.

## Problem

When creating a Windows reference image, Sysprep may fail with error `0x80073cf2` if Microsoft Store apps or sideloaded apps are installed for a user but not provisioned for all users.

## Features

* Detects problematic Store and sideloaded apps
* Shows detailed package states (Staged/Installed)
* Interactive package removal with confirmation
* Detailed package info including publisher and signature type
* Handles both Microsoft and third-party packages
* Excludes framework packages

## Prerequisites

* Windows 10/11
* PowerShell (Admin)
* Appx and DISM modules

## Usage

```powershell
# Run PowerShell as Administrator
.\Fix-SysprepStoreApps.ps1
```

## Prevention

Before running Sysprep:
* Disconnect from Internet OR
* Disable Store Automatic Updates in Audit mode
* Avoid installing Store apps or sideloaded apps without proper provisioning

## Troubleshooting

Check Sysprep logs if failure occurs:
```
C:\Windows\System32\Sysprep\Panther\setupact.log
```

## Error

If Sysprep fails, you may see:
```
Error SYSPRP Package <PackageFullName> was installed for a user, 
but not provisioned for all users.
Error: 0x80073cf2
```

Common causes:
* Language packs installed from Store
* Third-party apps installed from Store
* Sideloaded apps without proper provisioning