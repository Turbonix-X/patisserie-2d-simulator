"""Fabrique latest.json à partir de l'installeur signé : python tools/make_latest_json.py <version> [notes] [etiquette]

L'installeur et latest.json sont aussi copiés dans downloads/, envoyé avec le site (Cloudflare Pages) :
l'appli Windows se met à jour depuis p2ds.pages.dev, et le bouton « Installer l'appli » y télécharge Installer-P2DS.exe.
Plus rien ne dépend de GitHub : le dépôt peut être privé."""
import glob
import json
import os
import shutil
import sys
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://p2ds.pages.dev/'
version = sys.argv[1].lstrip('v')
notes = sys.argv[2] if len(sys.argv) > 2 else 'Voir CHANGELOG.md'
# L'etiquette de la Release peut differer du numero Tauri (1.2.1.1 n'est pas un numero x.y.z valide)
tag = sys.argv[3] if len(sys.argv) > 3 else 'v' + version
setup = glob.glob(os.path.join(ROOT, 'src-tauri', 'target', 'release', 'bundle', 'nsis', '*_' + version + '_*-setup.exe'))[0]
sig = open(setup + '.sig', encoding='utf-8').read().strip()
name = os.path.basename(setup)
latest = {
    'version': version,
    'notes': notes,
    'pub_date': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
    'platforms': {
        'windows-x86_64': {
            'signature': sig,
            'url': SITE + 'downloads/' + name,
        }
    },
}
out = os.path.join(ROOT, 'src-tauri', 'target', 'release', 'bundle', 'nsis', 'latest.json')
open(out, 'w', encoding='utf-8').write(json.dumps(latest, indent=2, ensure_ascii=False))
print(out)

# Pour le site : latest.json et les installeurs (seulement le dernier, nom stable pour le bouton de telechargement)
dl = os.path.join(ROOT, 'downloads')
if os.path.isdir(dl):
    for f in os.listdir(dl):
        os.remove(os.path.join(dl, f))
os.makedirs(dl, exist_ok=True)
shutil.copy2(setup, os.path.join(dl, name))
shutil.copy2(setup, os.path.join(dl, 'Installer-P2DS.exe'))
shutil.copy2(out, os.path.join(dl, 'latest.json'))
print('downloads/ pret :', ', '.join(sorted(os.listdir(dl))))
