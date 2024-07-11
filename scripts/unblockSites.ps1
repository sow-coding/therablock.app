param (
  [string]$site
)

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Definition
$logPath = "$scriptDirectory\logs\unblockSites.log"
$hostsPath = "C:\Windows\System32\drivers\etc\hosts"

Add-Content -Path $logPath -Value "Starting unblockSites script at $(Get-Date)"
Add-Content -Path $logPath -Value "Script directory: $scriptDirectory"
Add-Content -Path $logPath -Value "Hosts path: $hostsPath"
Add-Content -Path $logPath -Value "Site to unblock: $site"

$site = $site.Trim()
$entryToRemove = "127.0.0.1 $site"

if (-not (Test-Path $hostsPath)) {
    Add-Content -Path $logPath -Value "Hosts file not found: $hostsPath at $(Get-Date)"
    exit 1
}

try {
    $currentHostsContent = Get-Content $hostsPath -ErrorAction Stop
    Add-Content -Path $logPath -Value "Fichier hosts actuel: $($currentHostsContent -join '`n')"
    $newHostsContent = @()

    foreach ($line in $currentHostsContent) {
        Add-Content -Path $logPath -Value "Checking line: $line"
        if ($line -ne $entryToRemove) {
            if ($newHostsContent -notcontains $line) {
                $newHostsContent += $line
            }
        } else {
            Add-Content -Path $logPath -Value "Removing entry: $entryToRemove at $(Get-Date)"
        }
    }

    # Vérification du contenu avant l'écriture
    Add-Content -Path $logPath -Value "Nouveau fichier hosts: $($newHostsContent -join '`n')"

    # Écrire le nouveau contenu dans le fichier hosts
    Clear-Content $hostsPath
    Add-Content -Path $hostsPath -Value ($newHostsContent -join "`n")
    ipconfig /flushdns
    Add-Content -Path $logPath -Value "Completed unblockSites script at $(Get-Date)"
} catch {
    Add-Content -Path $logPath -Value "Error removing site from hosts file: $_ at $(Get-Date)"
}
