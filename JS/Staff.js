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

function empAvatar(type, name) {
  var h = nameHash(String(name || ''));
  var skin = ['#FFDBB5', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#FFE3CF'][h % 6];
  var hair = ['#2C1B10', '#6B3F1D', '#C68B3C', '#A32A1B', '#4A4A4A', '#E8D9A0'][(h >> 3) % 6];
  var long = (h >> 6) % 2 === 0;
  var s = '<svg class="emp-face" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19.500" fill="#fff" opacity=".0"/>';
  // Cheveux, tete, visage
  s += long ? '<path d="M8 24C7 12 13 8 20 8s13 4 12 16c0 5-3 8-4 8V20H12v12c-1 0-4-3-4-8z" fill="' + hair + '"/>' : '';
  s += '<circle cx="20" cy="22" r="11" fill="' + skin + '"/>';
  s += '<path d="M9 21c0-8 5-11 11-11s11 3 11 11c-3-4-7-5-11-5s-8 1-11 5z" fill="' + hair + '"/>';
  s += '<circle cx="16" cy="23" r="1.500" fill="#2C1B10"/><circle cx="24" cy="23" r="1.500" fill="#2C1B10"/><path d="M16 27.500q4 3 8 0" fill="none" stroke="#7A3B26" stroke-width="1.400" stroke-linecap="round"/>';
  // Ce qui distingue chaque metier
  if (type === 'collector') s += '<ellipse cx="20" cy="12.500" rx="15" ry="3.500" fill="#E8C468" stroke="#B8922E" stroke-width=".8"/><path d="M12 12c0-6 3-8 8-8s8 2 8 8z" fill="#F2D57E" stroke="#B8922E" stroke-width=".8"/><path d="M12 11h16" stroke="#6DB54F" stroke-width="2"/>';
  else if (type === 'baker') s += '<path d="M11 14c-3-3-1-8 3-7 1-3 11-3 12 0 4-1 6 4 3 7z" fill="#fff" stroke="#D8D0C5"/><circle cx="26" cy="19" r="1.300" fill="#fff"/><circle cx="13" cy="26" r="1.200" fill="#fff"/>';
  else if (type === 'seller') s += '<path d="M10 13c1-6 5-8 10-8s9 2 10 8z" fill="#D81B3C"/><path d="M8 13h24c1 1 0 2-1 2H9c-1 0-2-1-1-2z" fill="#A31330"/>';
  else if (type === 'manager') s += '<rect x="12" y="20.500" width="7" height="5" rx="1.500" fill="none" stroke="#222" stroke-width="1.300"/><rect x="21" y="20.500" width="7" height="5" rx="1.500" fill="none" stroke="#222" stroke-width="1.300"/><path d="M19 22.500h2" stroke="#222" stroke-width="1.300"/><path d="M18 33l2 6 2-6-2-1.500z" fill="#1C74C4"/>';
  else if (type === 'maitre') s += '<path d="M14 26.500c2-2 4-1.500 6 0 2-1.500 4-2 6 0-2 1-4 1-6 0-2 1-4 1-6 0z" fill="#2C1B10"/><path d="M14 33l6 2 6-2v5l-6-2-6 2z" fill="#222"/>';
  else if (type === 'carrier') s += '<path d="M10 14c0-6 5-9 10-9s10 3 10 9z" fill="#1E88E5"/><path d="M6 14h28l-3 2.500H9z" fill="#125EA8"/><path d="M17 8h6v3h-6z" fill="#FFD54F"/>';
  else if (type === 'chef') s += '<path d="M11 14c-5-2-5-9 0-10 1-4 17-4 18 0 5 1 5 8 0 10z" fill="#fff" stroke="#D8D0C5"/><path d="M11 12h18v4H11z" fill="#fff" stroke="#D8D0C5"/><path d="M16 5v7M20 4v8M24 5v7" stroke="#E0D9CE" stroke-width="1"/>';
  else if (type === 'buyer') s += '<circle cx="16" cy="23" r="3.200" fill="none" stroke="#6D4C41" stroke-width="1.200"/><circle cx="24" cy="23" r="3.200" fill="none" stroke="#6D4C41" stroke-width="1.200"/><path d="M12 12c1-5 4-7 8-7s7 2 8 7z" fill="#3F8F2B"/><path d="M28 28h7v9h-7z" fill="#fff" stroke="#6D4C41"/><path d="M29.500 31h4M29.500 33.500h4" stroke="#6D4C41" stroke-width=".8"/>';
  else if (type === 'novice') s += '<path d="M20 10c-2-4 0-6 2-6" fill="none" stroke="' + hair + '" stroke-width="2.400" stroke-linecap="round"/>';
  return s + '</svg>';
}

// ============ L'ONGLET ============
function renderEmployees() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  var h = '<div class="panel-head"><h2>' + t('emp.title') + '</h2></div>';
  if (G.creative) h += '<p class="order-butler">' + t('emp.creative') + '</p>';
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
    h += '<div class="emp-list">';
    G.employees.forEach(function(emp) {
      var moraleColor = emp.morale > 60 ? 'morale-good' : (emp.morale > 30 ? 'morale-mid' : 'morale-bad');
      var training = empTraining(emp);
      var status = training ? t('emp.training', { v: fmtTime((emp.trainingUntil - Date.now()) / 1000) }) : t('emp.' + emp.status);
      var statusCls = training ? 'status-warn' : emp.status === 'working' ? 'status-good' : (emp.status === 'striking' ? 'status-bad' : 'status-warn');
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
    h += '</div>';
  }
  setHTML(el, h);
}

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
  var config = empConfigHTML(emp);
  if (config) h += '<section class="set-card emp-config"><h3>' + t('emp.config') + '</h3>' + config + '</section>';
  h += '<div class="emp-actions">';
  if (emp.type !== 'novice') {
    if ((emp.level || 1) >= EMP_MAX_LVL) h += '<button class="btn" disabled>' + t('emp.trainMax') + '</button>';
    else h += '<button class="btn btn-primary" onclick="doTrainEmployee(' + emp.id + ')"' + (G.money < getTrainCost(emp) || empTraining(emp) ? ' disabled' : '') + '>' + t('emp.trainBtn', { v: fmtMoney(getTrainCost(emp)) }) + '</button>';
  }
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
  h += '<p class="set-help">' + t('carry.help', { v: fmtTime(CARRIER_TRIP_SEC / Math.max(0.01, empPower(emp))) }) + '</p>';
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
