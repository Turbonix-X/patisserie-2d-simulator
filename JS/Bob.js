/* ============================================
   PATISSERIE 2D SIMULATOR - BOB
   Il t'accueille, t'explique le jeu, et cache la
   console. A force de l'embeter, il devient aigri.
   ============================================ */

var introActive = false;

// ============ INTRO ============
function showIntro() {
  introActive = true;
  document.body.classList.add('in-intro');
  G.money = 0;
  var el = document.getElementById('intro');
  el.style.display = 'flex';
  // Le meme Bob, en grand, sans sa tenue : il ne travaille pas encore
  var big = document.getElementById('intro-bob');
  big.innerHTML = '';
  big.appendChild(document.querySelector('#bob svg').cloneNode(true));
  introStep(0);
}

function introStep(step) {
  var box = document.getElementById('intro-speech');
  var h = '';
  if (step === 0) {
    h = '<p>' + t('intro.hello') + '</p><button class="btn btn-primary" onclick="introStep(1)">' + t('common.next') + '</button>';
  } else if (step === 1) {
    h = '<p>' + t('intro.name') + '</p>';
    h += '<input id="intro-name" maxlength="30" placeholder="' + escH(t('intro.namePlaceholder')) + '" value="' + escH(G.bakeryName) + '" onkeydown="if(event.key===\'Enter\')introSubmitName()">';
    h += '<button class="btn btn-primary" onclick="introSubmitName()">' + t('common.next') + '</button>';
  } else if (step === 2) {
    h = '<p>' + t('intro.money', { n: escH(G.bakeryName) }) + '</p><button class="btn btn-primary" onclick="introGiveMoney()">' + t('common.next') + '</button>';
  } else {
    h = '<p>' + t('intro.outfit') + '</p><button class="btn btn-primary" onclick="introFinish()">' + t('intro.go') + '</button>';
  }
  box.innerHTML = h;
  if (box.animate && fxEnabled()) {
    box.animate([{ opacity: 0, transform: 'translateY(10px) scale(.95)' }, { opacity: 1, transform: 'none' }], { duration: 350, easing: 'cubic-bezier(.34,1.56,.64,1)' });
  }
  var big = document.getElementById('intro-bob');
  big.classList.add('talking');
  clearTimeout(introStep._t);
  introStep._t = setTimeout(function() { big.classList.remove('talking'); }, 1500);
  if (step === 1) {
    var input = document.getElementById('intro-name');
    input.focus();
    input.select();
  }
}

function introSubmitName() {
  var input = document.getElementById('intro-name');
  var val = input.value.trim();
  if (!val) {
    toast(t('intro.nameError'));
    fxShake(input);
    return;
  }
  G.bakeryName = val;
  renderHeader();
  introStep(2);
}

function introGiveMoney() {
  G.money = 50;
  renderHeader();
  renderIngredients();
  showFloatingMoney(50, document.querySelector('#intro-speech button'));
  playSuccessSound();
  introStep(3);
}

function introFinish() {
  introActive = false;
  G.money = 50;
  G.introDone = true;
  G.tutorialDone = false;
  G.tutorialStep = 0;
  document.getElementById('intro').style.display = 'none';
  document.body.classList.remove('in-intro');
  fullRender();
  checkAchievements();
  save();
}

// ============ TUTORIEL ============
// Etapes : 0 acheter, 1 preparer, 2 aller aux ventes, 3 vendre, 4 bravo, 5 fini
function tutorialCheck() {
  if (G.tutorialDone || introActive) return;
  var before = G.tutorialStep;
  if (G.tutorialStep === 0 && (canMake(REC[0]) || G.crafting.length > 0)) G.tutorialStep = 1;
  if (G.tutorialStep === 1 && (G.crafting.length > 0 || G.cakes.cookie > 0)) G.tutorialStep = 2;
  if (G.tutorialStep === 2 && (currentTab === 'sell' || G.stats.totalSold > 0)) G.tutorialStep = 3;
  if (G.tutorialStep === 3 && G.stats.totalSold > 0) G.tutorialStep = 4;
  if (before !== G.tutorialStep) renderTutorial();
}

function renderTutorial() {
  if (bobTalkTimer || introActive) return; // Bob repond : le tutoriel revient juste apres
  if (G.tutorialDone || G.tutorialStep >= 5) {
    hideBobBubble();
    return;
  }
  var mood = bobMoodKind();
  // Vraiment enerve, il refuse d'expliquer : le tutoriel attend qu'il se calme, ou qu'il soit triste
  if (mood === 'angry' && bobAnger() >= 2) { hideBobBubble(); return; }
  var sfx = mood === 'happy' ? '' : '.' + mood;
  var keys = ['tuto.step1', 'tuto.step2', 'tuto.step3', 'tuto.step4', 'tuto.done'];
  var btn = G.tutorialStep === 4
    ? '<button class="btn btn-small btn-primary" onclick="skipTutorial()">' + t('tuto.ok' + sfx) + '</button>'
    : '<button class="btn btn-small" onclick="skipTutorial()">' + t('tuto.skip' + sfx) + '</button>';
  showBobBubble(t(keys[G.tutorialStep] + sfx), btn);
}

function skipTutorial() {
  G.tutorialDone = true;
  G.tutorialStep = 5;
  hideBobBubble();
}

// ============ BULLE ============
var bobTalkTimer = null;
var bobBubbleText = null;

function showBobBubble(msg, extra) {
  var el = document.getElementById('bob-bubble');
  if (!el || bobBubbleText === msg) return;
  bobBubbleText = msg;
  el.innerHTML = '<span class="bob-bubble-name">Bob</span><p>' + iconify(msg) + '</p>' + (extra || '');
  el.style.display = 'block';
  if (el.animate && fxEnabled()) {
    el.animate([{ opacity: 0, transform: 'translateY(10px) scale(.92)' }, { opacity: 1, transform: 'none' }],
      { duration: 350, easing: 'cubic-bezier(.34,1.56,.64,1)' });
  }
  bobMouth(1400);
}

function hideBobBubble() {
  var el = document.getElementById('bob-bubble');
  if (el) { el.style.display = 'none'; el.innerHTML = ''; }
  bobBubbleText = null;
}

function bobMouth(ms) {
  var bob = document.getElementById('bob');
  if (!bob) return;
  bob.classList.add('talking');
  clearTimeout(bobMouth._t);
  bobMouth._t = setTimeout(function() { bob.classList.remove('talking'); }, ms);
}

// Bob repond, puis le tutoriel reprend s'il n'est pas fini
function bobSay(msg, ms) {
  if (bobTalkTimer) clearTimeout(bobTalkTimer);
  bobTalkTimer = null;
  bobBubbleText = null;
  showBobBubble(msg);
  bobTalkTimer = setTimeout(function() {
    bobTalkTimer = null;
    if (bobQueue.length > 0) {
      var next = bobQueue.shift();
      bobSay(next, Math.max(3500, next.length * 60));
      return;
    }
    hideBobBubble();
    renderTutorial();
  }, ms || 2800);
}

// ============ SA COLERE ============
var BOB_CLICKS_NEEDED = 50;

// 0 calme, 1 agace, 2 enerve, 3 furieux, 4 fou de rage, 5 aigri (il faut du sucre pour l'en sortir)
function bobAnger() {
  if ((G.bobSad || 0) > 0) return 5;
  var c = G.bobClicks || 0;
  if (c >= BOB_CLICKS_NEEDED) return 5;
  if (c >= 40) return 4;
  if (c >= 30) return 3;
  if (c >= 20) return 2;
  if (c >= 10) return 1;
  return 0;
}

// Ce qui s'affiche : sa colere, ou sa tristesse quand il se remet (s3, s2, s1).
function bobStage() {
  var sad = G.bobSad || 0;
  if (sad >= 4) return '5';
  if (sad > 0) return 's' + sad;
  return String(bobAnger());
}

// ============ COMMENT IL TE PARLE ============
// Enerve, il ne veut meme pas t'expliquer les choses.
// Plus il va mieux, plus ses explications sont completes.
function bobFilter(text) {
  var stage = bobStage();
  if (stage === '0') return text;
  if (stage === '5' || stage === '4') return pickLine('bob.refuse');
  var sentences = String(text).match(/[^.!?…]+[.!?…]+\s*/g) || [text];
  if (stage === 's3' || stage === '3') return pickLine('bob.grumbleA') + ' ' + sentences[0];
  if (stage === 's2' || stage === '2') return pickLine('bob.grumbleB') + ' ' + sentences.slice(0, 2).join('');
  return pickLine('bob.grumbleC') + ' ' + text;
}

function bobFilterLines(lines) {
  var stage = bobStage();
  if (stage === '5' || stage === '4') return [pickLine('bob.refuse')];
  return lines.map(bobFilter);
}

// Quand une explication arrive, elle attend son tour si Bob parle deja
var bobQueue = [];

function bobTell(text) {
  var msg = bobFilter(text);
  if (bobTalkTimer) { bobQueue.push(msg); return; }
  bobSay(msg, Math.max(3500, msg.length * 60));
}

// Ce que Bob explique a chaque nouvelle fonction : [niveau, cle]
var UNLOCK_TALKS = [[2, 'research'], [3, 'machines'], [5, 'staff'], [10, 'baker'], [20, 'carrier'], [20, 'dashboard'], [25, 'manager'], [30, 'orders'], [35, 'seller'], [40, 'buildings'], [65, 'chef'], [90, 'buyer'], [1000, 'top']];

function explainLevel(lvl) {
  UNLOCK_TALKS.forEach(function(x) {
    if (x[0] !== lvl || G.explained[x[1]]) return;
    G.explained[x[1]] = true;
    bobTell(t('unl.' + x[1]));
  });
}

function onBuildingSoon(bld) {
  if (typeof bgTick !== 'undefined' && bgTick) return;
  bobTell(t('bob.bldSoon', { n: t('b.' + bld.id), i: t('i.' + bld.produces) }));
}

function onBuildingDone(bld, amount) {
  if (typeof bgTick !== 'undefined' && bgTick) return;
  toast(t('bld.done', { n: t('b.' + bld.id), q: fmt(amount), i: t('i.' + bld.produces) }));
}

// Tu es parti sans mettre pause ?
var bobLastInput = Date.now();
var bobLastIdle = 0;
['pointerdown', 'keydown'].forEach(function(ev) {
  document.addEventListener(ev, function() { bobLastInput = Date.now(); });
});

// De temps en temps, quand il est de bonne humeur : un conseil, une sauvegarde, ou une anecdote
var bobLastChat = Date.now();
function tickBobChat(now) {
  if (G.settings.bobTalk === false || !G.tutorialDone || introActive || bobTalkTimer) return;
  if (now - bobLastChat < BOB_CHAT_SEC * 1000 || bobStage() !== '0') return;
  bobLastChat = now;
  var r = Math.random();
  if (r < 0.2) bobTell(t('bob.saveTip'));
  else if (r < 0.55) bobTell(pickLine('pause.tips'));
  else bobTell(t('bob.factIntro') + ' ' + pickLine('bob.facts'));
}

function tickIdle() {
  var now = Date.now();
  // Pause automatique : plus aucun clic ni touche depuis le temps choisi
  var autoMin = (G.settings && G.settings.autoPause) || 0;
  if (autoMin > 0 && !G.paused && !G.gameOver && !introActive && G.introDone && now - bobLastInput >= autoMin * 60000) {
    toast(t('settings.autoPaused'));
    togglePause();
    return;
  }
  tickBobChat(now);
  maybeAskNotifications();
  tickAwayReminder();
  if (now - bobLastInput < 180000 || now - bobLastIdle < 600000 || !G.tutorialDone) return;
  bobLastIdle = now;
  bobTell(t('bob.idle'));
}

function renderBob() {
  var bob = document.getElementById('bob');
  if (!bob) return;
  var stage = bobStage();
  if (bob.getAttribute('data-anger') !== stage) bob.setAttribute('data-anger', stage);
  renderSugar();
  // Le tutoriel change avec son humeur
  if (!G.tutorialDone && !bobTalkTimer && !introActive) renderTutorial();
}

// Une expression qui passe : 'joy' (heureux), 'wow' (surpris)
function bobMood(mood, ms) {
  var bob = document.getElementById('bob');
  if (!bob) return;
  bob.setAttribute('data-mood', mood);
  clearTimeout(bobMood._t);
  bobMood._t = setTimeout(function() { bob.removeAttribute('data-mood'); }, ms);
}

// ============ IL AIME LE SUCRE ============
// Quand il est triste, on peut lui donner un sucre en le glissant sur lui.
function bobHappy() { return !(G.bobSad > 0) && !(G.bobChoke > 0) && bobAnger() === 0; }
function bobWantsSugar() {
  return !introActive && !bobHappy() && (G.ing.sucre || 0) >= 1;
}

// Son humeur, pour le tutoriel : heureux, triste, enerve ou en train de s'etouffer
function bobMoodKind() {
  if (G.bobChoke > 0) return 'choke';
  if (G.bobSad > 0) return 'sad';
  return bobAnger() > 0 ? 'angry' : 'happy';
}

function renderSugar() {
  // Aucun bouton, aucun indice : on comprend tout seul ce qu'on peut lui donner.
  // Les classes servent seulement a pouvoir glisser ces cartes au doigt.
  document.body.classList.toggle('bob-wants-sugar', bobWantsSugar());
  document.body.classList.toggle('bob-can-wasabi', canFeedBob('wasabi'));
  document.body.classList.toggle('bob-can-gold', canFeedBob('orfeuille'));
  document.body.classList.toggle('bob-can-milk', canFeedBob('lait'));
  var bob = document.getElementById('bob');
  if (!bob) return;
  // Le wasabi ne passe pas tout seul : il faut du sucre
  var choke = String(G.bobChoke || 0), gold = String(G.bobGold || 0);
  if (bob.getAttribute('data-choke') !== choke) bob.setAttribute('data-choke', choke);
  if (bob.getAttribute('data-gold') !== gold) bob.setAttribute('data-gold', gold);
}

// Ce qu'on peut glisser sur Bob : le sucre quand il est triste, le wasabi et l'or quand on en a
var FEEDABLE = ['sucre', 'wasabi', 'orfeuille', 'lait'];
function canFeedBob(id) {
  if (introActive || (G.ing[id] || 0) < 1) return false;
  if (id === 'sucre') return bobWantsSugar();
  if (id === 'lait') return (G.bobGold || 0) > 0; // Le lait lave l'or
  return ingUnlocked(findIng(id));
}

function feedBobWith(id) {
  if (id === 'sucre') return feedBob();
  if (!canFeedBob(id)) return false;
  G.ing[id] -= 1;
  var bob = document.getElementById('bob');
  if (id === 'lait') {
    G.bobGold = 0; G.bobGoldClicks = 0;
    fxBurstOn(bob, 22, ['#FFFFFF', '#E3F2FD', '#BBDEFB'], true);
    bobMood('wow', 1500);
    bobSay(t('bob.goldOff'));
  } else if (id === 'wasabi') {
    var before = G.bobChoke || 0;
    G.bobChoke = Math.min(3, before + 1);
    G.bobChokeAt = Date.now();
    bobMood('wow', 1800);
    // Au bout du compte, il eternue si fort que le wasabi vole partout
    if (G.bobChoke === 3) { wasabiSneeze(); bobSay(t('bob.sneeze') + ' ' + pickLine('bob.wasabi3')); }
    else bobSay(pickLine('bob.wasabi' + G.bobChoke));
  } else {
    G.bobGold = Math.min(5, (G.bobGold || 0) + 1);
    if (G.bobGold >= 5 && !G.unlockedThemes.techgold) { G.unlockedThemes.techgold = true; toast(t('theme.techGoldUnlocked')); }
    fxBurstOn(bob, 18, ['#FFD54F', '#FFC107', '#FFF8E1'], true);
    bobMood('joy', 1800);
    bobSay(pickLine('bob.gold' + Math.min(3, Math.ceil(G.bobGold / 2))));
  }
  renderBob();
  renderIngredients();
  save();
  return true;
}

// L'eternuement : du wasabi plein l'ecran, qui s'en va tout seul
function wasabiSneeze() {
  var old = document.getElementById('wasabi-splash');
  if (old) old.remove();
  var layer = document.createElement('div');
  layer.id = 'wasabi-splash';
  var h = '';
  for (var i = 0; i < 26; i++) {
    var r = (i * 0.618034) % 1, r2 = (i * 0.754877) % 1;
    h += '<i style="left:' + (r * 96).toFixed(1) + '%;top:' + (r2 * 92).toFixed(1) + '%;--s:' + (40 + r2 * 110).toFixed(0) + 'px;--d:' + (r * 0.25).toFixed(2) + 's;--rot:' + Math.round(r * 360) + 'deg"></i>';
  }
  layer.innerHTML = h;
  document.body.appendChild(layer);
  if (document.body.animate && fxEnabled()) document.body.animate([{ transform: 'translate(-4px,2px)' }, { transform: 'translate(4px,-2px)' }, { transform: 'none' }], { duration: 220 });
  playSound(90, 0.35, 'sawtooth', 0, 0.12);
  setTimeout(function() { layer.classList.add('fade'); }, 2600);
  setTimeout(function() { layer.remove(); }, 4200);
}

// Vers le debut, Bob propose les notifications, une seule fois
function maybeAskNotifications() {
  if (G.notifAsked || !G.tutorialDone || G.level < 3 || introActive || typeof Notification === 'undefined') return;
  if (Notification.permission === 'denied') { G.notifAsked = true; return; }
  var overlay = document.getElementById('modal-overlay');
  if (overlay && overlay.style.display === 'flex') return;
  G.notifAsked = true;
  var h = '<div class="bob-talk">' + bobFigure() + '<div class="bob-talk-speech"><span class="bob-bubble-name">Bob</span>';
  h += '<p>' + t('bob.notifAsk') + '</p>';
  h += '<div class="bob-talk-foot"><button class="btn" onclick="askNotifications(false)">' + t('bob.notifNo') + '</button>';
  h += '<button class="btn btn-primary" onclick="askNotifications(true)">' + t('bob.notifYes') + '</button></div></div></div>';
  showModal(h, 'modal-bob');
}

function feedBob() {
  if (!bobWantsSugar()) return false;
  G.ing.sucre -= 1;
  G.sugarFed = (G.sugarFed || 0) + 1;
  var bob = document.getElementById('bob');
  var line;
  if (G.bobChoke > 0) {
    // D'abord la toux : le sucre l'adoucit, une marche a la fois
    G.bobChoke -= 1;
    line = pickLine('bob.soothe' + G.bobChoke);
    bob.classList.remove('soothe');
    void bob.offsetWidth;
    bob.classList.add('soothe');
    setTimeout(function() { bob.classList.remove('soothe'); }, 1600);
    fxBurstOn(bob, 16, ['#ffffff', '#ffd6e8', '#c8f7c5'], true);
  } else if (G.bobSad > 0) {
    // Il est de moins en moins triste, sans repasser par la colere
    G.bobSad -= 1;
    if (G.bobSad <= 0) { G.bobSad = 0; G.bobClicks = 0; }
    line = pickLine('bob.sugar' + G.bobSad);
    fxBurstOn(bob, 22, ['#fff', '#ffd60a', '#ff85ac'], true);
  } else {
    // En colere : le sucre le calme d'un cran
    G.bobClicks = Math.max(0, (G.bobClicks || 0) - 10);
    line = pickLine('bob.calmed');
    fxBurstOn(bob, 14, ['#fff', '#ffd60a'], true);
  }
  renderBob();
  bobMood('joy', 2200);
  playSuccessSound();
  bobSay(line);
  renderIngredients();
  save();
  return true;
}

(function() {
  var drag = null;

  function overBob(x, y) {
    var r = document.getElementById('bob').getBoundingClientRect();
    return x >= r.left - 14 && x <= r.right + 14 && y >= r.top - 14 && y <= r.bottom + 14;
  }

  function startGhost() {
    drag.ghost = document.createElement('div');
    drag.ghost.className = 'sugar-ghost';
    drag.ghost.innerHTML = iconify(findIng(drag.ing).e);
    document.body.appendChild(drag.ghost);
    document.body.classList.add('dragging-sugar');
  }

  document.addEventListener('pointerdown', function(e) {
    if (!e.target.closest || e.target.closest('button')) return;
    var token = null;
    // Depuis la carte de l'ingredient, a la souris comme au doigt
    var card = e.target.closest('.ing-card');
    var ing = card && card.getAttribute('data-ing');
    if (!card || FEEDABLE.indexOf(ing) < 0 || !canFeedBob(ing)) return;
    drag = { x: e.clientX, y: e.clientY, ghost: null, token: false, ing: ing };
    if (card && e.pointerType !== 'mouse') {
      try { card.setPointerCapture(e.pointerId); } catch (err) { /* pas grave */ }
    }
    if (token) {
      e.preventDefault();
      // Le doigt reste accroche au sucre meme en sortant du bouton
      try { token.setPointerCapture(e.pointerId); } catch (err) { /* pas grave */ }
    }
  });

  document.addEventListener('pointermove', function(e) {
    if (!drag) return;
    if (!drag.ghost) {
      if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) < 6) return;
      startGhost();
    }
    drag.ghost.style.left = e.clientX + 'px';
    drag.ghost.style.top = e.clientY + 'px';
    document.getElementById('bob').classList.toggle('wants-sugar', overBob(e.clientX, e.clientY));
  });

  // Sur iOS, sans ca, la page bouge pendant qu'on glisse le sucre
  document.addEventListener('touchmove', function(e) {
    if (drag) e.preventDefault();
  }, { passive: false });

  function endDrag(e) {
    if (!drag) return;
    var was = drag;
    drag = null;
    if (!was.ghost) {
      // Un simple toucher sur le morceau de sucre le donne aussi
      if (was.token && e.type === 'pointerup') feedBob();
      return;
    }
    was.ghost.remove();
    document.body.classList.remove('dragging-sugar');
    document.getElementById('bob').classList.remove('wants-sugar');
    if (e.type === 'pointerup' && overBob(e.clientX, e.clientY)) feedBobWith(was.ing);
    // Le clic qui suit ce glisser ne doit pas acheter de sucre, ni embeter Bob
    var stop = function(ev) { ev.stopPropagation(); ev.preventDefault(); };
    document.addEventListener('click', stop, { capture: true, once: true });
    setTimeout(function() { document.removeEventListener('click', stop, true); }, 80);
  }
  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', endDrag);

  // Ses yeux suivent la souris
  document.addEventListener('pointermove', function(e) {
    var bob = document.getElementById('bob');
    if (!bob || !fxEnabled()) return;
    var r = bob.getBoundingClientRect();
    var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 3);
    var d = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    bob.style.setProperty('--look-x', (dx / d * Math.min(4, d / 60)).toFixed(1) + 'px');
    bob.style.setProperty('--look-y', (dy / d * Math.min(3, d / 60)).toFixed(1) + 'px');
  }, { passive: true });
})();

function pickLine(key) {
  var lines = t(key).split('|');
  return lines[Math.floor(Math.random() * lines.length)];
}

function bobPoke() {
  var bob = document.getElementById('bob');
  if (!G.cheatUnlocked) {
    G.bobPokes = (G.bobPokes || 0) + 1;
    if (G.bobPokes >= TECH_CLICKS && !G.unlockedThemes.tech) { G.unlockedThemes.tech = true; toast(t('theme.techUnlocked')); save(); }
    // En or massif, il est de trop bonne humeur : il donne l'acces tout de suite
    if ((G.bobGold || 0) >= 5) {
      bobMood('joy', 1500);
      fxBurstOn(bob, 20, ['#FFD54F', '#FFC107', '#FFF8E1'], true);
      bobSay(t('bob.goldGive'));
      setTimeout(showAdminPopup, 1200);
      return;
    }
  }
  // Il tousse : il s'enerve, mais sans pouvoir aller jusqu'au bout
  if (G.bobChoke > 0 && !G.cheatUnlocked && !(G.bobSad > 0)) {
    G.bobClicks = Math.min(39, (G.bobClicks || 0) + 1);
    renderBob();
    fxBump(bob, 1.06);
    playSound(200, 0.1, 'square', 0, 0.06);
    if (G.bobClicks % 3 === 1) bobSay(pickLine('bob.chokeAngry'));
    return;
  }
  var anger = bobAnger();
  if (anger === 0 && !G.cheatUnlocked) bobMood('wow', 500);
  if (anger === 5) {
    fxBump(bob, 1.03);
    playSound(150, 0.2, 'sine');
    if (G.cheatUnlocked) {
      bobSay(pickLine('bob.sour'));
    } else {
      bobSay(t('bob.needcode'));
      showAdminPopup();
    }
    return;
  }
  if (G.cheatUnlocked) {
    bobSay(t('bob.calm'));
    fxBump(bob, 1.08);
    return;
  }
  G.bobClicks = (G.bobClicks || 0) + 1;
  var after = bobAnger();
  renderBob();
  fxBump(bob, 1.05 + after * 0.04);
  playSound(260 + after * 120, 0.08, after >= 2 ? 'sawtooth' : 'square', 0, 0.08);
  if (after === 5) {
    G.bobSad = 4;
    bobSay(t('bob.giveup'));
    fxBurstOn(bob, 40, ['#8fa36b', '#6d7f50', '#c9c9a6'], false);
    checkAchievements();
    setTimeout(showAdminPopup, 1600);
    return;
  }
  if (after >= 4) {
    // A la fin, c'est tout l'ecran qui tremble
    if (document.body.animate && fxEnabled()) {
      document.body.animate([{ transform: 'translate(-3px,1px)' }, { transform: 'translate(3px,-1px)' }, { transform: 'none' }], { duration: 160 });
    }
    fxBurstOn(bob, 10, ['#ff3b1f', '#ff9800', '#ffd600']);
  }
  if (after !== anger) fxBurstOn(bob, 12 + after * 8, ['#ff5a3c', '#ffb300', '#ffffff']);
  // Une nouvelle phrase de temps en temps, pas a chaque clic
  if (after !== anger || G.bobClicks % 3 === 1) bobSay(pickLine('bob.p' + after));
}

// ============ CODE DE LA CONSOLE ============
function showAdminPopup() {
  var existing = document.getElementById('admin-popup');
  if (existing) existing.remove();
  var div = document.createElement('div');
  div.id = 'admin-popup';
  div.className = 'admin-popup';
  div.innerHTML = '<h3>' + t('settings.cheatCode') + '</h3>' +
    '<input type="password" id="admin-code-input" placeholder="' + escH(t('settings.cheatPlaceholder')) + '" onkeydown="if(event.key===\'Enter\')tryAdminCode()">' +
    '<div><button onclick="tryAdminCode()">OK</button><button class="cancel-btn" onclick="this.parentNode.parentNode.remove()">X</button></div>';
  document.body.appendChild(div);
  setTimeout(function() { var inp = document.getElementById('admin-code-input'); if (inp) inp.focus(); }, 100);
}

// Le code n'est pas ecrit en clair dans le fichier
function codeHash(str) {
  var h = 0;
  for (var i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return h;
}

function tryAdminCode() {
  var input = document.getElementById('admin-code-input');
  if (input && codeHash(input.value) === -1867378635) {
    G.cheatUnlocked = true;
    save();
    toast(t('settings.cheatUnlocked'));
    document.getElementById('admin-popup').remove();
    renderConsoleButton();
    renderBob();
    bobSay(t('bob.unlocked'));
  } else {
    toast(t('settings.cheatWrong'));
    playErrorSound();
  }
}

// ============ LE DEFI DE BOB ============
// Tous les 2 a 5 jours, Bob propose un defi. Recompense : 5 % de tout ton argent.
function challengeText(ch) {
  var v = ch.type === 'earned' ? fmtMoney(ch.target) : fmt(ch.target);
  return t('chal.' + ch.type, { v: v });
}

function offerChallenge() {
  var ch = createChallenge();
  var h = '<div class="bob-talk">' + bobFigure() + '<div class="bob-talk-speech"><span class="bob-bubble-name">Bob</span>';
  h += '<p>' + t('bob.challengeHello', { d: challengeText(ch), v: fmtMoney(globalMoney() * CHALLENGE_REWARD) }) + '</p>';
  h += '<div class="bob-talk-foot"><button class="btn" onclick="declineChallenge()">' + t('bob.challengeNo') + '</button>';
  h += '<button class="btn btn-primary" onclick="acceptChallenge()">' + t('bob.challengeYes') + '</button></div></div></div>';
  showModal(h, 'modal-bob');
}

function acceptChallenge() {
  if (G.challenge) G.challenge.accepted = true;
  hideModal();
  renderHeader();
  bobMood('joy', 1500);
}

function declineChallenge() {
  G.challenge = null;
  scheduleNextChallenge();
  hideModal();
  bobSay(t('bob.challengeNoLine'));
}

function challengeBanner() {
  var ch = G.challenge;
  var done = challengeProgress();
  var pct = Math.min(100, done / ch.target * 100);
  var left = Math.max(0, (ch.expiresAt - Date.now()) / 1000);
  var shown = ch.type === 'earned' ? fmtMoney(done) + ' / ' + fmtMoney(ch.target) : fmt(done) + ' / ' + fmt(ch.target);
  return '<div class="challenge-banner"><span>' + t('chal.banner') + ' : ' + challengeText(ch) + '</span><span class="challenge-bar"><i style="width:' + pct.toFixed(1) + '%"></i></span><span>' + shown + ' · ' + fmtTime(left) + '</span></div>';
}

function tickChallenge() {
  if (!G.introDone || !G.tutorialDone) return;
  var now = Date.now();
  if (!G.nextChallengeAt) { scheduleNextChallenge(); return; }
  if (G.challenge && G.challenge.accepted) {
    if (challengeProgress() >= G.challenge.target) {
      var reward = completeChallenge();
      bobMood('joy', 2500);
      bobSay(t('bob.challengeWin', { v: fmtMoney(reward) }));
      playFanfare();
      fxBurstOn(document.querySelector('.money-display'), 40, null, true);
    } else if (now > G.challenge.expiresAt) {
      G.challenge = null;
      scheduleNextChallenge();
      bobSay(t('bob.challengeLost'));
    }
    return;
  }
  // Bob ne te propose rien s'il est fache
  if (!G.challenge && now >= G.nextChallengeAt && !modalIsOpen() && bobAnger() < 4) offerChallenge();
}

// ============ SES CONSEILS ============
// Bob dit ce qu'il remarque, tout simplement.
function adviceText(a) {
  if (a.kind === 'order') return t('adv.order', { n: escH(a.n), t: fmtTime(Math.max(0, a.t)) });
  if (a.kind === 'empStrike' || a.kind === 'empSoon') return t('adv.' + a.kind, { n: escH(a.n) });
  if (a.kind === 'slow') return t('adv.slow', { n: recShortName(a.rec), v: a.v });
  return t('adv.' + a.kind, { v: a.v });
}

var bobSeen = {};
var bobLastAlert = 0;

function tickBobWatch() {
  if (!G.introDone || !G.tutorialDone || bobTalkTimer) return;
  var now = Date.now();
  if (now - bobLastAlert < 15000) return;
  var list = bobAdvice();
  for (var i = 0; i < list.length; i++) {
    var a = list[i];
    // Ce qui presse : une fois. Le reste : au plus toutes les 5 minutes.
    if (bobSeen[a.key] && (a.urgent || now - bobSeen[a.key] < 300000)) continue;
    bobSeen[a.key] = now;
    bobLastAlert = now;
    bobTell(adviceText(a));
    return;
  }
}
