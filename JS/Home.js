/* ============================================
   PATISSERIE 2D SIMULATOR - PAGE D'ACCUEIL
   Le logo, 5 emplacements de partie, et trois boutons : compte, reglages, telechargement
   ============================================ */

var homeState = { note: '' };
var IN_APP = !!window.__TAURI_INTERNALS__;
if (IN_APP) {
  document.documentElement.classList.add('in-app');
  // Dans l'appli : pas de clic droit de navigateur
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
}
var SITE_URL = 'https://turbonix-x.github.io/patisserie-2d-simulator/';

// Le bouton d'installation : seulement dans un navigateur, sur un PC Windows
function canOfferInstall() {
  var ua = navigator.userAgent || '';
  return !IN_APP && /Windows NT/.test(ua) && !/Mobile|Android|Windows Phone/.test(ua);
}
function installApp() {
  var a = document.createElement('a');
  a.href = P2DS_CONFIG.DOWNLOAD_URL;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  if (typeof toast === 'function') toast(t('home.installStarted'));
}
function installBtnHTML() {
  if (!canOfferInstall()) return '';
  return '<button class="hbtn install-btn" onclick="installApp()" title="' + escH(t('home.install')) + '" aria-label="' + escH(t('home.install')) + '">' + uiIcon('download') + '</button>';
}

// ---------- Tauri : ce que l'installeur a note ----------
function tauriInvoke(cmd, args) { return window.__TAURI_INTERNALS__.invoke(cmd, args || {}); }
function openExternal(url) {
  if (IN_APP) return tauriInvoke('plugin:opener|open_url', { url: url }).catch(function() { window.open(url, '_blank'); });
  window.open(url, '_blank', 'noopener');
  return Promise.resolve();
}
function applyTauriInit() {
  if (!IN_APP || lsGet('p2ds_init_done')) return Promise.resolve();
  return tauriInvoke('get_init_config').then(function(cfg) {
    lsSet('p2ds_init_done', '1');
    if (!cfg) return;
    if (cfg.lang && LANGS[cfg.lang]) { lsSet('p2ds_lang', cfg.lang); currentLang = cfg.lang; }
    if (cfg.save_text) importInstance('local', cfg.save_text);
    if (cfg.account === 'register') openExternal(SITE_URL + '?signup');
    else if (cfg.account === 'login') homeState.openLogin = true;
  }).catch(function() { /* pas d'installeur : tant pis */ });
}

// ---------- Affichage ----------
function homeProfile() { return findProfile(getProfiles().current) || findProfile('local'); }
function homePid() { return homeProfile().id; }
function profileLabel(p) { return p.kind === 'local' ? t('home.profileLocal') : (p.name || p.email || '?'); }
function homeIsAdmin() { return !!cloud.adminOf[homePid()]; }

function showHome() {
  migrateLegacySave();
  var el = document.getElementById('home');
  if (!el) { bootGame(); return; }
  el.style.display = 'flex';
  document.body.classList.add('home-open');
  homeApplyTheme();
  applyLangDir();
  renderHome();
  applyTauriInit().then(function() { return cloudHandleRedirect(); }).then(function() {
    renderHome();
    if (homeState.openLogin) { homeState.openLogin = false; showAccountModal(); }
    else if (/[?&]signup/.test(location.search)) showAccountModal('up');
    homeAutoSync();
  });
}

function homeAutoSync() {
  var p = homeProfile();
  if (p.kind !== 'cloud' || !cloudOnline()) return;
  homeFlushDeletes(p.id).then(function() { return cloudSync(p.id); }).then(function() { renderHome(); });
}

function renderHome() {
  var el = document.getElementById('home');
  if (!el || el.style.display === 'none') return;
  var cur = homeProfile(), pid = cur.id, list = listInstances(pid), max = P2DS_CONFIG.MAX_INSTANCES;
  var h = '<div class="home-top"><button type="button" class="version-badge' + (typeof updateState !== 'undefined' && updateState.newVersion ? ' has-update' : '') + '" onclick="showChangelog()" title="' + escH(t('changelog.title')) + '">' + GAME_VERSION + '</button>';
  h += '<div class="home-top-right"><button class="hbtn" onclick="showAccountModal()" title="' + escH(t('home.accountsTitle')) + '" aria-label="' + escH(t('home.accountsTitle')) + '">' + uiIcon('user') + '</button>';
  h += '<button class="hbtn" onclick="showHomeSettings()" title="' + escH(t('settings.title')) + '" aria-label="' + escH(t('settings.title')) + '">' + uiIcon('settings') + '</button>' + installBtnHTML() + '</div></div>';
  h += '<div class="home-center"><img class="home-logo" src="logo.svg" alt="" width="104" height="104"><h1 class="game-name home-name">P2DS</h1>';
  h += '<div class="inst-grid">';
  list.forEach(function(x) {
    // Toute la case ouvre la partie, sauf l'export et la corbeille
    h += '<div class="inst-slot" role="button" tabindex="0" onclick="homePlay(\'' + x.id + '\')" onkeydown="if(event.key===\'Enter\')homePlay(\'' + x.id + '\')"><b class="inst-name">' + escH(x.name || t('home.unnamed')) + '</b>';
    h += '<span class="inst-meta">' + t('home.levelShort', { v: x.level || 1 }) + (x.updated ? ' · ' + new Date(x.updated).toLocaleDateString() : '') + '</span>';
    h += (x.type !== 'normal' ? '<span class="inst-type">' + t('home.type' + (x.type === 'max' ? 'Max' : 'Creative')) + '</span>' : '');
    h += '<div class="inst-actions"><button class="btn btn-small icon-only" onclick="event.stopPropagation();homeExport(\'' + x.id + '\')" title="' + escH(t('home.export')) + '" aria-label="' + escH(t('home.export')) + '">' + uiIcon('save') + '</button>';
    h += '<button class="btn btn-small btn-danger icon-only" onclick="event.stopPropagation();homeAskDelete(\'' + x.id + '\')" title="' + escH(t('home.delete')) + '" aria-label="' + escH(t('home.delete')) + '">' + uiIcon('trash') + '</button></div></div>';
  });
  // Un seul bouton +, et plus du tout quand les 5 cases sont prises
  if (list.length < max) h += '<button class="inst-slot empty" onclick="homeAdd()" title="' + escH(t('home.new')) + '" aria-label="' + escH(t('home.new')) + '"><span>+</span></button>';
  h += '</div>';
  if (list.length >= max) h += '<p class="home-limit">' + t('home.limit', { v: list.length, n: max }) + '</p>';
  if (homeState.note) h += '<p class="home-note">' + escH(homeState.note) + '</p>';
  // Le meme pied de page que dans le jeu
  h += '</div><footer class="home-footer">' + new Date().getFullYear() + ' ' + t('footer.rights') + ' ' + t('footer.icons') + ' <a href="https://github.com/jdecked/twemoji" target="_blank" rel="noopener">Twemoji</a> (CC-BY 4.0).</footer>';
  setHTML(el, iconify(h));
  if (cur.kind === 'cloud' && cloud.adminOf[cur.id] === undefined) {
    cloudIsAdmin(cur.id).then(function(a) { if (a) renderHome(); });
  }
}

// ---------- Ajouter une partie : nouvelle, code colle, ou fichier ----------
function homeAdd(mode) {
  mode = mode || 'new';
  var pid = homePid();
  if (instancesFull(pid)) { homeState.note = t('home.limit', { v: instanceCount(pid), n: P2DS_CONFIG.MAX_INSTANCES }); renderHome(); return; }
  var h = '<h2>+ ' + t('home.new') + '</h2><div class="segmented theme-scope">';
  [['new', 'home.newGame'], ['code', 'home.pasteCode'], ['file', 'home.openFile']].forEach(function(m) {
    h += '<button class="' + (mode === m[0] ? 'active' : '') + '" onclick="homeAdd(\'' + m[0] + '\')">' + t(m[1]) + '</button>';
  });
  h += '</div>';
  if (mode === 'new') {
    // Pas de nom a donner ici : c'est Bob qui le demande au debut de la partie
    // La partie max et la partie creative sont reservees a l'administrateur
    if (homeIsAdmin()) h += '<select id="home-type" class="set-select"><option value="normal">' + t('home.typeNormal') + '</option><option value="max">' + t('home.typeMax') + '</option><option value="creative">' + t('home.typeCreative') + '</option></select>';
    h += '<div class="create-wrap"><button class="create-big" onclick="homeCreate()"><span class="create-plus">+</span>' + t('home.create') + '</button></div>';
  } else if (mode === 'code') {
    h += '<textarea id="home-code" class="save-area" rows="4" placeholder="' + escH(t('settings.importPlaceholder')) + '"></textarea><p class="warning" id="home-err"></p>';
    h += '<div class="modal-btns"><button class="btn btn-primary" onclick="homeImportCode()">' + t('settings.importBtn') + '</button></div>';
  } else {
    h += '<p class="set-help">' + t('home.fileHelp') + '</p><p class="warning" id="home-err"></p><div class="modal-btns"><label class="btn btn-primary file-pick">' + t('settings.importFile') + '<input type="file" accept=".p2ds,.txt,text/plain" onchange="homeImportFile(this)"></label></div>';
  }
  h += '<div class="modal-btns"><button class="btn" onclick="hideModal()">' + t('common.close') + '</button></div>';
  showModal(h);
}

// ---------- Actions ----------
function homePlay(id) {
  CUR.profile = homePid();
  CUR.inst = id;
  // Une partie neuve parle la langue du menu ; ensuite, la partie garde sa propre langue
  CUR.fresh = !instanceRaw(CUR.profile, id);
  CUR.menuLang = currentLang;
  bootGame();
}
function homeCreate() {
  var pid = homePid();
  var name = '';
  var typeEl = document.getElementById('home-type');
  var type = typeEl && homeIsAdmin() ? typeEl.value : 'normal';
  var inst = createInstance(pid, name, type);
  hideModal();
  if (!inst) { renderHome(); return; }
  homePlay(inst.id);
}
function homeImportCode() {
  var area = document.getElementById('home-code');
  homeFinishImport(importInstance(homePid(), area ? area.value : ''));
}
function homeImportFile(input) {
  var file = input.files && input.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function() { homeFinishImport(importInstance(homePid(), String(reader.result || ''))); input.value = ''; };
  reader.readAsText(file);
}
function homeFinishImport(r) {
  if (r === 'ok') { homeState.note = ''; hideModal(); var p = homeProfile(); if (p.kind === 'cloud') cloudSync(p.id); renderHome(); return; }
  var err = document.getElementById('home-err');
  if (err) err.textContent = r === 'full' ? t('home.limit', { v: P2DS_CONFIG.MAX_INSTANCES, n: P2DS_CONFIG.MAX_INSTANCES }) : t('settings.importError');
}

function homeExport(id) {
  var pid = homePid(), inst = findInstance(pid, id);
  var code = instanceExportCode(pid, id);
  var h = '<h2>' + t('home.exportTitle', { n: escH(inst ? inst.name || t('home.unnamed') : '') }) + '</h2><p class="set-help">' + t('settings.exportHelp2') + '</p>';
  h += '<textarea id="exp-code" class="save-area" readonly rows="4" onclick="this.select()">' + escH(code) + '</textarea>';
  h += '<div class="modal-btns"><button class="btn btn-primary" onclick="homeCopyCode()">' + t('settings.exportBtn') + '</button><button class="btn" onclick="homeDownload(\'' + id + '\')">' + t('settings.exportFile') + '</button><button class="btn" onclick="hideModal()">' + t('common.close') + '</button></div>';
  showModal(h);
}
function homeCopyCode() {
  var a = document.getElementById('exp-code');
  if (!a) return;
  a.select();
  try { navigator.clipboard.writeText(a.value); } catch (e) { document.execCommand('copy'); }
  toast(t('settings.exported'));
}
function homeDownload(id) {
  var pid = homePid(), inst = findInstance(pid, id);
  var blob = new Blob([instanceExportCode(pid, id)], { type: 'text/plain' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'p2ds-' + String((inst && inst.name) || 'partie').replace(/[^A-Za-z0-9_-]+/g, '_').slice(0, 30) + '-' + new Date().toISOString().slice(0, 10) + '.p2ds';
  document.body.appendChild(a); a.click();
  setTimeout(function() { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
function homeAskDelete(id) {
  var pid = homePid(), inst = findInstance(pid, id);
  var h = '<h2>' + t('home.delete') + '</h2><p class="warning">' + t('home.delConfirm', { n: escH(inst ? inst.name || t('home.unnamed') : '') }) + '</p>';
  h += '<div class="modal-btns"><button class="btn btn-danger" onclick="homeDelete(\'' + id + '\')">' + uiIcon('trash') + ' ' + t('home.delete') + '</button><button class="btn" onclick="hideModal()">' + t('common.cancel') + '</button></div>';
  showModal(h);
}
function homeDelete(id) {
  var pid = homePid();
  deleteInstance(pid, id);
  var p = homeProfile();
  if (p.kind === 'cloud') {
    if (cloudOnline()) cloudDeleteInstance(pid, id).catch(function() { homeQueueDelete(pid, id); });
    else homeQueueDelete(pid, id);
  }
  hideModal();
  renderHome();
}
// Une suppression faite hors ligne part des que la connexion revient
function homeQueueDelete(pid, id) { var l = lsJSON('p2ds_pending_del_' + pid, []); l.push(id); lsSet('p2ds_pending_del_' + pid, JSON.stringify(l)); }
function homeFlushDeletes(pid) {
  var l = lsJSON('p2ds_pending_del_' + pid, []);
  if (!l.length || !cloudOnline()) return Promise.resolve();
  lsDel('p2ds_pending_del_' + pid);
  return Promise.all(l.map(function(id) { return cloudDeleteInstance(pid, id).catch(function() { homeQueueDelete(pid, id); }); }));
}

// ---------- Reglages de l'accueil : la langue, et clair ou sombre ----------
function showHomeSettings() {
  var themePref = homeThemePref();
  var h = '<div class="hs-head"><h2>' + uiIcon('settings') + ' ' + t('settings.title') + '</h2><button class="icon-btn" onclick="hideModal()" aria-label="' + escH(t('common.close')) + '">' + uiIcon('close') + '</button></div>';
  h += '<section class="hs-card"><h3>' + uiIcon('globe') + ' ' + t('home.language') + '</h3><div class="hs-langs">';
  // Toujours dans le meme ordre : l'anglais d'abord, puis le francais, etc.
  LANG_LIST.forEach(function(l) {
    h += '<button class="hs-lang' + (currentLang === l.code ? ' active' : '') + '" onclick="homeSetLang(\'' + l.code + '\')"><span class="hs-flag">' + l.flag + '</span><span>' + l.name + '</span></button>';
  });
  h += '</div></section><section class="hs-card"><h3>' + uiIcon('palette') + ' ' + t('settings.theme') + '</h3><div class="theme-cards hs-themes">';
  [['light', 'settings.themeLight'], ['dark', 'settings.themeDark'], ['auto', 'settings.themeAuto']].forEach(function(o) {
    h += '<button class="theme-card' + (themePref === o[0] ? ' active' : '') + '" onclick="homeSetTheme(\'' + o[0] + '\')" aria-pressed="' + (themePref === o[0]) + '"><span class="theme-prev tp-' + o[0] + '"><i></i><i></i><i></i></span><span class="theme-name">' + t(o[1]) + '</span></button>';
  });
  h += '</div></section>';
  showModal(h, 'modal-home-settings');
}
function homeSetLang(code) {
  if (!LANGS[code]) return;
  currentLang = code;
  lsSet('p2ds_lang', code);
  applyLangDir();
  renderHome();
  showHomeSettings();
}
// Le theme du menu : clair, sombre, ou automatique (celui du navigateur)
function homeThemePref() { var v = lsGet('p2ds_home_theme'); return v === 'dark' || v === 'auto' ? v : 'light'; }
function homeApplyTheme() {
  var pref = homeThemePref();
  var dark = pref === 'dark' || (pref === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}
function homeSetTheme(theme) {
  lsSet('p2ds_home_theme', theme);
  homeApplyTheme();
  showHomeSettings();
}
if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() { if (document.body.classList.contains('home-open')) homeApplyTheme(); });

// ---------- Comptes ----------
var GOOGLE_LOGO = '<svg class="google-logo" viewBox="0 0 48 48" width="18" height="18" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';

function showAccountModal(mode) {
  mode = mode || 'in';
  var profiles = getProfiles(), cur = homeProfile();
  var h = '<h2>' + uiIcon('user') + ' ' + t('home.accountsTitle') + '</h2>';
  // Les comptes deja connectes : on passe de l'un a l'autre
  h += '<div class="acc-list">';
  profiles.list.forEach(function(p) {
    h += '<div class="acc-row' + (p.id === cur.id ? ' current' : '') + '"><span>' + uiIcon(p.kind === 'local' ? 'store' : 'user') + ' ' + escH(profileLabel(p)) + '</span>';
    h += p.id === cur.id ? '<small>✓</small>' : '<button class="btn btn-small" onclick="homeUseProfile(\'' + p.id + '\')">' + t('home.use') + '</button>';
    if (p.kind === 'cloud') h += '<button class="btn btn-small" onclick="homeSignOut(\'' + p.id + '\')">' + t('home.signOut') + '</button>';
    h += '</div>';
  });
  h += '</div>';
  if (homeIsAdmin()) h += '<p><a class="btn btn-small" href="admin.html">' + t('home.adminPanel') + '</a></p>';
  if (!cloudEnabled()) h += '<p class="warning">' + t('home.cloudOff') + '</p>';
  else {
    // Se connecter, s'inscrire, ou continuer avec Google : tout sur la meme ligne
    h += '<div class="acc-modes"><button class="' + (mode === 'in' ? 'active' : '') + '" onclick="showAccountModal(\'in\')">' + t('home.signIn') + '</button><button class="' + (mode === 'up' ? 'active' : '') + '" onclick="showAccountModal(\'up\')">' + t('home.signUp') + '</button>';
    if (!IN_APP) h += '<button class="google-btn" onclick="cloudGoogle()" title="' + escH(t('home.google')) + '">' + GOOGLE_LOGO + '<span>' + t('home.google') + '</span></button>';
    h += '</div>';
    if (mode === 'up') h += '<input id="acc-pseudo" maxlength="24" placeholder="' + escH(t('home.pseudo')) + '" autocomplete="nickname">';
    h += '<input id="acc-email" type="email" placeholder="' + escH(t('home.email')) + '" autocomplete="email"><input id="acc-pass" type="password" placeholder="' + escH(t('home.password')) + '" autocomplete="' + (mode === 'up' ? 'new-password' : 'current-password') + '" onkeydown="if(event.key===\'Enter\')submitAccount(\'' + mode + '\')">';
    h += '<p class="warning" id="acc-error"></p><div class="modal-btns"><button class="btn btn-primary" onclick="submitAccount(\'' + mode + '\')">' + t(mode === 'up' ? 'home.signUp' : 'home.signIn') + '</button></div>';
  }
  h += '<p class="set-help">' + t(IN_APP ? 'home.storageApp' : 'home.storageBrowser') + '</p><div class="modal-btns"><button class="btn" onclick="hideModal()">' + t('common.close') + '</button></div>';
  showModal(h);
}
function homeUseProfile(pid) { setCurrentProfile(pid); hideModal(); renderHome(); homeAutoSync(); }
function submitAccount(mode) {
  var email = (document.getElementById('acc-email').value || '').trim(), pass = document.getElementById('acc-pass').value || '';
  var pseudoEl = document.getElementById('acc-pseudo'), pseudo = pseudoEl ? pseudoEl.value.trim() : '';
  var err = document.getElementById('acc-error');
  err.textContent = '';
  if (!email || pass.length < 6 || (mode === 'up' && !pseudo)) { err.textContent = t('home.authFill'); return; }
  var done = function() { hideModal(); renderHome(); homeAutoSync(); };
  var fail = function(e) { err.textContent = t('home.authError', { v: (e && e.message) || '' }); };
  if (mode === 'up') cloudSignUp(pseudo, email, pass).then(function(r) { if (r === 'confirm') { err.className = 'set-help'; err.textContent = t('home.confirmMail'); } else done(); }, fail);
  else cloudSignIn(email, pass).then(done, fail);
}
function homeSignOut(pid) { cloudSignOut(pid); showAccountModal(); renderHome(); }

// ---------- Dans le jeu : le bouton Comptes du haut ----------
function showAccountsModal() {
  var p = homeProfile();
  var h = '<h2>' + uiIcon('user') + ' ' + t('home.accountsTitle') + '</h2><p>' + t('home.signedAs', { n: escH(profileLabel(p)) }) + '</p><p class="set-help">' + t(IN_APP ? 'home.storageApp' : 'home.storageBrowser') + '</p>';
  if (p.kind === 'cloud') h += '<p class="set-help" id="acc-sync">' + t(cloudOnline() ? 'home.cloudOn' : 'home.syncFail') + '</p>';
  h += '<div class="modal-btns"><button class="btn btn-primary" onclick="backToHome()">' + t('home.backHome') + '</button><button class="btn" onclick="hideModal()">' + t('common.close') + '</button></div>';
  showModal(h);
}
function backToHome() {
  // On sort tout de suite, sans fenetre : la partie est sauvegardee juste avant
  save();
  skipSaveOnUnload = true;
  var p = homeProfile();
  if (p.kind === 'cloud' && cloudOnline() && CUR.inst) { try { cloudPushInstance(p.id, CUR.inst); } catch (e) { /* tant pis : la synchro se fera a l'accueil */ } }
  location.href = location.pathname;
}

// ---------- Type d'instance : max ou creative des le debut ----------
function applyInstanceType() {
  var inst = findInstance(CUR.profile, CUR.inst);
  if (CUR.fresh) { G.settings.lang = CUR.menuLang || G.settings.lang; CUR.fresh = false; }
  if (!inst || G.instInit) return;
  G.instInit = true;
  if (inst.name) G.bakeryName = inst.name;
  if (inst.type === 'max' || inst.type === 'creative') {
    G.introDone = true;
    G.tutorialDone = true;
    processCommand('/max');
    if (inst.type === 'creative') processCommand('/creative');
  }
}

window.addEventListener('online', function() { if (document.body.classList.contains('home-open')) renderHome(); });
