"""Envoie un fichier SQL à ta base Supabase, sans rien copier-coller : python tools/supabase_sql.py private/admin-notes.sql

Il faut une seule fois un jeton d'accès Supabase, dans le fichier private/supabase.env (jamais dans git) :
    SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxx
Création du jeton : https://supabase.com/dashboard/account/tokens (« Generate new token »).
Les fichiers du projet (supabase_setup.sql, private/admin-notes.sql) peuvent être relancés sans risque."""
import json
import os
import re
import sys
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def token():
    p = os.path.join(ROOT, 'private', 'supabase.env')
    if os.path.isfile(p):
        for line in open(p, encoding='utf-8'):
            if line.strip().startswith('SUPABASE_ACCESS_TOKEN='):
                return line.split('=', 1)[1].strip().strip('"\'')
    return os.environ.get('SUPABASE_ACCESS_TOKEN', '')


def project_ref():
    cfg = open(os.path.join(ROOT, 'JS', 'Config.js'), encoding='utf-8').read()
    return re.search(r"SUPABASE_URL:\s*'https://([a-z0-9]+)\.supabase\.co", cfg).group(1)


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    tk = token()
    if not tk:
        raise SystemExit("Pas de jeton : crée private/supabase.env avec SUPABASE_ACCESS_TOKEN=... (voir l'aide du fichier)")
    sql = sys.argv[2] if len(sys.argv) > 2 and sys.argv[1] == '-c' else open(sys.argv[1], encoding='utf-8').read()
    req = urllib.request.Request('https://api.supabase.com/v1/projects/%s/database/query' % project_ref(), data=json.dumps({'query': sql}).encode('utf-8'),
                                 headers={'Authorization': 'Bearer ' + tk, 'Content-Type': 'application/json', 'User-Agent': 'p2ds-tools'}, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            body = r.read().decode('utf-8', 'replace')
            print('OK (%d) : %s envoyé à Supabase' % (r.status, sys.argv[1]))
            if body.strip() not in ('', '[]'):
                print(body[:6000])
    except urllib.error.HTTPError as e:
        raise SystemExit('Supabase a refusé (%d) : %s' % (e.code, e.read().decode('utf-8', 'replace')[:400]))


if __name__ == '__main__':
    main()
