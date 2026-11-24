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
    companyName: '',
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
    madeCount: {},     // fournees recentes par recette
    lastMadeAt: {},    // quand chaque recette a ete preparee pour la derniere fois
    broken: {},        // machines et batiments en panne
    bobGoldClicks: 0,
    bobGold: 0,        // l'or alimentaire le rend dore
    bobChoke: 0,       // le wasabi le fait tousser
    notifAsked: false, // Bob a deja propose les notifications
    bobPokes: 0,       // clics sur Bob tant que la console n'est pas la
    focusEvent: null,  // evenement sur un seul ingredient ou une seule recette
    lastFocusAt: 0,
    incoming: [],      // ce que les transporteurs apportent ici
    empOrder: null,    // l'ordre des metiers dans l'onglet Employes
    totalAllSold: 0,
    crafting: [],
    paused: false,
    pausedAt: 0,
    activeEvent: null,
    choiceEvent: null,
    insurance: null,
    insExplained: false,
    lastChoiceAt: 0,
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
    bobSad: 0,
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
    machines: {},
    unlocks: { done: {}, pending: {} },
    sales: [],
    searches: [],
    deliveries: [],
    bldTimers: {},
    sellerSold: {},
    explained: {},
    creative: false,
    infiniteMoney: false, // /money infinite
    infiniteIng: {},      // /farine infinite, etc.
    orders: [],
    nextOrderId: 1,
    nextOrderAt: 0,
    orderDemand: 1,
    lastActive: 0,     // la derniere fois que le joueur a touche au jeu
    closedAt: 0,       // sortie volontaire vers le menu : la partie est fermee et ne continue pas
    bakeryTheme: null,
    rentLate: 0,
    cmdUsage: {},
    challenge: null,
    nextChallengeAt: 0,
    sugarFed: 0,
    history: { t: [], money: [], earned: [], spent: [], level: [], sold: [], step: 30000, next: 0 },
    settings: {
      lang: lang,
      theme: 'light',
      currency: 'eur',
      music: true,
      musicTrack: 'default',
      musicVolume: 30,
      reducedParticles: false,
      soundEnabled: true,
      bulk: '1',
      autoPause: 0,
      changelogMax: false,
      hdrZoom: 100,
      hdrOrder: [],
      hdrMenu: [],
    },
    timeSpeed: 1,
    stats: {
      totalClicks: 0,
      totalCakesMade: 0,
      totalSold: 0,
      cakesMadeById: {},
      ingMadeById: {},
      ingGotById: {},
      totalIngGot: 0,
      totalIngMade: 0,
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
      ordersDone: 0,
      earnedById: {},
    },
    saveVersion: 12,
  };
  ING.forEach(function(i) { state.ing[i.id] = 0; });
  REC.forEach(function(r) { state.cakes[r.id] = 0; state.soldCount[r.id] = 0; });
  BUILDINGS.forEach(function(b) { state.buildings[b.id] = { qty: 0 }; });
  return state;
}

var G = createFreshState();

// Remet une sauvegarde de n'importe quelle version au format actuel
// Ce qu'un touche-a-tout a coute : le prix paye s'il est connu, sinon le prix d'un candidat de son niveau, de sa competence et de ses metiers
function versatileRefund(e) {
  if (typeof e.paid === 'number' && isFinite(e.paid) && e.paid > 0) return e.paid;
  var lvl = Math.max(1, Math.min(EMP_GOLD_LVL, e.level || 1)), skill = Math.max(1, Math.min(100, e.skill || 40));
  var jobsLvl = (e.jobs || []).reduce(function(a, j) { return a + (j.level || 1); }, 0);
  return Math.floor(OLD_VERSATILE_HIRE_COST * (0.5 + skill * 0.01) * Math.pow(4, lvl - 1) * (1 + jobsLvl * 0.3));
}
// Ce qu'un intendant a coute : le prix paye s'il est connu, sinon le prix d'un candidat de son niveau et de sa competence
function buyerRefund(e) {
  if (typeof e.paid === 'number' && isFinite(e.paid) && e.paid > 0) return e.paid;
  var lvl = Math.max(1, Math.min(EMP_GOLD_LVL, e.level || 1)), skill = Math.max(1, Math.min(100, e.skill || 40));
  return Math.floor(OLD_BUYER_HIRE_COST * (0.5 + skill * 0.01) * Math.pow(4, lvl - 1));
}
function migrateSave(data) {
  var fresh = createFreshState();
  var version = data.saveVersion || 0;
  // Tout champ absent reprend sa valeur de depart
  for (var k in fresh) {
    if (data[k] === undefined || data[k] === null) {
      if (k !== 'birthday' && k !== 'activeEvent' && k !== 'birthdaySetOn' && k !== 'birthdayBoostYear' && k !== 'bakeryTheme' && k !== 'challenge') data[k] = fresh[k];
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
  // Avant la Beta 1.2 : le loyer est moins cher et les dettes moins dures, les anciennes sont effacees
  if (data.saveVersion < 10) {
    data.rentDebt = 0;
    data.gameOver = false;
    data.saveVersion = 10;
  }
  // Avant la 1.2 revue : plus de gateaux de saison, Bob peut etre triste
  if (data.saveVersion < 11) {
    var known = {};
    REC.forEach(function(r) { known[r.id] = true; });
    Object.keys(data.cakes).forEach(function(id) { if (!known[id]) delete data.cakes[id]; });
    data.crafting = data.crafting.filter(function(c) { return c.isIngCraft || known[c.recId]; });
    data.orders = data.orders.filter(function(o) { return o.items.every(function(it) { return known[it.recId]; }); });
    if (typeof ACHIEVEMENTS !== 'undefined') {
      var ids = {};
      ACHIEVEMENTS.forEach(function(a) { ids[a.id] = true; });
      Object.keys(data.achievements).forEach(function(id) { if (!ids[id]) delete data.achievements[id]; });
    }
    if (data.bobClicks >= 1000) data.bobSad = 4;
    data.saveVersion = 11;
  }
  // Avant la Beta 1.4 : ce que tu avais deja reste debloque, et les fours deviennent une machine
  if (data.saveVersion < 12) {
    ING.forEach(function(i) { if (i.unlockLvl <= data.level) data.unlocks.done['ing:' + i.id] = true; });
    REC.forEach(function(r) { if (r.unlockLvl <= data.level) data.unlocks.done['rec:' + r.id] = true; });
    if (data.ovens > 2) data.machines.four = Math.min(10, Math.ceil((data.ovens - 2) / 3));
    data.employees.forEach(function(e) { if ((e.level || 1) > 5) e.level = 5; });
    if (typeof UNLOCK_TALKS !== 'undefined') UNLOCK_TALKS.forEach(function(x) { if (x[0] <= data.level) data.explained[x[1]] = true; });
    data.saveVersion = 12;
  }
  // Release 1.3.3.2 : plus d'intendants. Chacun est rembourse de ce qu'il a coute a l'embauche, une seule fois.
  if (!data.buyersGone) {
    var refund = 0;
    data.employees = (data.employees || []).filter(function(e) {
      if (e.type === 'buyer') { refund += buyerRefund(e); return false; }
      if (Array.isArray(e.jobs)) {
        e.jobs = e.jobs.filter(function(j) { return j.type !== 'buyer'; });
        if (!e.jobs.length) e.jobs = [{ type: 'collector', level: 1 }];
        if (e.focus === 'buyer') e.focus = 'all';
      }
      return true;
    });
    data.applicants = (data.applicants || []).filter(function(a) { return a.type !== 'buyer' && !(a.jobs || []).some(function(j) { return j.type === 'buyer'; }); });
    // Les livraisons deja payees arrivent tout de suite
    (data.deliveries || []).forEach(function(d) { for (var k in d.items) data.ing[k] = (data.ing[k] || 0) + d.items[k]; });
    data.deliveries = [];
    if (Array.isArray(data.empOrder)) data.empOrder = data.empOrder.filter(function(id) { return id !== 'buyer'; });
    if (refund > 0) { data.money = (data.money || 0) + refund; data.buyerRefund = refund; }
    data.buyersGone = true;
  }
  // Release 1.3.4 : plus de touche-a-tout. Chacun est rembourse, une seule fois.
  if (!data.versatileGone) {
    var vRefund = 0;
    data.employees = (data.employees || []).filter(function(e) {
      if (e.type === 'versatile') { vRefund += versatileRefund(e); return false; }
      return true;
    });
    data.applicants = (data.applicants || []).filter(function(a) { return a.type !== 'versatile'; });
    if (vRefund > 0) { data.money = (data.money || 0) + vRefund; data.buyerRefund = (data.buyerRefund || 0) + vRefund; }
    data.versatileGone = true;
  }
  // Les autres patisseries sont sauvegardees a l'interieur de celle-ci
  data.bakeries.forEach(function(b) { if (b.state) b.state = migrateSave(b.state); });
  // Release 1.3.4 : une seule bourse pour toutes les patisseries. L'argent de chacune est additionne, une seule fois.
  if (!data.sharedMoney) {
    data.bakeries.forEach(function(b) {
      if (b.state && typeof b.state.money === 'number') { data.money = (data.money || 0) + Math.max(0, b.state.money); b.state.money = 0; }
      if (b.state && b.state.buyerRefund > 0) { data.buyerRefund = (data.buyerRefund || 0) + b.state.buyerRefund; delete b.state.buyerRefund; }
    });
    data.money = Math.min(MONEY_CAP, data.money || 0);
    data.sharedMoney = true;
  }
  if (!LANGS[data.settings.lang]) data.settings.lang = 'fr';
  if (data.settings.bulk === undefined) data.settings.bulk = '1';
  var fixed = sanitizeLoaded(data);
  if (fixed.length && !loadNotice) loadNotice = 'saveFixed';   // on le dit au joueur
  return data;
}

// Une sauvegarde importee doit avoir de vraies valeurs : on refuse au lieu de corriger en silence.
// Renvoie la raison du refus, ou '' si tout va bien.
function saveInvalidReason(d) {
  if (!d || typeof d !== 'object' || Array.isArray(d)) return 'format';
  function num(v, min, max) { return typeof v === 'number' && isFinite(v) && v >= min && v <= max; }
  if (!num(d.money, 0, 1e304)) return 'money';
  if (d.level !== undefined && !(num(d.level, 1, 100000) && d.level === Math.floor(d.level))) return 'level';
  if (d.xp !== undefined && !num(d.xp, 0, 1e304)) return 'xp';
  if (d.totalEarned !== undefined && !num(d.totalEarned, 0, 1e304)) return 'totalEarned';
  if (d.rentDebt !== undefined && !num(d.rentDebt, 0, 1e304)) return 'rentDebt';
  if (d.maxSpace !== undefined && !num(d.maxSpace, 1, 1e12)) return 'maxSpace';
  var maps = ['ing', 'cakes', 'buildings', 'machines'];
  for (var i = 0; i < maps.length; i++) {
    var m = d[maps[i]];
    if (m === undefined) continue;
    if (!m || typeof m !== 'object' || Array.isArray(m)) return maps[i];
    for (var k in m) {
      var v = maps[i] === 'buildings' ? (m[k] && m[k].qty) : m[k];
      if (!num(v, 0, 1e305)) return maps[i];
    }
  }
  if (d.employees !== undefined && (!Array.isArray(d.employees) || d.employees.length > EMP_LIMIT)) return 'employees';
  if (d.bakeries !== undefined && (!Array.isArray(d.bakeries) || d.bakeries.length > BAKERY_MAX)) return 'bakeries';
  if (Array.isArray(d.bakeries)) {
    for (var j = 0; j < d.bakeries.length; j++) { var st = d.bakeries[j] && d.bakeries[j].state; if (st && saveInvalidReason(st)) return 'bakeries'; }
  }
  return '';
}
// Au chargement : une valeur impossible est corrigee, mais on le dit
function sanitizeLoaded(data) {
  var fixed = [];
  function fix(k, min, dflt) { var v = data[k]; if (typeof v !== 'number' || !isFinite(v) || v < min) { data[k] = dflt; fixed.push(k); } }
  fix('money', 0, 0); fix('xp', 0, 0); fix('level', 1, 1); fix('totalEarned', 0, 0); fix('rentDebt', 0, 0); fix('maxSpace', 1, 5);
  data.level = Math.floor(data.level);
  return fixed;
}

// ============ SAUVEGARDE ============
// Chaque instance (partie) a sa propre cle. Sans instance choisie, on garde l'ancienne cle unique.
var CUR = { profile: 'local', inst: null };
function saveKeyOf(pid, id) { return 'p2ds_p_' + pid + '_i_' + id; }
function curSaveKey() { return CUR.inst ? saveKeyOf(CUR.profile, CUR.inst) : 'p2ds_save'; }
var saveWarningShown = false;

function save() {
  if (typeof ui !== 'undefined' && ui.savesBlocked) return;   // la meme partie est ouverte ailleurs : on n'ecrase pas
  // Hors ligne, le jeu ne sauvegarde pas ta partie
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
  if (typeof capMoney === 'function') capMoney();
  G.lastTick = Date.now();
  try {
    var json = JSON.stringify(G);
    // On garde la sauvegarde precedente en secours
    var key = curSaveKey();
    var previous = localStorage.getItem(key);
    if (previous) localStorage.setItem(key + '_backup', previous);
    localStorage.setItem(key, json);
    saveWarningShown = false;
    if (typeof touchInstanceMeta === 'function') touchInstanceMeta();
    if (typeof cloudQueuePush === 'function') cloudQueuePush();
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
  var key = curSaveKey();
  try { raw = localStorage.getItem(key); } catch (e) { return; }
  if (!raw) return;
  try {
    Object.assign(G, migrateSave(JSON.parse(raw)));
    return;
  } catch (e) {
    // Sauvegarde abimee : on ne l'ecrase pas, on la met de cote
    try { localStorage.setItem(key + '_corrupt', raw); } catch (e2) { /* stockage plein */ }
  }
  try {
    var backup = localStorage.getItem(key + '_backup');
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
  var rk = curSaveKey();
  localStorage.removeItem(rk);
  localStorage.removeItem(rk + '_backup');
  localStorage.removeItem(rk + '_corrupt');
  skipSaveOnUnload = true;
  location.reload();
}

var skipSaveOnUnload = false;

// ============ IMPORT / EXPORT ============
// Nom du fichier : p2ds-<entreprise>-<sauvegarde dans la langue>-<HH>h<MM>-<JJ>-<MM>-<AAAA>.p2ds
// (les « : » et « / » sont interdits dans un nom de fichier)
function saveFileName(company) {
  var d = new Date(), z = function(n) { return ('0' + n).slice(-2); };
  var clean = function(s, fallback) { s = String(s || '').toLowerCase().replace(/[\\\/:*?"<>|\s.]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30); return s || fallback; };
  var word = clean(typeof t === 'function' ? t('save.word') : 'save', 'save');
  return 'p2ds-' + clean(company, 'partie') + '-' + word + '-' + z(d.getHours()) + 'h' + z(d.getMinutes()) + '-' + z(d.getDate()) + '-' + z(d.getMonth() + 1) + '-' + d.getFullYear() + '.p2ds';
}

function exportSave() {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(G))));
  } catch (e) { return ''; }
}

function importSave(code) {
  try {
    if (String(code).length > P2DS_CONFIG.MAX_SAVE_CHARS * 1.4) return false;
    var data = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
    if (JSON.stringify(data).length > P2DS_CONFIG.MAX_SAVE_CHARS) return false;
    if (saveInvalidReason(data)) return false;
    Object.assign(G, migrateSave(data));
    save();
    return true;
  } catch (e) { return false; }
}

// ============ ANNULER (console) ============
var undoState = null;
var lastSaveBeforeMax = null;

function saveUndoState() { undoState = JSON.parse(JSON.stringify(G)); }

// L'etat revient exactement comme il etait : les cles ajoutees depuis (infini, XP verrouillee...) disparaissent aussi
function replaceState(saved) {
  Object.keys(G).forEach(function(k) { if (!(k in saved)) delete G[k]; });
  Object.assign(G, saved);
}
function restoreUndoState() {
  if (!undoState) return false;
  replaceState(undoState);
  undoState = null;
  return true;
}

// La vraie partie n'est gardee que la premiere fois : /max deux fois ne la perd pas
function saveBeforeMax() { if (!lastSaveBeforeMax) lastSaveBeforeMax = JSON.parse(JSON.stringify(G)); }

function restoreBeforeMax() {
  if (!lastSaveBeforeMax) return false;
  replaceState(lastSaveBeforeMax);
  lastSaveBeforeMax = null;
  return true;
}
