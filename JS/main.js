/* ============================================
   PATISSERIE 2D SIMULATOR - BOUCLE PRINCIPALE
   Demarrage, boucle de jeu, sauvegarde auto
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  load();
  checkDesktopSync();

  currentLang = LANGS[G.settings.lang] ? G.settings.lang : detectLang();
  G.settings.lang = currentLang;
  document.documentElement.lang = currentLang;

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
      result.money += offlineBackgroundBakeries(elapsed);
      setTimeout(function() { showOfflineModal(result); }, 500);
    }
  }

  fullRender();

  if (loadNotice) setTimeout(function() { toast(t('offline.' + loadNotice)); }, 800);

  // Premiere partie : Bob t'accueille
  if (!G.introDone) {
    showIntro();
  } else if (!G.tutorialDone) {
    renderTutorial();
  }

  if (tryBirthdayBoost()) setTimeout(function() { toast(t('birthday.boost')); }, 1000);

  if (G.gameOver) setTimeout(function() { showGameOverModal(); }, 300);

  armMusicAutostart();

  var lastTick = Date.now();
  var totalsCounter = 0;

  // Boucle de jeu (chaque seconde)
  setInterval(function() {
    // En pause ou pendant l'intro, le temps ne s'accumule pas
    if (G.paused || introActive) { lastTick = Date.now(); return; }
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

    tickAutoCollect(dtSec);
    tickEmployees(dtSec);
    tickRent(dtSec);
    tickLoans(dtSec);
    tickOrders(dtSec);
    tickBackgroundBakeries(dtSec);
    recoverDemand(dtSec);
    tickCrafting();
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

  // Affichage fluide
  setInterval(function() {
    if (G.paused || G.gameOver || introActive) return;
    renderIngredients();
    renderCraftingBar();
    renderMainPanel();
  }, 250);

  // Candidatures (une toutes les minutes environ)
  setInterval(function() {
    if (G.paused || G.gameOver || introActive) return;
    if (G.level >= 5 && Math.random() < 0.5) {
      generateApplicant();
      renderTabs();
    }
  }, 30000);

  window.addEventListener('beforeunload', function() {
    if (!skipSaveOnUnload) save();
  });
});
