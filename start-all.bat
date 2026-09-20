@echo off
title Launch Hotel Bed Availability MVP
echo ===================================================
echo Launching Hotel Bed Availability Tracking System MVP
echo ===================================================
start "Spring Boot Backend" "%~dp0start-backend.bat"
timeout /t 3 /nobreak >nul
start "React Frontend" "%~dp0start-frontend.bat"
echo Applications are launching!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo ===================================================
pause
