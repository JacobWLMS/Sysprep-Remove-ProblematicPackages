# Sysprep Store App Fix

PowerShell script to detect and fix Microsoft Store app issues that prevent Windows Sysprep from completing successfully.

## Problem

When creating a Windows reference image, Sysprep may fail with error `0x80073cf2` if Microsoft Store apps are installed for a user but not provisioned for all users.

## Features

* Detects problematic Microsoft Store apps
* Excludes staged and framework packages
* Interactive package removal
* Detailed package info and install state

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