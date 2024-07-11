param (
  [string]$pattern = "BlockSite_", 
  [string]$pattern2 = "UnblockSite_"
)

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Definition
$hostsPath = "C:\Windows\System32\drivers\etc\hosts"
$logPath = "$scriptDirectory\logs\unistall.log"

# Créer le répertoire de logs s'il n'existe pas
if (-not (Test-Path -Path (Split-Path -Parent $logPath))) {
    New-Item -ItemType Directory -Path (Split-Path -Parent $logPath) | Out-Null
}

Add-Content -Path $logPath -Value "Starting uninstall script at $(Get-Date)"

# Supprimer les tâches planifiées correspondant au modèle
Get-ScheduledTask | Where-Object {$_.TaskName -like "$pattern*"} | ForEach-Object {
    Unregister-ScheduledTask -TaskName $_.TaskName -Confirm:$false
    Add-Content -Path $logPath -Value "Deleted scheduled task: $_.TaskName at $(Get-Date)"
}

Get-ScheduledTask | Where-Object {$_.TaskName -like "$pattern2*"} | ForEach-Object {
    Unregister-ScheduledTask -TaskName $_.TaskName -Confirm:$false
    Add-Content -Path $logPath -Value "Deleted scheduled task: $_.TaskName at $(Get-Date)"
}

# Vider le fichier hosts
Clear-Content -Path $hostsPath
Add-Content -Path $logPath -Value "Cleared hosts file at $(Get-Date)"

Add-Content -Path $logPath -Value "Completed uninstall script at $(Get-Date)"
