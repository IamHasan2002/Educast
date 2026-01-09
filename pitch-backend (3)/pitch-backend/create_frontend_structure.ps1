# Create Frontend Directory Structure
Write-Host "Creating Pitch Booking Frontend..." -ForegroundColor Green

# Create directories
$directories = @(
    "css",
    "app",
    "app\controllers",
    "app\services",
    "app\directives",
    "views"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created directory: $dir" -ForegroundColor Cyan
    }
}

Write-Host "`nFrontend structure created successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Run setup_frontend_files.ps1 to create all application files"
Write-Host "2. Install http-server: npm install -g http-server"
Write-Host "3. Run server: http-server -p 8080 -c-1"
Write-Host "4. Open browser to http://localhost:8080"
