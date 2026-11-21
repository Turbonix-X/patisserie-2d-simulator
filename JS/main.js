/* ============================================
   PATISSERIE 2D SIMULATOR - BOUCLE PRINCIPALE
   Demarrage, boucle de jeu, sauvegarde auto
   ============================================ */

// Telephone : taper vite ne doit ni zoomer ni recharger la page
['gesturestart', 'gesturechange', 'dblclick'].forEach(function(ev) {
  document.addEventListener(ev, function(e) { e.preventDefault(); }, { passive: false });
});

// La page d'accueil choisit la partie, puis lance le jeu
function bootGame() {
  var homeEl = document.getElementById('home');
  if (homeEl) homeEl.style.display = 'none';
  document.body.classList.remove('home-open');

  load();
  if (typeof applyInstanceType === 'function') applyInstanceType();
  checkDesktopSync();

  currentLang = LANGS[G.settings.lang] ? G.settings.lang : detectLang();
  G.settings.lang = currentLang;
  applyLangDir();

  // Un theme de saison s'arrete avec la saison, sauf s'il est debloque pour toujours
  enforceThemeLocks();
  applyTheme();

  // Gains d'absence
  if (G.paused) {
    // Partie sauvegardee en pause : pas de gains, et la fenetre de pause revient
    if (!G.pausedAt) G.pausedAt = G.lastTick || Date.now();
    setTimeout(function() { showPauseModal(); }, 300);
  } else if (G.introDone && G.lastTick) {
    var elapsed = (Date.now() - G.lastTick) / 1000;
    if (elapsed > 60) {
      var result = calcOfflineProgress(elapsed);
      result.bakeries = [result].concat(offlineBackgroundBakeries(elapsed));   // un resultat par patisserie
      result.money = result.bakeries.reduce(function(a, r) { return a + r.money; }, 0);
      setTimeout(function() { showOfflineModal(result); }, 500);
    }
  }

  fullRender();
  if (typeof initSplit === 'function') initSplit();
  if (typeof claimTabLock === 'function') claimTabLock();

  if (loadNotice) setTimeout(function() { toast(t('offline.' + loadNotice)); }, 800);

  // Premiere partie : Bob t'accueille
  if (!G.introDone) {
    showIntro();
  } else if (!G.bakeryName) {
    setTimeout(showFirstBakeryName, 800);
  } else if (!G.tutorialDone) {
    renderTutorial();
  }

  if (tryBirthdayBoost()) setTimeout(function() { toast(t('birthday.boost')); }, 1000);

  if (G.gameOver) setTimeout(function() { showGameOverModal(); }, 300);

  armMusicAutostart();
  if (typeof changelogPrefetch === 'function') changelogPrefetch();
  if (typeof cloudPresence === 'function') cloudPresence('playing');

  var lastTick = Date.now();
  var totalsCounter = 0;

  // Boucle de jeu (chaque seconde)
  setInterval(function() {
    // En pause ou pendant l'intro, le temps ne s'accumule pas
    if (G.paused || introActive || menuPause.on || softPause.on) { lastTick = Date.now(); return; }
    if (G.gameOver) return;

    var now = Date.now();
    var speed = G.timeSpeed || 1;
    var dtMs = (now - lastTick) * speed;
    var dtSec = dtMs / 1000;
    if (speed !== 1) {
      // /time accelere aussi les fours
      shiftGameTimers(-(now - lastTick) * (speed - 1));
      shiftAllBakeries(-(now - lastTick) * (speed - 1));
    }
    lastTick = now;

    G.playTimeMs += dtMs;

    tickBakeryWork(dtSec, true);
    tickLoans(dtSec);
    tickBackgroundBakeries(dtSec);
    tickCreative();
    tickInfinite();
    tickBreakdowns(dtSec);
    tickCarriers(dtSec);
    recordHistory();
    checkAchievements();
    // Les totaux de toutes les patisseries comptent aussi pour les succes
    if (G.bakeries.length >= 2 && ++totalsCounter % 10 === 0) checkAchievements(allBakeriesState());
    tickEvents();
    capMoney();
    removeExpiredApplicants();

    if (checkGameOver()) {
      checkAchievements();
      showGameOverModal();
      return;
    }

    checkFirstDebt();
    tickChallenge();
    tickBobWatch();
    tickIdle();
    if (document.getElementById('stats-pane')) refreshStatsPane();
    renderBob();
    // La saison a change pendant que tu jouais ?
    if (totalsCounter % 30 === 0 && enforceThemeLocks()) {
      applyTheme();
      fullRender();
      toast(t('settings.themeEnded'));
    }
    renderHeader();
    renderSpaceBar();
    renderTabs();
    tutorialCheck();
  }, 1000);

  // Sauvegarde automatique
  setInterval(save, 30000);
  setInterval(autoBackupTick, 20000);

  // Affichage fluide
  // Pour que ca ne lague pas : on ne dessine rien quand l'onglet est cache ou qu'une fenetre est ouverte,
  // et les ingredients et le panneau se redessinent un tour sur deux
  var fastTick = 0;
  setInterval(function() {
    tickSoftPause();
    if (G.paused || G.gameOver || introActive || menuPause.on) return;
    tickMoveLabels();
    if (document.hidden) return;
    var ov = document.getElementById('modal-overlay');
    if (ov && ov.style.display === 'flex' && !softPause.on) return;
    fastTick++;
    tickSalesUI();
    renderCraftingBar();
    if (fastTick % 2) renderIngredients(); else renderMainPanel();
  }, 250);

  // Candidatures (une toutes les minutes environ)
  setInterval(function() {
    if (G.paused || G.gameOver || introActive || menuPause.on || softPause.on) return;
    // Peu de candidats au debut, de plus en plus ensuite
    if (G.level >= 5 && Math.random() < applicantChance()) {
      generateApplicant();
      renderTabs();
    }
  }, 30000);

  window.addEventListener('beforeunload', function() {
    if (!skipSaveOnUnload && CUR.inst !== null) save();
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Une mise a jour a chaud reprend la partie en cours, sinon on commence par la page d'accueil
  var resume = null;
  try { resume = JSON.parse(sessionStorage.getItem('p2ds_resume')); sessionStorage.removeItem('p2ds_resume'); } catch (e) { resume = null; }
  if (resume && resume.inst) { CUR.profile = resume.profile; CUR.inst = resume.inst; bootGame(); }
  else if (typeof showHome === 'function') showHome();
  else bootGame();
});
