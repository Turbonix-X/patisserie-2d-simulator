"""Garde une copie de la version actuelle dans ../Versions/Folders : python tools/archive_version.py
Le dossier s'appelle « P2DS <version> » (par exemple « P2DS Release 1.2.1.1 »).
On n'y met ni .git, ni node_modules, ni web/, ni la compilation Rust (src-tauri/target) : ils sont refaits a la demande."""
import os
import re
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEST_ROOT = os.path.join(os.path.dirname(ROOT), 'Versions', 'Folders')
version = re.search(r"GAME_VERSION\s*=\s*'([^']+)'", open(os.path.join(ROOT, 'JS', 'GameData.js'), encoding='utf-8').read()).group(1)
dest = os.path.join(DEST_ROOT, 'P2DS ' + version)
SKIP = {'.git', 'node_modules', 'web', '.claude'}
SKIP_PATHS = {os.path.join('src-tauri', 'target'), os.path.join('src-tauri', 'gen')}

def ignore(folder, names):
    rel = os.path.relpath(folder, ROOT)
    out = [n for n in names if n in SKIP or os.path.normpath(os.path.join(rel, n)) in SKIP_PATHS]
    return out

if os.path.isdir(dest):
    shutil.rmtree(dest)
shutil.copytree(ROOT, dest, ignore=ignore)
print('copie dans', dest)
