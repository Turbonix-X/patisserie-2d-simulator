/* ============================================
   PATISSERIE 2D SIMULATOR - PROFILS ET INSTANCES
   Un profil (local, ou un compte en ligne) a jusqu'a 5 instances :
   chacune est une partie complete, avec sa propre sauvegarde.
   ============================================ */

var PROFILES_KEY = 'p2ds_profiles';

function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
function lsDel(k) { try { localStorage.removeItem(k); } catch (e) { /* tant pis */ } }
function lsJSON(k, fallback) { try { var v = JSON.parse(lsGet(k)); return v || fallback; } catch (e) { return fallback; } }

function newId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'i' + Date.now().toString(36) + Math.floor(Math.random() * 1e9).toString(36);
}

// ---------- Profils ----------
function getProfiles() {
  var p = lsJSON(PROFILES_KEY, null);
  if (!p || !p.list) p = { list: [{ id: 'local', name: '', kind: 'local' }], current: 'local' };
  if (!p.list.some(function(x) { return x.id === 'local'; })) p.list.unshift({ id: 'local', name: '', kind: 'local' });
  return p;
}
function saveProfiles(p) { lsSet(PROFILES_KEY, JSON.stringify(p)); }
function findProfile(pid) { var r = null; getProfiles().list.forEach(function(x) { if (x.id === pid) r = x; }); return r; }
function setCurrentProfile(pid) { var p = getProfiles(); p.current = pid; saveProfiles(p); }
function addCloudProfile(uid, pseudo, email) {
  var p = getProfiles(), found = null;
  p.list.forEach(function(x) { if (x.id === uid) found = x; });
  if (!found) { found = { id: uid, kind: 'cloud' }; p.list.push(found); }
  found.name = pseudo || found.name || email; found.email = email || found.email;
  p.current = uid;
  saveProfiles(p);
  return found;
}
function removeProfile(pid) {
  if (pid === 'local') return;
  var p = getProfiles();
  p.list = p.list.filter(function(x) { return x.id !== pid; });
  if (p.current === pid) p.current = 'local';
  saveProfiles(p);
}

// ---------- Instances ----------
function indexKeyOf(pid) { return 'p2ds_p_' + pid + '_index'; }
function listInstances(pid) { return lsJSON(indexKeyOf(pid), { list: [] }).list || []; }
function saveInstanceList(pid, list) { lsSet(indexKeyOf(pid), JSON.stringify({ list: list })); }
function instanceCount(pid) { return listInstances(pid).length; }
function instancesFull(pid) { return instanceCount(pid) >= P2DS_CONFIG.MAX_INSTANCES; }
function findInstance(pid, id) { var r = null; listInstances(pid).forEach(function(x) { if (x.id === id) r = x; }); return r; }

// Cree une instance. type : 'normal', 'max' ou 'creative'. raw : une sauvegarde deja ecrite (JSON), ou rien pour une nouvelle partie.
function createInstance(pid, name, type, raw, id) {
  if (instancesFull(pid)) return null;
  var list = listInstances(pid);
  var inst = { id: id || newId(), name: name || '', type: type || 'normal', created: Date.now(), updated: Date.now(), level: 1 };
  if (raw) {
    lsSet(saveKeyOf(pid, inst.id), raw);
    try { var d = JSON.parse(raw); inst.name = inst.name || d.bakeryName || ''; inst.level = d.level || 1; inst.updated = d.lastTick || inst.updated; } catch (e) { /* on garde les valeurs par defaut */ }
  }
  list.push(inst);
  saveInstanceList(pid, list);
  return inst;
}

function deleteInstance(pid, id) {
  saveInstanceList(pid, listInstances(pid).filter(function(x) { return x.id !== id; }));
  lsDel(saveKeyOf(pid, id));
  lsDel(saveKeyOf(pid, id) + '_backup');
  lsDel(saveKeyOf(pid, id) + '_corrupt');
}

function renameInstance(pid, id, name) {
  var list = listInstances(pid);
  list.forEach(function(x) { if (x.id === id) x.name = name; });
  saveInstanceList(pid, list);
}

// Ce que la liste affiche, tenu a jour a chaque sauvegarde
function touchInstanceMeta() {
  if (!CUR.inst || typeof G === 'undefined' || !G) return;
  var list = listInstances(CUR.profile), changed = false;
  list.forEach(function(x) {
    if (x.id !== CUR.inst) return;
    x.name = G.bakeryName || x.name; x.level = G.level; x.money = G.money; x.updated = Date.now(); changed = true;
  });
  if (changed) saveInstanceList(CUR.profile, list);
}

function instanceRaw(pid, id) { return lsGet(saveKeyOf(pid, id)); }
function instanceExportCode(pid, id) {
  var raw = instanceRaw(pid, id);
  if (!raw) return '';
  try { return btoa(unescape(encodeURIComponent(raw))); } catch (e) { return ''; }
}
// Un code (copier-coller) ou le texte d'un fichier : renvoie la sauvegarde en JSON, ou null
function decodeSaveText(text) {
  text = String(text || '').trim();
  if (!text) return null;
  try {
    var json = text.charAt(0) === '{' ? text : decodeURIComponent(escape(atob(text)));
    var d = JSON.parse(json);
    if (!d || typeof d !== 'object' || typeof d.money !== 'number') return null;
    return json;
  } catch (e) { return null; }
}
function importInstance(pid, text) {
  var json = decodeSaveText(text);
  if (!json) return 'invalid';
  if (instancesFull(pid)) return 'full';
  return createInstance(pid, '', 'normal', json) ? 'ok' : 'full';
}

// L'ancienne sauvegarde unique devient la premiere instance locale
function migrateLegacySave() {
  var legacy = lsGet('p2ds_save');
  if (!legacy || instanceCount('local') > 0 || lsGet('p2ds_legacy_done')) return;
  var inst = createInstance('local', '', 'normal', legacy);
  if (inst) lsSet('p2ds_legacy_done', '1');
}
