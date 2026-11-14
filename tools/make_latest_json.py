"""Fabrique latest.json à partir de l'installeur signé : python tools/make_latest_json.py <version> [notes]
Utilisé par update-app.bat (le workflow GitHub le fait déjà tout seul)."""
import glob
import json
import os
import sys
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = 'Turbonix-X/patisserie-2d-simulator'
version = sys.argv[1].lstrip('v')
notes = sys.argv[2] if len(sys.argv) > 2 else 'Voir CHANGELOG.md'
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
            'url': 'https://github.com/%s/releases/download/v%s/%s' % (REPO, version, name),
        }
    },
}
out = os.path.join(ROOT, 'src-tauri', 'target', 'release', 'bundle', 'nsis', 'latest.json')
open(out, 'w', encoding='utf-8').write(json.dumps(latest, indent=2, ensure_ascii=False))
print(out)
