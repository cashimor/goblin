@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel%==0 (
  set "NODE=node"
) else (
  set "NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
)
if not exist "%NODE%" if not "%NODE%"=="node" (
  echo Could not find Node.js. Install Node.js or run this project from Codex.
  pause
  exit /b 1
)
start "" http://127.0.0.1:4173
"%NODE%" server.js
pause
