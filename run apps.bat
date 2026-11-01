@echo off
title Start Customer Queue Management
cd /d "%~dp0"

echo Checking MongoDB...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% neq 0 (
  net start MongoDB >nul 2>&1
)
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% neq 0 (
  if "%MONGODB_URI%"=="" (
    echo.
    echo  PERINGATAN: MongoDB belum berjalan / belum terinstall.
    echo  Install MongoDB dulu, lalu jalankan file ini lagi.
    echo.
    pause
    exit /b 1
  )
)

rem Angular 10 needs this on Node 17 or newer
node -e "process.exit(+process.versions.node.split('.')[0]>=17?0:1)"
if %errorlevel% equ 0 set NODE_OPTIONS=--openssl-legacy-provider

if not exist "testing-api\node_modules\mongoose" (
  echo Installing API packages...
  pushd testing-api & call npm install & popd
)
if not exist "testing-app\node_modules\@angular\core" (
  echo Installing Angular packages - sekali saja, agak lama...
  pushd testing-app & call npm install --legacy-peer-deps & popd
)

echo Starting API (port 3000)...
start "Testing API - jangan ditutup" cmd /k "cd /d "%~dp0testing-api" && npm start"

echo Starting Angular app (port 4200)... browser akan terbuka otomatis.
start "Testing App - jangan ditutup" cmd /k "cd /d "%~dp0testing-app" && npx ng serve --open"

echo.
echo Dua jendela baru sudah dibuka. Biarkan keduanya tetap terbuka.
echo Website: http://localhost:4200  (tunggu sampai "Compiled successfully")
echo.
timeout /t 10
