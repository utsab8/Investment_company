@echo off
echo ========================================
echo Importing Investment Company Database
echo ========================================
echo.

echo Checking MySQL connection...
mysql -u root -putsab12@ -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Cannot connect to MySQL!
    echo Please check:
    echo   1. MySQL is running
    echo   2. Username: root
    echo   3. Password: utsab12@
    echo.
    pause
    exit /b 1
)

echo MySQL connection OK!
echo.

echo Importing database schema and data...
mysql -u root -putsab12@ < backend\database.sql

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Database imported successfully!
    echo ========================================
    echo.
    echo Database: Investment
    echo Tables created: users, content_blocks
    echo Admin user: admin / admin123
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Database import failed!
    echo ========================================
    echo.
    echo Please check the error message above.
    echo.
)

pause

