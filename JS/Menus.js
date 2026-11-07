/* ============================================
   PATISSERIE 2D SIMULATOR - REGLAGES ET PAUSE
   ============================================ */

// Depuis la pause, fermer un menu ramene a la pause
function closeMenu() {
  if (G.paused) showPauseModal();
  else hideModal();
}

// ============ PETITS MORCEAUX ============
function setRow(label, help, control) {
  return '<div class="set-row"><div class="set-label"><b>' + label + '</b>' + (help ? '<small>' + help + '</small>' : '') + '</div><div class="set-ctl">' + control + '</div></div>';
}

function setSwitch(on, action, label) {
  return '<button class="switch' + (on ? ' on' : '') + '" role="switch" aria-checked="' + on + '" aria-label="' + escH(label) + '" onclick="' + action + '"><span></span></button>';
}

function setCard(title, body, extra) {
  return '<section class="set-card' + (extra ? ' ' + extra : '') + '">' + (title ? '<h3>' + title + '</h3>' : '') + body + '</section>';
}

// ============ REGLAGES ============
function settingsPaneHTML() {
  var h = '';
  if (ui.settingsTab === 'general') h = settingsGeneral();
  else if (ui.settingsTab === 'look') h = settingsLook();
  else if (ui.settingsTab === 'audio') h = settingsAudio();
  else if (ui.settingsTab === 'ach') h = settingsAchievements();
  else if (ui.settingsTab === 'stats') h = statsPane();
  else h = settingsSave();
  return h + '<p class="set-version">P2DS ' + GAME_VERSION + ' · Turbonix Entertainment</p>';
}

function showSettingsModal() {
  var tabs = [['general', 'settings.tabGeneral', 'globe'], ['look', 'settings.tabLook', 'palette'], ['audio', 'settings.tabAudio', 'music'], ['save', 'settings.tabSave', 'save'], ['ach', 'settings.tabAch', 'ach'], ['stats', 'settings.tabStats', 'stats']];
  var h = '<div class="set-head"><h2>' + uiIcon('settings') + t('settings.title') + '</h2>';
  h += '<button class="icon-btn" onclick="closeMenu()" aria-label="' + escH(t('common.close')) + '" title="' + escH(t('common.close')) + '">' + uiIcon('close') + '</button></div>';
  h += '<div class="set-body"><nav class="set-nav">';
  tabs.forEach(function(tb) {
    var active = ui.settingsTab === tb[0];
    h += '<button class="set-tab' + (active ? ' active' : '') + '"' + (active ? ' aria-current="page"' : '') + ' onclick="ui.settingsTab=\'' + tb[0] + '\';showSettingsModal()">' + uiIcon(tb[2]) + '<span>' + t(tb[1]) + '</span></button>';
  });
  h += '</nav><div class="set-pane" id="set-pane">' + settingsPaneHTML() + '</div></div>';
  showModal(h, 'modal-settings');
}

// Met a jour le contenu sans bouger le defilement
function refreshSettingsPane() {
  var el = document.getElementById('set-pane');
  if (el) setHTML(el, settingsPaneHTML());
}

// ============ SUCCES ============
function settingsAchievements() {
  var c = achCounts();
  var byCat = {};
  ACHIEVEMENTS.forEach(function(a) {
    var got = !!G.achievements[a.id];
    byCat[a.cat] = byCat[a.cat] || { all: 0, done: 0 };
    if (a.hidden && !got) return; // Un secret n'existe pas tant qu'il n'est pas trouve
    byCat[a.cat].all++;
    if (got) byCat[a.cat].done++;
  });
  if (ui.achCat === 'secret' && c.secrets === 0) ui.achCat = 'general';
  var h = '<section class="set-card"><div class="ach-head"><b>' + t('ach.title') + '</b><span>' + c.done + ' / ' + c.total + (c.secrets > 0 ? ' ' + t('ach.secretsFound', { v: c.secrets }) : '') + '</span></div>';
  h += '<div class="loan-bar"><div style="width:' + (c.done / c.total * 100).toFixed(1) + '%"></div></div>';
  h += '<p class="set-help">' + t('ach.bonus', { v: Math.round((achievementBonus() - 1) * 1000) / 10 }) + '</p></section>';
  h += '<div class="list-tools">';
  ACH_CATEGORIES.forEach(function(cat) {
    if (cat === 'secret' && c.secrets === 0) return;
    h += '<button class="chip' + (ui.achCat === cat ? ' active' : '') + '" onclick="ui.achCat=\'' + cat + '\';refreshSettingsPane()">' + t('ach.cat.' + cat) + ' ' + byCat[cat].done + '/' + byCat[cat].all + '</button>';
  });
  h += '</div><div class="ach-grid">';
  ACHIEVEMENTS.forEach(function(a) {
    if (a.cat !== ui.achCat) return;
    var done = !!G.achievements[a.id];
    if (a.hidden && !done) return;
    // Tant qu'un succes n'est pas obtenu, on ne sait pas ce qu'il demande
    var desc = done ? achDesc(a) : t('ach.lockedDesc');
    h += '<div class="ach-item ' + (done ? 'unlocked' : 'locked') + '" title="' + escH(desc) + '">';
    h += '<div class="ach-icon">' + a.icon + '</div>';
    h += '<div class="ach-name">' + escH(achName(a)) + '</div>';
    h += '<div class="ach-desc">' + escH(desc) + '</div></div>';
  });
  return h + '</div>';
}

function currencyName(c) {
  try { return new Intl.DisplayNames([currentLang], { type: 'currency' }).of(c.id.toUpperCase()); } catch (e) { return c.fullName; }
}

function settingsGeneral() {
  var lang = '<div class="segmented">';
  LANG_LIST.forEach(function(l) {
    lang += '<button class="' + (currentLang === l.code ? 'active' : '') + '" onclick="setLanguage(\'' + l.code + '\');showSettingsModal()">' + l.flag + ' ' + l.name + '</button>';
  });
  lang += '</div>';
  var curr = '<select class="set-select" aria-label="' + escH(t('settings.currency')) + '" onchange="setCurrency(this.value);showSettingsModal()">';
  CURRENCIES.forEach(function(c) {
    curr += '<option value="' + c.id + '"' + (G.settings.currency === c.id ? ' selected' : '') + '>' + c.symbol + ' · ' + currencyName(c) + '</option>';
  });
  curr += '</select>';
  var h = setCard('', setRow(t('settings.lang'), t('settings.langHelp'), lang) + setRow(t('settings.currency'), t('settings.currencyHelp'), curr));
  var bday;
  if (G.birthday) {
    var fix = '<div class="birthday-pick"><span class="set-value">' + t('settings.birthdaySet', { d: G.birthday.day, m: G.birthday.month }) + '</span>' + birthdaySelects(G.birthday.day, G.birthday.month);
    fix += '<button class="btn btn-small" onclick="confirmBirthdayFix()"' + (G.money < BIRTHDAY_FIX_COST ? ' disabled' : '') + '>' + t('settings.birthdayFix', { v: fmtMoney(BIRTHDAY_FIX_COST) }) + '</button></div>';
    bday = setRow(t('settings.birthday'), t('settings.birthdayHelpFix', { v: fmtMoney(BIRTHDAY_FIX_COST) }), fix);
  } else {
    var ctl = '<div class="birthday-pick">' + birthdaySelects(1, 1) + '<button class="btn btn-small btn-primary" onclick="confirmBirthday()">' + t('settings.birthdayBtn') + '</button></div>';
        bday = setRow(t('settings.birthday'), t('settings.birthdayHelp'), ctl);
  }
  return h + setCard('', bday);
}

function birthdaySelects(day, month) {
  var h = '<select class="set-select" id="bday-day" aria-label="' + escH(t('settings.day')) + '">';
  for (var d = 1; d <= 31; d++) h += '<option value="' + d + '"' + (d === day ? ' selected' : '') + '>' + d + '</option>';
  h += '</select><select class="set-select" id="bday-month" aria-label="' + escH(t('settings.month')) + '">';
  for (var m = 1; m <= 12; m++) h += '<option value="' + m + '"' + (m === month ? ' selected' : '') + '>' + m + '</option>';
  return h + '</select>';
}

function settingsLook() {
  var active0 = activeThemeId();
  var scope = '<div class="segmented theme-scope">';
  [['all', 'settings.scopeAll'], ['here', 'settings.scopeHere']].forEach(function(o) {
    scope += '<button class="' + ((ui.themeScope || 'all') === o[0] ? 'active' : '') + '" onclick="ui.themeScope=\'' + o[0] + '\';showSettingsModal()">' + t(o[1]) + '</button>';
  });
  scope += '</div>';
  var note = G.bakeryTheme ? '<div class="theme-own-note"><span>' + t('settings.ownTheme') + '</span><button class="btn btn-small" onclick="clearBakeryTheme()">' + t('settings.ownThemeReset') + '</button></div>' : '';
  var cards = scope + note + '<div class="theme-cards">';
  THEME_LIST.forEach(function(thm) {
    var lock = themeLockReason(thm);
    var name = t(thm.langKey);
    var active = active0 === thm.id;
    var why = lock ? t(lock === 'level' ? 'settings.lockLevel' : lock === 'season' ? 'settings.lockSeason' : lock === 'birthday' ? 'settings.lockBirthday' : 'settings.lockNoBirthday', { v: thm.level }) : '';
    cards += '<button class="theme-card' + (active ? ' active' : '') + (lock ? ' locked' : '') + '"' + (lock ? ' disabled' : ' onclick="chooseTheme(\'' + thm.id + '\')"') + ' aria-pressed="' + active + '">';
    cards += '<span class="theme-prev tp-' + thm.id + '"><i></i><i></i><i></i>' + Decor.mark(thm.id) + '</span>';
    cards += '<span class="theme-name">' + (lock ? '\u{1F512} ' : '') + name + '</span>';
    if (lock) cards += '<small>' + why + '</small>';
    cards += '</button>';
  });
  cards += '</div>';
  var h = setCard(t('settings.theme'), '<p class="set-help">' + t('settings.themeHelp') + '</p>' + cards);
  h += setCard('', setRow(t('settings.particles'), t('settings.particlesHelp'), setSwitch(!G.settings.reducedParticles, 'toggleParticles();showSettingsModal()', t('settings.particles'))));
  return h;
}

function settingsAudio() {
  var track = '<select class="set-select" aria-label="' + escH(t('settings.musicTrack')) + '" onchange="setMusicTrack(this.value);showSettingsModal()">';
  MUSIC_TRACKS.forEach(function(mt) {
    if (trackAvailable(mt)) track += '<option value="' + mt.id + '"' + (G.settings.musicTrack === mt.id ? ' selected' : '') + '>' + t('mus.' + mt.id) + '</option>';
  });
  track += '</select>';
  var volume = '<div class="volume-row"><input type="range" min="0" max="100" value="' + G.settings.musicVolume + '" aria-label="' + escH(t('settings.musicVolume')) + '" oninput="setMusicVolume(this.value);document.getElementById(\'vol-val\').textContent=this.value+\' %\'"><span id="vol-val">' + G.settings.musicVolume + ' %</span></div>';
  var h = setCard(t('settings.music'),
    setRow(t('settings.music'), t('settings.musicHelp'), setSwitch(G.settings.music, 'toggleMusic();showSettingsModal()', t('settings.music'))) +
    setRow(t('settings.musicTrack'), '', track) +
    setRow(t('settings.musicVolume'), '', volume));
  h += setCard('', setRow(t('settings.sound'), t('settings.soundHelp'), setSwitch(G.settings.soundEnabled, 'G.settings.soundEnabled=!G.settings.soundEnabled;showSettingsModal()', t('settings.sound'))));
  return h;
}

function settingsSave() {
  var h = setCard('', setRow(t('settings.saveNowTitle'), t('settings.saveHelp'), '<button class="btn btn-small btn-primary" onclick="doManualSave()">' + t('settings.saveNow') + '</button>'));
  h += setCard(t('settings.export'), '<p class="set-help">' + t('settings.exportHelp') + '</p><textarea class="set-code" id="export-area" readonly onclick="this.select()">' + exportSave() + '</textarea><button class="btn btn-small" onclick="copyExport()">' + t('settings.exportBtn') + '</button>');
  h += setCard(t('settings.import'), '<p class="set-help">' + t('settings.importHelp') + '</p><textarea class="set-code" id="import-area" placeholder="' + escH(t('settings.importPlaceholder')) + '"></textarea><button class="btn btn-small btn-primary" onclick="doImportSave()">' + t('settings.importBtn') + '</button>');
  h += setCard('', setRow(t('settings.reset'), t('settings.resetHelp'), '<button class="btn btn-small btn-danger" onclick="confirmResetGame()">' + t('settings.resetBtn') + '</button>'), 'danger');
  return h;
}

function doManualSave() {
  save();
  toast(t('settings.saved'));
  playClickSound();
}

function setCurrency(id) {
  G.settings.currency = id;
  fullRender();
}

function confirmBirthday() {
  var day = parseInt(document.getElementById('bday-day').value, 10);
  var month = parseInt(document.getElementById('bday-month').value, 10);
  if (day && month) {
    setBirthday(day, month);
    save();
    toast(t('settings.birthdayDone'));
    showSettingsModal();
  }
}

function applyTheme() {
  var theme = activeThemeId();
  document.body.className = theme + (G.settings && G.settings.reducedParticles ? ' reduced-particles' : '') + (typeof introActive !== 'undefined' && introActive ? ' in-intro' : '');
  document.documentElement.dataset.theme = theme;
  Decor.apply(theme);
}

// Depuis les reglages : pour tout le jeu, ou seulement pour cette patisserie
function chooseTheme(theme) {
  if (ui.themeScope === 'here') {
    G.bakeryTheme = theme;
    applyTheme();
    fullRender();
  } else {
    G.bakeryTheme = null;
    setTheme(theme);
  }
  showSettingsModal();
}

function clearBakeryTheme() {
  G.bakeryTheme = null;
  applyTheme();
  fullRender();
  showSettingsModal();
}

function confirmBirthdayFix() {
  var day = parseInt(document.getElementById('bday-day').value, 10);
  var month = parseInt(document.getElementById('bday-month').value, 10);
  if (fixBirthday(day, month)) {
    save();
    toast(t('settings.birthdayFixed'));
    renderHeader();
    showSettingsModal();
  }
}

function setTheme(theme) {
  G.settings.theme = theme;
  applyTheme();
  fullRender();
}

function toggleParticles() {
  G.settings.reducedParticles = !G.settings.reducedParticles;
  applyTheme();
}

function copyExport() {
  var area = document.getElementById('export-area');
  if (area) {
    area.select();
    document.execCommand('copy');
    toast(t('settings.exported'));
  }
}

function doImportSave() {
  var area = document.getElementById('import-area');
  if (!area || !area.value.trim()) return;
  if (importSave(area.value.trim())) {
    toast(t('settings.imported'));
    hideModal();
    currentLang = G.settings.lang;
    applyTheme();
    fullRender();
  } else {
    toast(t('settings.importError'));
  }
}

function confirmResetGame() {
  var h = '<h2>⚠️ ' + t('settings.reset') + '</h2>';
  h += '<p class="warning">' + t('settings.resetConfirm') + '</p>';
  h += '<div class="modal-btns"><button class="btn btn-danger" onclick="resetGame()">' + t('settings.resetBtn') + '</button>';
  h += '<button class="btn" onclick="showSettingsModal()">' + t('common.cancel') + '</button></div>';
  showModal(h);
}

// ============ PAUSE ============
function togglePause() {
  G.paused = !G.paused;
  if (G.paused) {
    G.pausedAt = Date.now();
    ui.pauseTip = null;
    showPauseModal();
  } else {
    var pausedFor = Date.now() - (G.pausedAt || Date.now());
    shiftGameTimers(pausedFor);
    shiftAllBakeries(pausedFor);
    G.pausedAt = 0;
    hideModal();
  }
  renderHeader();
}

// Le temps passe en pause ne compte pas : tout est decale d'autant
function shiftGameTimers(ms) {
  G.crafting.forEach(function(c) { if (c.startTime !== null) c.startTime += ms; });
  if (G.activeEvent) G.eventEndTime += ms;
  G.lastEventTime += ms;
  G.applicants.forEach(function(a) { a.expiresAt += ms; });
  G.orders.forEach(function(o) { o.expiresAt += ms; });
  if (G.nextOrderAt) G.nextOrderAt += ms;
}

function showPauseModal() {
  // Un conseil de Bob par pause. Aigri, il n'en donne plus.
  if (!ui.pauseTip) ui.pauseTip = pickLine(bobAnger() === 5 ? 'bob.sour' : 'pause.tips');
  var unlocked = 0;
  for (var k in G.achievements) { if (G.achievements[k]) unlocked++; }
  var tiles = [
    [t('pause.money'), fmtMoney(G.money)],
    [t('pause.level'), G.level],
    [t('pause.baking'), G.crafting.length],
    [t('pause.achievements'), unlocked + ' / ' + ACHIEVEMENTS.length],
  ];
  var h = '<div class="pause-top">' + bobFigure();
  h += '<div class="pause-title"><span class="pause-kicker">' + uiIcon('pause') + t('pause.kicker') + '</span>';
  h += '<h2>' + t('pause.title') + '</h2>';
  h += '<p>' + t('pause.sub', { n: escH(G.bakeryName), t: fmtPlay(G.playTimeMs) }) + '</p></div></div>';
  h += '<div class="pause-tiles">';
  tiles.forEach(function(x) { h += '<div class="pause-tile"><span>' + x[0] + '</span><b>' + x[1] + '</b></div>'; });
  h += '</div>';
  h += '<p class="pause-tip"><b>Bob :</b> ' + ui.pauseTip + '</p>';
  h += '<button class="btn btn-primary pause-resume" onclick="togglePause()">' + uiIcon('play') + t('pause.resume') + '<kbd>' + t('pause.key') + '</kbd></button>';
  h += '<div class="pause-actions">';
  h += '<button class="btn" onclick="ui.settingsTab=\'general\';showSettingsModal()">' + uiIcon('settings') + t('settings.title') + '</button>';
  h += '<button class="btn" onclick="doManualSave()">' + uiIcon('save') + t('settings.saveNow') + '</button>';
  h += '<button class="btn" onclick="toggleMusic();showPauseModal()" aria-pressed="' + !!G.settings.music + '">' + uiIcon(G.settings.music ? 'music' : 'musicOff') + t(G.settings.music ? 'pause.musicOn' : 'pause.musicOff') + '</button>';
  h += '<button class="btn" onclick="G.settings.soundEnabled=!G.settings.soundEnabled;showPauseModal()" aria-pressed="' + !!G.settings.soundEnabled + '">' + uiIcon(G.settings.soundEnabled ? 'soundOn' : 'soundOff') + t(G.settings.soundEnabled ? 'pause.soundOn' : 'pause.soundOff') + '</button>';
  h += '</div>';
  showModal(h, 'modal-pause');
}
