/* ============================================
   PATISSERIE 2D SIMULATOR - CONSOLE DE COMMANDES
   Debloquee en enervant Bob (voir Bob.js)
   ============================================ */

// ============ COMMAND CONSOLE ============
var consoleHistory = [];
var lastCommandState = null;

function L(fr, en) {
  if (currentLang === 'es') return CONSOLE_ES[en] || en;
  if (I18N_EXTRA[currentLang]) return I18N_EXTRA[currentLang].console[en] || en;
  return currentLang === 'en' ? en : fr;
}

function showCommandConsole() {
  beginMenuPause();
  var h = '<div class="console-modal">';
  h += '<div class="console-left">';
  h += '<div class="console-head"><h2>' + uiIcon('terminal') + t('console.title') + '</h2>';
  h += '<button class="icon-btn" onclick="hideModal()" aria-label="' + escH(t('common.close')) + '" title="' + escH(t('common.close')) + '">' + uiIcon('close') + '</button></div>';
  h += '<div class="console-output" id="console-output">';
  for (var i = 0; i < consoleHistory.length; i++) {
    h += consoleHistory[i] + '\n';
  }
  h += '</div>';
  h += '<div id="console-autocomplete" class="console-autocomplete" style="display:none"></div>';
  h += '<div class="console-input-row">';
  h += '<input type="text" id="console-cmd-input" placeholder="' + t('console.placeholder') + '" onkeydown="handleConsoleKey(event)" oninput="handleConsoleAutocomplete()" onfocus="handleConsoleAutocomplete()">';
  h += '<button class="btn btn-small" onclick="execConsoleCmd()">' + t('console.send') + '</button>';
  h += '<button class="btn btn-small console-help-btn" onclick="toggleCommandHelp()">' + uiIcon('rec') + t('console.commands') + '</button>';
  h += '</div></div>';
  h += '<div id="console-help" class="console-guide" style="display:none"></div>';
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
    var firstItem = ac && ac.querySelector('.console-autocomplete-item');
    if (firstItem) {
      var inp = document.getElementById('console-cmd-input');
      if (inp) inp.value = firstItem.getAttribute('data-cmd') + ' ';
      ac.style.display = 'none';
    }
  }
}

function commandCount(cmd) {
  return (G.cmdUsage && G.cmdUsage[cmd.replace(/^\//, '')]) || 0;
}

// Les suggestions : d'abord les commandes que tu utilises le plus
function handleConsoleAutocomplete() {
  var inp = document.getElementById('console-cmd-input');
  var ac = document.getElementById('console-autocomplete');
  if (!inp || !ac) return;
  var val = inp.value.trim().toLowerCase();
  var matches = [];
  var allCmds = CONSOLE_COMMANDS.slice();
  for (var i = 0; i < ING.length; i++) allCmds.push('/' + ING[i].id);
  for (var r = 0; r < REC.length; r++) allCmds.push('/' + REC[r].id);
  if (!val) {
    // Rien de tape : tes favorites seulement
    matches = allCmds.filter(function(c) { return commandCount(c) > 0; });
  } else {
    matches = allCmds.filter(function(c) { return c.indexOf(val) === 0 || c.indexOf('/' + val) === 0; });
  }
  matches.sort(function(a, b) { return commandCount(b) - commandCount(a); });
  if (matches.length === 0 || (matches.length === 1 && matches[0] === val)) {
    ac.style.display = 'none';
    return;
  }
  var html = '';
  if (!val || commandCount(matches[0]) > 0) html += '<div class="console-autocomplete-title">' + t('console.mostUsed') + '</div>';
  matches.slice(0, val ? 8 : 5).forEach(function(m) {
    var n = commandCount(m);
    html += '<div class="console-autocomplete-item" data-cmd="' + m + '" onmousedown="event.preventDefault();selectAutocomplete(\'' + m + '\')">' + m + (n > 0 ? '<small>×' + n + '</small>' : '') + '</div>';
  });
  ac.innerHTML = html;
  ac.style.display = 'block';
}

function selectAutocomplete(cmd) {
  var inp = document.getElementById('console-cmd-input');
  if (inp) { inp.value = cmd + (/\s/.test(cmd) ? '' : ' '); inp.focus(); }
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
  // On compte seulement les commandes qui ont marche
  if (result.indexOf('cmd-err') < 0) {
    var base = cmd.toLowerCase().replace(/^\//, '').split(/\s+/)[0];
    if (undoState !== null || base === 'undo') {
      G.cmdUsage = G.cmdUsage || {};
      G.cmdUsage[base] = (G.cmdUsage[base] || 0) + 1;
    }
  }
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
  if (parts.length === 0) return '<span class="cmd-err">' + L('Commande vide', 'Empty command') + '</span>';
  var action = parts[0];

  // /help
  if (action === 'help') {
    var helpBox = document.getElementById('console-help');
    if (helpBox && helpBox.style.display === 'none') toggleCommandHelp();
    return '<span class="cmd-info">' + t('console.help') + '</span>';
  }

  // /level add|set|remove|max N
  if (action === 'level') {
    var op = parts[1]; var n = parseInt(parts[2]);
    if (isNaN(n) && op !== 'max') return '<span class="cmd-err">Usage: /level add|set|remove|max N</span>';
    if (op === 'add') { G.level += n; G.xp = 0; checkAchievements(); }
    else if (op === 'set') { G.level = Math.max(1, n); G.xp = 0; checkAchievements(); }
    else if (op === 'remove') { G.level = Math.max(1, G.level - n); G.xp = 0; }
    else if (op === 'max') { G.level = 1000; G.xp = 0; checkAchievements(); }
    else return '<span class="cmd-err">Usage: /level add|set|remove|max N</span>';
    return '<span class="cmd-ok">' + L('Niveau = ', 'Level = ') + '' + G.level + '</span>';
  }

  // /money set N [currency]
  if (action === 'money') {
    var op = parts[1]; var n = parseFloat(parts[2]);
    if (op === 'infinite' || op === 'infini') {
      if (parts[2] === 'off') { G.infiniteMoney = false; return '<span class="cmd-ok">' + L('Argent infini arrêté.', 'Infinite money stopped.') + '</span>'; }
      G.infiniteMoney = true; tickInfinite(); checkAchievements();
      return '<span class="cmd-ok">' + L('Argent infini : il reste au maximum.', 'Infinite money: it stays at the maximum.') + '</span>';
    }
    if (op !== 'set' || isNaN(n)) return '<span class="cmd-err">Usage: /money set N [currency] | /money infinite [off]</span>';
    G.infiniteMoney = false;
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
    return '<span class="cmd-ok">' + L('Argent = ', 'Money = ') + '' + fmtMoney(G.money) + '</span>';
  }

  // /reset
  if (action === 'reset') {
    resetGame(); fullRender();
    return '<span class="cmd-ok">' + L('Partie effacée !', 'Game reset!') + '</span>';
  }

  // /max | /max all | /max NOM
  if (action === 'max') {
    var maxArg = cmd.trim().split(/\s+/).slice(1).join(' ').trim();
    ensureBakeryList();
    var maxTargets = [];
    if (!maxArg) maxTargets = [G.currentBakeryIndex];
    else if (maxArg.toLowerCase() === 'all') maxTargets = G.bakeries.map(function(b, i) { return i; });
    else {
      G.bakeries.forEach(function(b, i) {
        var nm = i === G.currentBakeryIndex ? G.bakeryName : b.name;
        if (nm.toLowerCase() === maxArg.toLowerCase()) maxTargets.push(i);
      });
      if (maxTargets.length === 0) return '<span class="cmd-err">' + t('console.bakeryUnknown') + bakeryListText() + '</span>';
    }
    saveBeforeMax();
    maxTargets.forEach(function(i) {
      if (i === G.currentBakeryIndex) maxThisBakery();
      else if (G.bakeries[i].state) withBakery(G.bakeries[i].state, maxThisBakery);
    });
    G.bankUnlocked = true;
    G.secondBakery = true;
    THEME_LIST.forEach(function(th) { if (th.season || th.birthday || th.level || th.month) G.unlockedThemes[th.id] = true; });
    ACHIEVEMENTS.forEach(function(a) { if (!a.hidden) G.achievements[a.id] = true; });
    checkAchievements();
    return '<span class="cmd-ok">' + t('console.maxDone') + '</span>';
  }

  // /creative | /creative off
  if (action === 'creative') {
    if (parts[1] === 'off') {
      if (!lastSaveBeforeCreative) return '<span class="cmd-err">' + t('console.creativeNone') + '</span>';
      Object.assign(G, lastSaveBeforeCreative);
      lastSaveBeforeCreative = null;
      enforceThemeLocks();
      applyTheme();
      return '<span class="cmd-ok">' + t('console.creativeOff') + '</span>';
    }
    if (!lastSaveBeforeCreative) lastSaveBeforeCreative = JSON.parse(JSON.stringify(G));
    maxThisBakery();
    G.creative = true;
    tickCreative();
    return '<span class="cmd-ok">' + t('console.creativeOn') + '</span>';
  }

  // /machine set|add NOM N | /machine set NOM max | /machine remove NOM N|all
  if (action === 'machine' || action === 'machines') {
    var mOp = parts[1], mach = findMachine(parts[2]), mVal = parts[3];
    var mNames = MACHINES.map(function(x) { return x.id; }).join(', ');
    if (['set', 'add', 'remove'].indexOf(mOp) < 0 || !parts[2]) return '<span class="cmd-err">Usage: /machine set|add|remove ' + t('console.machineName') + ' N|max|all. ' + mNames + '</span>';
    if (!mach) return '<span class="cmd-err">' + t('console.machineUnknown') + mNames + '</span>';
    var mNow = machineLevel(mach.id), mN = parseInt(mVal, 10), mNew;
    if (mOp === 'set' && mVal === 'max') mNew = mach.max;
    else if (mOp === 'remove' && mVal === 'all') mNew = 0;
    else if (isNaN(mN)) return '<span class="cmd-err">Usage: /machine ' + mOp + ' ' + mach.id + ' N</span>';
    else if (mOp === 'set') mNew = mN;
    else if (mOp === 'add') mNew = mNow + mN;
    else mNew = mNow - mN;
    G.machines[mach.id] = Math.max(0, Math.min(mach.max, mNew));
    syncOvens();
    return '<span class="cmd-ok">' + t('console.machineSet', { n: machName(mach), a: G.machines[mach.id], b: mach.max }) + '</span>';
  }

  // /unmax - restore before max
  if (action === 'unmax') {
    if (restoreBeforeMax()) return '<span class="cmd-ok">' + L('Retour à l’état d’avant /max !', 'Restored to pre-max state!') + '</span>';
    return '<span class="cmd-err">' + L('Aucun état d’avant /max.', 'No max save found.') + '</span>';
  }

  // /undo - restore last command state
  if (action === 'undo') {
    if (restoreUndoState()) return '<span class="cmd-ok">' + L('Dernière commande annulée !', 'Last command undone!') + '</span>';
    return '<span class="cmd-err">' + L('Rien à annuler.', 'Nothing to undo.') + '</span>';
  }

  // /building set|add|remove|max N
  if (action === 'building' || action === 'buildings') {
    var op = parts[1]; var n = parseInt(parts[2]);
    if (op === 'max') { BUILDINGS.forEach(function(b) { G.buildings[b.id] = { qty: 999 }; }); return '<span class="cmd-ok">' + L('Tous les bâtiments = 999', 'All buildings = 999') + '</span>'; }
    if (isNaN(n)) return '<span class="cmd-err">Usage: /building set|add|remove|max N</span>';
    BUILDINGS.forEach(function(b) {
      if (op === 'set') G.buildings[b.id] = { qty: Math.max(0, n) };
      else if (op === 'add') G.buildings[b.id].qty += n;
      else if (op === 'remove') G.buildings[b.id].qty = Math.max(0, G.buildings[b.id].qty - n);
    });
    return '<span class="cmd-ok">' + L('Bâtiments changés (', 'Buildings updated (') + '' + op + ' ' + n + ')</span>';
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
      return '<span class="cmd-ok">' + L('Compétence de tous les employés = ', 'All employees skill = ') + '' + lvl + '</span>';
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
      return '<span class="cmd-err">' + L('Employé introuvable : ', 'Employee not found: ') + '' + empName + '</span>';
    }
    // /employee set|add|remove|max N
    var n = parseInt(parts[2]);
    if (sub === 'max') {
      for (var i = 0; i < 50; i++) {
        var typeIdx = Math.floor(Math.random() * EMP_TYPES.length);
        G.employees.push({ id: G.nextEmployeeId++, name: getEmpName(), type: EMP_TYPES[typeIdx].id, morale: 100, status: 'working', level: 1, unpaidTime: 0, assignedIng: 'farine', skill: 90 + Math.floor(Math.random() * 11) });
      }
      return '<span class="cmd-ok">' + L('50 employés très compétents ajoutés !', '50 max-skill employees added!') + '</span>';
    }
    if (isNaN(n)) return '<span class="cmd-err">Usage: /employee set|add|remove|max|upgrade N</span>';
    if (sub === 'add') {
      for (var i = 0; i < n; i++) {
        var typeIdx = Math.floor(Math.random() * EMP_TYPES.length);
        G.employees.push({ id: G.nextEmployeeId++, name: getEmpName(), type: EMP_TYPES[typeIdx].id, morale: 80, status: 'working', level: 1, unpaidTime: 0, assignedIng: 'farine', skill: 50 + Math.floor(Math.random() * 50) });
      }
    } else if (sub === 'remove') {
      G.employees.splice(Math.max(0, G.employees.length - n), n);
    } else if (sub === 'set') {
      while (G.employees.length > n) G.employees.pop();
      while (G.employees.length < n) {
        var typeIdx = Math.floor(Math.random() * EMP_TYPES.length);
        G.employees.push({ id: G.nextEmployeeId++, name: getEmpName(), type: EMP_TYPES[typeIdx].id, morale: 80, status: 'working', level: 1, unpaidTime: 0, assignedIng: 'farine', skill: 50 });
      }
    }
    return '<span class="cmd-ok">' + L('Employés = ', 'Employees = ') + '' + G.employees.length + '</span>';
  }

  // /stats max | /stats <stat> set N
  if (action === 'stats') {
    if (parts[1] === 'max') {
      G.stats.totalClicks = 999999; G.stats.totalCakesMade = 999999; G.stats.totalSold = 999999;
      return '<span class="cmd-ok">' + L('Toutes les stats au maximum !', 'All stats maxed!') + '</span>';
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
    return '<span class="cmd-ok">' + L('Espace = ', 'Space = ') + '' + G.maxSpace + 'm\u00b2</span>';
  }

  // /debt clear
  if (action === 'debt' || action === 'dept') {
    var debtOp = parts[1], debtN = parseFloat(parts[2]);
    if (debtOp === 'cancel' && parts[2] === 'all') {
      G.rentDebt = 0;
      G.rentLate = 0;
    } else if ((debtOp === 'cancel' || debtOp === 'set' || debtOp === 'add') && !isNaN(debtN) && debtN >= 0) {
      if (debtOp === 'cancel') G.rentDebt = Math.max(0, G.rentDebt - debtN);
      else if (debtOp === 'set') G.rentDebt = debtN;
      else G.rentDebt += debtN;
    } else {
      return '<span class="cmd-err">Usage: /debt cancel N|all, /debt set N, /debt add N</span>';
    }
    return '<span class="cmd-ok">' + L('Dette = ', 'Debt = ') + fmtMoney(G.rentDebt) + '</span>';
  }

  // /bank unlock | /bank clear
  if (action === 'bank') {
    if (parts[1] === 'unlock') {
      G.bankUnlocked = true;
      renderTabs();
      return '<span class="cmd-ok">' + t('console.bankUnlocked') + '</span>';
    }
    if (parts[1] === 'clear') {
      G.loans = [];
      return '<span class="cmd-ok">' + t('console.bankCleared') + '</span>';
    }
    return '<span class="cmd-err">Usage: /bank unlock|clear</span>';
  }

  // /theme <name> | /theme unlock all|spring|summer|fall|winter|birthday|horror|bakery|party|space
  if (action === 'theme') {
    var themeName = parts[1];
    var names = THEME_LIST.map(function(th) { return th.id; }).join(', ');
    if (!themeName) return '<span class="cmd-err">Usage: /theme &lt;' + names + '&gt; | /theme unlock all|spring|summer|fall|winter|birthday|horror|bakery|party|space</span>';
    if (themeName === 'unlock') {
      var what = parts[2];
      var lockable = THEME_LIST.filter(function(th) { return th.season || th.birthday || th.level || th.month; });
      if (what === 'all') {
        lockable.forEach(function(th) { G.unlockedThemes[th.id] = true; });
        return '<span class="cmd-ok">' + t('console.themesUnlocked') + '</span>';
      }
      var target = findTheme(what);
      if (!target || !(target.season || target.birthday || target.level || target.month)) return '<span class="cmd-err">Usage: /theme unlock all|spring|summer|fall|winter|birthday|horror|bakery|party|space</span>';
      G.unlockedThemes[what] = true;
      return '<span class="cmd-ok">' + t('console.themeUnlocked', { n: t(target.langKey) }) + '</span>';
    }
    var chosen = findTheme(themeName);
    if (!chosen) return '<span class="cmd-err">' + t('console.unknownTheme', { n: escH(themeName) }) + '</span>';
    if (themeLockReason(chosen)) return '<span class="cmd-err">' + t('console.themeLocked') + '</span>';
    setTheme(themeName);
    return '<span class="cmd-ok">' + L('Thème = ', 'Theme = ') + '' + themeName + '</span>';
  }

  // /birthday set DD MM
  if (action === 'birthday') {
    var day = parseInt(parts[1]);
    var month = parseInt(parts[2]);
    if (isNaN(day) || isNaN(month) || day < 1 || day > 31 || month < 1 || month > 12) {
      return '<span class="cmd-err">Usage: /birthday DD MM</span>';
    }
    G.birthday = { day: day, month: month };
    G.birthdaySetOn = null;
    G.birthdayBoostYear = null;
    tryBirthdayBoost();
    return '<span class="cmd-ok">' + L('Anniversaire : ', 'Birthday set to ') + '' + day + '/' + month + '</span>';
  }

  // /buy <ingredient> all|N
  if (action === 'buy') {
    var ingName = parts[1]; var amount = parts[2];
    if (!ingName) return '<span class="cmd-err">Usage: /buy &lt;ingredient&gt; all|N</span>';
    var ing = null;
    for (var i = 0; i < ING.length; i++) { if (ING[i].id === ingName) { ing = ING[i]; break; } }
    if (!ing) return '<span class="cmd-err">' + L('Ingrédient inconnu : ', 'Unknown ingredient: ') + '' + ingName + '</span>';
    if (amount === 'all') {
      var bought = 0;
      bought = buyIngredient(ing, 'max') || 0;
      return '<span class="cmd-ok">' + L('Acheté ', 'Bought ') + '' + fmt(bought) + 'x ' + ing.id + '</span>';
    }
    var n = parseInt(amount);
    if (isNaN(n)) return '<span class="cmd-err">Usage: /buy ' + ingName + ' all|N</span>';
    buyIngredient(ing, String(n));
    return '<span class="cmd-ok">' + L('Acheté ', 'Bought ') + '' + n + 'x ' + ing.id + '</span>';
  }

  // /sell <ingredient> all|N
  if (action === 'sell') {
    var ingName = parts[1]; var amount = parts[2];
    if (!ingName) return '<span class="cmd-err">Usage: /sell &lt;ingredient&gt; all|N</span>';
    var ing = null;
    for (var i = 0; i < ING.length; i++) { if (ING[i].id === ingName) { ing = ING[i]; break; } }
    if (!ing) return '<span class="cmd-err">' + L('Ingrédient inconnu : ', 'Unknown ingredient: ') + '' + ingName + '</span>';
    var have = G.ing[ing.id] || 0;
    if (amount === 'all') {
      var earned = resellIngredient(ing, have);
      return '<span class="cmd-ok">' + L('Vendu ', 'Sold ') + '' + have + 'x ' + ing.id + ' for ' + fmtMoney(earned) + '</span>';
    }
    var n = parseInt(amount);
    if (isNaN(n)) return '<span class="cmd-err">Usage: /sell ' + ingName + ' all|N</span>';
    n = Math.min(n, have);
    var earned = resellIngredient(ing, n);
    return '<span class="cmd-ok">' + L('Vendu ', 'Sold ') + '' + n + 'x ' + ing.id + ' for ' + fmtMoney(earned) + '</span>';
  }

  // /random
  if (action === 'random') {
    G.money = Math.floor(Math.random() * 100000);
    G.xp = Math.floor(Math.random() * 10000);
    G.totalEarned = G.money;
    ING.forEach(function(i) { G.ing[i.id] = Math.floor(Math.random() * 10000); });
    REC.forEach(function(r) { G.cakes[r.id] = Math.floor(Math.random() * 100); });
    return '<span class="cmd-ok">' + L('Tout est au hasard !', 'Everything randomized!') + '</span>';
  }

  // /time set N (1=normal, <1=slow, >1=fast)
  if (action === 'time') {
    if (parts[1] === 'set') {
      var speed = parseFloat(parts[2]);
      if (isNaN(speed) || speed <= 0) return '<span class="cmd-err">Usage: /time set N (0.1 - 10)</span>';
      speed = Math.max(0.1, Math.min(10, speed));
      G.timeSpeed = speed;
      return '<span class="cmd-ok">' + L('Vitesse du temps = x', 'Time speed = x') + '' + speed + '</span>';
    }
    return '<span class="cmd-err">Usage: /time set N</span>';
  }

  // /bakery create [nom] | delete [numero] | list
  if (action === 'bakery' || action === 'patisserie') {
    var sub = parts[1];
    if (sub === 'create') {
      var rawName = cmd.trim().split(/\s+/).slice(2).join(' ').slice(0, 30);
      if (openNewBakery(true, rawName)) {
        return '<span class="cmd-ok">' + t('console.bakeryCreated', { n: escH(G.bakeries[G.bakeries.length - 1].name), i: G.bakeries.length }) + '</span>';
      }
      return '<span class="cmd-err">Usage: /bakery create [nom]</span>';
    }
    if (sub === 'delete' || sub === 'remove') {
      ensureBakeryList();
      var idx = parts[2] === undefined ? G.currentBakeryIndex : parseInt(parts[2], 10) - 1;
      if (isNaN(idx) || idx < 0 || idx >= G.bakeries.length) return '<span class="cmd-err">' + t('console.bakeryUnknown') + bakeryListText() + '</span>';
      var goneName = idx === G.currentBakeryIndex ? G.bakeryName : G.bakeries[idx].name;
      if (deleteBakery(idx)) return '<span class="cmd-ok">' + t('console.bakeryDeleted', { n: escH(goneName) }) + '</span>';
      return '<span class="cmd-err">' + t('console.bakeryLast') + '</span>';
    }
    if (sub === 'list') {
      ensureBakeryList();
      return '<span class="cmd-info">' + bakeryListText() + '</span>';
    }
    return '<span class="cmd-err">Usage: /bakery create [nom] | delete [n] | list</span>';
  }

  // /bob challenge
  if (action === 'bob') {
    if (parts[1] === 'challenge') {
      setTimeout(offerChallenge, 50);
      return '<span class="cmd-ok">' + t('console.challengeStarted') + '</span>';
    }
    return '<span class="cmd-err">Usage: /bob challenge</span>';
  }

  if (action === 'oeufs') action = 'oeuf';

  // Check if it's an ingredient name (with liquid unit support)
  var ingMatch = null;
  for (var i = 0; i < ING.length; i++) {
    if (ING[i].id === action) { ingMatch = ING[i]; break; }
  }
  if (ingMatch) {
    var op = parts[1];
    if (op === 'infinite' || op === 'infini') {
      if (!G.infiniteIng) G.infiniteIng = {};
      if (parts[2] === 'off') { delete G.infiniteIng[ingMatch.id]; return '<span class="cmd-ok">' + ingMatch.id + L(' : plus à l’infini.', ': no longer infinite.') + '</span>'; }
      G.infiniteIng[ingMatch.id] = true; tickInfinite();
      return '<span class="cmd-ok">' + ingMatch.id + L(' : à l’infini !', ': infinite!') + '</span>';
    }
    if (G.infiniteIng && ['set', 'add', 'remove', 'max'].indexOf(op) >= 0) delete G.infiniteIng[ingMatch.id];
    // Check for liquid units: /lait set 53 ml
    var isLiquid = LIQUID_ING && LIQUID_ING.indexOf(ingMatch.id) >= 0;
    var rawN = parts[2]; var unit = parts[3];
    var n;
    if (isLiquid && unit && typeof parseLiquidAmount === 'function') {
      n = parseLiquidAmount(rawN, unit);
    } else {
      n = parseInt(rawN);
    }
    if (isNaN(n) && op !== 'max') return '<span class="cmd-err">Usage: /' + action + ' set|add|remove|max N' + (isLiquid ? ' [ml|cl|l]' : '') + ' | /' + action + ' infinite [off]</span>';
    if (op === 'set') G.ing[ingMatch.id] = Math.max(0, n);
    else if (op === 'add') G.ing[ingMatch.id] = (G.ing[ingMatch.id] || 0) + n;
    else if (op === 'max') G.ing[ingMatch.id] = maxStockFor(ingMatch);
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

  return '<span class="cmd-err">' + L('Commande inconnue : ', 'Unknown command: ') + escH(action) + L('. Tape /help', '. Type /help') + '</span>';
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

var lastSaveBeforeCreative = null;

// Tout au maximum dans la patisserie en cours (G peut etre une autre patisserie)
function maxThisBakery() {
  G.level = 1000;
  G.xp = 0;
  G.money = MONEY_CAP;
  G.totalEarned = MONEY_CAP;
  G.rebirth = 7;
  unlockEverything();
  ING.forEach(function(i) { G.ing[i.id] = maxStockFor(i); });
  REC.forEach(function(r) { G.cakes[r.id] = 9999; });
  var allSpace = 5;
  SPACE_UPG.forEach(function(su) { allSpace += su.add; });
  G.spaceBought = SPACE_UPG.length;
  G.maxSpace = allSpace + Math.ceil(usedSpace() * 2);
  BUILDINGS.forEach(function(b) {
    G.buildings[b.id] = { qty: 999 };
    if (!G.bldTimers[b.id]) G.bldTimers[b.id] = BLD_CYCLE_SEC;
  });
  // Toutes les machines, au niveau maximum
  MACHINES.forEach(function(m) { G.machines[m.id] = m.max; });
  syncOvens();
  G.employees = [];
  G.nextEmployeeId = 1;
  EMP_TYPES.forEach(function(et) {
    if (et.id === 'novice') return;
    var e = newEmployee(et.id, getEmpName(), 50);
    e.morale = 100;
    G.employees.push(e);
  });
  G.stats.totalClicks = Math.max(G.stats.totalClicks, 100000);
  G.stats.totalSold = Math.max(G.stats.totalSold, 100000);
}

function bakeryListText() {
  var lines = G.bakeries.map(function(b, i) {
    var cur = i === G.currentBakeryIndex;
    return '\n' + (i + 1) + '. ' + escH(cur ? G.bakeryName : b.name) + (cur ? ' *' : '');
  });
  return lines.join('');
}

// ============ GUIDE DES COMMANDES ============
// Chaque commande se deplie, avec tous ses cas de figure.
function cmdCase(use, fr, en, es, ex) { return { use: use, fr: fr, en: en, es: es, ex: ex || use }; }

var COMMAND_DOCS = [
  { id:'progress', fr:'Progression', en:'Progress', es:'Progreso', list:[
    { name:'/level', fr:'Change ton niveau.', en:'Changes your level.', es:'Cambia tu nivel.', cases:[
      cmdCase('/level add N', 'Ajoute N niveaux.', 'Adds N levels.', 'Añade N niveles.', '/level add 10'),
      cmdCase('/level remove N', 'Enlève N niveaux.', 'Removes N levels.', 'Quita N niveles.', '/level remove 5'),
      cmdCase('/level set N', 'Te met au niveau N.', 'Sets you to level N.', 'Te pone en el nivel N.', '/level set 50'),
      cmdCase('/level max', 'Te met au niveau 1000.', 'Sets you to level 1000.', 'Te pone en el nivel 1000.'),
    ]},
    { name:'/xp', fr:'Change ton XP.', en:'Changes your XP.', es:'Cambia tu XP.', cases:[
      cmdCase('/xp add N', 'Ajoute N XP. Tu peux monter de niveau.', 'Adds N XP. You can level up.', 'Añade N XP. Puedes subir de nivel.', '/xp add 500'),
      cmdCase('/xp set N', 'Fixe ton XP à N.', 'Sets your XP to N.', 'Fija tu XP en N.', '/xp set 0'),
    ]},
    { name:'/money', fr:'Fixe ton argent.', en:'Sets your money.', es:'Fija tu dinero.', cases:[
      cmdCase('/money set N', 'En euros.', 'In euros.', 'En euros.', '/money set 1000'),
      cmdCase('/money set N usd', 'Dans une autre monnaie : usd, gbp, jpy…', 'In another currency: usd, gbp, jpy…', 'En otra moneda: usd, gbp, jpy…', '/money set 500 usd'),
      cmdCase('/money infinite', 'Ton argent reste au maximum, comme en mode créatif.', 'Your money stays at the maximum, like in creative mode.', 'Tu dinero se queda al máximo, como en el modo creativo.'),
      cmdCase('/money infinite off', 'Arrête l’argent infini.', 'Stops infinite money.', 'Detiene el dinero infinito.'),
    ]},
    { name:'/stats', fr:'Change tes statistiques.', en:'Changes your statistics.', es:'Cambia tus estadísticas.', cases:[
      cmdCase('/stats max', 'Met les clics, les gâteaux préparés et vendus au maximum.', 'Maxes clicks, cakes baked and sold.', 'Pone al máximo los clics y los pasteles preparados y vendidos.'),
      cmdCase('/stats clicks set N', 'Change une stat : clicks, cakes, sold, salary ou rent.', 'Changes one stat: clicks, cakes, sold, salary or rent.', 'Cambia una estadística: clicks, cakes, sold, salary o rent.', '/stats sold set 1000'),
    ]},
  ]},
  { id:'bank', fr:'Argent et banque', en:'Money and bank', es:'Dinero y banco', list:[
    { name:'/debt', fr:'Gère ta dette de loyer.', en:'Manages your rent debt.', es:'Gestiona tu deuda de alquiler.', cases:[
      cmdCase('/debt cancel N', 'Enlève N € de dette.', 'Removes N € of debt.', 'Quita N € de deuda.', '/debt cancel 100'),
      cmdCase('/debt cancel all', 'Enlève toute la dette.', 'Removes all the debt.', 'Quita toda la deuda.'),
      cmdCase('/debt set N', 'Met la dette à N €.', 'Sets the debt to N €.', 'Pone la deuda en N €.', '/debt set 100'),
      cmdCase('/debt add N', 'Ajoute N € de dette.', 'Adds N € of debt.', 'Añade N € de deuda.', '/debt add 100'),
    ]},
    { name:'/bank', fr:'Gère ton compte à la banque.', en:'Manages your bank account.', es:'Gestiona tu cuenta del banco.', cases:[
      cmdCase('/bank unlock', 'Ouvre l’onglet Banque.', 'Opens the Bank tab.', 'Abre la pestaña Banco.'),
      cmdCase('/bank clear', 'Efface tous tes prêts en cours.', 'Clears all your current loans.', 'Borra todos tus préstamos actuales.'),
    ]},
  ]},
  { id:'bulk', fr:'Tout d’un coup', en:'All at once', es:'Todo de golpe', list:[
    { name:'/max', fr:'Met tout au maximum : niveau 1000, argent, stock, bâtiments, machines, employés, succès et thèmes. Plus un ingrédient est rare, moins tu en as.', en:'Maxes everything: level 1000, money, stock, buildings, machines, employees, achievements and themes. The rarer an ingredient, the less you get.', es:'Lo pone todo al máximo: nivel 1000, dinero, stock, edificios, máquinas, empleados, logros y temas. Cuanto más raro es un ingrediente, menos tienes.', cases:[
      cmdCase('/max', 'Dans la pâtisserie où tu es.', 'In the bakery you are in.', 'En la pastelería donde estás.'),
      cmdCase('/max all', 'Dans toutes tes pâtisseries.', 'In all your bakeries.', 'En todas tus pastelerías.'),
      cmdCase('/max NOM', 'Dans la pâtisserie qui porte ce nom.', 'In the bakery with this name.', 'En la pastelería con ese nombre.', '/max Chez Bob'),
    ]},
    { name:'/unmax', fr:'Revient à l’état d’avant /max.', en:'Goes back to before /max.', es:'Vuelve a como estaba antes de /max.', cases:[cmdCase('/unmax', 'Annule le dernier /max.', 'Undoes the last /max.', 'Anula el último /max.')] },
    { name:'/creative', fr:'Le mode créatif : tout à l’infini, des employés à l’infini et tous les thèmes.', en:'Creative mode: everything infinite, infinite employees and all themes.', es:'Modo creativo: todo infinito, empleados infinitos y todos los temas.', cases:[
      cmdCase('/creative', 'Active le mode créatif.', 'Turns creative mode on.', 'Activa el modo creativo.'),
      cmdCase('/creative off', 'L’arrête et te rend ta partie d’avant.', 'Turns it off and gives your game back.', 'Lo desactiva y te devuelve tu partida.'),
    ]},
    { name:'/undo', fr:'Annule la dernière commande.', en:'Undoes the last command.', es:'Anula el último comando.', cases:[cmdCase('/undo', 'Une seule commande en arrière.', 'One command back.', 'Un solo comando atrás.')] },
    { name:'/random', fr:'Met des valeurs au hasard.', en:'Sets random values.', es:'Pone valores al azar.', cases:[cmdCase('/random', 'Argent, XP et stock au hasard.', 'Random money, XP and stock.', 'Dinero, XP y stock al azar.')] },
    { name:'/reset', danger:true, fr:'Efface toute la partie, pour de bon.', en:'Erases the whole game, for good.', es:'Borra toda la partida, para siempre.', cases:[cmdCase('/reset', 'Tout de suite, sans retour possible.', 'Right away, with no way back.', 'Ahora mismo, sin vuelta atrás.')] },
  ]},
  { id:'shop', fr:'Boutique', en:'Shop', es:'Tienda', list:[
    { name:'/machine', fr:'Change le niveau d’une machine, entre 0 et son maximum (de 5 à 10 selon la machine).', en:'Changes a machine’s level, between 0 and its maximum (5 to 10 depending on the machine).', es:'Cambia el nivel de una máquina, entre 0 y su máximo (de 5 a 10 según la máquina).', cases:[
      cmdCase('/machine set NOM N', 'Met la machine au niveau N.', 'Sets the machine to level N.', 'Pone la máquina en el nivel N.', '/machine set four 3'),
      cmdCase('/machine set NOM max', 'La met à son niveau maximum.', 'Sets it to its maximum level.', 'La pone en su nivel máximo.', '/machine set four max'),
      cmdCase('/machine add NOM N', 'Ajoute N niveaux.', 'Adds N levels.', 'Añade N niveles.', '/machine add fouet 2'),
      cmdCase('/machine remove NOM N', 'Enlève N niveaux.', 'Removes N levels.', 'Quita N niveles.', '/machine remove four 5'),
      cmdCase('/machine remove NOM all', 'Enlève tous ses niveaux.', 'Removes all its levels.', 'Quita todos sus niveles.', '/machine remove four all'),
    ]},
    { name:'/bakery', fr:'Crée ou supprime des pâtisseries.', en:'Creates or deletes bakeries.', es:'Crea o elimina pastelerías.', cases:[
      cmdCase('/bakery create NOM', 'Crée une pâtisserie gratuitement. Le nom est facultatif.', 'Creates a bakery for free. The name is optional.', 'Crea una pastelería gratis. El nombre es opcional.', '/bakery create Chez Bob'),
      cmdCase('/bakery delete', 'Supprime la pâtisserie où tu es, sans la revendre.', 'Deletes the bakery you are in, without selling it.', 'Elimina la pastelería donde estás, sin venderla.'),
      cmdCase('/bakery delete N', 'Supprime la pâtisserie numéro N.', 'Deletes bakery number N.', 'Elimina la pastelería número N.', '/bakery delete 2'),
      cmdCase('/bakery list', 'Liste tes pâtisseries et leurs numéros.', 'Lists your bakeries and their numbers.', 'Lista tus pastelerías y sus números.'),
    ]},
    { name:'/building', fr:'Change le nombre de chaque bâtiment.', en:'Changes the amount of every building.', es:'Cambia la cantidad de cada edificio.', cases:[
      cmdCase('/building set N', 'En met N de chaque.', 'Sets N of each.', 'Pone N de cada uno.', '/building set 10'),
      cmdCase('/building add N', 'En ajoute N de chaque.', 'Adds N of each.', 'Añade N de cada uno.', '/building add 5'),
      cmdCase('/building remove N', 'En enlève N de chaque.', 'Removes N of each.', 'Quita N de cada uno.', '/building remove 5'),
      cmdCase('/building max', 'En met 999 de chaque.', 'Sets 999 of each.', 'Pone 999 de cada uno.'),
    ]},
    { name:'/employee', fr:'Gère tes employés.', en:'Manages your employees.', es:'Gestiona tus empleados.', cases:[
      cmdCase('/employee add N', 'Ajoute N employés au hasard.', 'Adds N random employees.', 'Añade N empleados al azar.', '/employee add 3'),
      cmdCase('/employee remove N', 'Enlève N employés.', 'Removes N employees.', 'Quita N empleados.', '/employee remove 1'),
      cmdCase('/employee set N', 'Fixe leur nombre à N.', 'Sets their number to N.', 'Fija su número en N.', '/employee set 5'),
      cmdCase('/employee max', 'Ajoute 50 employés très compétents.', 'Adds 50 very skilled employees.', 'Añade 50 empleados muy hábiles.'),
      cmdCase('/employee upgrade N', 'Met la compétence de tous à N.', 'Sets everyone’s skill to N.', 'Pone la habilidad de todos en N.', '/employee upgrade 80'),
      cmdCase('/employee NOM level set N', 'Met la compétence d’un employé à N.', 'Sets one employee’s skill to N.', 'Pone la habilidad de un empleado en N.', '/employee Emma level set 90'),
    ]},
    { name:'/space', fr:'Change ton espace, en m².', en:'Changes your space, in m².', es:'Cambia tu espacio, en m².', cases:[
      cmdCase('/space set N', 'Fixe l’espace à N m².', 'Sets the space to N m².', 'Fija el espacio en N m².', '/space set 100'),
      cmdCase('/space add N', 'Ajoute N m².', 'Adds N m².', 'Añade N m².', '/space add 50'),
      cmdCase('/space remove N', 'Enlève N m².', 'Removes N m².', 'Quita N m².', '/space remove 10'),
    ]},
  ]},
  { id:'stock', fr:'Stock', en:'Stock', es:'Stock', list:[
    { name:'/buy', fr:'Achète un ingrédient, avec ton argent.', en:'Buys an ingredient, with your money.', es:'Compra un ingrediente, con tu dinero.', cases:[
      cmdCase('/buy INGRÉDIENT N', 'En achète N.', 'Buys N.', 'Compra N.', '/buy farine 10'),
      cmdCase('/buy INGRÉDIENT all', 'Avec tout ton argent.', 'With all your money.', 'Con todo tu dinero.', '/buy sucre all'),
    ]},
    { name:'/sell', fr:'Revend un ingrédient.', en:'Resells an ingredient.', es:'Revende un ingrediente.', cases:[
      cmdCase('/sell INGRÉDIENT N', 'En revend N.', 'Resells N.', 'Revende N.', '/sell farine 10'),
      cmdCase('/sell INGRÉDIENT all', 'Revend tout.', 'Resells it all.', 'Lo revende todo.', '/sell sucre all'),
    ]},
    { name:'/INGRÉDIENT', generic:true, fr:'Change un ingrédient directement.', en:'Changes an ingredient directly.', es:'Cambia un ingrediente directamente.', cases:[
      cmdCase('/farine add N', 'En ajoute N.', 'Adds N.', 'Añade N.', '/farine add 100'),
      cmdCase('/farine remove N', 'En enlève N.', 'Removes N.', 'Quita N.', '/farine remove 10'),
      cmdCase('/farine set N', 'Fixe la quantité à N.', 'Sets the amount to N.', 'Fija la cantidad en N.', '/farine set 100'),
      cmdCase('/farine max', 'Sa limite : plus c’est rare, moins tu en as.', 'Its limit: the rarer, the less you get.', 'Su límite: cuanto más raro, menos tienes.'),
      cmdCase('/farine infinite', 'Cet ingrédient ne s’épuise plus jamais. Marche avec tous les ingrédients.', 'This ingredient never runs out. Works with every ingredient.', 'Este ingrediente ya no se acaba nunca. Funciona con todos los ingredientes.', '/chocolat infinite'),
      cmdCase('/farine infinite off', 'Il redevient normal.', 'Back to normal.', 'Vuelve a la normalidad.'),
      cmdCase('/lait set N cl', 'Lait, crème et rhum acceptent ml, cl et l.', 'Milk, cream and rum accept ml, cl and l.', 'Leche, nata y ron aceptan ml, cl y l.', '/lait set 50 cl'),
    ]},
    { name:'/RECETTE', generic:true, fr:'Change le stock d’un gâteau.', en:'Changes the stock of a cake.', es:'Cambia el stock de un pastel.', cases:[
      cmdCase('/cookie add N', 'En ajoute N.', 'Adds N.', 'Añade N.', '/cookie add 10'),
      cmdCase('/cookie set N', 'Fixe le stock à N.', 'Sets the stock to N.', 'Fija el stock en N.', '/cookie set 10'),
      cmdCase('/cookie max', 'En met 9999.', 'Sets 9999.', 'Pone 9999.'),
    ]},
  ]},
  { id:'world', fr:'Monde', en:'World', es:'Mundo', list:[
    { name:'/time', fr:'Change la vitesse du jeu.', en:'Changes the game speed.', es:'Cambia la velocidad del juego.', cases:[
      cmdCase('/time set N', 'De 0.1 à 10. 1 est la vitesse normale.', 'From 0.1 to 10. 1 is normal speed.', 'De 0.1 a 10. 1 es la velocidad normal.', '/time set 5'),
    ]},
    { name:'/theme', fr:'Change de thème, ou en débloque.', en:'Changes theme, or unlocks themes.', es:'Cambia de tema o los desbloquea.', cases:[
      cmdCase('/theme NOM', 'Met ce thème : light, dark, spring, summer, fall, winter, birthday, horror, bakery, party ou space.', 'Applies this theme: light, dark, spring, summer, fall, winter, birthday, horror, bakery, party or space.', 'Pone este tema: light, dark, spring, summer, fall, winter, birthday, horror, bakery, party o space.', '/theme winter'),
      cmdCase('/theme unlock all', 'Débloque tous les thèmes pour toujours.', 'Unlocks all themes forever.', 'Desbloquea todos los temas para siempre.'),
      cmdCase('/theme unlock NOM', 'Débloque ce thème pour toujours.', 'Unlocks this theme forever.', 'Desbloquea este tema para siempre.', '/theme unlock party'),
    ]},
    { name:'/birthday', fr:'Change ta date d’anniversaire.', en:'Changes your birthday.', es:'Cambia tu fecha de cumpleaños.', cases:[
      cmdCase('/birthday JJ MM', 'Jour, puis mois.', 'Day, then month.', 'Día y luego mes.', '/birthday 14 7'),
    ]},
    { name:'/bob', fr:'Parle à Bob.', en:'Talk to Bob.', es:'Habla con Bob.', cases:[
      cmdCase('/bob challenge', 'Il te propose son défi tout de suite.', 'He offers you his challenge right away.', 'Te propone su reto ahora mismo.'),
    ]},
    { name:'/help', fr:'Ouvre ce guide.', en:'Opens this guide.', es:'Abre esta guía.', cases:[cmdCase('/help', 'Le guide s’ouvre à côté de la console.', 'The guide opens next to the console.', 'La guía se abre junto a la consola.')] },
  ]},
];

// Portugais et allemand : leurs textes du guide viennent de leur fichier de langue
Object.keys(I18N_EXTRA).forEach(function(lang) {
  var d = I18N_EXTRA[lang].cmd;
  COMMAND_DOCS.forEach(function(g) {
    g[lang] = d['g:' + g.id];
    g.list.forEach(function(c) {
      c[lang] = d[c.name];
      c.cases.forEach(function(x) { x[lang] = d['c:' + x.use]; });
    });
  });
});

var CONSOLE_COMMANDS = [];
COMMAND_DOCS.forEach(function(group) {
  group.list.forEach(function(c) { if (!c.generic) CONSOLE_COMMANDS.push(c.name); });
});

function docText(x) { return x[currentLang] || x.fr; }

function toggleCommandHelp() {
  var el = document.getElementById('console-help');
  if (!el) return;
  var modal = el.closest('.modal');
  if (el.style.display !== 'none') {
    el.style.display = 'none';
    if (modal) modal.classList.remove('guide-open');
    return;
  }
  var h = '<div class="cg-head"><h3>' + t('console.guideTitle') + '</h3><p>' + t('console.guideHelp') + '</p></div>';
  h += '<label class="cg-search">' + uiIcon('search') + '<input type="search" id="cg-search" placeholder="' + escH(t('console.guideSearch')) + '" value="' + escH(ui.guideSearch) + '" oninput="ui.guideSearch=this.value;renderCommandList()"></label>';
  h += '<div class="cg-cats" id="cg-cats"></div><div class="cg-list" id="cg-list"></div>';
  el.innerHTML = iconify(h);
  el.style.display = 'flex';
  if (modal) modal.classList.add('guide-open');
  renderCommandList();
}

// Met en valeur ce qu'il faut remplacer (N, NOM...)
function commandUsage(use) {
  return escH(use).replace(/\b(N|NOM|INGRÉDIENT|RECETTE|JJ|MM)\b/g, '<i class="cg-arg">$1</i>');
}

function renderCommandList() {
  var cats = document.getElementById('cg-cats');
  var list = document.getElementById('cg-list');
  if (!cats || !list) return;
  var c = '<button class="cg-cat' + (ui.guideCat === 'all' ? ' active' : '') + '" onclick="ui.guideCat=\'all\';renderCommandList()">' + t('console.guideAll') + '</button>';
  COMMAND_DOCS.forEach(function(g) {
    c += '<button class="cg-cat' + (ui.guideCat === g.id ? ' active' : '') + '" onclick="ui.guideCat=\'' + g.id + '\';renderCommandList()">' + docText(g) + '</button>';
  });
  cats.innerHTML = c;
  var q = ui.guideSearch.trim().toLowerCase();
  var h = '';
  COMMAND_DOCS.forEach(function(g) {
    if (ui.guideCat !== 'all' && ui.guideCat !== g.id) return;
    var cards = '';
    g.list.forEach(function(cmd) {
      var hay = (cmd.name + ' ' + docText(cmd) + ' ' + cmd.cases.map(function(x) { return x.use + ' ' + docText(x); }).join(' ')).toLowerCase();
      if (q && hay.indexOf(q) < 0) return;
      // Un menu depliant par commande
      cards += '<details class="cg-card' + (cmd.danger ? ' danger' : '') + '"' + (q ? ' open' : '') + '><summary><code>' + escH(cmd.name) + '</code><span>' + docText(cmd) + '</span></summary>';
      if (cmd.danger) cards += '<span class="cg-warn">' + t('console.guideDanger') + '</span>';
      cmd.cases.forEach(function(x) {
        cards += '<div class="cg-case"><code>' + commandUsage(x.use) + '</code><p>' + docText(x) + '</p>';
        cards += '<button type="button" onclick="useExample(\'' + x.ex.replace(/'/g, '') + '\')">' + escH(x.ex) + '</button></div>';
      });
      cards += '</details>';
    });
    if (cards) h += '<h4>' + docText(g) + '</h4>' + cards;
  });
  list.innerHTML = h || '<p class="cg-empty">' + t('console.guideNone') + '</p>';
}

function useExample(cmd) {
  var inp = document.getElementById('console-cmd-input');
  if (!inp) return;
  inp.value = cmd;
  inp.focus();
  if (inp.animate && fxEnabled()) inp.animate([{ boxShadow: '0 0 0 3px #ffd60a' }, { boxShadow: '0 0 0 0 transparent' }], { duration: 500 });
}
