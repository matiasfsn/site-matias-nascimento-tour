@echo off
cd /d "%~dp0"
if not exist package.json (
  echo ERRO: package.json nao encontrado nesta pasta.
  pause
  exit /b 1
)
echo Instalando dependencias...
npm install
echo.
echo Iniciando o site...
npm run dev
pause
