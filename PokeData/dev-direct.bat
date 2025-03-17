@echo off
cd %~dp0
echo Starting development server with direct paths...

REM Try common Node.js installation paths
set TRIED=0

echo Attempting to find Node.js...
echo.

REM Check Program Files
if exist "C:\Program Files\nodejs\npx.cmd" (
  echo Found Node.js in Program Files
  set PNPM_CMD="C:\Program Files\nodejs\npx.cmd" pnpm
  goto :run_dev
)

REM Check Program Files (x86)
if exist "C:\Program Files (x86)\nodejs\npx.cmd" (
  echo Found Node.js in Program Files (x86)
  set PNPM_CMD="C:\Program Files (x86)\nodejs\npx.cmd" pnpm
  goto :run_dev
)

REM Check AppData\Roaming\npm
if exist "%APPDATA%\npm\npx.cmd" (
  echo Found npm in AppData\Roaming\npm
  set PNPM_CMD="%APPDATA%\npm\npx.cmd" pnpm
  goto :run_dev
)

REM Check for nvm installations
for /d %%i in ("%APPDATA%\nvm\*") do (
  if exist "%%i\npx.cmd" (
    echo Found Node.js in NVM directory: %%i
    set PNPM_CMD="%%i\npx.cmd" pnpm
    goto :run_dev
  )
)

REM Check for local pnpm in node_modules
if exist "%~dp0\node_modules\.bin\pnpm.cmd" (
  echo Found local pnpm in node_modules\.bin
  set PNPM_CMD="%~dp0\node_modules\.bin\pnpm.cmd"
  goto :run_dev
)

echo Could not find Node.js installation.
echo Please make sure Node.js is installed and try running the fix-node-path.bat script.
goto :end

:run_dev
echo Using: %PNPM_CMD%
%PNPM_CMD% dev

:end
pause
