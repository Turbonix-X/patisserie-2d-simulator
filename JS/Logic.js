/* ============================================
   PATISSERIE 2D SIMULATOR - GAME LOGIC
   Clics, production, preparation, vente, employes,
   loyer, evenements, faillite, absence
   ============================================ */

// ============ FORMAT HELPERS ============
var MONEY_CAP = 1e303; // Centillion
var NUM_SUFFIXES = (function() {
  var base = ['','k','M','B','T','Qa','Qi','Sx','Sp','Oc','No'];
  var decades = ['Dc','Vg','Tg','Qd','Qq','Sg','St','Og','Ng'];
  var prefixes = ['','U','D','T','Qa','Qi','Sx','Sp','Oc','No'];
  for (var d = 0; d < decades.length; d++) {
    for (var p = 0; p < prefixes.length; p++) base.push(prefixes[p] + decades[d]);
  }
  base.push('Ce');
  return base;
})();

var MAX_MONEY_SHOWN = 9.99e289; // Au-dela, fmt affiche le signe infini

function fmt(n) {
  if (n < 0) return '-' + fmt(-n);
  if (n >= 1e290) return '\u221E'; // Mode creatif : l'infini
  if (n < 1000) return Math.floor(n) + '';
  var idx = Math.floor(Math.log10(n) / 3);
  if (idx >= NUM_SUFFIXES.length) idx = NUM_SUFFIXES.length - 1;
  var val = n / Math.pow(10, idx * 3);
  if (val >= 100) return Math.floor(val) + NUM_SUFFIXES[idx];
  if (val >= 10) return val.toFixed(1) + NUM_SUFFIXES[idx];
  return val.toFixed(2) + NUM_SUFFIXES[idx];
}

function capMoney() {
  if (G.money > MONEY_CAP) G.money = MONEY_CAP;
  if (G.totalEarned > MONEY_CAP) G.totalEarned = MONEY_CAP;
}

function fmtTime(sec) {
  var total = Math.ceil(sec);
  if (total < 60) return total + 's';
  if (total < 3600) return Math.floor(total / 60) + 'm' + (total % 60) + 's';
  return Math.floor(total / 3600) + 'h' + Math.floor((total % 3600) / 60) + 'm';
}

function findIng(id) { for (var i = 0; i < ING.length; i++) { if (ING[i].id === id) return ING[i]; } return null; }
function findRec(id) { for (var i = 0; i < REC.length; i++) { if (REC[i].id === id) return REC[i]; } return null; }
function findBld(id) { for (var i = 0; i < BUILDINGS.length; i++) { if (BUILDINGS[i].id === id) return BUILDINGS[i]; } return null; }
function findEmpType(id) { for (var i = 0; i < EMP_TYPES.length; i++) { if (EMP_TYPES[i].id === id) return EMP_TYPES[i]; } return null; }

// ============ BONUS ============
function birthdayBonus() {
  return (G.birthdayBoostUntil && Date.now() < G.birthdayBoostUntil) ? 2 : 1;
}

function empTraining(emp) { return !!emp.trainingUntil && emp.trainingUntil > Date.now(); }

// Un employe en pause ne fait rien, mais son salaire continue de tomber
function empWorking(emp) { return (emp.status === 'working' || emp.status === 'poor') && !empTraining(emp) && !emp.paused && !empSwitching(emp); }

// L'ordre des metiers dans l'onglet : de base, le meilleur metier en haut et les apprentis en bas
function empGroupOrder() {
  var all = EMP_TYPES.map(function(et) { return et.id; }).reverse();
  var saved = Array.isArray(G.empOrder) ? G.empOrder.filter(function(id) { return all.indexOf(id) >= 0; }) : [];
  all.forEach(function(id) { if (saved.indexOf(id) < 0) saved.push(id); });
  return saved;
}

function moveEmpGroup(type, beforeType) {
  var order = empGroupOrder().filter(function(id) { return id !== type; });
  var at = beforeType ? order.indexOf(beforeType) : -1;
  if (at < 0) order.push(type); else order.splice(at, 0, type);
  G.empOrder = order;
}

// Ce que montre le tableau de bord
function empDashboard() {
  var d = { total: G.employees.length, byType: {}, working: 0, paused: 0, striking: 0, collectors: {} };
  G.employees.forEach(function(e) {
    d.byType[e.type] = (d.byType[e.type] || 0) + 1;
    if (e.paused) d.paused++;
    else if (e.status === 'striking') d.striking++;
    else if (empWorking(e)) d.working++;
    if (hasJob(e,'collector') && e.assignedIng) d.collectors[e.assignedIng] = (d.collectors[e.assignedIng] || 0) + 1;
  });
  return d;
}

// Chaque niveau double ce que sait faire un employe. Le niveau or (11) fait 10 fois le niveau 10.
function empLvl(emp) { return emp.type === 'novice' ? 1 : Math.max(1, Math.min(EMP_GOLD_LVL, emp.level || 1)); }
function lvlMultOf(L) { return L >= EMP_GOLD_LVL ? 10 * Math.pow(2, EMP_MAX_LVL - 1) : Math.pow(2, L - 1); }
function empSwitching(emp) { return !!emp.switchUntil && Date.now() < emp.switchUntil; }
function jobRec(emp, type) { var j = null; (emp.jobs || []).forEach(function(x) { if (x.type === type) j = x; }); return j; }

// Le niveau avec lequel cet employe fait ce metier tout de suite (0 : il ne le fait pas)
function jobLevel(emp, type) {
  if (emp.type !== 'versatile') return emp.type === type ? empLvl(emp) : 0;
  var j = jobRec(emp, type);
  if (!j) return 0;
  var f = emp.focus || 'all';
  if (f !== 'all' && f !== type) return 0;
  if (f === type) return j.level;
  // Tous les metiers en meme temps : son propre niveau decide de ce qu'il garde
  var keep = 0.25 + 0.075 * Math.max(1, Math.min(EMP_MAX_LVL, emp.level || 1));
  return Math.max(1, Math.round(j.level * keep));
}
function hasJob(emp, type) { return jobLevel(emp, type) > 0 && !empSwitching(emp); }

function empLevelMult(emp, type) {
  var L = emp.type === 'versatile' ? Math.max(1, jobLevel(emp, type)) : empLvl(emp);
  return lvlMultOf(L);
}

function empPower(emp, type) {
  // Un employe tres motive (bien paye) travaille mieux
  var boost = emp.morale > 100 ? 1 + (emp.morale - 100) / 100 : 1;
  return empLevelMult(emp, type) * empSkillMult(emp) * (emp.status === 'poor' ? 0.5 : 1) * boost;
}

// Le cueilleur : son efficacite, sa perte, et sa limite de production
function collectorLoss(emp) { return emp.lossPct === undefined ? 10 : Math.max(0, Math.min(100, emp.lossPct)); }
function collectorOutput(emp, ingId) {
  var r = empPower(emp, 'collector') * (1 - collectorLoss(emp) / 100);
  if (emp.limitMode === 'below' && (G.ing[ingId] || 0) >= (emp.limitN || 0)) return 0;
  if (emp.limitMode === 'hour') r = Math.min(r, (emp.limitN || 0) / 3600);
  return r;
}
// Moins il perd, plus il est cher
function lossCostMult(loss) { var l = Math.max(0, Math.min(100, loss)) / 100; return (0.4 + 1.2 * Math.pow(1 - l, 2)) / 1.37; }
function sampleLoss() {
  var r = Math.random();
  if (r < 0.04) return Math.floor(Math.random() * 2);
  if (r < 0.07) return Math.round(40 + 60 * Math.pow(Math.random(), 3));
  return 1 + Math.floor(Math.random() * 20);
}

function empCount(type) {
  if (G.creative) return 999; // Mode creatif : des employes a l'infini
  var n = 0;
  for (var e = 0; e < G.employees.length; e++) {
    if (G.employees[e].type === type && empWorking(G.employees[e])) n++;
  }
  return n;
}

// Competence 1 a 100 : de x0.5 a x1.5
function empSkillMult(emp) {
  return 0.5 + (emp.skill === undefined ? 50 : emp.skill) / 100;
}

function achievementBonus() {
  var n = 0;
  for (var k in G.achievements) { if (G.achievements[k]) n++; }
  return 1 + n * ACH_BONUS;
}

// Unites achetees par clic. Le bonus fait gagner du temps : chaque unite se paie.
function clickMult() {
  var m = birthdayBonus();
  if (G.eventClickBonus) m *= (1 + G.eventClickBonus);
  return Math.round(m * 100) / 100;
}

// Seuls les cueilleurs produisent a la seconde. Les batiments livrent d'un coup.
function autoRate(ingId) {
  if (G.eventAutoBonus && G.eventAutoBonus <= -1) return 0;
  var r = 0;
  for (var e = 0; e < G.employees.length; e++) {
    var emp = G.employees[e];
    if (hasJob(emp,'collector') && emp.assignedIng === ingId && empWorking(emp) && !collectorMoving(emp)) r += collectorOutput(emp, ingId);
  }
  if (G.eventAutoBonus) r *= (1 + G.eventAutoBonus);
  return r * birthdayBonus();
}

function addSoldStat(recId, qty) {
  if (!G.stats.soldById) G.stats.soldById = {};
  G.stats.soldById[recId] = (G.stats.soldById[recId] || 0) + qty;
}

function totalAuto() {
  var s = 0;
  for (var i = 0; i < ING.length; i++) s += autoRate(ING[i].id);
  return s;
}

// ============ PRIX DE VENTE ============
function sellValueMult() {
  return birthdayBonus() * achievementBonus() * (1 + machineBonus('price') / 100);
}

// Offre et demande : plus tu vends un gateau, plus son prix baisse.
// La demande revient toute seule avec le temps.
function demandMult(rec, extraSold) {
  var mySold = (G.soldCount[rec.id] || 0) + (extraSold || 0);
  var otherSold = Math.max(0, G.totalAllSold - (G.soldCount[rec.id] || 0));
  var mult = 1 - INFLATION.sellDecay * (1 - machineBonus('decay') / 100) * mySold + INFLATION.otherBoost * otherSold;
  return Math.max(INFLATION.minMult, Math.min(INFLATION.maxMult, mult)) * prepMult(rec) * restMult(rec);
}

// Une recette qu'on n'a pas preparee depuis longtemps : son prix monte petit a petit
function restMult(rec) {
  var last = G.lastMadeAt && G.lastMadeAt[rec.id];
  if (!last) return 1;
  var idle = (Date.now() - last) / 1000;
  if (idle <= REST_BONUS.afterSec) return 1;
  return 1 + REST_BONUS.max * Math.min(1, (idle - REST_BONUS.afterSec) / (REST_BONUS.fullSec - REST_BONUS.afterSec));
}

// Trop preparer la meme recette : son prix de vente baisse un peu
function prepMult(rec) {
  var made = (G.madeCount && G.madeCount[rec.id]) || 0;
  return Math.max(PREP_FATIGUE.minMult, 1 - PREP_FATIGUE.perBatch * made);
}

function eventPriceMult(rec) {
  var m = G.eventPriceBonus ? 1 + G.eventPriceBonus : 1;
  return rec ? m * focusMult('rec', rec.id) : m;
}

// L'evenement en cours sur un seul ingredient ou une seule recette
function focusMult(kind, id) {
  var f = G.focusEvent;
  return f && f.kind === kind && f.id === id && Date.now() < f.until ? f.mult : 1;
}

function inflatedPrice(rec) {
  return Math.round(rec.val * sellValueMult() * demandMult(rec) * eventPriceMult(rec) * 100) / 100;
}

// Prix total d'un lot : le prix baisse au fil de la vente, meme en gros
function batchPrice(rec, qty) {
  if (qty <= 0) return 0;
  var samples = Math.min(qty, 8);
  var sum = 0;
  for (var i = 0; i < samples; i++) sum += demandMult(rec, (i + 0.5) * qty / samples);
  return rec.val * sellValueMult() * eventPriceMult(rec) * (sum / samples) * qty;
}

function inflationPct(rec) {
  return Math.round((demandMult(rec) * eventPriceMult(rec) - 1) * 100);
}

function recoverDemand(dtSec) {
  var keep = Math.pow(1 - INFLATION.recoveryPerSec, dtSec);
  for (var k in G.soldCount) { G.soldCount[k] *= keep; }
  G.totalAllSold *= keep;
  var keepMade = Math.pow(1 - PREP_FATIGUE.recoveryPerSec, dtSec);
  for (var m in G.madeCount) { G.madeCount[m] *= keepMade; if (G.madeCount[m] < 0.01) delete G.madeCount[m]; }
}

// ============ XP ============
function xpMult() {
  var m = G.eventXpBonus ? 1 + G.eventXpBonus : 1;
  return m * birthdayBonus() * (1 + machineBonus('xp') / 100);
}

function addXP(amount) {
  if (G.creative) return; // Le mode creatif ne fait pas monter de niveau
  G.xp += Math.floor(amount * xpMult());
  var needed = xpForLevel(G.level);
  while (G.xp >= needed) {
    G.xp -= needed;
    G.level++;
    needed = xpForLevel(G.level);
    if (typeof showLevelUp === 'function') showLevelUp(G.level);
  }
}

// ============ ESPACE ============
function usedSpace() {
  var s = 0;
  for (var i = 0; i < REC.length; i++) s += (G.cakes[REC[i].id] || 0) * REC[i].space;
  return Math.round(s * 100) / 100;
}

// La place prise petit a petit : plus la barre de preparation monte, plus l'espace se remplit
function reservedSpace() {
  var s = 0;
  for (var i = 0; i < G.crafting.length; i++) {
    var c = G.crafting[i];
    if (c.isIngCraft || c.startTime === null) continue;
    var rec = findRec(c.recId);
    if (rec) s += rec.space * rec.qty * (c.sp || 0);
  }
  return s;
}

// La place que toutes les fournees en cours ou en attente finiront par prendre
function committedSpace() {
  var s = 0;
  for (var i = 0; i < G.crafting.length; i++) {
    if (G.crafting[i].isIngCraft) continue;
    var rec = findRec(G.crafting[i].recId);
    if (rec) s += rec.space * rec.qty;
  }
  return s;
}

// L'espace, avec le refrigerateur
function maxSpaceNow() { return G.creative ? Infinity : G.maxSpace * (1 + machineBonus('space') / 100); }

function batchSpace(rec) { return rec.space * rec.qty; }

function canFitRecipe(rec) {
  return usedSpace() + committedSpace() + batchSpace(rec) <= maxSpaceNow();
}

function nextSpaceUpgrade() {
  if (G.spaceBought >= SPACE_UPG.length) return null;
  var su = SPACE_UPG[G.spaceBought];
  return { add: su.add, cost: su.cost, lvlReq: su.lvlReq };
}

// ============ FOURS ============
function ovenSlots() {
  if (G.creative) return 999;
  return OVEN_CONFIG.start + machineBonus('ovens');
}

function activeCrafts() {
  var n = 0;
  for (var i = 0; i < G.crafting.length; i++) { if (G.crafting[i].startTime !== null) n++; }
  return n;
}

function startQueuedCrafts() {
  var free = ovenSlots() - activeCrafts();
  for (var i = 0; i < G.crafting.length && free > 0; i++) {
    if (G.crafting[i].startTime === null) {
      G.crafting[i].startTime = Date.now();
      if (G.crafting[i].sp === undefined) G.crafting[i].sp = 0;
      free--;
    }
  }
}

// ============ RECETTES ============
function canMake(rec) {
  if (!recUnlocked(rec)) return false;
  for (var k in rec.req) {
    if ((G.ing[k] || 0) < rec.req[k]) return false;
  }
  return true;
}

// Ce qui empeche de preparer. Le manque de place n'en fait pas partie : on prepare quand meme, la barre gele.
function craftBlockers(rec) {
  var b = [];
  if (!canMake(rec)) b.push('ing');
  if (G.crafting.length >= OVEN_CONFIG.maxQueue) b.push('queue');
  return b;
}
function craftBlockReason(rec) { var b = craftBlockers(rec); return b.length ? b[0] : null; }

function recipeCost(rec) {
  var c = 0;
  for (var k in rec.req) { c += getIngredientCost(findIng(k)) * rec.req[k]; }
  return c;
}

function missingCost(rec) {
  var c = 0;
  for (var k in rec.req) {
    var miss = rec.req[k] - (G.ing[k] || 0);
    if (miss > 0) c += getIngredientCost(findIng(k)) * miss;
  }
  return c;
}

// Le boulanger fait baisser le temps de preparation, et ses machines aussi
function craftSpeedMult() {
  var bakers = 0;
  G.employees.forEach(function(e) { if (hasJob(e,'baker') && empWorking(e)) bakers += 0.05 * empLevelMult(e, 'baker'); });
  if (G.creative) bakers = 1;
  return Math.max(0.05, Math.max(0.2, 1 - bakers) * (1 - Math.min(80, machineBonus('prep')) / 100));
}

function getCraftDuration(rec) {
  return Math.max(0.5, rec.prepTime * craftSpeedMult());
}

function newCraftUid() { return Math.random().toString(36).slice(2, 10); }

// Ce que tu recuperes si tu jettes une preparation : plus la barre a monte, moins il en reste
function craftProgress(c) {
  if (c.startTime === null) return 0;
  var p = Math.max(0, Math.min(1, (Date.now() - c.startTime) / c.duration));
  if (!c.isIngCraft && c.cap !== undefined) p = Math.min(p, c.cap);
  return p;
}
function craftRefund(c) {
  var req = c.isIngCraft ? (findIng(c.ingId) || {}).craftReq : (findRec(c.recId) || {}).req;
  var out = {}, p = craftProgress(c);
  for (var k in (req || {})) { var n = Math.floor(req[k] * (1 - p)); if (n > 0) out[k] = n; }
  return out;
}
function discardCraft(uid) {
  for (var i = 0; i < G.crafting.length; i++) {
    var c = G.crafting[i];
    if (c.uid !== uid) continue;
    var back = craftRefund(c);
    for (var k in back) G.ing[k] = (G.ing[k] || 0) + back[k];
    G.crafting.splice(i, 1);
    startQueuedCrafts();
    return back;
  }
  return null;
}

function startCraft(rec) {
  if (craftBlockReason(rec)) return false;
  for (var k in rec.req) G.ing[k] -= rec.req[k];
  G.crafting.push({ recId: rec.id, startTime: null, duration: getCraftDuration(rec) * 1000, sp: 0, uid: newCraftUid() });
  startQueuedCrafts();
  return true;
}

function startCraftMax(rec) {
  var n = 0;
  while (startCraft(rec)) n++;
  return n;
}

function tickCrafting() {
  var now = Date.now();
  // La place libre : les gateaux et les fournees deja a moitie faites comptent
  var room = maxSpaceNow() - usedSpace() - reservedSpace();
  var finished = [];
  var remaining = [];
  for (var i = 0; i < G.crafting.length; i++) {
    var c = G.crafting[i];
    if (!c.uid) c.uid = newCraftUid();
    if (c.startTime === null) { remaining.push(c); continue; }
    var pT = Math.max(0, Math.min(1, (now - c.startTime) / c.duration));
    if (c.isIngCraft) { if (pT >= 1) finished.push(c); else remaining.push(c); continue; }
    var rec = findRec(c.recId);
    if (!rec) { remaining.push(c); continue; }
    var full = rec.space * rec.qty;
    if (c.sp === undefined) c.sp = pT;
    var want = (pT - c.sp) * full;
    if (want <= room + 1e-9) {
      room -= want;
      c.sp = pT;
      c.frozen = false;
    } else {
      // Plus de place : la barre gele, et reprend quand tu en liberes
      var give = Math.max(0, room);
      c.sp += give / full;
      room -= give;
      c.startTime = now - c.sp * c.duration;
      c.frozen = true;
    }
    c.cap = Math.min(1, c.sp + Math.max(0, room) / full);
    if (c.sp >= 1 - 1e-9) finished.push(c); else remaining.push(c);
  }
  G.crafting = remaining;
  for (var f = 0; f < finished.length; f++) {
    var done = finished[f];
    if (done.isIngCraft) {
      var ing = findIng(done.ingId);
      var made = (ing && ing.craftQty) || 1;
      G.ing[done.ingId] = (G.ing[done.ingId] || 0) + made;
      if (ing && typeof toast === 'function') toast(ing.e + ' +' + made + ' ' + t('i.' + ing.id));
      continue;
    }
    var rec2 = findRec(done.recId);
    if (!rec2) continue;
    // Sa place etait deja reservee, petit a petit
    G.cakes[rec2.id] += rec2.qty;
    G.stats.totalCakesMade += rec2.qty;
    G.stats.cakesMadeById[rec2.id] = (G.stats.cakesMadeById[rec2.id] || 0) + rec2.qty;
    if (!G.madeCount) G.madeCount = {};
    G.madeCount[rec2.id] = (G.madeCount[rec2.id] || 0) + 1;
    if (!G.lastMadeAt) G.lastMadeAt = {};
    G.lastMadeAt[rec2.id] = Date.now();
    addXP(rec2.xp);
    if (typeof toast === 'function') toast(rec2.e + ' ' + t('rec.ready', { q: rec2.qty, n: recShortName(rec2) }));
  }
  startQueuedCrafts();
  return finished.length > 0;
}

function recShortName(rec) {
  return t('r.' + rec.id).replace(/ x\d+$/, '');
}

// ============ INGREDIENTS ============
function getIngredientCost(ing) {
  var c = ing.cost * (1 - machineBonus('ingCost') / 100) * focusMult('ing', ing.id);
  return G.eventIngBonus ? c * (1 + G.eventIngBonus) : c;
}

function getIngredientResellPrice(ing) {
  return ing.cost * (ing.resellRate || 0.5);
}

// bulk : '1', '10', '100' ou 'max'. Renvoie le nombre d'unites achetees, ou false.
function buyIngredient(ing, bulk) {
  var unitCost = getIngredientCost(ing);
  if (G.money < unitCost) return false;
  var maxUnits = G.money / unitCost;
  var units = bulk === 'max' ? Math.floor(maxUnits) : Math.min(clickMult() * (parseInt(bulk, 10) || 1), maxUnits);
  if (units <= 0) return false;
  var cost = unitCost * units;
  G.money -= cost;
  G.ing[ing.id] += units;
  G.stats.totalClicks++;
  G.stats.totalIngredientCost += cost;
  addXP(1); // Un clic = 1 XP, quel que soit le lot
  return units;
}

function resellAmount(ing, bulk) {
  var have = G.ing[ing.id] || 0;
  if (bulk === 'max') return have;
  return Math.min(have, parseInt(bulk, 10) || 1);
}

function resellIngredient(ing, amount) {
  var actual = Math.min(amount, G.ing[ing.id] || 0);
  if (actual <= 0) return 0;
  var price = getIngredientResellPrice(ing) * actual;
  G.ing[ing.id] -= actual;
  G.money += price;
  G.totalEarned += price;
  return price;
}

function startIngredientCraft(ing) {
  if (!ing.craftable || !ing.craftReq) return false;
  if (G.crafting.length >= OVEN_CONFIG.maxQueue) return false;
  var k;
  for (k in ing.craftReq) {
    if ((G.ing[k] || 0) < ing.craftReq[k]) return false;
  }
  for (k in ing.craftReq) G.ing[k] -= ing.craftReq[k];
  G.crafting.push({
    recId: '_ing_' + ing.id,
    ingId: ing.id,
    isIngCraft: true,
    uid: newCraftUid(),
    startTime: null,
    duration: (ing.craftTime || 3) * craftSpeedMult() * 1000,
  });
  startQueuedCrafts();
  return true;
}

function tickAutoCollect(dtSec) {
  for (var i = 0; i < ING.length; i++) {
    var r = autoRate(ING[i].id);
    if (r > 0) G.ing[ING[i].id] += r * dtSec;
  }
}

// ============ BATIMENTS ============
function buildingCost(bld) {
  var qty = (G.buildings[bld.id] || { qty: 0 }).qty;
  return Math.floor(bld.baseCost * Math.pow(1.15, qty));
}

function buildingUnlockLvl(bld) { return Math.max(bld.unlockLvl, BUILDINGS_LVL); }

function buildingsOwned() {
  var n = 0;
  BUILDINGS.forEach(function(b) { n += (G.buildings[b.id] || { qty: 0 }).qty; });
  return n;
}

// bulk : '1', '10', '100' ou 'max'
function buyBuilding(bld, bulk) {
  var want = bulk === 'max' ? 100000 : (parseInt(bulk, 10) || 1);
  var bought = 0;
  while (bought < want) {
    var cost = buildingCost(bld);
    if (G.money < cost || G.level < buildingUnlockLvl(bld)) break;
    G.money -= cost;
    G.stats.totalInvested += cost;
    G.buildings[bld.id].qty++;
    G.stats.totalBuildingsBought++;
    bought++;
  }
  if (bought > 0 && !G.bldTimers[bld.id]) G.bldTimers[bld.id] = BLD_CYCLE_SEC;
  return bought;
}

// Ce qu'un batiment livre d'un coup, une fois par heure
function buildingDelivery(bld) {
  var qty = (G.buildings[bld.id] || { qty: 0 }).qty;
  return qty * bld.baseRate * BLD_CYCLE_SEC * (1 + machineBonus('bld') / 100) * birthdayBonus();
}

// Fait avancer les batiments de dtSec. Renvoie ce qui a ete livre.
function advanceBuildings(dtSec) {
  var total = 0;
  BUILDINGS.forEach(function(bld) {
    if ((G.buildings[bld.id] || { qty: 0 }).qty <= 0) return;
    if (isBroken('b', bld.id)) return; // En panne : il ne livre plus
    var left = (G.bldTimers[bld.id] || BLD_CYCLE_SEC) - dtSec;
    var before = left + dtSec;
    if (before > 60 && left <= 60 && left > 0 && typeof onBuildingSoon === 'function') onBuildingSoon(bld);
    while (left <= 0) {
      var amount = buildingDelivery(bld);
      G.ing[bld.produces] = (G.ing[bld.produces] || 0) + amount;
      total += amount;
      left += BLD_CYCLE_SEC;
      if (typeof onBuildingDone === 'function') onBuildingDone(bld, amount);
    }
    G.bldTimers[bld.id] = left;
  });
  return total;
}

// ============ EMPLOYES ============
function getEmpName() {
  var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
  var names = EMP_NAMES_LANG[lang] || EMP_NAMES_LANG.fr;
  return names[Math.floor(Math.random() * names.length)];
}

function collectorMoving(emp) { return !!emp.moveUntil && Date.now() < emp.moveUntil; }
function collectorMoveSec(emp) {
  var lv = Math.min(EMP_MAX_LVL, emp.level || 1);
  if (emp.type === 'versatile') lv = 1;
  return Math.round(COLLECTOR_MOVE_SEC[0] + (COLLECTOR_MOVE_SEC[1] - COLLECTOR_MOVE_SEC[0]) * (lv - 1) / (EMP_MAX_LVL - 1));
}
function moveCollector(emp, ingId) {
  if (!emp || emp.assignedIng === ingId || emp.specialty) return false; // Un specialiste ne change pas d'ingredient
  emp.assignedIng = ingId;
  emp.moveUntil = Date.now() + collectorMoveSec(emp) * 1000;
  return true;
}

// Homme ou femme : d'apres le prenom (les listes alternent un prenom d'homme, un prenom de femme)
function empGender(name) {
  for (var lang in EMP_NAMES_LANG) {
    var i = EMP_NAMES_LANG[lang].indexOf(name);
    if (i >= 0) return i % 2 === 0 ? 'm' : 'f';
  }
  var h = 0, str = String(name || '');
  for (var k = 0; k < str.length; k++) h = (h * 31 + str.charCodeAt(k)) >>> 0;
  return h % 2 ? 'f' : 'm';
}

function newEmployee(typeId, name, skill, level, extra) {
  extra = extra || {};
  var e = {
    id: G.nextEmployeeId++,
    name: name,
    type: typeId,
    morale: 70 + Math.floor(Math.random() * 20),
    status: 'working',
    skill: skill,
    level: typeId === 'novice' ? 1 : Math.max(1, Math.min(EMP_GOLD_LVL, level || 1)),
    assignedIng: typeId === 'collector' ? bestCollectorTarget() : null,
    unpaidTime: 0,
  };
  if (typeId === 'collector' || typeId === 'versatile') {
    e.lossPct = extra.lossPct !== undefined ? extra.lossPct : sampleLoss();
    if (extra.specialty) { e.specialty = extra.specialty; e.assignedIng = extra.specialty; }
  }
  if (typeId === 'versatile') {
    e.jobs = (extra.jobs && extra.jobs.length) ? extra.jobs.map(function(j) { return { type: j.type, level: Math.max(1, Math.min(VERSATILE_MAX_JOB_LVL, j.level || 1)) }; }) : [{ type: 'collector', level: 1 }, { type: 'baker', level: 1 }];
    e.focus = 'all';
    if (!e.assignedIng) e.assignedIng = bestCollectorTarget();
  }
  return e;
}

function baseSkill() {
  return Math.min(90, 25 + Math.floor(G.level * 0.3));
}

function empTypeOpen(et) {
  return G.level >= et.unlockLvl && (!et.needsBakeries || G.bakeries.length >= et.needsBakeries);
}

function hireEmployee(typeId, applicant) {
  var empType = findEmpType(typeId);
  if (!empType || !empTypeOpen(empType)) return false;
  var cost = applicant ? applicant.hireCost : empType.hireCost;
  if (G.money < cost) return false;
  G.money -= cost;
  G.stats.totalInvested += cost;
  var skill = applicant ? applicant.skill : Math.max(1, baseSkill() - 15 + Math.floor(Math.random() * 20));
  G.employees.push(newEmployee(typeId, applicant ? applicant.name : getEmpName(), skill, applicant ? applicant.level : 1, applicant));
  G.stats.totalEmployeesHired++;
  startQueuedCrafts();
  return true;
}

// Un touche-a-tout change de metier : 10 s a 1 min, selon le niveau de l'ancien et du nouveau
function switchFocusSec(emp, toType) {
  var from = emp.focus && emp.focus !== 'all' ? (jobRec(emp, emp.focus) || { level: 1 }).level : 1;
  var to = toType === 'all' ? 1 : (jobRec(emp, toType) || { level: 1 }).level;
  return Math.round(10 + 50 * ((from + to - 2) / (2 * (VERSATILE_MAX_JOB_LVL - 1))));
}
function setFocus(emp, toType) {
  if (!emp || emp.type !== 'versatile' || (emp.focus || 'all') === toType) return false;
  if (toType !== 'all' && !jobRec(emp, toType)) return false;
  emp.switchUntil = Date.now() + switchFocusSec(emp, toType) * 1000;
  emp.focus = toType;
  return true;
}

function fireEmployee(empId) {
  G.employees = G.employees.filter(function(e) { return e.id !== empId; });
}

function findEmp(empId) {
  for (var i = 0; i < G.employees.length; i++) { if (G.employees[i].id === empId) return G.employees[i]; }
  return null;
}

// Chaque niveau coute bien plus cher que le precedent
function getTrainCost(emp) {
  var empType = findEmpType(emp.type);
  return Math.floor((empType ? empType.hireCost : 200) * 3 * Math.pow(8, (emp.level || 1) - 1));
}

// Pendant sa formation, il ne travaille pas
function trainDuration(emp) { return 30 * (emp.level || 1) * (emp.specialty ? 0.1 : 1); }

function trainEmployee(empId) {
  var emp = findEmp(empId);
  if (!emp || emp.type === 'novice' || (emp.level || 1) >= EMP_MAX_LVL || empTraining(emp)) return false;
  var cost = getTrainCost(emp);
  if (G.money < cost) return false;
  G.money -= cost;
  G.stats.totalInvested += cost;
  emp.trainingUntil = Date.now() + trainDuration(emp) * 1000;
  emp.level = (emp.level || 1) + 1;
  return true;
}

function getBonusCost(emp) { return Math.floor(getEmpSalary(emp) * 120); }

// Une prime remonte le moral
function giveBonus(empId) {
  var emp = findEmp(empId);
  if (!emp || emp.morale >= 100) return false;
  var cost = getBonusCost(emp);
  if (G.money < cost) return false;
  G.money -= cost;
  G.stats.totalInvested += cost;
  emp.morale = Math.min(100, emp.morale + 25);
  return true;
}

// Euros par seconde. Mieux forme, mieux paye. Le reglage de paie monte ou baisse le tout.
function getEmpSalary(emp) {
  var empType = findEmpType(emp.type);
  if (!empType) return 0;
  var lvl = emp.type === 'novice' ? 1 : (emp.level || 1);
  return empType.baseSalary * (1 + 0.5 * (lvl - 1)) * (1 - machineBonus('salary') / 100) * (1 + (emp.payAdj || 0) / 100);
}
function maxMorale(emp) { return 100 + (emp.payAdj || 0); }

// Changer la paie : trop bas, et il demissionne presque toujours
function setPay(emp, adj) {
  if (!emp || PAY_STEPS.indexOf(adj) < 0) return 'none';
  emp.payAdj = adj;
  var quitChance = adj <= -50 ? 0.9 : adj <= -20 ? 0.3 : 0;
  if (quitChance > 0 && Math.random() < quitChance) { fireEmployee(emp.id); return 'quit'; }
  emp.morale = Math.min(emp.morale, maxMorale(emp));
  return 'ok';
}

function totalSalary() {
  var s = 0;
  for (var i = 0; i < G.employees.length; i++) s += getEmpSalary(G.employees[i]);
  return s;
}

// Un employe sans metier : on lui en paie un
function jobCost(et) { return Math.floor(et.hireCost * 0.7); }

function giveJob(empId, typeId) {
  var emp = findEmp(empId), et = findEmpType(typeId);
  if (!emp || emp.type !== 'novice' || !et || typeId === 'novice' || !empTypeOpen(et)) return false;
  var cost = jobCost(et);
  if (G.money < cost) return false;
  G.money -= cost;
  G.stats.totalInvested += cost;
  emp.type = typeId;
  if (typeId === 'collector') { emp.assignedIng = bestCollectorTarget(); emp.lossPct = sampleLoss(); }
  return true;
}

// ---------- Candidatures et recherche ----------
// Avant le niveau 10, personne ne se presente tout seul : il faut chercher. Ensuite, de plus en plus de monde vient.
function applicantChance() { return G.level < 10 ? 0 : Math.min(0.6, 0.05 + G.level / 150); }
function searchChance() { return Math.min(0.95, 0.25 + G.level / 150); }

// Le niveau d'un candidat : au debut, jamais plus que 2. Plus tu montes, moins les hauts niveaux sont rares.
function applicantLevelWeights() {
  var w = {};
  for (var L = 1; L <= EMP_GOLD_LVL; L++) {
    var req = APPLICANT_LVL_REQ[L];
    if (G.level < req) continue;
    var base = L === EMP_GOLD_LVL ? 0.00005 : Math.pow(0.42, L - 1);
    w[L] = base * (1 + (G.level - req) / (L <= 2 ? 200 : 60));
  }
  return w;
}
function applicantLevel(maxLvl) {
  var w = applicantLevelWeights(), tot = 0, L;
  for (L in w) { if (!maxLvl || +L <= maxLvl) tot += w[L]; }
  var r = Math.random() * tot;
  for (L in w) {
    if (maxLvl && +L > maxLvl) continue;
    r -= w[L];
    if (r <= 0) return +L;
  }
  return 1;
}

function generateApplicant(typeId, opts) {
  if (G.applicants.length >= 5) return false;
  opts = opts || {};
  var open = EMP_TYPES.filter(function(et) { return empTypeOpen(et) && !et.hidden; });
  if (open.length === 0) return false;
  var empType = typeId ? findEmpType(typeId) : open[Math.floor(Math.random() * open.length)];
  var skill = Math.max(1, Math.min(100, baseSkill() + Math.floor(Math.random() * 30) - 15));
  // Les apprentis n'ont pas de niveau, le niveau or ne se trouve qu'a partir du niveau 120
  var level = empType.id === 'novice' ? 1 : applicantLevel(empType.id === 'versatile' ? EMP_MAX_LVL : 0);
  var app = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    name: getEmpName(),
    type: empType.id,
    skill: skill,
    level: level,
    expiresAt: Date.now() + 180000,
  };
  var mult = 1;
  if (empType.id === 'collector') {
    app.lossPct = sampleLoss();
    mult *= lossCostMult(app.lossPct);
    // Les tres hauts niveaux peuvent etre specialises dans un ingredient : formation express, mais pas de changement
    if (level >= 6 && Math.random() < 0.4) {
      var pool = ING.filter(ingUnlocked);
      if (pool.length) app.specialty = pool[Math.floor(Math.random() * pool.length)].id;
    }
  }
  if (empType.id === 'versatile') {
    var types = (opts.types || []).slice(0, 3);
    var open2 = EMP_TYPES.filter(function(et) { return empTypeOpen(et) && !et.hidden && et.id !== 'novice' && types.indexOf(et.id) < 0; });
    if (types.length < 3 && open2.length && Math.random() < 0.3) types.push(open2[Math.floor(Math.random() * open2.length)].id);
    app.jobs = types.map(function(tp) { var r = Math.random(); return { type: tp, level: r < 0.5 ? 1 : r < 0.8 ? 2 : 3 }; });
    app.lossPct = sampleLoss();
    mult *= 1 + app.jobs.reduce(function(a, j) { return a + j.level; }, 0) * 0.3;
  }
  // Un employe deja forme coute bien plus cher
  app.hireCost = Math.floor(empType.hireCost * (0.5 + skill * 0.01) * Math.pow(4, level - 1) * mult);
  G.applicants.push(app);
  if (typeof toast === 'function') toast(level >= EMP_GOLD_LVL ? t('emp.goldApplicant') : level >= 3 ? t('emp.rareApplicant', { v: level }) : t('emp.applicant'));
  return true;
}

function removeExpiredApplicants() {
  var now = Date.now();
  G.applicants = G.applicants.filter(function(a) { return a.expiresAt > now; });
}

function acceptApplicant(appId) {
  for (var i = 0; i < G.applicants.length; i++) {
    if (G.applicants[i].id === appId) {
      if (hireEmployee(G.applicants[i].type, G.applicants[i])) {
        G.applicants.splice(i, 1);
        return true;
      }
      return false;
    }
  }
  return false;
}

function rejectApplicant(appId) {
  G.applicants = G.applicants.filter(function(a) { return a.id !== appId; });
}

function searchFor(typeId) {
  var s = null;
  G.searches.forEach(function(x) { if ((x.types || [x.type]).indexOf(typeId) >= 0) s = x; });
  return s;
}

// Chercher un ou deux metiers : ca prend du temps, et ca ne marche pas toujours
function startSearch(typeIds) {
  var ids = Array.isArray(typeIds) ? typeIds.slice(0, 2) : [typeIds];
  if (ids.length === 0) return false;
  for (var i = 0; i < ids.length; i++) {
    var et = findEmpType(ids[i]);
    if (!et || et.hidden || !empTypeOpen(et) || searchFor(ids[i])) return false;
  }
  if (ids.length === 2 && ids[0] === ids[1]) return false;
  G.searches.push({ type: ids[0], types: ids, doneAt: Date.now() + (20 + Math.random() * 40) * 1000 });
  return true;
}

function tickSearches() {
  var now = Date.now();
  G.searches = G.searches.filter(function(job) {
    if (job.doneAt > now) return true;
    var types = job.types || [job.type];
    var ok = false, label = types.map(function(x) { return t('emp.' + x); }).join(' + ');
    if (Math.random() < searchChance()) {
      var vOpen = empTypeOpen(findEmpType('versatile'));
      // Quelqu'un qui a les deux metiers cherches peut se presenter, ou quelqu'un qui n'en a qu'un
      if (types.length === 2 && vOpen && Math.random() < 0.4) ok = generateApplicant('versatile', { types: types });
      else ok = generateApplicant(types[Math.floor(Math.random() * types.length)]);
    }
    if (typeof toast === 'function') toast(ok ? t('emp.searchFound', { n: label }) : t('emp.searchNone', { n: label }));
    return false;
  });
}

// ---------- Vendeurs ----------
// Plus il y a de vendeurs, plus ca vend vite. Seul, un vendeur est tres lent.
function sellerRate(emp) {
  var n = 0;
  G.employees.forEach(function(e) { if (hasJob(e,'seller') && empWorking(e)) n++; });
  return 0.08 * (1 + 0.25 * Math.max(0, n - 1)) * empPower(emp, 'seller') * (1 + machineBonus('sellers') / 100);
}

// Le stock reserve aux commandes quand un maitre d'hotel peut les livrer
function orderReserved(recId) {
  var n = 0;
  (G.orders || []).forEach(function(o) {
    o.items.forEach(function(it) { if (it.recId === recId) n += it.qty; });
  });
  return n;
}

// Combien ce vendeur a le droit de vendre de ce gateau
function sellerAllowance(emp, rec) {
  var stock = G.cakes[rec.id] || 0;
  if (empCount('maitre') > 0) stock -= orderReserved(rec.id);
  var pct = emp.sellPct === undefined ? 100 : emp.sellPct;
  if (pct < 100) {
    var made = G.stats.cakesMadeById[rec.id] || 0;
    stock = Math.min(stock, made * pct / 100 - (G.sellerSold[rec.id] || 0));
  }
  return Math.max(0, Math.floor(stock));
}

function sellOneBatchAuto(emp, dtSec) {
  var units = sellerRate(emp) * dtSec;
  if (G.eventSellerBonus) units *= (1 + G.eventSellerBonus);
  if (G.eventEmpBonus) units *= (1 + G.eventEmpBonus);
  emp.sellFrac = (emp.sellFrac || 0) + units;
  var whole = Math.floor(emp.sellFrac);
  if (whole < 1) return;
  // Le vendeur vend d'abord ce qui rapporte le plus
  var best = null;
  for (var r = 0; r < REC.length; r++) {
    if (sellerAllowance(emp, REC[r]) >= 1 && (!best || REC[r].val > best.val)) best = REC[r];
  }
  if (!best) { emp.sellFrac = Math.min(emp.sellFrac, 1); return; }
  emp.sellFrac -= whole;
  var qty = Math.min(sellerAllowance(emp, best), whole);
  var earned = batchPrice(best, qty);
  G.cakes[best.id] -= qty;
  G.sellerSold[best.id] = (G.sellerSold[best.id] || 0) + qty;
  G.money += earned;
  G.totalEarned += earned;
  G.stats.totalSold += qty;
  addSoldStat(best.id, qty);
  addCakeEarning(best.id, earned);
  G.soldCount[best.id] = (G.soldCount[best.id] || 0) + qty;
  G.totalAllSold += qty;
  addXP(Math.floor(earned * 0.15));
}

// ---------- Le moral ----------
// Il descend tout seul, moins vite si l'equipe est grande. Les managers le remontent.
function moraleDecay() {
  return 0.03 / (1 + 0.25 * Math.max(0, G.employees.length - 1)) * (1 - machineBonus('morale') / 100);
}

function managerBoost() {
  var b = 0;
  G.employees.forEach(function(e) { if (hasJob(e,'manager') && empWorking(e)) b += 0.1 * empLevelMult(e, 'manager'); });
  return b;
}

var MORALE_QUIT = 10;

function tickEmployees(dtSec) {
  var decay = moraleDecay(), boost = managerBoost();
  for (var i = G.employees.length - 1; i >= 0; i--) {
    var emp = G.employees[i];
    var salary = getEmpSalary(emp) * dtSec;
    if (G.money >= salary) {
      G.money -= salary;
      G.stats.totalSalaryPaid += salary;
      emp.unpaidTime = 0;
    } else {
      emp.unpaidTime = (emp.unpaidTime || 0) + dtSec;
    }
    var change = -decay + (hasJob(emp,'manager') ? 0 : boost);
    if (emp.unpaidTime > 5) change = -2;
    emp.morale = Math.max(0, Math.min(maxMorale(emp), emp.morale + change * dtSec));
    // Trop bas : il demissionne
    if (emp.morale < MORALE_QUIT) {
      if (typeof toast === 'function') toast(t('emp.event.quit', { n: emp.name }));
      G.employees.splice(i, 1);
      continue;
    }
    if (emp.morale < 20 || emp.unpaidTime > 30) {
      if (emp.status !== 'striking' && typeof toast === 'function') toast(t('emp.event.strike', { n: emp.name }));
      emp.status = 'striking';
    } else if (emp.morale < 40) {
      emp.status = 'poor';
    } else {
      emp.status = 'working';
    }
    if (hasJob(emp,'seller') && empWorking(emp)) sellOneBatchAuto(emp, dtSec);
  }
}

// ---------- Le chef patissier : il prepare tout seul ----------
function chefQueue(emp) {
  var mode = emp.chefMode || 'all';
  if (mode === 'orders') return ordersToBake();
  var list = (emp.chefList || []).map(findRec).filter(function(r) { return r && recUnlocked(r); });
  if (mode === 'only') return list;
  var rest = REC.filter(function(r) { return recUnlocked(r) && list.indexOf(r) < 0; });
  rest.sort(function(a, b) { return (batchPrice(b, b.qty) - recipeCost(b)) - (batchPrice(a, a.qty) - recipeCost(a)); });
  return mode === 'priority' ? list.concat(rest) : list.concat(rest).sort(function(a, b) { return (batchPrice(b, b.qty) - recipeCost(b)) - (batchPrice(a, a.qty) - recipeCost(a)); });
}

// Ce qui manque pour livrer les commandes en cours
function ordersToBake() {
  var need = {};
  (G.orders || []).forEach(function(o) { o.items.forEach(function(it) { need[it.recId] = (need[it.recId] || 0) + it.qty; }); });
  return REC.filter(function(r) { return need[r.id] && recUnlocked(r) && (G.cakes[r.id] || 0) < need[r.id]; });
}

function tickChefs(dtSec) {
  G.employees.forEach(function(emp) {
    if (!hasJob(emp,'chef') || !empWorking(emp)) return;
    emp.chefCd = (emp.chefCd || 0) + dtSec * empPower(emp, 'chef');
    if (emp.chefCd < 6 || activeCrafts() >= ovenSlots()) return;
    // Il ne prepare rien tant que tu es sous un certain montant
    if (emp.chefMinMoney > 0 && G.money < emp.chefMinMoney) { emp.chefCd = 6; return; }
    var nowMs = Date.now();
    if (emp.chefBudget > 0 && (!emp.chefWinT || nowMs - emp.chefWinT > 3600000)) { emp.chefWinT = nowMs; emp.chefSpent = 0; }
    var queue = chefQueue(emp);
    for (var i = 0; i < queue.length; i++) {
      var price = recipeCost(queue[i]);
      // Une limite d'argent par heure pour les ingredients qu'il utilise
      if (emp.chefBudget > 0 && (emp.chefSpent || 0) + price > emp.chefBudget) continue;
      if (startCraft(queue[i])) { emp.chefCd = 0; if (emp.chefBudget > 0) emp.chefSpent = (emp.chefSpent || 0) + price; return; }
    }
    emp.chefCd = 6;
  });
}

// ---------- L'intendant : il achete ce qui manque, avec un delai de livraison ----------
function buyerTarget() {
  var favs = REC.filter(function(r) { return recUnlocked(r) && G.favRecipes[r.id]; });
  var pool = favs.length ? favs : REC.filter(recUnlocked).slice(-3);
  for (var i = pool.length - 1; i >= 0; i--) {
    var ok = true;
    for (var k in pool[i].req) { if (!ingUnlocked(findIng(k))) ok = false; }
    if (ok && missingCost(pool[i]) > 0) return pool[i];
  }
  return null;
}

function tickBuyers(dtSec) {
  G.employees.forEach(function(emp) {
    if (!hasJob(emp,'buyer') || !empWorking(emp)) return;
    emp.buyCd = (emp.buyCd || 0) + dtSec * empPower(emp, 'buyer');
    if (emp.buyCd < 20) return;
    var rec = buyerTarget();
    if (!rec) { emp.buyCd = 20; return; }
    var cost = missingCost(rec);
    if (G.money < cost * 2) { emp.buyCd = 20; return; }
    var items = {};
    for (var k in rec.req) {
      var miss = rec.req[k] - (G.ing[k] || 0);
      if (miss > 0) items[k] = miss;
    }
    emp.buyCd = 0;
    G.money -= cost;
    G.stats.totalIngredientCost += cost;
    G.deliveries.push({ items: items, at: Date.now() + 30000 });
  });
  var now = Date.now();
  G.deliveries = G.deliveries.filter(function(d) {
    if (d.at > now) return true;
    for (var k in d.items) G.ing[k] = (G.ing[k] || 0) + d.items[k];
    if (typeof toast === 'function') toast(t('emp.buyerDone'));
    return false;
  });
}

// ---------- Le manager : il embauche tout seul ----------
// Le cueilleur va sur l'ingredient qui est le moins produit
function bestCollectorTarget() {
  var best = 'farine', low = Infinity;
  ING.forEach(function(ing) {
    if (!ingUnlocked(ing)) return;
    var rate = autoRate(ing.id);
    if (rate < low) { low = rate; best = ing.id; }
  });
  return best;
}

function tickManagers(dtSec) {
  G.employees.forEach(function(emp) {
    if (!hasJob(emp,'manager') || !empWorking(emp) || !emp.mgrAuto) return;
    emp.mgrCd = (emp.mgrCd || 0) + dtSec;
    if (emp.mgrCd < 5) return;
    emp.mgrCd = 0;
    var min = emp.mgrMin === undefined ? 50 : emp.mgrMin;
    var jobs = emp.mgrJobs && emp.mgrJobs.length ? emp.mgrJobs : null;
    var lmin = emp.mgrLvlMin || 1, lmax = emp.mgrLvlMax || EMP_GOLD_LVL;
    var prio = emp.mgrPrio || [];
    var picks = G.applicants.filter(function(a) {
      if (a.skill < min || G.money < a.hireCost * 5) return false;
      var lv = a.type === 'novice' ? 1 : (a.level || 1);
      if (lv < lmin || lv > lmax) return false;
      if (!jobs) return true;
      if (jobs.indexOf(a.type) >= 0) return true;
      return a.type === 'versatile' && (a.jobs || []).some(function(j) { return jobs.indexOf(j.type) >= 0; });
    });
    function rank(a) { var i = prio.indexOf(a.type); return i < 0 ? 999 : i; }
    // Les metiers prioritaires d'abord, puis le moins cher
    picks.sort(function(a, b) { return rank(a) - rank(b) || a.hireCost - b.hireCost; });
    if (picks.length > 0 && acceptApplicant(picks[0].id) && typeof toast === 'function') toast(t('emp.mgrHired', { n: emp.name }));
  });
}

// ============ LOYER ET DETTE ============
function getRentPerHour() {
  var rent = G.maxSpace * RENT_CONFIG.basePricePerM2PerHour * (1 - machineBonus('rent') / 100);
  if (G.eventRentBonus) rent *= (1 + G.eventRentBonus);
  return rent;
}

// background : patisserie ou tu n'es pas, sa dette ne prend pas d'interets
function tickRent(dtSec, background) {
  var rentDue = getRentPerHour() / 3600 * dtSec;
  if (G.money >= rentDue) {
    G.money -= rentDue;
    G.stats.totalRentPaid += rentDue;
    G.rentLate = 0;
  } else {
    // Tu paies ce que tu peux. Le proprietaire attend un peu avant de compter une dette.
    var rest = rentDue - Math.max(0, G.money);
    G.stats.totalRentPaid += Math.max(0, G.money);
    G.money = 0;
    G.rentLate = (G.rentLate || 0) + dtSec;
    if (G.rentLate > RENT_CONFIG.graceSec) G.rentDebt += rest;
  }
  if (G.rentDebt > 0) {
    if (!background) G.rentDebt += G.rentDebt * RENT_CONFIG.debtInterestPerSec * dtSec;
    // La dette se rembourse des qu'il y a de l'argent
    payDebt();
  }
}

// Rembourse ce qui est possible. Renvoie la somme payee.
function payDebt() {
  if (G.rentDebt <= 0 || G.money <= 0) return 0;
  var paid = Math.min(G.money, G.rentDebt);
  G.money -= paid;
  G.rentDebt -= paid;
  if (G.rentDebt < 0.01) G.rentDebt = 0;
  return paid;
}

// ============ LA BANQUE ============
function findLoanOffer(amount) {
  for (var i = 0; i < LOANS.length; i++) { if (LOANS[i].amount === amount) return LOANS[i]; }
  return null;
}

function hasLoan(amount) {
  return G.loans.some(function(l) { return l.amount === amount; });
}

function loanUnlocked(offer) { return G.level >= offer.minLvl; }

function anyLoanAvailable() {
  return LOANS.some(function(o) { return loanUnlocked(o) && !hasLoan(o.amount); });
}

function totalLoanDue() {
  var s = 0;
  G.loans.forEach(function(l) { s += l.remaining; });
  return s;
}

function loanPerSec() {
  var s = 0;
  G.loans.forEach(function(l) { s += l.perSec; });
  return s;
}

function takeLoan(amount) {
  var offer = findLoanOffer(amount);
  if (!offer || !G.bankUnlocked || !loanUnlocked(offer) || hasLoan(amount)) return false;
  var total = amount * (1 + offer.rate);
  G.loans.push({ id: G.nextLoanId++, amount: amount, total: total, remaining: total, perSec: total / (offer.minutes * 60), late: false });
  G.money += amount; // Ce n'est pas un gain : le total gagne ne bouge pas
  G.stats.loansTaken++;
  return true;
}

function loanPaid(loan, paid) {
  // La part des interets dans ce qui vient d'etre paye
  G.stats.totalInterestPaid += paid * (1 - loan.amount / loan.total);
}

function closeLoan(loan) {
  G.loans = G.loans.filter(function(l) { return l !== loan; });
  G.stats.loansRepaid++;
}

// Rembourser en avance : tu ne paies plus les interets qui restaient a venir.
// Juste apres l'emprunt, tu rends exactement ce que tu as recu.
function loanPayoff(loan) {
  return loan.remaining * loan.amount / loan.total;
}

function repayLoan(id) {
  var loan = null;
  G.loans.forEach(function(l) { if (l.id === id) loan = l; });
  if (!loan) return false;
  var cost = loanPayoff(loan);
  if (G.money < cost) return false;
  G.money -= cost;
  closeLoan(loan);
  return true;
}

// Prelevement automatique. Sans argent, le pret est en retard et coute plus cher.
function tickLoans(dtSec) {
  G.loans.slice().forEach(function(loan) {
    var due = Math.min(loan.remaining, loan.perSec * dtSec);
    var paid = Math.min(due, Math.max(0, G.money));
    G.money -= paid;
    loan.remaining -= paid;
    loanPaid(loan, paid);
    loan.late = paid < due - 1e-9;
    if (loan.late) loan.remaining += loan.remaining * RENT_CONFIG.debtInterestPerSec * dtSec;
    if (loan.remaining < 0.01) {
      closeLoan(loan);
      if (typeof toast === 'function') toast(t('bank.finished', { v: fmtMoney(loan.amount) }));
    }
  });
}

// ============ RENOMMER ============
// 'ok', 'same' (meme nom, rien a payer), 'invalid' ou 'money'
function renameBakery(name) {
  var val = String(name || '').trim();
  if (val.length === 0 || val.length > 30) return 'invalid';
  if (val === G.bakeryName) return 'same';
  if (G.money < RENAME_COST) return 'money';
  G.money -= RENAME_COST;
  G.stats.totalInvested += RENAME_COST;
  if (G.bakeries[G.currentBakeryIndex]) G.bakeries[G.currentBakeryIndex].name = val;
  G.bakeryName = val;
  return 'ok';
}

// ============ HISTORIQUE (pour les graphiques) ============
function totalSpent() {
  var st = G.stats;
  return st.totalIngredientCost + st.totalRentPaid + st.totalSalaryPaid + st.totalInvested + st.totalInterestPaid;
}

function recordHistory() {
  var h = G.history;
  if (G.playTimeMs < h.next) return;
  h.t.push(G.playTimeMs);
  h.money.push(G.money);
  h.earned.push(G.totalEarned);
  h.spent.push(totalSpent());
  h.level.push(G.level);
  h.sold.push(G.stats.totalSold);
  h.next = G.playTimeMs + h.step;
  // Trop de points : on en garde un sur deux, et on espace les suivants
  if (h.t.length > HISTORY_MAX) {
    ['t', 'money', 'earned', 'spent', 'level', 'sold'].forEach(function(k) {
      h[k] = h[k].filter(function(v, i) { return i % 2 === 0; });
    });
    h.step *= 2;
  }
}

// ============ ANTI AUTO-CLICKER ============
var antiClick = {
  clicks: [],
  cooldownUntil: 0,
  cooldownCount: 0,
  captchaActive: false,
  captchaAnswer: 0,
  captchaQuestion: '',
  wrongAnswers: 0,
  banUntil: 0,
};

function checkAntiClick() {
  var now = Date.now();
  if (now < antiClick.banUntil) return 'banned';
  if (antiClick.captchaActive) return 'captcha';
  if (now < antiClick.cooldownUntil) return 'cooldown';
  antiClick.clicks.push(now);
  antiClick.clicks = antiClick.clicks.filter(function(c) { return now - c < 1000; });
  if (antiClick.clicks.length > ANTI_CLICK.maxClicksPerSec) {
    antiClick.cooldownUntil = now + ANTI_CLICK.cooldownMs;
    antiClick.cooldownCount++;
    antiClick.clicks = [];
    if (antiClick.cooldownCount >= ANTI_CLICK.captchaAfter) {
      antiClick.captchaActive = true;
      var a = Math.floor(Math.random() * 20) + 1;
      var b = Math.floor(Math.random() * 20) + 1;
      antiClick.captchaAnswer = a + b;
      antiClick.captchaQuestion = a + ' + ' + b + ' = ?';
      return 'captcha';
    }
    return 'cooldown';
  }
  return 'ok';
}

function getBanRemaining() {
  return Math.max(0, Math.ceil((antiClick.banUntil - Date.now()) / 1000));
}

// Renvoie 'ok', 'wrong' ou 'banned' (trop de mauvaises reponses)
function solveCaptcha(answer) {
  if (parseInt(answer, 10) === antiClick.captchaAnswer) {
    antiClick.captchaActive = false;
    antiClick.cooldownCount = 0;
    antiClick.cooldownUntil = 0;
    antiClick.wrongAnswers = 0;
    return 'ok';
  }
  antiClick.wrongAnswers++;
  if (antiClick.wrongAnswers >= ANTI_CLICK.wrongBeforeBan) {
    antiClick.captchaActive = false;
    antiClick.cooldownCount = 0;
    antiClick.wrongAnswers = 0;
    antiClick.banUntil = Date.now() + ANTI_CLICK.banSeconds * 1000;
    return 'banned';
  }
  return 'wrong';
}

// ============ DEBLOQUER ============
// Arrive au bon niveau, il faut cliquer sur l'ingredient ou la recette, puis attendre.
function unlockDelay(item) { return Math.max(1, Math.round(Math.min(300, 5 + item.unlockLvl * 1.5) * (1 - machineBonus('unlock') / 100))); }

function isUnlocked(kind, item) {
  return item.unlockLvl <= 1 || !!G.unlocks.done[kind + ':' + item.id];
}
function ingUnlocked(ing) { return isUnlocked('ing', ing); }
function recUnlocked(rec) { return isUnlocked('rec', rec); }

function unlockPending(kind, item) { return G.unlocks.pending[kind + ':' + item.id] || 0; }

function startUnlock(kind, item) {
  if (isUnlocked(kind, item) || G.level < item.unlockLvl || unlockPending(kind, item)) return false;
  G.unlocks.pending[kind + ':' + item.id] = Date.now() + unlockDelay(item) * 1000;
  return true;
}

function tickUnlocks() {
  var now = Date.now(), p = G.unlocks.pending;
  Object.keys(p).forEach(function(key) {
    if (p[key] > now) return;
    delete p[key];
    G.unlocks.done[key] = true;
    if (typeof toast === 'function') {
      var parts = key.split(':');
      toast(t('unlock.done', { n: parts[0] === 'ing' ? t('i.' + parts[1]) : recShortName(findRec(parts[1])) }));
    }
  });
}

function unlockEverything() {
  ING.forEach(function(i) { G.unlocks.done['ing:' + i.id] = true; });
  REC.forEach(function(r) { G.unlocks.done['rec:' + r.id] = true; });
  G.unlocks.pending = {};
}

// ============ VENTE ============
// Vendre prend un petit moment : le stock part tout de suite, l'argent arrive apres.
function queueSale(items) {
  var total = 0, units = 0, list = [];
  items.forEach(function(x) {
    var qty = Math.min(x.qty, G.cakes[x.rec.id] || 0);
    if (qty <= 0) return;
    var earned = batchPrice(x.rec, qty);
    G.cakes[x.rec.id] -= qty;
    G.soldCount[x.rec.id] = (G.soldCount[x.rec.id] || 0) + qty;
    G.totalAllSold += qty;
    total += earned;
    units += qty;
    list.push({ id: x.rec.id, qty: qty, earned: earned });
  });
  if (units <= 0) return 0;
  var now = Date.now();
  G.sales.push({ list: list, total: total, units: units, start: now, at: now + SALE_DELAY_MS });
  return total;
}

function tickSales() {
  var now = Date.now(), done = 0;
  G.sales = G.sales.filter(function(s) {
    // L'argent arrive petit a petit, a mesure que la barre avance
    var frac = s.at <= now ? 1 : Math.max(0, Math.min(1, (now - s.start) / Math.max(1, s.at - s.start)));
    var part = s.total * (frac - (s.pf || 0));
    if (part > 0) { G.money += part; G.totalEarned += part; s.pf = frac; }
    if (s.at > now) return true;
    G.stats.totalSold += s.units;
    s.list.forEach(function(x) { addCakeEarning(x.id, x.earned); addSoldStat(x.id, x.qty || 0); });
    addXP(Math.floor(s.total * 0.3));
    done += s.total;
    return false;
  });
  return done;
}

function doSell(rec, qty) {
  var actual = Math.min(qty, G.cakes[rec.id]);
  if (!actual) return 0;
  var earned = batchPrice(rec, actual);
  addCakeEarning(rec.id, earned);
  G.cakes[rec.id] -= actual;
  G.money += earned;
  G.totalEarned += earned;
  G.stats.totalSold += actual;
  addSoldStat(rec.id, actual);
  G.soldCount[rec.id] = (G.soldCount[rec.id] || 0) + actual;
  G.totalAllSold += actual;
  addXP(Math.floor(earned * 0.3));
  return earned;
}

function doSellAll() {
  var total = 0;
  for (var i = 0; i < REC.length; i++) {
    if (G.cakes[REC[i].id] > 0) total += doSell(REC[i], G.cakes[REC[i].id]);
  }
  return total;
}

function stockValue() {
  var total = 0;
  for (var i = 0; i < REC.length; i++) {
    if (G.cakes[REC[i].id] > 0) total += batchPrice(REC[i], G.cakes[REC[i].id]);
  }
  return total;
}

// ============ ANNIVERSAIRE ============
function todayKey() {
  var d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

function isBirthdayToday() {
  if (!G.birthday) return false;
  var now = new Date();
  return now.getDate() === G.birthday.day && (now.getMonth() + 1) === G.birthday.month;
}

// x2 pendant 24 h, une fois par an. Mettre la date du jour ne donne rien cette annee-la.
function tryBirthdayBoost() {
  if (!isBirthdayToday()) return false;
  var year = new Date().getFullYear();
  if (G.birthdayBoostYear === year || G.birthdaySetOn === todayKey()) return false;
  G.birthdayBoostYear = year;
  G.birthdayBoostUntil = Date.now() + 24 * 3600 * 1000;
  return true;
}

function setBirthday(day, month) {
  G.birthday = { day: day, month: month };
  G.birthdaySetOn = todayKey();
}

// Corriger sa date coute un peu d'argent
function fixBirthday(day, month) {
  if (!G.birthday || G.money < BIRTHDAY_FIX_COST) return false;
  if (G.birthday.day === day && G.birthday.month === month) return false;
  G.money -= BIRTHDAY_FIX_COST;
  setBirthday(day, month);
  return true;
}

// ============ THEMES ============
function currentSeason() {
  var now = new Date();
  var md = (now.getMonth() + 1) * 100 + now.getDate();
  if (md >= 320 && md < 621) return 'spring';
  if (md >= 621 && md < 922) return 'summer';
  if (md >= 922 && md < 1221) return 'fall';
  return 'winter';
}

function findTheme(id) {
  for (var i = 0; i < THEME_LIST.length; i++) { if (THEME_LIST[i].id === id) return THEME_LIST[i]; }
  return null;
}

// null si le theme est disponible, sinon la raison du verrou
function themeLockReason(theme) {
  if (G.creative) return null; // En mode creatif, tous les themes sont la
  if (G.unlockedThemes && G.unlockedThemes[theme.id]) return null;
  if (theme.month) return new Date().getMonth() + 1 === theme.month ? null : 'month';
  if (theme.secret) return 'secret';
  if (theme.sold) {
    if (((G.stats.soldById || {})[theme.sold.rec] || 0) < theme.sold.n) return 'sold';
    G.unlockedThemes[theme.id] = true;
    return null;
  }
  if (theme.level) {
    if (G.level < theme.level) return 'level';
    G.unlockedThemes[theme.id] = true; // Le niveau max le debloque pour toujours
    return null;
  }
  if (theme.season) return currentSeason() === theme.id ? null : 'season';
  if (theme.birthday) {
    if (!G.birthday) return 'noBirthday';
    return isBirthdayToday() ? null : 'birthday';
  }
  return null;
}

// Le theme a l'ecran : celui de cette patisserie s'il y en a un, sinon celui de tout le jeu
function activeThemeId() {
  if (typeof ui !== 'undefined' && ui.seeTheme && findTheme(ui.seeTheme)) return ui.seeTheme; // /theme see : juste pour voir
  var own = G.bakeryTheme && findTheme(G.bakeryTheme);
  if (own && !themeLockReason(own)) return own.id;
  var main = G.settings && findTheme(G.settings.theme);
  if (main && !themeLockReason(main)) return main.id;
  return 'light';
}

// La saison est passee : son theme se bloque. Renvoie true si quelque chose a change.
function enforceThemeLocks() {
  var changed = false;
  var own = G.bakeryTheme && findTheme(G.bakeryTheme);
  if (G.bakeryTheme && (!own || themeLockReason(own))) { G.bakeryTheme = null; changed = true; }
  var main = findTheme(G.settings.theme);
  if (!main || themeLockReason(main)) { G.settings.theme = 'light'; changed = true; }
  return changed;
}

// ============ EVENEMENTS ============
function clearEventEffects() {
  G.activeEvent = null;
  G.eventPriceBonus = 0;
  G.eventIngBonus = 0;
  G.eventRentBonus = 0;
  G.eventXpBonus = 0;
  G.eventSellerBonus = 0;
  G.eventAutoBonus = 0;
  G.eventClickBonus = 0;
  G.eventEmpBonus = 0;
}

function pickEvent() {
  var total = 0;
  EVENT_TYPES.forEach(function(e) { total += e.chance; });
  var r = Math.random() * total;
  for (var i = 0; i < EVENT_TYPES.length; i++) {
    r -= EVENT_TYPES[i].chance;
    if (r <= 0) return EVENT_TYPES[i];
  }
  return EVENT_TYPES[0];
}

function tickEvents() {
  var now = Date.now();
  if (G.activeEvent && now >= G.eventEndTime) clearEventEffects();
  // Un evenement toutes les 4 minutes environ
  if (!G.activeEvent && now - G.lastEventTime > 60000 && Math.random() < 0.004) {
    var evt = pickEvent();
    G.activeEvent = evt.id;
    G.eventEndTime = now + evt.duration * 1000;
    G.lastEventTime = now;
    G.stats.eventsSeen = (G.stats.eventsSeen || 0) + 1;
    applyEvent(evt.id);
    if (typeof toast === 'function') toast(t('event.' + evt.id, { t: evt.duration }));
  }
  tickFocusEvent(now);
  tickDisaster();
  // Petit incident, environ toutes les 8 minutes
  if (Math.random() < 0.002) {
    var inv = INVISIBLE_EVENTS[Math.floor(Math.random() * INVISIBLE_EVENTS.length)];
    var have = G.ing[inv.ing] || 0;
    if (have >= 1 && findIng(inv.ing).unlockLvl <= G.level) {
      var lost = Math.min(have, inv.loss[0] + Math.floor(Math.random() * (inv.loss[1] - inv.loss[0] + 1)));
      G.ing[inv.ing] -= lost;
      if (typeof toast === 'function') toast(t('inv.' + inv.id, { v: Math.floor(lost) }));
    }
  }
}

// Un gros malheur : tres rare, a partir du niveau 30
function tickDisaster(force) {
  if (!force && (G.level < DISASTER_LVL || G.creative || Math.random() > 1 / DISASTER_EVERY_SEC)) return null;
  var d = force ? findDisaster(force) : DISASTERS[Math.floor(Math.random() * DISASTERS.length)];
  var part = d.lose[0] + Math.random() * (d.lose[1] - d.lose[0]);
  var msg = null;
  if (d.id === 'theft' && G.money > 0) {
    var stolen = G.money * part;
    G.money -= stolen;
    msg = t('disaster.theft', { v: fmtMoney(stolen) });
  } else if (d.id === 'freezer') {
    var pieces = 0;
    REC.forEach(function(r) { var n = Math.floor((G.cakes[r.id] || 0) * part); if (n > 0) { G.cakes[r.id] -= n; pieces += n; } });
    if (pieces > 0) msg = t('disaster.freezer', { v: fmt(pieces) });
  } else if (d.id === 'flood') {
    var most = null;
    ING.forEach(function(i) { if ((G.ing[i.id] || 0) > 10 && (!most || G.ing[i.id] > G.ing[most.id])) most = i; });
    if (most) {
      var gone = G.ing[most.id] * part;
      G.ing[most.id] -= gone;
      msg = t('disaster.flood', { n: t('i.' + most.id), v: fmt(gone) });
    }
  } else if (d.id === 'fire') {
    var any = false;
    ING.forEach(function(i) { if ((G.ing[i.id] || 0) > 0) { G.ing[i.id] *= 1 - part; any = true; } });
    if (any) msg = t('disaster.fire', { v: Math.round(part * 100) });
  }
  if (msg && typeof toast === 'function') toast(msg);
  return msg;
}
function findDisaster(id) { for (var i = 0; i < DISASTERS.length; i++) { if (DISASTERS[i].id === id) return DISASTERS[i]; } return DISASTERS[0]; }

// Un evenement sur un seul ingredient ou une seule recette, environ toutes les 5 minutes
function tickFocusEvent(now) {
  var f = G.focusEvent;
  if (f && now >= f.until) { G.focusEvent = null; f = null; }
  if (f || now - (G.lastFocusAt || 0) < 120000 || Math.random() > 0.003) return;
  var type = FOCUS_EVENTS[Math.floor(Math.random() * FOCUS_EVENTS.length)];
  var pool = type.kind === 'ing' ? ING.filter(ingUnlocked) : REC.filter(recUnlocked);
  if (pool.length === 0) return;
  var item = pool[Math.floor(Math.random() * pool.length)];
  var dur = FOCUS_EVENT_SEC[0] + Math.floor(Math.random() * (FOCUS_EVENT_SEC[1] - FOCUS_EVENT_SEC[0] + 1));
  G.focusEvent = { type: type.id, kind: type.kind, id: item.id, mult: type.mult, until: now + dur * 1000 };
  G.lastFocusAt = now;
  if (typeof toast === 'function') toast(focusEventText(G.focusEvent, dur));
}

function focusEventText(f, sec) {
  var name = f.kind === 'ing' ? t('i.' + f.id) : recShortName(findRec(f.id));
  return t('fevent.' + f.type, { n: name, v: Math.round(Math.abs(f.mult - 1) * 100), t: Math.max(0, Math.ceil(sec)) });
}

function applyEvent(evtId) {
  switch (evtId) {
    case 'price_surge': G.eventPriceBonus = 0.30; break;
    case 'price_drop': G.eventPriceBonus = -0.20; break;
    case 'inflation': G.eventIngBonus = 0.25; break;
    case 'deflation': G.eventIngBonus = -0.15; break;
    case 'rush_hour': G.eventSellerBonus = 1.0; break;
    case 'ingredient_sale': G.eventIngBonus = -0.30; break;
    case 'tax_break': G.eventRentBonus = -0.50; break;
    case 'strike_wave':
      G.employees.forEach(function(e) { e.morale = Math.max(1, e.morale - 20); });
      break;
    case 'lucky_day': G.eventXpBonus = 2.0; break;
    case 'inspection': G.eventPriceBonus = -0.10; break;
    case 'customer_wave': G.eventPriceBonus = 1.0; break;
    case 'power_outage': G.eventAutoBonus = -1.0; break;
    case 'sugar_rush': G.eventClickBonus = 2.0; break;
    case 'food_critic': G.eventPriceBonus = 0.50; break;
    case 'supplier_strike': G.eventIngBonus = 0.50; break;
    case 'festival':
      G.eventPriceBonus = 0.15;
      G.eventClickBonus = 0.15;
      G.eventXpBonus = 0.15;
      break;
    case 'bad_review': G.eventPriceBonus = -0.25; break;
    case 'health_check':
      for (var c in G.cakes) {
        if (G.cakes[c] > 0) G.cakes[c] = Math.max(0, G.cakes[c] - Math.ceil(G.cakes[c] * (0.05 + Math.random() * 0.1)));
      }
      break;
    case 'tv_feature': G.eventXpBonus = 4.0; break;
    case 'apprentice_day': G.eventEmpBonus = 1.0; break;
  }
}

// ============ FAILLITE ============
// Ce que tu pourrais recuperer en revendant tout
function liquidationValue() {
  var v = stockValue();
  for (var i = 0; i < ING.length; i++) v += (G.ing[ING[i].id] || 0) * getIngredientResellPrice(ING[i]);
  return v;
}

function checkGameOver() {
  if (G.money > 0 || G.rentDebt <= 0) return false;
  if (G.crafting.length > 0 || G.sales.length > 0 || totalAuto() > 0 || buildingsOwned() > 0) return false;
  // Tant que la banque peut encore preter, rien n'est perdu
  if (!G.bankUnlocked || anyLoanAvailable()) return false;
  if (liquidationValue() >= G.rentDebt) return false;
  G.gameOver = true;
  G.wentBankrupt = true;
  return true;
}

// ============ ABSENCE ============
function calcOfflineProgress(elapsedSec) {
  var dt = Math.min(elapsedSec, 5 * 3600);
  var totalIng = 0, totalMoney = 0, totalRent = 0, totalSalaries = 0, unpaid = false;
  // Production
  for (var i = 0; i < ING.length; i++) {
    var r = autoRate(ING[i].id);
    if (r > 0) { G.ing[ING[i].id] += r * dt; totalIng += r * dt; }
  }
  totalIng += advanceBuildings(dt);
  // Ventes des vendeurs
  var capacity = 0;
  G.employees.forEach(function(e) {
    if (hasJob(e,'seller') && empWorking(e)) capacity += sellerRate(e) * dt;
  });
  var byValue = REC.slice().sort(function(a, b) { return b.val - a.val; });
  for (var s = 0; s < byValue.length && capacity >= 1; s++) {
    var rec = byValue[s];
    var qty = Math.min(G.cakes[rec.id] || 0, Math.floor(capacity));
    if (qty > 0) {
      var earned = batchPrice(rec, qty);
      G.cakes[rec.id] -= qty;
      G.money += earned;
      G.totalEarned += earned;
      G.stats.totalSold += qty;
      addSoldStat(rec.id, qty);
      addCakeEarning(rec.id, earned);
      totalMoney += earned;
      capacity -= qty;
    }
  }
  // Loyer : tu paies ce que tu peux. Pas de dette creee pendant que tu dors.
  totalRent = Math.min(G.money, getRentPerHour() / 3600 * dt);
  G.money -= totalRent;
  G.stats.totalRentPaid += totalRent;
  // Salaires : pareil, mais un employe impaye perd le moral
  var due = totalSalary() * dt;
  totalSalaries = Math.min(G.money, due);
  G.money -= totalSalaries;
  G.stats.totalSalaryPaid += totalSalaries;
  if (due > totalSalaries + 0.01) {
    unpaid = true;
    G.employees.forEach(function(e) { e.morale = Math.max(1, e.morale - 30); });
  }
  // Prets : le prelevement continue, sans retard pendant que tu dors
  var totalLoans = 0;
  G.loans.slice().forEach(function(loan) {
    var paid = Math.min(loan.remaining, loan.perSec * dt, G.money);
    G.money -= paid;
    loan.remaining -= paid;
    loanPaid(loan, paid);
    totalLoans += paid;
    if (loan.remaining < 0.01) closeLoan(loan);
  });
  recoverDemand(dt);
  return { ingredients: totalIng, money: totalMoney, rent: totalRent, salaries: totalSalaries, loans: totalLoans, seconds: dt, unpaid: unpaid };
}

// ============ PLUSIEURS PATISSERIES ============
// La patisserie actuelle a toujours sa place dans la liste : rien n'est ecrase.
function ensureBakeryList() {
  var cur = G.bakeries[G.currentBakeryIndex];
  if (!cur || cur.name !== G.bakeryName) {
    G.bakeries.unshift({ name: G.bakeryName, state: null, cost: 0 });
    G.currentBakeryIndex = 0;
  }
}

function bakeryOpenCost() {
  return 10000 * Math.pow(3, Math.max(0, G.bakeries.length - 1));
}

// free : la console ouvre une patisserie sans la payer. name : facultatif.
function openNewBakery(free, name) {
  ensureBakeryList();
  var cost = free ? 0 : bakeryOpenCost();
  if (G.money < cost) return false;
  G.money -= cost;
  G.stats.totalInvested += cost;
  G.secondBakery = true;
  saveBakeryState();
  var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
  var names = BAKERY_NAMES_LANG[lang] || BAKERY_NAMES_LANG.fr;
  var newName = name || names[Math.floor(Math.random() * names.length)];
  var newState = createFreshState();
  newState.bakeryName = newName;
  newState.level = G.level;
  newState.xp = G.xp;
  newState.money = 50;
  newState.unlocks = { done: JSON.parse(JSON.stringify(G.unlocks.done)), pending: {} };
  newState.tutorialDone = true;
  newState.introDone = true;
  G.bakeries.push({ name: newName, state: newState, cost: cost });
  if (typeof toast === 'function') toast(t('bakery.opened', { n: newName }));
  return true;
}

function saveBakeryState() {
  if (G.bakeries.length === 0 || G.currentBakeryIndex >= G.bakeries.length) return;
  var saveState = JSON.parse(JSON.stringify(G));
  delete saveState.bakeries;
  G.bakeries[G.currentBakeryIndex].state = saveState;
  G.bakeries[G.currentBakeryIndex].name = G.bakeryName;
}

function switchToBakery(index) {
  ensureBakeryList();
  if (index < 0 || index >= G.bakeries.length || index === G.currentBakeryIndex) return false;
  saveBakeryState();
  var bakeries = G.bakeries;
  var target = migrateSave(JSON.parse(JSON.stringify(bakeries[index].state)));
  target.bakeries = bakeries;
  target.currentBakeryIndex = index;
  // Ce qui appartient au joueur, et pas a une patisserie
  ['settings','birthday','birthdaySetOn','birthdayBoostYear','birthdayBoostUntil','achievements','tutorialDone','tutorialStep',
   'introDone','cheatUnlocked','bobClicks','bobSad','bobGold','bobGoldClicks','bobChoke','bobPokes','logoClicks','unlockedThemes','favRecipes','lvl1000Shown','wentBankrupt',
   'secondBakery','bankUnlocked','loans','nextLoanId','cmdUsage','challenge','nextChallengeAt','sugarFed','explained','creative'].forEach(function(k) {
    target[k] = G[k];
  });
  target.paused = false;
  Object.assign(G, target);
  return true;
}

// Vendre une patisserie : tu recuperes sa valeur, mais ses stats partent avec elle.
function sellBakery(index) {
  ensureBakeryList();
  if (index < 0 || index >= G.bakeries.length || G.bakeries.length <= 1) return false;
  var value = getBakeryValueForIndex(index);
  if (index === G.currentBakeryIndex) switchToBakery(index === 0 ? 1 : 0);
  G.money += value;
  G.totalEarned += value;
  G.bakeries.splice(index, 1);
  if (G.currentBakeryIndex > index) G.currentBakeryIndex--;
  if (typeof toast === 'function') toast(t('bakery.sold', { v: fmtMoney(value) }));
  return true;
}

// Ce que vaut une patisserie, ligne par ligne
function bakeryValueParts(index) {
  var b = G.bakeries[index];
  var s = b && (index === G.currentBakeryIndex ? G : b.state);
  if (!s) return null;
  var cash = Math.max(0, s.money || 0), stock = 0, ingredients = 0, equipment = 0;
  REC.forEach(function(r) { stock += (s.cakes[r.id] || 0) * r.val * 0.5; });
  ING.forEach(function(i) { ingredients += (s.ing[i.id] || 0) * i.cost * (i.resellRate || 0.5); });
  BUILDINGS.forEach(function(bld) {
    var q = (s.buildings[bld.id] || { qty: 0 }).qty;
    equipment += bld.baseCost * (Math.pow(1.15, Math.min(q, 2000)) - 1) / 0.15;
  });
  for (var o = OVEN_CONFIG.start; o < (s.ovens || OVEN_CONFIG.start); o++) equipment += OVEN_CONFIG.baseCost * Math.pow(OVEN_CONFIG.growth, o - OVEN_CONFIG.start);
  for (var u = 0; u < (s.spaceBought || 0) && u < SPACE_UPG.length; u++) equipment += SPACE_UPG[u].cost;
  equipment *= 0.5;
  var reputation = (s.totalEarned || 0) * 0.1 + (b.cost || 0) * 0.5;
  var debt = s.rentDebt || 0;
  var total = Math.max(0, Math.min(MONEY_CAP, cash + stock + ingredients + equipment + reputation - debt));
  return { cash: cash, stock: stock, ingredients: ingredients, equipment: equipment, reputation: reputation, debt: debt, total: total };
}

function getBakeryValueForIndex(index) {
  var p = bakeryValueParts(index);
  return p ? Math.floor(p.total) : 0;
}

// Supprime une patisserie sans la revendre. La derniere ne peut pas partir.
function deleteBakery(index) {
  ensureBakeryList();
  if (index < 0 || index >= G.bakeries.length || G.bakeries.length <= 1) return false;
  if (index === G.currentBakeryIndex) switchToBakery(index === 0 ? 1 : 0);
  G.bakeries.splice(index, 1);
  if (G.currentBakeryIndex > index) G.currentBakeryIndex--;
  return true;
}

// ============ TOUTES LES PATISSERIES ============
function bakeryStates() {
  ensureBakeryList();
  return G.bakeries.map(function(b, i) {
    var current = i === G.currentBakeryIndex;
    return { name: current ? G.bakeryName : b.name, current: current, state: current ? G : b.state };
  }).filter(function(x) { return !!x.state; });
}

// Une fausse partie qui additionne tout : pour les totaux et les succes
function allBakeriesState() {
  var all = { machines: {}, money: 0, totalEarned: 0, playTimeMs: 0, maxSpace: 0, ovens: 0, level: 0, rebirth: 0, employees: [], ing: {}, buildings: {}, stats: { cakesMadeById: {} },
    bakeries: G.bakeries, bakeryName: G.bakeryName, bobClicks: G.bobClicks, logoClicks: G.logoClicks, wentBankrupt: G.wentBankrupt };
  bakeryStates().forEach(function(x) {
    var s = x.state;
    all.money += s.money || 0;
    for (var mid in (s.machines || {})) all.machines[mid] = Math.max(all.machines[mid] || 0, s.machines[mid]);
    all.totalEarned += s.totalEarned || 0;
    all.playTimeMs = Math.max(all.playTimeMs, s.playTimeMs || 0);
    all.maxSpace += s.maxSpace || 0;
    all.ovens += s.ovens || 0;
    all.level = Math.max(all.level, s.level || 0);
    all.employees = all.employees.concat(s.employees || []);
    for (var k in s.stats) {
      if (typeof s.stats[k] === 'number') all.stats[k] = (all.stats[k] || 0) + s.stats[k];
    }
    for (var r in s.stats.cakesMadeById) all.stats.cakesMadeById[r] = (all.stats.cakesMadeById[r] || 0) + s.stats.cakesMadeById[r];
    for (var i in s.ing) all.ing[i] = (all.ing[i] || 0) + s.ing[i];
    for (var b in s.buildings) {
      all.buildings[b] = all.buildings[b] || { qty: 0 };
      all.buildings[b].qty += s.buildings[b].qty;
    }
  });
  return all;
}

// ============ GAINS PAR GATEAU ============
function addCakeEarning(recId, amount) {
  G.stats.earnedById[recId] = (G.stats.earnedById[recId] || 0) + amount;
}

// Le gateau qui rapporte le plus a une patisserie
function bestCakeOf(state) {
  var best = null, top = 0, map = (state.stats && state.stats.earnedById) || {};
  for (var k in map) { if (map[k] > top && findRec(k)) { top = map[k]; best = k; } }
  return best ? { rec: findRec(best), earned: top } : null;
}

// ============ MACHINES ============
// Chaque patisserie a les siennes
function machineLevel(id) { return (G.machines && G.machines[id]) || 0; }
var ROMAN = ['I', 'II', 'III', 'IV', 'V'];
function machName(m) { return m.family ? t('machf.' + m.family) + ' ' + ROMAN[m.tier] : t('mach.' + m.id); }
function machDesc(m) { return m.family ? t('mach.eff.' + m.effect, { v: m.step }) : t('mach.' + m.id + '.d', { v: m.step }); }
function findMachine(id) { for (var i = 0; i < MACHINES.length; i++) { if (MACHINES[i].id === id) return MACHINES[i]; } return null; }
function machineCost(m) { return m.cost * Math.pow(m.growth, machineLevel(m.id)); }

// La somme de ce que donnent les machines pour un effet
function machineBonus(effect) {
  var b = 0;
  for (var i = 0; i < MACHINES.length; i++) {
    if (MACHINES[i].effect !== effect || isBroken('m', MACHINES[i].id)) continue; // En panne, elle ne sert a rien
    b += ((G.machines && G.machines[MACHINES[i].id]) || 0) * MACHINES[i].step;
  }
  return MACHINE_CAPS[effect] ? Math.min(MACHINE_CAPS[effect], b) : b;
}

// ============ PANNES ============
function isBroken(kind, id) { return !!(G.broken && G.broken[kind + ':' + id]); }
function repairingLeft(kind, id) {
  var b = G.broken && G.broken[kind + ':' + id];
  return b && b.until ? Math.max(0, (b.until - Date.now()) / 1000) : 0;
}

function repairCost(kind, id) {
  if (kind === 'm') {
    var m = findMachine(id);
    return m ? m.cost * Math.pow(m.growth, Math.max(0, machineLevel(id) - 1)) * BREAKDOWN.machineRepairCost : 0;
  }
  var bld = findBld(id);
  return bld ? buildingCost(bld) * BREAKDOWN.buildingRepairCost : 0;
}

function repairItem(kind, id) {
  var b = G.broken && G.broken[kind + ':' + id];
  if (!b || b.until) return false;
  var cost = repairCost(kind, id);
  if (G.money < cost) return false;
  G.money -= cost;
  b.until = Date.now() + (kind === 'm' ? BREAKDOWN.machineRepairSec : BREAKDOWN.buildingRepairSec) * 1000;
  return true;
}

function tickBreakdowns(dtSec) {
  if (!G.broken) G.broken = {};
  var now = Date.now();
  Object.keys(G.broken).forEach(function(key) {
    var b = G.broken[key];
    if (!b.until || now < b.until) return;
    delete G.broken[key];
    var kind = key.charAt(0), id = key.slice(2);
    if (kind === 'm') syncOvens();
    if (typeof toast === 'function') toast(t('broke.repaired', { n: kind === 'm' ? machName(findMachine(id)) : t('b.' + id) }));
  });
  if (G.creative) return;
  var rarer = 1 - machineBonus('repair') / 100;
  var machines = MACHINES.filter(function(m) { return machineLevel(m.id) > 0 && !isBroken('m', m.id); });
  if (machines.length && Math.random() < dtSec / BREAKDOWN.machineEverySec * rarer) {
    var m = machines[Math.floor(Math.random() * machines.length)];
    G.broken['m:' + m.id] = { since: now, until: 0 };
    syncOvens();
    if (typeof toast === 'function') toast(t('broke.machine', { n: machName(m) }));
  }
  var blds = BUILDINGS.filter(function(b) { return (G.buildings[b.id] || { qty: 0 }).qty > 0 && !isBroken('b', b.id); });
  if (blds.length && Math.random() < dtSec / BREAKDOWN.buildingEverySec * rarer) {
    var bld = blds[Math.floor(Math.random() * blds.length)];
    G.broken['b:' + bld.id] = { since: now, until: 0 };
    if (typeof toast === 'function') toast(t('broke.building', { n: t('b.' + bld.id) }));
  }
}

function syncOvens() { G.ovens = OVEN_CONFIG.start + machineBonus('ovens'); }

function buyMachine(id) {
  var m = findMachine(id);
  if (!m || G.level < m.lvl || machineLevel(id) >= m.max) return false;
  var cost = machineCost(m);
  if (G.money < cost) return false;
  G.money -= cost;
  G.stats.totalInvested += cost;
  G.machines[id] = machineLevel(id) + 1;
  syncOvens();
  return true;
}

// ============ COMMANDES ============
var ORDER_NAMES = ['Léa', 'Hugo', 'Chloé', 'Nora', 'Karim', 'Sofia', 'Tom', 'Zoé', 'Yanis', 'Emma', 'Noah', 'Lucia', 'Diego', 'Mia', 'Sam', 'Ana'];

function orderMaxItems() { return G.level >= 150 ? 4 : G.level >= 80 ? 3 : 2; }

function orderPrime(n) {
  return 1 + (ORDER_CONFIG.prime[n] - 1) * (1 + machineBonus('prime') / 100);
}

function createOrder() {
  var pool = REC.filter(recUnlocked);
  if (pool.length === 0) return null;
  // Surtout les recettes recentes
  pool = pool.slice(-14);
  var n = 1 + Math.floor(Math.random() * Math.min(orderMaxItems(), pool.length));
  var items = [], base = 0, used = {};
  while (items.length < n) {
    var rec = pool[Math.floor(Math.random() * pool.length)];
    if (used[rec.id]) continue;
    used[rec.id] = true;
    var qty = Math.max(1, Math.ceil(rec.qty * (0.5 + Math.random())));
    items.push({ recId: rec.id, qty: qty });
    base += rec.val * qty * sellValueMult();
  }
  var duration = 150 + n * 60;
  return { id: G.nextOrderId++, name: ORDER_NAMES[Math.floor(Math.random() * ORDER_NAMES.length)], items: items, base: base, reward: base * orderPrime(n), duration: duration, expiresAt: Date.now() + duration * 1000 };
}

function orderReady(o) {
  return o.items.every(function(it) { return (G.cakes[it.recId] || 0) >= it.qty; });
}

function fulfillOrder(id) {
  for (var i = 0; i < G.orders.length; i++) {
    var o = G.orders[i];
    if (o.id !== id) continue;
    if (!orderReady(o)) return 0;
    var units = 0;
    o.items.forEach(function(it) {
      G.cakes[it.recId] -= it.qty;
      units += it.qty;
      addSoldStat(it.recId, it.qty);
      addCakeEarning(it.recId, o.reward * it.qty / Math.max(1, o.items.reduce(function(a, x) { return a + x.qty; }, 0)));
    });
    G.money += o.reward;
    G.totalEarned += o.reward;
    G.stats.totalSold += units;
    G.stats.ordersDone++;
    addXP(Math.floor(o.reward * 0.3));
    G.orders.splice(i, 1);
    return o.reward;
  }
  return 0;
}

// Plus tu avances, plus les clients commandent
// Du niveau 30 au niveau 1000 : de 4 a 10 commandes en meme temps, et d'une toutes les 40 s a une toutes les 10 s
function orderProgress() { return Math.min(1, Math.max(0, (G.level - ORDER_CONFIG.lvl) / (1000 - ORDER_CONFIG.lvl))); }
function orderMaxOpen() { return ORDER_CONFIG.maxOpen + Math.floor(6 * orderProgress()); }
function orderEverySec() { return ORDER_CONFIG.everySec * Math.pow(10 / ORDER_CONFIG.everySec, orderProgress()); }

function tickOrders(dtSec) {
  if (G.level < ORDER_CONFIG.lvl) return;
  var now = Date.now();
  G.orders = G.orders.filter(function(o) { return o.expiresAt > now; });
  if (!G.nextOrderAt) G.nextOrderAt = now;
  if (now >= G.nextOrderAt && G.orders.length < orderMaxOpen()) {
    var created = createOrder();
    if (created) {
      G.orders.push(created);
      if (typeof toast === 'function') toast(t('order.new'));
    }
    G.nextOrderAt = now + orderEverySec() * 1000;
  }
  // Le maitre d'hotel livre tout seul ce qui est pret
  G.employees.forEach(function(emp) {
    if (!hasJob(emp,'maitre') || !empWorking(emp)) return;
    emp.orderCd = (emp.orderCd || 0) + dtSec * empPower(emp, 'maitre');
    if (emp.orderCd < ORDER_CONFIG.butlerSec) return;
    var todo = null;
    G.orders.forEach(function(o) { if (!todo && orderReady(o)) todo = o; });
    if (!todo) { emp.orderCd = ORDER_CONFIG.butlerSec; return; }
    emp.orderCd = 0;
    var got = fulfillOrder(todo.id);
    if (got > 0 && typeof toast === 'function') toast(t('order.butlerDone', { n: emp.name, v: fmtMoney(got) }));
  });
}

// ============ TOUTES LES PATISSERIES TRAVAILLENT ============
var bgTick = false;

// Fait tourner du code comme si on etait dans une autre patisserie
function withBakery(state, fn) {
  var main = G;
  bgTick = true;
  G = state;
  try { fn(); } finally { G = main; bgTick = false; }
}

// Tout le travail d'une patisserie, qu'on y soit ou non
function tickBakeryWork(dtSec, isCurrent) {
  tickAutoCollect(dtSec);
  advanceBuildings(dtSec);
  tickEmployees(dtSec);
  tickRent(dtSec, !isCurrent);
  recoverDemand(dtSec);
  tickCrafting();
  tickUnlocks();
  tickOrders(dtSec);
  tickChefs(dtSec);
  tickBuyers(dtSec);
  tickManagers(dtSec);
  tickSearches();
  tickSales();
}

function tickBackgroundBakeries(dtSec) {
  G.bakeries.forEach(function(b, i) {
    if (i === G.currentBakeryIndex || !b.state) return;
    withBakery(b.state, function() {
      G.playTimeMs += dtSec * 1000;
      tickBakeryWork(dtSec);
      capMoney();
      recordHistory();
    });
  });
}

function shiftAllBakeries(ms) {
  G.bakeries.forEach(function(b, i) {
    if (i === G.currentBakeryIndex || !b.state) return;
    withBakery(b.state, function() { shiftGameTimers(ms); });
  });
}

// Pendant ton absence aussi, toutes tournent
function offlineBackgroundBakeries(elapsedSec) {
  var money = 0;
  G.bakeries.forEach(function(b, i) {
    if (i === G.currentBakeryIndex || !b.state) return;
    withBakery(b.state, function() {
      money += calcOfflineProgress(elapsedSec).money;
      tickCrafting();
    });
  });
  return money;
}

// ============ STOCK MAX (/max) ============
// Plus un ingredient est rare, moins /max t'en donne
function maxStockFor(ing) {
  var sorted = ING.slice().sort(function(a, b) { return a.cost - b.cost; });
  var rank = sorted.indexOf(ing) / (sorted.length - 1);
  return Math.pow(10, Math.round(24 - rank * 21));
}

// ============ LES CONSEILS DE BOB ============
// Ce que Bob remarque. urgent : il le dit tout de suite.
function bobAdvice() {
  var list = [], now = Date.now();
  (G.orders || []).forEach(function(o) {
    var left = (o.expiresAt - now) / 1000;
    if (left <= 45) list.push({ key: 'order' + o.id, kind: 'order', urgent: true, n: o.name, t: left, tab: 'orders' });
  });
  G.employees.forEach(function(e) {
    if (e.status === 'striking') list.push({ key: 'strike' + e.id, kind: 'empStrike', urgent: true, n: e.name, tab: 'emp' });
    else if (e.morale < 30 || (e.unpaidTime || 0) > 15) list.push({ key: 'soon' + e.id, kind: 'empSoon', urgent: true, n: e.name, tab: 'emp' });
  });
  var full = G.maxSpace > 0 ? (usedSpace() + reservedSpace()) / maxSpaceNow() : 0;
  if (full >= 0.9) list.push({ key: 'space', kind: 'space', v: Math.min(100, Math.round(full * 100)), tab: 'sell' });
  var worst = null, worstPct = -25;
  REC.forEach(function(r) {
    if ((G.cakes[r.id] || 0) > 0 && inflationPct(r) <= worstPct) { worst = r; worstPct = inflationPct(r); }
  });
  if (worst) list.push({ key: 'slow' + worst.id, kind: 'slow', rec: worst, v: 100 + worstPct, tab: 'sell' });
  var h = G.history;
  var rent = getRentPerHour();
  if (h && h.t.length >= 4 && rent > 0) {
    var a = Math.max(0, h.t.length - 21), z = h.t.length - 1;
    var hours = Math.max(1e-6, (h.t[z] - h.t[a]) / 3600000);
    var income = Math.max(0, h.earned[z] - h.earned[a]) / hours;
    if (income <= 0) list.push({ key: 'rent', kind: 'rentNone' });
    else if (rent > income * 0.4) list.push({ key: 'rent', kind: 'rent', v: Math.round(rent / income * 100) });
  }
  return list;
}

// ============ LE TRANSPORTEUR ============
function bakeryStateAt(index) {
  ensureBakeryList();
  var b = G.bakeries[index];
  return b ? (index === G.currentBakeryIndex ? G : b.state) : null;
}

// Renvoie la somme vraiment transportee. Avec un transporteur, elle part sur la route.
function transferMoney(from, to, amount, emp) {
  var a = bakeryStateAt(from), b = bakeryStateAt(to);
  if (!a || !b || from === to) return 0;
  var moved = Math.min(Math.max(0, amount), Math.max(0, a.money));
  a.money -= moved;
  if (emp) { if (moved > 0) shipOut(emp, b, 'money', null, moved); }
  else b.money += moved;
  return moved;
}

// Un chargement prend la route : il arrive plus tard, en retard, ou jamais
function shipOut(emp, b, kind, id, qty) {
  var r = Math.random(), now = Date.now();
  var sec = CARRIER_TRIP.minSec + Math.pow(Math.random(), 2) * (CARRIER_TRIP.maxSec - CARRIER_TRIP.minSec);
  var ship = { kind: kind, id: id, qty: qty, by: emp.name, eta: now + sec * 1000, late: 0, lost: false };
  if (r < CARRIER_TRIP.accidentChance) ship.lost = true;
  else if (r < CARRIER_TRIP.accidentChance + CARRIER_TRIP.lateChance) ship.late = CARRIER_TRIP.lateSec[0] + Math.random() * (CARRIER_TRIP.lateSec[1] - CARRIER_TRIP.lateSec[0]);
  if (!b.incoming) b.incoming = [];
  b.incoming.push(ship);
  emp.tripUntil = ship.eta + ship.late * 1000;
  return ship;
}

function shipLabel(ship) {
  if (ship.kind === 'money') return fmtMoney(ship.qty);
  if (ship.kind === 'cake') return fmt(ship.qty) + ' ' + recShortName(findRec(ship.id));
  return fmt(ship.qty) + ' ' + t('i.' + ship.id);
}

// Les chargements arrivent. Les gateaux attendent qu'il y ait la place.
function tickShipments(s) {
  if (!s.incoming || s.incoming.length === 0) return;
  var now = Date.now();
  s.incoming = s.incoming.filter(function(ship) {
    if (now < ship.eta) return true;
    if (ship.late > 0) {
      ship.eta += ship.late * 1000;
      ship.late = 0;
      if (typeof toast === 'function') toast(t('carry.late', { n: ship.by }));
      return true;
    }
    if (ship.lost) {
      if (typeof toast === 'function') toast(t('carry.accident', { n: ship.by, v: shipLabel(ship) }));
      return false;
    }
    if (ship.kind === 'money') { s.money += ship.qty; return false; }
    if (ship.kind === 'ing') { s.ing[ship.id] = (s.ing[ship.id] || 0) + ship.qty; return false; }
    var rec = findRec(ship.id);
    if (!rec) return false;
    var fit = Math.min(ship.qty, Math.floor((s.maxSpace - stateUsedSpace(s)) / rec.space));
    if (fit > 0) { s.cakes[ship.id] = (s.cakes[ship.id] || 0) + fit; ship.qty -= fit; }
    return ship.qty > 0;
  });
}

function shipmentsOnRoad() {
  var n = 0;
  for (var i = 0; i < G.bakeries.length; i++) {
    var s = bakeryStateAt(i);
    if (s && s.incoming) n += s.incoming.length;
  }
  return n;
}

function stateUsedSpace(s) {
  var u = 0;
  REC.forEach(function(r) { u += (s.cakes[r.id] || 0) * r.space; });
  return u;
}

// kind : 'cake' ou 'ing'. Les gateaux doivent avoir la place en arrivant.
function transferStock(from, to, kind, id, qty, emp) {
  var a = bakeryStateAt(from), b = bakeryStateAt(to);
  if (!a || !b || from === to) return 0;
  var box = kind === 'cake' ? 'cakes' : 'ing';
  var moved = Math.min(Math.max(0, qty), a[box][id] || 0);
  if (kind === 'cake') {
    moved = Math.floor(moved);
    var rec = findRec(id);
    if (!rec) return 0;
    moved = Math.min(moved, Math.floor((b.maxSpace - stateUsedSpace(b)) / rec.space));
  }
  if (moved <= 0) return 0;
  a[box][id] -= moved;
  if (emp) shipOut(emp, b, kind, id, moved);
  else b[box][id] = (b[box][id] || 0) + moved;
  return moved;
}

// ============ LE DEFI DE BOB ============
var CHALLENGE_REWARD = 0.05;

function globalMoney() {
  var m = 0;
  bakeryStates().forEach(function(x) { m += Math.max(0, x.state.money || 0); });
  return m;
}

function scheduleNextChallenge() {
  G.nextChallengeAt = Date.now() + (2 + Math.random() * 3) * 86400000;
}

function challengeValue(type) {
  var a = allBakeriesState();
  if (type === 'earned') return a.totalEarned;
  if (type === 'made') return a.stats.totalCakesMade;
  if (type === 'buildings') return a.stats.totalBuildingsBought;
  if (type === 'orders') return a.stats.ordersDone;
  return a.stats.totalSold;
}

function createChallenge() {
  var types = ['sold', 'made', 'earned', 'buildings'];
  if (G.level >= ORDER_CONFIG.lvl) types.push('orders');
  var type = types[Math.floor(Math.random() * types.length)];
  var lvl = G.level;
  var target = type === 'earned' ? Math.ceil(revenueAt(lvl) * 15) : type === 'buildings' ? Math.ceil(5 + lvl / 10) : type === 'orders' ? 3 : Math.ceil(30 + lvl * 2);
  G.challenge = { type: type, target: target, start: challengeValue(type), expiresAt: Date.now() + 86400000, accepted: false };
  return G.challenge;
}

function challengeProgress() {
  if (!G.challenge) return 0;
  return Math.max(0, challengeValue(G.challenge.type) - G.challenge.start);
}

// Verse la recompense : 5 % de tout ton argent, toutes patisseries confondues
function completeChallenge() {
  var reward = globalMoney() * CHALLENGE_REWARD;
  G.money += reward;
  G.challenge = null;
  scheduleNextChallenge();
  return reward;
}

// Une patisserie garde son identifiant meme si la liste change
function bakeryUid(b) {
  if (!b.uid) b.uid = 'b' + Date.now().toString(36) + Math.floor(Math.random() * 1e6);
  return b.uid;
}

// Ou va ce transporteur : la patisserie choisie, sinon la premiere autre
function carrierTarget(emp, fromIndex) {
  var fallback = -1;
  for (var i = 0; i < G.bakeries.length; i++) {
    if (i === fromIndex) continue;
    if (fallback < 0) fallback = i;
    if (emp.carryTo && bakeryUid(G.bakeries[i]) === emp.carryTo) return i;
  }
  return fallback;
}

// Un voyage. Il laisse toujours de quoi payer une minute de salaires et de loyer.
function carrierTrip(emp, from, to) {
  var s = bakeryStateAt(from);
  var what = emp.carryWhat || 'money';
  var asked = emp.carryQty > 0 ? emp.carryQty : Infinity;
  var power = empLevelMult(emp, 'carrier');
  if (what.indexOf('cake:') === 0) return transferStock(from, to, 'cake', what.slice(5), Math.min(asked, 10 * power), emp);
  if (what.indexOf('ing:') === 0) return transferStock(from, to, 'ing', what.slice(4), Math.min(asked, 100 * power), emp);
  if (what === 'cakes') {
    var best = null;
    REC.forEach(function(r) { if ((s.cakes[r.id] || 0) >= 1 && (!best || r.val > best.val)) best = r; });
    return best ? transferStock(from, to, 'cake', best.id, Math.min(asked, 10 * power), emp) : 0;
  }
  if (what === 'ings') {
    var most = null;
    ING.forEach(function(i) { if ((s.ing[i.id] || 0) >= 1 && (!most || s.ing[i.id] > s.ing[most.id])) most = i; });
    return most ? transferStock(from, to, 'ing', most.id, Math.min(asked, 100 * power), emp) : 0;
  }
  var reserve = s.maxSpace * RENT_CONFIG.basePricePerM2PerHour / 60;
  s.employees.forEach(function(e) { reserve += getEmpSalary(e) * 60; });
  return transferMoney(from, to, Math.min(asked, Math.max(0, s.money - reserve), revenueAt(s.level) * 3 * power), emp);
}

// Tous les transporteurs de toutes les patisseries
function tickCarriers(dtSec) {
  for (var j = 0; j < G.bakeries.length; j++) { var st = bakeryStateAt(j); if (st) tickShipments(st); }
  if (G.bakeries.length < 2) return;
  for (var i = 0; i < G.bakeries.length; i++) {
    var s = bakeryStateAt(i);
    if (!s) continue;
    s.employees.forEach(function(emp) {
      if (!hasJob(emp,'carrier') || !empWorking(emp)) return;
      if (emp.tripUntil && Date.now() < emp.tripUntil) return; // Il est sur la route
      emp.carryCd = (emp.carryCd || 0) + dtSec * empPower(emp, 'carrier');
      if (emp.carryCd < CARRIER_TRIP_SEC) return;
      var to = carrierTarget(emp, i);
      if (to < 0) return;
      emp.carryCd = 0;
      carrierTrip(emp, i, to);
    });
  }
}
var CARRIER_TRIP_SEC = 20;

// ============ MODE CREATIF ============
function tickCreative() {
  if (!G.creative) return;
  G.money = MONEY_CAP;
  G.rentDebt = 0;
  ING.forEach(function(i) { G.ing[i.id] = 1e300; });
  REC.forEach(function(r) { G.cakes[r.id] = 1e300; });
  unlockEverything();
}

// /money infinite et /INGREDIENT infinite : la valeur reste au maximum
function tickInfinite() {
  if (G.infiniteMoney) { G.money = MONEY_CAP; G.rentDebt = 0; }
  if (G.infiniteIng) {
    for (var id in G.infiniteIng) { if (G.infiniteIng[id]) G.ing[id] = 1e300; }
  }
}
