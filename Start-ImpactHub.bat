@echo off
title ImpactHub Local Server
cd /d "C:\Users\SANDEEP\OneDrive\Desktop\community services"
echo ========================================================
echo   Starting ImpactHub Non-Profit Platform on Localhost
echo ========================================================
echo.
echo Opening http://localhost:3000 in your browser...
start http://localhost:3000
echo.
npm run dev -- --port 3000
pause
