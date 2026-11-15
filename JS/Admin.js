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
  h += '<h4 class="adm-h4">' + adminTr('Parties', 'Games') + ' (' + list.length + ')</h4><div class="inst-grid adm-insts adm-slots">';
  list.forEach(function(x) {
    var lvl = ''; try { lvl = JSON.parse(x.save_data).level; } catch (e) { /* pas lisible */ }
    h += '<button class="inst-slot adm-slot" onclick="adminOpenGame(\'' + r.id + '\',\'' + x.id + '\')"><b>' + aesc(x.bakery_name || adminTr('Sans nom', 'Unnamed')) + '</b><small>' + (lvl ? adminTr('Niv. ', 'Lv. ') + lvl + ' · ' : '') + new Date(x.updated_at).toLocaleString() + '</small></button>';
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

// ======================================================================
// La partie d'un joueur : toutes les infos, en direct
// ======================================================================
var adminGame = { uid: null, id: null, row: null, timer: null, det: {} };

function adminCall(path, opts) { return cloudCall(adminUI.pid, path, opts); }
function adminLangName(code) {
  if (typeof LANG_LIST !== 'undefined') for (var i = 0; i < LANG_LIST.length; i++) if (LANG_LIST[i].code === code) return LANG_LIST[i].flag + ' ' + LANG_LIST[i].name;
  return code || '?';
}
function adminPretty(id) { return String(id).replace(/[_-]+/g, ' '); }
function adminNameOf(kind, id) {
  try {
    if (kind === 'ing' && typeof findIng === 'function') { var g = findIng(id); if (g) return g.e + ' ' + t('i.' + id); }
    if (kind === 'rec' && typeof findRec === 'function') { var r = findRec(id); if (r) return r.e + ' ' + (typeof recShortName === 'function' ? recShortName(r) : id); }
    if (kind === 'ach' && typeof ACHIEVEMENTS !== 'undefined') { for (var i = 0; i < ACHIEVEMENTS.length; i++) if (ACHIEVEMENTS[i].id === id) return ACHIEVEMENTS[i].icon + ' ' + achName(ACHIEVEMENTS[i]); }
    if (kind === 'theme' && typeof THEME_LIST !== 'undefined') { for (var j = 0; j < THEME_LIST.length; j++) if (THEME_LIST[j].id === id) return t(THEME_LIST[j].langKey); }
  } catch (e) { /* nom pas trouve */ }
  return adminPretty(id);
}
function adminMoney(v) { try { if (typeof fmtMoney === 'function') return fmtMoney(v || 0); } catch (e) { /* tant pis */ } return String(Math.round(v || 0)); }
function adminNum(v) { try { if (typeof fmt === 'function') return fmt(v || 0); } catch (e) { /* tant pis */ } return String(Math.round(v || 0)); }

function adminCountMap(obj, pick) {
  var out = [];
  for (var k in (obj || {})) { var v = pick ? pick(obj[k]) : obj[k]; if (v > 0) out.push([k, v]); }
  out.sort(function(a, b) { return b[1] - a[1]; });
  return out;
}
function adminDetails(key, title, count, body) {
  return '<details class="adm-det"' + (adminGame.det[key] ? ' open' : '') + ' ontoggle="adminGame.det[\'' + key + '\']=this.open"><summary>' + title + (count != null ? ' <small>(' + count + ')</small>' : '') + '</summary>' + body + '</details>';
}
// kind : ce qu'on nomme (ingredient, recette...). Sans nombre (withN = false), juste la liste des noms.
function adminPairs(list, kind, withN) {
  if (!list.length) return '<p class="adm-muted">' + adminTr('Rien pour l’instant.', 'Nothing yet.') + '</p>';
  var h = '<div class="stat-list">';
  list.forEach(function(p) { h += '<div class="stat-item"><span>' + aesc(kind ? adminNameOf(kind, p[0]) : adminPretty(p[0])) + '</span>' + (withN === false ? '' : '<b>' + adminNum(p[1]) + '</b>') + '</div>'; });
  return h + '</div>';
}

// ---------- Les chiffres d'une patisserie (s = son etat) ----------
function adminSum(maps) {
  var out = {};
  maps.forEach(function(m) { for (var k in (m || {})) { var v = +m[k] || 0; if (v) out[k] = (out[k] || 0) + v; } });
  return out;
}
function adminTotal(map) { var n = 0; for (var k in map) n += +map[k] || 0; return n; }
function adminLost(s) {
  var st = s.stats || {};
  return (st.totalIngredientCost || 0) + (st.totalRentPaid || 0) + (st.totalSalaryPaid || 0) + (st.totalInvested || 0) + (st.totalInterestPaid || 0);
}
function adminEmpByJob(emps) {
  var out = {};
  (emps || []).forEach(function(e) { var k = e.type || e.job || '?'; out[k] = (out[k] || 0) + 1; });
  return out;
}
function adminJobName(id) {
  try { var k = 'emp.' + id; if (typeof LANGS !== 'undefined' && LANGS[currentLang] && LANGS[currentLang][k]) return t(k); } catch (e) { /* nom pas trouve */ }
  return adminPretty(id);
}
function adminOwnedMachines(s) { var n = 0; for (var k in (s.machines || {})) if (s.machines[k] > 0) n++; return n; }
function adminBuildingTotal(s) { var n = 0; for (var k in (s.buildings || {})) n += (s.buildings[k] && s.buildings[k].qty) || 0; return n; }
function adminKpi(list) {
  var h = '<div class="adm-kpis">';
  list.forEach(function(k) { h += '<div class="adm-kpi"><span>' + k[0] + '</span><b>' + k[2] + '</b><small>' + k[1] + '</small></div>'; });
  return h + '</div>';
}
function adminStatesOf(d) {
  // La patisserie ouverte est l'etat de la sauvegarde elle-meme ; les autres sont rangees dans bakeries
  var list = [];
  var bl = d.bakeries && d.bakeries.length ? d.bakeries : [{ name: d.bakeryName }];
  bl.forEach(function(b, i) {
    var cur = i === (d.currentBakeryIndex || 0);
    list.push({ index: i, name: cur ? d.bakeryName : b.name, current: cur, s: cur ? d : (b.state || {}) });
  });
  return list;
}

// Une liste qui se deplie : machines et batiments avec leur niveau et leur etat
function adminItemList(map, kind, brokenKey, qtyOf) {
  var rows = [];
  for (var id in (map || {})) { var q = qtyOf(map[id]); if (q > 0) rows.push([id, q]); }
  return rows;
}
function adminBrokenList(s, kind) {
  var map = kind === 'm' ? s.machines : s.buildings;
  var list = adminCountMap(map, function(v) { return kind === 'm' ? v : (v && v.qty); });
  if (!list.length) return '<p class="adm-muted">' + adminTr('Rien pour l’instant.', 'Nothing yet.') + '</p>';
  var h = '<div class="stat-list">';
  list.forEach(function(p) {
    var broken = !!(s.broken && s.broken[kind + ':' + p[0]]);
    var name = adminPretty(p[0]);
    try { if (typeof t === 'function') { var key = (kind === 'm' ? 'mach.' : 'b.') + p[0]; if (LANGS[currentLang][key]) name = t(key); } } catch (e) { /* tant pis */ }
    h += '<div class="stat-item"><span>' + aesc(name) + (broken ? ' <em class="adm-broken">' + adminTr('cassée', 'broken') + '</em>' : '') + '</span><b>' + adminTr('niv. ', 'lv. ') + adminNum(p[1]) + '</b></div>';
  });
  return h + '</div>';
}

// Les chiffres d'une seule patisserie
function adminBakeryHTML(s, d, key) {
  var st = s.stats || {};
  var got = st.ingGotById || {}, made = st.cakesMadeById || {};
  var h = adminKpi([
    ['💰', adminTr('Argent', 'Money'), adminMoney(s.money)],
    ['📈', adminTr('Argent gagné', 'Money earned'), adminMoney(s.totalEarned)],
    ['📉', adminTr('Argent perdu', 'Money lost'), adminMoney(adminLost(s))],
    ['🖱️', adminTr('Clics', 'Clicks'), adminNum(st.totalClicks)],
    ['⭐', adminTr('Niveau', 'Level'), s.level || 1],
    ['✨', 'XP', adminNum(s.xp)],
  ]);
  h += adminDetails(key + 'got', '🥚 ' + adminTr('Ingrédients obtenus', 'Ingredients obtained'), adminNum(adminTotal(got)), adminPairs(adminCountMap(got), 'ing'));
  h += adminDetails(key + 'made', '🍰 ' + adminTr('Recettes préparées', 'Recipes prepared'), adminNum(st.totalCakesMade || adminTotal(made)), adminPairs(adminCountMap(made), 'rec'));
  h += adminDetails(key + 'ing', '📦 ' + adminTr('Ingrédients en stock', 'Ingredients in stock'), adminNum(adminTotal(s.ing)), adminPairs(adminCountMap(s.ing), 'ing'));
  h += adminDetails(key + 'rec', '🎂 ' + adminTr('Recettes en stock', 'Recipes in stock'), adminNum(adminTotal(s.cakes)), adminPairs(adminCountMap(s.cakes), 'rec'));
  var jobs = adminEmpByJob(s.employees);
  var jl = '<div class="stat-list">';
  Object.keys(jobs).forEach(function(j) { jl += '<div class="stat-item"><span>' + aesc(adminJobName(j)) + '</span><b>' + jobs[j] + '</b></div>'; });
  h += adminDetails(key + 'emp', '👥 ' + adminTr('Employés', 'Employees'), (s.employees || []).length, jl + '</div>');
  var achs = Object.keys(d.achievements || {}).filter(function(k) { return d.achievements[k]; });
  h += adminDetails(key + 'ach', '🏆 ' + adminTr('Succès débloqués', 'Unlocked achievements'), achs.length, adminPairs(achs.map(function(x) { return [x, 1]; }), 'ach', false));
  h += adminDetails(key + 'bld', '🏢 ' + adminTr('Bâtiments', 'Buildings'), adminBuildingTotal(s), adminBrokenList(s, 'b'));
  h += adminDetails(key + 'mach', '⚙️ ' + adminTr('Machines', 'Machines'), adminOwnedMachines(s), adminBrokenList(s, 'm'));
  return h;
}

// Tout ce qu'on sait de la partie (l'entreprise), a partir de sa sauvegarde
function adminGameHTML(d) {
  var list = adminStatesOf(d), states = list.map(function(x) { return x.s; });
  var sts = states.map(function(s) { return s.stats || {}; });
  var got = adminSum(sts.map(function(x) { return x.ingGotById; }));
  var made = adminSum(sts.map(function(x) { return x.cakesMadeById; }));
  var ing = adminSum(states.map(function(s) { return s.ing; }));
  var rec = adminSum(states.map(function(s) { return s.cakes; }));
  var emps = []; states.forEach(function(s) { emps = emps.concat(s.employees || []); });
  var achs = Object.keys(d.achievements || {}).filter(function(k) { return d.achievements[k]; });
  var sum = function(fn) { var n = 0; states.forEach(function(s) { n += fn(s) || 0; }); return n; };
  var h = adminKpi([
    ['🖥️', 'Console', d.cheatUnlocked ? adminTr('Débloquée', 'Unlocked') : adminTr('Non', 'No')],
    ['🏪', adminTr('Pâtisseries', 'Bakeries'), list.length],
    ['💰', adminTr('Argent total', 'Total money'), adminMoney(sum(function(s) { return s.money; }))],
    ['⭐', adminTr('Niveau de l’entreprise', 'Company level'), sum(function(s) { return s.level || 1; })],
    ['🖱️', adminTr('Clics', 'Clicks'), adminNum(sum(function(s) { return (s.stats || {}).totalClicks; }))],
    ['📈', adminTr('Argent gagné', 'Money earned'), adminMoney(sum(function(s) { return s.totalEarned; }))],
    ['📉', adminTr('Argent perdu', 'Money lost'), adminMoney(sum(adminLost))],
    ['👥', adminTr('Employés', 'Employees'), emps.length],
    ['⚙️', adminTr('Machines', 'Machines'), sum(adminOwnedMachines)],
    ['🏢', adminTr('Bâtiments', 'Buildings'), sum(adminBuildingTotal)],
    ['🏆', adminTr('Succès', 'Achievements'), achs.length + (typeof ACHIEVEMENTS !== 'undefined' ? ' / ' + ACHIEVEMENTS.length : '')],
    ['🌍', adminTr('Langue', 'Language'), aesc(adminLangName(d.settings && d.settings.lang))],
    ['🎨', adminTr('Thèmes', 'Themes'), Object.keys(d.unlockedThemes || {}).filter(function(k) { return d.unlockedThemes[k]; }).length],
  ]);
  h += adminDetails('cgot', '🥚 ' + adminTr('Ingrédients obtenus', 'Ingredients obtained'), adminNum(adminTotal(got)), adminPairs(adminCountMap(got), 'ing'));
  h += adminDetails('cmade', '🍰 ' + adminTr('Recettes préparées', 'Recipes prepared'), adminNum(adminTotal(made)), adminPairs(adminCountMap(made), 'rec'));
  h += adminDetails('cing', '📦 ' + adminTr('Ingrédients en stock', 'Ingredients in stock'), adminNum(adminTotal(ing)), adminPairs(adminCountMap(ing), 'ing'));
  h += adminDetails('crec', '🎂 ' + adminTr('Recettes en stock', 'Recipes in stock'), adminNum(adminTotal(rec)), adminPairs(adminCountMap(rec), 'rec'));
  h += adminDetails('cach', '🏆 ' + adminTr('Succès débloqués', 'Unlocked achievements'), achs.length, adminPairs(achs.map(function(x) { return [x, 1]; }), 'ach', false));

  // En bas : le menu pour choisir une patisserie
  var idx = Math.min(adminGame.bak || 0, list.length - 1);
  adminGame.bak = idx;
  var pick = list[idx];
  h += '<h4 class="adm-h4">🏪 ' + adminTr('Une pâtisserie', 'One bakery') + '</h4><div class="adm-bak-bar"><select id="adm-bak" onchange="adminGame.bak=+this.value;adminDrawGame()">';
  list.forEach(function(x) { h += '<option value="' + x.index + '"' + (x.index === idx ? ' selected' : '') + '>' + aesc(x.name || adminTr('Sans nom', 'Unnamed')) + (x.current ? ' ★' : '') + '</option>'; });
  h += '</select><button class="btn btn-small icon-only" title="' + aesc(adminTr('Renommer', 'Rename')) + '" onclick="adminBakeryRename()">✏️</button><button class="btn btn-small btn-danger icon-only" title="' + aesc(adminTr('Supprimer', 'Delete')) + '" onclick="adminBakeryDelete()">🗑️</button></div>';
  h += adminBakeryHTML(pick.s, d, 'b' + idx + '-');
  return h;
}

function adminOpenGame(uid, id) {
  adminGame.uid = uid; adminGame.id = id; adminGame.row = null;
  var ov = document.getElementById('adm-game');
  if (!ov) { ov = document.createElement('div'); ov.id = 'adm-game'; ov.className = 'adm-overlay'; document.body.appendChild(ov); }
  ov.innerHTML = '<div class="adm-overlay-card"><p class="home-info">' + adminTr('Chargement…', 'Loading…') + '</p></div>';
  adminGameFetch(true);
  if (adminGame.timer) clearInterval(adminGame.timer);
  adminGame.timer = setInterval(function() { adminGameFetch(false); }, 4000);
}
function adminCloseGame() {
  if (adminGame.timer) { clearInterval(adminGame.timer); adminGame.timer = null; }
  adminGame.id = null;
  var ov = document.getElementById('adm-game');
  if (ov) ov.remove();
}
function adminGameFetch(first) {
  var id = adminGame.id;
  if (!id) return;
  adminCall('/rest/v1/instances?id=eq.' + encodeURIComponent(id) + '&select=id,user_id,bakery_name,updated_at,save_data').then(function(rows) {
    if (adminGame.id !== id) return;
    var row = rows && rows[0];
    if (!row) { adminCloseGame(); return; }
    var changed = !adminGame.row || adminGame.row.updated_at !== row.updated_at || adminGame.row.bakery_name !== row.bakery_name;
    adminGame.row = row;
    if (changed || first) adminDrawGame();
    else adminGameLiveBadge();
  }, function(e) { if (first) { var ov = document.getElementById('adm-game'); if (ov) ov.innerHTML = '<div class="adm-overlay-card"><p class="warning">' + aesc(e && e.message) + '</p><button class="btn" onclick="adminCloseGame()">' + adminTr('Fermer', 'Close') + '</button></div>'; } });
}
function adminGameLiveBadge() {
  var el = document.getElementById('adm-live-at');
  if (el && adminGame.row) el.textContent = adminTr('mis à jour : ', 'updated: ') + adminAgo(Date.parse(adminGame.row.updated_at));
}
function adminDrawGame() {
  var ov = document.getElementById('adm-game'), row = adminGame.row;
  if (!ov || !row) return;
  var d = {}; try { d = JSON.parse(row.save_data) || {}; } catch (e) { d = {}; }
  var owner = adminUI.rows.filter(function(r) { return r.id === row.user_id; })[0];
  var scroller = ov.querySelector('.adm-overlay-card'), top = scroller ? scroller.scrollTop : 0;
  // Une petite barre en haut : le nom de l'entreprise, et ses boutons
  var h = '<div class="adm-overlay-card"><div class="adm-game-bar"><div class="adm-game-title"><b>' + aesc(row.bakery_name || d.companyName || adminTr('Sans nom', 'Unnamed')) + '</b><small>' + (owner ? aesc(owner.pseudo) + ' · ' + aesc(owner.email) : '') + '</small></div>' +
    '<div class="adm-game-btns"><span class="adm-live"><i></i>' + adminTr('En direct', 'Live') + ' <small id="adm-live-at"></small></span>' +
    '<button class="btn btn-small icon-only" title="' + aesc(adminTr('Exporter la sauvegarde (fichier)', 'Export the save (file)')) + '" onclick="adminGameExport()">💾</button>' +
    '<button class="btn btn-small icon-only" title="' + aesc(adminTr('Copier la sauvegarde', 'Copy the save')) + '" onclick="adminGameCopy(this)">📋</button>' +
    '<button class="btn btn-small icon-only" title="' + aesc(adminTr('Renommer', 'Rename')) + '" onclick="adminGameRename()">✏️</button>' +
    '<button class="btn btn-small btn-danger icon-only" title="' + aesc(adminTr('Supprimer la partie', 'Delete the game')) + '" onclick="adminGameDelete()">🗑️</button>' +
    '<button class="btn btn-small icon-only" title="' + aesc(adminTr('Fermer', 'Close')) + '" onclick="adminCloseGame()">✖</button></div></div>';
  h += adminGameHTML(d) + '</div>';
  ov.innerHTML = h;
  var sc = ov.querySelector('.adm-overlay-card'); if (sc) sc.scrollTop = top;
  adminGameLiveBadge();
}
function adminGameCode() { try { return btoa(unescape(encodeURIComponent(adminGame.row.save_data))); } catch (e) { return ''; } }
function adminGameCopy(btn) {
  var code = adminGameCode();
  try { navigator.clipboard.writeText(code); } catch (e) { var a = document.createElement('textarea'); a.value = code; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); }
  btn.textContent = adminTr('Copié ✓', 'Copied ✓');
}
function adminGameExport() {
  var row = adminGame.row;
  var blob = new Blob([adminGameCode()], { type: 'text/plain' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'p2ds-' + String(row.bakery_name || 'partie').replace(/[^A-Za-z0-9_-]+/g, '_').slice(0, 30) + '-' + new Date().toISOString().slice(0, 10) + '.p2ds';
  document.body.appendChild(a); a.click();
  setTimeout(function() { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
// Modifie la sauvegarde en ligne. La base ne dit rien quand une regle refuse (0 ligne changee) : on le verifie.
function adminPatchSave(row, patch) {
  return adminCall('/rest/v1/instances?id=eq.' + encodeURIComponent(row.id), { method: 'PATCH', prefer: 'return=representation', body: patch }).then(function(r) {
    if (!r || !r.length) throw { message: adminTr('Refusé par la base : relance supabase_setup.sql dans Supabase (règle de modification pour l’administrateur).', 'Refused by the database: run supabase_setup.sql again in Supabase (update rule for the administrator).') };
    return r;
  });
}
function adminGameRename() {
  var row = adminGame.row;
  var name = prompt(adminTr('Nouveau nom de la partie (de l’entreprise) :', 'New name for the game (the company):'), row.bakery_name || '');
  if (name == null) return;
  name = name.trim().slice(0, 40);
  if (!name) return;
  var d = {}; try { d = JSON.parse(row.save_data); } catch (e) { return; }
  d.companyName = name;
  adminPatchSave(row, { bakery_name: name, save_data: JSON.stringify(d), updated_at: new Date().toISOString() }).then(function() {
    adminGameFetch(true);
    adminOthersRefresh();
  }, function(e) { alert((e && e.message) || 'Error'); });
}
function adminGameDelete() {
  var row = adminGame.row;
  adminConfirm3(adminTr('Supprimer la sauvegarde « ' + (row.bakery_name || '') + ' »', 'Delete the save "' + (row.bakery_name || '') + '"'), function() {
    adminCall('/rest/v1/instances?id=eq.' + encodeURIComponent(row.id), { method: 'DELETE', prefer: 'return=representation' }).then(function(r) {
      if (!r || !r.length) throw { message: adminTr('La base a refusé de supprimer.', 'The database refused to delete.') };
      adminCloseGame();
      if (adminUI.open) adminOpenPlayer(adminUI.open);
      adminOthersRefresh();
    }).catch(function(e) { alert((e && e.message) || 'Error'); });
  });
}
function adminBakeryRename() {
  var row = adminGame.row, d = {}; try { d = JSON.parse(row.save_data); } catch (e) { return; }
  var list = adminStatesOf(d), pick = list[adminGame.bak || 0];
  if (!pick) return;
  var name = prompt(adminTr('Nouveau nom de la pâtisserie :', 'New name for the bakery:'), pick.name || '');
  if (name == null) return;
  name = name.trim().slice(0, 30);
  if (!name) return;
  if (pick.current) d.bakeryName = name;
  if (d.bakeries && d.bakeries[pick.index]) {
    d.bakeries[pick.index].name = name;
    if (!pick.current && d.bakeries[pick.index].state) d.bakeries[pick.index].state.bakeryName = name;
  }
  adminPatchSave(row, { save_data: JSON.stringify(d), updated_at: new Date().toISOString() }).then(function() { adminGameFetch(true); }, function(e) { alert((e && e.message) || 'Error'); });
}
function adminBakeryDelete() {
  var row = adminGame.row, d = {}; try { d = JSON.parse(row.save_data); } catch (e) { return; }
  var list = adminStatesOf(d), pick = list[adminGame.bak || 0];
  if (!pick) return;
  if (list.length <= 1) { alert(adminTr('C’est la seule pâtisserie : supprime plutôt la partie.', 'This is the only bakery: delete the game instead.')); return; }
  if (pick.current) { alert(adminTr('C’est la pâtisserie ouverte par le joueur : on ne peut pas la supprimer à sa place. Supprime-en une autre.', 'This is the bakery the player has open: it cannot be deleted for them. Delete another one.')); return; }
  adminConfirm3(adminTr('Supprimer la pâtisserie « ' + pick.name + ' »', 'Delete the bakery "' + pick.name + '"'), function() {
    d.bakeries.splice(pick.index, 1);
    if (pick.index < (d.currentBakeryIndex || 0)) d.currentBakeryIndex--;
    adminGame.bak = 0;
    adminPatchSave(row, { save_data: JSON.stringify(d), updated_at: new Date().toISOString() }).then(function() { adminGameFetch(true); }, function(e) { alert((e && e.message) || 'Error'); });
  });
}

// ======================================================================
// Les parties des autres joueurs (moitie basse de l'onglet Parties)
// ======================================================================
var adminOthers = { rows: null, timer: null, busy: false };
function adminOthersHTML() {
  var rows = adminOthers.rows;
  var h = '<h3 class="adm-sec">👥 ' + adminTr('Parties des autres joueurs', 'Other players’ games') + '</h3>';
  if (!rows) return h + '<p class="home-info">' + adminTr('Chargement…', 'Loading…') + '</p>';
  if (!rows.length) return h + '<p class="home-empty">' + adminTr('Aucune partie pour l’instant.', 'No games yet.') + '</p>';
  h += '<div class="inst-grid adm-others-grid">';
  rows.forEach(function(r) {
    var owner = adminUI.rows.filter(function(p) { return p.id === r.user_id; })[0];
    h += '<button class="inst-slot adm-slot" onclick="adminOpenGame(\'' + r.user_id + '\',\'' + r.id + '\')"><b>' + aesc(r.bakery_name || adminTr('Sans nom', 'Unnamed')) + '</b><small>' + aesc(owner ? owner.pseudo : '?') + '</small><small>' + new Date(r.updated_at).toLocaleString() + '</small></button>';
  });
  return h + '</div>';
}
function adminOthersDraw() {
  var el = document.getElementById('adm-others');
  if (el) el.innerHTML = adminOthersHTML();
}
function adminOthersRefresh() {
  if (adminOthers.busy || !adminUI.pid) return;
  adminOthers.busy = true;
  var go = adminUI.rows.length ? Promise.resolve() : adminFetchPlayers().catch(function() {});
  go.then(function() {
    return adminCall('/rest/v1/instances?user_id=neq.' + encodeURIComponent(adminUI.pid) + '&select=id,user_id,bakery_name,updated_at&order=updated_at.desc&limit=200');
  }).then(function(rows) { adminOthers.rows = rows || []; adminOthers.busy = false; adminOthersDraw(); }, function() { adminOthers.busy = false; });
}
function adminOthersStart(pid) {
  adminUI.pid = pid;
  adminOthersDraw();
  adminOthersRefresh();
  if (!adminOthers.timer) adminOthers.timer = setInterval(function() { if (document.getElementById('adm-others')) adminOthersRefresh(); else adminOthersStop(); }, 10000);
}
function adminOthersStop() { if (adminOthers.timer) { clearInterval(adminOthers.timer); adminOthers.timer = null; } }

// ======================================================================
// Bob, en bas a droite du panneau : il previent quand il n'y a plus de wifi et raconte ce qui se passe
// ======================================================================
var adminBob = { on: false, timer: null, seen: null, status: {}, bubbleTimer: null, first: true, lastVisit: 0 };
function adminBobMarkup() {
  var svg = '';
  var src = document.querySelector('#bob svg');
  if (src) {
    // Une copie avec ses propres identifiants de degrades (l'original peut etre cache)
    svg = src.outerHTML;
    (svg.match(/id="bob[A-Za-z]+"/g) || []).forEach(function(m) {
      var id = m.slice(4, -1);
      svg = svg.split('id="' + id + '"').join('id="' + id + 'A"').split('url(#' + id + ')').join('url(#' + id + 'A)');
    });
  } else svg = '<span class="adm-bob-emoji">🤖</span>';
  return '<div id="adm-bob-bubble" role="status" aria-live="polite" style="display:none"></div><button id="adm-bob" class="bob-fig" type="button" data-anger="0" aria-label="Bob" title="Bob" onclick="adminBobTalk()">' + svg + '</button>';
}
function adminBobSay(msg, ms) {
  var b = document.getElementById('adm-bob-bubble');
  if (!b) return;
  b.innerHTML = '<span class="bob-bubble-name">Bob</span><p>' + aesc(msg) + '</p>';
  b.style.display = 'block';
  clearTimeout(adminBob.bubbleTimer);
  adminBob.bubbleTimer = setTimeout(function() { b.style.display = 'none'; }, ms || 7000);
}
function adminBobStart(pid, host) {
  adminUI.pid = pid;
  var wrap = document.getElementById('adm-bob-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.id = 'adm-bob-wrap'; wrap.innerHTML = adminBobMarkup(); (host || document.body).appendChild(wrap); }
  if (adminBob.on) return;
  adminBob.on = true; adminBob.first = true;
  try { adminBob.lastVisit = +localStorage.getItem('p2ds_adm_visit') || 0; } catch (e) { adminBob.lastVisit = 0; }
  adminBobTick();
  adminBob.timer = setInterval(adminBobTick, 12000);
  if (navigator.onLine === false) adminBobSay(adminTr('Plus de wifi ! Je ne peux plus voir les joueurs en direct.', 'No wifi! I can’t see the players live.'), 12000);
}
function adminBobStop() {
  adminBob.on = false;
  if (adminBob.timer) { clearInterval(adminBob.timer); adminBob.timer = null; }
  var w = document.getElementById('adm-bob-wrap');
  if (w) w.remove();
}
function adminBobTalk() {
  var n = adminUI.rows.filter(function(r) { return adminPresence(r).status !== 'closed'; }).length;
  adminBobSay(adminTr('Il y a ' + n + ' joueur(s) en ligne et ' + adminUI.rows.length + ' compte(s).', n + ' player(s) online, ' + adminUI.rows.length + ' account(s).'), 6000);
}
function adminBobTick() {
  if (!adminBob.on) return;
  if (navigator.onLine === false) return;
  adminFetchPlayers().then(function() {
    var lines = [];
    var rows = adminUI.rows;
    if (adminBob.first) {
      var online = rows.filter(function(r) { return adminPresence(r).status !== 'closed'; }).length;
      var playing = rows.filter(function(r) { return adminPresence(r).status === 'playing'; }).length;
      var fresh = adminBob.lastVisit ? rows.filter(function(r) { return Date.parse(r.created_at) > adminBob.lastVisit; }) : [];
      lines.push(adminTr('Salut ! ' + rows.length + ' compte(s), ' + online + ' en ligne, ' + playing + ' en jeu.', 'Hi! ' + rows.length + ' account(s), ' + online + ' online, ' + playing + ' playing.'));
      if (fresh.length) {
        var names = fresh.slice(0, 3).map(function(r) { return r.pseudo; }).join(', ');
        lines.push(adminTr(fresh.length + ' nouveau(x) joueur(s) depuis ta dernière visite : ' + names + '.', fresh.length + ' new player(s) since your last visit: ' + names + '.'));
      }
      adminBob.seen = {}; rows.forEach(function(r) { adminBob.seen[r.id] = true; });
      adminBob.first = false;
      try { localStorage.setItem('p2ds_adm_visit', String(Date.now())); } catch (e) { /* tant pis */ }
    } else {
      rows.forEach(function(r) {
        if (!adminBob.seen[r.id]) { adminBob.seen[r.id] = true; lines.push(adminTr('Nouveau joueur : ' + r.pseudo + ' vient de s’inscrire !', 'New player: ' + r.pseudo + ' just signed up!')); }
        var st = adminPresence(r).status, was = adminBob.status[r.id];
        if (was && was !== st) {
          if (st === 'playing') lines.push(adminTr(r.pseudo + ' vient de lancer une partie.', r.pseudo + ' just started playing.'));
          else if (st === 'closed') lines.push(adminTr(r.pseudo + ' est parti.', r.pseudo + ' left.'));
        }
      });
    }
    rows.forEach(function(r) { adminBob.status[r.id] = adminPresence(r).status; });
    if (lines.length) adminBobSay(lines.slice(0, 3).join(' '), 9000);
  }, function(e) { adminBobSay(adminTr('Je n’arrive pas à lire la base : ', 'I can’t read the database: ') + ((e && e.message) || ''), 9000); });
}
window.addEventListener('offline', function() { if (adminBob.on) adminBobSay(adminTr('Plus de wifi ! Je ne peux plus voir les joueurs en direct, et rien ne se met à jour.', 'No wifi! I can’t see the players live and nothing updates.'), 12000); });
window.addEventListener('online', function() { if (adminBob.on) { adminBobSay(adminTr('Le wifi est de retour, je reprends la surveillance.', 'Wifi is back, I’m watching again.'), 7000); adminBobTick(); } });
