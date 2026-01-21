@echo off
REM Start PHP Built-in Server for Backend API
REM This script starts the PHP server on port 8000

echo === Starting PHP Backend Server ===
echo.

REM Check if PHP is in PATH
where php >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: PHP is not installed or not in PATH!
    echo.
    echo Please install PHP or add it to your PATH.
    echo For XAMPP users, PHP is usually at: C:\xampp\php\php.exe
    echo.
    echo You can also start the server manually with:
    echo   cd backend
    echo   php -S localhost:8000 router.php
    echo.
    pause
    exit /b 1
)

REM Change to backend directory
cd /d "%~dp0backend"
if not exist "router.php" (
    echo ERROR: Backend directory or router.php not found!
    pause
    exit /b 1
)

echo Backend directory found
echo.
echo Starting PHP server on http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
echo Server will be accessible at:
echo   - API: http://localhost:8000/api/
echo   - Uploads: http://localhost:8000/backend/uploads/
echo.

REM Start PHP server (listen on all interfaces)
php -S 0.0.0.0:8000 -t . router.php

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to start PHP server!
    echo.
    echo Troubleshooting:
    echo   1. Make sure PHP is installed correctly
    echo   2. Check if port 8000 is available
    echo   3. Try running manually: cd backend ^&^& php -S localhost:8000 router.php
    echo.
    pause
    exit /b 1
)

