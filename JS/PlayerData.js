/* ============================================
   PATISSERIE 2D SIMULATOR - PLAYER DATA
   State management, save/load, accounts
   ============================================ */

function createFreshState() {
  var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
  var names = BAKERY_NAMES_LANG[lang] || BAKERY_NAMES_LANG.fr;
  var randomName = names[Math.floor(Math.random() * names.length)];

  var state = {
    money: 50,
    totalEarned: 0,
    level: 1,
    xp: 0,
    rebirth: 0,
    maxSpace: 5,
    spaceBought: 0,
    bakeryName: randomName,
    ing: {},
    cakes: {},
    achievements: {},
    buildings: {},
    employees: [],
    nextEmployeeId: 1,
    applicants: [],
    rentDebt: 0,
    playTimeMs: 0,
    lastRentPayTime: 0,
    lastTick: Date.now(),
    soldCount: {},
    totalAllSold: 0,
    crafting: [],
    paused: false,
    // Events
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
    // Birthday system
    birthday: null,
    unlockedThemes: {},
    birthdayBoostUntil: 0,
    // Cheat console
    cheatUnlocked: false,
    // Tutorial
    tutorialStep: 0,
    tutorialDone: false,
    // Game over
    gameOver: false,
    // Multiple bakeries
    bakeries: [],
    currentBakeryIndex: 0,
    // Settings
    settings: {
      lang: 'fr',
      theme: 'light',
      currency: 'eur',
      music: true,
      musicTrack: 'default',
      musicVolume: 0.3,
      reducedParticles: false,
      soundEnabled: true,
    },
    // Time speed
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
    },
    saveVersion: 7,
  };
  ING.forEach(function(i) { state.ing[i.id] = 0; });
  REC.forEach(function(r) { state.cakes[r.id] = 0; state.soldCount[r.id] = 0; });
  BUILDINGS.forEach(function(b) { state.buildings[b.id] = { qty: 0 }; });
  return state;
}

var G = createFreshState();
var ACCOUNT = { loggedIn: false, username: '' };

function getAccounts() {
  try { return JSON.parse(localStorage.getItem('p2ds_accounts') || '{}'); } catch(e) { return {}; }
}
function saveAccounts(acc) {
  localStorage.setItem('p2ds_accounts', JSON.stringify(acc));
}
function simpleHash(str) {
  var h = 0;
  for (var i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return 'h_' + Math.abs(h).toString(36);
}

function migrateSave(data) {
  if (!data.saveVersion || data.saveVersion < 3) {
    data.buildings = data.buildings || {};
    data.employees = data.employees || [];
    data.nextEmployeeId = data.nextEmployeeId || 1;
    data.rentDebt = data.rentDebt || 0;
    data.playTimeMs = data.playTimeMs || 0;
    data.lastRentPayTime = data.lastRentPayTime || 0;
    data.soldCount = data.soldCount || {};
    data.totalAllSold = data.totalAllSold || 0;
    data.crafting = data.crafting || [];
    data.bakeryName = data.bakeryName || 'Ma Patisserie';
    data.rebirth = data.rebirth || data.prestige || 0;
    data.settings = data.settings || { lang: 'fr', theme: 'light', currency: 'eur' };
    if (!data.stats) data.stats = {};
    data.stats.totalBuildingsBought = data.stats.totalBuildingsBought || 0;
    data.stats.totalEmployeesHired = data.stats.totalEmployeesHired || 0;
    data.stats.totalRentPaid = data.stats.totalRentPaid || 0;
    data.stats.totalSalaryPaid = data.stats.totalSalaryPaid || 0;
    data.stats.totalIngredientCost = data.stats.totalIngredientCost || 0;
    data.stats.totalClicks = data.stats.totalClicks || 0;
    data.stats.totalCakesMade = data.stats.totalCakesMade || 0;
    data.stats.totalSold = data.stats.totalSold || 0;
    data.stats.cakesMadeById = data.stats.cakesMadeById || {};
    data.saveVersion = 3;
  }
  // Migrate to v4
  if (data.saveVersion < 4) {
    data.crypto = data.crypto || {};
    data.cryptoPrices = data.cryptoPrices || {};
    data.applicants = data.applicants || [];
    data.activeEvent = data.activeEvent || null;
    data.eventEndTime = data.eventEndTime || 0;
    data.lastEventTime = data.lastEventTime || 0;
    data.eventPriceBonus = data.eventPriceBonus || 0;
    data.eventIngBonus = data.eventIngBonus || 0;
    data.eventRentBonus = data.eventRentBonus || 0;
    data.eventXpBonus = data.eventXpBonus || 0;
    data.eventSellerBonus = data.eventSellerBonus || 0;
    data.tutorialStep = data.tutorialStep || 0;
    data.tutorialDone = (data.tutorialDone !== undefined) ? data.tutorialDone : (data.stats.totalClicks > 0);
    data.gameOver = data.gameOver || false;
    data.paused = data.paused || false;
    data.bakeries = data.bakeries || [];
    data.currentBakeryIndex = data.currentBakeryIndex || 0;
    data.lastTick = data.lastTick || Date.now();
    data.settings.currency = data.settings.currency || 'eur';
    // Remove old bulkAmount from settings
    // Add skill to existing employees
    for (var e = 0; e < (data.employees || []).length; e++) {
      if (data.employees[e].skill === undefined) {
        data.employees[e].skill = 30 + Math.floor(Math.random() * 30);
      }
    }
    data.saveVersion = 4;
  }
  // Migrate to v5 (Beta 1.2)
  if (data.saveVersion < 5) {
    data.eventAutoBonus = data.eventAutoBonus || 0;
    data.eventClickBonus = data.eventClickBonus || 0;
    data.eventEmpBonus = data.eventEmpBonus || 0;
    data.cheatUnlocked = data.cheatUnlocked || false;
    data.saveVersion = 5;
  }
  // Migrate to v6 (v1.3)
  if (data.saveVersion < 6) {
    data.settings.music = (data.settings.music !== undefined) ? data.settings.music : true;
    data.settings.musicTrack = data.settings.musicTrack || 'default';
    data.settings.musicVolume = (data.settings.musicVolume !== undefined) ? data.settings.musicVolume : 0.3;
    data.timeSpeed = data.timeSpeed || 1;
    data.cryptoHistory = data.cryptoHistory || {};
    // Fix theme names from old to new
    if (data.settings.theme === 'multicolor' || data.settings.theme === 'multiblack') {
      // keep as is, these are valid
    }
    data.saveVersion = 6;
  }
  // Migrate to v7 (v1.4 - remove upgrades/crypto, add birthday/themes)
  if (data.saveVersion < 7) {
    // Remove deprecated systems
    delete data.upgrades;
    delete data.crypto;
    delete data.cryptoPrices;
    delete data.cryptoHistory;
    // Add new fields
    data.birthday = data.birthday || null;
    data.unlockedThemes = data.unlockedThemes || {};
    data.birthdayBoostUntil = data.birthdayBoostUntil || 0;
    if (!data.settings) data.settings = {};
    data.settings.reducedParticles = data.settings.reducedParticles || false;
    data.settings.soundEnabled = (data.settings.soundEnabled !== undefined) ? data.settings.soundEnabled : true;
    // Reset deleted themes to light
    var validThemes = ['light','dark','nature_fleur','nature_automne','nature_neige','plage','espace','anniversaire'];
    if (data.settings.theme && validThemes.indexOf(data.settings.theme) === -1) {
      data.settings.theme = 'light';
    }
    data.saveVersion = 7;
  }
  ING.forEach(function(i) { if (data.ing[i.id] === undefined) data.ing[i.id] = 0; });
  REC.forEach(function(r) {
    if (data.cakes[r.id] === undefined) data.cakes[r.id] = 0;
    if (!data.soldCount) data.soldCount = {};
    if (data.soldCount[r.id] === undefined) data.soldCount[r.id] = 0;
  });
  BUILDINGS.forEach(function(b) { if (!data.buildings[b.id]) data.buildings[b.id] = { qty: 0 }; });
  if (!data.achievements) data.achievements = {};
  if (data.rebirth === undefined) data.rebirth = 0;
  if (data.maxSpace === undefined) data.maxSpace = 5;
  if (data.spaceBought === undefined) data.spaceBought = 0;
  if (data.level === undefined) data.level = 1;
  if (data.xp === undefined) data.xp = 0;
  if (data.money === undefined) data.money = 50;
  if (!data.birthday) data.birthday = null;
  if (!data.unlockedThemes) data.unlockedThemes = {};
  return data;
}

function save() {
  G.lastTick = Date.now();
  try { localStorage.setItem('p2ds_save', JSON.stringify(G)); } catch(e) {}
  if (ACCOUNT.loggedIn) saveToAccount();
  // Sync with desktop app if running
  syncToDesktop();
}
function load() {
  try {
    var raw = localStorage.getItem('p2ds_save');
    if (!raw) return;
    var data = JSON.parse(raw);
    data = migrateSave(data);
    Object.assign(G, data);
  } catch(e) {}
}

// ============ DESKTOP SYNC (port 8742) ============
var _desktopAvailable = false;
var _desktopChecked = false;

function checkDesktopSync() {
  if (_desktopChecked) return;
  _desktopChecked = true;
  fetch('http://localhost:8742/ping', { mode: 'cors' })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data && data.app === 'P2DS') {
        _desktopAvailable = true;
        // Try to load desktop save if newer
        loadFromDesktop();
      }
    })
    .catch(function() { _desktopAvailable = false; });
}

function loadFromDesktop() {
  if (!_desktopAvailable) return;
  fetch('http://localhost:8742/save', { mode: 'cors' })
    .then(function(r) { if (r.ok) return r.json(); throw new Error('no save'); })
    .then(function(data) {
      if (data && data.lastTickTicks) {
        // Desktop save uses C# ticks; convert to ms
        var desktopTime = data.lastTickTicks / 10000 - 62135596800000;
        if (desktopTime > (G.lastTick || 0)) {
          // Desktop save is newer — apply it
          var mapped = mapDesktopSave(data);
          if (mapped) {
            mapped = migrateSave(mapped);
            Object.assign(G, mapped);
          }
        }
      }
    })
    .catch(function() {});
}

function mapDesktopSave(d) {
  // Map C# camelCase properties to JS state
  try {
    return {
      money: d.money || 0, totalEarned: d.totalEarned || 0,
      level: d.level || 1, xp: d.xp || 0, rebirth: d.rebirth || 0,
      maxSpace: d.maxSpace || 5, spaceBought: d.spaceBought || 0,
      bakeryName: d.bakeryName || 'Ma Patisserie',
      ing: d.ing || {}, cakes: d.cakes || {},
      achievements: d.achievements || {},
      buildings: d.buildings || {}, employees: d.employees || [],
      nextEmployeeId: d.nextEmployeeId || 1,
      applicants: d.applicants || [], rentDebt: d.rentDebt || 0,
      playTimeMs: d.playTimeMs || 0, lastTick: Date.now(),
      soldCount: d.soldCount || {}, totalAllSold: d.totalAllSold || 0,
      crafting: d.crafting || [], paused: false,
      activeEvent: null, eventEndTime: 0,
      cheatUnlocked: d.cheatUnlocked || false,
      tutorialStep: d.tutorialStep || 0,
      tutorialDone: d.tutorialDone || false,
      gameOver: d.gameOver || false,
      bakeries: d.bakeries || [], currentBakeryIndex: 0,
      settings: {
        lang: d.lang || 'fr', theme: d.theme || 'light',
        currency: d.currencyCode || 'eur',
        music: true, musicTrack: d.musicTrack || 'default',
        musicVolume: d.musicVolume || 0.3,
      },
      birthday: d.birthday || null,
      unlockedThemes: d.unlockedThemes || {},
      birthdayBoostUntil: d.birthdayBoostUntil || 0,
      timeSpeed: d.timeSpeed || 1,
      stats: d.stats || {},
      saveVersion: 7
    };
  } catch(e) { return null; }
}

function syncToDesktop() {
  if (!_desktopAvailable) return;
  try {
    fetch('http://localhost:8742/save', {
      method: 'POST', mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(G)
    }).catch(function() {});
  } catch(e) {}
}
function saveToAccount() {
  if (!ACCOUNT.loggedIn) return;
  var accounts = getAccounts();
  var key = ACCOUNT.username.toLowerCase();
  if (accounts[key]) {
    accounts[key].saveData = JSON.parse(JSON.stringify(G));
    saveAccounts(accounts);
  }
}
function registerAccount(user, pass) {
  if (!user || user.length < 2) return { ok: false, msg: 'acc.errShort' };
  if (!pass || pass.length < 3) return { ok: false, msg: 'acc.errPassShort' };
  var accounts = getAccounts();
  if (accounts[user.toLowerCase()]) return { ok: false, msg: 'acc.errTaken' };
  accounts[user.toLowerCase()] = {
    password: simpleHash(pass),
    displayName: user,
    saveData: JSON.parse(JSON.stringify(G)),
  };
  saveAccounts(accounts);
  ACCOUNT.loggedIn = true;
  ACCOUNT.username = user;
  return { ok: true, msg: 'acc.created' };
}
function loginAccount(user, pass) {
  if (!user || !pass) return { ok: false, msg: 'acc.errFill' };
  var accounts = getAccounts();
  var acc = accounts[user.toLowerCase()];
  if (!acc) return { ok: false, msg: 'acc.errNotFound' };
  if (acc.password !== simpleHash(pass)) return { ok: false, msg: 'acc.errPass' };
  if (acc.saveData) {
    var data = migrateSave(acc.saveData);
    Object.assign(G, data);
  }
  ACCOUNT.loggedIn = true;
  ACCOUNT.username = acc.displayName || user;
  return { ok: true, msg: 'acc.welcomeBack' };
}
function logoutAccount() {
  saveToAccount();
  ACCOUNT.loggedIn = false;
  ACCOUNT.username = '';
}

// ============ RESET GAME (FULL WIPE) ============
function resetGame() {
  var keepBirthday = G.birthday;
  localStorage.removeItem('p2ds_save');
  localStorage.removeItem('p2ds_accounts');
  var fresh = createFreshState();
  for (var k in fresh) {
    if (fresh.hasOwnProperty(k)) G[k] = fresh[k];
  }
  G.birthday = keepBirthday;
  ACCOUNT.loggedIn = false;
  ACCOUNT.username = '';
  if (typeof applyTheme === 'function') applyTheme();
  currentLang = 'fr';
  save();
}

// ============ IMPORT / EXPORT ============
function exportSave() {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(G))));
  } catch(e) { return ''; }
}

function importSave(code) {
  try {
    var json = decodeURIComponent(escape(atob(code.trim())));
    var data = JSON.parse(json);
    data = migrateSave(data);
    Object.assign(G, data);
    save();
    return true;
  } catch(e) { return false; }
}

// ============ UNDO / UNMAX ============
var undoState = null;
var lastSaveBeforeMax = null;

function saveUndoState() {
  undoState = JSON.parse(JSON.stringify(G));
}

function restoreUndoState() {
  if (!undoState) return false;
  Object.assign(G, undoState);
  undoState = null;
  return true;
}

function saveBeforeMax() {
  lastSaveBeforeMax = JSON.parse(JSON.stringify(G));
}

function restoreBeforeMax() {
  if (!lastSaveBeforeMax) return false;
  Object.assign(G, lastSaveBeforeMax);
  lastSaveBeforeMax = null;
  return true;
}

// ============ BAKERY VALUE ============
function getBakeryValue() {
  var val = 0;
  val += G.totalEarned * 0.1;
  val += G.level * 100;
  var bldCount = 0;
  BUILDINGS.forEach(function(b) { bldCount += (G.buildings[b.id] || {qty:0}).qty; });
  val += bldCount * 500;
  val += G.employees.length * 300;
  return Math.floor(val);
}
