/* ============================================
   PATISSERIE 2D SIMULATOR - MAIN LOOP
   Initialization, game loop, offline, events,
   applicants, crypto, pause, game over
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // 1. Load saved game
  load();

  // 1b. Check if desktop app is running for save sync
  if (typeof checkDesktopSync === 'function') checkDesktopSync();

  // 2. Apply saved settings
  if (G.settings && G.settings.lang) setLanguage(G.settings.lang);
  applyTheme();

  // 3. Check offline progression BEFORE first render
  if (G.lastTick) {
    var elapsed = (Date.now() - G.lastTick) / 1000;
    if (elapsed > 60) {
      var result = calcOfflineProgress(elapsed);
      // Show offline modal after render
      setTimeout(function() {
        showOfflineModal(result);
      }, 500);
    }
  }

  // 4. Initial full render
  fullRender();

  // 5. Tutorial check: first launch
  if (G.level <= 1 && G.stats.totalClicks === 0 && !G.tutorialDone) {
    G.tutorialStep = 0;
    setTimeout(function() { renderTutorial(); }, 800);
  }

  // 5b. Birthday check
  if (!G.birthday) {
    setTimeout(function() { showBirthdayModal(); }, 1200);
  } else if (isBirthdayToday()) {
    if (!G.birthdayBoostUntil || Date.now() >= G.birthdayBoostUntil) {
      activateBirthdayBoost();
      setTheme('anniversaire');
      setTimeout(function() { toast(t('birthday.boost')); }, 1000);
    }
  }

  // 6. Game over check on load
  if (G.gameOver) {
    setTimeout(function() { showGameOverModal(); }, 300);
  }

  // 7. Track play time
  var lastTick = Date.now();

  // 8. Main game loop (every 1 second)
  setInterval(function() {
    if (G.paused) return;
    if (G.gameOver) return;

    var now = Date.now();
    var dtMs = now - lastTick;
    var dtSec = dtMs / 1000;
    lastTick = now;

    // Update play time
    G.playTimeMs += dtMs;

    // Tick all systems
    tickAutoCollect(dtSec);
    tickEmployees(dtSec);
    tickRent(dtSec);
    var craftFinished = tickCrafting();
    checkAchievements();
    tickEvents();

    // Cap money at Centillion
    capMoney();

    // Check space overflow
    checkSpaceOverflow();

    // Remove expired applicants
    removeExpiredApplicants();

    // Game over check
    if (checkGameOver()) {
      showGameOverModal();
      return;
    }

    // Refresh display
    renderIngredients();
    renderCraftingBar();
    renderHeader();
    renderSpaceBar();

    // If crafting finished or sell tab, refresh panel
    if (craftFinished || currentTab === 'sell' || currentTab === 'emp') {
      renderMainPanel();
    }
  }, 1000);

  // 9. Auto-save every 30 seconds
  setInterval(function() {
    save();
  }, 30000);

  // 10. Fast UI refresh (250ms for smooth auto-collection)
  setInterval(function() {
    if (G.paused || G.gameOver) return;
    renderIngredients();
    renderCraftingBar();
  }, 250);

  // 11. Applicant generation (every 30-60 seconds)
  setInterval(function() {
    if (G.paused || G.gameOver) return;
    if (G.level >= 5 && Math.random() < 0.4) {
      generateApplicant();
      if (currentTab === 'emp') renderEmployees();
      renderTabs();
    }
  }, 30000);

  // 12. Save on page unload
  window.addEventListener('beforeunload', function() {
    save();
  });

});
