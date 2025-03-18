@echo off
cd %~dp0
echo ==================================
echo Pokemon Card Price Checker Launcher
echo ==================================
echo.

:: Run the setup script first
echo Running setup and dependency check...
call setup.bat

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Setup failed. Cannot start the application.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

echo.
echo ==================================
echo Starting Pokemon Card Price Checker
echo ==================================
echo.

:: Start the app
pnpm start

exit /b %ERRORLEVEL%
