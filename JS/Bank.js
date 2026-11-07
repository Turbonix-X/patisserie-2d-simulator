/* ============================================
   PATISSERIE 2D SIMULATOR - LA BANQUE
   L'onglet s'ouvre a ta premiere dette : Bob te
   cree un compte et t'explique ce qu'est un pret.
   ============================================ */

// ============ BOB QUI PARLE EN GRAND ============
function bobFigure() {
  var svg = document.querySelector('#bob svg');
  return '<div class="bob-talk-figure bob-fig" data-anger="' + bobStage() + '">' + (svg ? svg.outerHTML : '') + '</div>';
}

// Plusieurs repliques a la suite, puis une action
var bobDialog = null;

function showBobDialog(lines, lastLabel, onDone) {
  bobDialog = { lines: bobFilterLines(lines), i: 0, lastLabel: lastLabel, onDone: onDone };
  renderBobDialog();
}

function renderBobDialog() {
  var d = bobDialog;
  if (!d) return;
  var last = d.i >= d.lines.length - 1;
  var h = '<div class="bob-talk">' + bobFigure();
  h += '<div class="bob-talk-speech"><span class="bob-bubble-name">Bob</span>';
  h += '<p>' + d.lines[d.i] + '</p>';
  h += '<div class="bob-talk-foot"><span class="bob-talk-steps">' + (d.i + 1) + ' / ' + d.lines.length + '</span>';
  h += '<button class="btn btn-primary" onclick="bobDialogNext()">' + (last ? d.lastLabel : t('common.next')) + '</button></div>';
  h += '</div></div>';
  showModal(h, 'modal-bob');
}

function bobDialogNext() {
  var d = bobDialog;
  if (!d) return;
  if (d.i < d.lines.length - 1) {
    d.i++;
    renderBobDialog();
    return;
  }
  bobDialog = null;
  hideModal();
  if (d.onDone) d.onDone();
}

// ============ PREMIERE DETTE ============
function modalIsOpen() {
  var el = document.getElementById('modal-overlay');
  return !!el && el.style.display === 'flex';
}

var BOB_DEBT_GIFT = 50;

// A appeler a chaque seconde de jeu
function checkFirstDebt() {
  if (G.bankUnlocked || G.rentDebt <= 0 || modalIsOpen()) return;
  G.bankUnlocked = true;
  G.money += BOB_DEBT_GIFT; // Bob met la main a la poche
  renderTabs();
  renderHeader();
  save();
  showBankExplanation(true);
}

function showBankExplanation(firstTime) {
  var lines = [];
  if (firstTime) lines.push(t('bank.bobDebt', { v: fmtMoney(G.rentDebt) }) + ' ' + t('bob.debtBonus', { v: fmtMoney(BOB_DEBT_GIFT) }));
  lines.push(t('bank.bobLoan'));
  lines.push(t('bank.bobInterest', { a: fmtMoney(100), b: fmtMoney(110) }));
  lines.push(t('bank.bobAdvice'));
  showBobDialog(lines, t('bank.bobGo'), function() { switchTab('bank'); });
}

// ============ L'ONGLET ============
function renderBank() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  var due = totalLoanDue();
  var h = '<div class="panel-head"><h2>' + t('bank.title') + '</h2>';
  h += '<button class="chip" onclick="showBankExplanation(false)">' + t('bank.whatIs') + '</button></div>';

  h += '<div class="bank-summary">';
  h += bankTile(t('bank.balance'), fmtMoney(G.money));
  h += bankTile(t('bank.toRepay'), fmtMoney(due));
  h += bankTile(t('bank.perMin'), due > 0 ? fmtMoney(loanPerSec() * 60) : fmtMoney(0));
  h += bankTile(t('bank.rentDebt'), fmtMoney(G.rentDebt), G.rentDebt > 0);
  h += '</div>';

  if (G.loans.length > 0) {
    h += '<h3 class="bank-h">' + t('bank.active') + '</h3><div class="loan-active-list">';
    G.loans.forEach(function(l) {
      var pct = Math.max(0, Math.min(100, (1 - l.remaining / l.total) * 100));
      h += '<div class="loan-active' + (l.late ? ' late' : '') + '">';
      h += '<div class="loan-active-top"><b>' + t('bank.loanOf', { v: fmtLoan(l.amount) }) + '</b>';
      h += '<span>' + t('bank.remaining', { v: fmtMoney(l.remaining) }) + '</span></div>';
      h += '<div class="loan-bar" role="progressbar" aria-valuenow="' + Math.floor(pct) + '" aria-valuemin="0" aria-valuemax="100"><div style="width:' + pct.toFixed(1) + '%"></div></div>';
      h += '<div class="loan-active-foot"><span>' + (l.late ? t('bank.late') : t('bank.autoPay', { v: fmtMoney(l.perSec * 60) })) + '</span>';
      var payoff = loanPayoff(l);
      h += '<button class="btn btn-small btn-primary" onclick="doRepayLoan(' + l.id + ')"' + (G.money < payoff ? ' disabled' : '') + '>' + t('bank.repayNow', { v: fmtMoney(payoff) }) + '</button></div>';
      if (l.remaining - payoff >= 0.01) h += '<div class="loan-saving">' + t('bank.saving', { v: fmtMoney(l.remaining - payoff) }) + '</div>';
      h += '</div>';
    });
    h += '</div>';
  }

  h += '<h3 class="bank-h">' + t('bank.offers') + '</h3><div class="loan-grid">';
  LOANS.forEach(function(offer) {
    var active = hasLoan(offer.amount);
    var locked = !loanUnlocked(offer);
    h += '<div class="loan-card' + (active ? ' taken' : '') + (locked ? ' locked' : '') + '">';
    h += '<div class="loan-amount">' + fmtLoan(offer.amount) + '</div>';
    h += '<dl><div><dt>' + t('bank.rate') + '</dt><dd>' + Math.round(offer.rate * 100) + ' %</dd></div>';
    h += '<div><dt>' + t('bank.repay') + '</dt><dd>' + fmtLoan(offer.amount * (1 + offer.rate)) + '</dd></div>';
    h += '<div><dt>' + t('bank.during') + '</dt><dd>' + t('bank.minutes', { v: offer.minutes }) + '</dd></div></dl>';
    if (locked) h += '<div class="loan-lock">\u{1F512} ' + t('bank.levelReq', { v: offer.minLvl }) + '</div>';
    else h += '<button class="btn btn-small' + (active ? '' : ' btn-primary') + '" onclick="doTakeLoan(' + offer.amount + ')"' + (active ? ' disabled' : '') + '>' + (active ? t('bank.inProgress') : t('bank.borrow')) + '</button>';
    h += '</div>';
  });
  h += '</div><p class="hint-note">' + t('bank.oneEach') + ' ' + t('bank.limitHelp') + '</p>';
  setHTML(el, h);
}

// Les montants de la banque s'affichent en entier : 10 000 €, pas 10.0k€
function fmtLoan(amount) {
  var curr = CURRENCIES[0];
  CURRENCIES.forEach(function(c) { if (c.id === G.settings.currency) curr = c; });
  return (amount * curr.rate).toLocaleString(currentLang === 'fr' ? 'fr-FR' : currentLang === 'es' ? 'es-ES' : 'en-US', { maximumFractionDigits: 2 }) + curr.symbol;
}

function bankTile(label, value, alert) {
  return '<div class="bank-tile' + (alert ? ' alert' : '') + '"><span>' + label + '</span><b>' + value + '</b></div>';
}

function doTakeLoan(amount) {
  if (takeLoan(amount)) {
    toast(t('bank.taken', { v: fmtLoan(amount) }));
    playSellSound();
    showFloatingMoney(amount, document.querySelector('.bank-summary'));
    renderBank();
    renderHeader();
    renderIngredients();
  }
}

function doRepayLoan(id) {
  if (repayLoan(id)) {
    toast(t('bank.repaid'));
    playSuccessSound();
    renderBank();
    renderHeader();
  } else {
    toast(t('ing.noMoney'));
    playErrorSound();
  }
}
