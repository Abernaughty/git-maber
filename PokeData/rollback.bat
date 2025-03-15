@echo off
echo Available checkpoints:
git log --pretty=format:"%%h - %%s" -n 10
echo.
echo.
set /p HASH="Enter commit hash to rollback to: "
echo.
echo Rolling back to checkpoint %HASH%...
git checkout %HASH%
echo.
echo To return to the latest version after testing, use: git checkout master
pause