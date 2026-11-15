"""Prépare le dossier web/ que Tauri embarque dans l'appli : python tools/sync_web.py

Le site en ligne (GitHub Pages) sert la racine du dépôt, donc les fichiers du jeu y restent.
web/ en est une copie propre, refaite à chaque compilation (il n'est pas dans git),
sans ce qui ne sert qu'au site (admin, tests, outils) et avec la police Outfit en local :
l'appli marche donc sans aucune connexion.
"""
import os
import re
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB = os.path.join(ROOT, 'web')

FILES = ['index.html', 'style.css', 'turbonix.css', 'logo.svg', 'favicon.png', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'versions.json'] + [f for f in os.listdir(ROOT) if f.startswith('CHANGELOG') and f.endswith('.md')]
DIRS = ['JS', 'assets']

if os.path.isdir(WEB):
    shutil.rmtree(WEB)
os.makedirs(WEB)

for f in FILES:
    shutil.copy2(os.path.join(ROOT, f), os.path.join(WEB, f))
for d in DIRS:
    shutil.copytree(os.path.join(ROOT, d), os.path.join(WEB, d))

# La police Google Fonts devient la police locale
p = os.path.join(WEB, 'index.html')
html = open(p, encoding='utf-8').read()
html = re.sub(r'\s*<link rel="preconnect" href="https://fonts\.[a-z.]+"[^>]*>', '', html)
html = re.sub(r'<link href="https://fonts\.googleapis\.com/[^"]*" rel="stylesheet">', '<link rel="stylesheet" href="assets/fonts/outfit.css">', html)
assert 'googleapis' not in html and 'gstatic' not in html
open(p, 'w', encoding='utf-8', newline='').write(html)

n = sum(len(files) for _, _, files in os.walk(WEB))
print('web/ prêt : %d fichiers' % n)
