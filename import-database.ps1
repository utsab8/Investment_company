# Import Investment Company Database
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Importing Investment Company Database" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check MySQL connection
Write-Host "Checking MySQL connection..." -ForegroundColor Yellow
try {
    $result = mysql -u root -putsab12@ -e "SELECT 1" 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "MySQL connection failed"
    }
    Write-Host "MySQL connection OK!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Cannot connect to MySQL!" -ForegroundColor Red
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "  1. MySQL is running" -ForegroundColor White
    Write-Host "  2. Username: root" -ForegroundColor White
    Write-Host "  3. Password: utsab12@" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Importing database schema and data..." -ForegroundColor Yellow

# Import database
Get-Content backend/database.sql | mysql -u root -putsab12@

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Database imported successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Database: Investment" -ForegroundColor Cyan
    Write-Host "Tables created: users, content_blocks" -ForegroundColor Cyan
    Write-Host "Admin user: admin / admin123" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "ERROR: Database import failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check the error message above." -ForegroundColor Yellow
    Write-Host ""
}

Read-Host "Press Enter to exit"

