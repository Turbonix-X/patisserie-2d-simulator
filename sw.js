/* Jeu hors ligne : tout ce que le jeu utilise est gardé dans le navigateur.
   Avec du réseau, on prend toujours la version la plus récente. Sans réseau, on prend ce qui est gardé. */
var CACHE = 'p2ds-1.1.1';
var CORE = ["./", "CHANGELOG-SECRET.md", "CHANGELOG.md", "JS/Achievements.js?v=3.12", "JS/Bank.js?v=3.12", "JS/Bob.js?v=3.12", "JS/Charts.js?v=3.12", "JS/Console.js?v=3.12", "JS/Decor.js?v=3.12", "JS/GameData.js?v=3.12", "JS/Icons.js?v=3.12", "JS/Interface.js?v=3.12", "JS/Lang11.js?v=3.12", "JS/Lang111.js?v=3.12", "JS/LangAR.js?v=3.12", "JS/LangDE.js?v=3.12", "JS/LangES.js?v=3.12", "JS/LangJA.js?v=3.12", "JS/LangKO.js?v=3.12", "JS/LangPT.js?v=3.12", "JS/LangRU.js?v=3.12", "JS/LangZH.js?v=3.12", "JS/Languages.js?v=3.12", "JS/Logic.js?v=3.12", "JS/Menus.js?v=3.12", "JS/Music.js?v=3.12", "JS/Orders.js?v=3.12", "JS/PlayerData.js?v=3.12", "JS/Staff.js?v=3.12", "JS/main.js?v=3.12", "favicon.png", "index.html", "logo.svg", "style.css?v=3.12", "turbonix.css"];
var ASSETS = ["assets/icons/1f1e7-1f1f7.svg", "assets/icons/1f1e8-1f1f3.svg", "assets/icons/1f1e9-1f1ea.svg", "assets/icons/1f1ea-1f1f8.svg", "assets/icons/1f1eb-1f1f7.svg", "assets/icons/1f1ee-1f1f3.svg", "assets/icons/1f1ef-1f1f5.svg", "assets/icons/1f1f0-1f1f7.svg", "assets/icons/1f1f5-1f1f9.svg", "assets/icons/1f1f7-1f1fa.svg", "assets/icons/1f1f8-1f1e6.svg", "assets/icons/1f1fa-1f1f8.svg", "assets/icons/1f300.svg", "assets/icons/1f306.svg", "assets/icons/1f308.svg", "assets/icons/1f30b.svg", "assets/icons/1f30d.svg", "assets/icons/1f319.svg", "assets/icons/1f31f.svg", "assets/icons/1f330.svg", "assets/icons/1f331.svg", "assets/icons/1f334.svg", "assets/icons/1f336.svg", "assets/icons/1f338.svg", "assets/icons/1f339.svg", "assets/icons/1f33a.svg", "assets/icons/1f33c.svg", "assets/icons/1f33e.svg", "assets/icons/1f33f.svg", "assets/icons/1f342.svg", "assets/icons/1f344.svg", "assets/icons/1f34a.svg", "assets/icons/1f34b.svg", "assets/icons/1f34e.svg", "assets/icons/1f353.svg", "assets/icons/1f368.svg", "assets/icons/1f369.svg", "assets/icons/1f36a.svg", "assets/icons/1f36b.svg", "assets/icons/1f36c.svg", "assets/icons/1f36e.svg", "assets/icons/1f36f.svg", "assets/icons/1f370.svg", "assets/icons/1f375.svg", "assets/icons/1f376.svg", "assets/icons/1f381.svg", "assets/icons/1f382.svg", "assets/icons/1f388.svg", "assets/icons/1f389.svg", "assets/icons/1f3ad.svg", "assets/icons/1f3ae.svg", "assets/icons/1f3af.svg", "assets/icons/1f3b5.svg", "assets/icons/1f3c5.svg", "assets/icons/1f3c6.svg", "assets/icons/1f3d4.svg", "assets/icons/1f3d6.svg", "assets/icons/1f3d7.svg", "assets/icons/1f3dd.svg", "assets/icons/1f3e0.svg", "assets/icons/1f3e2.svg", "assets/icons/1f3e6.svg", "assets/icons/1f3ea.svg", "assets/icons/1f3ec.svg", "assets/icons/1f3ed.svg", "assets/icons/1f3f0.svg", "assets/icons/1f413.svg", "assets/icons/1f42e.svg", "assets/icons/1f446.svg", "assets/icons/1f451.svg", "assets/icons/1f465.svg", "assets/icons/1f468-200d-1f373.svg", "assets/icons/1f47b.svg", "assets/icons/1f48e.svg", "assets/icons/1f49c.svg", "assets/icons/1f4a5.svg", "assets/icons/1f4ab.svg", "assets/icons/1f4ad.svg", "assets/icons/1f4af.svg", "assets/icons/1f4b0.svg", "assets/icons/1f4b5.svg", "assets/icons/1f4b6.svg", "assets/icons/1f4b8.svg", "assets/icons/1f4c8.svg", "assets/icons/1f4d0.svg", "assets/icons/1f50d.svg", "assets/icons/1f512.svg", "assets/icons/1f51f.svg", "assets/icons/1f525.svg", "assets/icons/1f52c.svg", "assets/icons/1f5b1.svg", "assets/icons/1f5fc.svg", "assets/icons/1f62d.svg", "assets/icons/1f634.svg", "assets/icons/1f6aa.svg", "assets/icons/1f911.svg", "assets/icons/1f91d.svg", "assets/icons/1f92b.svg", "assets/icons/1f92f.svg", "assets/icons/1f943.svg", "assets/icons/1f947.svg", "assets/icons/1f950.svg", "assets/icons/1f95a.svg", "assets/icons/1f95b.svg", "assets/icons/1f95c.svg", "assets/icons/1f95e.svg", "assets/icons/1f965.svg", "assets/icons/1f96d.svg", "assets/icons/1f96e.svg", "assets/icons/1f9c0.svg", "assets/icons/1f9c1.svg", "assets/icons/1f9c8.svg", "assets/icons/1f9d1-200d-1f373.svg", "assets/icons/1f9d9.svg", "assets/icons/1f9fe.svg", "assets/icons/1fa77.svg", "assets/icons/1fa90.svg", "assets/icons/1fad3.svg", "assets/icons/1fad5.svg", "assets/icons/1fad8.svg", "assets/icons/1fada.svg", "assets/icons/231b.svg", "assets/icons/23f0.svg", "assets/icons/2600.svg", "assets/icons/2601.svg", "assets/icons/2615.svg", "assets/icons/267e.svg", "assets/icons/26a0.svg", "assets/icons/26a1.svg", "assets/icons/2728.svg", "assets/icons/2744.svg", "assets/icons/2b50.svg", "assets/icons/35-20e3.svg", "assets/icons/custom/brownie.svg", "assets/icons/custom/canele.svg", "assets/icons/custom/cannelle.svg", "assets/icons/custom/caramel.svg", "assets/icons/custom/caramelia.svg", "assets/icons/custom/chouquette.svg", "assets/icons/custom/eclair.svg", "assets/icons/custom/framboise.svg", "assets/icons/custom/macaron.svg", "assets/icons/custom/macaron_pistache.svg", "assets/icons/custom/meringue.svg", "assets/icons/custom/millefeuille.svg", "assets/icons/custom/pistache.svg", "assets/icons/custom/praline.svg", "assets/icons/custom/sugar_cube.svg", "assets/icons/custom/tarte_citron.svg", "assets/icons/custom/tarte_pomme.svg", "assets/icons/custom/wasabi.svg", "assets/icons/custom/yuzu.svg"];

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
  var isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
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
