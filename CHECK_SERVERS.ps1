# Server Status Check Script

Write-Host "=== Server Status Check ===" -ForegroundColor Cyan
Write-Host ""

# Check Frontend (React)
Write-Host "Checking Frontend (React)..." -ForegroundColor Yellow
$frontend = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue
if ($frontend.TcpTestSucceeded) {
    Write-Host "✅ Frontend is running on http://localhost:3000" -ForegroundColor Green
    Write-Host "   Open: http://localhost:3000" -ForegroundColor Gray
} else {
    Write-Host "❌ Frontend is NOT running" -ForegroundColor Red
    Write-Host "   Start it with: npm start" -ForegroundColor Gray
}
Write-Host ""

# Check Backend (Apache/PHP)
Write-Host "Checking Backend (Apache/PHP)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost/backend/api/plans.php" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    Write-Host "✅ Backend is running on http://localhost/backend/api/" -ForegroundColor Green
    Write-Host "   Test: http://localhost/backend/api/plans.php" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend is NOT accessible" -ForegroundColor Red
    Write-Host "   Make sure Apache is running (XAMPP/WAMP)" -ForegroundColor Gray
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}
Write-Host ""

# Check Database
Write-Host "Checking Database Connection..." -ForegroundColor Yellow
try {
    $dbTest = Invoke-WebRequest -Uri "http://localhost/backend/api/plans.php" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    if ($dbTest.Content -match 'success|data') {
        Write-Host "✅ Database connection appears to be working" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Backend responding but check database connection" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Cannot check database (backend not accessible)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "=== Quick Access Links ===" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Admin Login: http://localhost:3000/admin/login" -ForegroundColor White
Write-Host "Backend API: http://localhost/backend/api/plans.php" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

