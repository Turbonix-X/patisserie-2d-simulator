/* ============================================
   PATISSERIE 2D SIMULATOR - INTERFACE
   Affichage : en-tete, onglets, cartes, fenetres
   ============================================ */

var currentTab = 'rec';
var ui = {
  recSearch: '',
  recOnlyMakable: false,
  recOnlyFav: false,
  recSort: 'new',
  ingSearch: '',
  achCat: 'general',
  achDirty: true,
  settingsTab: 'general',
  statsView: 'here',
  chartTable: false,
  pauseTip: null,
  guideCat: 'all',
  guideSearch: '',
};

// ============ UTILITAIRES ============
function escH(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function fmtQty(n) {
  if (n >= 1000) return fmt(n);
  return String(Math.round(n * 100) / 100);
}

function bulkChips() {
  var h = '<div class="bulk-chips" role="group" aria-label="' + escH(t('bulk.label')) + '">';
  BULK_OPTIONS.forEach(function(b) {
    var active = G.settings.bulk === b;
    h += '<button class="chip' + (active ? ' active' : '') + '" aria-pressed="' + active + '" onclick="setBulk(\'' + b + '\')">' + (b === 'max' ? t('bulk.max') : '×' + b) + '</button>';
  });
  return h + '</div>';
}

function setBulk(b) {
  G.settings.bulk = b;
  renderIngredients();
  renderMainPanel();
}

// ============ NOTIFICATIONS ============
var toastCounter = 0;
var activeToasts = {};

function toast(msg) {
  var area = document.getElementById('toast-area');
  if (!area) return;
  if (activeToasts[msg]) {
    var existing = activeToasts[msg];
    existing.count++;
    var countSpan = existing.div.querySelector('.toast-count');
    if (!countSpan) {
      countSpan = document.createElement('span');
      countSpan.className = 'toast-count';
      existing.div.appendChild(countSpan);
    }
    countSpan.textContent = 'x' + existing.count;
    clearTimeout(existing.timer);
    existing.timer = setTimeout(function() { removeToast(msg, existing.div); }, 3000);
    return;
  }
  var div = document.createElement('div');
  div.className = 'notif';
  div.id = 'toast-' + (++toastCounter);
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
  activeToasts[msg] = { div: div, count: 1, timer: setTimeout(function() { removeToast(msg, div); }, 3000) };
}

function removeToast(msg, div) {
  div.classList.add('fade-out');
  setTimeout(function() { if (div.parentNode) div.parentNode.removeChild(div); }, 400);
  delete activeToasts[msg];
}

function showLevelUp(lvl) {
  toast(t('xp.level', { v: lvl }));
  fxLevelUp();
  playSuccessSound();
  if (lvl === 1000 && !G.lvl1000Shown) {
    G.lvl1000Shown = true;
    showLevel1000();
  }
}

function showFloatingMoney(amount, elem) {
  var span = document.createElement('span');
  span.className = 'float-money';
  span.textContent = '+' + fmtMoney(amount);
  if (elem) {
    var rect = elem.getBoundingClientRect();
    span.style.left = (rect.left + rect.width / 2) + 'px';
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

// ============ EN-TETE ============
function renderHeader() {
  var el = document.getElementById('header');
  if (!el) return;
  var xpNeeded = xpForLevel(G.level);
  var xpPct = Math.min(100, Math.floor(G.xp / xpNeeded * 100));
  var h = '<header class="site-header"><div class="header-inner game-header-inner">';
  h += '<div class="hdr-brand">';
  h += '<img class="game-logo" src="logo.svg" alt="" width="40" height="40" onclick="logoClick()">';
  h += '<h1 class="game-name">P2DS</h1>';
  h += '<span class="version-badge">' + GAME_VERSION + '</span>';
  h += '<button class="bakery-name" onclick="showRenameModal()" title="' + escH(t('rename.title')) + '"><span>' + escH(G.bakeryName) + '</span>' + uiIcon('pencil') + '</button>';
  h += '</div>';
  h += '<div class="hdr-stats">';
  h += '<span class="money-display">' + fmtMoney(G.money) + '</span>';
  h += '<span class="level-display">' + t('level', { v: G.level }) + '</span>';
  h += '<div class="xp-bar-container"><div class="xp-bar-fill" style="width:' + xpPct + '%"></div>';
  h += '<span class="xp-bar-text">' + t('xp.text', { c: fmt(Math.floor(G.xp)), n: fmt(xpNeeded) }) + '</span></div>';
  h += '</div>';
  h += '<div class="header-right">';
  h += headerBtn('showBakeriesModal()', t('bakery.title'), 'home');
  var pauseLabel = G.paused ? t('pause.resume') : t('pause.title');
  h += headerBtn('togglePause()', pauseLabel, G.paused ? 'play' : 'pause');
  h += headerBtn('showSettingsModal()', t('settings.title'), 'settings');
  h += '</div></div></header>';
  var alerts = '';
  if (G.rentDebt > 0) {
    alerts += '<div class="debt-warning">' + t('space.debt', { v: fmtMoney(G.rentDebt) });
    alerts += ' <button class="debt-pay-btn" onclick="doPayDebt()">' + t('debt.pay') + '</button>';
    if (G.bankUnlocked) alerts += ' <button class="debt-pay-btn" onclick="switchTab(\'bank\')">' + t('tab.bank') + '</button>';
    alerts += '</div>';
  }
  if (G.activeEvent) {
    var remaining = Math.max(0, Math.ceil((G.eventEndTime - Date.now()) / 1000));
    alerts += '<div class="event-banner">⚡ ' + t('event.' + G.activeEvent, { t: remaining }) + '</div>';
  }
  if (alerts) h += '<div class="hdr-alerts">' + alerts + '</div>';
  setHTML(el, h);
  if (typeof renderHeader._money === 'number' && G.money > renderHeader._money + 0.5) {
    fxBump(el.querySelector('.money-display'), 1.14);
  }
  renderHeader._money = G.money;
  var rb = document.getElementById('rebirth-banner');
  if (rb) {
    if (canRebirth()) {
      var next = getNextRebirth();
      setHTML(rb, '<div class="rebirth-banner-inner" role="button" tabindex="0" onclick="showRebirthModal()">\u{1F31F} ' + t('rebirth.banner') + ' - ' + next.name + ' (' + t('rebirth.bonus', { v: Math.floor(next.bonus * 100) }) + ')</div>');
      rb.style.display = 'block';
    } else {
      rb.style.display = 'none';
    }
  }
}

function headerBtn(action, label, icon, off) {
  var safe = escH(label);
  return '<button class="hbtn' + (off ? ' off' : '') + '" onclick="' + action + '" title="' + safe + '" aria-label="' + safe + '">' + uiIcon(icon) + '</button>';
}

// Le logo ne fait rien... ou presque
function logoClick() {
  G.logoClicks = (G.logoClicks || 0) + 1;
  fxBump(document.querySelector('.game-logo'), 1.15);
  checkAchievements();
}

// ============ ONGLETS ============
function visibleTabs() {
  return G.bankUnlocked ? ['rec', 'sell', 'bld', 'emp', 'bank', 'ach', 'stats'] : ['rec', 'sell', 'bld', 'emp', 'ach', 'stats'];
}

function renderTabs() {
  var el = document.getElementById('tabs');
  if (!el) return;
  var tabs = visibleTabs();
  if (tabs.indexOf(currentTab) < 0) currentTab = 'rec';
  el.style.setProperty('--tabs', tabs.length);
  var h = '<div class="gtab-track"><span class="gtab-ind" style="--i:' + tabs.indexOf(currentTab) + '"></span></div>';
  for (var i = 0; i < tabs.length; i++) {
    var active = currentTab === tabs[i];
    h += '<button class="gtab' + (active ? ' active' : '') + '" onclick="switchTab(\'' + tabs[i] + '\')" title="' + escH(t('tab.key', { v: i + 1 })) + '"' + (active ? ' aria-current="page"' : '') + '>' + uiIcon(tabs[i]) + '<span>' + t('tab.' + tabs[i]) + '</span>';
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
  var panel = document.getElementById('main-panel');
  if (changed && panel) {
    // Nouvel onglet : on vide le panneau pour rejouer l'entree des cartes
    panel.innerHTML = '';
    panel._lastHTML = null;
    panel.scrollTop = 0;
    ui.achDirty = true;
  }
  renderMainPanel();
  tutorialCheck();
}

// ============ INGREDIENTS ============
function renderIngredients() {
  var el = document.getElementById('ingredients');
  if (!el) return;
  var unlocked = ING.filter(function(i) { return i.unlockLvl <= G.level; });
  var h = '<div class="panel-head"><h2>' + t('ing.title') + '</h2>' + bulkChips() + '</div>';
  if (unlocked.length > 12) {
    h += '<input class="panel-search" type="search" placeholder="' + escH(t('ing.search')) + '" value="' + escH(ui.ingSearch) + '" oninput="ui.ingSearch=this.value;renderIngredients()">';
  }
  h += '<div class="ing-grid">';
  var search = ui.ingSearch.trim().toLowerCase();
  var perClick = clickMult();
  var bulk = G.settings.bulk;
  ING.forEach(function(ing) {
    if (ing.unlockLvl > G.level + 3) return;
    if (ing.unlockLvl > G.level) {
      if (!search) h += '<div class="ing-card locked"><div class="ing-emoji">\u{1F512}</div><div class="ing-name">' + t('ing.locked', { v: ing.unlockLvl }) + '</div></div>';
      return;
    }
    var name = t('i.' + ing.id);
    if (search && name.toLowerCase().indexOf(search) < 0) return;
    var count = G.ing[ing.id] || 0;
    var auto = autoRate(ing.id);
    var cost = getIngredientCost(ing);
    h += '<div class="ing-card' + (G.money >= cost ? '' : ' cant-afford') + '" data-ing="' + ing.id + '" role="button" tabindex="0" aria-label="' + escH(name) + '" title="' + escH(name) + '" onclick="if(!event.target.closest(\'button\'))doClickIngredient(\'' + ing.id + '\')" onkeydown="ingKey(event,\'' + ing.id + '\')">';
    h += '<div class="ing-emoji">' + ing.e + '</div>';
    h += '<div class="ing-name">' + name + '</div>';
    h += '<div class="ing-count">' + fmt(count) + '</div>';
    h += '<div class="ing-info">' + t('ing.perClick', { v: bulk === 'max' ? t('bulk.max') : fmtQty(perClick * parseInt(bulk, 10)) }) + '</div>';
    if (auto > 0) h += '<div class="ing-auto">' + t('ing.autoRate', { v: fmtQty(auto) }) + '</div>';
    h += '<div class="ing-cost">' + t('ing.cost', { v: fmtMoney(cost) }) + '</div>';
    h += '<div class="ing-actions">';
    // Toujours en place, invisible a 0, pour que les cartes ne bougent pas
    var resellQty = resellAmount(ing, bulk);
    var resellValue = getIngredientResellPrice(ing) * resellQty;
    h += '<button class="btn-tiny' + (count >= 1 ? '' : ' ghosted') + '" onclick="doResellIngredient(\'' + ing.id + '\')" title="' + escH(t('ing.resellTip', { q: fmtQty(resellQty), v: fmtMoney(resellValue) })) + '">' + t('ing.resell') + ' ' + fmtMoney(resellValue) + '</button>';
    if (ing.craftable) {
      var craftCost = 0;
      for (var k in ing.craftReq) craftCost += findIng(k).cost * ing.craftReq[k];
      h += '<button class="btn-tiny btn-craft" onclick="doCraftIngredient(\'' + ing.id + '\')" title="' + escH(t('ing.craftTip', { q: ing.craftQty, c: fmtMoney(craftCost), b: fmtMoney(ing.cost * ing.craftQty) })) + '">' + t('ing.craftBtn') + ' ×' + ing.craftQty + '</button>';
    }
    h += '</div></div>';
  });
  h += '</div>';
  setHTML(el, h);
}

function ingKey(e, ingId) {
  if (e.target !== e.currentTarget) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    doClickIngredient(ingId);
  }
}

function doClickIngredient(ingId) {
  var status = checkAntiClick();
  if (status === 'banned') { toast(t('anticlick.banned', { v: fmtTime(getBanRemaining()) })); return; }
  if (status === 'captcha') { showCaptchaModal(); return; }
  if (status === 'cooldown') {
    toast(t('anticlick.cooldown', { v: Math.ceil((antiClick.cooldownUntil - Date.now()) / 1000) }));
    return;
  }
  var ing = findIng(ingId);
  if (!ing) return;
  var units = buyIngredient(ing, G.settings.bulk);
  if (units === false) {
    toast(t('ing.noMoney'));
    playErrorSound();
    fxShake(document.querySelector('.ing-card[data-ing="' + ingId + '"]'));
    return;
  }
  playClickSound();
  renderIngredients();
  renderHeader();
  renderMainPanel();
  fxIngredient(ingId, fmtQty(units));
  tutorialCheck();
}

function doResellIngredient(ingId) {
  var ing = findIng(ingId);
  if (!ing) return;
  var amount = resellAmount(ing, G.settings.bulk);
  if (amount <= 0) return;
  var earned = resellIngredient(ing, amount);
  if (earned > 0) {
    toast(t('sell.earned', { v: fmtMoney(earned), q: fmtQty(amount), e: t('i.' + ingId) }));
    renderIngredients();
    renderHeader();
    renderMainPanel();
  }
}

function doCraftIngredient(ingId) {
  var ing = findIng(ingId);
  if (!ing || !ing.craftable) return;
  if (startIngredientCraft(ing)) {
    toast(t('ing.craftTime', { v: fmtTime(ing.craftTime * craftSpeedMult()) }));
    renderIngredients();
    renderCraftingBar();
    renderMainPanel();
  } else {
    toast(t('rec.noIng'));
    playErrorSound();
  }
}

// ============ PANNEAU PRINCIPAL ============
function renderMainPanel() {
  switch (currentTab) {
    case 'rec': renderRecipes(); break;
    case 'sell': renderSell(); break;
    case 'bld': renderBuildings(); break;
    case 'emp': renderEmployees(); break;
    case 'bank': renderBank(); break;
    case 'ach': if (ui.achDirty) renderAchievements(); break;
    case 'stats': renderStats(); break;
  }
}

// ============ RECETTES ============
function recipeProfit(rec) {
  return batchPrice(rec, rec.qty) - recipeCost(rec);
}

function visibleRecipes() {
  var search = ui.recSearch.trim().toLowerCase();
  var list = REC.filter(function(rec) {
    if (rec.unlockLvl > G.level) return false;
    if (ui.recOnlyMakable && craftBlockReason(rec)) return false;
    if (ui.recOnlyFav && !G.favRecipes[rec.id]) return false;
    if (search && t('r.' + rec.id).toLowerCase().indexOf(search) < 0) return false;
    return true;
  });
  if (ui.recSort === 'new') list.reverse();
  else if (ui.recSort === 'profit') list.sort(function(a, b) { return recipeProfit(b) - recipeProfit(a); });
  // Les favoris d'abord
  list.sort(function(a, b) { return (G.favRecipes[b.id] ? 1 : 0) - (G.favRecipes[a.id] ? 1 : 0); });
  return list;
}

function renderRecipes() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  var h = '<div class="panel-head"><h2>' + t('rec.title') + '</h2></div>';
  h += '<div class="list-tools">';
  h += '<input class="panel-search" type="search" placeholder="' + escH(t('rec.search')) + '" value="' + escH(ui.recSearch) + '" oninput="ui.recSearch=this.value;renderRecipes()">';
  h += '<button class="chip' + (ui.recOnlyMakable ? ' active' : '') + '" onclick="ui.recOnlyMakable=!ui.recOnlyMakable;renderRecipes()">' + t('rec.onlyMakable') + '</button>';
  h += '<button class="chip' + (ui.recOnlyFav ? ' active' : '') + '" onclick="ui.recOnlyFav=!ui.recOnlyFav;renderRecipes()">' + uiIcon('star') + t('rec.onlyFav') + '</button>';
  h += '<select class="sort-select" onchange="ui.recSort=this.value;renderRecipes()">';
  [['new', 'rec.sortNew'], ['old', 'rec.sortOld'], ['profit', 'rec.sortProfit']].forEach(function(o) {
    h += '<option value="' + o[0] + '"' + (ui.recSort === o[0] ? ' selected' : '') + '>' + t(o[1]) + '</option>';
  });
  h += '</select></div>';

  // Ce qui arrive bientot
  if (!ui.recSearch && !ui.recOnlyMakable && !ui.recOnlyFav) {
    var next = REC.filter(function(r) { return r.unlockLvl > G.level && r.unlockLvl <= G.level + 2; });
    next.forEach(function(rec) {
      h += '<div class="rec-card locked"><span class="rec-emoji">\u{1F512}</span> ' + t('ing.locked', { v: rec.unlockLvl }) + '</div>';
    });
  }

  var list = visibleRecipes();
  if (list.length === 0) h += '<p class="empty-note">' + t('rec.none') + '</p>';
  list.forEach(function(rec) {
    var block = craftBlockReason(rec);
    h += '<div class="rec-card' + (block ? ' disabled' : '') + '">';
    h += '<span class="rec-emoji">' + rec.e + '</span>';
    h += '<div class="rec-info">';
    h += '<div class="rec-name"><button class="fav-btn' + (G.favRecipes[rec.id] ? ' on' : '') + '" onclick="toggleFav(\'' + rec.id + '\')" title="' + escH(t('rec.fav')) + '" aria-label="' + escH(t('rec.fav')) + '">' + uiIcon('star') + '</button>' + t('r.' + rec.id) + '</div>';
    h += '<div class="rec-req">';
    for (var k in rec.req) {
      var have = G.ing[k] || 0;
      h += '<span class="' + (have >= rec.req[k] ? 'has' : 'missing') + '" title="' + escH(t('i.' + k)) + '">' + getIngEmoji(k) + fmt(have) + '/' + fmt(rec.req[k]) + '</span> ';
    }
    h += '</div>';
    h += '<div class="rec-details">';
    h += '<span class="rec-time">' + uiIcon('clock') + t('rec.time', { v: fmtTime(getCraftDuration(rec)) }) + '</span>';
    h += '<span class="rec-xp">' + uiIcon('spark') + t('rec.xp', { v: fmt(Math.floor(rec.xp * xpMult())) }) + '</span>';
    h += '<span class="rec-space">' + uiIcon('area') + (Math.round(batchSpace(rec) * 10) / 10) + ' m²</span>';
    h += '<span class="rec-money">' + t('rec.cost', { v: fmtMoney(recipeCost(rec)) }) + '</span>';
    h += '<span class="rec-price">' + t('rec.revenue', { v: fmtMoney(batchPrice(rec, rec.qty)) }) + '</span>';
    h += '<span class="rec-profit">' + t('rec.profit', { v: fmtMoney(recipeProfit(rec)) }) + '</span>';
    h += '</div>';
    if (block) {
      h += '<div class="rec-reason">' + t(block === 'ing' ? 'rec.noIng' : block === 'space' ? 'rec.noSpace' : 'rec.queueFull') + '</div>';
    }
    h += '</div>';
    h += '<div class="rec-actions">';
    h += '<button class="btn btn-primary rec-btn" onclick="doCraft(\'' + rec.id + '\')"' + (block ? ' disabled' : '') + '>' + t('rec.prepare') + '</button>';
    if (!block) h += '<button class="btn btn-small" onclick="doCraftMax(\'' + rec.id + '\')">' + t('rec.prepareMax') + '</button>';
    var miss = missingCost(rec);
    if (block === 'ing') {
      h += '<button class="btn btn-small" onclick="doBuyMissing(\'' + rec.id + '\')"' + (G.money < miss ? ' disabled' : '') + ' title="' + escH(t('rec.buyMissing', { v: fmtMoney(miss) })) + '">' + uiIcon('cart') + fmtMoney(miss) + '</button>';
    }
    h += '</div></div>';
  });
  setHTML(el, h);
}

function toggleFav(recId) {
  if (G.favRecipes[recId]) delete G.favRecipes[recId];
  else G.favRecipes[recId] = true;
  renderRecipes();
}

function getIngEmoji(ingId) {
  var ing = findIng(ingId);
  return ing ? ing.e : '';
}

function afterCraft() {
  renderRecipes();
  renderIngredients();
  renderHeader();
  renderCraftingBar();
  renderSpaceBar();
  tutorialCheck();
}

function doCraft(recId) {
  var rec = findRec(recId);
  if (rec && startCraft(rec)) {
    toast(t('rec.prepared', { e: rec.e, n: recShortName(rec) }));
    afterCraft();
  }
}

function doCraftMax(recId) {
  var rec = findRec(recId);
  if (!rec) return;
  var n = startCraftMax(rec);
  if (n > 0) {
    toast(t('rec.preparedMany', { e: rec.e, q: n, n: recShortName(rec) }));
    afterCraft();
  }
}

function doBuyMissing(recId) {
  var rec = findRec(recId);
  if (rec && buyMissing(rec)) {
    toast(t('rec.bought'));
    playClickSound();
    renderRecipes();
    renderIngredients();
    renderHeader();
    tutorialCheck();
  }
}

// ============ VENTES ============
function renderSell() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  var h = '<div class="panel-head"><h2>' + t('sell.title') + '</h2></div>';
  var total = stockValue();
  h += '<button class="btn btn-primary btn-sell-all" onclick="doSellAllClick()"' + (total > 0 ? '' : ' disabled') + '>' + t('sell.sellAllGlobal', { v: fmtMoney(total) }) + '</button>';
  var any = false;
  REC.forEach(function(rec) {
    var stock = G.cakes[rec.id] || 0;
    if (stock <= 0) return;
    any = true;
    var pct = inflationPct(rec);
    h += '<div class="sell-card"><span class="sell-emoji">' + rec.e + '</span><div class="sell-info">';
    h += '<div class="sell-name">' + t('r.' + rec.id) + '</div>';
    h += '<div class="sell-stock">' + t('sell.stock', { v: fmt(stock) }) + '</div>';
    h += '<div class="sell-price">' + t('sell.price', { v: fmtMoney(inflatedPrice(rec)) });
    if (pct > 0) h += ' <span class="infl-up">' + t('sell.inflUp', { v: pct }) + '</span>';
    else if (pct < 0) h += ' <span class="infl-down">' + t('sell.inflDown', { v: pct }) + '</span>';
    h += '</div></div><div class="sell-btns">';
    h += '<button class="btn btn-small sell-btn-single" onclick="doSellClick(\'' + rec.id + '\',1,this)">' + t('sell.sell') + '</button>';
    if (stock > 1) h += '<button class="btn btn-small btn-primary sell-btn-all" onclick="doSellClick(\'' + rec.id + '\',' + stock + ',this)">' + t('sell.sellAll') + ' (' + fmtMoney(batchPrice(rec, stock)) + ')</button>';
    h += '</div></div>';
  });
  if (!any) h += '<p class="empty-note">' + t('sell.noStock') + '</p>';
  setHTML(el, h);
}

function afterSell() {
  renderSell();
  renderHeader();
  renderSpaceBar();
  tutorialCheck();
}

function doSellClick(recId, qty, btnElem) {
  var rec = findRec(recId);
  if (!rec) return;
  var earned = doSell(rec, qty);
  if (earned > 0) {
    playSellSound();
    showFloatingMoney(earned, btnElem);
    afterSell();
  }
}

function doSellAllClick() {
  var earned = doSellAll();
  if (earned > 0) {
    playSellSound();
    showFloatingMoney(earned, null);
    toast(t('sell.earnedAll', { v: fmtMoney(earned) }));
    afterSell();
  }
}

// ============ BATIMENTS ============
// Combien on peut acheter et pour quel prix, selon la quantite choisie
function buildingBulkInfo(bld) {
  var first = buildingCost(bld);
  var n = 0;
  if (G.settings.bulk === 'max') {
    n = Math.max(0, Math.floor(Math.log(1 + G.money * 0.15 / first) / Math.log(1.15)));
  } else {
    n = parseInt(G.settings.bulk, 10) || 1;
  }
  var shown = Math.max(1, n);
  return { n: n, shown: shown, cost: first * (Math.pow(1.15, shown) - 1) / 0.15 };
}

function renderBuildings() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  var h = '<div class="panel-head"><h2>' + t('bld.title') + '</h2>' + bulkChips() + '</div>';
  // Les fours
  var atMax = G.ovens >= OVEN_CONFIG.max;
  h += '<div class="bld-card oven-card"><span class="bld-emoji">\u{1F525}</span><div class="bld-info">';
  h += '<div class="bld-name">' + t('oven.title') + ' <span class="bld-qty">' + t('bld.qty', { v: G.ovens }) + '</span></div>';
  h += '<div class="bld-prod">' + t('oven.desc') + '</div></div>';
  h += atMax ? '<span class="empty-note">' + t('oven.max') + '</span>' : '<button class="btn btn-primary" onclick="doBuyOven()"' + (G.money < ovenCost() ? ' disabled' : '') + '>' + t('oven.buy', { c: fmtMoney(ovenCost()) }) + '</button>';
  h += '</div>';
  BUILDINGS.forEach(function(bld) {
    if (bld.unlockLvl > G.level + 3) return;
    if (bld.unlockLvl > G.level) {
      h += '<div class="bld-card locked"><span>\u{1F512}</span> ' + t('bld.locked', { v: bld.unlockLvl }) + '</div>';
      return;
    }
    var qty = (G.buildings[bld.id] || { qty: 0 }).qty;
    var info = buildingBulkInfo(bld);
    h += '<div class="bld-card"><span class="bld-emoji">' + bld.e + '</span><div class="bld-info">';
    h += '<div class="bld-name">' + t('b.' + bld.id) + ' <span class="bld-qty">' + t('bld.qty', { v: qty }) + '</span></div>';
    h += '<div class="bld-prod" title="' + escH(t('i.' + bld.produces)) + '">' + t('bld.prod', { v: fmtQty(bld.baseRate * qty) }) + ' ' + getIngEmoji(bld.produces) + ' ' + t('i.' + bld.produces) + '</div>';
    h += '<div class="bld-cost">' + fmtMoney(info.cost) + '</div></div>';
    h += '<button class="btn btn-primary" onclick="doBuyBuilding(\'' + bld.id + '\')"' + (G.money < info.cost ? ' disabled' : '') + '>' + t('bld.buy') + ' ×' + fmt(info.shown) + '</button></div>';
  });
  setHTML(el, h);
}

function doBuyBuilding(bldId) {
  var bld = findBld(bldId);
  if (!bld) return;
  var bought = buyBuilding(bld, G.settings.bulk);
  if (bought > 0) {
    toast(t('bld.bought', { n: t('b.' + bld.id) + ' x' + bought }));
    renderBuildings();
    renderHeader();
  } else {
    toast(t('bld.none'));
    playErrorSound();
  }
}

function doBuyOven() {
  if (buyOven()) {
    toast(t('oven.bought'));
    playSuccessSound();
    renderBuildings();
    renderHeader();
    renderCraftingBar();
  }
}

// ============ EMPLOYES ============
function renderEmployees() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  var h = '<div class="panel-head"><h2>' + t('emp.title') + '</h2></div>';
  var sal = totalSalary();
  if (sal > 0) h += '<div class="emp-total-salary">' + t('emp.totalSalary', { v: fmtMoney(sal * 3600) }) + '</div>';
  // Recruter tout de suite
  var open = EMP_TYPES.filter(function(et) { return G.level >= et.unlockLvl; });
  if (open.length === 0) {
    h += '<p class="empty-note">' + t('emp.lockedAll') + '</p>';
  } else {
    h += '<div class="recruit-section"><h4>' + t('emp.recruit') + '</h4><div class="recruit-row">';
    open.forEach(function(et) {
      var c = recruitCost(et);
      h += '<button class="btn btn-small" onclick="doRecruit(\'' + et.id + '\')"' + (G.money < c ? ' disabled' : '') + ' title="' + escH(t('emp.desc.' + et.id)) + '">' + t('emp.recruitBtn', { n: t('emp.' + et.id), c: fmtMoney(c) }) + '</button>';
    });
    h += '</div><p class="hint-note">' + t('emp.recruitHint') + '</p></div>';
  }
  if (G.applicants && G.applicants.length > 0) {
    h += '<div class="applicants-section"><h4>' + t('emp.applicants') + ' (' + G.applicants.length + ')</h4>';
    G.applicants.forEach(function(app) {
      var remaining = Math.max(0, Math.ceil((app.expiresAt - Date.now()) / 1000));
      h += '<div class="applicant-card" title="' + escH(t('emp.desc.' + app.type)) + '">';
      h += '<span class="app-name">' + escH(app.name) + '</span>';
      h += '<span class="app-type">' + t('emp.' + app.type) + '</span>';
      h += '<span class="app-skill">' + t('emp.skill', { v: app.skill }) + '</span>';
      h += '<span class="app-cost">' + fmtMoney(app.hireCost) + '</span>';
      h += '<span class="app-timer">' + fmtTime(remaining) + '</span>';
      h += '<button class="btn btn-small btn-primary" onclick="doAcceptApplicant(' + app.id + ')"' + (G.money < app.hireCost ? ' disabled' : '') + '>' + t('emp.accept') + '</button>';
      h += '<button class="btn btn-small btn-danger" onclick="doRejectApplicant(' + app.id + ')">' + t('emp.reject') + '</button>';
      h += '</div>';
    });
    h += '</div>';
  } else if (open.length > 0) {
    h += '<p class="empty-note">' + t('emp.noApplicants') + '</p>';
  }
  if (G.employees.length > 0) {
    h += '<div class="emp-list">';
    G.employees.forEach(function(emp) {
      var moraleColor = emp.morale > 60 ? 'morale-good' : (emp.morale > 30 ? 'morale-mid' : 'morale-bad');
      var statusCls = emp.status === 'working' ? 'status-good' : (emp.status === 'striking' ? 'status-bad' : 'status-warn');
      h += '<div class="emp-card" role="button" tabindex="0" onclick="if(event.target.tagName!==\'SELECT\'&&event.target.tagName!==\'OPTION\')showEmpInfoModal(' + emp.id + ')" title="' + escH(t('emp.desc.' + emp.type)) + '">';
      h += '<div class="emp-header">';
      h += '<span class="emp-name">' + escH(emp.name) + '</span>';
      h += '<span class="emp-type">' + t('emp.' + emp.type) + '</span>';
      h += '<span class="emp-status ' + statusCls + '">' + t('emp.' + emp.status) + '</span>';
      h += '<span class="emp-skill-badge">' + t('emp.levelTxt', { v: emp.level || 1 }) + '</span>';
      h += '<span class="app-skill">' + t('emp.skill', { v: emp.skill }) + '</span>';
      h += '</div>';
      h += '<div class="emp-morale-bar" title="' + escH(t('emp.morale')) + ' : ' + Math.floor(emp.morale) + '%"><div class="emp-morale-fill ' + moraleColor + '" style="width:' + Math.floor(emp.morale) + '%"></div></div>';
      if (emp.type === 'collector') {
        h += '<div class="emp-assign"><select onchange="assignCollector(' + emp.id + ',this.value)" aria-label="' + escH(t('emp.assign')) + '">';
        ING.forEach(function(ing) {
          if (ing.unlockLvl > G.level) return;
          h += '<option value="' + ing.id + '"' + (emp.assignedIng === ing.id ? ' selected' : '') + '>' + t('i.' + ing.id) + '</option>';
        });
        h += '</select></div>';
      }
      h += '</div>';
    });
    h += '</div>';
  }
  setHTML(el, h);
}

function assignCollector(empId, ingId) {
  var emp = findEmp(empId);
  if (emp) emp.assignedIng = ingId;
}

function doRecruit(typeId) {
  if (hireEmployee(typeId)) {
    toast(t('emp.hired'));
    renderEmployees();
    renderHeader();
    renderTabs();
  }
}

function doAcceptApplicant(appId) {
  if (acceptApplicant(appId)) {
    toast(t('emp.hired'));
    renderEmployees();
    renderHeader();
    renderTabs();
  }
}

function doRejectApplicant(appId) {
  rejectApplicant(appId);
  renderEmployees();
  renderTabs();
}

function showEmpInfoModal(empId) {
  var emp = findEmp(empId);
  if (!emp) return;
  var h = '<h2>' + escH(emp.name) + '</h2>';
  h += '<div class="emp-info-modal">';
  h += '<p><strong>' + t('emp.' + emp.type) + '</strong> : ' + t('emp.desc.' + emp.type) + '</p>';
  h += '<p>' + t('emp.levelTxt', { v: emp.level || 1 }) + ' · ' + t('emp.skill', { v: emp.skill }) + '</p>';
  h += '<p>' + t('emp.morale') + ' : ' + Math.floor(emp.morale) + ' %</p>';
  h += '<p>' + t('emp.salary', { v: fmtMoney(getEmpSalary(emp) * 3600) }) + '</p>';
  if (emp.type === 'collector') h += '<p>' + t('emp.assign') + ' : ' + t('i.' + (emp.assignedIng || 'farine')) + '</p>';
  h += '<button class="btn btn-primary" onclick="doTrainEmployee(' + emp.id + ')">' + t('emp.trainBtn', { v: fmtMoney(getTrainCost(emp)) }) + '</button>';
  h += '<button class="btn" onclick="doGiveBonus(' + emp.id + ')">' + t('emp.bonus', { v: fmtMoney(getBonusCost(emp)) }) + '</button>';
  h += '<button class="btn btn-danger" onclick="confirmFire(' + emp.id + ')">' + t('emp.fire') + '</button>';
  h += '</div>';
  h += '<div class="modal-btns"><button class="btn" onclick="hideModal()">' + t('common.close') + '</button></div>';
  showModal(h);
}

function doTrainEmployee(empId) {
  if (trainEmployee(empId)) {
    toast(t('emp.trained'));
    showEmpInfoModal(empId);
    renderEmployees();
    renderHeader();
  } else {
    toast(t('ing.noMoney'));
    playErrorSound();
  }
}

function doGiveBonus(empId) {
  if (giveBonus(empId)) {
    toast(t('emp.bonusDone'));
    showEmpInfoModal(empId);
    renderEmployees();
    renderHeader();
  } else {
    playErrorSound();
  }
}

function confirmFire(empId) {
  var emp = findEmp(empId);
  if (!emp) return;
  var h = '<h2>' + t('emp.fire') + '</h2><p>' + t('emp.fireConfirm', { n: escH(emp.name) }) + '</p>';
  h += '<div class="modal-btns"><button class="btn btn-danger" onclick="doFireEmployee(' + emp.id + ')">' + t('common.yes') + '</button>';
  h += '<button class="btn" onclick="showEmpInfoModal(' + emp.id + ')">' + t('common.cancel') + '</button></div>';
  showModal(h);
}

function doFireEmployee(empId) {
  fireEmployee(empId);
  hideModal();
  renderEmployees();
}

// ============ SUCCES ============
function onAchievementUnlocked() {
  ui.achDirty = true;
  playSuccessSound();
}

function renderAchievements() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  ui.achDirty = false;
  var total = 0, unlocked = 0, hiddenTotal = 0, hiddenFound = 0;
  var byCat = {};
  ACHIEVEMENTS.forEach(function(a) {
    var done = !!G.achievements[a.id];
    if (a.hidden) {
      hiddenTotal++;
      if (done) hiddenFound++;
    }
    total++;
    if (done) unlocked++;
    byCat[a.cat] = byCat[a.cat] || { all: 0, done: 0 };
    byCat[a.cat].all++;
    if (done) byCat[a.cat].done++;
  });
  var h = '<div class="panel-head"><h2>' + t('ach.title') + ' (' + unlocked + '/' + total + ')</h2></div>';
  h += '<p class="ach-bonus">' + t('ach.bonus', { v: (Math.round((achievementBonus() - 1) * 1000) / 10) }) + '</p>';
  h += '<div class="list-tools">';
  ACH_CATEGORIES.forEach(function(cat) {
    h += '<button class="chip' + (ui.achCat === cat ? ' active' : '') + '" onclick="ui.achCat=\'' + cat + '\';ui.achDirty=true;renderAchievements()">' + t('ach.cat.' + cat) + ' ' + byCat[cat].done + '/' + byCat[cat].all + '</button>';
  });
  h += '</div>';
  if (ui.achCat === 'secret') h += '<p class="hint-note">' + t('ach.hiddenCount', { a: hiddenFound, b: hiddenTotal }) + '</p>';
  h += '<div class="ach-grid">';
  ACHIEVEMENTS.forEach(function(a) {
    if (a.cat !== ui.achCat) return;
    var done = !!G.achievements[a.id];
    var secretLocked = a.hidden && !done;
    var name = secretLocked ? t('ach.hiddenName') : achName(a);
    var desc = secretLocked ? t('ach.hiddenDesc') : achDesc(a);
    h += '<div class="ach-item ' + (done ? 'unlocked' : 'locked') + '" title="' + escH(desc) + '">';
    h += '<div class="ach-icon">' + (secretLocked ? '\u{1F512}' : a.icon) + '</div>';
    h += '<div class="ach-name">' + escH(name) + '</div>';
    h += '<div class="ach-desc">' + escH(desc) + '</div></div>';
  });
  h += '</div>';
  setHTML(el, h);
}

// ============ BARRE DU BAS ============
function renderSpaceBar() {
  var el = document.getElementById('space-bar');
  if (!el) return;
  var used = usedSpace() + reservedSpace();
  var max = G.maxSpace;
  var pct = max > 0 ? Math.min(100, Math.floor(used / max * 100)) : 0;
  var h = '<div class="space-row"><div class="space-usage-wrap">';
  h += '<span>' + t('space.label') + ' : ' + t('space.text', { u: used < 1000 ? used.toFixed(1) : fmt(used), m: fmt(max) }) + '</span>';
  h += '<div class="space-bar-bg"><div class="space-bar-fill" style="width:' + pct + '%"></div></div></div>';
  h += '<span class="space-rent">' + t('space.rent', { v: fmtMoney(getRentPerHour()) }) + '</span>';
  var su = nextSpaceUpgrade();
  if (su) {
    if (G.level < su.lvlReq) h += '<button class="btn btn-small" disabled>' + t('space.locked', { v: su.lvlReq }) + '</button>';
    else h += '<button class="btn btn-small btn-primary" onclick="doBuySpace()"' + (G.money < su.cost ? ' disabled' : '') + '>' + t('space.buy', { a: fmt(su.add), c: fmtMoney(su.cost) }) + '</button>';
  } else {
    h += '<span class="space-rent">' + t('space.max') + '</span>';
  }
  h += '</div>';
  setHTML(el, h);
}

function doBuySpace() {
  var su = nextSpaceUpgrade();
  if (!su || G.money < su.cost || G.level < su.lvlReq) return;
  G.money -= su.cost;
  G.stats.totalInvested += su.cost;
  G.maxSpace += su.add;
  G.spaceBought++;
  renderSpaceBar();
  renderHeader();
  renderMainPanel();
}

function renderCraftingBar() {
  var el = document.getElementById('crafting-bar');
  if (!el) return;
  if (G.crafting.length === 0) { setHTML(el, ''); return; }
  var now = Date.now();
  var groups = {};
  var order = [];
  var waiting = 0;
  G.crafting.forEach(function(c) {
    if (c.startTime === null) { waiting++; return; }
    var key = c.isIngCraft ? 'ing_' + c.ingId : c.recId;
    if (!groups[key]) { groups[key] = { items: [], isIng: !!c.isIngCraft, id: c.isIngCraft ? c.ingId : c.recId }; order.push(key); }
    groups[key].items.push(c);
  });
  var h = '<span class="oven-count" title="' + escH(t('oven.title')) + '">' + uiIcon('flame') + t('oven.label', { a: activeCrafts(), m: ovenSlots() });
  if (waiting > 0) h += ' · ' + t('oven.queue', { v: waiting });
  h += '</span>';
  order.forEach(function(key) {
    var grp = groups[key];
    var first = grp.items[0];
    var elapsed = now - first.startTime;
    var pct = Math.min(100, Math.floor(elapsed / first.duration * 100));
    var remaining = Math.max(0, (first.duration - elapsed) / 1000);
    var data = grp.isIng ? findIng(grp.id) : findRec(grp.id);
    var name = grp.isIng ? t('i.' + grp.id) : recShortName(data);
    h += '<div class="craft-item"><span class="craft-emoji">' + data.e + '</span><div class="craft-progress-wrap">';
    h += '<div class="craft-progress" style="width:' + pct + '%"></div>';
    h += '<span class="craft-label">' + name + (grp.items.length > 1 ? ' x' + grp.items.length : '') + ' - ' + fmtTime(remaining) + '</span>';
    h += '</div></div>';
  });
  setHTML(el, h);
}

// ============ FENETRES ============
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
    el.innerHTML = '<div class="' + cls + '" role="dialog" aria-modal="true">' + iconify(content) + '</div>';
  }
  el.style.display = 'flex';
  var downTarget = null;
  el.onmousedown = function(e) { downTarget = e.target; };
  el.onmouseup = function(e) {
    if (e.target === el && downTarget === el) dismissModal();
    downTarget = null;
  };
}

// Fermer en cliquant a cote ou avec Echap : si le jeu est en pause, il reprend
function dismissModal() {
  if (bobDialog) { bobDialogNext(); return; }
  var open = document.querySelector('#modal-overlay .modal');
  if (G.paused) {
    // Depuis un menu ouvert en pause, on revient d'abord a la pause
    if (open && !open.classList.contains('modal-pause')) showPauseModal();
    else togglePause();
  } else {
    hideModal();
  }
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
  h += '<p>' + t('rebirth.cost', { v: fmtMoney(rb.cost) }) + '</p>';
  h += '<p>' + t('rebirth.bonus', { v: Math.floor(rb.bonus * 100) }) + ' · ' + t('rebirth.spaceBonus', { v: rb.spaceMulti }) + '</p>';
  h += '<p class="warning">' + t('rebirth.warning') + '</p>';
  h += '<p>' + t('rebirth.keep') + '</p>';
  h += '<div class="modal-btns"><button class="btn btn-primary" onclick="doRebirthConfirm()">' + t('rebirth.btn') + '</button>';
  h += '<button class="btn" onclick="hideModal()">' + t('rebirth.cancel') + '</button></div>';
  showModal(h);
}

function doRebirthConfirm() {
  if (doRebirth()) {
    hideModal();
    playFanfare();
    toast(t('rebirth.done', { name: G.bakeryName, n: G.rebirth }));
    fullRender();
  }
}

function showRenameModal() {
  var afford = G.money >= RENAME_COST;
  var h = '<h2>' + t('rename.title') + '</h2>';
  h += '<p>' + t('rename.price', { v: fmtMoney(RENAME_COST) }) + '</p>';
  h += '<input id="rename-input" maxlength="30" placeholder="' + escH(t('rename.placeholder')) + '" value="' + escH(G.bakeryName) + '" onkeydown="if(event.key===\'Enter\')doRename()">';
  if (!afford) h += '<p class="warning">' + t('rename.noMoney', { v: fmtMoney(RENAME_COST) }) + '</p>';
  h += '<div class="modal-btns"><button class="btn btn-primary" onclick="doRename()"' + (afford ? '' : ' disabled') + '>' + t('rename.btn') + ' (' + fmtMoney(RENAME_COST) + ')</button>';
  h += '<button class="btn" onclick="hideModal()">' + t('common.close') + '</button></div>';
  showModal(h);
  var input = document.getElementById('rename-input');
  if (input) { input.focus(); input.select(); }
}

function doRename() {
  var val = document.getElementById('rename-input').value;
  var res = renameBakery(val);
  if (res === 'ok') {
    hideModal();
    toast(t('rename.done', { n: G.bakeryName }));
    playSellSound();
    renderHeader();
    checkAchievements();
  } else if (res === 'same') {
    hideModal();
  } else if (res === 'money') {
    toast(t('rename.noMoney', { v: fmtMoney(RENAME_COST) }));
    playErrorSound();
  } else {
    fxShake(document.getElementById('rename-input'));
  }
}

function showCaptchaModal() {
  var h = '<h2>' + t('anticlick.captcha', { q: antiClick.captchaQuestion }) + '</h2>';
  h += '<input id="captcha-input" type="number" placeholder="?" onkeydown="if(event.key===\'Enter\')doCaptcha()">';
  h += '<div class="modal-btns"><button class="btn btn-primary" onclick="doCaptcha()">OK</button></div>';
  showModal(h);
}

function doCaptcha() {
  var result = solveCaptcha(document.getElementById('captcha-input').value);
  if (result === 'ok') {
    hideModal();
    toast(t('anticlick.ok'));
  } else if (result === 'banned') {
    hideModal();
    showBanOverlay(ANTI_CLICK.banSeconds);
  } else {
    toast(t('anticlick.wrong'));
  }
}

function showBanOverlay(seconds) {
  var div = document.getElementById('ban-overlay');
  if (div) div.remove();
  div = document.createElement('div');
  div.className = 'ban-overlay';
  div.id = 'ban-overlay';
  div.textContent = t('ban.message', { v: Math.ceil(seconds / 60) });
  document.body.appendChild(div);
  setTimeout(function() { div.remove(); }, 4000);
}

// ============ PATISSERIES ============
function showBakeriesModal() {
  ensureBakeryList();
  var h = '<h2>' + t('bakery.title') + '</h2><p class="hint-note">' + t('bakery.help') + '</p>';
  G.bakeries.forEach(function(b, i) {
    var isCurrent = i === G.currentBakeryIndex;
    h += '<div class="bakery-card' + (isCurrent ? ' current' : '') + '">';
    h += '<span class="bakery-card-name">' + escH(isCurrent ? G.bakeryName : b.name) + '</span>';
    h += '<span>' + t('bakery.value', { v: fmtMoney(getBakeryValueForIndex(i)) }) + '</span>';
    if (isCurrent) {
      h += '<span class="bakery-current-tag">' + t('bakery.current') + '</span>';
    } else {
      h += '<button class="btn btn-small btn-primary" onclick="doSwitchBakery(' + i + ')">' + t('bakery.go') + '</button>';
      h += '<button class="btn btn-small btn-danger" onclick="doSellBakery(' + i + ')">' + t('bakery.sell') + '</button>';
    }
    h += '</div>';
  });
  var cost = bakeryOpenCost();
  h += '<div class="bakery-new"><button class="btn btn-primary" onclick="doOpenNewBakery()"' + (G.money < cost ? ' disabled' : '') + '>' + t('bakery.openNew') + ' (' + fmtMoney(cost) + ')</button></div>';
  h += '<div class="modal-btns"><button class="btn" onclick="closeMenu()">' + t('common.close') + '</button></div>';
  showModal(h);
}

function doSwitchBakery(index) {
  if (switchToBakery(index)) { hideModal(); fullRender(); }
}

function doSellBakery(index) {
  if (sellBakery(index)) { showBakeriesModal(); renderHeader(); }
}

function doOpenNewBakery() {
  var first = !G.secondBakery;
  if (openNewBakery()) {
    showBakeriesModal();
    fullRender();
    checkAchievements();
    if (first) bobSay(t('bakery.statsUnlocked'));
  }
}

// ============ FAILLITE ET ABSENCE ============
function showGameOverModal() {
  var h = '<h2>' + t('gameover.title') + '</h2><p>' + t('gameover.text') + '</p><div class="modal-btns">';
  if (liquidationValue() > 0) h += '<button class="btn btn-primary" onclick="doGameOverSell()">' + t('gameover.sellCakes') + '</button>';
  h += '<button class="btn btn-danger" onclick="doGameOverRestart()">' + t('gameover.restart') + '</button></div>';
  showModal(h);
}

function doGameOverSell() {
  doSellAll();
  ING.forEach(function(ing) { resellIngredient(ing, G.ing[ing.id] || 0); });
  payDebt();
  G.gameOver = false;
  hideModal();
  fullRender();
}

function doGameOverRestart() {
  var keep = { settings: G.settings, achievements: G.achievements, birthday: G.birthday, unlockedThemes: G.unlockedThemes, cheatUnlocked: G.cheatUnlocked, bobClicks: G.bobClicks, wentBankrupt: true, logoClicks: G.logoClicks, birthdaySetOn: G.birthdaySetOn, birthdayBoostYear: G.birthdayBoostYear, bakeries: G.bakeries, currentBakeryIndex: G.currentBakeryIndex, secondBakery: G.secondBakery, bankUnlocked: G.bankUnlocked, achHere: G.achHere };
  G = createFreshState();
  Object.assign(G, keep);
  if (G.bakeries[G.currentBakeryIndex]) G.bakeries[G.currentBakeryIndex].name = G.bakeryName;
  G.introDone = true;
  G.tutorialDone = true;
  G.tutorialStep = 5;
  hideModal();
  fullRender();
  save();
}

function showOfflineModal(r) {
  var h = '<h2>' + t('offline.title') + '</h2><p>' + t('offline.time', { t: fmtTime(r.seconds) }) + '</p><ul class="offline-list">';
  if (r.ingredients > 0) h += '<li>' + t('offline.ing', { v: fmt(r.ingredients) }) + '</li>';
  if (r.money > 0) h += '<li>' + t('offline.sales', { v: fmtMoney(r.money) }) + '</li>';
  if (r.rent > 0) h += '<li>' + t('offline.rent', { v: fmtMoney(r.rent) }) + '</li>';
  if (r.salaries > 0) h += '<li>' + t('offline.salaries', { v: fmtMoney(r.salaries) }) + '</li>';
  if (r.loans > 0) h += '<li>' + t('offline.loans', { v: fmtMoney(r.loans) }) + '</li>';
  h += '</ul>';
  if (r.unpaid) h += '<p class="warning">' + t('offline.unpaid') + '</p>';
  h += '<div class="modal-btns"><button class="btn btn-primary" onclick="hideModal()">OK</button></div>';
  showModal(h);
}

function showLevel1000() {
  var overlay = document.createElement('div');
  overlay.className = 'lvl1000-overlay';
  overlay.innerHTML = iconify('<div class="lvl1000-content"><h1>\u{1F389} ' + t('lvl1000.title') + ' \u{1F389}</h1><p>' + t('lvl1000.text') + '</p><p style="font-size:3em">\u{1F382}\u{1F451}⭐\u{1F31F}\u{1F3C6}</p><button class="btn btn-primary">OK</button></div>');
  overlay.querySelector('button').onclick = function() { overlay.remove(); };
  document.body.appendChild(overlay);
  playFanfare();
  fxBurst(window.innerWidth / 2, window.innerHeight / 2, 80, null, true);
}

// ============ CLAVIER ============
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (typeof introActive !== 'undefined' && introActive) return;
    dismissModal();
    return;
  }
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
  if (document.getElementById('modal-overlay').style.display === 'flex') return;
  var wanted = visibleTabs()[parseInt(e.key, 10) - 1];
  if (wanted) switchTab(wanted);
});

// ============ DETTE ============
function doPayDebt() {
  var paid = payDebt();
  if (paid > 0) {
    toast(t('debt.paid', { v: fmtMoney(paid) }));
    renderHeader();
    renderSpaceBar();
  } else {
    toast(t('debt.cantPay'));
    playErrorSound();
  }
}

// ============ TOUT REDESSINER ============
function fullRender() {
  ui.achDirty = true;
  renderHeader();
  renderTabs();
  renderIngredients();
  renderMainPanel();
  renderSpaceBar();
  renderCraftingBar();
  renderTutorial();
  renderBob();
  renderConsoleButton();
}
