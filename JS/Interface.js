/* ============================================
   PATISSERIE 2D SIMULATOR - INTERFACE
   Affichage : en-tete, onglets, cartes, fenetres
   ============================================ */

var currentTab = 'rec';
var ui = {
  recSearch: '',
  recOnlyMakable: false,
  recOnlyFav: false,
  ingSearch: '',
  achCat: 'general',
  settingsTab: 'general',
  statsView: 'here',
  recSort: 'old',
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
  if (typeof bgTick !== 'undefined' && bgTick) return; // Une autre patisserie : pas de bruit
  if (document.querySelector('#modal-overlay .modal-offline')) return;   // la fenetre « Bon retour » dit deja tout : pas de notifications derriere
  notifyAway(msg);
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

function showLevelUp(lvl, n, from) {
  if (typeof bgTick !== 'undefined' && bgTick) return;
  n = n || 1;
  from = from == null ? lvl - 1 : from;
  toast(n > 1 ? t('xp.levels', { v: lvl, n: n }) : t('xp.level', { v: lvl }));
  for (var l = from + 1; l <= lvl; l++) explainLevel(l);
  fxLevelUp();
  playSuccessSound();
  vibrate([30, 40, 30]);
  if (from < 1000 && lvl >= 1000 && !G.lvl1000Shown) {
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
  h += '<button type="button" class="logo-btn" onclick="logoClick()" aria-label="P2DS"><img class="game-logo" src="logo.svg" alt="" width="40" height="40"></button>';
  h += '<h1 class="game-name">P2DS</h1>';
  var hasUpdate = typeof updateState !== 'undefined' && updateState.newVersion;
  h += '<button type="button" class="version-badge' + (hasUpdate ? ' has-update' : '') + '" onclick="showChangelog()" title="' + escH(hasUpdate ? t('update.available', { v: versionLabel(updateState.newVersion) }) : t('changelog.title')) + '">' + versionLabel(GAME_VERSION) + '</button>';
  h += '<button class="bakery-name" onclick="showRenameModal()" title="' + escH(t('rename.title')) + '"><span>' + escH(G.bakeryName || t('home.unnamed')) + '</span>' + uiIcon('pencil') + '</button>';
  h += '</div>';
  h += '<div class="hdr-stats">';
  h += '<span class="money-display">' + fmtMoney(G.money) + '</span>';
  h += '<span class="level-display">' + t('level', { v: G.level }) + '</span>';
  h += '<div class="xp-bar-container"><div class="xp-bar-fill" style="width:' + xpPct + '%"></div>';
  h += '<span class="xp-bar-text">' + t('xp.text', { c: fmt(Math.floor(G.xp)), n: fmt(xpNeeded) }) + '</span></div>';
  h += '</div>';
  h += '<div class="header-right">';
  // Installer l'appli Windows (seulement dans un navigateur, sur un PC Windows), puis les comptes
  // De gauche a droite : sortir, telechargements, patisseries, succes, stats, pause, reglages (tout a droite)
  h += headerBtn('backToHome()', t('home.backHome'), 'back');
  if (typeof installBtnHTML === 'function') h += installBtnHTML();
  h += headerBtn('showBakeriesModal()', t('bakery.title'), 'store', false, G.bakeries.length >= 2 ? G.bakeries.length : 0);
  h += headerBtn('showAchievementsModal()', t('ach.header'), 'ach');
  h += headerBtn('showStatsModal()', t('settings.tabStats'), 'stats');
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
  if (G.rentLate > 0 && G.rentDebt <= 0 && G.money <= 0) {
    alerts += '<div class="debt-warning rent-late">' + t('rent.late', { v: fmtTime(Math.max(0, RENT_CONFIG.graceSec - G.rentLate)) }) + '</div>';
  }
  if (G.challenge && G.challenge.accepted) alerts += challengeBanner();
  if (G.activeEvent) {
    var remaining = Math.max(0, Math.ceil((G.eventEndTime - Date.now()) / 1000));
    alerts += '<div class="event-banner">⚡ ' + t('event.' + G.activeEvent, { t: remaining }) + '</div>';
  }
  if (G.choiceEvent) alerts += choiceBannerHTML();
  if (G.focusEvent && Date.now() < G.focusEvent.until) {
    alerts += '<div class="event-banner">⚡ ' + focusEventText(G.focusEvent, (G.focusEvent.until - Date.now()) / 1000) + '</div>';
  }
  if (alerts) h += '<div class="hdr-alerts">' + alerts + '</div>';
  setHTML(el, h);
  if (typeof renderHeader._money === 'number' && G.money > renderHeader._money + 0.5) {
    fxBump(el.querySelector('.money-display'), 1.14);
  }
  renderHeader._money = G.money;
}

function headerBtn(action, label, icon, off, count) {
  var safe = escH(label);
  return '<button class="hbtn' + (off ? ' off' : '') + '" onclick="' + action + '" title="' + safe + '" aria-label="' + safe + '">' + uiIcon(icon) + (count ? '<span class="hbtn-count">' + count + '</span>' : '') + '</button>';
}

// Le logo ne fait rien... ou presque
// 100 clics sur le logo ouvrent la console ; Bob donne un indice a 50
function logoClicksNeeded() { return LOGO_CLICKS_CONSOLE; }
function logoClick() {
  G.logoClicks = (G.logoClicks || 0) + 1;
  fxBump(document.querySelector('.game-logo'), 1.15);
  if (G.logoClicks === Math.floor(LOGO_CLICKS_CONSOLE / 2) && !G.logoHintShown && !G.cheatUnlocked && !G.cheatEverUnlocked) { G.logoHintShown = true; if (typeof bobTell === 'function') bobTell(t('bob.logoHint')); }
  if (G.logoClicks >= logoClicksNeeded() && !G.cheatUnlocked) {
    G.cheatUnlocked = true;
    G.cheatEverUnlocked = true;
    save();
    toast(t('settings.cheatUnlocked'));
    renderConsoleButton();
    renderBob();
    bobSay(t('bob.unlocked'));
  }
  checkAchievements();
}

// ============ ONGLETS ============
function visibleTabs() {
  var tabs = ['rec', 'sell'];
  if (G.level >= BUILDINGS_LVL || buildingsOwned() > 0) tabs.push('bld');
  tabs.push('emp');
  if (G.level >= ORDER_CONFIG.lvl) tabs.push('orders');
  tabs.push('machines');
  if (G.bankUnlocked) tabs.push('bank');
  // Au niveau 450, tu ranges les onglets comme tu veux
  if (tabsCustomAvailable() && G.settings.tabOrder) {
    var order = G.settings.tabOrder;
    tabs.sort(function(a, b) {
      var ia = order.indexOf(a), ib = order.indexOf(b);
      return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
    });
  }
  return tabs;
}

var TABS_CUSTOM_LVL = 450;
function tabsCustomAvailable() {
  if (G.settings.tabsCustom === false) return false;
  return G.settings.tabsCustom === true || G.level >= TABS_CUSTOM_LVL;
}
function moveTab(id, toId) {
  var tabs = visibleTabs();
  var from = tabs.indexOf(id), to = tabs.indexOf(toId);
  if (from < 0 || to < 0 || from === to) return;
  tabs.splice(to, 0, tabs.splice(from, 1)[0]);
  G.settings.tabOrder = tabs;
  renderTabs();
}
// Glisser un onglet a gauche ou a droite, a la souris comme au doigt
var tabDrag = null, tabDragEndedAt = 0;
document.addEventListener('pointerdown', function(e) {
  var b = e.target.closest && e.target.closest('#tabs .gtab');
  if (!b || !tabsCustomAvailable()) return;
  tabDrag = { id: b.getAttribute('data-tab'), x: e.clientX, moved: false, el: b };
});
document.addEventListener('pointermove', function(e) {
  if (!tabDrag) return;
  if (!tabDrag.moved && Math.abs(e.clientX - tabDrag.x) < 12) return;
  tabDrag.moved = true;
  tabDrag.el.classList.add('dragging');
  var over = null;
  [].slice.call(document.querySelectorAll('#tabs .gtab')).forEach(function(btn) {
    var r = btn.getBoundingClientRect();
    if (e.clientX >= r.left && e.clientX <= r.right) over = btn;
  });
  if (over && over.getAttribute('data-tab') !== tabDrag.id) moveTab(tabDrag.id, over.getAttribute('data-tab'));
});
['pointerup', 'pointercancel'].forEach(function(ev) {
  document.addEventListener(ev, function() {
    if (!tabDrag) return;
    if (tabDrag.moved) { tabDragEndedAt = Date.now(); save(); renderTabs(); }
    tabDrag = null;
  });
});

function renderTabs() {
  var el = document.getElementById('tabs');
  if (!el) return;
  var tabs = visibleTabs();
  if (tabs.indexOf(currentTab) < 0) currentTab = 'rec';
  el.style.setProperty('--tabs', tabs.length);
  el.classList.toggle('many', tabs.length >= 7);
  el.classList.toggle('tabs-custom', tabsCustomAvailable());
  if (tabsCustomAvailable() && G.level >= TABS_CUSTOM_LVL && !G.settings.tabsHint && !introActive) { G.settings.tabsHint = true; toast(t('tabs.hint')); }
  var h = '<div class="gtab-track"><span class="gtab-ind" style="--i:' + tabs.indexOf(currentTab) + '"></span></div>';
  for (var i = 0; i < tabs.length; i++) {
    var active = currentTab === tabs[i];
    h += '<button class="gtab' + (active ? ' active' : '') + '" data-tab="' + tabs[i] + '" onclick="if(Date.now()-tabDragEndedAt>300)switchTab(\'' + tabs[i] + '\')" title="' + escH(t('tab.key', { v: i + 1 })) + '"' + (active ? ' aria-current="page"' : '') + '>' + uiIcon(tabs[i]) + '<span>' + t('tab.' + tabs[i]) + '</span>';
    if (tabs[i] === 'emp' && G.applicants && G.applicants.length > 0) {
      h += '<span class="applicant-badge">' + G.applicants.length + '</span>';
    }
    if (tabs[i] === 'machines') {
      var brokenM = Object.keys(G.broken || {}).filter(function(k) { return k.indexOf('m:') === 0; }).length;
      if (brokenM > 0) h += '<span class="applicant-badge red" title="' + escH(t('mach.brokenTip')) + '">' + brokenM + '</span>';
    }
    if (tabs[i] === 'bld') {
      var brokenB = Object.keys(G.broken || {}).filter(function(k) { return k.indexOf('b:') === 0; }).length;
      if (brokenB > 0) h += '<span class="applicant-badge red" title="' + escH(t('bld.brokenTip')) + '">' + brokenB + '</span>';
    }
    if (tabs[i] === 'orders' && G.orders.length > 0) {
      h += '<span class="applicant-badge">' + G.orders.length + '</span>';
    }
    h += '</button>';
  }
  setHTML(el, h);
}

function switchTab(tab) {
  var changed = currentTab !== tab;
  currentTab = tab;
  if (changed) { ui.ingFold = null; renderIngredients(); }
  renderTabs();
  var panel = document.getElementById('main-panel');
  if (changed && panel) {
    // Nouvel onglet : on vide le panneau pour rejouer l'entree des cartes
    panel.innerHTML = '';
    panel._lastHTML = null;
    panel.scrollTop = 0;
  }
  renderMainPanel();
  tutorialCheck();
}

// ============ INGREDIENTS ============
// Singulier pour une seule unite : 1 Oeuf, 2 Oeufs
function ingName(id, count) {
  if (count !== undefined && count < 2 && LANGS[currentLang]['is.' + id]) return t('is.' + id);
  return t('i.' + id);
}

// Sur telephone, la liste des ingredients se replie quand on n'est pas sur les recettes, et on peut la plier ou la deplier quand on veut
function ingStacked() { return !!(window.matchMedia && matchMedia('(max-width: 899px)').matches); }
function ingFolded() {
  if (ui.ingFold === true || ui.ingFold === false) return ui.ingFold;
  return ingStacked() && currentTab !== 'rec';   // seul le petit ecran se replie tout seul
}
function toggleIngFold() {
  ui.ingFold = !ingFolded();
  renderIngredients();
}
function renderIngredients() {
  var el = document.getElementById('ingredients');
  if (!el) return;
  var folded = ingFolded();
  el.classList.toggle('folded', folded);
  var area = document.getElementById('game-area');
  if (area) area.classList.toggle('ing-folded', folded && !ingStacked());
  var h = '<div class="panel-head"><h2>' + t('ing.title') + '</h2><button type="button" class="ing-fold-btn" onclick="toggleIngFold()" title="' + escH(t(folded ? 'ing.unfold' : 'ing.fold')) + '" aria-label="' + escH(t(folded ? 'ing.unfold' : 'ing.fold')) + '" aria-expanded="' + (!folded) + '">' + (folded ? '◀' : '▶') + '</button></div>';
  if (folded) { setHTML(el, h); return; }
  var known = ING.filter(ingUnlocked);
  if (known.length > 12) {
    h += '<input class="panel-search" type="search" placeholder="' + escH(t('ing.search')) + '" value="' + escH(ui.ingSearch) + '" oninput="ui.ingSearch=this.value;renderIngredients()">';
  }
  h += '<div class="ing-grid">';
  var search = ui.ingSearch.trim().toLowerCase();
  var perClick = clickMult();
  var now = Date.now();
  ING.forEach(function(ing) {
    if (!ingUnlocked(ing)) {
      if (search || ing.unlockLvl > G.level + 3) return;
      var pending = unlockPending('ing', ing);
      if (pending) {
        h += '<div class="ing-card locked researching"><div class="ing-emoji">' + ing.e + '</div><div class="ing-name">' + t('i.' + ing.id) + '</div><div class="ing-info">' + t('unlock.waiting', { v: fmtTime(Math.max(0, (pending - now) / 1000)) }) + '</div></div>';
      } else if (ing.unlockLvl <= G.level) {
        h += '<div class="ing-card can-unlock" role="button" tabindex="0" onclick="doUnlock(\'ing\',\'' + ing.id + '\')"><div class="ing-emoji">' + ing.e + '</div><div class="ing-name">' + t('i.' + ing.id) + '</div><div class="unlock-tag">' + uiIcon('search') + t('unlock.btn', { v: fmtTime(unlockDelay(ing)) }) + '</div></div>';
      } else {
        h += '<div class="ing-card locked"><div class="ing-emoji">\u{1F512}</div><div class="ing-name">' + t('ing.locked', { v: ing.unlockLvl }) + '</div></div>';
      }
      return;
    }
    var count = G.ing[ing.id] || 0;
    var name = ingName(ing.id, count);
    if (search && t('i.' + ing.id).toLowerCase().indexOf(search) < 0) return;
    var auto = autoRate(ing.id);
    var cost = getIngredientCost(ing);
    h += '<div class="ing-card' + (G.money >= cost ? '' : ' cant-afford') + '" data-ing="' + ing.id + '" role="button" tabindex="0" aria-label="' + escH(name) + '" title="' + escH(name) + '" onclick="if(!event.target.closest(\'button\'))doClickIngredient(\'' + ing.id + '\')" onkeydown="ingKey(event,\'' + ing.id + '\')">';
    h += '<div class="ing-emoji">' + ing.e + '</div>';
    h += '<div class="ing-name">' + name + '</div>';
    h += '<div class="ing-count">' + fmt(count) + '</div>';
    h += '<div class="ing-info">' + t('ing.perClick', { v: fmtQty(perClick) }) + '</div>';
    if (auto > 0) h += '<div class="ing-auto">' + t('ing.autoRate', { v: fmtQty(auto) }) + '</div>';
    h += '<div class="ing-cost">' + t('ing.cost', { v: fmtMoney(cost) }) + '</div>';
    h += '<div class="ing-actions">';
    // Toujours en place, invisible a 0, pour que les cartes ne bougent pas
    var resellQty = resellAmount(ing, '1');
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
  h += '<button type="button" class="ing-top" onclick="ingToTop()">↑ ' + t('ing.top') + '</button>';
  setHTML(el, h);
  updateIngTop();
}

// Retour tout en haut des ingredients, visible seulement quand on est tout en bas
function ingToTop() { var el = document.getElementById('ingredients'); if (el) el.scrollTo({ top: 0, behavior: 'smooth' }); }
function updateIngTop() {
  var el = document.getElementById('ingredients');
  if (!el) return;
  var max = el.scrollHeight - el.clientHeight;
  var low = max > 150 && el.scrollTop / max > 0.7;
  el.classList.toggle('at-bottom', low);
}
document.addEventListener('scroll', function(e) { if (e.target && e.target.id === 'ingredients') updateIngTop(); }, true);

function doUnlock(kind, id) {
  var item = kind === 'ing' ? findIng(id) : findRec(id);
  if (item && startUnlock(kind, item)) {
    playClickSound();
    toast(t('unlock.started', { n: kind === 'ing' ? t('i.' + id) : recShortName(item), v: fmtTime(unlockDelay(item)) }));
    renderIngredients();
    renderMainPanel();
  }
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
  var units = buyIngredient(ing, '1');
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
  var amount = resellAmount(ing, '1');
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
  priceMemo = {};
  try { renderMainPanelNow(); } finally { priceMemo = null; }
}
function renderMainPanelNow() {
  switch (currentTab) {
    case 'rec': renderRecipes(); break;
    case 'sell': renderSell(); break;
    case 'bld': renderBuildings(); break;
    case 'emp': renderEmployees(); break;
    case 'bank': renderBank(); break;
    case 'orders': renderOrders(); break;
    case 'machines': renderMachines(); break;
  }
}

// ============ RECETTES ============
function recipeProfit(rec) {
  return batchPrice(rec, rec.qty) - recipeCost(rec);
}

function visibleRecipes() {
  var search = ui.recSearch.trim().toLowerCase();
  var list = REC.filter(function(rec) {
    if (!recUnlocked(rec)) return false;
    if (ui.recOnlyMakable && craftBlockReason(rec)) return false;
    if (ui.recOnlyFav && !G.favRecipes[rec.id]) return false;
    if (search && t('r.' + rec.id).toLowerCase().indexOf(search) < 0) return false;
    return true;
  });
  if (ui.recSort === 'new') list.reverse();
  else if (ui.recSort === 'profit') { var pr = {}; list.forEach(function(r) { pr[r.id] = recipeProfit(r); }); list.sort(function(a, b) { return pr[b.id] - pr[a.id]; }); }
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
  [['old', 'rec.sortOld'], ['new', 'rec.sortNew'], ['profit', 'rec.sortProfit']].forEach(function(o) {
    h += '<option value="' + o[0] + '"' + (ui.recSort === o[0] ? ' selected' : '') + '>' + t(o[1]) + '</option>';
  });
  h += '</select></div>';

  var list = visibleRecipes();
  if (list.length === 0) h += '<p class="empty-note">' + t('rec.none') + '</p>';
  list.forEach(function(rec) {
    var blocks = craftBlockers(rec), block = blocks.length ? blocks[0] : null, tight = !canFitRecipe(rec);
    h += '<div class="rec-card' + (block ? ' disabled' : '') + '">';
    h += '<span class="rec-emoji">' + rec.e + '</span>';
    h += '<div class="rec-info">';
    h += '<div class="rec-name"><button class="fav-btn' + (G.favRecipes[rec.id] ? ' on' : '') + '" aria-pressed="' + !!G.favRecipes[rec.id] + '" onclick="toggleFav(\'' + rec.id + '\')" title="' + escH(t('rec.fav')) + '" aria-label="' + escH(t('rec.fav')) + '">' + uiIcon('star') + '</button>' + t('r.' + rec.id) + '</div>';
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
    if (prepMult(rec) < 0.95) h += '<span class="rec-tired">' + t('rec.tooMuch', { v: Math.round(prepMult(rec) * 100) }) + '</span>';
    else if (restMult(rec) > 1.02) h += '<span class="rec-rested">' + t('rec.rested', { v: Math.round((restMult(rec) - 1) * 100) }) + '</span>';
    h += '</div>';
    // Manque d'ingredients et manque de place : les deux s'affichent en meme temps
    if (blocks.length || tight) {
      h += '<div class="rec-reason">';
      blocks.forEach(function(b) { h += '<span>' + t(b === 'ing' ? 'rec.noIng' : 'rec.queueFull') + '</span>'; });
      if (tight) h += '<span>' + t(blocks.length ? 'rec.noSpace' : 'rec.freeze') + '</span>';
      h += '</div>';
    }
    h += '</div>';
    h += '<div class="rec-actions">';
    h += '<button class="btn btn-primary rec-btn" onclick="doCraft(\'' + rec.id + '\')"' + (block ? ' disabled' : '') + '>' + t('rec.prepare') + '</button>';
    if (!block) h += '<button class="btn btn-small" onclick="doCraftMax(\'' + rec.id + '\')">' + t('rec.prepareMax') + '</button>';
    h += '</div></div>';
  });
  // Ce qui reste a debloquer vient en bas : plus on descend, plus c'est rare
  if (!ui.recSearch && !ui.recOnlyMakable && !ui.recOnlyFav) {
    var now = Date.now();
    REC.forEach(function(rec) {
      if (recUnlocked(rec) || rec.unlockLvl > G.level + 2) return;
      var pending = unlockPending('rec', rec);
      if (pending) {
        h += '<div class="rec-card locked researching"><span class="rec-emoji">' + rec.e + '</span> ' + recShortName(rec) + ' · ' + t('unlock.waiting', { v: fmtTime(Math.max(0, (pending - now) / 1000)) }) + '</div>';
      } else if (rec.unlockLvl <= G.level) {
        h += '<button type="button" class="rec-card can-unlock" onclick="doUnlock(\'rec\',\'' + rec.id + '\')"><span class="rec-emoji">' + rec.e + '</span> <b>' + recShortName(rec) + '</b> <span class="unlock-tag">' + uiIcon('search') + t('unlock.btn', { v: fmtTime(unlockDelay(rec)) }) + '</span></button>';
      } else {
        h += '<div class="rec-card locked"><span class="rec-emoji">\u{1F512}</span> ' + t('ing.locked', { v: rec.unlockLvl }) + '</div>';
      }
    });
  }
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
    h += '<button class="btn btn-small sell-btn-single" onclick="doSellClick(\'' + rec.id + '\',1)">' + t('sell.sell') + '</button>';
    if (stock > 1) h += '<button class="btn btn-small btn-primary sell-btn-all" onclick="doSellClick(\'' + rec.id + '\',' + stock + ')">' + t('sell.sellAll') + ' (' + fmtMoney(batchPrice(rec, stock)) + ')</button>';
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

function doSellClick(recId, qty) {
  var rec = findRec(recId);
  if (rec && queueSale([{ rec: rec, qty: qty }]) > 0) {
    playClickSound();
    afterSell();
    renderCraftingBar();
  }
}

function doSellAllClick() {
  var items = REC.filter(function(r) { return (G.cakes[r.id] || 0) > 0; }).map(function(r) { return { rec: r, qty: G.cakes[r.id] }; });
  if (queueSale(items) > 0) {
    playClickSound();
    afterSell();
    renderCraftingBar();
  }
}

// L'argent des ventes arrive apres un petit moment
function tickSalesUI() {
  var earned = tickSales();
  if (G.sales.length > 0) renderHeader();
  if (earned > 0) {
    playSellSound();
    showFloatingMoney(earned, null);
    toast(t('sell.earnedAll', { v: fmtMoney(earned) }));
    renderHeader();
    tutorialCheck();
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
  BUILDINGS.forEach(function(bld) {
    var bldLvl = buildingUnlockLvl(bld);
    if (bldLvl > G.level + 3) return;
    if (bldLvl > G.level) {
      h += '<div class="bld-card locked"><span>\u{1F512}</span> ' + t('bld.locked', { v: bldLvl }) + '</div>';
      return;
    }
    var qty = (G.buildings[bld.id] || { qty: 0 }).qty;
    var info = buildingBulkInfo(bld);
    h += '<div class="bld-card"><span class="bld-emoji">' + bld.e + '</span><div class="bld-info">';
    h += '<div class="bld-name">' + t('b.' + bld.id) + ' <span class="bld-qty">' + t('bld.qty', { v: qty }) + '</span></div>';
    var deliveryLeft = qty > 0 ? (G.bldTimers[bld.id] || BLD_CYCLE_SEC) : BLD_CYCLE_SEC;
    h += '<div class="bld-prod" title="' + escH(t('i.' + bld.produces)) + '">' + getIngEmoji(bld.produces) + ' ' + (qty > 0 ? t('bld.delivery', { q: fmt(buildingDelivery(bld)), n: t('i.' + bld.produces), t: fmtTime(deliveryLeft) }) : t('bld.eachHour', { n: t('i.' + bld.produces) })) + '</div>';
    if (qty > 0 && !isBroken('b', bld.id)) {
      var pctB = Math.max(0, Math.min(100, (1 - deliveryLeft / BLD_CYCLE_SEC) * 100));
      h += '<div class="bld-wait"><div class="loan-bar bld-bar" role="progressbar" aria-valuenow="' + Math.floor(pctB) + '" aria-valuemin="0" aria-valuemax="100"><div style="width:' + pctB.toFixed(1) + '%"></div></div><span>\u23F1 ' + fmtTime(deliveryLeft) + '</span></div>';
    }
    if (isBroken('b', bld.id)) {
      var left = repairingLeft('b', bld.id);
      h += '<div class="broke-tag">' + t('broke.status') + '</div>';
      h += left > 0 ? '<button class="btn btn-small" disabled>' + t('broke.repairing', { v: fmtTime(left) }) + '</button>'
        : '<button class="btn btn-small btn-primary" onclick="doRepair(\'b\',\'' + bld.id + '\')"' + (G.money < repairCost('b', bld.id) ? ' disabled' : '') + '>' + t('broke.repair', { v: fmtMoney(repairCost('b', bld.id)) }) + '</button>';
    }
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

// ============ SUCCES ============
function onAchievementUnlocked() {
  playSuccessSound();
  if (document.getElementById('ach-pane')) refreshAchPane();
  vibrate(25);
}

// ============ BARRE DU BAS ============
function renderSpaceBar() {
  var el = document.getElementById('space-bar');
  if (!el) return;
  var used = usedSpace() + reservedSpace();
  var max = maxSpaceNow();
  var pct = max > 0 ? Math.min(100, Math.floor(used / max * 100)) : 0;
  var h = '<div class="space-row"><div class="space-usage-wrap">';
  h += '<span>' + t('space.label') + ' : ' + t('space.text', { u: used < 1000 ? decimalize(used.toFixed(1)) : fmt(used), m: fmt(max) }) + '</span>';
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
  var pendingKeys = Object.keys(G.unlocks.pending || {});
  if (G.crafting.length === 0 && G.sales.length === 0 && pendingKeys.length === 0) { setHTML(el, ''); fitDock(); return; }
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
  G.sales.forEach(function(sale) {
    var pct = Math.min(100, Math.floor((now - sale.start) / SALE_DELAY_MS * 100));
    h += '<div class="craft-item sale-item"><span class="craft-emoji">\u{1F4B0}</span><div class="craft-progress-wrap"><div class="craft-progress" style="width:' + pct + '%"></div>';
    h += '<span class="craft-label">' + t('sell.selling', { v: fmtMoney(sale.total) }) + '</span></div>';
    h += '<span class="craft-left">' + fmtTime(Math.max(0, (SALE_DELAY_MS - (now - sale.start)) / 1000)) + '</span></div>';
  });
  order.forEach(function(key) {
    var grp = groups[key];
    var first = grp.items[0];
    var elapsed = now - first.startTime;
    var data = grp.isIng ? findIng(grp.id) : findRec(grp.id);
    var name = grp.isIng ? t('i.' + grp.id) : recShortName(data);
    // Une fournee gelee ne depasse pas ce que la place lui laisse
    var pRaw = Math.max(0, Math.min(1, elapsed / first.duration));
    var pCap = (!grp.isIng && first.cap !== undefined) ? Math.min(pRaw, first.cap) : pRaw;
    var pct = Math.floor(pCap * 100);
    var remaining = Math.max(0, (first.duration - elapsed) / 1000);
    var frozen = !grp.isIng && first.frozen && pRaw > pCap + 0.001;
    if (!first.uid) first.uid = newCraftUid();
    h += '<div class="craft-item' + (frozen ? ' frozen' : '') + '" role="button" tabindex="0" onclick="showDiscardCraft(\'' + first.uid + '\')" title="' + escH(t(frozen ? 'craft.frozenTip' : 'craft.discardTip')) + '"><span class="craft-emoji">' + data.e + '</span><div class="craft-progress-wrap">';
    h += '<div class="craft-progress" style="width:' + pct + '%"></div>';
    h += '<span class="craft-label">' + name + (grp.items.length > 1 ? ' <small class="craft-x">x' + grp.items.length + '</small>' : '') + (frozen ? ' ❄' : '') + '</span>';
    h += '</div><span class="craft-left">' + (frozen ? '❄' : fmtTime(remaining)) + '</span></div>';
  });
  // Un ingredient ou une recette en cours de deblocage
  pendingKeys.forEach(function(key) {
    var parts = key.split(':'), item = parts[0] === 'ing' ? findIng(parts[1]) : findRec(parts[1]);
    if (!item) return;
    var total = unlockDelay(item) * 1000, left = Math.max(0, G.unlocks.pending[key] - now);
    h += '<div class="craft-item unlock-item" title="' + escH(t('unlock.barTip')) + '"><span class="craft-emoji">' + item.e + '</span><div class="craft-progress-wrap"><div class="craft-progress" style="width:' + Math.max(0, Math.min(100, Math.floor((1 - left / Math.max(1, total)) * 100))) + '%"></div>';
    h += '<span class="craft-label">' + (parts[0] === 'ing' ? t('i.' + item.id) : recShortName(item)) + '</span></div><span class="craft-left">' + fmtTime(left / 1000) + '</span></div>';
  });
  // Un cueilleur qui change d'ingredient : son compte a rebours est la aussi
  G.employees.forEach(function(emp) {
    if (!hasJob(emp, 'collector') || !collectorMoving(emp)) return;
    var total = collectorMoveSec(emp) * 1000, left = Math.max(0, emp.moveUntil - now);
    h += '<div class="craft-item move-item" role="button" tabindex="0" onclick="showEmpInfoModal(' + emp.id + ')"><span class="craft-emoji">' + getIngEmoji(emp.assignedIng) + '</span><div class="craft-progress-wrap"><div class="craft-progress" style="width:' + Math.floor((1 - left / Math.max(1, total)) * 100) + '%"></div>';
    h += '<span class="craft-label">' + escH(emp.name) + '</span></div><span class="craft-left">' + fmtTime(left / 1000) + '</span></div>';
  });
  setHTML(el, h);
  fitDock();
}

function fitDock() {
  var d = document.getElementById('dock');
  if (d) document.documentElement.style.setProperty('--dock-h', d.offsetHeight + 'px');
  var f = document.getElementById('game-footer');
  if (f) document.documentElement.style.setProperty('--foot-h', f.offsetHeight + 'px');
}
window.addEventListener('resize', function() { if (typeof fitDock === 'function') fitDock(); });

// La barre du bas se replie d'un clic ; le choix est retenu sur cet appareil
var DOCK_FOLD_KEY = 'p2ds_dock_folded';
function applyDockFold(folded) {
  var d = document.getElementById('dock'), b = document.getElementById('dock-toggle');
  if (!d) return;
  d.classList.toggle('folded', folded);
  if (b) {
    var label = t(folded ? 'dock.unfold' : 'dock.fold');
    b.setAttribute('aria-expanded', folded ? 'false' : 'true');
    b.setAttribute('aria-label', label);
    b.title = label;
    b.textContent = folded ? label : '';   // repliee : le bouton dit clairement comment la rouvrir
  }
  fitDock();
}
function toggleDock() {
  var folded = !document.getElementById('dock').classList.contains('folded');
  try { localStorage.setItem(DOCK_FOLD_KEY, folded ? '1' : '0'); } catch (e) { /* tant pis */ }
  applyDockFold(folded);
}
function initDockFold() {
  var f = false;
  try { f = localStorage.getItem(DOCK_FOLD_KEY) === '1'; } catch (e) { /* tant pis */ }
  applyDockFold(f);
}

// Jeter une preparation : les ingredients reviennent, d'autant moins que la barre a monte
function showDiscardCraft(uid) {
  var c = null;
  G.crafting.forEach(function(x) { if (x.uid === uid) c = x; });
  if (!c) return;
  var back = craftRefund(c), parts = [];
  for (var k in back) parts.push(getIngEmoji(k) + ' ' + fmt(back[k]) + ' ' + t('i.' + k));
  var data = c.isIngCraft ? findIng(c.ingId) : findRec(c.recId);
  var h = '<h2>' + data.e + ' ' + (c.isIngCraft ? t('i.' + c.ingId) : recShortName(data)) + '</h2>';
  h += '<p>' + t('craft.progress', { v: Math.floor(craftProgress(c) * 100) }) + '</p>';
  h += '<p class="set-help">' + t('craft.discardHelp') + '</p>';
  h += '<p>' + (parts.length ? t('craft.youGet', { v: parts.join(', ') }) : t('craft.youGetNothing')) + '</p>';
  h += '<div class="modal-btns"><button class="btn btn-danger" onclick="doDiscardCraft(\'' + uid + '\')">' + t('craft.discard') + '</button>';
  h += '<button class="btn" onclick="hideModal()">' + t('common.cancel') + '</button></div>';
  showModal(h);
}
function doDiscardCraft(uid) {
  var back = discardCraft(uid);
  hideModal();
  if (back) { toast(t('craft.discarded')); renderCraftingBar(); renderIngredients(); renderSpaceBar(); renderMainPanel(); }
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
// Une fenetre « verrouillee » (nom obligatoire, onglet en double) ne se ferme que par ses boutons
function modalIsLocked() { return !!document.querySelector('#modal-overlay .modal.modal-locked'); }
function dismissModal() {
  if (modalIsLocked()) return;
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
  endMenuPause();
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

// Les reglages, les patisseries et la console arretent le temps
var menuPause = { on: false, since: 0 };

// ============ NOTIFICATIONS ============
var lastNotifyAt = 0;
function notifyAway(msg, force) {
  if (!G.settings || !G.settings.notifs || typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  if (!document.hidden || menuPause.on) return;
  var now = Date.now();
  if (!force && now - lastNotifyAt < 60000) return;
  lastNotifyAt = now;
  var text = String(msg).replace(/<[^>]*>/g, '').trim();
  try { new Notification('Pâtisserie 2D Simulator', { body: text, icon: 'favicon.png', tag: 'p2ds' }); } catch (e) { /* pas grave */ }
}

// Le jeu tourne en arriere-plan sans pause depuis 5 minutes
var hiddenSince = 0, hiddenWarned = false;
document.addEventListener('visibilitychange', function() {
  hiddenSince = document.hidden ? Date.now() : 0;
  hiddenWarned = false;
});
function tickAwayReminder() {
  if (!hiddenSince || hiddenWarned || Date.now() - hiddenSince < 300000) return;
  hiddenWarned = true;
  notifyAway(t('notif.running'), true);
}

function askNotifications(yes) {
  G.notifAsked = true;
  hideModal();
  if (!yes || typeof Notification === 'undefined') { G.settings.notifs = false; bobSay(t('bob.notifLater')); save(); return; }
  Notification.requestPermission().then(function(p) {
    G.settings.notifs = p === 'granted';
    bobSay(t(p === 'granted' ? 'bob.notifOk' : 'bob.notifDenied'));
    save();
  });
}

function toggleNotifications() {
  if (G.settings.notifs) { G.settings.notifs = false; refreshSettingsPane(); return; }
  if (typeof Notification === 'undefined') return;
  Notification.requestPermission().then(function(p) { G.settings.notifs = p === 'granted'; refreshSettingsPane(); save(); });
}

// ============ LE CHANGELOG ============
// Les nouveautes, dans la langue du joueur. Le texte est garde : la fenetre s'ouvre tout de suite, puis se met a jour.
// Pour les langues qui n'ont que les versions recentes traduites, les plus anciennes viennent de l'anglais.
var changelogCache = {};
function changelogNames() {
  var l = currentLang;
  return { main: l === 'fr' ? 'CHANGELOG.md' : 'CHANGELOG.' + l + '.md', en: 'CHANGELOG.en.md', secret: l === 'fr' ? 'CHANGELOG-SECRET.md' : 'CHANGELOG-SECRET.en.md' };
}
function changelogText(file) {
  if (changelogCache[file] === undefined) { try { changelogCache[file] = localStorage.getItem('p2ds_cl_' + file) || ''; } catch (e) { changelogCache[file] = ''; } }
  return changelogCache[file];
}
function changelogFetch(file) {
  return fetch(file).then(function(r) { return r.ok ? r.text() : null; }).catch(function() { return null; }).then(function(txt) {
    if (txt) { changelogCache[file] = txt; try { localStorage.setItem('p2ds_cl_' + file, txt); } catch (e) { /* tant pis */ } }
  });
}
// Les notes privees de l'administrateur : lues depuis sa base, jamais depuis un fichier public, et gardees seulement en memoire
var changelogPrivate = [];   // les notes privees : { version, text }
function changelogLoadPrivate() {
  changelogPrivate = [];
  var prof = typeof getProfiles === 'function' ? findProfile(getProfiles().current) : null;
  if (!prof || prof.kind !== 'cloud' || !cloudAdminKnown(prof.id) || !cloudOnline()) return Promise.resolve();
  return cloudCall(prof.id, '/rest/v1/admin_notes?select=version,body_fr,body_en&order=id.desc').then(function(rows) {
    changelogPrivate = (rows || []).map(function(r) { return { version: r.version, text: currentLang === 'fr' ? r.body_fr : r.body_en || r.body_fr }; });
  }, function() { /* pas de table ou hors ligne : tant pis */ });
}
// Les anciennes versions jouables en ligne (versions.json : nom de version -> adresse). Pas de fichier : pas de lien.
var changelogVers = null;
function changelogVersKey(s) { return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim(); }
function changelogVersLoad() {
  if (changelogVers) return Promise.resolve();
  return fetch('versions.json', { cache: 'no-cache' }).then(function(r) { return r.ok ? r.json() : {}; }).then(function(j) {
    changelogVers = {};
    Object.keys(j || {}).forEach(function(k) { if (/^https:\/\//.test(j[k])) changelogVers[changelogVersKey(k)] = j[k]; });
  }, function() { /* hors ligne ou pas de fichier : tant pis */ });
}
// Sous la premiere publication : les versions Alpha, jouables dans le navigateur
function changelogAlphaHTML() {
  if (!changelogVers) return '';
  var keys = Object.keys(changelogVers).filter(function(k) { return /^alpha /.test(k); }).sort();
  if (!keys.length) return '';
  var h = '<div class="alpha-pick"><label>🧪 ' + escH(t('changelog.alpha')) + '</label><select onchange="if(this.value){window.open(this.value,\'_blank\',\'noopener\');this.selectedIndex=0}"><option value="">' + escH(t('changelog.alphaPick')) + '</option>';
  keys.forEach(function(k) { h += '<option value="' + escH(changelogVers[k]) + '">' + escH(k.replace(/^alpha/, 'Alpha')) + '</option>'; });
  return h + '</select></div>';
}
function changelogLoad() {
  var n = changelogNames(), jobs = [changelogFetch(n.main), changelogLoadPrivate(), changelogVersLoad()];
  if (currentLang !== 'fr' && currentLang !== 'en') jobs.push(changelogFetch(n.en));
  if (G.settings && G.settings.changelogMax) jobs.push(changelogFetch(n.secret));
  return Promise.all(jobs);
}
// En arriere-plan, des que le jeu est calme : la fenetre sera deja prete
function changelogPrefetch() { (window.requestIdleCallback || function(f) { setTimeout(f, 3000); })(function() { changelogLoad(); }); }

function changelogSplit(md) { var p = String(md || '').split(/\r?\n(?=## )/); return { head: p.shift() || '', list: p }; }
var CHANGELOG_FIRST = 3; // les 3 versions les plus recentes d'abord, le reste a la demande
// Les notes privees se glissent dans la section de leur version, chaque ligne avec un cadenas
function changelogMergePrivate(list) {
  if (!changelogPrivate.length) return list;
  return list.map(function(sec) {
    var head = (sec.split(/\r?\n/)[0] || '');
    var extra = [];
    changelogPrivate.forEach(function(p) {
      var v = String(p.version || '').trim();
      if (!v || head.indexOf('## ' + v) !== 0 || !/^[ (]?$/.test(head.slice(3 + v.length, 4 + v.length))) return;
      String(p.text || '').split(/\r?\n/).forEach(function(line) {
        if (/^\s*[-*] /.test(line)) extra.push('- \u{1F512} ' + line.replace(/^\s*[-*] /, ''));
      });
    });
    return extra.length ? sec.replace(/\s*$/, '') + '\n' + extra.join('\n') + '\n' : sec;
  });
}
function changelogHTML(showAll) {
  var n = changelogNames();
  var main = changelogSplit(changelogText(n.main)), en = changelogSplit(changelogText(n.en));
  if (!main.list.length) main = en; // pas de fichier dans cette langue : l'anglais
  var list = main.list.slice();
  // Les versions plus anciennes que celles traduites : en anglais
  if (currentLang !== 'fr' && currentLang !== 'en' && main !== en && en.list.length > list.length) list = list.concat(en.list.slice(list.length));
  var secret = (G.settings && G.settings.changelogMax) ? changelogSplit(changelogText(n.secret)) : null;
  if (!main.head && !list.length) return '';
  list = changelogMergePrivate(list);
  var shown = showAll || list.length <= CHANGELOG_FIRST + 1 ? list : list.slice(0, CHANGELOG_FIRST);
  var md = [main.head].concat(shown).join('\n') + (secret ? '\n' + [secret.head].concat(secret.list).join('\n') : '');
  var html = markdownLite(md);
  if (!showAll && shown.length < list.length) html += '<button class="btn btn-small" onclick="changelogShowAll()">' + t('changelog.older') + '</button>';
  else html += changelogAlphaHTML();
  return html;
}
function changelogShowAll() { var el = document.getElementById('changelog-body'); if (el) el.innerHTML = iconify(changelogHTML(true)); }

function showChangelog(from) {
  var h = (from === 'home' ? '<button type="button" class="btn btn-small changelog-arch" onclick="openArchives()">🗄️ ' + escH(t('changelog.archives')) + '</button>' : '') + '<h2>' + t('changelog.title') + '</h2>';
  h += typeof updateBoxHTML === 'function' ? updateBoxHTML() : '';   // la boite de mise a jour, des qu'il y en a une
  h += '<div class="changelog" id="changelog-body">…</div>';
  h += '<div class="modal-btns"><button class="btn" onclick="hideModal()">' + t('common.close') + '</button></div>';
  showModal(h, 'modal-changelog');
  var draw = function() {
    var el = document.getElementById('changelog-body');
    if (!el) return;
    var html = changelogHTML(false);
    if (html) el.innerHTML = iconify(html); else el.textContent = t('changelog.error');
  };
  if (changelogText(changelogNames().main) || changelogText(changelogNames().en)) draw();
  changelogLoad().then(draw);
}

// Juste ce qu'il faut de Markdown pour le changelog : titres, listes, gras
function markdownLite(md) {
  var out = '', inList = false;
  md.split(/\r?\n/).forEach(function(line) {
    var txt = escH(line.trim()).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    var item = /^- /.test(line.trim());
    if (inList && !item) { out += '</ul>'; inList = false; }
    if (/^# /.test(line)) return;
    if (/^## /.test(line)) out += '<h3>' + txt.slice(3) + '</h3>';
    else if (item) { if (!inList) { out += '<ul>'; inList = true; } out += '<li>' + txt.slice(2) + '</li>'; }
    else if (txt) out += '<p>' + txt + '</p>';
  });
  return out + (inList ? '</ul>' : '');
}

// /pause : le temps s'arrete, mais on peut toujours acheter, ouvrir les menus... et on ne perd rien
var softPause = { on: false, last: 0 };
function setSoftPause(on) {
  if (on === softPause.on) return;
  if (on) {
    endMenuPause();
    softPause.on = true;
    softPause.last = Date.now();
  } else {
    tickSoftPause();
    softPause.on = false;
  }
  document.body.classList.toggle('soft-paused', softPause.on);
  var badge = document.getElementById('soft-pause');
  if (softPause.on && !badge) {
    badge = document.createElement('button');
    badge.id = 'soft-pause';
    badge.type = 'button';
    badge.onclick = function() { setSoftPause(false); };
    document.body.appendChild(badge);
  }
  if (badge) {
    if (softPause.on) badge.textContent = '\u23F8 ' + t('pause.soft');
    else badge.remove();
  }
}
// Tant que la pause douce dure, tout ce qui compte le temps est repousse d'autant
function tickSoftPause() {
  if (!softPause.on) return;
  var now = Date.now(), ms = now - softPause.last;
  softPause.last = now;
  if (ms > 0) { shiftGameTimers(ms); shiftAllBakeries(ms); }
}

function beginMenuPause() {
  if (G.paused || menuPause.on || softPause.on) return;
  menuPause.on = true;
  menuPause.since = Date.now();
}

function endMenuPause() {
  if (!menuPause.on) return;
  menuPause.on = false;
  var ms = Date.now() - menuPause.since;
  shiftGameTimers(ms);
  shiftAllBakeries(ms);
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
  beginMenuPause();
  ensureBakeryList();
  var h = '<h2>' + t('bakery.title') + '</h2><p class="hint-note">' + t('bakery.help') + '</p>';
  var several = G.bakeries.length >= 2;
  G.bakeries.forEach(function(b, i) {
    var isCurrent = i === G.currentBakeryIndex;
    var s = isCurrent ? G : b.state;
    h += '<div class="bakery-card' + (isCurrent ? ' current' : '') + '">';
    h += '<span class="bakery-card-name">' + escH(isCurrent ? G.bakeryName : b.name) + '</span>';
    if (isCurrent) h += '<span class="bakery-current-tag">' + t('bakery.current') + '</span>';
    else h += '<button class="btn btn-small btn-primary" onclick="doSwitchBakery(' + i + ')">' + t('bakery.go') + '</button>';
    if (several) h += '<button class="btn btn-small btn-danger" onclick="confirmSellBakery(' + i + ')">' + t('bakery.sell') + '</button>';
    if (s) {
      h += '<div class="bakery-stats"><span>' + t('bakery.level', { v: s.level }) + '</span><span>' + t('bakery.money', { v: fmtMoney(s.money) }) + '</span>';
      if (s.rentDebt > 0) h += '<span class="debt">' + t('bakery.debt', { v: fmtMoney(s.rentDebt) }) + '</span>';
      h += '<span>' + t('bakery.value', { v: fmtMoney(getBakeryValueForIndex(i)) }) + '</span></div>';
    }
    h += '</div>';
  });
  var cost = bakeryOpenCost();
  h += '<div class="bakery-new"><button class="btn btn-primary" onclick="doOpenNewBakery()"' + (G.money < cost ? ' disabled' : '') + '>' + t('bakery.openNew') + ' (' + fmtMoney(cost) + ')</button></div>';
  h += '<div class="modal-btns"><button class="btn" onclick="closeMenu()">' + t('common.close') + '</button></div>';
  showModal(h);
}

function doSwitchBakery(index) {
  if (switchToBakery(index)) { hideModal(); enforceThemeLocks(); applyTheme(); fullRender(); }
}

function confirmSellBakery(index) {
  var p = bakeryValueParts(index);
  if (!p) return;
  var name = index === G.currentBakeryIndex ? G.bakeryName : G.bakeries[index].name;
  var h = '<h2>' + t('bakery.sellTitle', { n: escH(name) }) + '</h2><p class="warning">' + t('bakery.sellWarn') + '</p><ul class="sell-lines">';
  [['bakery.partCash', p.cash], ['bakery.partStock', p.stock], ['bakery.partIng', p.ingredients], ['bakery.partEquip', p.equipment], ['bakery.partRep', p.reputation]].forEach(function(x) {
    h += '<li><span>' + t(x[0]) + '</span><b>' + fmtMoney(x[1]) + '</b></li>';
  });
  if (p.debt > 0) h += '<li><span>' + t('bakery.partDebt') + '</span><b>-' + fmtMoney(p.debt) + '</b></li>';
  h += '<li class="total"><span>' + t('bakery.partTotal') + '</span><b>' + fmtMoney(p.total) + '</b></li></ul>';
  h += '<div class="modal-btns"><button class="btn btn-danger" onclick="doSellBakery(' + index + ')">' + t('bakery.sellConfirm') + '</button>';
  h += '<button class="btn" onclick="showBakeriesModal()">' + t('common.cancel') + '</button></div>';
  showModal(h);
}

function doSellBakery(index) {
  if (sellBakery(index)) { enforceThemeLocks(); applyTheme(); fullRender(); showBakeriesModal(); renderHeader(); }
}

function doOpenNewBakery() {
  var first = !G.secondBakery;
  if (openNewBakery()) {
    fullRender();
    checkAchievements();
    showNameBakery(G.bakeries.length - 1, first);
  }
}

// Bob te felicite et te demande son nom
function showNameBakery(index, first) {
  var b = G.bakeries[index];
  var h = '<div class="bob-talk">' + bobFigure() + '<div class="bob-talk-speech"><span class="bob-bubble-name">Bob</span>';
  h += '<p>' + bobFilter(t('bakery.bobCongrats')) + '</p>';
  h += '<input id="new-bakery-name" maxlength="30" value="' + escH(b.name) + '" onkeydown="if(event.key===\'Enter\')doNameBakery(' + index + ',' + !!first + ')">';
  h += '<div class="bob-talk-foot"><span></span><button class="btn btn-primary" onclick="doNameBakery(' + index + ',' + !!first + ')">' + t('common.next') + '</button></div></div></div>';
  showModal(h, 'modal-bob');
  var input = document.getElementById('new-bakery-name');
  if (input) { input.focus(); input.select(); }
}

function doNameBakery(index, first) {
  var b = G.bakeries[index];
  var val = document.getElementById('new-bakery-name').value.trim().slice(0, 30);
  if (b && val) {
    b.name = val;
    if (b.state) b.state.bakeryName = val;
  }
  showBakeriesModal();
  if (first) bobTell(t('bakery.statsUnlocked'));
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
  var keep = { companyName: G.companyName, settings: G.settings, achievements: G.achievements, birthday: G.birthday, unlockedThemes: G.unlockedThemes, cheatUnlocked: G.cheatUnlocked, bobClicks: G.bobClicks, bobSad: G.bobSad, wentBankrupt: true, logoClicks: G.logoClicks, birthdaySetOn: G.birthdaySetOn, birthdayBoostYear: G.birthdayBoostYear, machines: G.machines, cmdUsage: G.cmdUsage, sugarFed: G.sugarFed, challenge: G.challenge, nextChallengeAt: G.nextChallengeAt, bakeryTheme: G.bakeryTheme, bakeries: G.bakeries, currentBakeryIndex: G.currentBakeryIndex, secondBakery: G.secondBakery, bankUnlocked: G.bankUnlocked, achHere: G.achHere };
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

// La fenetre d'absence : tout ce qui s'est passe, par patisserie et au total, avec les graphiques si tu les as debloques
var offlineTab = 0;
function offlineLines(r) {
  var h = '<ul class="offline-list">';
  h += '<li>' + t('offline.ing', { v: fmt(r.ingredients) }) + '</li>';
  h += '<li>' + t('offline.sales', { v: fmtMoney(r.money) }) + '</li>';
  h += '<li>' + t('offline.rent', { v: fmtMoney(r.rent) }) + '</li>';
  h += '<li>' + t('offline.salaries', { v: fmtMoney(r.salaries) }) + '</li>';
  if (r.loans > 0) h += '<li>' + t('offline.loans', { v: fmtMoney(r.loans) }) + '</li>';
  h += '<li><b>' + t('offline.net', { v: fmtMoney(r.money - r.rent - r.salaries - r.loans) }) + '</b></li>';
  return h + '</ul>' + (r.unpaid ? '<p class="warning">' + t('offline.unpaid') + '</p>' : '');
}
// Un bilan negatif sans explication ne sert a rien : Bob dit pourquoi (aucun vendeur, trop d'employes, le loyer...)
function offlineWhy(r, one) {
  var net = r.money - r.rent - r.salaries - r.loans;
  if (net >= 0) return '';
  var why = [];
  var st = one ? bakeryStateByName(one.name) : G;
  var sellers = 0, staff = st && st.employees ? st.employees.length : 0;
  if (st && st.employees) st.employees.forEach(function(e) { if (e.type === 'seller' || (e.type === 'versatile' && (e.jobs || []).some(function(j) { return j.type === 'seller'; }))) sellers++; });
  if (r.money <= 0) why.push(sellers === 0 ? t('offline.why.noSeller') : t('offline.why.noStock'));
  if (r.salaries > r.rent && r.salaries > 0) why.push(t('offline.why.staff', { n: fmt(staff), v: fmtMoney(r.salaries) }));
  if (r.rent >= r.salaries && r.rent > 0) why.push(t('offline.why.rent', { v: fmtMoney(r.rent) }));
  if (r.loans > 0) why.push(t('offline.why.loans', { v: fmtMoney(r.loans) }));
  if (!why.length) return '';
  return '<div class="bob-talk offline-bob">' + (typeof bobFigure === 'function' ? bobFigure() : '') + '<div class="bob-talk-speech"><span class="bob-bubble-name">Bob</span><p>' + t('offline.bobNeg', { why: why.join(' ; ') }) + '</p></div></div>';
}
function bakeryStateByName(name) {
  var hit = null;
  bakeryStates().forEach(function(x) { if (!hit && x.name === name) hit = x.state; });
  return hit;
}
function offlineGraph(list) {
  if (list.length < 2) return '';
  var max = 0;
  list.forEach(function(x) { max = Math.max(max, x.money); });
  var h = '<div class="offline-graph"><h4>' + t('offline.graph') + '</h4>';
  list.forEach(function(x) {
    var pct = max > 0 ? Math.max(2, x.money / max * 100) : 2;
    h += '<div class="og-row"><span>' + escH(x.name) + '</span><div class="og-bar"><i style="width:' + pct.toFixed(1) + '%"></i></div><b>' + fmtMoney(x.money) + '</b></div>';
  });
  return h + '</div>';
}
function offlineDraw(r, tab) {
  offlineTab = tab;
  var list = r.bakeries || [r];
  var tabs = list.length > 1 ? '<div class="list-tools offline-tabs"><button class="chip' + (tab === 0 ? ' active' : '') + '" onclick="offlineDraw(window._offlineR,0)">' + t('offline.all') + '</button>' +
    list.map(function(x, i) { return '<button class="chip' + (tab === i + 1 ? ' active' : '') + '" onclick="offlineDraw(window._offlineR,' + (i + 1) + ')">' + escH(x.name) + '</button>'; }).join('') + '</div>' : '';
  var shown = tab === 0 ? list.reduce(function(a, x) { return { ingredients: a.ingredients + x.ingredients, money: a.money + x.money, rent: a.rent + x.rent, salaries: a.salaries + x.salaries, loans: a.loans + x.loans, unpaid: a.unpaid || x.unpaid }; }, { ingredients: 0, money: 0, rent: 0, salaries: 0, loans: 0, unpaid: false }) : list[tab - 1];
  var h = '<h2>' + t('offline.title') + '</h2><p>' + t('offline.away', { t: fmtLongTime(r.away || r.seconds) }) + '</p>';
  if ((r.away || 0) > r.seconds + 1) h += '<p class="set-help">' + t('offline.capped', { t: fmtLongTime(r.seconds) }) + '</p>';
  h += tabs + offlineLines(shown) + offlineWhy(shown, tab === 0 ? null : list[tab - 1]) + (tab === 0 && list.length > 1 && G.bakeries.length >= 2 ? offlineGraph(list) : '');
  h += '<div class="modal-btns"><button class="btn btn-primary" onclick="hideModal()">OK</button></div>';
  var m = document.querySelector('#modal-overlay .modal');
  if (m && m.querySelector('.offline-list')) m.innerHTML = iconify(h); else showModal(iconify(h), 'modal-offline');
}
function showOfflineModal(r) {
  window._offlineR = r;
  offlineDraw(r, 0);
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

// ============ TAILLE DES DEUX COLONNES (PC) ============
function initSplit() {
  var area = document.getElementById('game-area'), handle = document.getElementById('split-handle');
  if (!area || !handle || handle._ready) return;
  handle._ready = true;
  handle.title = t('ing.resize');
  try {
    var sw = parseFloat(localStorage.getItem('p2ds_ing_w')), sh = parseFloat(localStorage.getItem('p2ds_ing_h'));
    if (sw > 0) area.style.setProperty('--ing-w', sw + 'px');
    if (sh > 0) document.documentElement.style.setProperty('--ing-h', sh + 'px');
  } catch (e) { /* tant pis */ }
  handle.addEventListener('pointerdown', function(e) {
    e.preventDefault();
    handle.setPointerCapture(e.pointerId);
    document.body.classList.add('resizing');
    var stacked = ingStacked(), last = 0;
    var ing = document.getElementById('ingredients');
    var move = function(ev) {
      if (stacked) {
        var top = ing.getBoundingClientRect().top;
        last = Math.max(70, Math.min(window.innerHeight * 0.6, ev.clientY - top));
        document.documentElement.style.setProperty('--ing-h', last + 'px');
      } else {
        var left = area.getBoundingClientRect().left + 12;
        last = Math.max(240, Math.min(area.getBoundingClientRect().width * 0.65, ev.clientX - left));
        area.style.setProperty('--ing-w', last + 'px');
      }
    };
    var up = function() {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
      document.body.classList.remove('resizing');
      try { if (last) localStorage.setItem(stacked ? 'p2ds_ing_h' : 'p2ds_ing_w', String(Math.round(last))); } catch (e2) { /* tant pis */ }
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
  });
  handle.addEventListener('dblclick', function() {
    area.style.removeProperty('--ing-w');
    document.documentElement.style.removeProperty('--ing-h');
    try { localStorage.removeItem('p2ds_ing_w'); localStorage.removeItem('p2ds_ing_h'); } catch (e) { /* tant pis */ }
  });
}

// ============ LA MEME PARTIE DANS DEUX ONGLETS ============
// Chaque onglet qui joue une partie le note (avec l'heure). Si un autre onglet le fait deja, on previent avant d'ecraser.
// Garde dans sessionStorage : F5 et une mise a jour a chaud gardent le meme identifiant (ce n'est pas un 2e onglet)
var TAB_ID = (function() { try { var v = sessionStorage.getItem('p2ds_tab'); if (!v) { v = Math.random().toString(36).slice(2); sessionStorage.setItem('p2ds_tab', v); } return v; } catch (e) { return Math.random().toString(36).slice(2); } })();
function tabLockRelease() { try { var l = tabLockRead(); if (l && l.tab === TAB_ID) localStorage.removeItem(tabLockKey()); } catch (e) { /* tant pis */ } }
window.addEventListener('pagehide', tabLockRelease);
window.addEventListener('beforeunload', tabLockRelease);
function tabLockKey() { return 'p2ds_lock_' + CUR.profile + '_' + CUR.inst; }
function tabLockRead() { try { return JSON.parse(localStorage.getItem(tabLockKey())); } catch (e) { return null; } }
function tabLockWrite() { try { localStorage.setItem(tabLockKey(), JSON.stringify({ tab: TAB_ID, t: Date.now() })); } catch (e) { /* tant pis */ } }
function showDuplicateTab() {
  if (document.querySelector('.modal-dup')) return;
  ui.savesBlocked = true;   // cet onglet n'ecrase rien tant qu'on n'a pas choisi
  var h = '<div class="bob-talk">' + bobFigure() + '<div class="bob-talk-speech"><span class="bob-bubble-name">Bob</span>';
  h += '<p>' + t('dup.text') + '</p><div class="bob-talk-foot">';
  h += '<button class="btn btn-primary" onclick="duplicatePlayHere()">' + t('dup.here') + '</button>';
  h += '<button class="btn" onclick="duplicateLeave()">' + t('dup.leave') + '</button></div></div></div>';
  showModal(h, 'modal-bob modal-locked modal-dup');
}
function duplicatePlayHere() { tabLockWrite(); ui.savesBlocked = false; hideModal(); }
function duplicateLeave() { ui.savesBlocked = true; hideModal(); if (typeof backToHome === 'function') backToHome(); }
function claimTabLock() {
  if (!CUR.inst) return;
  var lock = tabLockRead();
  if (lock && lock.tab !== TAB_ID && Date.now() - lock.t < 8000) showDuplicateTab(); else tabLockWrite();
  if (claimTabLock._timer) return;
  claimTabLock._timer = setInterval(function() {
    if (!CUR.inst || document.body.classList.contains('home-open')) return;
    var l = tabLockRead();
    if (l && l.tab !== TAB_ID) showDuplicateTab(); else if (!ui.savesBlocked) tabLockWrite();
  }, 3000);
}

// ============ VIBRATIONS (telephone) ============
// Seulement pour les moments importants (niveau gagne, succes, evenement a choix, catastrophe) : pas a chaque toucher
var lastVibrate = 0;
function vibrate(pattern) {
  if (!(navigator.vibrate && window.matchMedia && matchMedia('(pointer: coarse)').matches)) return;
  if (typeof G === 'undefined' || !G.settings || G.settings.haptics === false) return;
  var now = Date.now();
  if (now - lastVibrate < 1500) return;   // jamais en rafale
  lastVibrate = now;
  try { navigator.vibrate(pattern); } catch (e) { /* pas de vibreur */ }
}

// ============ CLAVIER ============
document.addEventListener('keydown', function(e) {
  // Maj + Echap : retour au menu des parties (Ctrl + Echap ouvre le menu Demarrer de Windows)
  if (e.key === 'Escape' && e.shiftKey) { e.preventDefault(); if (typeof backToHome === 'function' && !(typeof introActive !== 'undefined' && introActive)) backToHome(); return; }
  if (e.key === 'Escape') {
    if (typeof introActive !== 'undefined' && introActive) return;
    // Une fenetre ouverte se ferme. Sinon, Echap met le jeu en pause.
    if (document.getElementById('modal-overlay').style.display === 'flex') dismissModal();
    else if (!G.gameOver) togglePause();
    return;
  }
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
  if (document.getElementById('modal-overlay').style.display === 'flex') return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  var k = String(e.key).toLowerCase();
  if (typeof introActive !== 'undefined' && introActive) return;
  if (k === 'r') { e.preventDefault(); showSettingsModal(); return; }
  if (k === 's') { e.preventDefault(); showAchievementsModal(); return; }
  if (k === '/' && G.cheatUnlocked) { e.preventDefault(); showCommandConsole(); return; }
  if (k === 'c') { e.preventDefault(); showChangelog(); return; }
  if (k === 'm') { e.preventDefault(); showBakeriesModal(); return; }
  // Les chiffres par leur touche, pas par le caractere : sur un clavier AZERTY, 1 sans Maj donne &
  var dm = /^(?:Digit|Numpad)([1-9])$/.exec(e.code || '');
  var wanted = visibleTabs()[(dm ? parseInt(dm[1], 10) : parseInt(e.key, 10)) - 1];
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
  renderHeader();
  renderTabs();
  renderIngredients();
  renderMainPanel();
  renderSpaceBar();
  renderCraftingBar();
  renderTutorial();
  renderBob();
  renderConsoleButton();
  renderFooter();
}

function renderFooter() {
  var el = document.getElementById('footer-text');
  if (el) setHTML(el, t('footer.rights') + ' ' + t('footer.icons') + ' <a href="https://github.com/jdecked/twemoji" target="_blank" rel="noopener">Twemoji</a> (CC-BY 4.0).');
}
