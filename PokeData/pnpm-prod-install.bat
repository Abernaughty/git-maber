@echo off
cd %~dp0
echo Installing production dependencies only...
pnpm install --prod

echo Done! Production dependencies installed.
pause
