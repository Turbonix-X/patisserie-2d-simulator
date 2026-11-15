import os, re, sys, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
version = sys.argv[1]
idx = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
core = ['./', 'index.html', 'logo.svg', 'favicon.png', 'turbonix.css'] + [f for f in os.listdir(ROOT) if f.startswith('CHANGELOG') and f.endswith('.md')]
for m in re.finditer(r'(?:src|href)="((?:JS/|style\.css)[^"]*)"', idx):
    core.append(m.group(1))
assets = []
for d, _, files in os.walk(os.path.join(ROOT, 'assets')):
    for f in files:
        assets.append(os.path.relpath(os.path.join(d, f), ROOT).replace('\\', '/'))
core = sorted(set(core))
assets = sorted(assets)
sw = """/* Jeu hors ligne : tout ce que le jeu utilise est gardé dans le navigateur.
   Avec du réseau, on prend toujours la version la plus récente. Sans réseau, on prend ce qui est gardé. */
var CACHE = 'p2ds-%s';
var CORE = %s;
var ASSETS = %s;

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) {
    // Les fichiers du jeu d'abord (il faut qu'ils y soient tous), puis les icônes (au mieux)
    return c.addAll(CORE).then(function() { return Promise.all(ASSETS.map(function(u) { return c.add(u).catch(function() {}); })); });
  }).then(function() { return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k) { return k !== CACHE && k.indexOf('p2ds-') === 0; }).map(function(k) { return caches.delete(k); }));
  }).then(function() { return self.clients.claim(); }));
});

function withTimeout(req, ms) {
  return new Promise(function(resolve, reject) {
    var timer = setTimeout(function() { reject(new Error('timeout')); }, ms);
    fetch(req).then(function(r) { clearTimeout(timer); resolve(r); }, function(err) { clearTimeout(timer); reject(err); });
  });
}

self.addEventListener('fetch', function(e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  var isFont = /fonts\\.(googleapis|gstatic)\\.com$/.test(url.hostname);
  if (!sameOrigin && !isFont) return;
  e.respondWith(
    withTimeout(req, sameOrigin ? 4000 : 6000).then(function(res) {
      if (res && (res.ok || res.type === 'opaque')) { var copy = res.clone(); caches.open(CACHE).then(function(c) { c.put(req, copy); }); }
      return res;
    }).catch(function() {
      return caches.match(req).then(function(hit) {
        return hit || caches.match(req, { ignoreSearch: true }).then(function(h2) { return h2 || (req.mode === 'navigate' ? caches.match('index.html') : Response.error()); });
      });
    })
  );
});
""" % (version, json.dumps(core), json.dumps(assets))
open(os.path.join(ROOT, 'sw.js'), 'w', encoding='utf-8', newline='').write(sw)
print(len(core), len(assets))
