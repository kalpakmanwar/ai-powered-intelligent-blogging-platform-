@echo off
echo Setting JAVA_HOME...
set "JAVA_HOME=C:\Program Files\Java\jdk-17.0.2"
echo JAVA_HOME set to: %JAVA_HOME%
echo.
echo Verifying Java installation...
if exist "%JAVA_HOME%\bin\java.exe" (
    echo Java found at: %JAVA_HOME%\bin\java.exe
) else (
    echo ERROR: Java not found at %JAVA_HOME%\bin\java.exe
    pause
    exit /b 1
)
echo.
echo Starting Spring Boot backend...
echo This may take 1-2 minutes on first run...
echo.
call mvnw.cmd spring-boot:run
pause

