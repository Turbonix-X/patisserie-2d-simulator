"""Transforme les CHANGELOG*.md en changelog.json : python tools/build_changelog_json.py

Un seul fichier, réutilisable partout (page Présentation du site, jeu, appli) :
{ "fr": { "title": "...", "intro": "...", "versions": [ { "title": "Release 1.2.3 (15 novembre 2026)", "name": "Release 1.2.3",
  "intro": "...", "groups": [ { "name": "Jeu", "items": ["..."] } ] } ] }, "en": {...} }
Les notes privées (CHANGELOG-SECRET*) n'y sont jamais."""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def parse(md):
    parts = re.split(r'\r?\n(?=## )', md.strip())
    head = parts.pop(0)
    lines = [l for l in head.splitlines() if l.strip()]
    title = lines[0].lstrip('# ').strip() if lines else ''
    intro = ' '.join(l.strip() for l in lines[1:])
    versions = []
    for sec in parts:
        ls = sec.splitlines()
        vt = ls[0][3:].strip()
        v = {'title': vt, 'name': re.sub(r'\s*\(.*$', '', vt), 'intro': '', 'groups': []}
        cur = None
        for l in ls[1:]:
            s = l.strip()
            if not s:
                continue
            m = re.match(r'^\*\*(.+?)\*\*$', s)
            if m:
                cur = {'name': m.group(1), 'items': []}
                v['groups'].append(cur)
            elif s.startswith('- '):
                if cur is None:
                    cur = {'name': '', 'items': []}
                    v['groups'].append(cur)
                cur['items'].append(s[2:].strip())
            elif cur is None:
                v['intro'] = (v['intro'] + ' ' + s).strip()
        versions.append(v)
    return {'title': title, 'intro': intro, 'versions': versions}


out = {}
for f in sorted(os.listdir(ROOT)):
    m = re.match(r'^CHANGELOG(?:\.([a-z]{2}))?\.md$', f)
    if m:
        out[m.group(1) or 'fr'] = parse(open(os.path.join(ROOT, f), encoding='utf-8').read())
json.dump(out, open(os.path.join(ROOT, 'changelog.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('changelog.json :', ', '.join('%s=%d' % (k, len(v['versions'])) for k, v in out.items()))
