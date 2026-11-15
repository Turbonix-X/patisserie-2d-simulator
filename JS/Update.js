/* ============================================
   PATISSERIE 2D SIMULATOR - MISES A JOUR
   Le jeu verifie tout seul s'il existe une nouvelle version,
   Bob te previent, et le bouton du changelog la charge sans recharger la page.
   ============================================ */

var updateState = { newVersion: null, checking: false, told: false, applying: false };

// Une petite requete de temps en temps, jamais quand l'onglet est cache ou hors ligne : aucun lag
function checkForUpdate() {
  if (updateState.checking || updateState.applying || document.hidden || navigator.onLine === false) return;
  updateState.checking = true;
  // Dans l'appli Windows, c'est le programme qui regarde sur GitHub
  if (window.__TAURI_INTERNALS__) {
    window.__TAURI_INTERNALS__.invoke('check_update', {}).then(function(name) {
      updateState.checking = false;
      if (name && name !== GAME_VERSION) { updateState.newVersion = name; announceUpdate(); }
    }).catch(function() { updateState.checking = false; });
    return;
  }
  fetch('JS/GameData.js', { cache: 'no-store' }).then(function(r) { return r.ok ? r.text() : ''; }).then(function(txt) {
    updateState.checking = false;
    var m = txt.match(/GAME_VERSION\s*=\s*'([^']+)'/);
    if (m && m[1] !== GAME_VERSION) {
      updateState.newVersion = m[1];
      announceUpdate();
    }
  }).catch(function() { updateState.checking = false; });
}

function announceUpdate() {
  if (typeof renderHeader === 'function') renderHeader();
  if (typeof renderHome === 'function') renderHome(true);
  if (updateState.told || !G || introActive) return;
  updateState.told = true;
  if (typeof toast === 'function') toast(t('update.toast', { v: versionLabel(updateState.newVersion) }));
  if (typeof bobTell === 'function') bobTell(t('update.bob'));
}

// La boite de mise a jour, en haut du changelog
function updateBoxHTML() {
  if (!updateState.newVersion) return '';
  return '<div class="update-box"><b>' + t('update.available', { v: escH(versionLabel(updateState.newVersion)) }) + '</b><p>' + t('update.help') + '</p><button class="btn btn-primary" id="update-btn" onclick="applyUpdate()">' + t('update.btn') + '</button></div>';
}

// Recharge les scripts et le style sans recharger la page. Si la page elle-meme a change, on la recharge.
function applyUpdate() {
  if (updateState.applying) return;
  updateState.applying = true;
  var btn = document.getElementById('update-btn');
  if (btn) { btn.disabled = true; btn.textContent = t('update.applying'); }
  var fallback = function() { try { save(); } catch (e) { /* tant pis */ } location.reload(); };
  // Dans l'appli : on telecharge, on installe, et elle se relance toute seule
  if (window.__TAURI_INTERNALS__) {
    try { save(); } catch (e) { /* tant pis */ }
    window.__TAURI_INTERNALS__.invoke('install_update', {}).catch(function() {
      updateState.applying = false;
      if (btn) { btn.disabled = false; btn.textContent = t('update.btn'); }
      toast(t('update.failed'));
    });
    return;
  }
  fetch('index.html', { cache: 'no-store' }).then(function(r) { if (!r.ok) throw 0; return r.text(); }).then(function(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var mine = document.querySelector('meta[name="p2ds-markup"]'), theirs = doc.querySelector('meta[name="p2ds-markup"]');
    var scripts = [].slice.call(doc.querySelectorAll('script[src]')).map(function(s) { return s.getAttribute('src'); });
    var css = doc.querySelector('link[rel="stylesheet"][href^="style.css"]');
    // Si le contenu fixe de la page a change, on ne peut pas le remplacer a chaud
    if (!theirs || !mine || theirs.getAttribute('content') !== mine.getAttribute('content') || !scripts.length) return fallback();
    save();
    hideModal();
    if (typeof stopMusic === 'function') { try { stopMusic(); } catch (e) { /* pas grave */ } }
    var T = window.__tracked;
    if (T) {
      T.timers.forEach(function(id) { clearInterval(id); });
      T.listeners.forEach(function(l) { try { l[0].removeEventListener(l[1], l[2], l[3]); } catch (e) { /* pas grave */ } });
      T.timers = []; T.listeners = [];
    }
    softPause.on = false;
    try { sessionStorage.setItem('p2ds_resume', JSON.stringify(CUR)); } catch (e) { /* pas grave */ }
    var loadNext = function(i) {
      if (i >= scripts.length) return finish();
      var s = document.createElement('script');
      s.src = scripts[i];
      s.onload = function() { loadNext(i + 1); };
      s.onerror = function() { fallback(); };
      document.body.appendChild(s);
    };
    var finish = function() {
      if (css) {
        var link = document.querySelector('link[rel="stylesheet"][href^="style.css"]');
        if (link) link.setAttribute('href', css.getAttribute('href'));
      }
      // Le jeu redemarre comme au chargement de la page, avec ta partie sauvegardee
      document.dispatchEvent(new Event('DOMContentLoaded'));
    };
    loadNext(0);
  }).catch(fallback);
}

setTimeout(checkForUpdate, window.__TAURI_INTERNALS__ ? 6000 : 45000);
setInterval(checkForUpdate, 300000);
document.addEventListener('visibilitychange', function() { if (!document.hidden) setTimeout(checkForUpdate, 3000); });
window.addEventListener('online', function() { setTimeout(checkForUpdate, 3000); });

// Hors ligne, la partie n'est pas sauvegardee : on te le dit
function offlineBar(on) {
  var bar = document.getElementById('offline-bar');
  if (!on) { if (bar) bar.remove(); return; }
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'offline-bar';
    bar.setAttribute('role', 'status');
    document.body.appendChild(bar);
  }
  bar.textContent = '\u{1F4F5} ' + t('offline.bar');
}
function inGameWithBob() { return !document.body.classList.contains('home-open') && typeof bobSay === 'function' && !!document.getElementById('bob') && typeof G !== 'undefined' && !!G && !!G.settings; }
function goneOffline() {
  offlineBar(true);
  // Dans une partie, c'est Bob qui previent
  if (inGameWithBob()) bobSay(t('offline.bob'), 9000);
  else if (typeof toast === 'function') toast(t('offline.noSave'));
}
window.addEventListener('offline', goneOffline);
window.addEventListener('online', function() {
  offlineBar(false);
  if (inGameWithBob()) { bobSay(t('offline.back'), 5000); save(); }
  else if (typeof toast === 'function') toast(t('offline.back'));
});
// Deja hors ligne au demarrage
setTimeout(function() { if (navigator.onLine === false) goneOffline(); }, 2500);
