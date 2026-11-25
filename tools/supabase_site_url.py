"""Met l'adresse du site (Site URL) de Supabase sur Cloudflare : python tools/supabase_site_url.py

C'est l'adresse des liens des e-mails (confirmation d'inscription, mot de passe oublie). Elle pointait sur GitHub Pages,
qui s'arrete quand le depot devient prive. Le jeton est dans private/supabase.env (comme pour supabase_sql.py).
Les adresses autorisees pour la connexion (uri_allow_list) ne changent pas."""
import json
import os
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF = 'ghvqtxghqwprzsiwkhja'
NEW = 'https://p2ds.pages.dev/'
tok = ''
for line in open(os.path.join(ROOT, 'private', 'supabase.env'), encoding='utf-8'):
    if line.startswith('SUPABASE_ACCESS_TOKEN='):
        tok = line.split('=', 1)[1].strip().strip('"\'')
url = 'https://api.supabase.com/v1/projects/%s/config/auth' % REF
head = {'Authorization': 'Bearer ' + tok, 'Content-Type': 'application/json', 'User-Agent': 'p2ds-site-url'}
cur = json.load(urllib.request.urlopen(urllib.request.Request(url, headers=head)))
print('avant :', cur.get('site_url'))
if cur.get('site_url') != NEW:
    req = urllib.request.Request(url, data=json.dumps({'site_url': NEW}).encode(), headers=head, method='PATCH')
    urllib.request.urlopen(req).read()
    cur = json.load(urllib.request.urlopen(urllib.request.Request(url, headers=head)))
print('apres :', cur.get('site_url'))
