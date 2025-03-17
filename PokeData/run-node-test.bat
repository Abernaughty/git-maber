@echo off
echo Running Node.js test...
echo.

echo Checking for Node.js in the system PATH:
where node 2>nul
if %errorlevel% equ 0 (
  echo Node.js found in PATH.
  echo.
  echo Running test script:
  node node-test.js
) else (
  echo Node.js NOT found in PATH.
  echo.
  echo Checking for Node.js in common installation locations:
  
  set FOUND=0
  
  if exist "C:\Program Files\nodejs\node.exe" (
    echo Found Node.js at C:\Program Files\nodejs\node.exe
    echo Running test with full path:
    "C:\Program Files\nodejs\node.exe" node-test.js
    set FOUND=1
  )
  
  if exist "C:\Program Files (x86)\nodejs\node.exe" (
    echo Found Node.js at C:\Program Files (x86)\nodejs\node.exe
    echo Running test with full path:
    "C:\Program Files (x86)\nodejs\node.exe" node-test.js
    set FOUND=1
  )
  
  if exist "%APPDATA%\npm\node.exe" (
    echo Found Node.js at %APPDATA%\npm\node.exe
    echo Running test with full path:
    "%APPDATA%\npm\node.exe" node-test.js
    set FOUND=1
  )
  
  if %FOUND% equ 0 (
    echo Node.js not found in common locations.
    echo Please ensure Node.js is installed.
  )
)

echo.
pause
