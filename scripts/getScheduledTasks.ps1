$logDir = "C:\Users\sow4w\Desktop\Swos\steellock"
$logPath = "$logDir\getScheduledTasks.log"

# Assurez-vous que le répertoire de log existe
if (-not (Test-Path -Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

try {
    Add-Content -Path $logPath -Value "Script started at $(Get-Date)"
} catch {
    Write-Output "Error writing to log: $_"
    exit
}

function Convert-DaysOfWeekToNames {
    param (
        [int]$daysOfWeekValue
    )

    $days = @{
        1 = 'Sunday'
        2 = 'Monday'
        4 = 'Tuesday'
        8 = 'Wednesday'
        16 = 'Thursday'
        32 = 'Friday'
        64 = 'Saturday'
    }

    $result = @()
    foreach ($day in $days.Keys) {
        if ($daysOfWeekValue -band $day) {
            $result += $days[$day]
        }
    }

    return $result -join ', '
}

try {
    $tasks = Get-ScheduledTask | Where-Object { $_.TaskName -like "BlockSite_*" -or $_.TaskName -like "UnblockSite_*" }

    $taskList = @()

    foreach ($task in $tasks) {
        $triggers = $task.Triggers | ForEach-Object {
            @{
                StartBoundary = $_.StartBoundary
                EndBoundary = $_.EndBoundary
                DaysOfWeek = if ($_.DaysOfWeek) { Convert-DaysOfWeekToNames -daysOfWeekValue $_.DaysOfWeek } else { "" }
            }
        }
        
        $taskDetails = @{
            TaskName = $task.TaskName
            State = $task.State
            Actions = ($task.Actions | ForEach-Object { $_.Execute })
            Triggers = $triggers
        }
        $taskList += $taskDetails
    }

    Add-Content -Path $logPath -Value "Tasks found: $($taskList.Count)"

    if ($taskList.Count -eq 0) {
        $taskList = @()  # Return an empty array if no tasks are found
    }

    $jsonOutput = $taskList | ConvertTo-Json -Compress
    Add-Content -Path $logPath -Value "JSON Output: $jsonOutput"
    Write-Output $jsonOutput
} catch {
    Add-Content -Path $logPath -Value "Error: $_"
    Write-Output "[]"  # Return an empty JSON array on error
}

Add-Content -Path $logPath -Value "Script ended at $(Get-Date)"
