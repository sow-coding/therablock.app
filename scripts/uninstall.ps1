param (
  [string]$pattern = "BlockSite_", 
  [string]$pattern2 = "UnblockSite_"
)

$logPath = "$env:TEMP\uninstall_ps1_log.txt"
$hostsPath = "C:\Windows\System32\drivers\etc\hosts"

# Fonction de logging
function Write-Log {
    param (
        [string]$message
    )
    Add-Content -Path $logPath -Value "$message at $(Get-Date)"
}

# Commencer le logging
Write-Log "Starting uninstall script"

try {
    # Log path for verification
    Write-Log "Log path: $logPath"
    Write-Log "Hosts path: $hostsPath"

    # Supprimer les tâches planifiées correspondant au modèle
    Get-ScheduledTask | Where-Object {$_.TaskName -like "$pattern*"} | ForEach-Object {
        Unregister-ScheduledTask -TaskName $_.TaskName -Confirm:$false
        Write-Log "Deleted scheduled task: $_.TaskName"
    }

    Get-ScheduledTask | Where-Object {$_.TaskName -like "$pattern2*"} | ForEach-Object {
        Unregister-ScheduledTask -TaskName $_.TaskName -Confirm:$false
        Write-Log "Deleted scheduled task: $_.TaskName"
    }

    # Vider le fichier hosts
    Clear-Content -Path $hostsPath
    Write-Log "Cleared hosts file"

    Write-Log "Completed uninstall script successfully"
} catch {
    Write-Log "Error: $_"
    Write-Error "Error: $_"
}
