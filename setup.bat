@echo off
echo Setting up Investment Company...
echo.

echo Importing database...
mysql -u root -putsab12@ < backend\database.sql
if %errorlevel% equ 0 (
    echo Database imported successfully!
) else (
    echo Database import failed. Please import manually: mysql -u root -p ^< backend\database.sql
)
echo.

echo Starting PHP server on port 8000...
start "PHP Server" cmd /k "cd backend && php -S localhost:8000 -t public"
timeout /t 2 /nobreak >nul

echo Starting React development server...
echo.
echo Admin Panel will be available at: http://localhost:3000/backend/admin
echo Login: admin / admin123
echo.

npm start

