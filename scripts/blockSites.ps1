param (
  [string]$site
)

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Definition
$logPath = "$scriptDirectory\logs\blockSites.log"
$hostsPath = "C:\Windows\System32\drivers\etc\hosts"

Add-Content -Path $logPath -Value "Starting blockSites script at $(Get-Date)"
Add-Content -Path $logPath -Value "Script directory: $scriptDirectory"
Add-Content -Path $logPath -Value "Hosts path: $hostsPath"
Add-Content -Path $logPath -Value "Site to block: $site"

$site = $site.Trim()  # Nettoyer la chaîne de caractères
$entryToAdd = "127.0.0.1 $site"

if (-not (Test-Path $hostsPath)) {
    Add-Content -Path $logPath -Value "Hosts file not found: $hostsPath at $(Get-Date)"
    exit 1
}

try {
    $currentHostsContent = Get-Content $hostsPath -ErrorAction Stop
    if ($currentHostsContent -notcontains $entryToAdd) {
        Add-Content -Path $logPath -Value "Adding entry: $entryToAdd"
        Add-Content -Path $hostsPath -Value $entryToAdd
        Add-Content -Path $logPath -Value "Site blocked: $entryToAdd at $(Get-Date)"
    } else {
        Add-Content -Path $logPath -Value "Entry already exists: $entryToAdd"
    }
} catch {
    Add-Content -Path $logPath -Value "Error adding entry: $entryToAdd - $_"
}

ipconfig /flushdns
Add-Content -Path $logPath -Value "Completed blockSites script at $(Get-Date)"
