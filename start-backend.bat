@echo off
title Hotel Bed Tracking - Spring Boot Backend
echo ===================================================
echo Starting Spring Boot Backend on http://localhost:8080
echo Database: PostgreSQL 'hotel'
echo ===================================================
cd /d "%~dp0backend"
set "JAVA_HOME=C:\Program Files\Java\jdk-26.0.2"
set "PATH=%JAVA_HOME%\bin;%PATH%"
mvn spring-boot:run
pause
