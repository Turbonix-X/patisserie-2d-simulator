/* ============================================
   PATISSERIE 2D SIMULATOR - BASE DE DONNEES DES JOUEURS (ADMINISTRATION)
   Utilise par la page d'accueil du compte administrateur et par admin.html.
   Aucune donnee n'arrive sans etre connecte avec le compte administrateur :
   c'est la base (RLS) qui refuse, pas cette page.
   ============================================ */

var adminUI = { pid: null, box: null, rows: [], q: '', filter: 'all', open: null, timer: null, loadedAt: 0 };

function aesc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function adminTr(fr, en) { return (typeof currentLang !== 'undefined' && currentLang === 'fr') || window.__admFr ? fr : en; }

// Presence : "ouvert" (menu), "en jeu" ou "ferme". Sans signe de vie depuis 45 secondes (fenetre, onglet ou appli fermes), le joueur est hors ligne.
var PRESENCE_STALE_MS = 45000;
function adminPresence(r) {
  var p = Array.isArray(r.presence) ? r.presence[0] : r.presence;
  if (!p) return { status: 'closed', seen: null, p: null };
  var seen = Date.parse(p.last_seen) || 0;
  return { status: Date.now() - seen > PRESENCE_STALE_MS ? 'closed' : p.status, seen: seen, p: p };
}
function adminAgo(ts) {
  if (!ts) return adminTr('jamais', 'never');
  var s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 10) return adminTr('à l’instant', 'just now');
  if (s < 60) return s + ' s';
  if (s < 3600) return Math.round(s / 60) + ' min';
  if (s < 86400) return Math.round(s / 3600) + ' h';
  return Math.round(s / 86400) + adminTr(' j', ' d');
}
function adminCount(r) { return (r.instances && r.instances[0] && r.instances[0].count) || 0; }
function adminLabel(status) { return { playing: adminTr('En jeu', 'Playing'), open: adminTr('Jeu ouvert', 'Game open'), closed: adminTr('Hors ligne', 'Offline') }[status]; }

function adminStopLive() { if (adminUI.timer) { clearInterval(adminUI.timer); adminUI.timer = null; } }

// ---------- La base de donnees des joueurs, en direct ----------
function renderAdminDb(box, pid) {
  adminStopLive();
  adminUI.pid = pid; adminUI.box = box; adminUI.open = null;
  box.innerHTML = '<div class="adm-db"><p class="home-info">' + adminTr('Chargement…', 'Loading…') + '</p></div>';
  adminFetchPlayers().then(function() { adminDrawList(); });
  adminUI.timer = setInterval(function() {
    if (!document.body.contains(box)) { adminStopLive(); return; }
    if (adminUI.open) { adminTickDetail(); return; }
    adminFetchPlayers().then(function() { if (!adminUI.open) adminDrawList(true); });
  }, 8000);
}
function adminFetchPlayers() {
  return adminListPlayers(adminUI.pid).then(function(rows) { adminUI.rows = rows || []; adminUI.loadedAt = Date.now(); }, function(e) {
    adminUI.box.innerHTML = '<div class="adm-db"><p class="warning">' + aesc(e && e.message) + '</p></div>';
    throw e;
  });
}

function adminDrawList(keepFocus) {
  var rows = adminUI.rows.map(function(r) { return { r: r, pr: adminPresence(r) }; });
  var total = rows.length, playing = rows.filter(function(x) { return x.pr.status === 'playing'; }).length, open = rows.filter(function(x) { return x.pr.status === 'open'; }).length;
  var games = rows.reduce(function(a, x) { return a + adminCount(x.r); }, 0);
  var q = adminUI.q.toLowerCase();
  var shown = rows.filter(function(x) {
    if (adminUI.filter !== 'all' && x.pr.status !== adminUI.filter) return false;
    return !q || (x.r.pseudo + ' ' + x.r.email).toLowerCase().indexOf(q) >= 0;
  });
  var order = { playing: 0, open: 1, closed: 2 };
  shown.sort(function(a, b) { return order[a.pr.status] - order[b.pr.status] || (b.pr.seen || 0) - (a.pr.seen || 0); });
  var h = '<div class="adm-db"><div class="adm-stats">';
  [['👥', total, adminTr('Joueurs', 'Players'), ''], ['🎮', playing, adminTr('En jeu', 'Playing'), 'playing'], ['🟡', open, adminTr('Jeu ouvert', 'Game open'), 'open'], ['🧁', games, adminTr('Parties', 'Games'), '']].forEach(function(s) {
    h += '<div class="adm-stat ' + s[3] + '"><span class="adm-stat-ico">' + s[0] + '</span><b>' + s[1] + '</b><small>' + s[2] + '</small></div>';
  });
  h += '</div><div class="adm-tools"><input class="adm-search" type="search" placeholder="' + aesc(adminTr('Chercher un joueur…', 'Search a player…')) + '" value="' + aesc(adminUI.q) + '" oninput="adminUI.q=this.value;adminDrawList(true)">';
  [['all', adminTr('Tous', 'All')], ['playing', adminTr('En jeu', 'Playing')], ['open', adminTr('Ouvert', 'Open')], ['closed', adminTr('Hors ligne', 'Offline')]].forEach(function(f) {
    h += '<button class="adm-chip' + (adminUI.filter === f[0] ? ' active' : '') + '" onclick="adminUI.filter=\'' + f[0] + '\';adminDrawList()">' + f[1] + '</button>';
  });
  h += '<span class="adm-live" title="' + aesc(adminTr('Mise à jour automatique toutes les 8 secondes', 'Auto refresh every 8 seconds')) + '"><i></i>' + adminTr('En direct', 'Live') + '</span></div>';
  h += '<div class="adm-table"><div class="adm-th"><span>' + adminTr('Joueur', 'Player') + '</span><span>' + adminTr('État', 'Status') + '</span><span>' + adminTr('Partie en cours', 'Current game') + '</span><span>' + adminTr('Dernière activité', 'Last activity') + '</span><span>' + adminTr('Parties', 'Games') + '</span></div>';
  shown.forEach(function(x) {
    var r = x.r, p = x.pr.p;
    h += '<button class="adm-tr" onclick="adminOpenPlayer(\'' + r.id + '\')"><span class="adm-who"><i class="adm-avatar">' + aesc((r.pseudo || '?').charAt(0).toUpperCase()) + '</i><span><b>' + aesc(r.pseudo || '?') + '</b><small>' + aesc(r.email) + '</small></span></span>';
    h += '<span><em class="adm-pill ' + x.pr.status + '"><i></i>' + adminLabel(x.pr.status) + '</em></span>';
    h += '<span class="adm-game">' + (x.pr.status === 'playing' && p ? aesc(p.bakery_name || adminTr('Sans nom', 'Unnamed')) + ' <small>' + adminTr('niv. ', 'lv. ') + (p.level || 1) + ' · ' + (p.platform === 'app' ? 'App' : 'Web') + '</small>' : (p && x.pr.status !== 'closed' ? '<small>' + (p.platform === 'app' ? 'App' : 'Web') + '</small>' : '<small>—</small>')) + '</span>';
    h += '<span class="adm-seen">' + (x.pr.status === 'closed' ? (x.pr.seen ? adminTr('depuis ', 'for ') + adminAgo(x.pr.seen) : adminTr('jamais vu', 'never seen')) : adminTr('maintenant', 'now')) + '</span><span class="adm-n">' + adminCount(r) + '</span></button>';
  });
  if (!shown.length) h += '<p class="home-empty">' + adminTr('Aucun joueur ne correspond.', 'No matching player.') + '</p>';
  h += '</div><p class="adm-note">🔒 ' + adminTr('Les mots de passe sont chiffrés par Supabase : personne, pas même toi, ne peut les lire. Pour aider un joueur, ouvre sa fiche et envoie-lui un lien de réinitialisation.', 'Passwords are hashed by Supabase: nobody, not even you, can read them. To help a player, open their card and send them a reset link.') + '</p></div>';
  var hadFocus = keepFocus && document.activeElement && document.activeElement.classList.contains('adm-search');
  adminUI.box.innerHTML = h;
  if (hadFocus) { var s = adminUI.box.querySelector('.adm-search'); s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
}

// ---------- La fiche d'un joueur ----------
function adminOpenPlayer(uid) {
  adminUI.open = uid;
  adminUI.box.innerHTML = '<div class="adm-db"><p class="home-info">' + adminTr('Chargement…', 'Loading…') + '</p></div>';
  adminListInstances(adminUI.pid, uid).then(function(list) { adminUI.openList = list; adminDrawPlayer(); }, function(e) {
    adminUI.box.innerHTML = '<div class="adm-db"><p class="warning">' + aesc(e && e.message) + '</p></div>';
  });
}
function adminDrawPlayer() {
  var r = adminUI.rows.filter(function(x) { return x.id === adminUI.open; })[0];
  if (!r) { adminUI.open = null; adminDrawList(); return; }
  var pr = adminPresence(r), list = adminUI.openList || [];
  var h = '<div class="adm-db"><button class="adm-back" onclick="adminUI.open=null;adminDrawList()">← ' + adminTr('Retour', 'Back') + '</button>';
  h += '<div class="adm-card adm-profile"><i class="adm-avatar big">' + aesc((r.pseudo || '?').charAt(0).toUpperCase()) + '</i><div><h3>' + aesc(r.pseudo || '?') + '</h3><p>' + aesc(r.email) + '</p><p class="adm-muted">' + adminTr('Inscrit le ', 'Joined ') + new Date(r.created_at).toLocaleString() + '</p></div>';
  h += '<div class="adm-profile-state" id="adm-state"></div></div>';
  h += '<div class="adm-actions"><button class="btn btn-small" onclick="adminSendReset()">✉️ ' + adminTr('Envoyer un lien de mot de passe', 'Send a password reset link') + '</button><button class="btn btn-small btn-danger" onclick="adminAskDeleteUser()">🗑 ' + adminTr('Supprimer le compte', 'Delete the account') + '</button></div>';
  h += '<h4 class="adm-h4">' + adminTr('Parties', 'Games') + ' (' + list.length + ')</h4><div class="adm-insts">';
  list.forEach(function(x) {
    var code = '';
    try { code = btoa(unescape(encodeURIComponent(x.save_data))); } catch (e) { code = ''; }
    var lvl = ''; try { lvl = JSON.parse(x.save_data).level; } catch (e) { /* pas lisible */ }
    h += '<div class="adm-card adm-inst"><div class="adm-inst-head"><b>' + aesc(x.bakery_name || adminTr('Sans nom', 'Unnamed')) + '</b><small>' + (lvl ? adminTr('Niv. ', 'Lv. ') + lvl + ' · ' : '') + new Date(x.updated_at).toLocaleString() + '</small></div>';
    h += '<textarea class="save-area" readonly rows="2" onclick="this.select()">' + aesc(code) + '</textarea>';
    h += '<div class="adm-actions"><button class="btn btn-small" onclick="adminCopy(this)">' + adminTr('Copier le code', 'Copy code') + '</button><button class="btn btn-small btn-danger" onclick="adminAskDeleteInstance(\'' + x.id + '\',\'' + aesc(x.bakery_name || '').replace(/'/g, '') + '\')">' + adminTr('Supprimer la sauvegarde', 'Delete save') + '</button></div></div>';
  });
  if (!list.length) h += '<p class="home-empty">' + adminTr('Aucune partie.', 'No games.') + '</p>';
  adminUI.box.innerHTML = h + '</div></div>';
  adminTickDetail();
}
// L'etat du joueur dans sa fiche, mis a jour en direct
function adminTickDetail() {
  var el = document.getElementById('adm-state');
  if (!el) return;
  adminListPlayers(adminUI.pid).then(function(rows) {
    adminUI.rows = rows || adminUI.rows;
    var r = adminUI.rows.filter(function(x) { return x.id === adminUI.open; })[0];
    if (!r || !document.getElementById('adm-state')) return;
    var pr = adminPresence(r), p = pr.p;
    document.getElementById('adm-state').innerHTML = '<em class="adm-pill ' + pr.status + '"><i></i>' + adminLabel(pr.status) + '</em>' + (pr.status === 'playing' && p ? '<small>' + aesc(p.bakery_name || '') + ' · ' + adminTr('niv. ', 'lv. ') + (p.level || 1) + '</small>' : '') + '<small>' + (pr.status === 'closed' ? adminTr('Hors ligne depuis ', 'Offline for ') + adminAgo(pr.seen) : adminTr('Vu : maintenant', 'Seen: now')) + '</small>';
  }, function() { /* tant pis */ });
}
function adminCopy(btn) {
  var a = btn.closest('.adm-inst').querySelector('textarea');
  a.select();
  try { navigator.clipboard.writeText(a.value); } catch (e) { document.execCommand('copy'); }
  btn.textContent = adminTr('Copié ✓', 'Copied ✓');
}
function adminSendReset() {
  var r = adminUI.rows.filter(function(x) { return x.id === adminUI.open; })[0];
  if (!r) return;
  cloudFetch('/auth/v1/recover', { method: 'POST', body: { email: r.email } }).then(function() { alert(adminTr('Lien envoyé à ', 'Link sent to ') + r.email); }, function(e) { alert(e && e.message); });
}

// Une suppression demande trois confirmations de suite
function adminConfirm3(text, onYes) {
  var steps = [adminTr('Es-tu sûr ?', 'Are you sure?'), adminTr('Vraiment sûr ? Ça ne se rattrape pas.', 'Really sure? This cannot be undone.'), adminTr('Dernière confirmation : supprimer pour de bon.', 'Last confirmation: delete for good.')];
  var i = 0;
  var box = document.getElementById('adm-modal');
  if (!box) { box = document.createElement('div'); box.id = 'adm-modal'; document.body.appendChild(box); }
  var draw = function() {
    box.innerHTML = '<div class="adm-modal-card"><h3>' + (i + 1) + ' / 3</h3><p><b>' + aesc(text) + '</b></p><p class="warning">' + steps[i] + '</p><div class="modal-btns"><button class="btn btn-danger" id="adm-yes">' + (i < 2 ? adminTr('Oui', 'Yes') : adminTr('Supprimer', 'Delete')) + '</button><button class="btn" id="adm-no">' + adminTr('Annuler', 'Cancel') + '</button></div></div>';
    document.getElementById('adm-no').onclick = function() { box.remove(); };
    document.getElementById('adm-yes').onclick = function() { if (i < 2) { i++; draw(); } else { box.remove(); onYes(); } };
  };
  draw();
}
function adminAskDeleteInstance(id, name) {
  adminConfirm3(adminTr('Supprimer la sauvegarde « ' + name + ' »', 'Delete the save "' + name + '"'), function() {
    adminDeleteInstance(adminUI.pid, id).then(function() { adminOpenPlayer(adminUI.open); }, function(e) { alert(e && e.message); });
  });
}
function adminAskDeleteUser() {
  var uid = adminUI.open, player = adminUI.rows.filter(function(r) { return r.id === uid; })[0];
  adminConfirm3(adminTr('Supprimer le compte de ', 'Delete the account of ') + player.pseudo + ' (' + player.email + ')', function() {
    adminDeleteUser(adminUI.pid, uid).then(function() { adminUI.rows = adminUI.rows.filter(function(r) { return r.id !== uid; }); adminUI.open = null; adminDrawList(); }, function(e) { alert(e && e.message); });
  });
}
