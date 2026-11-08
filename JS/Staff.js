/* ============================================
   PATISSERIE 2D SIMULATOR - L'EQUIPE
   Tetes, recherche, candidats et reglages de
   chaque metier
   ============================================ */

// ============ LES TETES ============
function nameHash(str) {
  var h = 0;
  for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

// Le haut du corps prend la couleur du metier
var EMP_SHIRT = { novice:'#A1887F', collector:'#7B9B3E', baker:'#F4EFE6', seller:'#C62842', manager:'#37474F', maitre:'#26262B', carrier:'#1E78C8', chef:'#FFFFFF', buyer:'#3F8F2B' };

function empAvatar(type, name) {
  var h = nameHash(String(name || ''));
  var skins = [['#FFDCC2', '#EBB894'], ['#F3C59B', '#D9A274'], ['#E0AC7E', '#C48A5A'], ['#C68650', '#A56A38'], ['#8D5A33', '#6E4324'], ['#5C3A21', '#462A16']];
  var sk = skins[h % 6];
  var hair = ['#2B1B12', '#5A3418', '#8A5A2B', '#C9A15A', '#A33A1E', '#3B3B3B', '#E8DFC8'][(h >> 3) % 7];
  var style = (h >> 6) % 5; // 0 court, 1 long, 2 boucle, 3 chignon, 4 tres court
  var beard = style !== 1 && style !== 3 && (h >> 9) % 4 === 0;
  var eye = ['#5B3A1E', '#2F5F8A', '#3E7A3E', '#4A3626'][(h >> 11) % 4];
  var shirt = EMP_SHIRT[type] || '#9E9E9E';
  var light = shirt === '#FFFFFF' || shirt === '#F4EFE6';
  var s = '<svg class="emp-face" viewBox="0 0 40 40" aria-hidden="true">';
  // Derriere la tete : cheveux longs ou chignon
  if (style === 1) s += '<path d="M8.500 22C8 11 13 7.500 20 7.500S32 11 31.500 22c.300 6-1 10-3 12V21H11.500v13c-2-2-3.300-6-3-12z" fill="' + hair + '"/>';
  if (style === 3) s += '<circle cx="20" cy="7.500" r="4" fill="' + hair + '"/>';
  // Cou et epaules
  s += '<path d="M16.500 27h7v5h-7z" fill="' + sk[1] + '"/>';
  s += '<path d="M5 40c0-6.500 6-9.500 15-9.500S35 33.500 35 40z" fill="' + shirt + '"' + (light ? ' stroke="#D8D0C5" stroke-width=".8"' : '') + '/>';
  s += '<path d="M16 30.800l4 3 4-3" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="1"/>';
  // Oreilles et visage
  s += '<ellipse cx="10.600" cy="21" rx="1.800" ry="2.600" fill="' + sk[1] + '"/><ellipse cx="29.400" cy="21" rx="1.800" ry="2.600" fill="' + sk[1] + '"/>';
  s += '<path d="M11 18.500c0-6 4-9.500 9-9.500s9 3.500 9 9.500c0 6.500-3.500 10.500-9 10.500S11 25 11 18.500z" fill="' + sk[0] + '"/>';
  // Cheveux devant
  if (style === 2) {
    [11.500, 14.500, 17.500, 20.500, 23.500, 26.500, 28.500].forEach(function(x, i) { s += '<circle cx="' + x + '" cy="' + (i === 0 || i === 6 ? 15 : 11.500) + '" r="3.200" fill="' + hair + '"/>'; });
  } else if (style === 4) {
    s += '<path d="M11.200 17C11.500 11.500 15 9 20 9s8.500 2.500 8.800 8c-2-2.500-5-3.500-8.800-3.500S13.200 14.500 11.200 17z" fill="' + hair + '" opacity=".85"/>';
  } else {
    s += '<path d="M10.600 19C10 11.500 14 8.500 20 8.500s10 3 9.400 10.500c-.900-3-2.500-5-4.500-5.500-2.500 1.500-6.500 2-11 1.500-1.600 1-2.700 2.400-3.300 4z" fill="' + hair + '"/>';
  }
  // Sourcils, yeux, nez, joues
  s += '<path d="M13.800 16.800q2.200-1.200 4.200 0M22 16.800q2.200-1.200 4.200 0" fill="none" stroke="' + hair + '" stroke-width="1.100" stroke-linecap="round"/>';
  s += '<ellipse cx="16" cy="19.800" rx="1.900" ry="1.400" fill="#fff"/><ellipse cx="24" cy="19.800" rx="1.900" ry="1.400" fill="#fff"/>';
  s += '<circle cx="16.200" cy="19.900" r="1.050" fill="' + eye + '"/><circle cx="24.200" cy="19.900" r="1.050" fill="' + eye + '"/>';
  s += '<circle cx="16.300" cy="20" r=".5" fill="#111"/><circle cx="24.300" cy="20" r=".5" fill="#111"/><circle cx="16.600" cy="19.500" r=".3" fill="#fff"/><circle cx="24.600" cy="19.500" r=".3" fill="#fff"/>';
  s += '<path d="M20 20.500v3.200c-.600.300-1.200.300-1.600 0" fill="none" stroke="' + sk[1] + '" stroke-width=".9" stroke-linecap="round"/>';
  s += '<ellipse cx="14.200" cy="23.500" rx="1.800" ry="1" fill="#E57373" opacity=".25"/><ellipse cx="25.800" cy="23.500" rx="1.800" ry="1" fill="#E57373" opacity=".25"/>';
  if (beard) s += '<path d="M11.300 20.500c.500 5 4 8.500 8.700 8.500s8.200-3.500 8.700-8.500c-1 3-2.500 4.500-4 4.800-1-.800-2.800-1.200-4.700-1.200s-3.700.400-4.700 1.200c-1.500-.300-3-1.800-4-4.800z" fill="' + hair + '" opacity=".9"/>';
  s += '<path d="M17.300 25.400q2.700 1.700 5.400 0" fill="none" stroke="#9C4A3A" stroke-width="1.100" stroke-linecap="round"/>';
  // Ce qui distingue chaque metier
  if (type === 'collector') s += '<ellipse cx="20" cy="12.500" rx="15" ry="3.500" fill="#E8C468" stroke="#B8922E" stroke-width=".8"/><path d="M12 12c0-6 3-8 8-8s8 2 8 8z" fill="#F2D57E" stroke="#B8922E" stroke-width=".8"/><path d="M12 11h16" stroke="#6DB54F" stroke-width="2"/>';
  else if (type === 'baker') s += '<path d="M11 14c-3-3-1-8 3-7 1-3 11-3 12 0 4-1 6 4 3 7z" fill="#fff" stroke="#D8D0C5"/><circle cx="26" cy="19" r="1.300" fill="#fff"/><circle cx="13" cy="26" r="1.200" fill="#fff"/>';
  else if (type === 'seller') s += '<path d="M10 13c1-6 5-8 10-8s9 2 10 8z" fill="#D81B3C"/><path d="M8 13h24c1 1 0 2-1 2H9c-1 0-2-1-1-2z" fill="#A31330"/>';
  else if (type === 'manager') s += '<rect x="12.500" y="17.600" width="7" height="4.600" rx="1.500" fill="none" stroke="#222" stroke-width="1.200"/><rect x="20.500" y="17.600" width="7" height="4.600" rx="1.500" fill="none" stroke="#222" stroke-width="1.200"/><path d="M19.500 19.600h1" stroke="#222" stroke-width="1.200"/><path d="M18 33l2 6 2-6-2-1.500z" fill="#1C74C4"/>';
  else if (type === 'maitre') s += '<path d="M15.500 24.700c1.600-1.600 3.200-1.200 4.500 0 1.300-1.200 2.900-1.600 4.500 0-1.600.800-3 .800-4.500 0-1.500.800-2.900.800-4.500 0z" fill="#2C1B10"/><path d="M14 33l6 2 6-2v5l-6-2-6 2z" fill="#222"/>';
  else if (type === 'carrier') s += '<path d="M10 14c0-6 5-9 10-9s10 3 10 9z" fill="#1E88E5"/><path d="M6 14h28l-3 2.500H9z" fill="#125EA8"/><path d="M17 8h6v3h-6z" fill="#FFD54F"/>';
  else if (type === 'chef') s += '<path d="M11 14c-5-2-5-9 0-10 1-4 17-4 18 0 5 1 5 8 0 10z" fill="#fff" stroke="#D8D0C5"/><path d="M11 12h18v4H11z" fill="#fff" stroke="#D8D0C5"/><path d="M16 5v7M20 4v8M24 5v7" stroke="#E0D9CE" stroke-width="1"/>';
  else if (type === 'buyer') s += '<circle cx="16" cy="19.900" r="3" fill="none" stroke="#6D4C41" stroke-width="1.200"/><circle cx="24" cy="19.900" r="3" fill="none" stroke="#6D4C41" stroke-width="1.200"/><path d="M19 19.900h2" stroke="#6D4C41" stroke-width="1.200"/><path d="M12 12c1-5 4-7 8-7s7 2 8 7z" fill="#3F8F2B"/><path d="M28 28h7v9h-7z" fill="#fff" stroke="#6D4C41"/><path d="M29.500 31h4M29.500 33.500h4" stroke="#6D4C41" stroke-width=".8"/>';
  else if (type === 'novice') s += '<path d="M20 10c-2-4 0-6 2-6" fill="none" stroke="' + hair + '" stroke-width="2.400" stroke-linecap="round"/>';
  return s + '</svg>';
}

// ============ L'ONGLET ============
function renderEmployees() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  var h = '<div class="panel-head"><h2>' + t('emp.title') + '</h2></div>';
  if (G.creative) h += '<p class="order-butler">' + t('emp.creative') + '</p>';
  var head = h;
  h = '';
  var sal = totalSalary();
  if (sal > 0) h += '<div class="emp-total-salary">' + t('emp.totalSalary', { v: fmtMoney(sal * 3600) }) + '</div>';
  var open = EMP_TYPES.filter(empTypeOpen);
  if (open.length === 0) {
    h += '<p class="empty-note">' + t('emp.lockedAll') + '</p>';
  } else {
    // Chercher un metier precis : ca prend du temps, et ca ne marche pas toujours
    h += '<div class="recruit-section"><h4>' + t('emp.search') + '</h4><div class="recruit-row">';
    open.forEach(function(et) {
      var job = searchFor(et.id);
      if (job) {
        h += '<button class="btn btn-small search-going" disabled>' + empAvatar(et.id, et.id) + t('emp.' + et.id) + ' · ' + fmtTime(Math.max(0, (job.doneAt - Date.now()) / 1000)) + '</button>';
      } else {
        h += '<button class="btn btn-small" onclick="doSearchEmployee(\'' + et.id + '\')" title="' + escH(t('emp.desc.' + et.id)) + '">' + empAvatar(et.id, et.id) + t('emp.' + et.id) + '</button>';
      }
    });
    h += '</div><p class="hint-note">' + t('emp.searchHint', { v: Math.round(searchChance() * 100) }) + '</p></div>';
  }
  // A partir du niveau 20, le tableau de bord est tout en haut, avec la recherche dedans
  h = head + (G.level >= 20 ? empDashboardHTML(h) : h);
  if (G.applicants && G.applicants.length > 0) {
    h += '<div class="applicants-section"><h4>' + t('emp.applicants') + ' (' + G.applicants.length + ')</h4>';
    G.applicants.forEach(function(app) {
      var remaining = Math.max(0, Math.ceil((app.expiresAt - Date.now()) / 1000));
      h += '<div class="applicant-card" title="' + escH(t('emp.desc.' + app.type)) + '">' + empAvatar(app.type, app.name);
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
    var groups = {};
    G.employees.forEach(function(emp) { (groups[emp.type] = groups[emp.type] || []).push(emp); });
    empGroupOrder().forEach(function(type, gi, order) {
      var list = groups[type];
      if (!list) return;
      h += '<section class="emp-group" data-type="' + type + '"><div class="emp-group-head">';
      h += '<span class="emp-group-handle" title="' + escH(t('emp.groupDrag')) + '" aria-hidden="true">⠿</span>' + empAvatar(type, type);
      h += '<b>' + t('emp.' + type) + '</b><span class="emp-group-count">' + list.length + '</span>';
      h += '<button class="btn-tiny" onclick="nudgeEmpGroup(\'' + type + '\',-1)" title="' + escH(t('emp.groupUp')) + '" aria-label="' + escH(t('emp.groupUp')) + '">↑</button>';
      h += '<button class="btn-tiny" onclick="nudgeEmpGroup(\'' + type + '\',1)" title="' + escH(t('emp.groupDown')) + '" aria-label="' + escH(t('emp.groupDown')) + '">↓</button></div>';
      h += '<div class="emp-list">';
      list.forEach(function(emp) {
      var moraleColor = emp.morale > 60 ? 'morale-good' : (emp.morale > 30 ? 'morale-mid' : 'morale-bad');
      var training = empTraining(emp);
      var status = training ? t('emp.training', { v: fmtTime((emp.trainingUntil - Date.now()) / 1000) }) : emp.paused ? t('emp.paused') : t('emp.' + emp.status);
      var statusCls = training || emp.paused ? 'status-warn' : emp.status === 'working' ? 'status-good' : (emp.status === 'striking' ? 'status-bad' : 'status-warn');
      h += '<div class="emp-card" role="button" tabindex="0" onclick="showEmpInfoModal(' + emp.id + ')" title="' + escH(t('emp.desc.' + emp.type)) + '">';
      h += '<div class="emp-header">' + empAvatar(emp.type, emp.name);
      h += '<span class="emp-name">' + escH(emp.name) + '</span>';
      h += '<span class="emp-type">' + t('emp.' + emp.type) + '</span>';
      h += '<span class="emp-status ' + statusCls + '">' + status + '</span>';
      h += '<span class="emp-skill-badge">' + t('emp.levelTxt', { v: emp.level || 1 }) + ' / ' + EMP_MAX_LVL + '</span>';
      h += '<span class="app-skill">' + t('emp.skill', { v: emp.skill }) + '</span>';
      h += '</div>';
      h += '<div class="emp-morale-bar" title="' + escH(t('emp.morale')) + ' : ' + Math.floor(emp.morale) + '%"><div class="emp-morale-fill ' + moraleColor + '" style="width:' + Math.floor(emp.morale) + '%"></div></div>';
      h += '</div>';
      });
      h += '</div></section>';
    });
  }
  setHTML(el, h);
}

// Le tableau de bord, en haut de l'onglet a partir du niveau 20
function empDashboardHTML(extra) {
  if (!G.explained.dashboard && typeof bobTell === 'function') { G.explained.dashboard = true; bobTell(t('unl.dashboard')); }
  var d = empDashboard();
  var h = '<section class="emp-dash"><h4>' + t('dash.title') + '</h4><div class="dash-tiles">';
  h += '<div class="dash-tile dash-total"><b>' + d.total + '</b><span>' + t('dash.total') + '</span></div>';
  empGroupOrder().forEach(function(type) {
    if (!d.byType[type]) return;
    h += '<div class="dash-tile">' + empAvatar(type, type) + '<b>' + d.byType[type] + '</b><span>' + t('emp.' + type) + '</span></div>';
  });
  h += '</div><div class="dash-states"><span class="status-good">' + t('dash.working') + ' : ' + d.working + '</span>';
  if (d.paused) h += '<span class="status-warn">' + t('dash.paused') + ' : ' + d.paused + '</span>';
  if (d.striking) h += '<span class="status-bad">' + t('dash.striking') + ' : ' + d.striking + '</span>';
  var road = shipmentsOnRoad();
  if (road) h += '<span>' + t('dash.transit', { v: road }) + '</span>';
  h += '</div><h5>' + t('dash.collectors') + '</h5>';
  var ids = Object.keys(d.collectors);
  if (ids.length === 0) h += '<p class="empty-note">' + t('dash.noCollector') + '</p>';
  else {
    h += '<div class="dash-coll">';
    ING.forEach(function(ing) {
      if (!d.collectors[ing.id]) return;
      h += '<span class="dash-coll-item">' + ing.e + ' ' + t('i.' + ing.id) + ' <b>×' + d.collectors[ing.id] + '</b> <small>' + t('ing.autoRate', { v: fmt(autoRate(ing.id)) }) + '</small></span>';
    });
    h += '</div>';
  }
  return h + (extra || '') + '</section>';
}

function nudgeEmpGroup(type, dir) {
  var order = empGroupOrder();
  var present = order.filter(function(id) { return G.employees.some(function(e) { return e.type === id; }); });
  var i = present.indexOf(type), j = i + dir;
  if (i < 0 || j < 0 || j >= present.length) return;
  moveEmpGroup(type, dir < 0 ? present[j] : (present[j + 1] || null));
  save();
  renderEmployees();
}

// Glisser un metier pour le mettre plus haut ou plus bas, a la souris comme au doigt
(function() {
  var drag = null;
  document.addEventListener('pointerdown', function(e) {
    var handle = e.target.closest && e.target.closest('.emp-group-head');
    if (!handle || e.target.closest('button')) return;
    var group = handle.closest('.emp-group');
    drag = { type: group.getAttribute('data-type'), y: e.clientY, moved: false };
    try { handle.setPointerCapture(e.pointerId); } catch (err) { /* pas grave */ }
    e.preventDefault();
  });
  function targetAt(y) {
    var groups = document.querySelectorAll('.emp-group');
    for (var i = 0; i < groups.length; i++) {
      var r = groups[i].getBoundingClientRect();
      if (y < r.top + r.height / 2) return groups[i].getAttribute('data-type');
    }
    return null;
  }
  document.addEventListener('pointermove', function(e) {
    if (!drag) return;
    if (Math.abs(e.clientY - drag.y) > 6) drag.moved = true;
    if (!drag.moved) return;
    document.querySelectorAll('.emp-group').forEach(function(g) {
      g.classList.toggle('dragging', g.getAttribute('data-type') === drag.type);
      g.classList.toggle('drop-before', g.getAttribute('data-type') === targetAt(e.clientY) && g.getAttribute('data-type') !== drag.type);
    });
  });
  function end(e) {
    if (!drag) return;
    var d = drag;
    drag = null;
    document.querySelectorAll('.emp-group').forEach(function(g) { g.classList.remove('dragging', 'drop-before'); });
    if (!d.moved || e.type !== 'pointerup') return;
    var before = targetAt(e.clientY);
    if (before === d.type) return;
    moveEmpGroup(d.type, before);
    save();
    renderEmployees();
  }
  document.addEventListener('pointerup', end);
  document.addEventListener('pointercancel', end);
})();

function doSearchEmployee(typeId) {
  if (startSearch(typeId)) {
    toast(t('emp.searchStarted', { n: t('emp.' + typeId) }));
    renderEmployees();
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

// ============ LA FICHE D'UN EMPLOYE ============
function showEmpInfoModal(empId) {
  var emp = findEmp(empId);
  if (!emp) return;
  var h = '<div class="emp-sheet-head">' + empAvatar(emp.type, emp.name) + '<div><h2>' + escH(emp.name) + '</h2><p>' + t('emp.' + emp.type) + '</p></div></div>';
  h += '<p class="set-help">' + t('emp.desc.' + emp.type) + '</p>';
  h += '<div class="emp-facts"><span>' + t('emp.levelTxt', { v: emp.level || 1 }) + ' / ' + EMP_MAX_LVL + '</span><span>' + t('emp.skill', { v: emp.skill }) + '</span><span>' + t('emp.morale') + ' : ' + Math.floor(emp.morale) + ' %</span><span>' + t('emp.salary', { v: fmtMoney(getEmpSalary(emp) * 3600) }) + '</span></div>';
  if (empTraining(emp)) h += '<p class="warning">' + t('emp.training', { v: fmtTime((emp.trainingUntil - Date.now()) / 1000) }) + '</p>';
  if (emp.paused) h += '<p class="warning">' + t('emp.pauseHelp') + '</p>';
  var config = empConfigHTML(emp);
  if (config) h += '<section class="set-card emp-config"><h3>' + t('emp.config') + '</h3>' + config + '</section>';
  h += '<div class="emp-actions">';
  if (emp.type !== 'novice') {
    if ((emp.level || 1) >= EMP_MAX_LVL) h += '<button class="btn" disabled>' + t('emp.trainMax') + '</button>';
    else h += '<button class="btn btn-primary" onclick="doTrainEmployee(' + emp.id + ')"' + (G.money < getTrainCost(emp) || empTraining(emp) ? ' disabled' : '') + '>' + t('emp.trainBtn', { v: fmtMoney(getTrainCost(emp)) }) + '</button>';
  }
  h += '<button class="btn" title="' + escH(t('emp.pauseHelp')) + '" onclick="toggleEmpPause(' + emp.id + ')">' + t(emp.paused ? 'emp.resume' : 'emp.pause') + '</button>';
  h += '<button class="btn" onclick="doGiveBonus(' + emp.id + ')">' + t('emp.bonus', { v: fmtMoney(getBonusCost(emp)) }) + '</button>';
  h += '<button class="btn btn-danger" onclick="confirmFire(' + emp.id + ')">' + t('emp.fire') + '</button></div>';
  h += '<div class="modal-btns"><button class="btn" onclick="hideModal()">' + t('common.close') + '</button></div>';
  showModal(h, 'modal-emp');
}

function empConfigHTML(emp) {
  if (emp.type === 'collector') return collectorConfig(emp);
  if (emp.type === 'seller') return sellerConfig(emp);
  if (emp.type === 'chef') return chefConfig(emp);
  if (emp.type === 'manager') return managerConfig(emp);
  if (emp.type === 'carrier') return carrierConfig(emp);
  if (emp.type === 'novice') return noviceConfig(emp);
  return '';
}

function collectorConfig(emp) {
  var h = '<label class="cfg-row">' + t('emp.assign') + '<select class="set-select" onchange="assignCollector(' + emp.id + ',this.value)">';
  ING.forEach(function(ing) {
    if (!ingUnlocked(ing)) return;
    h += '<option value="' + ing.id + '"' + (emp.assignedIng === ing.id ? ' selected' : '') + '>' + t('i.' + ing.id) + ' (' + fmtQty(autoRate(ing.id)) + '/s)</option>';
  });
  return h + '</select></label>';
}

function assignCollector(empId, ingId) {
  var emp = findEmp(empId);
  if (emp) emp.assignedIng = ingId;
}

function sellerConfig(emp) {
  var pct = emp.sellPct === undefined ? 100 : emp.sellPct;
  var h = '<p class="set-help">' + t('emp.sellHelp') + '</p>';
  h += '<div class="volume-row"><input type="range" min="0" max="100" step="5" value="' + pct + '" oninput="document.getElementById(\'sell-pct\').textContent=this.value+\' %\'" onchange="setSellPct(' + emp.id + ',this.value,false)"><span id="sell-pct">' + pct + ' %</span></div>';
  h += '<button class="btn btn-small" onclick="setSellPct(' + emp.id + ',' + pct + ',true)">' + t('emp.sellAll') + '</button>';
  return h;
}

function setSellPct(empId, value, everyone) {
  var pct = Math.max(0, Math.min(100, parseInt(value, 10) || 0));
  G.employees.forEach(function(e) {
    if (e.type === 'seller' && (everyone || e.id === empId)) e.sellPct = pct;
  });
  if (everyone) toast(t('emp.sellAllDone', { v: pct }));
  showEmpInfoModal(empId);
}

function chefConfig(emp) {
  var mode = emp.chefMode || 'all';
  var list = emp.chefList || [];
  var h = '<div class="segmented theme-scope">';
  [['all', 'emp.chefAll'], ['only', 'emp.chefOnly'], ['priority', 'emp.chefPriority']].forEach(function(m) {
    h += '<button class="' + (mode === m[0] ? 'active' : '') + '" onclick="setChefMode(' + emp.id + ',\'' + m[0] + '\')">' + t(m[1]) + '</button>';
  });
  h += '</div><p class="set-help">' + t('emp.chefHelp.' + mode) + '</p>';
  if (mode === 'all') return h;
  h += '<div class="chef-list">';
  REC.forEach(function(rec) {
    if (!recUnlocked(rec)) return;
    var pos = list.indexOf(rec.id);
    h += '<button type="button" class="chef-rec' + (pos >= 0 ? ' on' : '') + '" onclick="toggleChefRec(' + emp.id + ',\'' + rec.id + '\')">' + rec.e + '<span>' + recShortName(rec) + '</span>' + (pos >= 0 && mode === 'priority' ? '<b>' + (pos + 1) + '</b>' : '') + '</button>';
  });
  return h + '</div>';
}

function setChefMode(empId, mode) {
  var emp = findEmp(empId);
  if (emp) { emp.chefMode = mode; showEmpInfoModal(empId); }
}

function toggleChefRec(empId, recId) {
  var emp = findEmp(empId);
  if (!emp) return;
  emp.chefList = emp.chefList || [];
  var pos = emp.chefList.indexOf(recId);
  if (pos >= 0) emp.chefList.splice(pos, 1);
  else emp.chefList.push(recId);
  showEmpInfoModal(empId);
}

function managerConfig(emp) {
  var on = !!emp.mgrAuto;
  var min = emp.mgrMin === undefined ? 50 : emp.mgrMin;
  var h = setRow(t('emp.mgrAuto'), t('emp.mgrHelp'), setSwitch(on, 'toggleManager(' + emp.id + ')', t('emp.mgrAuto')));
  h += '<div class="cfg-row">' + t('emp.mgrMin') + '<div class="volume-row"><input type="range" min="1" max="100" value="' + min + '" oninput="document.getElementById(\'mgr-min\').textContent=this.value" onchange="setManagerMin(' + emp.id + ',this.value)"><span id="mgr-min">' + min + '</span></div></div>';
  return h;
}

function toggleManager(empId) {
  var emp = findEmp(empId);
  if (emp) { emp.mgrAuto = !emp.mgrAuto; showEmpInfoModal(empId); }
}

function setManagerMin(empId, value) {
  var emp = findEmp(empId);
  if (emp) emp.mgrMin = parseInt(value, 10) || 1;
}

function noviceConfig(emp) {
  var h = '<p class="set-help">' + t('emp.noviceHelp') + '</p><div class="recruit-row">';
  EMP_TYPES.forEach(function(et) {
    if (et.id === 'novice' || !empTypeOpen(et)) return;
    var c = jobCost(et);
    h += '<button class="btn btn-small" onclick="doGiveJob(' + emp.id + ',\'' + et.id + '\')"' + (G.money < c ? ' disabled' : '') + '>' + empAvatar(et.id, emp.name) + t('emp.' + et.id) + ' (' + fmtMoney(c) + ')</button>';
  });
  return h + '</div>';
}

function doGiveJob(empId, typeId) {
  if (giveJob(empId, typeId)) {
    toast(t('emp.jobDone', { n: t('emp.' + typeId) }));
    playSuccessSound();
    showEmpInfoModal(empId);
    renderEmployees();
    renderHeader();
  }
}

// Le transporteur : ou, quoi, et combien
function carrierConfig(emp) {
  ensureBakeryList();
  if (G.bakeries.length < 2) return '<p class="set-help">' + t('carry.noShop') + '</p>';
  var to = carrierTarget(emp, G.currentBakeryIndex);
  var what = emp.carryWhat || 'money';
  var h = '<label class="cfg-row">' + t('carry.to') + '<select class="set-select" onchange="assignCarrier(' + emp.id + ',\'to\',this.value)">';
  G.bakeries.forEach(function(b, i) {
    if (i === G.currentBakeryIndex) return;
    h += '<option value="' + bakeryUid(b) + '"' + (i === to ? ' selected' : '') + '>' + escH(b.name) + '</option>';
  });
  h += '</select></label><label class="cfg-row">' + t('carry.what') + '<select class="set-select" onchange="assignCarrier(' + emp.id + ',\'what\',this.value)">';
  [['money', 'carry.money'], ['cakes', 'carry.cakes'], ['ings', 'carry.ings']].forEach(function(o) {
    h += '<option value="' + o[0] + '"' + (what === o[0] ? ' selected' : '') + '>' + t(o[1]) + '</option>';
  });
  h += '<optgroup label="' + escH(t('carry.oneCake')) + '">';
  REC.forEach(function(r) { if (recUnlocked(r)) h += '<option value="cake:' + r.id + '"' + (what === 'cake:' + r.id ? ' selected' : '') + '>' + recShortName(r) + '</option>'; });
  h += '</optgroup><optgroup label="' + escH(t('carry.oneIng')) + '">';
  ING.forEach(function(i) { if (ingUnlocked(i)) h += '<option value="ing:' + i.id + '"' + (what === 'ing:' + i.id ? ' selected' : '') + '>' + t('i.' + i.id) + '</option>'; });
  h += '</optgroup></select></label>';
  h += '<label class="cfg-row">' + t('carry.qty') + '<input type="number" min="0" step="any" value="' + (emp.carryQty || '') + '" placeholder="' + escH(t('carry.max')) + '" onchange="assignCarrier(' + emp.id + ',\'qty\',this.value)"></label>';
  h += '<p class="set-help">' + t('carry.help') + '</p>';
  var road = [];
  for (var i = 0; i < G.bakeries.length; i++) {
    var st = bakeryStateAt(i);
    (st && st.incoming || []).forEach(function(ship) { if (ship.by === emp.name) road.push(ship); });
  }
  if (road.length) {
    h += '<p class="set-help"><b>' + t('carry.onRoad') + '</b></p><ul class="carry-road">';
    road.forEach(function(ship) { h += '<li>' + t('carry.eta', { v: shipLabel(ship), t: fmtTime(Math.max(0, (ship.eta - Date.now()) / 1000)) }) + '</li>'; });
    h += '</ul>';
  }
  return h;
}

function assignCarrier(empId, field, value) {
  var emp = findEmp(empId);
  if (!emp) return;
  if (field === 'to') emp.carryTo = value;
  else if (field === 'what') emp.carryWhat = value;
  else emp.carryQty = parseFloat(value) || 0;
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

// Mettre un employe en pause : il arrete de travailler, mais il est toujours paye
function toggleEmpPause(empId) {
  var emp = findEmp(empId);
  if (!emp) return;
  emp.paused = !emp.paused;
  save();
  renderEmployees();
  showEmpInfoModal(empId);
}
