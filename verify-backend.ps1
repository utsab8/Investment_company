# Backend Verification Script
Write-Host "=== Backend Verification ===" -ForegroundColor Cyan
Write-Host ""

# Test PHP Built-in Server (Port 8000)
Write-Host "Testing PHP Built-in Server (Port 8000)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/admin/test.php" -UseBasicParsing -TimeoutSec 3
    Write-Host "PHP Server (Port 8000): WORKING - Status $($response.StatusCode)" -ForegroundColor Green
    
    # Check CORS headers
    if ($response.Headers['Access-Control-Allow-Origin']) {
        Write-Host "  CORS Headers: Present" -ForegroundColor Green
    } else {
        Write-Host "  CORS Headers: Missing" -ForegroundColor Red
    }
} catch {
    Write-Host "PHP Server (Port 8000): NOT ACCESSIBLE" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
}
Write-Host ""

# Check .env file
Write-Host "Checking .env configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    $envContent = Get-Content .env
    Write-Host ".env file exists" -ForegroundColor Green
    Write-Host "  Content: $envContent" -ForegroundColor Gray
    
    if ($envContent -match "localhost:8000") {
        Write-Host "  Configured for PHP built-in server (port 8000)" -ForegroundColor Green
    } elseif ($envContent -match "localhost/investment") {
        Write-Host "  Configured for Apache (port 80)" -ForegroundColor Yellow
    }
} else {
    Write-Host ".env file NOT FOUND!" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "If React is still using the wrong URL, you MUST restart it:" -ForegroundColor Yellow
Write-Host "  1. Press Ctrl+C in React terminal" -ForegroundColor White
Write-Host "  2. Run: npm start" -ForegroundColor White
Write-Host "  3. Wait for compilation" -ForegroundColor White
Write-Host "  4. Refresh browser (Ctrl+F5)" -ForegroundColor White

