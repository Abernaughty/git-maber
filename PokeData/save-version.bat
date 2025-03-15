@echo off
mkdir "versions\%1"
xcopy /E /I /Y src "versions\%1\src"
xcopy /E /I /Y public "versions\%1\public"
copy package.json "versions\%1\"
copy rollup.config.js "versions\%1\"
echo Version: %1 > "versions\%1\version-info.txt"
echo Created on: %date% %time% >> "versions\%1\version-info.txt"
echo Version %1 saved successfully!