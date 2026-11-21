@echo off
rem Starts the Todo App backend and frontend together (Windows counterpart of run-app.sh).
rem
rem Configuration (environment variables, or backend\.env which the API loads itself):
rem   JWT_SECRET     optional; a random per-run secret is generated when unset
rem   SEED_PASSWORD  required unless backend\.env defines it (min 8 characters)
rem   PORT           backend port (default 4000)
rem   FRONTEND_PORT  frontend port (default 5173)
rem
rem Press Ctrl+C to stop; both services share this console and stop together.
setlocal EnableExtensions

for %%d in ("%~dp0..") do set "ROOT_DIR=%%~fd"
set "BACKEND_DIR=%ROOT_DIR%\backend"
set "FRONTEND_DIR=%ROOT_DIR%\frontend"
if not defined PORT set "PORT=4000"
if not defined FRONTEND_PORT set "FRONTEND_PORT=5173"
set "HEALTH_URL=http://localhost:%PORT%/api/v1/health"
set "HEALTH_MAX_ATTEMPTS=30"
set "HEALTH_POLL_SECONDS=1"
set "JWT_SECRET_BYTES=32"
set "EXIT_CODE=0"

call :require_configuration || exit /b 1
call :install_if_missing "%BACKEND_DIR%" || exit /b 1
call :install_if_missing "%FRONTEND_DIR%" || exit /b 1
call :ensure_port_free || exit /b 1

call :log "Starting backend on port %PORT%..."
pushd "%BACKEND_DIR%"
start "todo-backend" /b cmd /c npm start
popd
call :wait_for_backend || (set "EXIT_CODE=1" & goto :stop)

call :log "Starting frontend on port %FRONTEND_PORT%..."
call :log "Backend:  http://localhost:%PORT%/api/v1"
call :log "Frontend: http://localhost:%FRONTEND_PORT%"
call :log "Press Ctrl+C to stop."
set "API_PROXY_TARGET=http://localhost:%PORT%"
pushd "%FRONTEND_DIR%"
call npm run dev
popd

:stop
call :stop_backend
exit /b %EXIT_CODE%

:log
echo [run-app] %~1
exit /b 0

:fail
echo [run-app] ERROR: %~1 1>&2
exit /b 1

:require_configuration
where node >nul 2>&1 || (call :fail "Node.js 22.13 or later is required." & exit /b 1)
where curl.exe >nul 2>&1 || (call :fail "curl.exe is required (included with Windows 10 1803 and later)." & exit /b 1)
if not defined SEED_PASSWORD if not exist "%BACKEND_DIR%\.env" (
  call :fail "Set SEED_PASSWORD (min 8 chars) or create backend\.env from backend\.env.example."
  exit /b 1
)
if not defined JWT_SECRET if not exist "%BACKEND_DIR%\.env" call :generate_jwt_secret || exit /b 1
exit /b 0

:generate_jwt_secret
for /f "usebackq delims=" %%s in (`powershell -NoProfile -NonInteractive -Command "$bytes = New-Object byte[] %JWT_SECRET_BYTES%; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes); -join ($bytes | ForEach-Object { $_.ToString('x2') })"`) do set "JWT_SECRET=%%s"
if not defined JWT_SECRET (
  call :fail "Could not generate a temporary JWT_SECRET."
  exit /b 1
)
call :log "Generated a temporary JWT_SECRET for this run."
exit /b 0

:install_if_missing
if exist "%~1\node_modules\.package-lock.json" exit /b 0
call :log "Installing dependencies in %~nx1\"
pushd "%~1"
call npm install
set "INSTALL_EXIT=%ERRORLEVEL%"
popd
if not "%INSTALL_EXIT%"=="0" (
  call :fail "npm install failed in %~nx1\."
  exit /b 1
)
exit /b 0

:ensure_port_free
call :find_backend_pid
if defined BACKEND_PID (
  call :fail "Port %PORT% is already in use (PID %BACKEND_PID%). Stop that process or set PORT."
  exit /b 1
)
exit /b 0

:find_backend_pid
set "BACKEND_PID="
for /f "tokens=5" %%p in ('netstat -ano -p TCP ^| findstr /r /c:":%PORT% .*LISTENING"') do (
  if not defined BACKEND_PID set "BACKEND_PID=%%p"
)
exit /b 0

:wait_for_backend
set /a "PING_COUNT=HEALTH_POLL_SECONDS + 1"
for /l %%a in (1,1,%HEALTH_MAX_ATTEMPTS%) do (
  curl.exe -fs -o NUL "%HEALTH_URL%" && exit /b 0
  ping -n %PING_COUNT% 127.0.0.1 >nul
)
call :fail "Backend did not become healthy at %HEALTH_URL%."
exit /b 1

:stop_backend
call :log "Stopping services..."
call :find_backend_pid
if defined BACKEND_PID taskkill /PID %BACKEND_PID% /T /F >nul 2>&1
exit /b 0
