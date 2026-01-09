@echo off
echo Creating Pitch Booking Frontend Structure...
echo.

REM Create directories
mkdir css 2>nul
mkdir app 2>nul
mkdir app\controllers 2>nul
mkdir app\services 2>nul
mkdir app\directives 2>nul
mkdir views 2>nul

echo Directory structure created!
echo.
echo To complete setup:
echo 1. Run: powershell -ExecutionPolicy Bypass -File setup_all_files.ps1
echo 2. Install http-server: npm install -g http-server
echo 3. Start server: http-server -p 8080 -c-1
echo 4. Open http://localhost:8080 in your browser
echo.
pause
