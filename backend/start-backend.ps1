# PowerShell script to start the backend
Write-Host "Setting JAVA_HOME..." -ForegroundColor Green
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17.0.2"
Write-Host "JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Green
Write-Host ""
Write-Host "Starting Spring Boot backend..." -ForegroundColor Yellow
Write-Host "This may take 1-2 minutes on first run..." -ForegroundColor Yellow
Write-Host ""
.\mvnw.cmd spring-boot:run

