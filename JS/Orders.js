/* ============================================
   PATISSERIE 2D SIMULATOR - COMMANDES ET MACHINES
   Commandes de clients au niveau 30,
   boutique de machines au niveau 50.
   ============================================ */

// ============ COMMANDES ============
function renderOrders() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  var now = Date.now();
  var h = '<div class="panel-head"><h2>' + t('order.title') + '</h2>';
  h += '<span class="order-done-count">' + t('order.doneCount', { v: fmt(G.stats.ordersDone || 0) }) + '</span></div>';
  h += '<p class="hint-note">' + t('order.help') + '</p>';
  if (empCount('maitre') > 0) h += '<p class="order-butler">' + uiIcon('emp') + t('order.butler', { v: empCount('maitre') }) + '</p>';
  if (G.orders.length === 0) h += '<p class="empty-note">' + t('order.none') + '</p>';
  h += '<div class="order-grid">';
  G.orders.forEach(function(o) {
    var ready = orderReady(o);
    var left = Math.max(0, (o.expiresAt - now) / 1000);
    var pct = Math.max(0, Math.min(100, left / o.duration * 100));
    h += '<article class="order-card' + (ready ? ' ready' : '') + '">';
    h += '<div class="order-top"><b>' + escH(o.name) + '</b><span class="order-level lv' + o.items.length + '">' + t('order.level' + o.items.length) + '</span></div>';
    h += '<ul class="order-items">';
    o.items.forEach(function(it) {
      var rec = findRec(it.recId);
      var have = G.cakes[it.recId] || 0;
      h += '<li class="' + (have >= it.qty ? 'has' : 'missing') + '">' + rec.e + ' <span>' + recShortName(rec) + '</span><b>' + fmt(have) + ' / ' + fmt(it.qty) + '</b></li>';
    });
    h += '</ul>';
    h += '<div class="order-bar" aria-hidden="true"><div style="width:' + pct.toFixed(1) + '%"></div></div>';
    h += '<div class="order-foot"><span>' + uiIcon('clock') + fmtTime(left) + '</span>';
    h += '<span class="order-reward">' + fmtMoney(o.reward) + ' <small>' + t('order.prime', { v: fmtMoney(o.reward - o.base) }) + '</small></span></div>';
    h += '<button class="btn btn-primary" onclick="doFulfillOrder(' + o.id + ',this)"' + (ready ? '' : ' disabled') + '>' + t('order.deliver') + '</button>';
    h += '</article>';
  });
  h += '</div>';
  setHTML(el, h);
}

function doFulfillOrder(id, btn) {
  var earned = fulfillOrder(id);
  if (earned > 0) {
    playSellSound();
    showFloatingMoney(earned, btn);
    toast(t('order.delivered', { v: fmtMoney(earned) }));
    renderOrders();
    renderHeader();
    renderSpaceBar();
    renderTabs();
  }
}

// ============ MACHINES ============
function renderMachines() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  var h = '<div class="panel-head"><h2>' + t('mach.title') + '</h2></div>';
  h += '<p class="hint-note">' + t('mach.help') + '</p><div class="mach-grid">';
  MACHINES.forEach(function(m) {
    if (m.lvl > G.level + 10) return;
    var lvl = machineLevel(m.id);
    var maxed = lvl >= m.max;
    var cost = machineCost(m);
    var locked = G.level < m.lvl;
    h += '<article class="mach-card' + (maxed ? ' maxed' : '') + (locked ? ' locked' : '') + (isBroken('m', m.id) ? ' broken' : '') + '">';
    var broken = isBroken('m', m.id);
    h += '<div class="mach-top"><span class="mach-icon">' + (locked ? '\u{1F512}' : m.e) + '</span><div><b>' + machName(m) + '</b>';
    h += '<small>' + machDesc(m) + '</small></div></div>';
    h += '<div class="mach-pips" aria-label="' + lvl + ' / ' + m.max + '">';
    for (var i = 0; i < m.max; i++) h += '<i class="' + (i < lvl ? 'on' : '') + '"></i>';
    h += '</div>';
    if (lvl > 0) h += '<p class="mach-now">' + t('mach.level', { a: lvl, b: m.max }) + '</p>';
    if (broken) {
      var left = repairingLeft('m', m.id);
      h += '<p class="broke-tag">' + t('broke.status') + '</p>';
      h += left > 0 ? '<button class="btn" disabled>' + t('broke.repairing', { v: fmtTime(left) }) + '</button>'
        : '<button class="btn btn-primary" onclick="doRepair(\'m\',\'' + m.id + '\')"' + (G.money < repairCost('m', m.id) ? ' disabled' : '') + '>' + t('broke.repair', { v: fmtMoney(repairCost('m', m.id)) }) + '</button>';
    }
    if (locked) h += '<button class="btn" disabled>' + t('bank.levelReq', { v: m.lvl }) + '</button>';
    else h += '<button class="btn' + (maxed ? '' : ' btn-primary') + '" onclick="doBuyMachine(\'' + m.id + '\')"' + (maxed || G.money < cost ? ' disabled' : '') + '>' + (maxed ? t('mach.max') : t('mach.buy', { v: fmtMoney(cost) })) + '</button>';
    h += '</article>';
  });
  h += '</div>';
  setHTML(el, h);
}

function doRepair(kind, id) {
  if (repairItem(kind, id)) {
    playSuccessSound();
    renderHeader();
    if (kind === 'm') renderMachines(); else renderBuildings();
  } else {
    toast(t('ing.noMoney'));
    playErrorSound();
  }
}

function doBuyMachine(id) {
  if (buyMachine(id)) {
    toast(t('mach.bought'));
    playSuccessSound();
    startQueuedCrafts();
    renderMachines();
    renderHeader();
    renderCraftingBar();
  } else {
    toast(t('ing.noMoney'));
    playErrorSound();
  }
}
