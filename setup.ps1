# Investment Company Setup Script
Write-Host "Setting up Investment Company..." -ForegroundColor Green

# Check if MySQL is available
$mysqlPath = Get-Command mysql -ErrorAction SilentlyContinue
if ($mysqlPath) {
    Write-Host "Importing database..." -ForegroundColor Yellow
    Get-Content backend/database.sql | mysql -u root -putsab12@
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database imported successfully!" -ForegroundColor Green
    } else {
        Write-Host "Database import failed. Please import manually: mysql -u root -p < backend/database.sql" -ForegroundColor Red
    }
} else {
    Write-Host "MySQL not found in PATH. Please import database manually:" -ForegroundColor Yellow
    Write-Host "  mysql -u root -p < backend/database.sql" -ForegroundColor Cyan
}

Write-Host "`nStarting PHP server on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; php -S localhost:8000 -t public"

Start-Sleep -Seconds 2

Write-Host "Starting React development server..." -ForegroundColor Yellow
Write-Host "`nAdmin Panel will be available at: http://localhost:3000/backend/admin" -ForegroundColor Cyan
Write-Host "Login: admin / admin123`n" -ForegroundColor Cyan

npm start


