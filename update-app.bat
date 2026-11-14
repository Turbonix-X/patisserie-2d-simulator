@echo off
rem ============================================================
rem  Publie une nouvelle version de l'appli Windows, depuis ce PC :
rem     update-app.bat 1.2.1
rem  Il compile, signe, fabrique latest.json et les depose sur la Release GitHub.
rem  Il faut : Rust, la CLI GitHub (gh, deja connectee) et la cle C:\Users\<toi>\.tauri\p2ds.key
rem ============================================================
setlocal
if "%~1"=="" (
  echo Usage : update-app.bat NUMERO_DE_VERSION   par exemple  update-app.bat 1.2.1
  exit /b 1
)
set VERSION=%~1
cd /d "%~dp0"

rem Le meme numero partout
python -c "import json,re;p='src-tauri/tauri.conf.json';d=json.load(open(p,encoding='utf-8'));d['version']='%VERSION%';json.dump(d,open(p,'w',encoding='utf-8'),indent=2,ensure_ascii=False)" || exit /b 1
python -c "import re;p='src-tauri/Cargo.toml';s=open(p,encoding='utf-8').read();s=re.sub(r'(?m)^version = \".*\"','version = \"%VERSION%\"',s,count=1);open(p,'w',encoding='utf-8').write(s)" || exit /b 1

python tools\sync_web.py || exit /b 1
set TAURI_SIGNING_PRIVATE_KEY=%USERPROFILE%\.tauri\p2ds.key
set TAURI_SIGNING_PRIVATE_KEY_PASSWORD=
cargo tauri build || exit /b 1

python tools\make_latest_json.py %VERSION% || exit /b 1
for %%f in (src-tauri\target\release\bundle\nsis\*-setup.exe) do copy /y "%%f" Installer-P2DS.exe >nul

gh release create v%VERSION% --title "P2DS v%VERSION%" --notes "Voir CHANGELOG.md" src-tauri\target\release\bundle\nsis\*-setup.exe src-tauri\target\release\bundle\nsis\latest.json Installer-P2DS.exe || exit /b 1
echo.
echo Version %VERSION% publiee : les joueurs deja installes la recevront toute seule.
endlocal
