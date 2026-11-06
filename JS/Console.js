/* ============================================
   PATISSERIE 2D SIMULATOR - CONSOLE DE COMMANDES
   Debloquee en enervant Bob (voir Bob.js)
   ============================================ */

// ============ COMMAND CONSOLE ============
var consoleHistory = [];
var lastCommandState = null;

function showCommandConsole() {
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
  h += '<input type="text" id="console-cmd-input" placeholder="' + t('console.placeholder') + '" onkeydown="handleConsoleKey(event)" oninput="handleConsoleAutocomplete()">';
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
    G.rebirth = 7;
    G.bankUnlocked = true;
    G.secondBakery = true;
    // All ingredients
    ING.forEach(function(i) { G.ing[i.id] = 1e24; });
    // All cakes
    REC.forEach(function(r) { G.cakes[r.id] = 9999; });
    // Stockage max : tous les agrandissements achetes, et de la place pour tout ce stock
    var allSpace = 5;
    SPACE_UPG.forEach(function(su) { allSpace += su.add; });
    G.spaceBought = SPACE_UPG.length;
    // Assez grand pour tout ce stock, et encore autant de libre pour preparer
    G.maxSpace = allSpace + Math.ceil(usedSpace() * 2);
    // All buildings
    BUILDINGS.forEach(function(b) { G.buildings[b.id] = { qty: 999 }; });
    // All achievements
    // Tout, sauf les succes secrets : ceux-la se meritent
    ACHIEVEMENTS.forEach(function(a) { if (!a.hidden) G.achievements[a.id] = true; });
    G.ovens = OVEN_CONFIG.max;
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
        unpaidTime: 0
      });
    });
    // Boost stats for achievement conditions
    G.stats.totalClicks = 100000;
    G.stats.totalSold = 100000;
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
        G.employees.push({ id: G.nextEmployeeId++, name: getEmpName(), type: EMP_TYPES[typeIdx].id, morale: 100, status: 'working', level: 1, unpaidTime: 0, assignedIng: 'farine', skill: 90 + Math.floor(Math.random() * 11) });
      }
      return '<span class="cmd-ok">50 max-skill employees added!</span>';
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
    if (parts[1] === 'set') {
      var debtN = parseFloat(parts[2]);
      if (isNaN(debtN) || debtN < 0) return '<span class="cmd-err">Usage: /debt set N</span>';
      G.rentDebt = debtN;
      return '<span class="cmd-ok">Debt = ' + fmtMoney(G.rentDebt) + '</span>';
    }
    G.rentDebt = 0;
    return '<span class="cmd-ok">Debt cleared!</span>';
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

  // /theme <name> | /theme unlock all|spring|summer|fall|winter|birthday
  if (action === 'theme') {
    var themeName = parts[1];
    var names = THEME_LIST.map(function(th) { return th.id; }).join(', ');
    if (!themeName) return '<span class="cmd-err">Usage: /theme &lt;' + names + '&gt; | /theme unlock all|spring|summer|fall|winter|birthday</span>';
    if (themeName === 'unlock') {
      var what = parts[2];
      var lockable = THEME_LIST.filter(function(th) { return th.season || th.birthday; });
      if (what === 'all') {
        lockable.forEach(function(th) { G.unlockedThemes[th.id] = true; });
        return '<span class="cmd-ok">' + t('console.themesUnlocked') + '</span>';
      }
      var target = findTheme(what);
      if (!target || !(target.season || target.birthday)) return '<span class="cmd-err">Usage: /theme unlock all|spring|summer|fall|winter|birthday</span>';
      G.unlockedThemes[what] = true;
      return '<span class="cmd-ok">' + t('console.themeUnlocked', { n: t(target.langKey) }) + '</span>';
    }
    var chosen = findTheme(themeName);
    if (!chosen) return '<span class="cmd-err">' + t('console.unknownTheme', { n: escH(themeName) }) + '</span>';
    if (themeLockReason(chosen)) return '<span class="cmd-err">' + t('console.themeLocked') + '</span>';
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
    G.birthdaySetOn = null;
    G.birthdayBoostYear = null;
    tryBirthdayBoost();
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
      bought = buyIngredient(ing, 'max') || 0;
      return '<span class="cmd-ok">Bought ' + fmt(bought) + 'x ' + ing.id + '</span>';
    }
    var n = parseInt(amount);
    if (isNaN(n)) return '<span class="cmd-err">Usage: /buy ' + ingName + ' all|N</span>';
    buyIngredient(ing, String(n));
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

  // /gameover
  if (action === 'gameover') {
    G.gameOver = true;
    showGameOverModal();
    return '<span class="cmd-ok">Game Over triggered!</span>';
  }

  if (action === 'oeufs') action = 'oeuf';

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
      n = parseLiquidAmount(rawN, unit);
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

function bakeryListText() {
  var lines = G.bakeries.map(function(b, i) {
    var cur = i === G.currentBakeryIndex;
    return '\n' + (i + 1) + '. ' + escH(cur ? G.bakeryName : b.name) + (cur ? ' *' : '');
  });
  return lines.join('');
}

// ============ GUIDE DES COMMANDES ============
// use : comment l'ecrire. ex : exemples, un clic les met dans la console.
var COMMAND_DOCS = [
  { id:'progress', fr:'Progression', en:'Progress', list:[
    { name:'/level', use:['/level add|set|remove N','/level max'], ex:['/level add 10','/level set 50','/level max'], fr:'Change ton niveau.', en:'Changes your level.' },
    { name:'/xp', use:['/xp add|set N'], ex:['/xp add 500'], fr:'Change ton XP. Avec add, tu peux monter de niveau.', en:'Changes your XP. With add, you can level up.' },
    { name:'/money', use:['/money set N [monnaie]'], ex:['/money set 1000','/money set 500 usd'], fr:'Fixe ton argent, en euros ou dans une autre monnaie.', en:'Sets your money, in euros or another currency.' },
    { name:'/rebirth', use:['/rebirth set N','/rebirth max'], ex:['/rebirth set 2','/rebirth max'], fr:'Change ton nombre de rebirths, de 0 à 7.', en:'Changes your rebirth count, from 0 to 7.' },
    { name:'/stats', use:['/stats max','/stats clicks|cakes|sold|salary|rent set N'], ex:['/stats max','/stats sold set 1000'], fr:'Change tes statistiques.', en:'Changes your statistics.' },
  ]},
  { id:'bank', fr:'Argent et banque', en:'Money and bank', list:[
    { name:'/debt', use:['/debt','/debt set N'], ex:['/debt','/debt set 100'], fr:'Efface ta dette de loyer, ou la fixe à un montant. La première dette fait venir Bob.', en:'Clears your rent debt, or sets it to an amount. Your first debt brings Bob over.' },
    { name:'/bank', use:['/bank unlock','/bank clear'], ex:['/bank unlock','/bank clear'], fr:'Ouvre l’onglet Banque, ou efface tous tes prêts en cours.', en:'Opens the Bank tab, or clears all your current loans.' },
  ]},
  { id:'bulk', fr:'Tout d’un coup', en:'All at once', list:[
    { name:'/max', use:['/max'], ex:['/max'], fr:'Met tout au maximum : niveau, argent, stock, stockage, bâtiments, fours et succès, sauf les secrets.', en:'Maxes everything: level, money, stock, storage, buildings, ovens and achievements, except secret ones.' },
    { name:'/unmax', use:['/unmax'], ex:['/unmax'], fr:'Revient à l’état d’avant /max.', en:'Goes back to before /max.' },
    { name:'/undo', use:['/undo'], ex:['/undo'], fr:'Annule la dernière commande.', en:'Undoes the last command.' },
    { name:'/random', use:['/random'], ex:['/random'], fr:'Met des valeurs au hasard.', en:'Sets random values.' },
    { name:'/gameover', use:['/gameover'], ex:['/gameover'], fr:'Déclenche la faillite.', en:'Triggers bankruptcy.', danger:true },
    { name:'/reset', use:['/reset'], ex:['/reset'], fr:'Efface toute la partie, tout de suite et pour de bon.', en:'Erases the whole game, right away and for good.', danger:true },
  ]},
  { id:'shop', fr:'Boutique', en:'Shop', list:[
    { name:'/bakery', use:['/bakery create [NOM]','/bakery delete [NUMÉRO]','/bakery list'], ex:['/bakery create Chez Bob','/bakery list','/bakery delete 2'], fr:'Crée une pâtisserie gratuitement, ou en supprime une sans la revendre. Sans numéro, delete supprime celle où tu es.', en:'Creates a bakery for free, or deletes one without selling it. With no number, delete removes the one you are in.' },
    { name:'/building', use:['/building set|add|remove N','/building max'], ex:['/building add 5','/building max'], fr:'Change le nombre de chaque bâtiment.', en:'Changes the amount of every building.' },
    { name:'/employee', use:['/employee set|add|remove N','/employee max','/employee upgrade N','/employee NOM level set N'], ex:['/employee add 3','/employee upgrade 80'], fr:'Gère tes employés et leur compétence.', en:'Manages your employees and their skill.' },
    { name:'/space', use:['/space set|add|remove N'], ex:['/space add 50'], fr:'Change ton espace, en m².', en:'Changes your space, in m².' },
  ]},
  { id:'stock', fr:'Stock', en:'Stock', list:[
    { name:'/buy', use:['/buy INGRÉDIENT N|all'], ex:['/buy farine 10','/buy sucre all'], fr:'Achète un ingrédient, avec ton argent.', en:'Buys an ingredient, with your money.' },
    { name:'/sell', use:['/sell INGRÉDIENT N|all'], ex:['/sell farine 10','/sell sucre all'], fr:'Revend un ingrédient.', en:'Resells an ingredient.' },
    { name:'/farine', generic:true, use:['/INGRÉDIENT set|add|remove N','/INGRÉDIENT max'], ex:['/farine add 100','/lait set 50 cl'], fr:'Change un ingrédient directement. Lait, crème et rhum acceptent ml, cl et l.', en:'Changes an ingredient directly. Milk, cream and rum accept ml, cl and l.' },
    { name:'/cookie', generic:true, use:['/RECETTE set|add N','/RECETTE max'], ex:['/cookie add 10','/cookie max'], fr:'Change le stock d’un gâteau.', en:'Changes the stock of a cake.' },
  ]},
  { id:'world', fr:'Monde', en:'World', list:[
    { name:'/time', use:['/time set N'], ex:['/time set 5','/time set 1'], fr:'Vitesse du jeu, de 0.1 à 10. 1 est la vitesse normale.', en:'Game speed, from 0.1 to 10. 1 is normal speed.' },
    { name:'/theme', use:['/theme NOM','/theme unlock all|spring|summer|fall|winter|birthday'], ex:['/theme winter','/theme unlock all'], fr:'Change de thème, ou débloque des thèmes pour toujours.', en:'Changes theme, or unlocks themes forever.' },
    { name:'/birthday', use:['/birthday JJ MM'], ex:['/birthday 14 7'], fr:'Change ta date d’anniversaire.', en:'Changes your birthday.' },
    { name:'/help', use:['/help'], ex:['/help'], fr:'Ouvre ce guide.', en:'Opens this guide.' },
  ]},
];

var CONSOLE_COMMANDS = [];
COMMAND_DOCS.forEach(function(group) {
  group.list.forEach(function(c) { if (!c.generic) CONSOLE_COMMANDS.push(c.name); });
});

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

// Met en valeur ce qu'il faut remplacer (N, NOM...) et les choix (add|set)
function commandUsage(use) {
  return escH(use)
    .replace(/\[([^\]]+)\]/g, '<em class="cg-opt">[$1]</em>')
    .replace(/\b(N|NOM|NUMÉRO|INGRÉDIENT|RECETTE|JJ|MM)\b/g, '<i class="cg-arg">$1</i>')
    .replace(/\|/g, '<span class="cg-or">|</span>');
}

function renderCommandList() {
  var cats = document.getElementById('cg-cats');
  var list = document.getElementById('cg-list');
  if (!cats || !list) return;
  var en = currentLang === 'en';
  var c = '<button class="cg-cat' + (ui.guideCat === 'all' ? ' active' : '') + '" onclick="ui.guideCat=\'all\';renderCommandList()">' + t('console.guideAll') + '</button>';
  COMMAND_DOCS.forEach(function(g) {
    c += '<button class="cg-cat' + (ui.guideCat === g.id ? ' active' : '') + '" onclick="ui.guideCat=\'' + g.id + '\';renderCommandList()">' + (en ? g.en : g.fr) + '</button>';
  });
  cats.innerHTML = c;
  var q = ui.guideSearch.trim().toLowerCase();
  var h = '';
  COMMAND_DOCS.forEach(function(g) {
    if (ui.guideCat !== 'all' && ui.guideCat !== g.id) return;
    var cards = '';
    g.list.forEach(function(cmd) {
      var desc = en ? cmd.en : cmd.fr;
      var hay = (cmd.name + ' ' + cmd.use.join(' ') + ' ' + desc).toLowerCase();
      if (q && hay.indexOf(q) < 0) return;
      cards += '<article class="cg-card' + (cmd.danger ? ' danger' : '') + '">';
      cards += '<div class="cg-usage">';
      cmd.use.forEach(function(u) { cards += '<code>' + commandUsage(u) + '</code>'; });
      cards += '</div><p>' + desc + '</p>';
      if (cmd.danger) cards += '<span class="cg-warn">' + t('console.guideDanger') + '</span>';
      cards += '<div class="cg-ex"><span>' + t('console.guideTry') + '</span>';
      cmd.ex.forEach(function(ex) {
        cards += '<button type="button" onclick="useExample(\'' + ex + '\')">' + escH(ex) + '</button>';
      });
      cards += '</div></article>';
    });
    if (cards) h += '<h4>' + (en ? g.en : g.fr) + '</h4>' + cards;
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
