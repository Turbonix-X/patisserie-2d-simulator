/* ============================================
   PATISSERIE 2D SIMULATOR - COMPTES EN LIGNE (Supabase)
   Ecrit sans la bibliotheque Supabase : de simples requetes, donc rien
   ne bloque hors ligne. Tout reste utilisable avec les sauvegardes locales.
   ============================================ */

var cloud = { pushTimer: null, busy: false, adminOf: {}, lastError: '' };

function cloudEnabled() { return !!(P2DS_CONFIG.SUPABASE_URL && P2DS_CONFIG.SUPABASE_ANON_KEY); }
function cloudOnline() { return cloudEnabled() && navigator.onLine !== false; }
function cloudSessions() { return lsJSON('p2ds_sessions', {}); }
function cloudSaveSessions(s) { lsSet('p2ds_sessions', JSON.stringify(s)); }

// Une requete vers Supabase. Renvoie le JSON, ou lance { status, message }.
function cloudFetch(path, opts, token) {
  opts = opts || {};
  var headers = { apikey: P2DS_CONFIG.SUPABASE_ANON_KEY };
  // Les nouvelles cles "publishable" (sb_publishable_...) ne sont pas des jetons : on n'envoie que le jeton du joueur connecte
  if (token) headers.Authorization = 'Bearer ' + token;
  else if (/^eyJ/.test(P2DS_CONFIG.SUPABASE_ANON_KEY)) headers.Authorization = 'Bearer ' + P2DS_CONFIG.SUPABASE_ANON_KEY;
  if (opts.body) headers['Content-Type'] = 'application/json';
  if (opts.prefer) headers.Prefer = opts.prefer;
  return fetch(P2DS_CONFIG.SUPABASE_URL.replace(/\/$/, '') + path, { method: opts.method || 'GET', headers: headers, body: opts.body ? JSON.stringify(opts.body) : undefined }).then(function(r) {
    return r.text().then(function(txt) {
      var data = null;
      try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = null; }
      if (!r.ok) {
        var err = { status: r.status, message: (data && (data.msg || data.error_description || data.message || data.error)) || ('HTTP ' + r.status) };
        throw err;
      }
      return data;
    });
  });
}

function cloudStoreSession(data) {
  var u = data.user || {};
  var pseudo = (u.user_metadata && (u.user_metadata.pseudo || u.user_metadata.full_name || u.user_metadata.name)) || (u.email ? u.email.split('@')[0] : '');
  var s = cloudSessions();
  s[u.id] = { email: u.email, pseudo: pseudo, access: data.access_token, refresh: data.refresh_token, exp: Date.now() + (data.expires_in || 3600) * 1000 };
  cloudSaveSessions(s);
  addCloudProfile(u.id, pseudo, u.email);
  return u.id;
}

// Inscription : renvoie 'ok' (connecte), 'confirm' (un mail de confirmation a ete envoye) ou lance une erreur
function cloudSignUp(pseudo, email, password) {
  return cloudFetch('/auth/v1/signup', { method: 'POST', body: { email: email, password: password, data: { pseudo: pseudo } } }).then(function(d) {
    if (d && d.access_token) { cloudStoreSession(d); return 'ok'; }
    // Pas de session tout de suite : on se connecte directement (aucun e-mail de confirmation n'est demande)
    return cloudSignIn(email, password).then(function() { return 'ok'; });
  });
}
function cloudSignIn(email, password) {
  return cloudFetch('/auth/v1/token?grant_type=password', { method: 'POST', body: { email: email, password: password } }).then(function(d) { return cloudStoreSession(d); });
}
// Google : la page part chez Google, puis revient avec la session dans l'adresse
function cloudGoogle() {
  var back = location.origin + location.pathname;
  location.href = P2DS_CONFIG.SUPABASE_URL.replace(/\/$/, '') + '/auth/v1/authorize?provider=google&redirect_to=' + encodeURIComponent(back);
}
var cloudRecovery = null;
function cloudSetPassword(token, password) {
  return cloudFetch('/auth/v1/user', { method: 'PUT', body: { password: password } }, token);
}
function cloudHandleRedirect() {
  if (!cloudEnabled() || location.hash.indexOf('access_token=') < 0) return Promise.resolve(null);
  var params = {};
  location.hash.slice(1).split('&').forEach(function(kv) { var p = kv.split('='); params[p[0]] = decodeURIComponent(p[1] || ''); });
  history.replaceState(null, '', location.pathname + location.search);
  if (!params.access_token) return Promise.resolve(null);
  return cloudFetch('/auth/v1/user', {}, params.access_token).then(function(u) {
    // Le lien d'un e-mail "mot de passe oublie" : on proposera d'en choisir un nouveau
    if (params.type === 'recovery') cloudRecovery = { token: params.access_token };
    return cloudStoreSession({ user: u, access_token: params.access_token, refresh_token: params.refresh_token, expires_in: +params.expires_in || 3600 });
  }).catch(function() { return null; });
}
function cloudSignOut(pid) {
  var s = cloudSessions();
  delete s[pid];
  cloudSaveSessions(s);
  removeProfile(pid);
}

// Un jeton valable : on le rafraichit s'il va expirer
function cloudToken(pid) {
  var s = cloudSessions()[pid];
  if (!s) return Promise.reject({ status: 401, message: 'no session' });
  if (s.exp > Date.now() + 60000) return Promise.resolve(s.access);
  return cloudFetch('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: s.refresh } }).then(function(d) {
    cloudStoreSession(d);
    return d.access_token;
  });
}
function cloudCall(pid, path, opts) { return cloudToken(pid).then(function(tok) { return cloudFetch(path, opts, tok); }); }

// ---------- Synchronisation des instances ----------
function cloudPushInstance(pid, id) {
  var inst = findInstance(pid, id), raw = instanceRaw(pid, id);
  if (!inst || !raw) return Promise.resolve();
  return cloudCall(pid, '/rest/v1/instances?on_conflict=id', { method: 'POST', prefer: 'resolution=merge-duplicates,return=minimal', body: {
    id: id, user_id: pid, bakery_name: inst.name || '', save_data: raw, updated_at: new Date(inst.updated || Date.now()).toISOString()
  } });
}

// Pousse la partie en cours, au plus une fois toutes les 6 secondes
function cloudQueuePush() {
  var prof = findProfile(CUR.profile);
  if (!prof || prof.kind !== 'cloud' || !cloudOnline() || !CUR.inst || cloud.pushTimer) return;
  cloud.pushTimer = setTimeout(function() {
    cloud.pushTimer = null;
    cloudPushInstance(CUR.profile, CUR.inst).catch(function(e) { cloud.lastError = e && e.message; });
  }, 6000);
}

// Fusionne ce qu'il y a en ligne et ce qu'il y a ici : le plus recent gagne
function cloudSync(pid) {
  if (!cloudOnline() || cloud.busy) return Promise.resolve(false);
  cloud.busy = true;
  return cloudCall(pid, '/rest/v1/instances?select=id,bakery_name,save_data,updated_at&order=updated_at.desc').then(function(remote) {
    var jobs = [];
    var remoteIds = {};
    remote.forEach(function(r) {
      remoteIds[r.id] = true;
      var local = findInstance(pid, r.id), rt = Date.parse(r.updated_at) || 0;
      if (!local) {
        if (!instancesFull(pid)) createInstance(pid, r.bakery_name, 'normal', r.save_data, r.id);
      } else if (rt > (local.updated || 0) + 2000 && !(CUR.inst === r.id && CUR.profile === pid)) {
        lsSet(saveKeyOf(pid, r.id), r.save_data);
        local.updated = rt; local.name = r.bakery_name || local.name;
        var list = listInstances(pid);
        list.forEach(function(x) { if (x.id === r.id) { x.updated = rt; x.name = local.name; try { x.level = JSON.parse(r.save_data).level || x.level; } catch (e) { /* ok */ } } });
        saveInstanceList(pid, list);
      } else if ((local.updated || 0) > rt + 2000) {
        jobs.push(cloudPushInstance(pid, r.id));
      }
    });
    listInstances(pid).forEach(function(x) { if (!remoteIds[x.id]) jobs.push(cloudPushInstance(pid, x.id)); });
    return Promise.all(jobs.map(function(j) { return j.catch(function() {}); }));
  }).then(function() { cloud.busy = false; return true; }, function(e) { cloud.busy = false; cloud.lastError = e && e.message; return false; });
}

function cloudDeleteInstance(pid, id) { return cloudCall(pid, '/rest/v1/instances?id=eq.' + encodeURIComponent(id), { method: 'DELETE' }); }

// Des que la connexion revient, on synchronise
window.addEventListener('online', function() {
  var prof = findProfile(getProfiles().current);
  if (prof && prof.kind === 'cloud') cloudSync(prof.id);
});

// ---------- Administration (la base verifie toute seule que tu es l'administrateur) ----------
// Le resultat est garde : l'accueil de l'administrateur s'affiche tout de suite (la base re-verifie tout de toute facon)
function cloudIsAdmin(pid) {
  if (!cloudSessions()[pid]) return Promise.resolve(false);
  if (cloud.adminOf[pid] === undefined && lsGet('p2ds_adm_' + pid) === '1') cloud.adminOf[pid] = true;
  if (!cloudOnline()) return Promise.resolve(!!cloud.adminOf[pid]);
  return cloudCall(pid, '/rest/v1/rpc/is_admin', { method: 'POST', body: {} }).then(function(r) {
    cloud.adminOf[pid] = r === true;
    if (r === true) lsSet('p2ds_adm_' + pid, '1'); else lsDel('p2ds_adm_' + pid);
    return cloud.adminOf[pid];
  }, function() { return !!cloud.adminOf[pid]; });
}
function cloudAdminKnown(pid) { if (cloud.adminOf[pid] === undefined && cloudSessions()[pid] && lsGet('p2ds_adm_' + pid) === '1') cloud.adminOf[pid] = true; return !!cloud.adminOf[pid]; }
// Sans la table de presence (SQL pas encore relance), on liste quand meme les joueurs : ils apparaissent "fermes"
function adminListPlayers(pid) {
  return cloudCall(pid, '/rest/v1/profiles?select=id,pseudo,email,created_at,instances(count),presence(status,bakery_name,level,platform,last_seen)&order=created_at.desc').catch(function(e) {
    if (e && /relationship|presence|PGRST20/i.test(String(e.message))) return cloudCall(pid, '/rest/v1/profiles?select=id,pseudo,email,created_at,instances(count)&order=created_at.desc');
    throw e;
  });
}
function adminListInstances(pid, uid) { return cloudCall(pid, '/rest/v1/instances?user_id=eq.' + encodeURIComponent(uid) + '&select=id,bakery_name,updated_at,save_data&order=updated_at.desc'); }
function adminDeleteInstance(pid, id) { return cloudDeleteInstance(pid, id); }
function adminDeleteUser(pid, uid) { return cloudCall(pid, '/rest/v1/rpc/admin_delete_user', { method: 'POST', body: { target: uid } }); }

// ---------- Presence : l'administrateur voit qui a le jeu ouvert, qui joue, qui est parti ----------
function presenceInfo() {
  var inGame = !document.body.classList.contains('home-open') && !!CUR.inst;
  return { status: inGame ? 'playing' : 'open', bakery_name: inGame && typeof G !== 'undefined' ? (G.bakeryName || '') : '', level: inGame && typeof G !== 'undefined' ? (G.level || 0) : 0 };
}
function cloudPresence(status, keepalive) {
  var prof = findProfile(getProfiles().current);
  if (!prof || prof.kind !== 'cloud' || !cloudOnline()) return Promise.resolve();
  var info = presenceInfo();
  if (status) info.status = status;
  var body = { user_id: prof.id, status: info.status, bakery_name: info.bakery_name, level: info.level, platform: window.__TAURI_INTERNALS__ ? 'app' : 'web', last_seen: new Date().toISOString() };
  if (keepalive) {
    // A la fermeture de la page : on n'a pas le temps de rafraichir le jeton, on utilise celui qu'on a
    var s = cloudSessions()[prof.id];
    if (!s) return Promise.resolve();
    try {
      fetch(P2DS_CONFIG.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/presence?on_conflict=user_id', { method: 'POST', keepalive: true, headers: { apikey: P2DS_CONFIG.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + s.access, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify(body) });
    } catch (e) { /* tant pis */ }
    return Promise.resolve();
  }
  return cloudCall(prof.id, '/rest/v1/presence?on_conflict=user_id', { method: 'POST', prefer: 'resolution=merge-duplicates,return=minimal', body: body }).catch(function() { /* hors ligne ou pas de table : tant pis */ });
}
setInterval(function() { cloudPresence(); }, 15000);
window.addEventListener('pagehide', function() { cloudPresence('closed', true); });
