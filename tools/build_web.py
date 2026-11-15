"""Prépare le site en ligne (Cloudflare Pages) : python tools/build_web.py [--no-obfuscate] [--with-tests]

Sort dans dist/ (pas dans git) : seulement ce que le navigateur doit recevoir.
 - le code JavaScript du jeu est brouillé (javascript-obfuscator) pour qu'on ne puisse pas le lire directement ;
   les noms globaux sont gardés (le HTML appelle des fonctions par leur nom), les fichiers de langues restent en clair ;
 - on n'y met ni l'installeur, ni les notes privées, ni les tests, ni les outils, ni la compilation de l'appli ;
 - on vérifie qu'aucun fichier ne dépasse la limite de Cloudflare Pages (25 Mo).
Le dossier web/ de l'appli Windows (tools/sync_web.py) n'est pas touché : l'appli garde le code en clair.
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')
LIMIT = 25 * 1024 * 1024

FILES = ['index.html', 'admin.html', 'presentation.html', 'archives.html', 'style.css', 'turbonix.css', 'logo.svg', 'favicon.png', 'manifest.webmanifest',
         'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'sw.js', 'versions.json', 'archives.json', 'downloads.json', 'changelog.json', '_headers']
FILES += [f for f in os.listdir(ROOT) if f.startswith('CHANGELOG') and f.endswith('.md')]
DIRS = ['JS', 'assets']


def is_lang(name):
    # Lang11.js, LangFR.js... : que des textes. Languages.js contient du code : il est brouillé.
    return name.startswith('Lang') and name != 'Languages.js'


def main():
    obfuscate = '--no-obfuscate' not in sys.argv
    if os.path.isdir(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)
    for f in FILES:
        src = os.path.join(ROOT, f)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(DIST, f))
        elif f not in ('presentation.html', 'archives.html', 'versions.json', 'archives.json', 'downloads.json', 'changelog.json', '_headers', 'admin.html'):
            raise SystemExit('fichier manquant : ' + f)
    for d in DIRS:
        shutil.copytree(os.path.join(ROOT, d), os.path.join(DIST, d))
    if '--with-tests' in sys.argv:
        shutil.copytree(os.path.join(ROOT, 'tests'), os.path.join(DIST, 'tests'))

    if obfuscate:
        js_dir = os.path.join(DIST, 'JS')
        todo = [n for n in os.listdir(js_dir) if n.endswith('.js') and not is_lang(n)]
        with tempfile.TemporaryDirectory() as tmp:
            stage_in, stage_out = os.path.join(tmp, 'in'), os.path.join(tmp, 'out')
            os.makedirs(stage_in)
            for n in todo:
                shutil.copy2(os.path.join(js_dir, n), os.path.join(stage_in, n))
            cmd = 'npx --yes javascript-obfuscator@4.1.1 "%s" --output "%s" --config "%s"' % (stage_in, stage_out, os.path.join(ROOT, 'tools', 'obfuscator.json'))
            r = subprocess.run(cmd, shell=True, cwd=ROOT)
            if r.returncode != 0:
                raise SystemExit('Le brouillage a échoué')
            for n in todo:
                out = os.path.join(stage_out, n)
                if not os.path.exists(out):
                    raise SystemExit('pas de sortie pour ' + n)
                shutil.copy2(out, os.path.join(js_dir, n))
        print('JS brouillé : %d fichiers (les fichiers de langues restent en clair)' % len(todo))

    total, count, biggest = 0, 0, (0, '')
    for d, _, files in os.walk(DIST):
        for f in files:
            p = os.path.join(d, f)
            size = os.path.getsize(p)
            total += size
            count += 1
            if size > biggest[0]:
                biggest = (size, os.path.relpath(p, DIST))
            if size > LIMIT:
                raise SystemExit('Trop gros pour Cloudflare Pages (25 Mo) : ' + p)
    print('dist/ prêt : %d fichiers, %.1f Mo, plus gros fichier : %s (%.2f Mo)' % (count, total / 1e6, biggest[1], biggest[0] / 1e6))
    if count > 20000:
        raise SystemExit('Plus de 20 000 fichiers : trop pour Cloudflare Pages')


if __name__ == '__main__':
    main()
