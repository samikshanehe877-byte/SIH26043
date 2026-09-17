# Starts the whole SIH26043 stack for local development:
#   PostgreSQL (Windows service)  -> localhost:5432
#   FastAPI backend (ai/)         -> http://localhost:8000
#   Next.js frontend (frontend/)  -> http://localhost:3000
#
# The API and frontend each open in their own PowerShell window, so they keep running
# after you close VS Code or this terminal. Close those windows (or Ctrl+C in them) to stop.
#
# Usage (from the SIH26043 folder):
#   powershell -ExecutionPolicy Bypass -File .\start-dev.ps1            # start what isn't running
#   powershell -ExecutionPolicy Bypass -File .\start-dev.ps1 -Restart   # stop old API/frontend first (picks up code changes)

param([switch]$Restart)

$root = $PSScriptRoot
$aiDir = Join-Path $root "ai"
$frontendDir = Join-Path $root "frontend"

function Get-PortOwner([int]$port) {
    $connection = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($connection) { return $connection.OwningProcess }
    return $null
}

function Stop-Port([int]$port) {
    $owner = Get-PortOwner $port
    if ($owner) {
        Write-Host "Stopping process $owner on port $port"
        Stop-Process -Id $owner -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

function Wait-ForUrl([string]$url, [int]$seconds) {
    for ($i = 0; $i -lt $seconds; $i++) {
        try {
            Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2 | Out-Null
            return $true
        } catch {
            # Any HTTP response (even 404) means the server is up.
            if ($_.Exception.Response) { return $true }
            Start-Sleep -Seconds 1
        }
    }
    return $false
}

# --- 1. Database ---
$postgres = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $postgres) {
    Write-Warning "No PostgreSQL service found. Install PostgreSQL or start your database manually."
} elseif ($postgres.Status -ne "Running") {
    Write-Host "Starting $($postgres.Name)..."
    try {
        Start-Service $postgres.Name -ErrorAction Stop
    } catch {
        Write-Warning "Could not start $($postgres.Name). Run this script from an Administrator PowerShell, or start the service from services.msc."
    }
} else {
    Write-Host "Database: $($postgres.Name) is running"
}

if ($Restart) {
    Stop-Port 8000
    Stop-Port 3000
}

# --- 2. Backend API ---
if (Get-PortOwner 8000) {
    Write-Host "API: already running on port 8000 (use -Restart to reload new code)"
} else {
    $python = Join-Path $aiDir ".venv\Scripts\python.exe"
    if (-not (Test-Path $python)) { $python = "python" }
    Write-Host "API: starting on http://localhost:8000"
    Start-Process powershell -WorkingDirectory $aiDir -ArgumentList @(
        "-NoExit", "-Command",
        "`$Host.UI.RawUI.WindowTitle = 'SIH API :8000'; & '$python' -m uvicorn api:app --reload --port 8000"
    )
}

# --- 3. Frontend ---
if (Get-PortOwner 3000) {
    Write-Host "Frontend: already running on port 3000"
} else {
    Write-Host "Frontend: starting on http://localhost:3000"
    Start-Process powershell -WorkingDirectory $frontendDir -ArgumentList @(
        "-NoExit", "-Command",
        "`$Host.UI.RawUI.WindowTitle = 'SIH Frontend :3000'; npm run dev -- --port 3000"
    )
}

Write-Host "Waiting for servers..."
$apiUp = Wait-ForUrl "http://localhost:8000/health" 180  # the AI libraries make the first start slow
$webUp = Wait-ForUrl "http://localhost:3000/signin" 120
Write-Host ("API      http://localhost:8000  " + $(if ($apiUp) { "UP" } else { "NOT RESPONDING - check the 'SIH API' window" }))
Write-Host ("Frontend http://localhost:3000  " + $(if ($webUp) { "UP" } else { "NOT RESPONDING - check the 'SIH Frontend' window" }))
if ($webUp) { Start-Process "http://localhost:3000" }
