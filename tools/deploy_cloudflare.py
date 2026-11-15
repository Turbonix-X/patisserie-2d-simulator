"""Met le jeu et les archives en ligne sur Cloudflare Pages : python tools/deploy_cloudflare.py [site|archive|all]

Demande d'être connecté (npx wrangler login, une seule fois). Reconstruit dist/ (JS brouillé) et archive-dist/ avant d'envoyer.
Les noms des projets viennent de tools/cloudflare.json."""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CFG = json.load(open(os.path.join(ROOT, 'tools', 'cloudflare.json'), encoding='utf-8'))
what = sys.argv[1] if len(sys.argv) > 1 else 'all'


def run(cmd):
    print('>', cmd)
    if subprocess.run(cmd, shell=True, cwd=ROOT).returncode != 0:
        raise SystemExit('Échec : ' + cmd)


run('python tools/build_changelog_json.py')
if what in ('archive', 'all'):
    run('python tools/build_archive.py')
if what in ('site', 'all'):
    run('python tools/build_web.py')
if what in ('archive', 'all'):
    run('npx wrangler pages deploy archive-dist --project-name %s --branch main --commit-dirty=true' % CFG['archiveProject'])
if what in ('site', 'all'):
    run('npx wrangler pages deploy dist --project-name %s --branch main --commit-dirty=true' % CFG['siteProject'])
