/* ============================================
   PATISSERIE 2D SIMULATOR - INTERFACE
   UI rendering, modals, tabs, tutorial
   ============================================ */

var currentTab = 'rec';
var toastCounter = 0;
var activeToasts = {};

// ============ TOAST NOTIFICATIONS (stacking) ============
function toast(msg) {
  var area = document.getElementById('toast-area');
  if (!area) return;
  // Check if same message already displayed - stack it
  if (activeToasts[msg]) {
    var existing = activeToasts[msg];
    existing.count++;
    var countSpan = existing.div.querySelector('.toast-count');
    if (countSpan) { countSpan.textContent = 'x' + existing.count; }
    else {
      countSpan = document.createElement('span');
      countSpan.className = 'toast-count';
      countSpan.textContent = 'x' + existing.count;
      existing.div.appendChild(countSpan);
    }
    // Reset timer
    clearTimeout(existing.timer);
    existing.timer = setTimeout(function() { removeToast(msg, existing.div); }, 3000);
    return;
  }
  var id = 'toast-' + (++toastCounter);
  var div = document.createElement('div');
  div.className = 'notif';
  div.id = id;
  div.innerHTML = iconify(escH(msg));
  // 4 notifications a la fois au maximum, pour ne pas couvrir le jeu
  while (area.children.length >= 4) {
    var oldest = area.firstChild;
    for (var key in activeToasts) {
      if (activeToasts[key].div === oldest) { clearTimeout(activeToasts[key].timer); delete activeToasts[key]; }
    }
    area.removeChild(oldest);
  }
  area.appendChild(div);
  var timer = setTimeout(function() { removeToast(msg, div); }, 3000);
  activeToasts[msg] = { div: div, count: 1, timer: timer };
}

function removeToast(msg, div) {
  div.classList.add('fade-out');
  setTimeout(function() { if (div.parentNode) div.parentNode.removeChild(div); }, 400);
  delete activeToasts[msg];
}

function showLevelUp(lvl) {
  toast(t('xp.level', { v: lvl }) + ' !');
  fxLevelUp();
}

// ============ FLOATING MONEY ANIMATION ============
function showFloatingMoney(amount, elem) {
  var span = document.createElement('span');
  span.className = 'float-money';
  span.textContent = '+' + fmtMoney(amount);
  if (elem) {
    var rect = elem.getBoundingClientRect();
    span.style.left = rect.left + rect.width / 2 + 'px';
    span.style.top = rect.top + 'px';
  } else {
    span.style.left = '50%';
    span.style.top = '50%';
  }
  document.body.appendChild(span);
  setTimeout(function() { if (span.parentNode) span.parentNode.removeChild(span); }, 1200);
  var coin = ['#ffd60a', '#ffe766', '#f5c400', '#ffffff'];
  if (elem) fxBurstOn(elem, 14, coin);
  else fxBurst(window.innerWidth / 2, window.innerHeight / 2, 26, coin, true);
  fxBump(document.querySelector('.money-display'), 1.18);
}

// ============ HEADER ============
function renderHeader() {
  var el = document.getElementById('header');
  if (!el) return;
  var xpNeeded = xpForLevel(G.level);
  var xpPct = Math.min(100, Math.floor(G.xp / xpNeeded * 100));
  var h = '<header class="site-header"><div class="header-inner game-header-inner">';
  // Titre + nom de la patisserie
  h += '<div class="hdr-brand">';
  h += '<h1 class="site-title" onclick="handleLogoClick()">P<span>2D</span>S<small class="version-badge">' + GAME_VERSION + '</small></h1>';
  h += '<button class="bakery-name" onclick="showRenameModal()" title="' + escH(t('rename.title')) + '"><span>' + escH(G.bakeryName) + '</span>' + uiIcon('pencil') + '</button>';
  h += '</div>';
  // Argent, niveau, XP
  h += '<div class="hdr-stats">';
  h += '<span class="money-display">' + fmtMoney(Math.floor(G.money)) + '</span>';
  h += '<span class="level-display">' + t('level', { v: G.level }) + '</span>';
  h += '<div class="xp-bar-container"><div class="xp-bar-fill" style="width:' + xpPct + '%"></div>';
  h += '<span class="xp-bar-text">' + t('xp.text', { c: fmt(Math.floor(G.xp)), n: fmt(xpNeeded) }) + '</span></div>';
  h += '</div>';
  // Boutons du haut
  h += '<div class="header-right">';
  if (G.bakeries.length > 1) {
    h += '<button class="hbtn" onclick="showBakeriesModal()" title="' + escH(t('bakery.title')) + '" aria-label="' + escH(t('bakery.title')) + '">' + uiIcon('home') + '</button>';
  }
  var pauseLabel = escH(G.paused ? t('pause.resume') : t('pause.title'));
  h += '<button class="hbtn" onclick="togglePause()" title="' + pauseLabel + '" aria-label="' + pauseLabel + '">' + uiIcon(G.paused ? 'play' : 'pause') + '</button>';
  var soundLabel = escH(t('settings.sound'));
  h += '<button class="hbtn' + (G.settings.soundEnabled ? '' : ' off') + '" onclick="G.settings.soundEnabled=!G.settings.soundEnabled;renderHeader()" title="' + soundLabel + '" aria-label="' + soundLabel + '" aria-pressed="' + (G.settings.soundEnabled ? 'true' : 'false') + '">' + uiIcon(G.settings.soundEnabled ? 'soundOn' : 'soundOff') + '</button>';
  h += '<button class="hbtn" onclick="showSettingsModal()" title="' + escH(t('settings.title')) + '" aria-label="' + escH(t('settings.title')) + '">' + uiIcon('settings') + '</button>';
  h += '<button class="hbtn" onclick="showAccountModal()" title="' + escH(t('acc.title')) + '" aria-label="' + escH(t('acc.title')) + '">' + uiIcon('user') + '</button>';
  h += '<button class="theme-toggle" onclick="toggleLightDark()" title="' + escH(t('settings.theme')) + '" aria-label="' + escH(t('settings.theme')) + '"><span class="theme-icon sun">\u2600\uFE0F</span><span class="theme-icon moon">\u{1F319}</span></button>';
  h += '<a href="https://github.com/Turbonix-X" class="logo" target="_blank" rel="noopener" aria-label="Turbonix Entertainment"><img src="logo.svg" alt="Logo Turbonix" width="44" height="44"></a>';
  h += '</div></div></header>';
  // Bandeaux : dette et evenement
  var alerts = '';
  if (G.rentDebt > 0) {
    alerts += '<div class="debt-warning">' + t('space.debt', { v: fmtMoney(Math.floor(G.rentDebt)) });
    alerts += ' <button class="debt-pay-btn" onclick="doPayDebt()">' + t('debt.pay') + '</button>';
    alerts += '</div>';
  }
  if (G.activeEvent) {
    var remaining = Math.max(0, Math.ceil((G.eventEndTime - Date.now()) / 1000));
    alerts += '<div class="event-banner">\u26A1 ' + t('event.' + G.activeEvent, { t: remaining }) + '</div>';
  }
  if (alerts) h += '<div class="hdr-alerts">' + alerts + '</div>';
  setHTML(el, h);
  // L'argent rebondit quand il augmente
  if (typeof renderHeader._money === 'number' && G.money > renderHeader._money + 0.5) {
    fxBump(el.querySelector('.money-display'), 1.14);
  }
  renderHeader._money = G.money;
  // Rebirth banner
  var rb = document.getElementById('rebirth-banner');
  if (rb) {
    if (canRebirth()) {
      var next = getNextRebirth();
      setHTML(rb, '<div class="rebirth-banner-inner" onclick="showRebirthModal()">' +
        '\u{1F31F} ' + t('rebirth.banner') + ' - ' + next.name +
        ' (' + t('rebirth.bonus', { v: Math.floor(next.bonus * 100) }) + ')' +
        '</div>');
      rb.style.display = 'block';
    } else {
      rb.style.display = 'none';
    }
  }
}

// ============ TABS ============
function renderTabs() {
  var el = document.getElementById('tabs');
  if (!el) return;
  var tabs = ['rec', 'sell', 'bld', 'emp', 'ach', 'stats'];
  var h = '<div class="gtab-track"><span class="gtab-ind" style="--i:' + tabs.indexOf(currentTab) + '"></span></div>';
  for (var i = 0; i < tabs.length; i++) {
    var cls = currentTab === tabs[i] ? 'gtab active' : 'gtab';
    h += '<button class="' + cls + '" onclick="switchTab(\'' + tabs[i] + '\')">' + uiIcon(tabs[i]) + '<span>' + t('tab.' + tabs[i]) + '</span>';
    // Candidatures en attente : la pastille est sur l'onglet Employes
    if (tabs[i] === 'emp' && G.applicants && G.applicants.length > 0) {
      h += '<span class="applicant-badge">' + G.applicants.length + '</span>';
    }
    h += '</button>';
  }
  setHTML(el, h);
}

function switchTab(tab) {
  var changed = currentTab !== tab;
  currentTab = tab;
  renderTabs();
  // Nouvel onglet : on vide le panneau pour rejouer l'entree des cartes
  var panel = document.getElementById('main-panel');
  if (changed && panel) {
    panel.innerHTML = '';
    panel._lastHTML = null;
    panel.scrollTop = 0;
  }
  renderMainPanel();
  // Tutorial progression
  if (tab === 'rec' && G.tutorialStep === 1) {
    G.tutorialStep = 2;
    renderTutorial();
  }
  if (tab === 'sell' && G.tutorialStep === 3) {
    G.tutorialStep = 4;
    renderTutorial();
  }
}

// ============ INGREDIENTS GRID ============
function renderIngredients() {
  var el = document.getElementById('ingredients');
  if (!el) return;
  var h = '<h2>' + t('ing.title') + '</h2><div class="ing-grid">';
  var shown = 0;
  for (var i = 0; i < ING.length; i++) {
    var ing = ING[i];
    if (ing.unlockLvl > G.level + 3) continue;
    if (ing.unlockLvl > G.level) {
      h += '<div class="ing-card locked"><div class="ing-emoji">\u{1F512}</div>';
      h += '<div class="ing-name">' + t('ing.locked', { v: ing.unlockLvl }) + '</div></div>';
      shown++;
      if (shown > 24) break;
      continue;
    }
    var count = G.ing[ing.id] || 0;
    var perClick = clickMult(ing.id);
    var auto = autoRate(ing.id);
    var cost = getIngredientCost(ing);
    var canAfford = G.money >= cost;
    h += '<div class="ing-card' + (canAfford ? '' : ' cant-afford') + '" data-ing="' + ing.id + '" onmousedown="if(event.target.tagName!==\'BUTTON\')doClickIngredient(\'' + ing.id + '\')" ontouchstart="if(event.target.tagName!==\'BUTTON\'){doClickIngredient(\'' + ing.id + '\');event.preventDefault();}">';
    h += '<div class="ing-emoji">' + ing.e + '</div>';
    h += '<div class="ing-name">' + t('i.' + ing.id) + '</div>';
    h += '<div class="ing-count">' + fmt(count) + '</div>';
    h += '<div class="ing-info">' + t('ing.perClick', { v: perClick }) + '</div>';
    if (auto > 0) h += '<div class="ing-auto">' + t('ing.autoRate', { v: fmt(auto) }) + '</div>';
    h += '<div class="ing-cost">' + t('ing.cost', { v: fmtMoney(cost) }) + '</div>';
    h += '<div class="ing-actions">';
    // Resell button (toujours en place, invisible a 0, pour que les cartes ne bougent pas)
    h += '<button class="btn-tiny' + (count > 0 ? '' : ' ghosted') + '" onclick="event.stopPropagation();doResellIngredient(\'' + ing.id + '\')">' + t('ing.resell') + ' ' + fmtMoney(getIngredientResellPrice(ing)) + '</button>';
    // Craft button for craftable ingredients
    if (ing.craftable) {
      h += '<button class="btn-tiny btn-craft" onclick="event.stopPropagation();doCraftIngredient(\'' + ing.id + '\')">' + t('ing.craftBtn') + '</button>';
    }
    h += '</div></div>';
    shown++;
  }
  h += '</div>';
  setHTML(el, h);
}

function doClickIngredient(ingId) {
  var status = checkAntiClick();
  if (status === 'captcha') { showCaptchaModal(); return; }
  if (status === 'cooldown') {
    var remaining = Math.ceil((antiClick.cooldownUntil - Date.now()) / 1000);
    toast(t('anticlick.cooldown', { v: remaining }));
    return;
  }
  var ing = null;
  for (var i = 0; i < ING.length; i++) { if (ING[i].id === ingId) { ing = ING[i]; break; } }
  if (!ing) return;
  var cost = buyIngredient(ing, 1);
  if (cost !== false) {
    playClickSound();
    renderIngredients();
    renderHeader();
    fxIngredient(ingId, clickMult(ing.id));
    // Tutorial
    if (G.tutorialStep === 0 && !G.tutorialDone) {
      G.tutorialStep = 1;
      renderTutorial();
    }
  }
}

function doResellIngredient(ingId) {
  var ing = null;
  for (var i = 0; i < ING.length; i++) { if (ING[i].id === ingId) { ing = ING[i]; break; } }
  if (!ing) return;
  var have = G.ing[ingId] || 0;
  var amount = Math.min(have, 10);
  if (amount <= 0) return;
  var earned = resellIngredient(ing, amount);
  if (earned > 0) {
    toast(t('sell.earned', { v: fmtMoney(earned), q: amount, e: ing.e }));
    renderIngredients();
    renderHeader();
  }
}

function doCraftIngredient(ingId) {
  var ing = null;
  for (var i = 0; i < ING.length; i++) { if (ING[i].id === ingId) { ing = ING[i]; break; } }
  if (!ing || !ing.craftable) return;
  if (startIngredientCraft(ing)) {
    toast(t('ing.craftTime', { v: fmtTime(ing.craftTime * craftSpeedMult()) }));
    renderIngredients();
    renderCraftingBar();
  } else {
    toast(t('rec.noIng'));
  }
}

// ============ MAIN PANEL ============
function renderMainPanel() {
  switch (currentTab) {
    case 'rec': renderRecipes(); break;
    case 'sell': renderSell(); break;
    case 'bld': renderBuildings(); break;
    case 'emp': renderEmployees(); break;
    case 'ach': renderAchievements(); break;
    case 'stats': renderStats(); break;
  }
}

// ============ RECIPES ============
function renderRecipes() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  var h = '<h2>' + t('rec.title') + '</h2>';
  for (var i = 0; i < REC.length; i++) {
    var rec = REC[i];
    if (rec.unlockLvl > G.level + 2) continue;
    if (rec.unlockLvl > G.level) {
      h += '<div class="rec-card locked"><span class="rec-emoji">\u{1F512}</span> ' + t('ing.locked', { v: rec.unlockLvl }) + '</div>';
      continue;
    }
    var can = canMake(rec);
    var spaceOk = canFitRecipe(rec);
    h += '<div class="rec-card' + (!can || !spaceOk ? ' disabled' : '') + '">';
    h += '<span class="rec-emoji">' + rec.e + '</span>';
    h += '<div class="rec-info">';
    h += '<div class="rec-name">' + t('r.' + rec.id) + '</div>';
    h += '<div class="rec-req">';
    var keys = Object.keys(rec.req);
    for (var j = 0; j < keys.length; j++) {
      var need = rec.req[keys[j]];
      var have = G.ing[keys[j]] || 0;
      var cls = have >= need ? 'has' : 'missing';
      h += '<span class="' + cls + '">' + getIngEmoji(keys[j]) + fmt(have) + '/' + fmt(need) + '</span> ';
    }
    h += '</div>';
    h += '<div class="rec-details">';
    h += '<span class="rec-time">' + uiIcon('clock') + t('rec.time', { v: fmtTime(getCraftDuration(rec)) }) + '</span>';
    h += '<span class="rec-xp">' + uiIcon('spark') + t('rec.xp', { v: fmt(Math.floor(rec.xp * xpMult())) }) + '</span>';
    h += '<span class="rec-space">' + uiIcon('area') + rec.space + 'm\u00b2</span>';
    h += '<span class="rec-price">' + fmtMoney(rec.val) + '</span>';
    h += '</div></div>';
    h += '<button class="btn btn-primary rec-btn" onclick="doCraft(\'' + rec.id + '\')"' + (!can || !spaceOk ? ' disabled' : '') + '>' + t('rec.prepare') + '</button>';
    h += '</div>';
  }
  setHTML(el, h);
}

function getIngEmoji(ingId) {
  for (var i = 0; i < ING.length; i++) { if (ING[i].id === ingId) return ING[i].e; }
  return '';
}

function doCraft(recId) {
  var rec = null;
  for (var i = 0; i < REC.length; i++) { if (REC[i].id === recId) { rec = REC[i]; break; } }
  if (!rec) return;
  if (startCraft(rec)) {
    toast(t('rec.prepared', { e: rec.e, q: rec.qty, n: t('r.' + rec.id) }));
    renderRecipes();
    renderIngredients();
    renderHeader();
    renderCraftingBar();
    renderSpaceBar();
    // Tutorial
    if (G.tutorialStep === 2) {
      G.tutorialStep = 3;
      renderTutorial();
    }
  }
}

// ============ SELL PANEL ============
function renderSell() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  var h = '<h2>' + t('sell.title') + '</h2>';
  // Sell all button
  h += '<button class="btn btn-primary btn-sell-all" onclick="doSellAllClick()">' + t('sell.sellAllGlobal') + '</button>';
  var hasAnything = false;
  for (var i = 0; i < REC.length; i++) {
    var rec = REC[i];
    if (rec.unlockLvl > G.level) continue;
    var stock = G.cakes[rec.id] || 0;
    // Filter: only show if stock > 0 or auto-seller active
    var hasSeller = false;
    for (var e = 0; e < G.employees.length; e++) {
      if (G.employees[e].type === 'seller' && G.employees[e].status === 'working') { hasSeller = true; break; }
    }
    if (stock <= 0 && !hasSeller) continue;
    var price = inflatedPrice(rec);
    var inflPct = inflationPct(rec);
    h += '<div class="sell-card">';
    h += '<span class="sell-emoji">' + rec.e + '</span>';
    h += '<div class="sell-info">';
    h += '<div class="sell-name">' + t('r.' + rec.id) + '</div>';
    h += '<div class="sell-stock">' + t('sell.stock', { v: fmt(stock) }) + '</div>';
    h += '<div class="sell-price">' + fmtMoney(price) + '/pc';
    // Inflation indicator
    if (inflPct > 0) {
      h += ' <span class="infl-up">' + t('sell.inflUp', { v: inflPct }) + '</span>';
    } else if (inflPct < 0) {
      h += ' <span class="infl-down">' + t('sell.inflDown', { v: inflPct }) + '</span>';
    }
    h += '</div></div>';
    h += '<div class="sell-btns">';
    h += '<button class="btn btn-small sell-btn-single" onclick="doSellClick(\'' + rec.id + '\',1,this)"' + (stock < 1 ? ' disabled' : '') + '>' + t('sell.sell') + '</button>';
    if (stock > 1) {
      h += '<button class="btn btn-small btn-primary sell-btn-all" onclick="doSellClick(\'' + rec.id + '\',' + stock + ',this)">' + t('sell.sellAll') + ' (' + fmt(stock) + ')</button>';
    }
    h += '</div></div>';
    hasAnything = true;
  }
  if (!hasAnything) h += '<p style="text-align:center;opacity:0.6">' + t('sell.noStock') + '</p>';
  setHTML(el, h);
}

function doSellClick(recId, qty, btnElem) {
  var rec = null;
  for (var i = 0; i < REC.length; i++) { if (REC[i].id === recId) { rec = REC[i]; break; } }
  if (!rec) return;
  var earned = doSell(rec, qty);
  if (earned > 0) {
    playSellSound();
    showFloatingMoney(earned, btnElem);
    renderSell();
    renderHeader();
    renderSpaceBar();
    // Tutorial
    if (G.tutorialStep === 4) {
      G.tutorialDone = true;
      G.tutorialStep = 5;
      renderTutorial();
    }
  }
}

function doSellAllClick() {
  var earned = doSellAll();
  if (earned > 0) {
    showFloatingMoney(earned, null);
    toast(t('sell.earned', { v: fmtMoney(earned), q: '', e: '' }));
    renderSell();
    renderHeader();
    renderSpaceBar();
  }
}

// ============ BUILDINGS ============
function renderBuildings() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  var h = '<h2>' + t('bld.title') + '</h2>';
  for (var i = 0; i < BUILDINGS.length; i++) {
    var bld = BUILDINGS[i];
    if (bld.unlockLvl > G.level + 3) continue;
    if (bld.unlockLvl > G.level) {
      h += '<div class="bld-card locked"><span>\u{1F512}</span> ' + t('bld.locked', { v: bld.unlockLvl }) + '</div>';
      continue;
    }
    var qty = (G.buildings[bld.id] || { qty: 0 }).qty;
    var cost = buildingCost(bld);
    var canBuy = G.money >= cost;
    h += '<div class="bld-card">';
    h += '<span class="bld-emoji">' + bld.e + '</span>';
    h += '<div class="bld-info">';
    h += '<div class="bld-name">' + t('b.' + bld.id) + ' <span class="bld-qty">' + t('bld.qty', { v: qty }) + '</span></div>';
    h += '<div class="bld-prod">' + t('bld.prod', { v: fmt(bld.baseRate * qty) }) + ' ' + getIngEmoji(bld.produces) + ' ' + t('i.' + bld.produces) + '</div>';
    h += '<div class="bld-cost">' + t('bld.cost', { v: fmtMoney(cost) }) + '</div>';
    h += '</div>';
    h += '<button class="btn btn-primary" onclick="doBuyBuilding(\'' + bld.id + '\',1)"' + (!canBuy ? ' disabled' : '') + '>' + t('bld.buy') + '</button>';
    h += '</div>';
  }
  setHTML(el, h);
}

function doBuyBuilding(bldId, amount) {
  var bld = null;
  for (var i = 0; i < BUILDINGS.length; i++) { if (BUILDINGS[i].id === bldId) { bld = BUILDINGS[i]; break; } }
  if (!bld) return;
  var bought = buyBuilding(bld, amount);
  if (bought > 0) {
    toast(t('bld.bought', { n: t('b.' + bld.id) + ' x' + bought }));
    renderBuildings();
    renderHeader();
  }
}

// ============ EMPLOYEES ============
function renderEmployees() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  var h = '<h2>' + t('emp.title') + '</h2>';
  // Total salary
  var totalSal = 0;
  for (var i = 0; i < G.employees.length; i++) totalSal += getEmpSalary(G.employees[i]);
  if (totalSal > 0) h += '<div class="emp-total-salary">' + t('emp.totalSalary', { v: fmtMoney(totalSal) }) + '</div>';
  // Applicants
  if (G.applicants && G.applicants.length > 0) {
    h += '<div class="applicants-section"><h4>' + t('emp.applicants') + ' (' + G.applicants.length + ')</h4>';
    for (var i = 0; i < G.applicants.length; i++) {
      var app = G.applicants[i];
      var remaining = Math.max(0, Math.ceil((app.expiresAt - Date.now()) / 1000));
      h += '<div class="applicant-card">';
      h += '<span class="app-name">' + escH(app.name) + '</span>';
      h += '<span class="app-type">' + t('emp.' + app.type) + '</span>';
      h += '<span class="app-skill">Niv. 1</span>';
      h += '<span class="app-cost">' + fmtMoney(app.hireCost) + '</span>';
      h += '<span class="app-timer">' + remaining + 's</span>';
      h += '<button class="btn btn-small btn-primary" onclick="doAcceptApplicant(' + app.id + ')">' + t('emp.accept') + '</button>';
      h += '<button class="btn btn-small btn-danger" onclick="doRejectApplicant(' + app.id + ')">' + t('emp.reject') + '</button>';
      h += '</div>';
    }
    h += '</div>';
  } else {
    h += '<p class="no-applicants">' + t('emp.noApplicants') + '</p>';
  }
  // Current employees
  if (G.employees.length > 0) {
    h += '<div class="emp-list">';
    for (var i = 0; i < G.employees.length; i++) {
      var emp = G.employees[i];
      var moraleColor = emp.morale > 60 ? 'morale-good' : (emp.morale > 30 ? 'morale-mid' : 'morale-bad');
      var statusKey = 'emp.' + emp.status;
      var statusCls = emp.status === 'working' ? 'status-good' : (emp.status === 'striking' ? 'status-bad' : 'status-warn');
      h += '<div class="emp-card" onclick="showEmpInfoModal(' + emp.id + ')">';
      h += '<div class="emp-header">';
      h += '<span class="emp-name">' + escH(emp.name) + '</span>';
      h += '<span class="emp-type">' + t('emp.' + emp.type) + '</span>';
      h += '<span class="emp-status ' + statusCls + '">' + t(statusKey) + '</span>';
      h += '<span class="emp-skill-badge">Niv. ' + (emp.level || 1) + '</span>';
      h += '</div>';
      h += '<div class="emp-morale-bar"><div class="emp-morale-fill ' + moraleColor + '" style="width:' + Math.floor(emp.morale) + '%"></div></div>';
      if (emp.type === 'collector') {
        h += '<div class="emp-assign">';
        h += '<select onchange="assignCollector(' + emp.id + ',this.value)" onclick="event.stopPropagation()">';
        for (var j = 0; j < ING.length; j++) {
          if (ING[j].unlockLvl > G.level) continue;
          var sel = emp.assignedIng === ING[j].id ? ' selected' : '';
          h += '<option value="' + ING[j].id + '"' + sel + '>' + t('i.' + ING[j].id) + '</option>';
        }
        h += '</select></div>';
      }
      h += '</div>';
    }
    h += '</div>';
  }
  setHTML(el, h);
}

function assignCollector(empId, ingId) {
  for (var i = 0; i < G.employees.length; i++) {
    if (G.employees[i].id === empId) { G.employees[i].assignedIng = ingId; break; }
  }
}

function doAcceptApplicant(appId) {
  if (acceptApplicant(appId)) {
    toast(t('emp.hire') + ' !');
    renderEmployees();
    renderHeader();
  }
}

function doRejectApplicant(appId) {
  rejectApplicant(appId);
  renderEmployees();
}

function showEmpInfoModal(empId) {
  var emp = null;
  for (var i = 0; i < G.employees.length; i++) { if (G.employees[i].id === empId) { emp = G.employees[i]; break; } }
  if (!emp) return;
  var h = '<h2>' + t('emp.info') + '</h2>';
  h += '<div class="emp-info-modal">';
  h += '<p><strong>' + escH(emp.name) + '</strong></p>';
  h += '<p>' + t('emp.' + emp.type) + '</p>';
  var empLvl = emp.level || 1;
  h += '<p>' + t('emp.morale') + ': ' + Math.floor(emp.morale) + '%</p>';
  h += '<p>Niveau: ' + empLvl + ' (' + empLvl + '/sec)</p>';
  h += '<p>' + t('emp.salary', { v: fmtMoney(getEmpSalary(emp)) }) + '</p>';
  if (emp.type === 'collector') h += '<p>' + t('emp.assign') + ': ' + t('i.' + (emp.assignedIng || 'farine')) + '</p>';
  var trainCost = getTrainCost(emp);
  h += '<button class="btn btn-primary" onclick="doTrainEmployee(' + emp.id + ')">Niveau + (' + fmtMoney(trainCost) + ')</button>';
  h += '<button class="btn btn-danger" onclick="doFireEmployee(' + emp.id + ')">' + t('emp.fire') + '</button>';
  h += '</div>';
  h += '<div class="modal-btns"><button class="btn" onclick="hideModal()">' + t('acc.close') + '</button></div>';
  showModal(h);
}

function doTrainEmployee(empId) {
  if (trainEmployee(empId)) {
    toast(t('emp.train') + ' !');
    hideModal();
    renderEmployees();
    renderHeader();
  }
}

function doFireEmployee(empId) {
  fireEmployee(empId);
  hideModal();
  renderEmployees();
}

// ============ ACHIEVEMENTS ============
function renderAchievements() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  var total = ACHIEVEMENTS.length;
  var unlocked = 0;
  for (var k in G.achievements) { if (G.achievements[k]) unlocked++; }
  var h = '<h2>' + t('ach.title') + ' (' + unlocked + '/' + total + ')</h2><div class="ach-grid">';
  for (var i = 0; i < ACHIEVEMENTS.length; i++) {
    var a = ACHIEVEMENTS[i];
    var done = !!G.achievements[a.id];
    if (done) {
      h += '<div class="ach-item unlocked" title="' + escH(t('ach.' + a.id)) + '">';
      h += '<div class="ach-icon">' + a.icon + '</div>';
      h += '<div class="ach-name">' + t('ach.' + a.id) + '</div></div>';
    } else {
      h += '<div class="ach-item locked">';
      h += '<div class="ach-icon">\u{1F512}</div>';
      h += '<div class="ach-name">' + t('ach.locked') + '</div></div>';
    }
  }
  h += '</div>';
  setHTML(el, h);
}

// ============ STATS TAB ============
function renderStats() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  var playH = Math.floor(G.playTimeMs / 3600000);
  var playM = Math.floor((G.playTimeMs % 3600000) / 60000);
  var h = '<h2>' + t('stats.title') + '</h2><div class="stats-grid">';
  h += '<div class="stat-row"><span>' + t('stats.totalEarned') + '</span><span>' + fmtMoney(G.totalEarned) + '</span></div>';
  h += '<div class="stat-row"><span>' + t('stats.totalCakes') + '</span><span>' + fmt(G.stats.totalCakesMade) + '</span></div>';
  h += '<div class="stat-row"><span>' + t('stats.totalSold') + '</span><span>' + fmt(G.stats.totalSold) + '</span></div>';
  h += '<div class="stat-row"><span>' + t('stats.totalClicks') + '</span><span>' + fmt(G.stats.totalClicks) + '</span></div>';
  h += '<div class="stat-row"><span>' + t('stats.playTime') + '</span><span>' + playH + 'h ' + playM + 'm</span></div>';
  h += '<div class="stat-row"><span>' + t('stats.totalSalary') + '</span><span>' + fmtMoney(G.stats.totalSalaryPaid) + '</span></div>';
  h += '<div class="stat-row"><span>' + t('stats.totalRent') + '</span><span>' + fmtMoney(G.stats.totalRentPaid) + '</span></div>';
  h += '<div class="stat-row"><span>' + t('stats.totalIngCost') + '</span><span>' + fmtMoney(G.stats.totalIngredientCost) + '</span></div>';
  h += '<div class="stat-row"><span>' + t('stats.rebirths') + '</span><span>' + G.rebirth + '</span></div>';
  h += '</div>';
  setHTML(el, h);
}

// ============ SPACE BAR ============
function renderSpaceBar() {
  var el = document.getElementById('space-bar');
  if (!el) return;
  var used = usedSpace();
  var max = G.maxSpace;
  var pct = max > 0 ? Math.min(100, Math.floor(used / max * 100)) : 0;
  var rent = getRentPerHour();
  var h = '<div class="space-row">';
  h += '<div class="space-usage-wrap">';
  h += '<span>' + t('space.label') + ': ' + t('space.text', { u: used.toFixed(1), m: max }) + '</span>';
  h += '<div class="space-bar-bg"><div class="space-bar-fill" style="width:' + pct + '%"></div></div>';
  h += '</div>';
  h += '<span class="space-rent">' + t('space.rent', { v: fmtMoney(Math.floor(rent * 10) / 10) }) + '</span>';
  if (G.spaceBought < SPACE_UPG.length) {
    var su = SPACE_UPG[G.spaceBought];
    var canBuy = G.money >= su.cost && G.level >= su.lvlReq;
    if (G.level < su.lvlReq) {
      h += '<button class="btn btn-small" disabled>' + t('space.locked', { v: su.lvlReq }) + '</button>';
    } else {
      h += '<button class="btn btn-small btn-primary" onclick="doBuySpace()"' + (!canBuy ? ' disabled' : '') + '>' + t('space.buy', { a: su.add, c: fmtMoney(su.cost) }) + '</button>';
    }
  } else {
    h += '<span>' + t('space.max') + '</span>';
  }
  h += '</div>';
  setHTML(el, h);
}

function doBuySpace() {
  if (G.spaceBought >= SPACE_UPG.length) return;
  var su = SPACE_UPG[G.spaceBought];
  if (G.money < su.cost || G.level < su.lvlReq) return;
  G.money -= su.cost;
  G.maxSpace += su.add;
  G.spaceBought++;
  renderSpaceBar();
  renderHeader();
}

// ============ CRAFTING BAR (grouped by recipe) ============
function renderCraftingBar() {
  var el = document.getElementById('crafting-bar');
  if (!el) return;
  if (G.crafting.length === 0) { setHTML(el, ''); return; }
  var now = Date.now();
  // Group crafts by recId/ingId
  var groups = {};
  for (var i = 0; i < G.crafting.length; i++) {
    var c = G.crafting[i];
    var key = c.isIngCraft ? ('ing_' + c.ingId) : c.recId;
    if (!groups[key]) {
      groups[key] = { items: [], key: key, isIng: !!c.isIngCraft, id: c.isIngCraft ? c.ingId : c.recId };
    }
    groups[key].items.push(c);
  }
  var h = '';
  var keys = Object.keys(groups);
  for (var g = 0; g < keys.length; g++) {
    var grp = groups[keys[g]];
    // Show the first (soonest) craft progress
    var first = grp.items[0];
    var elapsed = now - first.startTime;
    var pct = Math.min(100, Math.floor(elapsed / first.duration * 100));
    var remaining = Math.max(0, (first.duration - elapsed) / 1000);
    var emoji = '\u{1F382}';
    var name = grp.id;
    if (grp.isIng) {
      for (var x = 0; x < ING.length; x++) { if (ING[x].id === grp.id) { emoji = ING[x].e; name = t('i.' + grp.id); break; } }
    } else {
      for (var r = 0; r < REC.length; r++) { if (REC[r].id === grp.id) { emoji = REC[r].e; name = t('r.' + grp.id); break; } }
    }
    var countTxt = grp.items.length > 1 ? ' x' + grp.items.length : '';
    h += '<div class="craft-item">';
    h += '<span class="craft-emoji">' + emoji + '</span>';
    h += '<div class="craft-progress-wrap">';
    h += '<div class="craft-progress" style="width:' + pct + '%"></div>';
    h += '<span class="craft-label">' + name + countTxt + ' - ' + fmtTime(remaining) + '</span>';
    h += '</div></div>';
  }
  setHTML(el, h);
}

// ============ MODALS ============
var modalCloseTimer = null;

// extraClass : classe en plus sur la fenetre (ex. la console)
function showModal(content, extraClass) {
  var el = document.getElementById('modal-overlay');
  if (!el) return;
  if (modalCloseTimer) { clearTimeout(modalCloseTimer); modalCloseTimer = null; }
  var wasClosing = el.classList.contains('closing');
  el.classList.remove('closing');
  var cls = 'modal' + (extraClass ? ' ' + extraClass : '');
  var existing = el.querySelector('.modal');
  if (existing && !wasClosing && el.style.display === 'flex' && existing.className === cls) {
    // Meme fenetre deja ouverte (ex. un reglage change) : pas de nouvelle animation
    var top = existing.scrollTop;
    existing.innerHTML = iconify(content);
    existing.scrollTop = top;
  } else {
    el.innerHTML = '<div class="' + cls + '">' + iconify(content) + '</div>';
  }
  el.style.display = 'flex';
  var modalMouseDownTarget = null;
  el.onmousedown = function(e) { modalMouseDownTarget = e.target; };
  el.onmouseup = function(e) {
    if (e.target === el && modalMouseDownTarget === el) hideModal();
    modalMouseDownTarget = null;
  };
  el.onclick = null;
}

function hideModal() {
  var el = document.getElementById('modal-overlay');
  if (!el || el.style.display === 'none') return;
  el.classList.add('closing');
  if (modalCloseTimer) clearTimeout(modalCloseTimer);
  modalCloseTimer = setTimeout(function() {
    el.style.display = 'none';
    el.innerHTML = '';
    el.classList.remove('closing');
    modalCloseTimer = null;
  }, 160);
}

function showRebirthModal() {
  var rb = getNextRebirth();
  if (!rb) return;
  var h = '<h2>' + t('rebirth.title') + '</h2>';
  h += '<p>' + t('rebirth.desc', { name: rb.name }) + '</p>';
  h += '<p class="warning">' + t('rebirth.warning') + '</p>';
  h += '<p>' + t('rebirth.cost', { v: fmtMoney(rb.cost) }) + '</p>';
  h += '<p>' + t('rebirth.bonus', { v: Math.floor(rb.bonus * 100) }) + '</p>';
  h += '<div class="modal-btns">';
  h += '<button class="btn btn-primary" onclick="doRebirthConfirm()">' + t('rebirth.btn') + '</button>';
  h += '<button class="btn" onclick="hideModal()">' + t('rebirth.cancel') + '</button>';
  h += '</div>';
  showModal(h);
}

function doRebirthConfirm() {
  if (doRebirth()) {
    hideModal();
    toast(t('rebirth.done', { name: G.bakeryName, n: G.rebirth }));
    fullRender();
  }
}

function showAccountModal() {
  var h = '<h2>' + t('acc.title') + '</h2>';
  if (ACCOUNT.loggedIn) {
    h += '<p>' + t('acc.welcome', { n: ACCOUNT.username }) + '</p>';
    h += '<div class="modal-btns">';
    h += '<button class="btn btn-primary" onclick="doSaveAccount()">' + t('acc.save') + '</button>';
    h += '<button class="btn btn-danger" onclick="doLogout()">' + t('acc.logout') + '</button>';
    h += '<button class="btn" onclick="hideModal()">' + t('acc.close') + '</button>';
    h += '</div>';
  } else {
    h += '<input id="acc-user" placeholder="' + t('acc.user') + '" />';
    h += '<input id="acc-pass" type="password" placeholder="' + t('acc.pass') + '" />';
    h += '<div class="modal-btns">';
    h += '<button class="btn btn-primary" onclick="doLogin()">' + t('acc.login') + '</button>';
    h += '<button class="btn" onclick="hideModal()">' + t('acc.close') + '</button>';
    h += '</div>';
  }
  showModal(h);
}

function doLogin() {
  var u = document.getElementById('acc-user').value;
  var p = document.getElementById('acc-pass').value;
  var res = loginAccount(u, p);
  if (res.ok) { hideModal(); toast(t(res.msg, { n: u })); fullRender(); }
  else toast(t(res.msg));
}
function doRegister() {
  var u = document.getElementById('acc-user').value;
  var p = document.getElementById('acc-pass').value;
  var res = registerAccount(u, p);
  if (res.ok) { hideModal(); toast(t(res.msg)); fullRender(); }
  else toast(t(res.msg));
}
function doSaveAccount() { save(); toast(t('acc.saved')); }
function doLogout() { logoutAccount(); hideModal(); toast(t('acc.bye')); renderHeader(); }

function showRenameModal() {
  var h = '<h2>' + t('rename.title') + '</h2>';
  h += '<input id="rename-input" placeholder="' + t('rename.placeholder') + '" value="' + escH(G.bakeryName) + '" />';
  h += '<div class="modal-btns">';
  h += '<button class="btn btn-primary" onclick="doRename()">' + t('rename.btn') + '</button>';
  h += '<button class="btn" onclick="hideModal()">' + t('acc.close') + '</button>';
  h += '</div>';
  showModal(h);
}

function doRename() {
  var val = document.getElementById('rename-input').value.trim();
  if (val.length > 0 && val.length <= 30) {
    G.bakeryName = val;
    hideModal();
    toast(t('rename.done', { n: val }));
    renderHeader();
  }
}

function showCaptchaModal() {
  var h = '<h2>' + t('anticlick.captcha', { q: antiClick.captchaQuestion }) + '</h2>';
  h += '<input id="captcha-input" type="number" placeholder="?" />';
  h += '<div class="modal-btns"><button class="btn btn-primary" onclick="doCaptcha()">OK</button></div>';
  showModal(h);
}
function doCaptcha() {
  var val = document.getElementById('captcha-input').value;
  if (solveCaptcha(val)) { hideModal(); toast(t('anticlick.ok')); }
  else toast(t('anticlick.wrong'));
}

// ============ SETTINGS MODAL ============
function showSettingsModal() {
  var h = '<h2>' + t('settings.title') + '</h2>';
  // Language
  h += '<div class="settings-section"><h4>' + t('settings.lang') + '</h4><div class="lang-grid">';
  for (var i = 0; i < LANG_LIST.length; i++) {
    var l = LANG_LIST[i];
    var cls = currentLang === l.code ? 'lang-btn active' : 'lang-btn';
    h += '<button class="' + cls + '" onclick="setLanguage(\'' + l.code + '\');showSettingsModal()">' + l.flag + ' ' + l.name + '</button>';
  }
  h += '</div></div>';
  // Currency
  h += '<div class="settings-section"><h4>' + t('settings.currency') + '</h4><div class="currency-grid">';
  for (var i = 0; i < CURRENCIES.length; i++) {
    var c = CURRENCIES[i];
    var cls = G.settings.currency === c.id ? 'currency-btn active' : 'currency-btn';
    h += '<button class="' + cls + '" onclick="setCurrency(\'' + c.id + '\');showSettingsModal()">' + c.symbol + ' ' + c.name + '</button>';
  }
  h += '</div></div>';
  // Theme - show all themes with availability checks
  h += '<div class="settings-section"><h4>' + t('settings.theme') + '</h4><div class="theme-grid">';
  for (var ti = 0; ti < THEME_LIST.length; ti++) {
    var thm = THEME_LIST[ti];
    var available = isThemeAvailable(thm);
    var isActive = G.settings.theme === thm.id;
    var lockReason = '';
    if (!available) {
      var reqLvl = THEME_LEVELS[thm.id] || 0;
      if (reqLvl > 0 && G.level < reqLvl) {
        lockReason = t('settings.themeLevelLock', { v: reqLvl });
      } else if (thm.requiresNature && !hasAllNatureThemes()) {
        lockReason = t('settings.themeNatureLock');
      } else if (thm.seasonal) {
        lockReason = t('settings.themeDateLock', { d: thm.seasonal.day + '/' + thm.seasonal.month });
      } else if (thm.birthday) {
        lockReason = t('birthday.happy');
      }
    }
    if (available) {
      h += '<button class="btn' + (isActive ? ' btn-primary' : '') + '" onclick="activateTheme(\'' + thm.id + '\');showSettingsModal()">' + t(thm.langKey) + '</button>';
    } else {
      h += '<button class="btn" disabled title="' + escH(lockReason) + '">' + t(thm.langKey) + ' (' + lockReason + ')</button>';
    }
  }
  h += '</div></div>';
  // Music
  h += '<div class="settings-section"><h4>' + t('settings.music') + '</h4>';
  h += '<div class="music-controls">';
  h += '<button class="music-toggle' + (G.settings.music ? ' on' : '') + '" onclick="toggleMusic();showSettingsModal()">' + (G.settings.music ? t('settings.musicOn') : t('settings.musicOff')) + '</button>';
  if (G.settings.music) {
    h += '<label>' + t('settings.musicTrack') + ': <select onchange="setMusicTrack(this.value);showSettingsModal()">';
    for (var mi = 0; mi < MUSIC_TRACKS.length; mi++) {
      var mt = MUSIC_TRACKS[mi];
      if (G.level >= mt.unlockLvl) {
        var selM = G.settings.musicTrack === mt.id ? ' selected' : '';
        h += '<option value="' + mt.id + '"' + selM + '>' + mt.name + '</option>';
      }
    }
    h += '</select></label>';
    h += '<label>' + t('settings.musicVolume') + ': <input type="range" min="0" max="100" value="' + (G.settings.musicVolume || 30) + '" onchange="setMusicVolume(this.value)"></label>';
  }
  h += '</div></div>';
  // Sound effects
  h += '<div class="settings-section"><h4>' + t('settings.sound') + '</h4>';
  h += '<button class="music-toggle' + (G.settings.soundEnabled ? ' on' : '') + '" onclick="G.settings.soundEnabled=!G.settings.soundEnabled;showSettingsModal()">' + (G.settings.soundEnabled ? t('settings.soundOn') : t('settings.soundOff')) + '</button>';
  h += '</div>';
  // Particles
  h += '<div class="settings-section"><h4>' + t('settings.particles') + '</h4>';
  h += '<button class="music-toggle' + (!G.settings.reducedParticles ? ' on' : '') + '" onclick="toggleParticles();showSettingsModal()">' + (!G.settings.reducedParticles ? t('settings.particlesOn') : t('settings.particlesOff')) + '</button>';
  h += '</div>';
  // Import/Export
  h += '<div class="settings-section import-export-section"><h4>' + t('settings.export') + '</h4>';
  h += '<textarea id="export-area" readonly onclick="this.select()">' + exportSave() + '</textarea>';
  h += '<button class="btn btn-small" onclick="copyExport()">' + t('settings.exportBtn') + '</button>';
  h += '<h4 style="margin-top:10px">' + t('settings.import') + '</h4>';
  h += '<textarea id="import-area" placeholder="' + t('settings.importPlaceholder') + '"></textarea>';
  h += '<button class="btn btn-small btn-primary" onclick="doImportSave()">' + t('settings.importBtn') + '</button>';
  h += '</div>';
  // Reset
  h += '<div class="settings-section"><button class="btn btn-danger" onclick="confirmResetGame()">\u26A0\uFE0F ' + t('settings.reset') + '</button></div>';
  h += '<div class="modal-btns"><button class="btn" onclick="hideModal()">' + t('acc.close') + '</button></div>';
  showModal(h);
}

function setCurrency(id) {
  G.settings.currency = id;
  fullRender();
}

// Met le theme sur la page. Les couleurs de base viennent de data-theme (turbonix.css).
function applyTheme() {
  var theme = (G.settings && G.settings.theme) || 'light';
  document.body.className = theme + (G.settings && G.settings.reducedParticles ? ' reduced-particles' : '');
  document.documentElement.dataset.theme = (theme === 'dark' || theme === 'espace') ? 'dark' : 'light';
}

function setTheme(theme) {
  G.settings.theme = theme;
  applyTheme();
  fullRender();
}

// Interrupteur clair / sombre du header
function toggleLightDark() {
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
}

function activateTheme(themeId) {
  // Record unlock for seasonal/nature themes
  if (!G.unlockedThemes) G.unlockedThemes = {};
  G.unlockedThemes[themeId] = true;
  setTheme(themeId);
}

function toggleParticles() {
  G.settings.reducedParticles = !G.settings.reducedParticles;
  applyTheme();
}

function togglePause() {
  G.paused = !G.paused;
  if (G.paused) {
    showPauseModal();
  } else {
    hideModal();
  }
  renderHeader();
}

function showPauseModal() {
  var h = '<h2>' + t('pause.title') + '</h2>';
  h += '<div class="modal-btns">';
  h += '<button class="btn btn-primary" onclick="togglePause()">' + t('pause.resume') + '</button>';
  if (G.bakeries.length > 1) {
    h += '<button class="btn" onclick="hideModal();showBakeriesModal()">' + t('pause.bakeries') + '</button>';
  }
  h += '</div>';
  showModal(h);
}

// ============ BAKERIES MODAL ============
function showBakeriesModal() {
  var h = '<h2>' + t('bakery.title') + '</h2>';
  for (var i = 0; i < G.bakeries.length; i++) {
    var b = G.bakeries[i];
    var isCurrent = (i === G.currentBakeryIndex);
    var value = getBakeryValueForIndex(i);
    h += '<div class="bakery-card' + (isCurrent ? ' current' : '') + '">';
    h += '<span class="bakery-card-name">' + escH(b.name) + (isCurrent ? ' \u2B50' : '') + '</span>';
    h += '<span>' + t('bakery.value', { v: fmtMoney(value) }) + '</span>';
    if (!isCurrent) {
      h += '<button class="btn btn-small btn-primary" onclick="doSwitchBakery(' + i + ')">' + t('bakery.go') + '</button>';
      h += '<button class="btn btn-small btn-danger" onclick="doSellBakery(' + i + ')">' + t('bakery.sell') + '</button>';
    } else {
      h += '<span class="bakery-current-tag">' + t('bakery.current') + '</span>';
    }
    h += '</div>';
  }
  // Open new
  var newCost = 10000 * Math.pow(3, G.bakeries.length);
  h += '<div class="bakery-new">';
  h += '<button class="btn btn-primary" onclick="doOpenNewBakery()"' + (G.money < newCost ? ' disabled' : '') + '>' + t('bakery.openNew') + ' (' + fmtMoney(newCost) + ')</button>';
  h += '</div>';
  h += '<div class="modal-btns"><button class="btn" onclick="hideModal()">' + t('acc.close') + '</button></div>';
  showModal(h);
}

function doSwitchBakery(index) {
  if (switchToBakery(index)) { hideModal(); fullRender(); }
}
function doSellBakery(index) {
  if (sellBakery(index)) { showBakeriesModal(); renderHeader(); }
}
function doOpenNewBakery() {
  if (openNewBakery()) { hideModal(); fullRender(); }
}

// ============ GAME OVER MODAL ============
function showGameOverModal() {
  var h = '<h2>' + t('gameover.title') + '</h2>';
  h += '<p>' + t('gameover.text') + '</p>';
  h += '<div class="modal-btns">';
  // Can sell cakes?
  var hasCakes = false;
  for (var i = 0; i < REC.length; i++) { if (G.cakes[REC[i].id] > 0) { hasCakes = true; break; } }
  if (hasCakes) {
    h += '<button class="btn btn-primary" onclick="doSellAll();G.gameOver=false;hideModal();fullRender();">' + t('gameover.sellCakes') + '</button>';
  }
  h += '<button class="btn btn-danger" onclick="G=createFreshState();hideModal();fullRender();">' + t('gameover.restart') + '</button>';
  h += '</div>';
  showModal(h);
}

// ============ OFFLINE MODAL ============
function showOfflineModal(result) {
  var h = '<h2>' + t('offline.title') + '</h2>';
  h += '<p>' + t('offline.text', {
    t: fmtTime(result.seconds),
    i: fmt(result.ingredients),
    m: fmtMoney(result.money)
  }) + '</p>';
  h += '<div class="modal-btns"><button class="btn btn-primary" onclick="hideModal()">OK</button></div>';
  showModal(h);
}

// ============ TUTORIAL ============
function renderTutorial() {
  var el = document.getElementById('tutorial-overlay');
  if (!el) return;
  if (G.tutorialDone || G.tutorialStep >= 5) {
    el.style.display = 'none';
    return;
  }
  if (G.tutorialStep === 0 && G.stats.totalClicks > 0) {
    G.tutorialDone = true;
    el.style.display = 'none';
    return;
  }
  var steps = [
    t('tuto.step1'),
    t('tuto.step2'),
    t('tuto.step3'),
    t('tuto.step4'),
    t('tuto.done'),
  ];
  var msg = steps[G.tutorialStep] || '';
  if (!msg) { el.style.display = 'none'; return; }
  el.style.display = 'block';
  el.innerHTML = '<div class="tutorial-tooltip">' +
    '<p>' + msg + '</p>' +
    '<button class="btn btn-small" onclick="skipTutorial()">' + t('tuto.skip') + '</button>' +
    '</div>';
}

function skipTutorial() {
  G.tutorialDone = true;
  G.tutorialStep = 5;
  var el = document.getElementById('tutorial-overlay');
  if (el) el.style.display = 'none';
}

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener('keydown', function(e) {
  // Escape closes modals
  if (e.key === 'Escape') { hideModal(); return; }
  // Ignore if typing in input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
  var tabMap = { '1': 'rec', '2': 'sell', '3': 'bld', '4': 'emp', '5': 'ach', '6': 'stats' };
  if (tabMap[e.key]) { switchTab(tabMap[e.key]); }
});

// ============ FULL RENDER ============
function fullRender() {
  renderHeader();
  renderTabs();
  renderIngredients();
  renderMainPanel();
  renderSpaceBar();
  renderCraftingBar();
  renderTutorial();
}

// ============ DEBT PAYMENT ============
function doPayDebt() {
  if (payDebt()) {
    toast(t('debt.paid', { v: fmtMoney(Math.floor(G.money)) }));
    renderHeader();
    renderSpaceBar();
  } else {
    toast(t('debt.cantPay'));
  }
}

// ============ GAME RESET ============
function confirmResetGame() {
  var h = '<h2>\u26A0\uFE0F ' + t('settings.reset') + '</h2>';
  h += '<p class="warning">' + t('settings.resetConfirm') + '</p>';
  h += '<div class="modal-btns">';
  h += '<button class="btn btn-danger" onclick="doResetGame()">' + t('settings.reset') + '</button>';
  h += '<button class="btn" onclick="showSettingsModal()">' + t('rebirth.cancel') + '</button>';
  h += '</div>';
  showModal(h);
}
function doResetGame() {
  resetGame();
  hideModal();
  fullRender();
  toast(t('settings.resetDone'));
}

// ============ CHEAT CODE (hidden: click logo 5 times) ============
var logoClickCount = 0;
var logoClickTimer = null;

function handleLogoClick() {
  logoClickCount++;
  if (logoClickTimer) clearTimeout(logoClickTimer);
  logoClickTimer = setTimeout(function() { logoClickCount = 0; }, 2000);
  if (logoClickCount >= 5) {
    logoClickCount = 0;
    showAdminPopup();
  }
}

function showAdminPopup() {
  // Remove existing popup if any
  var existing = document.getElementById('admin-popup');
  if (existing) existing.remove();
  var div = document.createElement('div');
  div.id = 'admin-popup';
  div.className = 'admin-popup';
  div.innerHTML = '<h3>' + t('settings.cheatCode') + '</h3>' +
    '<input type="password" id="admin-code-input" placeholder="' + t('settings.cheatPlaceholder') + '" onkeydown="if(event.key===\'Enter\')tryAdminCode()">' +
    '<div><button onclick="tryAdminCode()">OK</button><button class="cancel-btn" onclick="this.parentNode.parentNode.remove()">X</button></div>';
  document.body.appendChild(div);
  setTimeout(function() { var inp = document.getElementById('admin-code-input'); if (inp) inp.focus(); }, 100);
}

function tryAdminCode() {
  var input = document.getElementById('admin-code-input');
  if (input && input.value === '123456789') {
    G.cheatUnlocked = true;
    save();
    toast(t('settings.cheatUnlocked'));
    var popup = document.getElementById('admin-popup');
    if (popup) popup.remove();
    renderConsoleButton();
  } else {
    toast(t('settings.cheatWrong'));
  }
}

// ============ COMMAND CONSOLE ============
var consoleHistory = [];
var lastCommandState = null;

function showCommandConsole() {
  var h = '<div class="console-modal">';
  h += '<h2>' + t('console.title') + '</h2>';
  h += '<div class="console-output" id="console-output">';
  for (var i = 0; i < consoleHistory.length; i++) {
    h += consoleHistory[i] + '\n';
  }
  h += '</div>';
  h += '<div id="console-autocomplete" class="console-autocomplete" style="display:none"></div>';
  h += '<div class="console-input-row">';
  h += '<input type="text" id="console-cmd-input" placeholder="' + t('console.placeholder') + '" onkeydown="handleConsoleKey(event)" oninput="handleConsoleAutocomplete()">';
  h += '<button class="btn btn-small" onclick="execConsoleCmd()">' + t('console.send') + '</button>';
  h += '</div>';
  h += '<div class="modal-btns" style="margin-top:10px;"><button class="btn" onclick="hideModal()">' + t('acc.close') + '</button></div>';
  h += '</div>';
  showModal(h, 'modal-console');
  setTimeout(function() {
    var inp = document.getElementById('console-cmd-input');
    if (inp) inp.focus();
  }, 100);
}

function handleConsoleKey(e) {
  if (e.key === 'Enter') { execConsoleCmd(); return; }
  if (e.key === 'Tab') {
    e.preventDefault();
    var ac = document.getElementById('console-autocomplete');
    if (ac && ac.children.length > 0) {
      var inp = document.getElementById('console-cmd-input');
      if (inp) inp.value = ac.children[0].textContent;
      ac.style.display = 'none';
    }
  }
}

function handleConsoleAutocomplete() {
  var inp = document.getElementById('console-cmd-input');
  var ac = document.getElementById('console-autocomplete');
  if (!inp || !ac) return;
  var val = inp.value.trim().toLowerCase();
  if (!val) { ac.style.display = 'none'; return; }
  // Build list of all commands including ingredients
  var allCmds = CONSOLE_COMMANDS.slice();
  for (var i = 0; i < ING.length; i++) { allCmds.push('/' + ING[i].id); }
  // Filter matching
  var matches = [];
  for (var i = 0; i < allCmds.length; i++) {
    if (allCmds[i].indexOf(val) === 0 || allCmds[i].indexOf('/' + val) === 0) {
      matches.push(allCmds[i]);
    }
  }
  if (matches.length === 0 || (matches.length === 1 && matches[0] === val)) {
    ac.style.display = 'none'; return;
  }
  var html = '';
  for (var i = 0; i < Math.min(matches.length, 10); i++) {
    html += '<div class="console-autocomplete-item" onclick="selectAutocomplete(\'' + matches[i] + '\')">' + matches[i] + '</div>';
  }
  ac.innerHTML = html;
  ac.style.display = 'block';
}

function selectAutocomplete(cmd) {
  var inp = document.getElementById('console-cmd-input');
  if (inp) { inp.value = cmd + ' '; inp.focus(); }
  var ac = document.getElementById('console-autocomplete');
  if (ac) ac.style.display = 'none';
}

function execConsoleCmd() {
  var input = document.getElementById('console-cmd-input');
  if (!input || !input.value.trim()) return;
  var cmd = input.value.trim();
  input.value = '';
  // Hide autocomplete
  var ac = document.getElementById('console-autocomplete');
  if (ac) ac.style.display = 'none';
  // Save undo state before command
  saveUndoState();
  var result = processCommand(cmd);
  consoleHistory.push('<span class="cmd-info">&gt; ' + escH(cmd) + '</span>');
  consoleHistory.push(result);
  if (consoleHistory.length > 100) consoleHistory = consoleHistory.slice(-80);
  var out = document.getElementById('console-output');
  if (out) {
    var txt = '';
    for (var i = 0; i < consoleHistory.length; i++) txt += consoleHistory[i] + '\n';
    out.innerHTML = txt;
    out.scrollTop = out.scrollHeight;
  }
  fullRender();
}

function processCommand(cmd) {
  var parts = cmd.toLowerCase().replace(/^\//, '').split(/\s+/);
  if (parts.length === 0) return '<span class="cmd-err">Commande vide</span>';
  var action = parts[0];

  // /help
  if (action === 'help') {
    return '<span class="cmd-info">' + t('console.help') + '</span>';
  }

  // /level add|set|remove|max N
  if (action === 'level') {
    var op = parts[1]; var n = parseInt(parts[2]);
    if (isNaN(n) && op !== 'max') return '<span class="cmd-err">Usage: /level add|set|remove|max N</span>';
    if (op === 'add') { for (var i = 0; i < n; i++) { G.level++; checkAchievements(); } G.xp = 0; }
    else if (op === 'set') { G.level = Math.max(1, n); G.xp = 0; checkAchievements(); }
    else if (op === 'remove') { G.level = Math.max(1, G.level - n); G.xp = 0; }
    else if (op === 'max') { G.level = 1000; G.xp = 0; checkAchievements(); }
    else return '<span class="cmd-err">Usage: /level add|set|remove|max N</span>';
    return '<span class="cmd-ok">Level = ' + G.level + '</span>';
  }

  // /money set N [currency]
  if (action === 'money') {
    var op = parts[1]; var n = parseFloat(parts[2]);
    if (op !== 'set' || isNaN(n)) return '<span class="cmd-err">Usage: /money set N [currency]</span>';
    var currId = parts[3] || null;
    if (currId) {
      var curr = null;
      for (var i = 0; i < CURRENCIES.length; i++) {
        if (CURRENCIES[i].id === currId || CURRENCIES[i].symbol.toLowerCase() === currId) { curr = CURRENCIES[i]; break; }
      }
      if (curr) { n = n / curr.rate; }
    }
    G.money = Math.min(n, MONEY_CAP);
    G.totalEarned = Math.max(G.totalEarned, G.money);
    checkAchievements();
    return '<span class="cmd-ok">Money = ' + fmtMoney(G.money) + '</span>';
  }

  // /reset
  if (action === 'reset') {
    resetGame(); fullRender();
    return '<span class="cmd-ok">Game reset!</span>';
  }

  // /max (was /ultimate)
  if (action === 'max') {
    saveBeforeMax();
    G.level = 1000; G.xp = 0;
    G.money = MONEY_CAP; G.totalEarned = MONEY_CAP;
    G.maxSpace = 10000; G.rebirth = 7;
    // All ingredients: 1Ce each (1e24)
    ING.forEach(function(i) { G.ing[i.id] = 1e24; });
    // All cakes
    REC.forEach(function(r) { G.cakes[r.id] = 9999; });
    // All buildings
    BUILDINGS.forEach(function(b) { G.buildings[b.id] = { qty: 999 }; });
    // All achievements
    ACHIEVEMENTS.forEach(function(a) { G.achievements[a.id] = true; });
    // All employee types (one of each at level 1)
    G.employees = [];
    G.nextEmployeeId = 1;
    EMP_TYPES.forEach(function(et) {
      G.employees.push({
        id: G.nextEmployeeId++,
        name: getEmpName(),
        type: et.id,
        morale: 100,
        status: 'working',
        skill: 50,
        level: 1,
        assignedIng: et.id === 'collector' ? 'farine' : null,
        assignedRec: null,
        unpaidTime: 0
      });
    });
    // Boost stats for achievement conditions
    G.stats.totalClicks = 100000;
    G.stats.totalSold = 100000;
    G.totalAllSold = 100000;
    checkAchievements();
    return '<span class="cmd-ok">MAX MODE! Everything maxed!</span>';
  }

  // /unmax - restore before max
  if (action === 'unmax') {
    if (restoreBeforeMax()) return '<span class="cmd-ok">Restored to pre-max state!</span>';
    return '<span class="cmd-err">No max save found.</span>';
  }

  // /undo - restore last command state
  if (action === 'undo') {
    if (restoreUndoState()) return '<span class="cmd-ok">Last command undone!</span>';
    return '<span class="cmd-err">Nothing to undo.</span>';
  }

  // /building set|add|remove|max N
  if (action === 'building' || action === 'buildings') {
    var op = parts[1]; var n = parseInt(parts[2]);
    if (op === 'max') { BUILDINGS.forEach(function(b) { G.buildings[b.id] = { qty: 999 }; }); return '<span class="cmd-ok">All buildings = 999</span>'; }
    if (isNaN(n)) return '<span class="cmd-err">Usage: /building set|add|remove|max N</span>';
    BUILDINGS.forEach(function(b) {
      if (op === 'set') G.buildings[b.id] = { qty: Math.max(0, n) };
      else if (op === 'add') G.buildings[b.id].qty += n;
      else if (op === 'remove') G.buildings[b.id].qty = Math.max(0, G.buildings[b.id].qty - n);
    });
    return '<span class="cmd-ok">Buildings updated (' + op + ' ' + n + ')</span>';
  }

  // /employee ... (multiple sub-commands)
  if (action === 'employee' || action === 'employees') {
    var sub = parts[1];
    // /employee upgrade N - upgrade all employees skill
    if (sub === 'upgrade') {
      var lvl = parseInt(parts[2]);
      if (isNaN(lvl)) return '<span class="cmd-err">Usage: /employee upgrade N</span>';
      lvl = Math.min(100, Math.max(1, lvl));
      G.employees.forEach(function(e) { e.skill = lvl; });
      return '<span class="cmd-ok">All employees skill = ' + lvl + '</span>';
    }
    // /employee <name> level set <N>
    if (parts.length >= 4 && parts[2] === 'level' && parts[3] === 'set') {
      var empName = sub;
      var lvl = parseInt(parts[4]);
      if (isNaN(lvl)) return '<span class="cmd-err">Usage: /employee &lt;name&gt; level set N</span>';
      lvl = Math.min(100, Math.max(1, lvl));
      var found = false;
      for (var i = 0; i < G.employees.length; i++) {
        if (G.employees[i].name.toLowerCase() === empName) {
          G.employees[i].skill = lvl; found = true; break;
        }
      }
      if (found) return '<span class="cmd-ok">' + empName + ' skill = ' + lvl + '</span>';
      return '<span class="cmd-err">Employee not found: ' + empName + '</span>';
    }
    // /employee set|add|remove|max N
    var n = parseInt(parts[2]);
    if (sub === 'max') {
      for (var i = 0; i < 50; i++) {
        var typeIdx = Math.floor(Math.random() * EMP_TYPES.length);
        G.employees.push({ id: G.nextEmployeeId++, name: getEmpName(), type: EMP_TYPES[typeIdx].id, morale: 100, status: 'working', assigned: null, skill: 90 + Math.floor(Math.random() * 11) });
      }
      return '<span class="cmd-ok">50 max-skill employees added!</span>';
    }
    if (isNaN(n)) return '<span class="cmd-err">Usage: /employee set|add|remove|max|upgrade N</span>';
    if (sub === 'add') {
      for (var i = 0; i < n; i++) {
        var typeIdx = Math.floor(Math.random() * EMP_TYPES.length);
        G.employees.push({ id: G.nextEmployeeId++, name: getEmpName(), type: EMP_TYPES[typeIdx].id, morale: 80, status: 'working', assigned: null, skill: 50 + Math.floor(Math.random() * 50) });
      }
    } else if (sub === 'remove') {
      G.employees.splice(Math.max(0, G.employees.length - n), n);
    } else if (sub === 'set') {
      while (G.employees.length > n) G.employees.pop();
      while (G.employees.length < n) {
        var typeIdx = Math.floor(Math.random() * EMP_TYPES.length);
        G.employees.push({ id: G.nextEmployeeId++, name: getEmpName(), type: EMP_TYPES[typeIdx].id, morale: 80, status: 'working', assigned: null, skill: 50 });
      }
    }
    return '<span class="cmd-ok">Employees = ' + G.employees.length + '</span>';
  }

  // /stats max | /stats <stat> set N
  if (action === 'stats') {
    if (parts[1] === 'max') {
      G.stats.totalClicks = 999999; G.stats.totalCakesMade = 999999; G.stats.totalSold = 999999;
      return '<span class="cmd-ok">All stats maxed!</span>';
    }
    // /stats <stat> set N
    var statName = parts[1]; var op = parts[2]; var n = parseInt(parts[3]);
    if (op === 'set' && !isNaN(n)) {
      if (statName === 'clicks') G.stats.totalClicks = n;
      else if (statName === 'cakes') G.stats.totalCakesMade = n;
      else if (statName === 'sold') G.stats.totalSold = n;
      else if (statName === 'salary') G.stats.totalSalaryPaid = n;
      else if (statName === 'rent') G.stats.totalRentPaid = n;
      else return '<span class="cmd-err">Stats: clicks, cakes, sold, salary, rent</span>';
      return '<span class="cmd-ok">' + statName + ' = ' + n + '</span>';
    }
    return '<span class="cmd-err">Usage: /stats max | /stats &lt;stat&gt; set N</span>';
  }

  // /xp add|set N
  if (action === 'xp') {
    var op = parts[1]; var n = parseInt(parts[2]);
    if (isNaN(n)) return '<span class="cmd-err">Usage: /xp add|set N</span>';
    if (op === 'add') addXP(n);
    else if (op === 'set') { G.xp = n; checkAchievements(); }
    return '<span class="cmd-ok">XP = ' + fmt(G.xp) + ' (Level ' + G.level + ')</span>';
  }

  // /space set|add|remove N
  if (action === 'space') {
    var op = parts[1]; var n = parseInt(parts[2]);
    if (op === 'set' && !isNaN(n)) { G.maxSpace = Math.max(1, n); }
    else if (op === 'add' && !isNaN(n)) { G.maxSpace += n; }
    else if (op === 'remove' && !isNaN(n)) { G.maxSpace = Math.max(1, G.maxSpace - n); }
    else return '<span class="cmd-err">Usage: /space set|add|remove N</span>';
    return '<span class="cmd-ok">Space = ' + G.maxSpace + 'm\u00b2</span>';
  }

  // /rebirth set|max N
  if (action === 'rebirth') {
    var op = parts[1]; var n = parseInt(parts[2]);
    if (op === 'max') { G.rebirth = 7; return '<span class="cmd-ok">Rebirth = 7 (max)</span>'; }
    if (op === 'set' && !isNaN(n)) { G.rebirth = Math.min(7, Math.max(0, n)); return '<span class="cmd-ok">Rebirth = ' + G.rebirth + '</span>'; }
    return '<span class="cmd-err">Usage: /rebirth set|max N</span>';
  }

  // /debt clear
  if (action === 'debt') {
    G.rentDebt = 0;
    return '<span class="cmd-ok">Debt cleared!</span>';
  }

  // /theme <name>
  if (action === 'theme') {
    var themeName = parts[1];
    if (!themeName) return '<span class="cmd-err">Usage: /theme &lt;name&gt; (light, dark, nature_fleur, nature_automne, nature_neige, plage, espace, anniversaire)</span>';
    if (typeof THEME_LEVELS[themeName] === 'undefined') return '<span class="cmd-err">Unknown theme: ' + themeName + '</span>';
    if (G.level < THEME_LEVELS[themeName]) return '<span class="cmd-err">Theme locked. Need level ' + THEME_LEVELS[themeName] + '</span>';
    setTheme(themeName);
    return '<span class="cmd-ok">Theme = ' + themeName + '</span>';
  }

  // /birthday set DD MM
  if (action === 'birthday') {
    var day = parseInt(parts[1]);
    var month = parseInt(parts[2]);
    if (isNaN(day) || isNaN(month) || day < 1 || day > 31 || month < 1 || month > 12) {
      return '<span class="cmd-err">Usage: /birthday DD MM</span>';
    }
    G.birthday = { day: day, month: month };
    if (isBirthdayToday()) { activateBirthdayBoost(); }
    return '<span class="cmd-ok">Birthday set to ' + day + '/' + month + '</span>';
  }

  // /buy <ingredient> all|N
  if (action === 'buy') {
    var ingName = parts[1]; var amount = parts[2];
    if (!ingName) return '<span class="cmd-err">Usage: /buy &lt;ingredient&gt; all|N</span>';
    var ing = null;
    for (var i = 0; i < ING.length; i++) { if (ING[i].id === ingName) { ing = ING[i]; break; } }
    if (!ing) return '<span class="cmd-err">Unknown ingredient: ' + ingName + '</span>';
    if (amount === 'all') {
      var bought = 0;
      while (G.money >= getIngredientCost(ing)) { buyIngredient(ing, 1); bought++; if (bought > 99999) break; }
      return '<span class="cmd-ok">Bought ' + bought + 'x ' + ing.id + '</span>';
    }
    var n = parseInt(amount);
    if (isNaN(n)) return '<span class="cmd-err">Usage: /buy ' + ingName + ' all|N</span>';
    for (var i = 0; i < n; i++) { buyIngredient(ing, 1); }
    return '<span class="cmd-ok">Bought ' + n + 'x ' + ing.id + '</span>';
  }

  // /sell <ingredient> all|N
  if (action === 'sell') {
    var ingName = parts[1]; var amount = parts[2];
    if (!ingName) return '<span class="cmd-err">Usage: /sell &lt;ingredient&gt; all|N</span>';
    var ing = null;
    for (var i = 0; i < ING.length; i++) { if (ING[i].id === ingName) { ing = ING[i]; break; } }
    if (!ing) return '<span class="cmd-err">Unknown ingredient: ' + ingName + '</span>';
    var have = G.ing[ing.id] || 0;
    if (amount === 'all') {
      var earned = resellIngredient(ing, have);
      return '<span class="cmd-ok">Sold ' + have + 'x ' + ing.id + ' for ' + fmtMoney(earned) + '</span>';
    }
    var n = parseInt(amount);
    if (isNaN(n)) return '<span class="cmd-err">Usage: /sell ' + ingName + ' all|N</span>';
    n = Math.min(n, have);
    var earned = resellIngredient(ing, n);
    return '<span class="cmd-ok">Sold ' + n + 'x ' + ing.id + ' for ' + fmtMoney(earned) + '</span>';
  }

  // /random
  if (action === 'random') {
    G.money = Math.floor(Math.random() * 100000);
    G.xp = Math.floor(Math.random() * 10000);
    G.totalEarned = G.money;
    ING.forEach(function(i) { G.ing[i.id] = Math.floor(Math.random() * 10000); });
    REC.forEach(function(r) { G.cakes[r.id] = Math.floor(Math.random() * 100); });
    return '<span class="cmd-ok">Everything randomized!</span>';
  }

  // /time set N (1=normal, <1=slow, >1=fast)
  if (action === 'time') {
    if (parts[1] === 'set') {
      var speed = parseFloat(parts[2]);
      if (isNaN(speed) || speed <= 0) return '<span class="cmd-err">Usage: /time set N (0.1 - 10)</span>';
      speed = Math.max(0.1, Math.min(10, speed));
      G.timeSpeed = speed;
      return '<span class="cmd-ok">Time speed = x' + speed + '</span>';
    }
    return '<span class="cmd-err">Usage: /time set N</span>';
  }

  // /patisserie create|remove|theme|ingredients
  if (action === 'patisserie') {
    var sub = parts[1];
    if (sub === 'create') {
      if (openNewBakery()) return '<span class="cmd-ok">New bakery created!</span>';
      return '<span class="cmd-err">Cannot create bakery (not enough money).</span>';
    }
    if (sub === 'remove') {
      var idx = parseInt(parts[2]);
      if (isNaN(idx)) return '<span class="cmd-err">Usage: /patisserie remove &lt;index&gt;</span>';
      if (sellBakery(idx)) return '<span class="cmd-ok">Bakery ' + idx + ' sold!</span>';
      return '<span class="cmd-err">Cannot sell bakery ' + idx + '</span>';
    }
    if (sub === 'theme') {
      var themeName = parts[2];
      if (!themeName) return '<span class="cmd-err">Usage: /patisserie theme &lt;name&gt;</span>';
      setTheme(themeName);
      return '<span class="cmd-ok">Theme = ' + themeName + '</span>';
    }
    if (sub === 'ingredients') {
      var list = [];
      ING.forEach(function(i) { if (G.ing[i.id] > 0) list.push(i.id + ': ' + G.ing[i.id]); });
      return '<span class="cmd-info">' + (list.length > 0 ? list.join(', ') : 'No ingredients') + '</span>';
    }
    return '<span class="cmd-err">Usage: /patisserie create|remove|theme|ingredients</span>';
  }

  // /gameover
  if (action === 'gameover') {
    G.gameOver = true;
    showGameOverModal();
    return '<span class="cmd-ok">Game Over triggered!</span>';
  }

  // /oeufs (alias for oeuf ingredient)
  if (action === 'oeufs' || action === 'oeuf') {
    var op = parts[1]; var n; var unit = null;
    // Handle liquid-style: /oeufs set 53
    n = parseInt(parts[2]);
    if (isNaN(n) && op !== 'max') return '<span class="cmd-err">Usage: /oeufs set|add|remove|max N</span>';
    if (op === 'set') G.ing.oeuf = Math.max(0, n);
    else if (op === 'add') G.ing.oeuf = (G.ing.oeuf || 0) + n;
    else if (op === 'remove') G.ing.oeuf = Math.max(0, (G.ing.oeuf || 0) - n);
    else if (op === 'max') G.ing.oeuf = 99999;
    return '<span class="cmd-ok">oeufs = ' + (G.ing.oeuf || 0) + '</span>';
  }

  // Check if it's an ingredient name (with liquid unit support)
  var ingMatch = null;
  for (var i = 0; i < ING.length; i++) {
    if (ING[i].id === action) { ingMatch = ING[i]; break; }
  }
  if (ingMatch) {
    var op = parts[1];
    // Check for liquid units: /lait set 53 ml
    var isLiquid = LIQUID_ING && LIQUID_ING.indexOf(ingMatch.id) >= 0;
    var rawN = parts[2]; var unit = parts[3];
    var n;
    if (isLiquid && unit && typeof parseLiquidAmount === 'function') {
      n = parseLiquidAmount(parseFloat(rawN), unit);
    } else {
      n = parseInt(rawN);
    }
    if (isNaN(n) && op !== 'max') return '<span class="cmd-err">Usage: /' + action + ' set|add|remove|max N' + (isLiquid ? ' [ml|cl|l]' : '') + '</span>';
    if (op === 'set') G.ing[ingMatch.id] = Math.max(0, n);
    else if (op === 'add') G.ing[ingMatch.id] = (G.ing[ingMatch.id] || 0) + n;
    else if (op === 'max') G.ing[ingMatch.id] = 99999;
    else if (op === 'remove') G.ing[ingMatch.id] = Math.max(0, (G.ing[ingMatch.id] || 0) - n);
    var display = (G.ing[ingMatch.id] || 0);
    if (isLiquid && typeof fmtLiquid === 'function') display = fmtLiquid(display);
    return '<span class="cmd-ok">' + ingMatch.id + ' = ' + display + '</span>';
  }

  // Check if it's a recipe name
  var recMatch = null;
  for (var i = 0; i < REC.length; i++) {
    if (REC[i].id === action) { recMatch = REC[i]; break; }
  }
  if (recMatch) {
    var op = parts[1]; var n = parseInt(parts[2]);
    if (isNaN(n) && op !== 'max') return '<span class="cmd-err">Usage: /' + action + ' set|add|max N</span>';
    if (op === 'set') G.cakes[recMatch.id] = Math.max(0, n);
    else if (op === 'add') G.cakes[recMatch.id] = (G.cakes[recMatch.id] || 0) + n;
    else if (op === 'max') G.cakes[recMatch.id] = 9999;
    return '<span class="cmd-ok">' + recMatch.id + ' = ' + (G.cakes[recMatch.id] || 0) + '</span>';
  }

  return '<span class="cmd-err">Commande inconnue: ' + escH(action) + '. Tapez /help</span>';
}

// ============ CONSOLE BUTTON (bottom-right) ============
function renderConsoleButton() {
  var wrap = document.getElementById('console-btn-wrap');
  if (!wrap) return;
  if (G.cheatUnlocked) {
    wrap.innerHTML = '<button class="console-float-btn" onclick="showCommandConsole()" title="Console" aria-label="Console">' + uiIcon('terminal') + '</button>';
    wrap.style.display = 'block';
  } else {
    wrap.style.display = 'none';
  }
}

// ============ MUSIC SYSTEM ============
var audioCtx = null;
var currentOscillator = null;
var musicGain = null;
var musicPlaying = false;
var musicInterval = null;

function initMusicSystem() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  musicGain = audioCtx.createGain();
  musicGain.connect(audioCtx.destination);
  musicGain.gain.value = (G.settings.musicVolume || 30) / 100 * 0.15;
}

function toggleMusic() {
  G.settings.music = !G.settings.music;
  if (G.settings.music) startMusic();
  else stopMusic();
}

function startMusic() {
  if (!audioCtx) initMusicSystem();
  if (musicInterval) clearInterval(musicInterval);
  musicPlaying = true;
  playMusicNote();
  var track = getCurrentTrack();
  var tempo = track ? track.tempo : 0.5;
  musicInterval = setInterval(function() { if (musicPlaying) playMusicNote(); }, tempo * 1000);
}

function stopMusic() {
  musicPlaying = false;
  if (musicInterval) { clearInterval(musicInterval); musicInterval = null; }
}

function getCurrentTrack() {
  var trackId = G.settings.musicTrack || 'default';
  for (var i = 0; i < MUSIC_TRACKS.length; i++) {
    if (MUSIC_TRACKS[i].id === trackId) return MUSIC_TRACKS[i];
  }
  return MUSIC_TRACKS[0];
}

function playMusicNote() {
  if (!audioCtx || !musicGain) return;
  var track = getCurrentTrack();
  if (!track) return;
  var notes = track.notes;
  var note = notes[Math.floor(Math.random() * notes.length)];
  var osc = audioCtx.createOscillator();
  var noteGain = audioCtx.createGain();
  osc.connect(noteGain);
  noteGain.connect(musicGain);
  osc.type = 'sine';
  osc.frequency.value = note;
  noteGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  noteGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + track.tempo * 0.9);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + track.tempo * 0.9);
}

function setMusicTrack(trackId) {
  G.settings.musicTrack = trackId;
  if (musicPlaying) { stopMusic(); startMusic(); }
}

function setMusicVolume(val) {
  G.settings.musicVolume = parseInt(val);
  if (musicGain) musicGain.gain.value = val / 100 * 0.15;
}

// ============ IMPORT/EXPORT ============
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
    fullRender();
  } else {
    toast(t('settings.importError'));
  }
}

// ============ LEVEL 1000 CELEBRATION ============
function showLevel1000() {
  var overlay = document.createElement('div');
  overlay.className = 'lvl1000-overlay';
  overlay.id = 'lvl1000-overlay';
  overlay.innerHTML = '<div class="lvl1000-content">' +
    '<h1>\u{1F389} ' + t('lvl1000.title') + ' \u{1F389}</h1>' +
    '<p>' + t('lvl1000.text') + '</p>' +
    '<p style="font-size:3em">\u{1F382}\u{1F451}\u2B50\u{1F31F}\u{1F3C6}</p>' +
    '<button class="btn btn-primary" onclick="document.getElementById(\'lvl1000-overlay\').remove()" style="font-size:1.2em;padding:12px 30px;margin-top:20px">OK</button>' +
    '</div>';
  document.body.appendChild(overlay);
}

// ============ BAN OVERLAY ============
function showBanOverlay(seconds) {
  var existing = document.getElementById('ban-overlay');
  if (existing) existing.remove();
  var div = document.createElement('div');
  div.className = 'ban-overlay';
  div.id = 'ban-overlay';
  var minutes = Math.ceil(seconds / 60);
  div.textContent = t('ban.message', { v: minutes });
  document.body.appendChild(div);
  setTimeout(function() { var el = document.getElementById('ban-overlay'); if (el) el.remove(); }, seconds * 1000);
}

// ============ CURRENCY HOVER ============
function getCurrencyTooltip(curr) {
  return curr.fullName || curr.name;
}

// ============ SOUND EFFECTS (Web Audio API) ============
function playSound(freq, duration, type) {
  if (!G.settings.soundEnabled) return;
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { return; }
  }
  var osc = audioCtx.createOscillator();
  var gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration);
}
function playClickSound() { playSound(800, 0.05, 'square'); }
function playSellSound() { playSound(600, 0.1, 'sine'); playSound(900, 0.1, 'sine'); }
function playSuccessSound() { playSound(523, 0.1, 'sine'); setTimeout(function(){ playSound(659, 0.1, 'sine'); }, 100); setTimeout(function(){ playSound(784, 0.15, 'sine'); }, 200); }

// ============ BIRTHDAY POPUP ============
function showBirthdayModal() {
  var h = '<h2>' + t('birthday.title') + '</h2>';
  h += '<p class="warning">' + t('birthday.warning') + '</p>';
  h += '<div class="birthday-select">';
  h += '<label>' + t('birthday.dayLabel') + ': <select id="bday-day">';
  for (var d = 1; d <= 31; d++) h += '<option value="' + d + '">' + d + '</option>';
  h += '</select></label>';
  h += '<label>' + t('birthday.monthLabel') + ': <select id="bday-month">';
  for (var m = 1; m <= 12; m++) h += '<option value="' + m + '">' + m + '</option>';
  h += '</select></label>';
  h += '</div>';
  h += '<div class="modal-btns">';
  h += '<button class="btn btn-primary" onclick="confirmBirthday()">' + t('birthday.confirm') + '</button>';
  h += '</div>';
  showModal(h);
}

function confirmBirthday() {
  var day = parseInt(document.getElementById('bday-day').value);
  var month = parseInt(document.getElementById('bday-month').value);
  if (day && month) {
    G.birthday = { day: day, month: month };
    hideModal();
    if (isBirthdayToday()) {
      activateBirthdayBoost();
      setTheme('anniversaire');
      toast(t('birthday.boost'));
    }
    save();
  }
}

// ============ UTILITY ============
function escH(str) {
  var d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}
