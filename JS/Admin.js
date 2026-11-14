/* ============================================
   PATISSERIE 2D SIMULATOR - JOUEURS (ADMINISTRATION)
   Utilise par l'onglet Joueurs de l'accueil et par admin.html.
   Aucune donnee n'arrive sans etre connecte avec le compte administrateur :
   c'est la base (RLS) qui refuse, pas cette page.
   ============================================ */

var adminUI = { pid: null, panel: null, tr: null, rows: [], q: '', open: null };

function aesc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function adminTr(fr, en) { return adminUI.tr ? adminUI.tr(fr, en) : (typeof currentLang !== 'undefined' && currentLang === 'fr' ? fr : en); }

function renderPlayersPanel(panel, pid, tr) {
  adminUI.pid = pid; adminUI.panel = panel; adminUI.tr = tr || null; adminUI.open = null;
  panel.innerHTML = '<p class="home-info">' + adminTr('Chargement…', 'Loading…') + '</p>';
  adminListPlayers(pid).then(function(rows) { adminUI.rows = rows || []; adminDrawList(); }, function(e) {
    panel.innerHTML = '<p class="warning">' + aesc(e && e.message) + '</p>';
  });
}

function adminCount(r) { return (r.instances && r.instances[0] && r.instances[0].count) || 0; }

function adminDrawList() {
  var q = adminUI.q.toLowerCase();
  var rows = adminUI.rows.filter(function(r) { return !q || (r.pseudo + ' ' + r.email).toLowerCase().indexOf(q) >= 0; });
  var h = '<p class="home-count">' + adminTr(adminUI.rows.length + ' joueurs', adminUI.rows.length + ' players') + '</p>';
  h += '<input class="panel-search" type="search" placeholder="' + aesc(adminTr('Chercher un joueur…', 'Search a player…')) + '" value="' + aesc(adminUI.q) + '" oninput="adminUI.q=this.value;adminDrawList()">';
  h += '<div class="adm-list">';
  rows.forEach(function(r) {
    h += '<button class="adm-row" onclick="adminOpenPlayer(\'' + r.id + '\')"><b>' + aesc(r.pseudo || '?') + '</b><span>' + aesc(r.email) + '</span><span class="adm-n">' + adminCount(r) + ' ' + adminTr('instance(s)', 'instance(s)') + '</span></button>';
  });
  if (!rows.length) h += '<p class="home-empty">' + adminTr('Aucun joueur.', 'No players.') + '</p>';
  adminUI.panel.innerHTML = h + '</div>';
  var s = adminUI.panel.querySelector('.panel-search');
  if (s && adminUI.q) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
}

function adminOpenPlayer(uid) {
  var player = adminUI.rows.filter(function(r) { return r.id === uid; })[0];
  adminUI.open = uid;
  adminUI.panel.innerHTML = '<p class="home-info">' + adminTr('Chargement…', 'Loading…') + '</p>';
  adminListInstances(adminUI.pid, uid).then(function(list) {
    var h = '<button class="btn btn-small" onclick="adminDrawList()">← ' + adminTr('Retour', 'Back') + '</button>';
    h += '<h3>' + aesc(player.pseudo) + ' <small>' + aesc(player.email) + '</small></h3><p class="set-help">' + adminTr('Inscrit le ', 'Joined ') + new Date(player.created_at).toLocaleString() + '</p>';
    list.forEach(function(x) {
      var code = '';
      try { code = btoa(unescape(encodeURIComponent(x.save_data))); } catch (e) { code = ''; }
      var lvl = ''; try { lvl = JSON.parse(x.save_data).level; } catch (e) { /* pas lisible */ }
      h += '<div class="inst-card adm-inst"><div class="inst-head"><b>' + aesc(x.bakery_name || adminTr('Sans nom', 'Unnamed')) + '</b><span class="inst-meta">' + (lvl ? adminTr('Niv. ', 'Lv. ') + lvl + ' · ' : '') + new Date(x.updated_at).toLocaleString() + '</span></div>';
      h += '<textarea class="save-area" readonly rows="2" onclick="this.select()">' + aesc(code) + '</textarea>';
      h += '<div class="inst-actions"><button class="btn btn-small" onclick="adminCopy(this)">' + adminTr('Copier le code', 'Copy code') + '</button><button class="btn btn-small btn-danger" onclick="adminAskDeleteInstance(\'' + x.id + '\',\'' + aesc(x.bakery_name || '').replace(/'/g, '') + '\')">' + adminTr('Supprimer la sauvegarde', 'Delete save') + '</button></div></div>';
    });
    if (!list.length) h += '<p class="home-empty">' + adminTr('Aucune instance.', 'No instances.') + '</p>';
    h += '<p><button class="btn btn-danger" onclick="adminAskDeleteUser()">' + adminTr('Supprimer ce compte', 'Delete this account') + '</button></p>';
    adminUI.panel.innerHTML = h;
  }, function(e) { adminUI.panel.innerHTML = '<p class="warning">' + aesc(e && e.message) + '</p>'; });
}
function adminCopy(btn) {
  var a = btn.closest('.inst-card').querySelector('textarea');
  a.select();
  try { navigator.clipboard.writeText(a.value); } catch (e) { document.execCommand('copy'); }
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
    adminDeleteInstance(adminUI.pid, id).then(function() { adminUI.rows.forEach(function(r) { if (r.id === adminUI.open && r.instances && r.instances[0]) r.instances[0].count--; }); adminOpenPlayer(adminUI.open); }, function(e) { alert(e && e.message); });
  });
}
function adminAskDeleteUser() {
  var uid = adminUI.open, player = adminUI.rows.filter(function(r) { return r.id === uid; })[0];
  adminConfirm3(adminTr('Supprimer le compte de ', 'Delete the account of ') + player.pseudo + ' (' + player.email + ')', function() {
    adminDeleteUser(adminUI.pid, uid).then(function() { adminUI.rows = adminUI.rows.filter(function(r) { return r.id !== uid; }); adminDrawList(); }, function(e) { alert(e && e.message); });
  });
}
