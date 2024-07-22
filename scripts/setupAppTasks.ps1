param (
  [string]$appName,
  [int]$startHour,
  [int]$startMinute,
  [int]$endHour,
  [int]$endMinute,
  [string]$daysOfWeek
)

function Test-IsAdmin {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-IsAdmin)) {
    Write-Error "This script must be run as an administrator."
    exit 1
}

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Definition
$logDirectory = "$scriptDirectory\logs"
$logPath = "$logDirectory\setupTasks.log"

# Créer le répertoire de logs s'il n'existe pas
if (-not (Test-Path -Path $logDirectory)) {
    New-Item -ItemType Directory -Path $logDirectory | Out-Null
}

# Validation des paramètres
if ($startHour -lt 0 -or $startHour -gt 23) {
    Add-Content -Path $logPath -Value "Invalid start hour: $startHour. Must be between 0 and 23."
    exit 1
}
if ($startMinute -lt 0 -or $startMinute -gt 59) {
    Add-Content -Path $logPath -Value "Invalid start minute: $startMinute. Must be between 0 et 59."
    exit 1
}
if ($endHour -lt 0 -or $endHour -gt 23) {
    Add-Content -Path $logPath -Value "Invalid end hour: $endHour. Must be between 0 et 23."
    exit 1
}
if ($endMinute -lt 0 -or $endMinute -gt 59) {
    Add-Content -Path $logPath -Value "Invalid end minute: $endMinute. Must be between 0 et 59."
    exit 1
}

if (-not $daysOfWeek) {
    Add-Content -Path $logPath -Value "No days of the week specified."
    exit 1
}

try {
    Add-Content -Path $logPath -Value "Starting task setup for application: $appName at $(Get-Date)"

    $actionMonitorApp = New-ScheduledTaskAction -Execute 'node.exe' -Argument "`"$scriptDirectory\monitorApp.js`" `"$appName`" `"$((Get-Date -Hour $startHour -Minute $startMinute -Format 'yyyy-MM-ddTHH:mm:sszzz'))`" `"$((Get-Date -Hour $endHour -Minute $endMinute -Format 'yyyy-MM-ddTHH:mm:sszzz'))`""
    Add-Content -Path $logPath -Value "Created actionMonitorApp for application: $appName"

    Add-Content -Path $logPath -Value "Initial days of week string: $daysOfWeek"

    # Conversion des jours en valeurs d'énumération
    $daysOfWeekArray = $daysOfWeek.Split(",") | ForEach-Object {
        [System.DayOfWeek]::Parse([System.DayOfWeek], $_)
    }

    # Vérification du contenu de daysOfWeekArray
    Add-Content -Path $logPath -Value "Days of week array: $($daysOfWeekArray -join ', ')"

    # Création des déclencheurs en utilisant les jours convertis
    $triggerBlock = New-ScheduledTaskTrigger -Weekly -DaysOfWeek $daysOfWeekArray -At "$($startHour):$($startMinute)"
    Add-Content -Path $logPath -Value "Created triggerBlock for application: $appName at $($startHour):$($startMinute) on $($daysOfWeekArray -join ', ')"

    $triggerUnblock = New-ScheduledTaskTrigger -Weekly -DaysOfWeek $daysOfWeekArray -At "$($endHour):$($endMinute)"
    Add-Content -Path $logPath -Value "Created triggerUnblock for application: $appName at $($endHour):$($endMinute) on $($daysOfWeekArray -join ', ')"

    $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

    # Générer un identifiant unique pour chaque tâche avec la date et le nom de l'application
    $timestamp = (Get-Date).ToString("yyyyMMddHHmmss")
    $taskNameBlock = "BlockApp_${timestamp}_$appName"
    $taskNameUnblock = "UnblockApp_${timestamp}_$appName"

    $taskBlockApp = New-ScheduledTask -Action $actionMonitorApp -Trigger $triggerBlock -Principal $principal -Settings (New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries)
    Register-ScheduledTask -TaskName $taskNameBlock -InputObject $taskBlockApp -Force
    Add-Content -Path $logPath -Value "Registered scheduled task for blocking application: $appName with task name: $taskNameBlock"

    $taskUnblockApp = New-ScheduledTask -Action $actionMonitorApp -Trigger $triggerUnblock -Principal $principal -Settings (New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries)
    Register-ScheduledTask -TaskName $taskNameUnblock -InputObject $taskUnblockApp -Force
    Add-Content -Path $logPath -Value "Registered scheduled task for unblocking application: $appName with task name: $taskNameUnblock"

    Write-Output "Scheduled tasks set up successfully for application: $appName"
    Add-Content -Path $logPath -Value "Scheduled tasks set up successfully for application: $appName at $(Get-Date)"
} catch {
    Write-Error "Error setting up scheduled tasks: $_"
    Add-Content -Path $logPath -Value "Error setting up scheduled tasks: $_ at $(Get-Date)"
}
