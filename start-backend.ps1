# Start PHP Built-in Server for Backend API
# This script starts the PHP server on port 8000

Write-Host "=== Starting PHP Backend Server ===" -ForegroundColor Cyan
Write-Host ""

# Check if PHP is installed
$phpPath = Get-Command php -ErrorAction SilentlyContinue
if (-not $phpPath) {
    Write-Host "❌ ERROR: PHP is not installed or not in PATH!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install PHP or add it to your PATH." -ForegroundColor Yellow
    Write-Host "For XAMPP users, PHP is usually at: C:\xampp\php\php.exe" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You can also start the server manually with:" -ForegroundColor Cyan
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  php -S localhost:8000 router.php" -ForegroundColor White
    Write-Host ""
    pause
    exit 1
}

# Check if port 8000 is already in use
$portInUse = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️  WARNING: Port 8000 is already in use!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Another process might be using port 8000." -ForegroundColor Yellow
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "  1. Stop the other process" -ForegroundColor White
    Write-Host "  2. Use a different port (edit this script)" -ForegroundColor White
    Write-Host ""
    $response = Read-Host "Do you want to continue anyway? (y/n)"
    if ($response -ne 'y' -and $response -ne 'Y') {
        exit 1
    }
}

# Change to backend directory
$backendDir = Join-Path $PSScriptRoot "backend"
if (-not (Test-Path $backendDir)) {
    Write-Host "❌ ERROR: Backend directory not found!" -ForegroundColor Red
    Write-Host "Expected: $backendDir" -ForegroundColor Yellow
    pause
    exit 1
}

Set-Location $backendDir

Write-Host "✓ Backend directory found" -ForegroundColor Green
Write-Host "✓ PHP found at: $($phpPath.Source)" -ForegroundColor Green
Write-Host ""
Write-Host "Starting PHP server on http://localhost:8000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
Write-Host "Server will be accessible at:" -ForegroundColor Green
Write-Host "  - API: http://localhost:8000/api/" -ForegroundColor White
Write-Host "  - Uploads: http://localhost:8000/backend/uploads/" -ForegroundColor White
Write-Host ""

# Start PHP server
try {
    php -S localhost:8000 router.php
} catch {
    Write-Host ""
    Write-Host "❌ ERROR: Failed to start PHP server!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Make sure PHP is installed correctly" -ForegroundColor White
    Write-Host "  2. Check if port 8000 is available" -ForegroundColor White
    Write-Host "  3. Try running manually: cd backend && php -S localhost:8000 router.php" -ForegroundColor White
    Write-Host ""
    pause
    exit 1
}




