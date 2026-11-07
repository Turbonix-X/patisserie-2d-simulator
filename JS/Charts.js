/* ============================================
   PATISSERIE 2D SIMULATOR - STATS ET GRAPHIQUES
   Les graphiques et les totaux s'ouvrent avec la
   deuxieme patisserie.
   ============================================ */

// Donnees des courbes affichees, pour le survol
var chartStore = {};

// ============ L'ONGLET ============
function renderStats() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  var open = !!G.secondBakery;
  if (!open) ui.statsView = 'here';
  var h = '<div class="panel-head"><h2>' + t('stats.title') + '</h2></div>';
  if (open) {
    h += '<div class="list-tools">';
    [['here', 'stats.viewHere'], ['charts', 'stats.viewCharts'], ['all', 'stats.viewAll']].forEach(function(v) {
      h += '<button class="chip' + (ui.statsView === v[0] ? ' active' : '') + '" onclick="ui.statsView=\'' + v[0] + '\';renderStats()">' + t(v[1]) + '</button>';
    });
    h += '</div>';
  }
  if (ui.statsView === 'charts') h += statsCharts(el);
  else if (ui.statsView === 'all') h += statsAll();
  else h += statsHere(open);
  setHTML(el, h);
}

function statRows(rows) {
  var h = '<div class="stats-grid">';
  rows.forEach(function(r) { h += '<div class="stat-row"><span>' + t(r[0]) + '</span><span>' + r[1] + '</span></div>'; });
  return h + '</div>';
}

function fmtPlay(ms) {
  return Math.floor(ms / 3600000) + 'h ' + Math.floor((ms % 3600000) / 60000) + 'm';
}

function statsHere(open) {
  var bldCount = 0;
  BUILDINGS.forEach(function(b) { bldCount += (G.buildings[b.id] || { qty: 0 }).qty; });
  var unlocked = 0;
  for (var k in G.achievements) { if (G.achievements[k]) unlocked++; }
  var rows = [
    ['stats.totalEarned', fmtMoney(G.totalEarned)],
    ['stats.totalCakes', fmt(G.stats.totalCakesMade)],
    ['stats.totalSold', fmt(G.stats.totalSold)],
    ['stats.totalClicks', fmt(G.stats.totalClicks)],
    ['stats.playTime', fmtPlay(G.playTimeMs)],
    ['stats.totalSalary', fmtMoney(G.stats.totalSalaryPaid)],
    ['stats.totalRent', fmtMoney(G.stats.totalRentPaid)],
    ['stats.totalIngCost', fmtMoney(G.stats.totalIngredientCost)],
    ['stats.totalInvested', fmtMoney(G.stats.totalInvested)],
    ['stats.buildings', fmt(bldCount)],
    ['stats.employees', fmt(G.employees.length)],
    ['stats.ovens', fmt(ovenSlots())],
    ['stats.events', fmt(G.stats.eventsSeen || 0)],
    ['stats.achievements', unlocked + ' / ' + ACHIEVEMENTS.length],
    ['stats.sellBonus', '+' + Math.round((sellValueMult() - 1) * 100) + ' %'],
    ['stats.rebirths', G.rebirth],
  ];
  if (G.bankUnlocked) {
    rows.push(['stats.loansTaken', fmt(G.stats.loansTaken)]);
    rows.push(['stats.interestPaid', fmtMoney(G.stats.totalInterestPaid)]);
  }
  var h = statRows(rows);
  if (!open) h += '<p class="stats-teaser">' + uiIcon('chart') + t('stats.teaser') + '</p>';
  h += '<p class="hint-note">' + t('stats.shortcuts', { n: visibleTabs().length }) + '</p>';
  return h;
}

// ============ TUILES ============
function statTile(label, value, help) {
  return '<div class="kpi" title="' + escH(help || '') + '"><span class="kpi-label">' + label + '</span><b class="kpi-value">' + value + '</b>' + (help ? '<small>' + help + '</small>' : '') + '</div>';
}

// ============ COURBES ============
function niceMax(v) {
  if (v <= 0) return 1;
  var p = Math.pow(10, Math.floor(Math.log10(v)));
  var n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

function shortNum(v) {
  if (v < 1000) return String(Math.round(v * 100) / 100);
  return fmt(v);
}

// opts : id, title, sub, xs (ms), series [{name, cls, vals, fmt}], log, step, width
function lineChart(opts) {
  var W = opts.width, H = 190;
  var L = 50, R = 74, T = 12, B = 24;
  var pw = W - L - R, ph = H - T - B;
  var xs = opts.xs;
  var minX = xs[0], maxX = xs[xs.length - 1];
  var spanX = Math.max(1, maxX - minX);
  var top = 0, low = Infinity;
  opts.series.forEach(function(s) {
    s.vals.forEach(function(v) { if (v > top) top = v; if (v > 0 && v < low) low = v; });
  });
  var log = !!opts.log && top > 0 && top / Math.max(low, 1e-9) > 100;
  var yOf, ticks = [];
  if (log) {
    var lo = Math.floor(Math.log10(Math.max(low, 0.1)));
    var hi = Math.ceil(Math.log10(top));
    if (hi === lo) hi = lo + 1;
    yOf = function(v) { return T + ph - (Math.log10(Math.max(v, Math.pow(10, lo))) - lo) / (hi - lo) * ph; };
    var stepT = Math.max(1, Math.ceil((hi - lo) / 4));
    for (var d = lo; d <= hi; d += stepT) ticks.push(Math.pow(10, d));
  } else {
    var mx = niceMax(top);
    yOf = function(v) { return T + ph - v / mx * ph; };
    for (var i = 0; i <= 4; i++) ticks.push(mx * i / 4);
  }
  var xOf = function(v) { return L + (v - minX) / spanX * pw; };
  var h = '<svg class="chart-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + escH(opts.title) + '">';
  ticks.forEach(function(v) {
    var y = yOf(v).toFixed(1);
    h += '<line class="c-grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '"/>';
    h += '<text class="c-tick" x="' + (L - 7) + '" y="' + (+y + 4) + '" text-anchor="end">' + shortNum(v) + '</text>';
  });
  for (var x = 0; x <= 3; x++) {
    var xv = minX + spanX * x / 3;
    h += '<text class="c-tick" x="' + xOf(xv).toFixed(1) + '" y="' + (H - 7) + '" text-anchor="' + (x === 0 ? 'start' : x === 3 ? 'end' : 'middle') + '">' + fmtPlay(xv) + '</text>';
  }
  var ends = [];
  opts.series.forEach(function(s) {
    var d = '';
    s.vals.forEach(function(v, i) {
      var px = xOf(xs[i]).toFixed(1), py = yOf(v).toFixed(1);
      if (i === 0) d += 'M' + px + ' ' + py;
      else if (opts.step) d += 'H' + px + 'V' + py;
      else d += 'L' + px + ' ' + py;
    });
    if (opts.series.length === 1) {
      h += '<path class="c-area ' + s.cls + '" d="' + d + 'V' + (T + ph) + 'H' + L + 'z"/>';
    }
    h += '<path class="c-line ' + s.cls + '" d="' + d + '"/>';
    var lastV = s.vals[s.vals.length - 1];
    ends.push({ y: yOf(lastV), v: lastV, s: s });
  });
  // Valeur au bout de la courbe, sauf si deux valeurs se chevauchent
  var collide = ends.length === 2 && Math.abs(ends[0].y - ends[1].y) < 14;
  ends.forEach(function(e) {
    h += '<circle class="c-dot ' + e.s.cls + '" cx="' + (W - R) + '" cy="' + e.y.toFixed(1) + '" r="4"/>';
    if (!collide) h += '<text class="c-end" x="' + (W - R + 9) + '" y="' + (e.y + 4).toFixed(1) + '">' + e.s.fmt(e.v) + '</text>';
  });
  h += '</svg>';
  chartStore[opts.id] = { xs: xs, series: opts.series, L: L, R: R, W: W, minX: minX, spanX: spanX, T: T, ph: ph };
  var out = '<figure class="chart-card"><figcaption><b>' + opts.title + '</b><span>' + opts.sub + (log ? ' · ' + t('chart.log') : '') + '</span></figcaption>';
  if (opts.series.length > 1) {
    out += '<div class="chart-legend">';
    opts.series.forEach(function(s) { out += '<span><i class="c-key ' + s.cls + '"></i>' + s.name + '</span>'; });
    out += '</div>';
  }
  out += '<div class="chart-plot" data-chart="' + opts.id + '">' + h + '</div></figure>';
  return out;
}

// ============ BARRES ============
function barChart(title, sub, rows, cls, fmtV) {
  var top = 0;
  rows.forEach(function(r) { if (r.value > top) top = r.value; });
  var h = '<figure class="chart-card"><figcaption><b>' + title + '</b><span>' + sub + '</span></figcaption><div class="hbars">';
  rows.forEach(function(r) {
    var pct = top > 0 ? r.value / top * 100 : 0;
    h += '<div class="hbar" data-tip="' + escH(r.plain || r.label) + ' : ' + escH(fmtV(r.value)) + '">';
    h += '<span class="hbar-label">' + r.label + '</span>';
    h += '<span class="hbar-track"><span class="hbar-fill ' + cls + '" style="width:' + Math.max(pct, r.value > 0 ? 1 : 0).toFixed(1) + '%"></span></span>';
    h += '<span class="hbar-val">' + fmtV(r.value) + '</span></div>';
  });
  return h + '</div></figure>';
}

// ============ LES GRAPHIQUES ============
function statsCharts(panel) {
  var hist = G.history;
  var n = hist.t.length;
  var spent = totalSpent();
  var perSold = G.stats.totalSold > 0 ? G.totalEarned / G.stats.totalSold : 0;
  var margin = G.totalEarned > 0 ? (G.totalEarned - G.stats.totalIngredientCost) / G.totalEarned * 100 : 0;
  var fixed = getRentPerHour() + totalSalary() * 3600;
  var breakEven = perSold > 0 ? fixed / (perSold * Math.max(0, margin) / 100 || perSold) : 0;
  var rateIn = 0;
  if (n >= 2) {
    var a = Math.max(0, n - 21);
    rateIn = Math.max(0, (hist.earned[n - 1] - hist.earned[a])) / Math.max(1e-6, (hist.t[n - 1] - hist.t[a]) / 60000);
  }
  var demand = 0, recCount = 0;
  REC.forEach(function(r) { if (r.unlockLvl <= G.level) { demand += demandMult(r); recCount++; } });
  demand = recCount ? demand / recCount * 100 : 100;

  var h = '<div class="kpi-grid">';
  h += statTile(t('chart.kpiRate'), fmtMoney(rateIn) + t('chart.perMin'), t('chart.kpiRateHelp'));
  h += statTile(t('chart.kpiMargin'), Math.round(margin) + ' %', t('chart.kpiMarginHelp'));
  h += statTile(t('chart.kpiAvg'), fmtMoney(perSold), t('chart.kpiAvgHelp'));
  h += statTile(t('chart.kpiFixed'), fmtMoney(fixed) + '/h', t('chart.kpiFixedHelp'));
  h += statTile(t('chart.kpiBreak'), fmt(Math.ceil(breakEven)) + '/h', t('chart.kpiBreakHelp'));
  h += statTile(t('chart.kpiDemand'), Math.round(demand) + ' %', t('chart.kpiDemandHelp'));
  h += '</div>';

  // Largeur reelle du panneau, pour que le texte des graphiques garde sa taille
  var inner = (panel.clientWidth || 700) - 30;
  var two = inner >= 820;
  var w = Math.floor(two ? (inner - 12) / 2 : inner) - 26;

  h += '<div class="chart-grid' + (two ? ' two' : '') + '">';
  if (n < 2) {
    h += '<p class="empty-note">' + t('chart.empty') + '</p>';
  } else {
    h += lineChart({ id: 'wealth', title: t('chart.wealth'), sub: t('chart.wealthSub'), width: w, xs: hist.t, log: true,
      series: [{ name: t('chart.money'), cls: 's1', vals: hist.money, fmt: fmtMoney }] });
    var xs = [], inc = [], out = [];
    for (var i = 1; i < n; i++) {
      var mins = Math.max(1e-6, (hist.t[i] - hist.t[i - 1]) / 60000);
      xs.push(hist.t[i]);
      inc.push(Math.max(0, hist.earned[i] - hist.earned[i - 1]) / mins);
      out.push(Math.max(0, hist.spent[i] - hist.spent[i - 1]) / mins);
    }
    if (xs.length >= 2) {
      var perMin = function(v) { return fmtMoney(v) + t('chart.perMin'); };
      h += lineChart({ id: 'flow', title: t('chart.flow'), sub: t('chart.flowSub'), width: w, xs: xs,
        series: [{ name: t('chart.in'), cls: 's1', vals: inc, fmt: perMin }, { name: t('chart.out'), cls: 's2', vals: out, fmt: perMin }] });
    }
    h += lineChart({ id: 'level', title: t('chart.level'), sub: t('chart.levelSub'), width: w, xs: hist.t, step: true,
      series: [{ name: t('chart.levelName'), cls: 's1', vals: hist.level, fmt: function(v) { return t('level', { v: Math.round(v) }); } }] });
  }
  // Ou part l'argent
  var costs = [
    { label: t('stats.totalIngCost'), value: G.stats.totalIngredientCost },
    { label: t('stats.totalRent'), value: G.stats.totalRentPaid },
    { label: t('stats.totalSalary'), value: G.stats.totalSalaryPaid },
    { label: t('stats.totalInvested'), value: G.stats.totalInvested },
    { label: t('stats.interestPaid'), value: G.stats.totalInterestPaid },
  ].sort(function(a, b) { return b.value - a.value; });
  h += barChart(t('chart.costs'), t('chart.costsSub', { v: fmtMoney(spent) }), costs, 's2', fmtMoney);
  // Les recettes les plus preparees
  var top = REC.map(function(r) { return { label: r.e + ' ' + recShortName(r), plain: recShortName(r), value: G.stats.cakesMadeById[r.id] || 0 }; })
    .filter(function(r) { return r.value > 0; })
    .sort(function(a, b) { return b.value - a.value; })
    .slice(0, 8);
  if (top.length > 0) h += barChart(t('chart.top'), t('chart.topSub'), top, 's1', fmt);
  h += '</div>';

  h += '<button class="chip chart-table-toggle' + (ui.chartTable ? ' active' : '') + '" onclick="ui.chartTable=!ui.chartTable;renderStats()">' + t(ui.chartTable ? 'chart.hideTable' : 'chart.showTable') + '</button>';
  if (ui.chartTable && n > 0) {
    h += '<div class="table-wrap"><table class="chart-table"><thead><tr><th>' + t('stats.playTime') + '</th><th>' + t('chart.money') + '</th><th>' + t('stats.totalEarned') + '</th><th>' + t('chart.spent') + '</th><th>' + t('chart.levelName') + '</th><th>' + t('stats.totalSold') + '</th></tr></thead><tbody>';
    for (var r = n - 1; r >= Math.max(0, n - 20); r--) {
      h += '<tr><td>' + fmtPlay(hist.t[r]) + '</td><td>' + fmtMoney(hist.money[r]) + '</td><td>' + fmtMoney(hist.earned[r]) + '</td><td>' + fmtMoney(hist.spent[r]) + '</td><td>' + hist.level[r] + '</td><td>' + fmt(hist.sold[r]) + '</td></tr>';
    }
    h += '</tbody></table></div>';
  }
  return h;
}

// ============ TOUTES LES PATISSERIES ============
function statsAll() {
  var all = allBakeriesState();
  var list = bakeryStates();
  var unlocked = 0;
  for (var k in G.achievements) { if (G.achievements[k]) unlocked++; }
  var h = '<div class="kpi-grid">';
  h += statTile(t('all.bakeries'), list.length);
  h += statTile(t('stats.totalEarned'), fmtMoney(all.totalEarned));
  h += statTile(t('all.money'), fmtMoney(all.money));
  h += statTile(t('stats.playTime'), fmtPlay(all.playTimeMs));
  h += '</div>';

  // Succes
  var pct = unlocked / ACHIEVEMENTS.length * 100;
  h += '<div class="all-ach"><div class="all-ach-top"><b>' + t('all.ach') + '</b><span>' + unlocked + ' / ' + ACHIEVEMENTS.length + '</span></div>';
  h += '<div class="loan-bar"><div style="width:' + pct.toFixed(1) + '%"></div></div>';
  h += '<p class="hint-note">' + t('all.achHelp') + '</p></div>';
  var byCat = {};
  ACHIEVEMENTS.forEach(function(a) {
    byCat[a.cat] = byCat[a.cat] || { done: 0, all: 0 };
    byCat[a.cat].all++;
    if (G.achievements[a.id]) byCat[a.cat].done++;
  });
  var rows = ACH_CATEGORIES.map(function(c) { return { label: t('ach.cat.' + c), value: byCat[c].done }; });
  rows.sort(function(a, b) { return b.value - a.value; });
  h += '<div class="chart-grid">';
  h += barChart(t('all.achCat'), t('all.achCatSub'), rows, 's1', fmt);
  // Comparaison
  var earned = list.map(function(s) { return { label: escH(s.name), value: s.state.totalEarned || 0 }; }).sort(function(a, b) { return b.value - a.value; });
  h += barChart(t('all.compare'), t('all.compareSub'), earned, 's1', fmtMoney);
  // Le gateau qui rapporte le plus, boutique par boutique
  var bestRows = list.map(function(s) {
    var b = bestCakeOf(s.state);
    return { label: escH(s.name) + ' : ' + (b ? b.rec.e + ' ' + recShortName(b.rec) : t('bakery.noBest')), plain: s.name + (b ? ' : ' + recShortName(b.rec) : ''), value: b ? b.earned : 0 };
  }).sort(function(a, b) { return b.value - a.value; });
  h += barChart(t('bakery.bestChart'), t('bakery.bestChartSub'), bestRows, 's1', fmtMoney);
  h += '</div>';

  h += '<div class="table-wrap"><table class="chart-table"><thead><tr><th>' + t('all.name') + '</th><th>' + t('chart.levelName') + '</th><th>' + t('stats.totalEarned') + '</th><th>' + t('stats.totalSold') + '</th><th>' + t('bakery.best') + '</th><th>' + t('all.achHere') + '</th><th>' + t('stats.playTime') + '</th></tr></thead><tbody>';
  list.forEach(function(s) {
    h += '<tr' + (s.current ? ' class="current"' : '') + '><td>' + escH(s.name) + (s.current ? ' <em>' + t('bakery.current') + '</em>' : '') + '</td><td>' + s.state.level + '</td><td>' + fmtMoney(s.state.totalEarned || 0) + '</td><td>' + fmt(s.state.stats.totalSold) + '</td><td>' + (bestCakeOf(s.state) ? recShortName(bestCakeOf(s.state).rec) : '-') + '</td><td>' + (s.state.achHere || 0) + '</td><td>' + fmtPlay(s.state.playTimeMs || 0) + '</td></tr>';
  });
  h += '</tbody></table></div>';

  h += '<h3 class="bank-h">' + t('all.totals') + '</h3>';
  h += statRows([
    ['stats.totalCakes', fmt(all.stats.totalCakesMade)],
    ['stats.totalSold', fmt(all.stats.totalSold)],
    ['stats.totalClicks', fmt(all.stats.totalClicks)],
    ['stats.totalSalary', fmtMoney(all.stats.totalSalaryPaid)],
    ['stats.totalRent', fmtMoney(all.stats.totalRentPaid)],
    ['stats.totalIngCost', fmtMoney(all.stats.totalIngredientCost)],
    ['stats.totalInvested', fmtMoney(all.stats.totalInvested)],
    ['stats.events', fmt(all.stats.eventsSeen || 0)],
    ['stats.employees', fmt(all.employees.length)],
    ['stats.rebirths', all.rebirth],
  ]);
  return h;
}

// ============ SURVOL ============
(function() {
  var tip = null, line = null, dots = [];

  function ensure() {
    if (tip) return;
    tip = document.createElement('div');
    tip.className = 'chart-tip';
    line = document.createElement('div');
    line.className = 'chart-cross';
    document.body.appendChild(line);
    document.body.appendChild(tip);
  }

  function hide() {
    if (!tip) return;
    tip.style.display = 'none';
    line.style.display = 'none';
    dots.forEach(function(d) { d.remove(); });
    dots = [];
  }

  function placeTip(x, y) {
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var left = x + 14;
    if (left + w > window.innerWidth - 8) left = x - w - 14;
    var top = Math.max(8, Math.min(y - h / 2, window.innerHeight - h - 8));
    tip.style.left = Math.max(8, left) + 'px';
    tip.style.top = top + 'px';
  }

  function onMove(e) {
    var target = e.target;
    if (!target || !target.closest) return;
    var bar = target.closest('.hbar');
    if (bar) {
      ensure();
      line.style.display = 'none';
      dots.forEach(function(d) { d.remove(); });
      dots = [];
      tip.textContent = bar.getAttribute('data-tip');
      tip.style.display = 'block';
      placeTip(e.clientX, e.clientY);
      return;
    }
    var plot = target.closest('.chart-plot');
    var data = plot && chartStore[plot.getAttribute('data-chart')];
    if (!data) { hide(); return; }
    ensure();
    var svg = plot.querySelector('svg');
    var rect = svg.getBoundingClientRect();
    var px = (e.clientX - rect.left);
    var val = data.minX + (px - data.L) / (data.W - data.L - data.R) * data.spanX;
    var best = 0;
    for (var i = 0; i < data.xs.length; i++) {
      if (Math.abs(data.xs[i] - val) < Math.abs(data.xs[best] - val)) best = i;
    }
    var cx = rect.left + data.L + (data.xs[best] - data.minX) / data.spanX * (data.W - data.L - data.R);
    line.style.display = 'block';
    line.style.left = cx + 'px';
    line.style.top = (rect.top + data.T) + 'px';
    line.style.height = data.ph + 'px';
    var html = '<b>' + fmtPlay(data.xs[best]) + '</b>';
    data.series.forEach(function(s) {
      html += '<div><i class="c-key ' + s.cls + '"></i>' + s.name + ' : <strong>' + s.fmt(s.vals[best]) + '</strong></div>';
    });
    tip.innerHTML = html;
    tip.style.display = 'block';
    placeTip(cx, e.clientY);
  }

  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerdown', onMove);
  document.addEventListener('scroll', hide, true);
})();
