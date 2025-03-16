<<<<<<< HEAD
@echo off
cd %~dp0
echo === PNPM Optimization ===
echo.

echo 1. Cleaning node_modules and pnpm store...
if exist node_modules rmdir /s /q node_modules
if exist .pnpm-store rmdir /s /q .pnpm-store

echo 2. Optimizing pnpm configuration...
(
echo save-exact=true
echo fund=false
echo audit=false
echo loglevel=error
echo progress=false
echo strict-peer-dependencies=false
echo node-linker=isolated
echo shamefully-hoist=false
) > .npmrc

echo 3. Reinstalling dependencies with optimized settings...
pnpm install --prefer-offline

echo.
echo Installation complete!
echo If node_modules is still larger than expected, you can try:
echo - Running 'pnpm install --force' to rebuild the dependency tree
echo - Running 'pnpm prune' to remove unused dependencies
echo.
echo Current node_modules size:
powershell -command "& {(Get-ChildItem -Recurse node_modules | Measure-Object -Property Length -Sum).Sum / 1MB} MB"
echo.
pause
=======
@echo off
cd %~dp0
echo === PNPM Optimization ===
echo.

echo 1. Cleaning node_modules and pnpm store...
if exist node_modules rmdir /s /q node_modules
if exist .pnpm-store rmdir /s /q .pnpm-store

echo 2. Optimizing pnpm configuration...
(
echo save-exact=true
echo fund=false
echo audit=false
echo loglevel=error
echo progress=false
echo strict-peer-dependencies=false
echo node-linker=isolated
echo shamefully-hoist=false
) > .npmrc

echo 3. Reinstalling dependencies with optimized settings...
pnpm install --prefer-offline

echo.
echo Installation complete!
echo If node_modules is still larger than expected, you can try:
echo - Running 'pnpm install --force' to rebuild the dependency tree
echo - Running 'pnpm prune' to remove unused dependencies
echo.
echo Current node_modules size:
powershell -command "& {(Get-ChildItem -Recurse node_modules | Measure-Object -Property Length -Sum).Sum / 1MB} MB"
echo.
pause
>>>>>>> 48f653889e4748f64877b0f90be997eadf5be751
