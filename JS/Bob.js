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
  var steps = [t('tuto.step1'), t('tuto.step2'), t('tuto.step3'), t('tuto.step4'), t('tuto.done')];
  var btn = G.tutorialStep === 4
    ? '<button class="btn btn-small btn-primary" onclick="skipTutorial()">' + t('tuto.ok') + '</button>'
    : '<button class="btn btn-small" onclick="skipTutorial()">' + t('tuto.skip') + '</button>';
  showBobBubble(steps[G.tutorialStep], btn);
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
function bobSay(msg) {
  if (bobTalkTimer) clearTimeout(bobTalkTimer);
  bobTalkTimer = null;
  bobBubbleText = null;
  showBobBubble(msg);
  bobTalkTimer = setTimeout(function() {
    bobTalkTimer = null;
    hideBobBubble();
    renderTutorial();
  }, 2800);
}

// ============ SA COLERE ============
var BOB_CLICKS_NEEDED = 50;

// 0 calme, 1 agace, 2 enerve, 3 furieux, 4 fou de rage, 5 aigri (pour toujours)
function bobAnger() {
  var c = G.bobClicks || 0;
  if (c >= BOB_CLICKS_NEEDED) return 5;
  if (G.cheatUnlocked) return 0;
  if (c >= 40) return 4;
  if (c >= 30) return 3;
  if (c >= 20) return 2;
  if (c >= 10) return 1;
  return 0;
}

function renderBob() {
  var bob = document.getElementById('bob');
  if (bob) bob.setAttribute('data-anger', bobAnger());
}

function pickLine(key) {
  var lines = t(key).split('|');
  return lines[Math.floor(Math.random() * lines.length)];
}

function bobPoke() {
  var bob = document.getElementById('bob');
  var anger = bobAnger();
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
