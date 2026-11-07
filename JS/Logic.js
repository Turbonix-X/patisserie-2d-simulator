/* ============================================
   PATISSERIE 2D SIMULATOR - GAME LOGIC
   Clics, production, preparation, vente, employes,
   loyer, rebirth, evenements, faillite, absence
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
function rebirthBonus() {
  var bonus = 0;
  for (var i = 0; i < REBIRTHS.length; i++) {
    if (G.rebirth > i) bonus += REBIRTHS[i].bonus;
  }
  return 1 + bonus;
}

function spaceMultiplier() {
  var mult = 1;
  for (var i = 0; i < REBIRTHS.length; i++) {
    if (G.rebirth > i) mult *= REBIRTHS[i].spaceMulti;
  }
  return mult;
}

function birthdayBonus() {
  return (G.birthdayBoostUntil && Date.now() < G.birthdayBoostUntil) ? 2 : 1;
}

function empTraining(emp) { return !!emp.trainingUntil && emp.trainingUntil > Date.now(); }

// Un employe en pause ne fait rien, mais son salaire continue de tomber
function empWorking(emp) { return (emp.status === 'working' || emp.status === 'poor') && !empTraining(emp) && !emp.paused; }

// Chaque niveau double ce que sait faire un employe
function empLevelMult(emp) { return Math.pow(2, Math.min(EMP_MAX_LVL, emp.level || 1) - 1); }

function empPower(emp) {
  return empLevelMult(emp) * empSkillMult(emp) * (emp.status === 'poor' ? 0.5 : 1);
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
  var m = rebirthBonus() * birthdayBonus();
  if (G.eventClickBonus) m *= (1 + G.eventClickBonus);
  return Math.round(m * 100) / 100;
}

// Seuls les cueilleurs produisent a la seconde. Les batiments livrent d'un coup.
function autoRate(ingId) {
  if (G.eventAutoBonus && G.eventAutoBonus <= -1) return 0;
  var r = 0;
  for (var e = 0; e < G.employees.length; e++) {
    var emp = G.employees[e];
    if (emp.type === 'collector' && emp.assignedIng === ingId && empWorking(emp)) r += empPower(emp);
  }
  if (G.eventAutoBonus) r *= (1 + G.eventAutoBonus);
  return r * rebirthBonus() * birthdayBonus();
}

function totalAuto() {
  var s = 0;
  for (var i = 0; i < ING.length; i++) s += autoRate(ING[i].id);
  return s;
}

// ============ PRIX DE VENTE ============
function sellValueMult() {
  return rebirthBonus() * birthdayBonus() * achievementBonus() * (1 + machineBonus('price') / 100);
}

// Offre et demande : plus tu vends un gateau, plus son prix baisse.
// La demande revient toute seule avec le temps.
function demandMult(rec, extraSold) {
  var mySold = (G.soldCount[rec.id] || 0) + (extraSold || 0);
  var otherSold = Math.max(0, G.totalAllSold - (G.soldCount[rec.id] || 0));
  var mult = 1 - INFLATION.sellDecay * (1 - machineBonus('decay') / 100) * mySold + INFLATION.otherBoost * otherSold;
  return Math.max(INFLATION.minMult, Math.min(INFLATION.maxMult, mult));
}

function eventPriceMult() { return G.eventPriceBonus ? 1 + G.eventPriceBonus : 1; }

function inflatedPrice(rec) {
  return Math.round(rec.val * sellValueMult() * demandMult(rec) * eventPriceMult() * 100) / 100;
}

// Prix total d'un lot : le prix baisse au fil de la vente, meme en gros
function batchPrice(rec, qty) {
  if (qty <= 0) return 0;
  var samples = Math.min(qty, 8);
  var sum = 0;
  for (var i = 0; i < samples; i++) sum += demandMult(rec, (i + 0.5) * qty / samples);
  return rec.val * sellValueMult() * eventPriceMult() * (sum / samples) * qty;
}

function inflationPct(rec) {
  return Math.round((demandMult(rec) * eventPriceMult() - 1) * 100);
}

function recoverDemand(dtSec) {
  var keep = Math.pow(1 - INFLATION.recoveryPerSec, dtSec);
  for (var k in G.soldCount) { G.soldCount[k] *= keep; }
  G.totalAllSold *= keep;
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

// Place deja promise aux fournees en cours ou en attente
function reservedSpace() {
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
  return usedSpace() + reservedSpace() + batchSpace(rec) <= maxSpaceNow();
}

function nextSpaceUpgrade() {
  if (G.spaceBought >= SPACE_UPG.length) return null;
  var su = SPACE_UPG[G.spaceBought];
  return { add: Math.round(su.add * spaceMultiplier()), cost: su.cost, lvlReq: su.lvlReq };
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

// Une raison lisible quand on ne peut pas preparer
function craftBlockReason(rec) {
  if (!canMake(rec)) return 'ing';
  if (!canFitRecipe(rec)) return 'space';
  if (G.crafting.length >= OVEN_CONFIG.maxQueue) return 'queue';
  return null;
}

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
  G.employees.forEach(function(e) { if (e.type === 'baker' && empWorking(e)) bakers += 0.05 * empLevelMult(e); });
  if (G.creative) bakers = 1;
  return Math.max(0.05, Math.max(0.2, 1 - bakers) * (1 - Math.min(80, machineBonus('prep')) / 100));
}

function getCraftDuration(rec) {
  return Math.max(0.5, rec.prepTime * craftSpeedMult());
}

function startCraft(rec) {
  if (craftBlockReason(rec)) return false;
  for (var k in rec.req) G.ing[k] -= rec.req[k];
  G.crafting.push({ recId: rec.id, startTime: null, duration: getCraftDuration(rec) * 1000 });
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
  var finished = [];
  var remaining = [];
  for (var i = 0; i < G.crafting.length; i++) {
    var c = G.crafting[i];
    if (c.startTime !== null && now - c.startTime >= c.duration) finished.push(c);
    else remaining.push(c);
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
    var rec = findRec(done.recId);
    if (!rec) continue;
    if (usedSpace() + batchSpace(rec) + reservedSpace() <= maxSpaceNow()) {
      G.cakes[rec.id] += rec.qty;
      G.stats.totalCakesMade += rec.qty;
      G.stats.cakesMadeById[rec.id] = (G.stats.cakesMadeById[rec.id] || 0) + rec.qty;
      addXP(rec.xp);
      if (typeof toast === 'function') toast(rec.e + ' ' + t('rec.ready', { q: rec.qty, n: recShortName(rec) }));
    } else {
      // Plus de place : les ingredients sont rendus
      for (var k in rec.req) G.ing[k] = (G.ing[k] || 0) + rec.req[k];
      if (typeof toast === 'function') toast(t('space.refund'));
    }
  }
  startQueuedCrafts();
  return finished.length > 0;
}

function recShortName(rec) {
  return t('r.' + rec.id).replace(/ x\d+$/, '');
}

// ============ INGREDIENTS ============
function getIngredientCost(ing) {
  var c = ing.cost * (1 - machineBonus('ingCost') / 100);
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
  return qty * bld.baseRate * BLD_CYCLE_SEC * (1 + machineBonus('bld') / 100) * rebirthBonus() * birthdayBonus();
}

// Fait avancer les batiments de dtSec. Renvoie ce qui a ete livre.
function advanceBuildings(dtSec) {
  var total = 0;
  BUILDINGS.forEach(function(bld) {
    if ((G.buildings[bld.id] || { qty: 0 }).qty <= 0) return;
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

function newEmployee(typeId, name, skill) {
  return {
    id: G.nextEmployeeId++,
    name: name,
    type: typeId,
    morale: 70 + Math.floor(Math.random() * 20),
    status: 'working',
    skill: skill,
    level: 1,
    assignedIng: typeId === 'collector' ? bestCollectorTarget() : null,
    unpaidTime: 0,
  };
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
  G.employees.push(newEmployee(typeId, applicant ? applicant.name : getEmpName(), skill));
  G.stats.totalEmployeesHired++;
  startQueuedCrafts();
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
function trainDuration(emp) { return 30 * (emp.level || 1); }

function trainEmployee(empId) {
  var emp = findEmp(empId);
  if (!emp || (emp.level || 1) >= EMP_MAX_LVL || empTraining(emp)) return false;
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

// Euros par seconde. Mieux forme, mieux paye.
function getEmpSalary(emp) {
  var empType = findEmpType(emp.type);
  if (!empType) return 0;
  return empType.baseSalary * (1 + 0.5 * ((emp.level || 1) - 1));
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
  if (typeId === 'collector') emp.assignedIng = bestCollectorTarget();
  return true;
}

// ---------- Candidatures et recherche ----------
// Peu de monde vient au debut. Plus ton niveau monte, plus ta boutique attire.
function applicantChance() { return Math.min(0.6, 0.05 + G.level / 150); }
function searchChance() { return Math.min(0.95, 0.25 + G.level / 150); }

function generateApplicant(typeId) {
  if (G.applicants.length >= 5) return false;
  var open = EMP_TYPES.filter(empTypeOpen);
  if (open.length === 0) return false;
  var empType = typeId ? findEmpType(typeId) : open[Math.floor(Math.random() * open.length)];
  var skill = Math.max(1, Math.min(100, baseSkill() + Math.floor(Math.random() * 30) - 15));
  G.applicants.push({
    id: Date.now() + Math.floor(Math.random() * 1000),
    name: getEmpName(),
    type: empType.id,
    skill: skill,
    hireCost: Math.floor(empType.hireCost * (0.5 + skill * 0.01)),
    expiresAt: Date.now() + 180000,
  });
  if (typeof toast === 'function') toast(t('emp.applicant'));
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
  G.searches.forEach(function(x) { if (x.type === typeId) s = x; });
  return s;
}

// Chercher un metier precis prend du temps, et ca ne marche pas toujours
function startSearch(typeId) {
  var et = findEmpType(typeId);
  if (!et || !empTypeOpen(et) || searchFor(typeId)) return false;
  G.searches.push({ type: typeId, doneAt: Date.now() + (20 + Math.random() * 40) * 1000 });
  return true;
}

function tickSearches() {
  var now = Date.now();
  G.searches = G.searches.filter(function(job) {
    if (job.doneAt > now) return true;
    if (Math.random() < searchChance() && generateApplicant(job.type)) {
      if (typeof toast === 'function') toast(t('emp.searchFound', { n: t('emp.' + job.type) }));
    } else if (typeof toast === 'function') {
      toast(t('emp.searchNone', { n: t('emp.' + job.type) }));
    }
    return false;
  });
}

// ---------- Vendeurs ----------
// Plus il y a de vendeurs, plus ca vend vite. Seul, un vendeur est tres lent.
function sellerRate(emp) {
  var n = 0;
  G.employees.forEach(function(e) { if (e.type === 'seller' && empWorking(e)) n++; });
  return 0.08 * (1 + 0.25 * Math.max(0, n - 1)) * empPower(emp) * (1 + machineBonus('sellers') / 100);
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
  addCakeEarning(best.id, earned);
  G.soldCount[best.id] = (G.soldCount[best.id] || 0) + qty;
  G.totalAllSold += qty;
  addXP(Math.floor(earned * 0.15));
}

// ---------- Le moral ----------
// Il descend tout seul, moins vite si l'equipe est grande. Les managers le remontent.
function moraleDecay() {
  return 0.03 / (1 + 0.25 * Math.max(0, G.employees.length - 1));
}

function managerBoost() {
  var b = 0;
  G.employees.forEach(function(e) { if (e.type === 'manager' && empWorking(e)) b += 0.1 * empLevelMult(e); });
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
    var change = -decay + (emp.type === 'manager' ? 0 : boost);
    if (emp.unpaidTime > 5) change = -2;
    emp.morale = Math.max(0, Math.min(100, emp.morale + change * dtSec));
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
    if (emp.type === 'seller' && empWorking(emp)) sellOneBatchAuto(emp, dtSec);
  }
}

// ---------- Le chef patissier : il prepare tout seul ----------
function chefQueue(emp) {
  var mode = emp.chefMode || 'all';
  var list = (emp.chefList || []).map(findRec).filter(function(r) { return r && recUnlocked(r); });
  if (mode === 'only') return list;
  var rest = REC.filter(function(r) { return recUnlocked(r) && list.indexOf(r) < 0; });
  rest.sort(function(a, b) { return (batchPrice(b, b.qty) - recipeCost(b)) - (batchPrice(a, a.qty) - recipeCost(a)); });
  return mode === 'priority' ? list.concat(rest) : list.concat(rest).sort(function(a, b) { return (batchPrice(b, b.qty) - recipeCost(b)) - (batchPrice(a, a.qty) - recipeCost(a)); });
}

function tickChefs(dtSec) {
  G.employees.forEach(function(emp) {
    if (emp.type !== 'chef' || !empWorking(emp)) return;
    emp.chefCd = (emp.chefCd || 0) + dtSec * empPower(emp);
    if (emp.chefCd < 6 || activeCrafts() >= ovenSlots()) return;
    var queue = chefQueue(emp);
    for (var i = 0; i < queue.length; i++) {
      if (startCraft(queue[i])) { emp.chefCd = 0; return; }
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
    if (emp.type !== 'buyer' || !empWorking(emp)) return;
    emp.buyCd = (emp.buyCd || 0) + dtSec * empPower(emp);
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
    if (emp.type !== 'manager' || !empWorking(emp) || !emp.mgrAuto) return;
    emp.mgrCd = (emp.mgrCd || 0) + dtSec;
    if (emp.mgrCd < 5) return;
    emp.mgrCd = 0;
    var min = emp.mgrMin === undefined ? 50 : emp.mgrMin;
    // Le moins cher parmi ceux qui ont le niveau demande
    var picks = G.applicants.filter(function(a) { return a.skill >= min && G.money >= a.hireCost * 5; });
    picks.sort(function(a, b) { return a.hireCost - b.hireCost; });
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

// ============ REBIRTH ============
function canRebirth() {
  if (G.rebirth >= REBIRTHS.length) return false;
  var rb = REBIRTHS[G.rebirth];
  return G.level >= rb.minLvl && G.money >= rb.cost;
}

function getNextRebirth() {
  return G.rebirth >= REBIRTHS.length ? null : REBIRTHS[G.rebirth];
}

function doRebirth() {
  var rb = getNextRebirth();
  if (!rb || G.level < rb.minLvl || G.money < rb.cost) return false;
  var old = G;
  var keepMoney = old.money - rb.cost;
  // Tout ce qui t'appartient a toi, et pas a la boutique
  var keys = ['level','xp','achievements','stats','settings','bakeryName','bakeries','currentBakeryIndex','tutorialDone','tutorialStep',
    'introDone','birthday','birthdaySetOn','birthdayBoostYear','unlockedThemes','birthdayBoostUntil','cheatUnlocked','bobClicks','bobSad','logoClicks',
    'totalEarned','playTimeMs','rentDebt','favRecipes','lvl1000Shown','wentBankrupt',
    'secondBakery','achHere','bankUnlocked','loans','nextLoanId','history','machines','cmdUsage','challenge','nextChallengeAt','sugarFed','bakeryTheme','unlocks','explained','creative','sellerSold'];
  G = createFreshState();
  keys.forEach(function(k) { if (old[k] !== undefined) G[k] = JSON.parse(JSON.stringify(old[k])); });
  G.money = keepMoney;
  G.rebirth = old.rebirth + 1;
  G.maxSpace = Math.round(5 * spaceMultiplier());
  return true;
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
function unlockDelay(item) { return Math.min(300, Math.round(5 + item.unlockLvl * 1.5)); }

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
    if (s.at > now) return true;
    G.money += s.total;
    G.totalEarned += s.total;
    G.stats.totalSold += s.units;
    s.list.forEach(function(x) { addCakeEarning(x.id, x.earned); });
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
  if (theme.secret) return 'secret';
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
    if (e.type === 'seller' && empWorking(e)) capacity += sellerRate(e) * dt;
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
   'introDone','cheatUnlocked','bobClicks','bobSad','logoClicks','unlockedThemes','favRecipes','lvl1000Shown','wentBankrupt',
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
    all.rebirth = Math.max(all.rebirth, s.rebirth || 0);
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
function findMachine(id) { for (var i = 0; i < MACHINES.length; i++) { if (MACHINES[i].id === id) return MACHINES[i]; } return null; }
function machineCost(m) { return m.cost * Math.pow(m.growth, machineLevel(m.id)); }

// La somme de ce que donnent les machines pour un effet
function machineBonus(effect) {
  var b = 0;
  for (var i = 0; i < MACHINES.length; i++) {
    if (MACHINES[i].effect === effect) b += ((G.machines && G.machines[MACHINES[i].id]) || 0) * MACHINES[i].step;
  }
  return b;
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

function tickOrders(dtSec) {
  if (G.level < ORDER_CONFIG.lvl) return;
  var now = Date.now();
  G.orders = G.orders.filter(function(o) { return o.expiresAt > now; });
  if (!G.nextOrderAt) G.nextOrderAt = now;
  if (now >= G.nextOrderAt && G.orders.length < ORDER_CONFIG.maxOpen) {
    var created = createOrder();
    if (created) {
      G.orders.push(created);
      if (typeof toast === 'function') toast(t('order.new'));
    }
    G.nextOrderAt = now + ORDER_CONFIG.everySec * 1000;
  }
  // Le maitre d'hotel livre tout seul ce qui est pret
  G.employees.forEach(function(emp) {
    if (emp.type !== 'maitre' || !empWorking(emp)) return;
    emp.orderCd = (emp.orderCd || 0) + dtSec * empPower(emp);
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

// Renvoie la somme vraiment transportee
function transferMoney(from, to, amount) {
  var a = bakeryStateAt(from), b = bakeryStateAt(to);
  if (!a || !b || from === to) return 0;
  var moved = Math.min(Math.max(0, amount), Math.max(0, a.money));
  a.money -= moved;
  b.money += moved;
  return moved;
}

function stateUsedSpace(s) {
  var u = 0;
  REC.forEach(function(r) { u += (s.cakes[r.id] || 0) * r.space; });
  return u;
}

// kind : 'cake' ou 'ing'. Les gateaux doivent avoir la place en arrivant.
function transferStock(from, to, kind, id, qty) {
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
  b[box][id] = (b[box][id] || 0) + moved;
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
  var power = empLevelMult(emp);
  if (what.indexOf('cake:') === 0) return transferStock(from, to, 'cake', what.slice(5), Math.min(asked, 10 * power));
  if (what.indexOf('ing:') === 0) return transferStock(from, to, 'ing', what.slice(4), Math.min(asked, 100 * power));
  if (what === 'cakes') {
    var best = null;
    REC.forEach(function(r) { if ((s.cakes[r.id] || 0) >= 1 && (!best || r.val > best.val)) best = r; });
    return best ? transferStock(from, to, 'cake', best.id, Math.min(asked, 10 * power)) : 0;
  }
  if (what === 'ings') {
    var most = null;
    ING.forEach(function(i) { if ((s.ing[i.id] || 0) >= 1 && (!most || s.ing[i.id] > s.ing[most.id])) most = i; });
    return most ? transferStock(from, to, 'ing', most.id, Math.min(asked, 100 * power)) : 0;
  }
  var reserve = s.maxSpace * RENT_CONFIG.basePricePerM2PerHour / 60;
  s.employees.forEach(function(e) { reserve += getEmpSalary(e) * 60; });
  return transferMoney(from, to, Math.min(asked, Math.max(0, s.money - reserve), revenueAt(s.level) * 3 * power));
}

// Tous les transporteurs de toutes les patisseries
function tickCarriers(dtSec) {
  if (G.bakeries.length < 2) return;
  for (var i = 0; i < G.bakeries.length; i++) {
    var s = bakeryStateAt(i);
    if (!s) continue;
    s.employees.forEach(function(emp) {
      if (emp.type !== 'carrier' || !empWorking(emp)) return;
      emp.carryCd = (emp.carryCd || 0) + dtSec * empPower(emp);
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
