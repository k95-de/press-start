@echo off
cd /d "%~dp0"
start "" http://localhost:5570/
python -m http.server 5570
