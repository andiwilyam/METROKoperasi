@echo off
title MetroCoop Staging Server
cd /d "%~dp0"

echo ============================================
echo   MetroCoop — Staging Server
echo ============================================
echo.

:: 1. Build production
echo [1/4] Building production assets...
call npm run build:all
if %errorlevel% neq 0 (
    echo Build gagal! Periksa error di atas.
    pause
    exit /b 1
)
echo Build sukses!
echo.

:: 2. Kill existing server/ngrok if any
echo [2/4] Menghentikan proses lama...
taskkill /f /im node.exe 2>nul
taskkill /f /im ngrok.exe 2>nul
timeout /t 2 /nobreak >nul
echo.

:: 3. Start production server
echo [3/4] Menjalankan production server...
start "MetroCoop Server" cmd /c "node dist/server.cjs"
timeout /t 3 /nobreak >nul
echo Server berjalan di http://localhost:3000
echo.

:: 4. Start ngrok tunnel
echo [4/4] Menjalankan ngrok tunnel...
start "ngrok" cmd /c "C:\Users\ASUS NUC\Desktop\ngrok.exe http 3000 --log=stdout"
timeout /t 6 /nobreak >nul

:: Ambil URL ngrok dari API lokal
set NGROK_URL=http://localhost:4040
for /f "tokens=*" %%a in ('curl -s http://127.0.0.1:4040/api/tunnels 2^>nul ^| findstr "public_url"') do (
    echo %%a
)
if %errorlevel% neq 0 (
    set PUBLIC_URL=https://pushing-quirk-hyperlink.ngrok-free.dev
) else (
    for /f "tokens=*" %%b in ('curl -s http://127.0.0.1:4040/api/tunnels 2^>nul') do echo %%b
)

echo.
echo ============================================
echo   ✅ STAGING RUNNING!
echo   Lokal:   http://localhost:3000
echo   Publik:  https://pushing-quirk-hyperlink.ngrok-free.dev
echo   Panel:   http://127.0.0.1:4040
echo ============================================
echo.
echo Tekan tombol apa saja untuk menghentikan server...
pause >nul

:: Cleanup
echo Menghentikan server...
taskkill /f /im node.exe 2>nul
taskkill /f /im ngrok.exe 2>nul
echo Server dihentikan.
