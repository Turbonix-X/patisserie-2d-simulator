/* ============================================
   PATISSERIE 2D SIMULATOR - PLAYER DATA
   Etat de la partie, sauvegarde, import/export
   ============================================ */

function createFreshState() {
  var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
  var names = BAKERY_NAMES_LANG[lang] || BAKERY_NAMES_LANG.fr;
  var state = {
    money: 50,
    totalEarned: 0,
    level: 1,
    xp: 0,
    rebirth: 0,
    maxSpace: 5,
    spaceBought: 0,
    ovens: OVEN_CONFIG.start,
    bakeryName: names[Math.floor(Math.random() * names.length)],
    ing: {},
    cakes: {},
    achievements: {},
    buildings: {},
    employees: [],
    nextEmployeeId: 1,
    applicants: [],
    rentDebt: 0,
    playTimeMs: 0,
    lastTick: Date.now(),
    soldCount: {},
    totalAllSold: 0,
    crafting: [],
    paused: false,
    pausedAt: 0,
    activeEvent: null,
    eventEndTime: 0,
    lastEventTime: 0,
    eventPriceBonus: 0,
    eventIngBonus: 0,
    eventRentBonus: 0,
    eventXpBonus: 0,
    eventSellerBonus: 0,
    eventAutoBonus: 0,
    eventClickBonus: 0,
    eventEmpBonus: 0,
    birthday: null,
    birthdaySetOn: null,
    birthdayBoostYear: null,
    birthdayBoostUntil: 0,
    unlockedThemes: {},
    cheatUnlocked: false,
    bobClicks: 0,
    logoClicks: 0,
    introDone: false,
    tutorialStep: 0,
    tutorialDone: false,
    gameOver: false,
    wentBankrupt: false,
    lvl1000Shown: false,
    favRecipes: {},
    bakeries: [],
    currentBakeryIndex: 0,
    secondBakery: false,
    achHere: 0,
    bankUnlocked: false,
    loans: [],
    nextLoanId: 1,
    history: { t: [], money: [], earned: [], spent: [], level: [], sold: [], step: 30000, next: 0 },
    settings: {
      lang: 'fr',
      theme: 'light',
      currency: 'eur',
      music: true,
      musicTrack: 'default',
      musicVolume: 30,
      reducedParticles: false,
      soundEnabled: true,
      bulk: '1',
    },
    timeSpeed: 1,
    stats: {
      totalClicks: 0,
      totalCakesMade: 0,
      totalSold: 0,
      cakesMadeById: {},
      totalBuildingsBought: 0,
      totalEmployeesHired: 0,
      totalRentPaid: 0,
      totalSalaryPaid: 0,
      totalIngredientCost: 0,
      eventsSeen: 0,
      totalInvested: 0,
      totalInterestPaid: 0,
      loansTaken: 0,
      loansRepaid: 0,
    },
    saveVersion: 9,
  };
  ING.forEach(function(i) { state.ing[i.id] = 0; });
  REC.forEach(function(r) { state.cakes[r.id] = 0; state.soldCount[r.id] = 0; });
  BUILDINGS.forEach(function(b) { state.buildings[b.id] = { qty: 0 }; });
  return state;
}

var G = createFreshState();

// Remet une sauvegarde de n'importe quelle version au format actuel
function migrateSave(data) {
  var fresh = createFreshState();
  var version = data.saveVersion || 0;
  // Tout champ absent reprend sa valeur de depart
  for (var k in fresh) {
    if (data[k] === undefined || data[k] === null) {
      if (k !== 'birthday' && k !== 'activeEvent' && k !== 'birthdaySetOn' && k !== 'birthdayBoostYear') data[k] = fresh[k];
    }
  }
  ['settings', 'stats'].forEach(function(section) {
    for (var s in fresh[section]) {
      if (data[section][s] === undefined) data[section][s] = fresh[section][s];
    }
  });
  ING.forEach(function(i) { if (data.ing[i.id] === undefined) data.ing[i.id] = 0; });
  REC.forEach(function(r) {
    if (data.cakes[r.id] === undefined) data.cakes[r.id] = 0;
    if (data.soldCount[r.id] === undefined) data.soldCount[r.id] = 0;
  });
  BUILDINGS.forEach(function(b) { if (!data.buildings[b.id]) data.buildings[b.id] = { qty: 0 }; });

  // Avant la Beta 1.0
  if (version < 8) {
    if (data.prestige && !data.rebirth) data.rebirth = data.prestige;
    // Le volume etait mal range (0.3 au lieu de 30)
    if (data.settings.musicVolume <= 1) data.settings.musicVolume = 30;
    // Les anciens interets etaient 10 fois trop forts : ces dettes sont effacees
    data.rentDebt = 0;
    data.gameOver = false;
    // Les joueurs existants n'ont pas besoin de l'intro
    data.introDone = !!(data.stats.totalClicks > 0 || data.level > 1 || data.tutorialDone);
    if (data.introDone && !data.tutorialDone && data.level > 1) { data.tutorialDone = true; data.tutorialStep = 5; }
    // Les anciens morceaux et les anciens themes ont ete remplaces
    data.settings.musicTrack = 'default';
    data.settings.theme = data.settings.theme === 'dark' ? 'dark' : 'light';
    data.unlockedThemes = {};
    // Employes : le moral et la competence comptent maintenant vraiment
    data.employees.forEach(function(e) {
      if (e.skill === undefined) e.skill = 40;
      if (e.level === undefined) e.level = 1;
      if (e.unpaidTime === undefined) e.unpaidTime = 0;
    });
    // Les preparations en cours gardent leur heure de depart
    data.crafting.forEach(function(c) { if (c.startTime === undefined) c.startTime = null; });
    // Anciens champs
    ['upgrades','crypto','cryptoPrices','cryptoHistory','prestige','lastRentPayTime'].forEach(function(old) { delete data[old]; });
    data.saveVersion = 8;
  }
  // Avant la Beta 1.1
  if (data.saveVersion < 9) {
    // La banque existe maintenant : une faillite en cours peut encore s'arranger
    if (data.gameOver && data.rentDebt > 0) data.gameOver = false;
    if (data.bakeries.length >= 2) data.secondBakery = true;
    data.saveVersion = 9;
  }
  // Les autres patisseries sont sauvegardees a l'interieur de celle-ci
  data.bakeries.forEach(function(b) { if (b.state) b.state = migrateSave(b.state); });
  if (!LANGS[data.settings.lang]) data.settings.lang = 'fr';
  if (data.settings.bulk === undefined) data.settings.bulk = '1';
  return data;
}

// ============ SAUVEGARDE ============
var saveWarningShown = false;

function save() {
  G.lastTick = Date.now();
  try {
    var json = JSON.stringify(G);
    // On garde la sauvegarde precedente en secours
    var previous = localStorage.getItem('p2ds_save');
    if (previous) localStorage.setItem('p2ds_save_backup', previous);
    localStorage.setItem('p2ds_save', json);
    saveWarningShown = false;
  } catch (e) {
    if (!saveWarningShown && typeof toast === 'function') toast(t('settings.saveFull'));
    saveWarningShown = true;
  }
  syncToDesktop();
}

// Message a afficher au joueur apres le chargement ('saveError', 'saveLost' ou null)
var loadNotice = null;

function load() {
  var raw = null;
  try { raw = localStorage.getItem('p2ds_save'); } catch (e) { return; }
  if (!raw) return;
  try {
    Object.assign(G, migrateSave(JSON.parse(raw)));
    return;
  } catch (e) {
    // Sauvegarde abimee : on ne l'ecrase pas, on la met de cote
    try { localStorage.setItem('p2ds_save_corrupt', raw); } catch (e2) { /* stockage plein */ }
  }
  try {
    var backup = localStorage.getItem('p2ds_save_backup');
    if (backup) {
      Object.assign(G, migrateSave(JSON.parse(backup)));
      loadNotice = 'saveError';
      return;
    }
  } catch (e3) { /* la copie est abimee aussi */ }
  loadNotice = 'saveLost';
}

// ============ APPLI DE BUREAU (port 8742) ============
// Seulement si le jeu tourne depuis l'appli : un site en ligne ne doit jamais
// aller fouiller sur l'ordinateur du joueur.
var _desktopAvailable = false;

function desktopSyncAllowed() {
  return location.protocol === 'file:' || location.port === '8742' || /[?&]desktop=1/.test(location.search);
}

function checkDesktopSync() {
  if (!desktopSyncAllowed()) return;
  fetch('http://localhost:8742/ping', { mode: 'cors' })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data && data.app === 'P2DS') {
        _desktopAvailable = true;
        loadFromDesktop();
      }
    })
    .catch(function() { _desktopAvailable = false; });
}

function loadFromDesktop() {
  fetch('http://localhost:8742/save', { mode: 'cors' })
    .then(function(r) { if (r.ok) return r.json(); throw new Error('no save'); })
    .then(function(data) {
      if (data && data.lastTickTicks) {
        // Les sauvegardes de l'appli comptent le temps en ticks C#
        var desktopTime = data.lastTickTicks / 10000 - 62135596800000;
        if (desktopTime > (G.lastTick || 0)) {
          Object.assign(G, migrateSave(data));
          if (typeof fullRender === 'function') fullRender();
        }
      }
    })
    .catch(function() {});
}

function syncToDesktop() {
  if (!_desktopAvailable) return;
  fetch('http://localhost:8742/save', {
    method: 'POST', mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(G)
  }).catch(function() {});
}

// ============ TOUT EFFACER ============
function resetGame() {
  localStorage.removeItem('p2ds_save');
  localStorage.removeItem('p2ds_save_backup');
  localStorage.removeItem('p2ds_save_corrupt');
  skipSaveOnUnload = true;
  location.reload();
}

var skipSaveOnUnload = false;

// ============ IMPORT / EXPORT ============
function exportSave() {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(G))));
  } catch (e) { return ''; }
}

function importSave(code) {
  try {
    var data = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
    if (!data || typeof data !== 'object' || typeof data.money !== 'number') return false;
    Object.assign(G, migrateSave(data));
    save();
    return true;
  } catch (e) { return false; }
}

// ============ ANNULER (console) ============
var undoState = null;
var lastSaveBeforeMax = null;

function saveUndoState() { undoState = JSON.parse(JSON.stringify(G)); }

function restoreUndoState() {
  if (!undoState) return false;
  Object.assign(G, undoState);
  undoState = null;
  return true;
}

function saveBeforeMax() { lastSaveBeforeMax = JSON.parse(JSON.stringify(G)); }

function restoreBeforeMax() {
  if (!lastSaveBeforeMax) return false;
  Object.assign(G, lastSaveBeforeMax);
  lastSaveBeforeMax = null;
  return true;
}
