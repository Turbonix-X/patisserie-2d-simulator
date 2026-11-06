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
function showSettingsModal() {
  var tabs = [['general', 'settings.tabGeneral', 'globe'], ['look', 'settings.tabLook', 'palette'], ['audio', 'settings.tabAudio', 'music'], ['save', 'settings.tabSave', 'save']];
  var h = '<div class="set-head"><h2>' + uiIcon('settings') + t('settings.title') + '</h2>';
  h += '<button class="icon-btn" onclick="closeMenu()" aria-label="' + escH(t('common.close')) + '" title="' + escH(t('common.close')) + '">' + uiIcon('close') + '</button></div>';
  h += '<div class="set-body"><nav class="set-nav">';
  tabs.forEach(function(tb) {
    var active = ui.settingsTab === tb[0];
    h += '<button class="set-tab' + (active ? ' active' : '') + '"' + (active ? ' aria-current="page"' : '') + ' onclick="ui.settingsTab=\'' + tb[0] + '\';showSettingsModal()">' + uiIcon(tb[2]) + '<span>' + t(tb[1]) + '</span></button>';
  });
  h += '</nav><div class="set-pane">';
  if (ui.settingsTab === 'general') h += settingsGeneral();
  else if (ui.settingsTab === 'look') h += settingsLook();
  else if (ui.settingsTab === 'audio') h += settingsAudio();
  else h += settingsSave();
  h += '<p class="set-version">P2DS ' + GAME_VERSION + ' · Turbonix Entertainment</p>';
  h += '</div></div>';
  showModal(h, 'modal-settings');
}

function settingsGeneral() {
  var lang = '<div class="segmented">';
  LANG_LIST.forEach(function(l) {
    lang += '<button class="' + (currentLang === l.code ? 'active' : '') + '" onclick="setLanguage(\'' + l.code + '\');showSettingsModal()">' + l.flag + ' ' + l.name + '</button>';
  });
  lang += '</div>';
  var curr = '<select class="set-select" aria-label="' + escH(t('settings.currency')) + '" onchange="setCurrency(this.value);showSettingsModal()">';
  CURRENCIES.forEach(function(c) {
    curr += '<option value="' + c.id + '"' + (G.settings.currency === c.id ? ' selected' : '') + '>' + c.symbol + ' · ' + c.fullName + '</option>';
  });
  curr += '</select>';
  var h = setCard('', setRow(t('settings.lang'), t('settings.langHelp'), lang) + setRow(t('settings.currency'), t('settings.currencyHelp'), curr));
  var bday;
  if (G.birthday) {
    bday = setRow(t('settings.birthday'), t('settings.birthdayHelpSet'), '<span class="set-value">' + t('settings.birthdaySet', { d: G.birthday.day, m: G.birthday.month }) + '</span>');
  } else {
    var ctl = '<div class="birthday-pick"><select class="set-select" id="bday-day" aria-label="' + escH(t('settings.day')) + '">';
    for (var d = 1; d <= 31; d++) ctl += '<option value="' + d + '">' + d + '</option>';
    ctl += '</select><select class="set-select" id="bday-month" aria-label="' + escH(t('settings.month')) + '">';
    for (var m = 1; m <= 12; m++) ctl += '<option value="' + m + '">' + m + '</option>';
    ctl += '</select><button class="btn btn-small btn-primary" onclick="confirmBirthday()">' + t('settings.birthdayBtn') + '</button></div>';
    bday = setRow(t('settings.birthday'), t('settings.birthdayHelp'), ctl);
  }
  return h + setCard('', bday);
}

function settingsLook() {
  var cards = '<div class="theme-cards">';
  THEME_LIST.forEach(function(thm) {
    var lock = themeLockReason(thm);
    var name = t(thm.langKey);
    var active = G.settings.theme === thm.id;
    var why = lock ? t(lock === 'season' ? 'settings.lockSeason' : lock === 'birthday' ? 'settings.lockBirthday' : 'settings.lockNoBirthday') : '';
    cards += '<button class="theme-card' + (active ? ' active' : '') + (lock ? ' locked' : '') + '"' + (lock ? ' disabled' : ' onclick="setTheme(\'' + thm.id + '\');showSettingsModal()"') + ' aria-pressed="' + active + '">';
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
    if (trackAvailable(mt)) track += '<option value="' + mt.id + '"' + (G.settings.musicTrack === mt.id ? ' selected' : '') + '>' + mt.name + '</option>';
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
  var theme = (G.settings && G.settings.theme) || 'light';
  document.body.className = theme + (G.settings && G.settings.reducedParticles ? ' reduced-particles' : '') + (typeof introActive !== 'undefined' && introActive ? ' in-intro' : '');
  document.documentElement.dataset.theme = theme;
  Decor.apply(theme);
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
    shiftGameTimers(Date.now() - (G.pausedAt || Date.now()));
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
