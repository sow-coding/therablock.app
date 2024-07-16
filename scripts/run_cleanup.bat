@echo off
:: Vérifier si l'utilisateur a les droits administratifs
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Demande de privilèges administratifs...
    powershell -Command "Start-Process cmd -ArgumentList '/c %~fnx0' -Verb runAs"
    exit /b
)
:: Exécuter cleanup.exe
"%~dp0cleanup.exe"
