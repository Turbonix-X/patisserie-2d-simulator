/* ============================================
   PATISSERIE 2D SIMULATOR - GAME LOGIC
   Clicks, auto, craft, sell, employees, rent,
   rebirth, crypto, events, game over
   ============================================ */

// ============ FORMAT HELPERS ============
// Centillion = 1e303 = max money
var MONEY_CAP = 1e303;
var NUM_SUFFIXES = (function() {
  var base = ['','k','M','B','T','Qa','Qi','Sx','Sp','Oc','No'];
  var decades = ['Dc','Vg','Tg','Qd','Qq','Sg','St','Og','Ng'];
  var prefixes = ['','U','D','T','Qa','Qi','Sx','Sp','Oc','No'];
  for (var d = 0; d < decades.length; d++) {
    for (var p = 0; p < prefixes.length; p++) {
      base.push(prefixes[p] + decades[d]);
    }
  }
  base.push('Ce'); // Centillion = 1e303 (index 101)
  return base;
})();

function fmt(n) {
  if (n < 0) return '-' + fmt(-n);
  if (n < 1000) return Math.floor(n) + '';
  var idx = Math.floor(Math.log10(n) / 3);
  if (idx >= NUM_SUFFIXES.length) idx = NUM_SUFFIXES.length - 1;
  var div = Math.pow(10, idx * 3);
  var val = n / div;
  if (val >= 100) return Math.floor(val) + NUM_SUFFIXES[idx];
  if (val >= 10) return val.toFixed(1) + NUM_SUFFIXES[idx];
  return val.toFixed(2) + NUM_SUFFIXES[idx];
}

function capMoney() {
  if (G.money > MONEY_CAP) G.money = MONEY_CAP;
  if (G.totalEarned > MONEY_CAP) G.totalEarned = MONEY_CAP;
}
function fmtTime(sec) {
  if (sec < 60) return Math.ceil(sec) + 's';
  if (sec < 3600) return Math.floor(sec/60) + 'm' + Math.ceil(sec%60) + 's';
  return Math.floor(sec/3600) + 'h' + Math.floor((sec%3600)/60) + 'm';
}

// ============ REBIRTH MULTIPLIER ============
function rebirthBonus() {
  var bonus = 0;
  for (var i = 0; i < REBIRTHS.length; i++) {
    if (G.rebirth > i) bonus += REBIRTHS[i].bonus;
  }
  return 1 + bonus;
}
function spaceRentMultiplier() {
  var mult = 1;
  for (var i = 0; i < REBIRTHS.length; i++) {
    if (G.rebirth > i) mult *= REBIRTHS[i].spaceMulti;
  }
  return mult;
}

// ============ EMPLOYEE SKILL MULTIPLIER ============
function empSkillMult(emp) {
  return Math.max(0.1, (emp.skill || 50) / 50);
}

// ============ CLICK MULTIPLIER ============
function clickMult(ingId) {
  var m = 1;
  if (G.eventClickBonus) m *= (1 + G.eventClickBonus);
  return Math.floor(m * rebirthBonus() * birthdayBonus());
}

// ============ AUTO RATE ============
function autoRate(ingId) {
  var r = 0, am = 1;
  // Building production
  for (var b = 0; b < BUILDINGS.length; b++) {
    var bld = BUILDINGS[b];
    if (bld.produces === ingId) {
      var qty = (G.buildings[bld.id] || {qty:0}).qty;
      r += bld.baseRate * qty;
    }
  }
  // Employee collectors - produce level units per second
  for (var e = 0; e < G.employees.length; e++) {
    var emp = G.employees[e];
    if (emp.type === 'collector' && emp.assignedIng === ingId) {
      if (emp.status === 'working' || emp.status === 'poor') {
        var empProd = emp.level || 1;
        if (emp.status === 'poor') empProd *= 0.5;
        r += empProd;
      }
    }
  }
  // Event: power_outage stops auto production
  if (G.eventAutoBonus && G.eventAutoBonus <= -1) return 0;
  if (G.eventAutoBonus) am *= (1 + G.eventAutoBonus);
  return Math.floor(r * am * rebirthBonus() * birthdayBonus());
}

function totalAuto() {
  var s = 0;
  for (var i = 0; i < ING.length; i++) s += autoRate(ING[i].id);
  return s;
}

// ============ SELL VALUE ============
function sellValueMult() {
  return rebirthBonus() * birthdayBonus();
}

// Inflation: price changes based on supply/demand + events
function inflatedPrice(rec) {
  var base = rec.val * sellValueMult();
  var mySold = G.soldCount[rec.id] || 0;
  var otherSold = G.totalAllSold - mySold;
  var mult = 1 - INFLATION.sellDecay * mySold + INFLATION.otherBoost * otherSold;
  mult = Math.max(INFLATION.minMult, Math.min(INFLATION.maxMult, mult));
  // Event bonus
  if (G.eventPriceBonus) mult *= (1 + G.eventPriceBonus);
  return Math.floor(base * mult);
}

// Inflation percentage compared to base
function inflationPct(rec) {
  var base = rec.val * sellValueMult();
  var actual = inflatedPrice(rec);
  if (base <= 0) return 0;
  return Math.round((actual / base - 1) * 100);
}

// ============ XP ============
function xpMult() {
  var m = 1;
  if (G.eventXpBonus) m *= (1 + G.eventXpBonus);
  return m * birthdayBonus();
}

function addXP(amount) {
  var gained = Math.floor(amount * xpMult());
  G.xp += gained;
  var needed = xpForLevel(G.level);
  while (G.xp >= needed) {
    G.xp -= needed;
    G.level++;
    needed = xpForLevel(G.level);
    if (typeof showLevelUp === 'function') showLevelUp(G.level);
  }
}

// ============ SPACE HELPERS ============
function usedSpace() {
  var s = 0;
  for (var i = 0; i < REC.length; i++) s += (G.cakes[REC[i].id] || 0) * REC[i].space;
  return Math.round(s * 100) / 100;
}

// Check if adding this recipe would exceed space
function canFitRecipe(rec) {
  return usedSpace() + rec.space <= G.maxSpace;
}

// Overflow check: remove excess items if over space
function checkSpaceOverflow() {
  var used = usedSpace();
  if (used <= G.maxSpace) return false;
  // Remove from most expensive recipes first
  var sorted = REC.slice().sort(function(a, b) { return b.val - a.val; });
  for (var i = 0; i < sorted.length; i++) {
    var rec = sorted[i];
    while (G.cakes[rec.id] > 0 && usedSpace() > G.maxSpace) {
      G.cakes[rec.id]--;
    }
    if (usedSpace() <= G.maxSpace) break;
  }
  if (typeof toast === 'function') toast(t('space.overflow'));
  return true;
}

// ============ RECIPE HELPERS ============
function canMake(rec) {
  if (rec.unlockLvl > G.level) return false;
  var keys = Object.keys(rec.req);
  for (var i = 0; i < keys.length; i++) {
    if ((G.ing[keys[i]] || 0) < rec.req[keys[i]]) return false;
  }
  return true;
}

// ============ CRAFT SPEED ============
function craftSpeedMult() {
  var m = 1;
  // Baker employees reduce craft time
  var bakerCount = 0;
  for (var e = 0; e < G.employees.length; e++) {
    if (G.employees[e].type === 'baker' && (G.employees[e].status === 'working' || G.employees[e].status === 'poor')) {
      bakerCount++;
    }
  }
  if (bakerCount > 0) m *= Math.max(0.1, 1 - bakerCount * 0.05);
  // BUG FIX: Chef employees reduce craft time by -8% each (cumulative, min 5%)
  var chefCount = 0;
  for (var e = 0; e < G.employees.length; e++) {
    if (G.employees[e].type === 'chef' && (G.employees[e].status === 'working' || G.employees[e].status === 'poor')) {
      chefCount++;
    }
  }
  if (chefCount > 0) m *= Math.pow(0.92, chefCount);
  return Math.max(0.05, m);
}

function getCraftDuration(rec) {
  return Math.max(0.5, rec.prepTime * craftSpeedMult());
}

// Start crafting a recipe - checks space BEFORE crafting
function startCraft(rec) {
  if (!canMake(rec)) return false;
  if (!canFitRecipe(rec)) return false;
  // Consume ingredients
  var keys = Object.keys(rec.req);
  for (var i = 0; i < keys.length; i++) G.ing[keys[i]] -= rec.req[keys[i]];
  var duration = getCraftDuration(rec);
  G.crafting.push({
    recId: rec.id,
    startTime: Date.now(),
    duration: duration * 1000,
  });
  return true;
}

// Check crafting queue
function tickCrafting() {
  var now = Date.now();
  var finished = [];
  var remaining = [];
  for (var i = 0; i < G.crafting.length; i++) {
    var c = G.crafting[i];
    if (now - c.startTime >= c.duration) {
      finished.push(c);
    } else {
      remaining.push(c);
    }
  }
  G.crafting = remaining;
  for (var f = 0; f < finished.length; f++) {
    var rec = null;
    for (var r = 0; r < REC.length; r++) { if (REC[r].id === finished[f].recId) { rec = REC[r]; break; } }
    if (!rec) continue;
    // Only add if space allows
    if (canFitRecipe(rec)) {
      G.cakes[rec.id] += rec.qty;
      G.stats.totalCakesMade += rec.qty;
      if (!G.stats.cakesMadeById[rec.id]) G.stats.cakesMadeById[rec.id] = 0;
      G.stats.cakesMadeById[rec.id] += rec.qty;
      addXP(rec.xp);
      if (typeof toast === 'function') toast(rec.e + ' ' + rec.qty + 'x ' + t('r.' + rec.id) + ' !');
    } else {
      // Refund? No - space was checked at start, but cakes added in between might fill it
      if (typeof toast === 'function') toast(t('space.noSpace'));
    }
  }
  return finished.length > 0;
}

// ============ INGREDIENT COST ============
function getIngredientCost(ing) {
  var cost = ing.cost;
  if (G.eventIngBonus) cost *= (1 + G.eventIngBonus);
  return cost;
}

function getIngredientResellPrice(ing) {
  return Math.floor(ing.cost * (ing.resellRate || 0.5) * 100) / 100;
}

function buyIngredient(ing, amount) {
  var cost = getIngredientCost(ing) * amount;
  if (G.money < cost) return false;
  G.money -= cost;
  G.ing[ing.id] += clickMult(ing.id) * amount;
  G.stats.totalClicks += amount;
  G.stats.totalIngredientCost += cost;
  addXP(amount);
  return cost;
}

function resellIngredient(ing, amount) {
  var have = G.ing[ing.id] || 0;
  var actual = Math.min(amount, have);
  if (actual <= 0) return 0;
  var price = getIngredientResellPrice(ing) * actual;
  G.ing[ing.id] -= actual;
  G.money += price;
  G.totalEarned += price;
  return price;
}

// ============ INGREDIENT CRAFTING ============
function startIngredientCraft(ing) {
  if (!ing.craftable || !ing.craftReq) return false;
  // Check we have required ingredients
  var keys = Object.keys(ing.craftReq);
  for (var i = 0; i < keys.length; i++) {
    if ((G.ing[keys[i]] || 0) < ing.craftReq[keys[i]]) return false;
  }
  // Consume
  for (var i = 0; i < keys.length; i++) {
    G.ing[keys[i]] -= ing.craftReq[keys[i]];
  }
  // Add to crafting queue
  var duration = (ing.craftTime || 3) * craftSpeedMult();
  G.crafting.push({
    recId: '_ing_' + ing.id,
    ingId: ing.id,
    isIngCraft: true,
    startTime: Date.now(),
    duration: duration * 1000,
  });
  return true;
}

// Modified tickCrafting to handle ingredient crafting
var _origTickCrafting = tickCrafting;
tickCrafting = function() {
  var now = Date.now();
  var finished = [];
  var remaining = [];
  for (var i = 0; i < G.crafting.length; i++) {
    var c = G.crafting[i];
    if (now - c.startTime >= c.duration) {
      finished.push(c);
    } else {
      remaining.push(c);
    }
  }
  G.crafting = remaining;
  for (var f = 0; f < finished.length; f++) {
    var c = finished[f];
    if (c.isIngCraft && c.ingId) {
      // Ingredient craft complete
      G.ing[c.ingId] = (G.ing[c.ingId] || 0) + 1;
      if (typeof toast === 'function') {
        var ingData = null;
        for (var x = 0; x < ING.length; x++) { if (ING[x].id === c.ingId) { ingData = ING[x]; break; } }
        if (ingData) toast(ingData.e + ' ' + t('i.' + c.ingId) + ' !');
      }
      continue;
    }
    var rec = null;
    for (var r = 0; r < REC.length; r++) { if (REC[r].id === c.recId) { rec = REC[r]; break; } }
    if (!rec) continue;
    if (canFitRecipe(rec)) {
      G.cakes[rec.id] += rec.qty;
      G.stats.totalCakesMade += rec.qty;
      if (!G.stats.cakesMadeById[rec.id]) G.stats.cakesMadeById[rec.id] = 0;
      G.stats.cakesMadeById[rec.id] += rec.qty;
      addXP(rec.xp);
      if (typeof toast === 'function') toast(rec.e + ' ' + rec.qty + 'x ' + t('r.' + rec.id) + ' !');
    }
  }
  return finished.length > 0;
};

// ============ EMPLOYEE SYSTEM ============
function empProdMult() {
  return 1;
}

function moralBoostUpg() {
  return 0;
}

// Get employee name based on current language
function getEmpName() {
  var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
  var names = EMP_NAMES_LANG[lang] || EMP_NAMES_LANG.fr;
  return names[Math.floor(Math.random() * names.length)];
}

function hireEmployee(typeId, applicant) {
  var empType = null;
  for (var i = 0; i < EMP_TYPES.length; i++) {
    if (EMP_TYPES[i].id === typeId) { empType = EMP_TYPES[i]; break; }
  }
  if (!empType) return false;
  if (G.level < empType.unlockLvl) return false;
  var cost = applicant ? applicant.hireCost : empType.hireCost;
  if (G.money < cost) return false;
  G.money -= cost;
  var skill = applicant ? applicant.skill : (20 + Math.floor(Math.random() * 30));
  var name = applicant ? applicant.name : getEmpName();
  G.employees.push({
    id: G.nextEmployeeId++,
    name: name,
    type: typeId,
    morale: 70 + Math.floor(Math.random() * 20) + moralBoostUpg(),
    status: 'working',
    skill: skill,
    level: 1,
    assignedIng: typeId === 'collector' ? 'farine' : null,
    assignedRec: null,
    unpaidTime: 0,
  });
  G.stats.totalEmployeesHired++;
  return true;
}

function fireEmployee(empId) {
  G.employees = G.employees.filter(function(e) { return e.id !== empId; });
}

function trainEmployee(empId) {
  for (var i = 0; i < G.employees.length; i++) {
    var emp = G.employees[i];
    if (emp.id === empId) {
      var lvl = emp.level || 1;
      var cost = lvl * 100;
      if (G.money < cost) return false;
      G.money -= cost;
      emp.level = lvl + 1;
      return true;
    }
  }
  return false;
}

function getTrainCost(emp) {
  return (emp.level || 1) * 100;
}

function getEmpSalary(emp) {
  var empType = null;
  for (var i = 0; i < EMP_TYPES.length; i++) {
    if (EMP_TYPES[i].id === emp.type) { empType = EMP_TYPES[i]; break; }
  }
  if (!empType) return 0;
  return empType.baseSalary;
}

// Generate applicants based on player level
function generateApplicant() {
  if (G.applicants.length >= 5) return; // Max 5 pending
  var typeIdx = Math.floor(Math.random() * EMP_TYPES.length);
  var empType = EMP_TYPES[typeIdx];
  if (G.level < empType.unlockLvl) return;
  // Higher level = better applicants
  var baseSkill = Math.min(90, 10 + Math.floor(G.level * 0.5));
  var skill = Math.max(1, Math.min(100, baseSkill + Math.floor(Math.random() * 30) - 15));
  var hireCost = Math.floor(empType.hireCost * (0.8 + skill * 0.01));
  G.applicants.push({
    id: Date.now() + Math.floor(Math.random() * 1000),
    name: getEmpName(),
    type: empType.id,
    skill: skill,
    hireCost: hireCost,
    expiresAt: Date.now() + 120000, // 2 minutes to decide
  });
  if (typeof toast === 'function') toast(t('emp.applicant'));
}

function removeExpiredApplicants() {
  var now = Date.now();
  G.applicants = G.applicants.filter(function(a) { return a.expiresAt > now; });
}

function acceptApplicant(appId) {
  for (var i = 0; i < G.applicants.length; i++) {
    var app = G.applicants[i];
    if (app.id === appId) {
      if (hireEmployee(app.type, app)) {
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

function tickEmployees(dtSec) {
  var totalSalary = 0;
  for (var i = G.employees.length - 1; i >= 0; i--) {
    var emp = G.employees[i];
    var salary = getEmpSalary(emp) * dtSec;
    totalSalary += salary;

    // Pay salary
    if (G.money >= salary) {
      G.money -= salary;
      G.stats.totalSalaryPaid += salary;
      emp.unpaidTime = 0;
    } else {
      emp.unpaidTime += dtSec;
    }

    // Manager boosts morale of others
    if (emp.type === 'manager' && emp.status === 'working') {
      for (var j = 0; j < G.employees.length; j++) {
        if (G.employees[j].id !== emp.id && G.employees[j].morale < 100) {
          G.employees[j].morale = Math.min(100, G.employees[j].morale + 0.5 * dtSec);
        }
      }
    }

    // Morale decay
    if (emp.unpaidTime > 5) {
      emp.morale = Math.max(0, emp.morale - 2 * dtSec);
    } else {
      emp.morale = Math.max(0, emp.morale - 0.1 * dtSec);
    }

    // Status based on morale
    if (emp.morale <= 0) {
      if (typeof toast === 'function') toast(t('emp.event.quit', { n: emp.name }));
      G.employees.splice(i, 1);
      continue;
    } else if (emp.morale < 20 || emp.unpaidTime > 30) {
      if (emp.status !== 'striking') {
        emp.status = 'striking';
        if (typeof toast === 'function') toast(t('emp.event.strike', { n: emp.name }));
      }
    } else if (emp.morale < 40) {
      emp.status = 'poor';
    } else {
      if (emp.status === 'striking' && emp.morale > 40 && emp.unpaidTime < 5) {
        emp.status = 'working';
      } else if (emp.status !== 'striking') {
        emp.status = 'working';
      }
    }

    // Random events (rare)
    if (Math.random() < 0.001 * dtSec) {
      if (emp.morale < 30 && Math.random() < 0.3) {
        if (typeof toast === 'function') toast(t('emp.event.quit', { n: emp.name }));
        G.employees.splice(i, 1);
        continue;
      }
    }

    // Auto-seller employees - sell (level) cakes per second
    if (emp.type === 'seller' && (emp.status === 'working' || emp.status === 'poor')) {
      var sellerMult = emp.status === 'poor' ? 0.5 : 1;
      sellerMult *= (emp.level || 1);
      if (G.eventSellerBonus) sellerMult *= (1 + G.eventSellerBonus);
      if (G.eventEmpBonus) sellerMult *= (1 + G.eventEmpBonus);
      for (var r = 0; r < REC.length; r++) {
        var rec = REC[r];
        if (G.cakes[rec.id] > 0 && rec.unlockLvl <= G.level) {
          var sellQty = Math.min(G.cakes[rec.id], Math.ceil(sellerMult * dtSec));
          if (sellQty > 0) {
            var price = inflatedPrice(rec) * sellQty;
            G.cakes[rec.id] -= sellQty;
            G.money += price;
            G.totalEarned += price;
            G.stats.totalSold += sellQty;
            G.soldCount[rec.id] = (G.soldCount[rec.id] || 0) + sellQty;
            G.totalAllSold += sellQty;
            break;
          }
        }
      }
    }
  }
  return totalSalary;
}

// ============ RENT SYSTEM ============
function rentReduc() {
  return 1;
}

function getRentPerHour() {
  var rent = G.maxSpace * RENT_CONFIG.basePricePerM2PerHour * spaceRentMultiplier() * rentReduc();
  if (G.eventRentBonus) rent *= (1 + G.eventRentBonus);
  return rent;
}

function tickRent(dtSec) {
  var rentPerSec = getRentPerHour() / 3600;
  var rentDue = rentPerSec * dtSec;
  if (G.money >= rentDue) {
    G.money -= rentDue;
    G.stats.totalRentPaid += rentDue;
  } else {
    var unpaid = rentDue - G.money;
    G.stats.totalRentPaid += G.money;
    G.money = 0;
    G.rentDebt += unpaid;
  }
  if (G.rentDebt > 0) {
    G.rentDebt += G.rentDebt * RENT_CONFIG.debtInterestPerSec * dtSec;
  }
}

// ============ AUTO-COLLECT ============
function tickAutoCollect(dtSec) {
  var changed = false;
  for (var i = 0; i < ING.length; i++) {
    var ing = ING[i];
    if (ing.unlockLvl > G.level) continue;
    var r = autoRate(ing.id);
    if (r > 0) {
      G.ing[ing.id] += Math.floor(r * dtSec);
      changed = true;
    }
  }
  return changed;
}

// ============ BUILDING COST ============
function buildingCost(bld) {
  var qty = (G.buildings[bld.id] || {qty:0}).qty;
  return Math.floor(bld.baseCost * Math.pow(1.15, qty));
}
function buyBuilding(bld, amount) {
  var bought = 0;
  for (var i = 0; i < amount; i++) {
    var cost = buildingCost(bld);
    if (G.money < cost || G.level < bld.unlockLvl) break;
    G.money -= cost;
    G.buildings[bld.id].qty++;
    G.stats.totalBuildingsBought++;
    bought++;
  }
  return bought;
}

// ============ REBIRTH ============
function canRebirth() {
  var nextRebirth = G.rebirth;
  if (nextRebirth >= REBIRTHS.length) return false;
  var rb = REBIRTHS[nextRebirth];
  return G.level >= rb.minLvl && G.money >= rb.cost;
}
function getNextRebirth() {
  if (G.rebirth >= REBIRTHS.length) return null;
  return REBIRTHS[G.rebirth];
}
function doRebirth() {
  var rb = getNextRebirth();
  if (!rb) return false;
  if (G.level < rb.minLvl || G.money < rb.cost) return false;
  var keepMoney = G.money - rb.cost;
  var keepLevel = G.level;
  var keepXp = G.xp;
  var keepRebirth = G.rebirth + 1;
  var keepAchievements = JSON.parse(JSON.stringify(G.achievements));
  var keepStats = JSON.parse(JSON.stringify(G.stats));
  var keepSettings = JSON.parse(JSON.stringify(G.settings));
  var keepBakeryName = G.bakeryName;
  var keepBakeries = JSON.parse(JSON.stringify(G.bakeries));
  var keepTutorialDone = G.tutorialDone;
  var keepBirthday = G.birthday;
  var keepUnlockedThemes = JSON.parse(JSON.stringify(G.unlockedThemes || {}));
  var keepBirthdayBoostUntil = G.birthdayBoostUntil;

  G = createFreshState();
  G.money = keepMoney;
  G.level = keepLevel;
  G.xp = keepXp;
  G.rebirth = keepRebirth;
  G.achievements = keepAchievements;
  G.stats = keepStats;
  G.settings = keepSettings;
  G.bakeryName = keepBakeryName;
  G.bakeries = keepBakeries;
  G.tutorialDone = keepTutorialDone;
  G.birthday = keepBirthday;
  G.unlockedThemes = keepUnlockedThemes;
  G.birthdayBoostUntil = keepBirthdayBoostUntil;
  return true;
}

// ============ ANTI AUTO-CLICKER ============
var antiClick = {
  clicks: [],
  cooldownUntil: 0,
  cooldownCount: 0,
  captchaActive: false,
  captchaAnswer: 0,
  banUntil: 0,
  banDuration: 300,
};

function checkAntiClick() {
  var now = Date.now();
  // Check ban first (100+ CPS ban)
  if (now < antiClick.banUntil) return 'banned';
  if (antiClick.captchaActive) return 'captcha';
  if (now < antiClick.cooldownUntil) return 'cooldown';
  antiClick.clicks.push(now);
  antiClick.clicks = antiClick.clicks.filter(function(t) { return now - t < 1000; });
  // 100+ CPS = 5 second ban
  if (antiClick.clicks.length > 100) {
    antiClick.banUntil = now + antiClick.banDuration * 1000;
    antiClick.clicks = [];
    return 'banned';
  }
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

function solveCaptcha(answer) {
  if (parseInt(answer) === antiClick.captchaAnswer) {
    antiClick.captchaActive = false;
    antiClick.cooldownCount = 0;
    antiClick.cooldownUntil = 0;
    return true;
  }
  return false;
}

// ============ SELL ============
function doSell(rec, qty) {
  var actual = Math.min(qty, G.cakes[rec.id]);
  if (!actual) return 0;
  var price = inflatedPrice(rec);
  var earned = actual * price;
  G.cakes[rec.id] -= actual;
  G.money += earned;
  G.totalEarned += earned;
  G.stats.totalSold += actual;
  G.soldCount[rec.id] = (G.soldCount[rec.id] || 0) + actual;
  G.totalAllSold += actual;
  addXP(Math.floor(earned * 0.3));
  return earned;
}

// Sell ALL cakes
function doSellAll() {
  var totalEarned = 0;
  for (var i = 0; i < REC.length; i++) {
    var rec = REC[i];
    if (G.cakes[rec.id] > 0 && rec.unlockLvl <= G.level) {
      totalEarned += doSell(rec, G.cakes[rec.id]);
    }
  }
  return totalEarned;
}

// ============ ACHIEVEMENTS ============
function checkAchievements() {
  var newAch = false;
  for (var i = 0; i < ACHIEVEMENTS.length; i++) {
    var a = ACHIEVEMENTS[i];
    if (G.achievements[a.id]) continue;
    if (a.check(G)) {
      G.achievements[a.id] = true;
      if (typeof toast === 'function') toast(t('ach.unlocked', { n: t('ach.' + a.id) }));
      newAch = true;
    }
  }
  return newAch;
}

// ============ BIRTHDAY SYSTEM ============
function isBirthdayToday() {
  if (!G.birthday) return false;
  var now = new Date();
  return now.getDate() === G.birthday.day && (now.getMonth() + 1) === G.birthday.month;
}

function birthdayBonus() {
  if (!G.birthdayBoostUntil) return 1;
  if (Date.now() < G.birthdayBoostUntil) return 2;
  return 1;
}

function activateBirthdayBoost() {
  // Boost lasts 24 hours from activation
  G.birthdayBoostUntil = Date.now() + 24 * 3600 * 1000;
}

// ============ THEME AVAILABILITY ============
function isThemeAvailable(themeObj) {
  var reqLvl = THEME_LEVELS[themeObj.id] || 0;
  if (G.level < reqLvl) return { available: false, reason: 'level', lvl: reqLvl };
  if (themeObj.birthday) {
    if (!isBirthdayToday()) return { available: false, reason: 'birthday' };
    return { available: true };
  }
  if (themeObj.seasonal) {
    var now = new Date();
    var todayM = now.getMonth() + 1;
    var todayD = now.getDate();
    if (todayM !== themeObj.seasonal.month || todayD !== themeObj.seasonal.day) {
      return { available: false, reason: 'date', date: themeObj.seasonal.day + '/' + themeObj.seasonal.month };
    }
  }
  if (themeObj.requiresNature) {
    if (!hasAllNatureThemes()) return { available: false, reason: 'nature' };
  }
  return { available: true };
}

function hasAllNatureThemes() {
  return !!(G.unlockedThemes && G.unlockedThemes.nature_fleur && G.unlockedThemes.nature_automne && G.unlockedThemes.nature_neige);
}

// ============ EVENT SYSTEM ============
function tickEvents() {
  var now = Date.now();
  // Clear expired event
  if (G.activeEvent && now >= G.eventEndTime) {
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
  // Try to generate new event
  if (!G.activeEvent && now - G.lastEventTime > 60000) {
    if (Math.random() < 0.01) {
      var evtIdx = Math.floor(Math.random() * EVENT_TYPES.length);
      var evt = EVENT_TYPES[evtIdx];
      if (Math.random() < evt.chance) {
        G.activeEvent = evt.id;
        G.eventEndTime = now + evt.duration * 1000;
        G.lastEventTime = now;
        applyEvent(evt.id, evt.duration);
        if (typeof toast === 'function') toast(t('event.' + evt.id, { t: evt.duration }));
      }
    }
  }
}

function applyEvent(evtId, dur) {
  switch(evtId) {
    case 'price_surge': G.eventPriceBonus = 0.30; break;
    case 'price_drop': G.eventPriceBonus = -0.20; break;
    case 'inflation': G.eventIngBonus = 0.25; break;
    case 'deflation': G.eventIngBonus = -0.15; break;
    case 'rush_hour': G.eventSellerBonus = 1.0; break;
    case 'ingredient_sale': G.eventIngBonus = -0.30; break;
    case 'tax_break': G.eventRentBonus = -0.50; break;
    case 'strike_wave':
      for (var i = 0; i < G.employees.length; i++) {
        G.employees[i].morale = Math.max(0, G.employees[i].morale - 20);
      }
      break;
    case 'lucky_day': G.eventXpBonus = 2.0; break;
    case 'inspection': break;
    // New events Beta 1.2
    case 'customer_wave': G.eventPriceBonus = 1.0; break; // sell x2
    case 'power_outage': G.eventAutoBonus = -1.0; break; // auto production stops
    case 'sugar_rush': G.eventClickBonus = 2.0; break; // clicks x3
    case 'food_critic': G.eventPriceBonus = 0.50; break; // sell +50%
    case 'supplier_strike': G.eventIngBonus = 0.50; break; // ingredients +50%
    case 'festival':
      G.eventPriceBonus = 0.15;
      G.eventClickBonus = 0.15;
      G.eventXpBonus = 0.15;
      break;
    case 'bad_review': G.eventPriceBonus = -0.25; break; // sell -25%
    case 'health_check':
      // Confiscate 10-30% of random cakes
      for (var c in G.cakes) {
        if (G.cakes[c] > 0) {
          var lost = Math.ceil(G.cakes[c] * (0.1 + Math.random() * 0.2));
          G.cakes[c] = Math.max(0, G.cakes[c] - lost);
        }
      }
      break;
    case 'tv_feature': G.eventXpBonus = 4.0; break; // XP x5
    case 'apprentice_day': G.eventEmpBonus = 1.0; break; // emp x2
  }
}

// ============ DEBT PAYMENT ============
function payDebt() {
  if (G.rentDebt <= 0) return false;
  if (G.money >= G.rentDebt) {
    G.money -= G.rentDebt;
    G.rentDebt = 0;
    return true;
  }
  return false;
}

// ============ GAME OVER CHECK ============
function checkGameOver() {
  if (G.money <= 0 && G.rentDebt > 0) {
    // Check if player has any income source
    var hasIncome = false;
    // Check auto income
    if (totalAuto() > 0) hasIncome = true;
    // Check if has cakes to sell
    for (var i = 0; i < REC.length; i++) {
      if (G.cakes[REC[i].id] > 0) { hasIncome = true; break; }
    }
    // Check if has ingredients to sell
    for (var i = 0; i < ING.length; i++) {
      if (G.ing[ING[i].id] > 0) { hasIncome = true; break; }
    }
    if (!hasIncome) {
      G.gameOver = true;
      return true;
    }
  }
  return false;
}

// ============ OFFLINE PROGRESSION ============
function calcOfflineProgress(elapsedSec) {
  var maxSec = 5 * 3600; // 5h max
  var dt = Math.min(elapsedSec, maxSec);
  var totalIng = 0;
  var totalMoney = 0;
  // Auto collect
  for (var i = 0; i < ING.length; i++) {
    var ing = ING[i];
    if (ing.unlockLvl > G.level) continue;
    var r = autoRate(ing.id);
    if (r > 0) {
      var gained = Math.floor(r * dt);
      G.ing[ing.id] += gained;
      totalIng += gained;
    }
  }
  // Auto sell (simplified)
  var sellerCount = 0;
  for (var e = 0; e < G.employees.length; e++) {
    if (G.employees[e].type === 'seller' && G.employees[e].status === 'working') sellerCount++;
  }
  if (sellerCount > 0) {
    for (var i = 0; i < REC.length; i++) {
      var rec = REC[i];
      if (G.cakes[rec.id] > 0) {
        var sellQty = Math.min(G.cakes[rec.id], Math.ceil(sellerCount * empProdMult() * dt));
        if (sellQty > 0) {
          var price = inflatedPrice(rec) * sellQty;
          G.cakes[rec.id] -= sellQty;
          G.money += price;
          G.totalEarned += price;
          totalMoney += price;
        }
      }
    }
  }
  // Deduct rent
  tickRent(dt);
  // Deduct salaries
  for (var e = 0; e < G.employees.length; e++) {
    var sal = getEmpSalary(G.employees[e]) * dt;
    if (G.money >= sal) {
      G.money -= sal;
      G.stats.totalSalaryPaid += sal;
    }
  }
  return { ingredients: totalIng, money: totalMoney, seconds: dt };
}

// ============ MULTIPLE BAKERIES ============
function openNewBakery() {
  var cost = 10000 * Math.pow(3, G.bakeries.length);
  if (G.money < cost) return false;
  G.money -= cost;
  // Save current bakery
  saveBakeryState();
  // Create new bakery
  var lang = (typeof currentLang !== 'undefined') ? currentLang : 'fr';
  var names = BAKERY_NAMES_LANG[lang] || BAKERY_NAMES_LANG.fr;
  var newName = names[Math.floor(Math.random() * names.length)];
  var newState = createFreshState();
  newState.bakeryName = newName;
  newState.settings = JSON.parse(JSON.stringify(G.settings));
  newState.level = G.level;
  newState.xp = G.xp;
  newState.money = 50;
  newState.tutorialDone = true;
  G.bakeries.push({
    name: newName,
    state: newState,
  });
  if (typeof toast === 'function') toast(t('bakery.opened', { n: newName }));
  return true;
}

function saveBakeryState() {
  if (G.bakeries.length === 0) return;
  // Current bakery state is G itself (minus bakeries array)
  var saveState = JSON.parse(JSON.stringify(G));
  delete saveState.bakeries;
  if (G.currentBakeryIndex < G.bakeries.length) {
    G.bakeries[G.currentBakeryIndex].state = saveState;
    G.bakeries[G.currentBakeryIndex].name = G.bakeryName;
  }
}

function switchToBakery(index) {
  if (index < 0 || index >= G.bakeries.length) return false;
  if (index === G.currentBakeryIndex) return false;
  saveBakeryState();
  var bakeries = G.bakeries;
  var targetState = JSON.parse(JSON.stringify(bakeries[index].state));
  targetState.bakeries = bakeries;
  targetState.currentBakeryIndex = index;
  Object.assign(G, targetState);
  return true;
}

function sellBakery(index) {
  if (index < 0 || index >= G.bakeries.length) return false;
  if (index === G.currentBakeryIndex) return false;
  if (G.bakeries.length <= 1) return false;
  var value = getBakeryValueForIndex(index);
  G.money += value;
  G.totalEarned += value;
  G.bakeries.splice(index, 1);
  if (G.currentBakeryIndex > index) G.currentBakeryIndex--;
  if (typeof toast === 'function') toast(t('bakery.sold', { v: fmtMoney(value) }));
  return true;
}

function getBakeryValueForIndex(index) {
  if (!G.bakeries[index] || !G.bakeries[index].state) return 0;
  var s = G.bakeries[index].state;
  var val = (s.totalEarned || 0) * 0.1 + (s.level || 1) * 100;
  return Math.floor(val);
}
