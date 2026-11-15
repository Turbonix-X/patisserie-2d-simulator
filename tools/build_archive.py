"""Prépare les anciennes versions jouables en ligne : python tools/build_archive.py

Lit chaque dossier de ../Versions/Folders (« P2DS Release 1.2.3 »...), n'en garde que ce que le navigateur
a besoin (pas la compilation, pas les installeurs, pas les notes privées), et écrit :
 - archive-dist/<version>/... : à déployer dans le 2e projet Cloudflare Pages (une autre adresse que le jeu :
   ainsi une vieille version ne peut jamais toucher à ta sauvegarde actuelle) ;
 - versions.json : nom de version -> adresse, que le changelog du jeu et la page « Archives » lisent.
Une version dont le dossier n'existe pas n'a simplement pas de lien.
Les réglages (adresse du projet d'archives...) sont dans tools/cloudflare.json.
"""
import datetime
import json
import os
import re
import shutil
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOLDERS = os.path.join(os.path.dirname(ROOT), 'Versions', 'Folders')
OUT = os.path.join(ROOT, 'archive-dist')
CFG = json.load(open(os.path.join(ROOT, 'tools', 'cloudflare.json'), encoding='utf-8'))
BASE = CFG['archiveUrl'].rstrip('/')

SKIP_DIRS = {'.git', '.claude', 'node_modules', 'src-tauri', 'web', 'tests', 'tools', 'private', 'target', 'dist', 'archive-dist', 'Versions'}
KEEP_EXT = {'.html', '.js', '.css', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.ico', '.gif', '.json', '.webmanifest', '.woff', '.woff2', '.ttf', '.mp3', '.ogg', '.wav', '.md', '.txt'}
SKIP_FILES = {'sw.js'}
LIMIT = 25 * 1024 * 1024


MONTHS = {'janvier': 1, 'fevrier': 2, 'mars': 3, 'avril': 4, 'mai': 5, 'juin': 6, 'juillet': 7, 'aout': 8, 'septembre': 9, 'octobre': 10, 'novembre': 11, 'decembre': 12}


def norm(s):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower()).strip()


def changelog_dates():
    """Date de sortie de chaque version, lue dans CHANGELOG.md (« ## Release 1.2.3 (15 novembre 2026) »)."""
    out = {}
    for m in re.finditer(r'^## (.+?) \((\d+)(?:er)? ([^\s)]+) (\d{4})\)', open(os.path.join(ROOT, 'CHANGELOG.md'), encoding='utf-8').read(), re.M):
        mo = MONTHS.get(norm(m.group(3)))
        if mo:
            out[norm(m.group(1))] = '%s-%02d-%02d' % (m.group(4), mo, int(m.group(2)))
    return out


def slug(name):
    return re.sub(r'[^a-z0-9.]+', '-', name.lower()).strip('-')


def entry_of(folder):
    """(dossier à copier, page d'accueil) : certaines versions n'ont que leur copie web/ ou un nom de page particulier."""
    for base in (folder, os.path.join(folder, 'web')):
        for rel in ('index.html', 'HTML/index.html', 'P2DS-Website.html'):
            if os.path.isfile(os.path.join(base, rel)):
                return base, rel
    h = os.path.join(folder, 'HTML')
    if os.path.isdir(h):
        pages = sorted(f for f in os.listdir(h) if f.lower().endswith('.html'))
        if pages:
            return folder, 'HTML/' + pages[0]
    return None, None


def copy_web(src, dst):
    n = 0
    for d, dirs, files in os.walk(src):
        dirs[:] = [x for x in dirs if x not in SKIP_DIRS]
        for f in files:
            if f in SKIP_FILES or 'SECRET' in f or os.path.splitext(f)[1].lower() not in KEEP_EXT:
                continue
            p = os.path.join(d, f)
            if os.path.getsize(p) > LIMIT:
                continue
            q = os.path.join(dst, os.path.relpath(p, src))
            os.makedirs(os.path.dirname(q), exist_ok=True)
            shutil.copy2(p, q)
            n += 1
    return n


def main():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)
    versions, total, rows = {}, 0, []
    dates = changelog_dates()
    for name in sorted(os.listdir(FOLDERS)):
        folder = os.path.join(FOLDERS, name)
        if not (os.path.isdir(folder) and name.startswith('P2DS ')):
            continue
        version = name[5:]
        src, entry = entry_of(folder)
        if not entry:
            print('pas de page d\'accueil, ignorée :', name)
            continue
        s = slug(version)
        n = copy_web(src, os.path.join(OUT, s))
        versions[version] = '%s/%s/%s' % (BASE, s, entry)
        mt = os.path.getmtime(os.path.join(src, entry))
        day = dates.get(norm(version)) or datetime.date.fromtimestamp(mt).isoformat()
        rows.append({'name': version, 'url': versions[version], 'date': day, '_t': mt})
        total += n
        print('%-28s %5d fichiers' % (version, n))
    # Une petite page d'accueil pour ce projet : elle renvoie vers la page Archives du jeu
    open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(
        '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>P2DS - Archives</title>'
        '<meta http-equiv="refresh" content="0;url=%s/archives.html"><a href="%s/archives.html">P2DS - Archives</a>' % (CFG['siteUrl'].rstrip('/'), CFG['siteUrl'].rstrip('/')))
    rows.sort(key=lambda r: (r['date'], tuple(int(x) for x in re.findall(r'\d+', r['name'])) if re.match(r'(Alpha|Beta)', r['name']) else (), r['_t']), reverse=True)
    for r in rows:
        del r['_t']
    json.dump(rows, open(os.path.join(ROOT, 'archives.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    json.dump(versions, open(os.path.join(ROOT, 'versions.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    count = sum(len(f) for _, _, f in os.walk(OUT))
    size = sum(os.path.getsize(os.path.join(d, f)) for d, _, fs in os.walk(OUT) for f in fs)
    print('%d versions, %d fichiers, %.1f Mo -> archive-dist/ et versions.json' % (len(versions), count, size / 1e6))
    if count > 20000:
        print('ATTENTION : plus de 20 000 fichiers, Cloudflare Pages refusera. Il faudra répartir en plusieurs projets.')


if __name__ == '__main__':
    main()
