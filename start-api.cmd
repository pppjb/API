@echo off
cd /d "%~dp0"
title Task API - localhost:3000
where node.exe >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js was not found.
  echo Please install Node.js or add node.exe to PATH.
  pause
  exit /b 1
)

echo Starting Task API from: %CD%
echo Keep this window open while using the API.
echo After you see "Task API is running", open:
echo http://127.0.0.1:3000/
echo.
node src\server.js
echo.
echo ERROR: The API stopped or failed to start.
echo Please send a screenshot of this window so the error can be diagnosed.
pause
