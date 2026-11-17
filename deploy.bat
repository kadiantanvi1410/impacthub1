@echo off
title Deploy ImpactHub to GitHub Pages
cd /d "%~dp0"
echo ========================================================
echo   Building and Deploying ImpactHub to GitHub Pages
echo ========================================================
echo.
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b %errorlevel%
)
echo.
echo Pushing production bundle to gh-pages branch...
powershell -Command "Push-Location dist; git init; git checkout -B gh-pages; git add -A; git commit -m 'Deploy production build'; git remote add origin https://github.com/kadiantanvi1410/impacthub1.git; git push -f origin gh-pages; Pop-Location; Remove-Item -Recurse -Force dist/.git -ErrorAction SilentlyContinue"
echo.
echo ========================================================
echo   Deployment Complete!
echo   Live site: https://kadiantanvi1410.github.io/impacthub1/
echo ========================================================
pause
