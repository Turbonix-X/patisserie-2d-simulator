/* ============================================
   PATISSERIE 2D SIMULATOR - SUCCES
   Des centaines de succes, en series, plus 5 secrets.
   Chaque succes augmente un peu les prix de vente.
   ============================================ */

var ACH_CATEGORIES = ['general', 'cakes', 'money', 'level', 'shop', 'recipes', 'buildings', 'stock', 'secret'];
var ACHIEVEMENTS = [];

// tier : [seuil, nom fr, nom en, ..., nom es a la fin]
function tierName(tier) {
  if (currentLang === 'en') return tier[2];
  if (currentLang === 'es') return tier[tier.length - 1];
  return tier[1];
}

(function() {
  function add(id, cat, icon, fr, en, descFr, descEn, check, hidden) {
    ACHIEVEMENTS.push({ id: id, cat: cat, icon: icon, fr: fr, en: en, descFr: descFr, descEn: descEn, check: check, hidden: !!hidden });
  }

  // Une serie : [seuil, id, icone, nom fr, nom en]
  function series(cat, list, value, descFr, descEn) {
    list.forEach(function(s) {
      var n = fmt(s[0]);
      add(s[1], cat, s[2], s[3], s[4], descFr.replace('{n}', n), descEn.replace('{n}', n), function(g) { return value(g) >= s[0]; });
    });
  }

  // ---------- Clics ----------
  series('general', [
    [1, 'first_click', '\u{1F446}', 'Premier clic', 'First click'],
    [100, 'click100', '\u{1F5B1}️', 'Doigt d’apprenti', 'Apprentice finger'],
    [1000, 'click1000', '\u{1F92F}', 'Cliqueur fou', 'Mad clicker'],
    [10000, 'click10000', '\u{1F3C6}', 'Tendinite gourmande', 'Tasty tendonitis'],
    [100000, 'click100k', '\u{1F4A5}', 'Méga cliqueur', 'Mega clicker'],
    [1000000, 'click1m', '\u{1F525}', 'La souris a pris feu', 'The mouse caught fire'],
    [10000000, 'click10m', '\u{1F47B}', 'Fantôme du clic', 'Ghost of the click'],
  ], function(g) { return g.stats.totalClicks; }, 'Faire {n} achats d’ingrédients.', 'Make {n} ingredient purchases.');

  // ---------- Gateaux prepares ----------
  series('cakes', [
    [1, 'first_cake', '\u{1F36A}', 'Premier gâteau', 'First cake'],
    [10, 'cake10', '\u{1F9C1}', 'Apprenti', 'Apprentice'],
    [50, 'cake50', '\u{1F382}', 'Confirmé', 'Skilled'],
    [200, 'cake200', '\u{1F468}‍\u{1F373}', 'Maître', 'Master'],
    [1000, 'cake1000', '⭐', 'Chef étoilé', 'Star chef'],
    [10000, 'cake10000', '\u{1F31F}', 'Légendaire', 'Legendary'],
    [100000, 'cake100k', '\u{1F4AB}', 'Usine à douceurs', 'Sweet factory'],
    [1000000, 'cake1m', '\u{1F308}', 'Un million de sourires', 'A million smiles'],
    [10000000, 'cake10m', '\u{1F30D}', 'La planète a du sucre partout', 'Sugar all over the planet'],
    [100000000, 'cake100m', '\u{1FA90}', 'Système solaire sucré', 'Sugary solar system'],
    [1000000000, 'cake1b', '\u{1F300}', 'Galaxie de crème', 'Cream galaxy'],
  ], function(g) { return g.stats.totalCakesMade; }, 'Préparer {n} pièces.', 'Bake {n} pieces.');

  series('cakes', [
    [1, 'first_sell', '\u{1F4B6}', 'Premier client', 'First customer'],
    [50, 'sell50', '\u{1F3EA}', 'Vendeur', 'Seller'],
    [500, 'sell500', '\u{1F3EC}', 'Pro de la vitrine', 'Window pro'],
    [5000, 'sell5000', '\u{1F3E2}', 'Magnat', 'Tycoon'],
    [50000, 'sell50k', '\u{1F3F0}', 'Le quartier fait la queue', 'The whole block is queuing'],
    [500000, 'sell500k', '\u{1F451}', 'Fournisseur de la Cour', 'Royal supplier'],
    [5000000, 'sell5m', '\u{1F30D}', 'Export mondial', 'Worldwide export'],
    [50000000, 'sell50m', '\u{1FA90}', 'Livraison sur Mars', 'Delivery to Mars'],
    [500000000, 'sell500m', '♾️', 'Plus personne n’a faim', 'Nobody is hungry anymore'],
  ], function(g) { return g.stats.totalSold; }, 'Vendre {n} pièces.', 'Sell {n} pieces.');

  // ---------- Argent gagne ----------
  var earned = [
    [100, 'earn100', 'Argent de poche', 'Pocket money'], [1000, 'earn1000', 'Mille euros, mille mercis', 'A thousand thanks'],
    [1e4, 'earn10k', 'Tirelire pleine', 'Full piggy bank'], [1e5, 'earn100k', 'Petit commerce', 'Small business'],
    [1e6, 'earn1m', 'Millionnaire', 'Millionaire'], [1e7, 'earn10m', 'Multimillionnaire', 'Multimillionaire'],
    [1e8, 'earn100m', 'Beurre dans les épinards', 'Bringing home the butter'], [1e9, 'earn1b', 'Milliardaire', 'Billionaire'],
    [1e10, 'earn10b', 'Pièce montée de billets', 'Tower of banknotes'], [1e11, 'earn100b', 'Coffre-fort à la crème', 'Cream-filled vault'],
    [1e12, 'earn1t', 'Billionnaire', 'Trillionaire'], [1e13, 'earn10t', 'Pâte à billets', 'Money dough'],
    [1e14, 'earn100t', 'Le sucre, c’est l’or', 'Sugar is gold'], [1e15, 'earn1qa', 'Billiardaire', 'Quadrillionaire'],
    [1e18, 'earn1qi', 'Trillionnaire', 'Quintillionaire'], [1e21, 'earn1sx', 'Trilliardaire', 'Sextillionaire'],
    [1e24, 'earn1sp', 'Quadrillionnaire', 'Septillionaire'], [1e27, 'earn1oc', 'Banque centrale du gâteau', 'Central cake bank'],
    [1e30, 'earn1no', 'L’argent n’a plus de goût', 'Money has lost its taste'], [1e60, 'earn1e60', 'Compte en banque illisible', 'Unreadable bank account'],
    [1e100, 'earn1e100', 'Googol de gâteaux', 'Googol of cakes'], [1e200, 'earn1e200', 'Le compteur fume', 'The counter is smoking'],
    [1e303, 'earn1e303', 'Centillion : fin de la banque', 'Centillion: end of the bank'],
  ];
  earned.forEach(function(s, i) {
    var icons = ['\u{1F4B0}', '\u{1F4B5}', '\u{1F911}', '\u{1F3F0}', '\u{1F48E}', '\u{1F3E6}', '\u{1F4C8}', '\u{1F30D}'];
    add(s[1], 'money', icons[i % icons.length], s[2], s[3], 'Gagner ' + fmt(s[0]) + '€ au total.', 'Earn ' + fmt(s[0]) + '€ in total.',
      function(g) { return g.totalEarned >= s[0]; });
  });
  [1e3, 1e5, 1e7, 1e9, 1e12, 1e15, 1e18, 1e24, 1e30].forEach(function(v, i) {
    var fr = ['Bas de laine', 'Matelas moelleux', 'Sac de farine dorée', 'Picsou pâtissier', 'Tas d’or', 'Montagne d’or', 'Océan d’or', 'Planète d’or', 'Univers d’or'];
    var en = ['Nest egg', 'Soft mattress', 'Bag of gold flour', 'Pastry mogul', 'Pile of gold', 'Mountain of gold', 'Ocean of gold', 'Planet of gold', 'Universe of gold'];
    add('hold' + i, 'money', '\u{1F4B8}', fr[i], en[i], 'Avoir ' + fmt(v) + '€ en poche.', 'Hold ' + fmt(v) + '€.', function(g) { return g.money >= v; });
  });

  // ---------- Niveaux ----------
  [5,10,15,20,25,30,40,50,60,70,75,80,90,100,125,150,175,200,250,300,350,400,450,500,600,700,800,900,1000].forEach(function(l) {
    var special = { 5:['Commis','Kitchen hand'], 10:['Préparateur','Prep cook'], 25:['Chef de partie','Station chef'], 50:['Sous-chef','Sous chef'],
      75:['Chef pâtissier','Pastry chef'], 100:['Centenaire du four','Oven centenarian'], 200:['Meilleur ouvrier','Best craftsman'],
      300:['Trois cents coups de fouet','Three hundred whisks'], 500:['Demi-millénaire','Half a millennium'], 1000:['Maître pâtissier légendaire','Legendary master baker'] }[l];
    var iconMap = { 5:'5️⃣', 10:'\u{1F51F}', 100:'\u{1F4AF}', 1000:'♾️' };
    add('lvl' + l, 'level', iconMap[l] || (l < 50 ? '\u{1F3AF}' : l < 200 ? '\u{1F31F}' : '\u{1F525}'),
      special ? special[0] : 'Niveau ' + l, special ? special[1] : 'Level ' + l, 'Atteindre le niveau ' + l + '.', 'Reach level ' + l + '.',
      function(g) { return g.level >= l; });
  });

  // ---------- Boutique ----------
  [20, 50, 100, 200, 500, 1000, 2000].forEach(function(v) {
    var legacy = { 20:'space20', 50:'space50', 100:'space100', 500:'space500' }[v] || ('space' + v);
    add(legacy, 'shop', v < 100 ? '\u{1F4D0}' : v < 500 ? '\u{1F3D7}️' : '\u{1F306}', v + ' m² de bonheur', v + ' m² of happiness',
      'Avoir ' + v + ' m² d’espace.', 'Own ' + v + ' m² of space.', function(g) { return g.maxSpace >= v; });
  });
  var rbFr = ['Nouvelle vie', 'Deuxième fournée', 'Maison de luxe', 'Palace', 'Empire', 'Dynastie', 'Légende éternelle'];
  var rbEn = ['New life', 'Second batch', 'Luxury house', 'Palace', 'Empire', 'Dynasty', 'Eternal legend'];
  for (var rb = 1; rb <= 7; rb++) {
    (function(n) {
      add('rebirth' + n, 'shop', n < 3 ? '⭐' : n < 5 ? '\u{1F31F}' : n < 7 ? '\u{1F4AB}' : '\u{1F300}', rbFr[n-1], rbEn[n-1],
        'Faire ' + n + ' rebirth' + (n > 1 ? 's' : '') + '.', 'Rebirth ' + n + ' time' + (n > 1 ? 's' : '') + '.', function(g) { return g.rebirth >= n; });
    })(rb);
  }
  [[1,'emp1','\u{1F9D1}‍\u{1F373}','Premier employé','First employee'],[5,'emp5','\u{1F465}','Petite équipe','Small team'],[10,'emp10','\u{1F465}','Brigade','Brigade'],
   [20,'emp20','\u{1F3E2}','Grande maison','Big house'],[50,'emp50','\u{1F3E2}','Ressources humaines dépassées','HR is overwhelmed'],[100,'emp100','\u{1F30D}','Plus gros employeur de la ville','Biggest employer in town']]
    .forEach(function(s) {
      add(s[1], 'shop', s[2], s[3], s[4], 'Avoir ' + s[0] + ' employé(s) en même temps.', 'Have ' + s[0] + ' employee(s) at once.', function(g) { return g.employees.length >= s[0]; });
    });
  [3, 5, 10, 20, 30].forEach(function(v) {
    add('oven' + v, 'shop', '\u{1F525}', v + ' fours allumés', v + ' lit ovens', 'Posséder ' + v + ' fours.', 'Own ' + v + ' ovens.', function(g) { return (g.ovens || 0) >= v; });
  });
  [2, 3, 5].forEach(function(v) {
    add('bakeries' + v, 'shop', '\u{1F3EC}', 'Chaîne de ' + v + ' boutiques', 'Chain of ' + v + ' shops', 'Avoir ' + v + ' pâtisseries.', 'Own ' + v + ' bakeries.', function(g) { return g.bakeries.length >= v; });
  });
  [1, 10, 50, 100, 500].forEach(function(v) {
    add('events' + v, 'general', '⚡', v + ' événement' + (v > 1 ? 's' : '') + ' vu' + (v > 1 ? 's' : ''), v + ' event' + (v > 1 ? 's' : '') + ' seen',
      'Vivre ' + v + ' événement(s).', 'Live through ' + v + ' event(s).', function(g) { return (g.stats.eventsSeen || 0) >= v; });
  });
  [1, 5, 24, 100, 500, 1000].forEach(function(h) {
    add('play' + h, 'general', h < 24 ? '⏰' : '⌛', h + ' h aux fourneaux', h + ' h at the stove', 'Jouer ' + h + ' heure(s).', 'Play for ' + h + ' hour(s).',
      function(g) { return g.playTimeMs >= h * 3600000; });
  });

  // ---------- Une serie pour chaque recette ----------
  var recTiers = [[1, 'Découverte', 'Discovery', '\u{1F50D}', 'Descubrimiento'], [100, 'Spécialité', 'Specialty', '\u{1F3C5}', 'Especialidad'], [1000, 'Signature', 'Signature', '\u{1F947}', 'Firma'], [10000, 'Institution', 'Institution', '\u{1F3C6}', 'Institución'], [100000, 'Mythe', 'Myth', '\u{1F451}', 'Mito']];
  REC.forEach(function(r) {
    recTiers.forEach(function(tier, i) {
      var legacy = (r.id === 'goldengate' && i === 0) ? 'golden' : (r.id === 'infinicake' && i === 0) ? 'infinimade' : ('rec_' + r.id + '_' + i);
      add(legacy, 'recipes', i === 0 ? r.e : tier[3], null, null, null, null, function(g) { return (g.stats.cakesMadeById[r.id] || 0) >= tier[0]; });
      var a = ACHIEVEMENTS[ACHIEVEMENTS.length - 1];
      a.nameFn = function() { return tierName(tier) + ' : ' + recShortName(r); };
      a.descFn = function() { return t('ach.descRecipe', { v: fmt(tier[0]), n: recShortName(r) }); };
    });
  });

  // ---------- Une serie pour chaque batiment ----------
  series('buildings', [
    [1, 'bld1', '\u{1F3ED}', 'Premier bâtiment', 'First building'], [10, 'bld10', '\u{1F3D7}️', 'Lotissement', 'Housing estate'],
    [50, 'bld50', '\u{1F3D7}️', 'Petite ville', 'Small town'], [100, 'bld100', '\u{1F306}', 'Grande ville', 'Big city'],
    [500, 'bld500', '\u{1F306}', 'Métropole sucrée', 'Sugar metropolis'], [1000, 'bld1000', '\u{1F30D}', 'Pays de cocagne', 'Land of plenty'],
    [5000, 'bld5000', '\u{1FA90}', 'Planète usine', 'Factory planet'],
  ], function(g) {
    var n = 0;
    BUILDINGS.forEach(function(b) { n += (g.buildings[b.id] || { qty: 0 }).qty; });
    return n;
  }, 'Posséder {n} bâtiments.', 'Own {n} buildings.');
  var bldTiers = [[1, 'Inauguration', 'Grand opening', 'Inauguración'], [10, 'Quartier', 'District', 'Barrio'], [50, 'Cité', 'City', 'Ciudad'], [100, 'Empire', 'Empire', 'Imperio'], [200, 'Légende', 'Legend', 'Leyenda'], [500, 'Mégalopole', 'Megalopolis', 'Megalópolis']];
  BUILDINGS.forEach(function(b) {
    bldTiers.forEach(function(tier, i) {
      add('bt_' + b.id + '_' + i, 'buildings', b.e, null, null, null, null, function(g) { return (g.buildings[b.id] || { qty: 0 }).qty >= tier[0]; });
      var a = ACHIEVEMENTS[ACHIEVEMENTS.length - 1];
      a.nameFn = function() { return tierName(tier) + ' : ' + t('b.' + b.id); };
      a.descFn = function() { return t('ach.descBuilding', { v: tier[0], n: t('b.' + b.id) }); };
    });
  });

  // ---------- Reserves d'ingredients ----------
  var stockTiers = [[1000, 'Garde-manger', 'Pantry', 'Despensa'], [1000000, 'Entrepôt', 'Warehouse', 'Almacén'], [1000000000, 'Réserve nationale', 'National reserve', 'Reserva nacional']];
  ING.forEach(function(ing) {
    stockTiers.forEach(function(tier, i) {
      add('st_' + ing.id + '_' + i, 'stock', ing.e, null, null, null, null, function(g) { return (g.ing[ing.id] || 0) >= tier[0]; });
      var a = ACHIEVEMENTS[ACHIEVEMENTS.length - 1];
      a.nameFn = function() { return tierName(tier) + ' : ' + t('i.' + ing.id); };
      a.descFn = function() { return t('ach.descStock', { v: fmt(tier[0]), n: t('i.' + ing.id) }); };
    });
  });

  // ---------- Commandes, prets et machines ----------
  function counted(id, cat, icon, n, nameKey, descKey, check) {
    add(id, cat, icon, null, null, null, null, check);
    var a = ACHIEVEMENTS[ACHIEVEMENTS.length - 1];
    a.nameFn = function() { return t(nameKey, { v: fmt(n) }); };
    a.descFn = function() { return t(descKey, { v: fmt(n) }); };
  }
  [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000].forEach(function(n) {
    counted('orders' + n, 'general', '\u{1F9FE}', n, 'ach.nameOrders', 'ach.descOrders', function(g) { return (g.stats.ordersDone || 0) >= n; });
  });
  [1, 5, 10, 25, 50, 100].forEach(function(n) {
    counted('loans' + n, 'money', '\u{1F3E6}', n, 'ach.nameLoans', 'ach.descLoans', function(g) { return (g.stats.loansTaken || 0) >= n; });
  });
  [1, 10, 50].forEach(function(n) {
    counted('repaid' + n, 'money', '\u{1F91D}', n, 'ach.nameRepaid', 'ach.descRepaid', function(g) { return (g.stats.loansRepaid || 0) >= n; });
  });
  MACHINES.forEach(function(m) {
    for (var lv = 1; lv <= m.max; lv++) {
      (function(n) {
        add('mach_' + m.id + '_' + n, 'shop', m.e, null, null, null, null, function(g) { return ((g.machines || {})[m.id] || 0) >= n; });
        var a = ACHIEVEMENTS[ACHIEVEMENTS.length - 1];
        a.nameFn = function() { return t('ach.nameMachine', { n: t('mach.' + m.id), v: n }); };
        a.descFn = function() { return t('ach.descMachine', { n: t('mach.' + m.id), v: n }); };
      })(lv);
    }
  });

  // ---------- Les 5 secrets : rien n'est affiche tant qu'ils ne sont pas trouves ----------
  add('secret_bob', 'secret', '\u{1F62D}', 'Souffre-douleur', 'Punching bag', 'Tu as poussé Bob à bout. Il ne s’en remettra pas.', 'You pushed Bob over the edge. He will never recover.',
    function(g) { return (g.bobClicks || 0) >= 50; }, true);
  add('secret_name', 'secret', '\u{1F9D9}', 'Usurpation d’identité', 'Identity theft', 'Tu as appelé ta pâtisserie « Bob ». Il n’a rien dit, mais il l’a noté.', 'You named your bakery "Bob". He said nothing, but he took note.',
    function(g) { return (g.bakeryName || '').trim().toLowerCase() === 'bob'; }, true);
  add('secret_night', 'secret', '\u{1F634}', 'Boulanger de nuit', 'Night baker', 'Jouer entre 3 h et 4 h du matin. Va dormir.', 'Play between 3 and 4 a.m. Go to bed.',
    function() { return new Date().getHours() === 3; }, true);
  add('secret_logo', 'secret', '\u{1F6AA}', 'Toc toc toc', 'Knock knock', 'Cliquer 20 fois sur le logo. Il n’y a personne.', 'Click the logo 20 times. Nobody is home.',
    function(g) { return (g.logoClicks || 0) >= 20; }, true);
  add('secret_broke', 'secret', '\u{1F4B8}', 'Faillite assumée', 'Proud bankruptcy', 'Faire faillite. Il fallait le faire.', 'Go bankrupt. Takes talent.',
    function(g) { return !!g.wentBankrupt; }, true);
})();

function achName(a) {
  if (a.nameFn) return a.nameFn();
  if (currentLang === 'es') return achNameEs(a.en) || a.en;
  return currentLang === 'en' ? a.en : a.fr;
}

function achDesc(a) {
  if (a.descFn) return a.descFn();
  if (currentLang === 'es') return achDescEs(a.descEn) || a.descEn;
  return currentLang === 'en' ? a.descEn : a.descFr;
}

// state : par defaut la patisserie actuelle. Les totaux de toutes les patisseries comptent aussi.
function checkAchievements(state) {
  var newAch = false;
  for (var i = 0; i < ACHIEVEMENTS.length; i++) {
    var a = ACHIEVEMENTS[i];
    if (G.achievements[a.id]) continue;
    if (a.check(state || G)) {
      G.achievements[a.id] = true;
      if (!state) G.achHere = (G.achHere || 0) + 1;
      newAch = true;
      if (typeof toast === 'function') toast(t(a.hidden ? 'ach.secretFound' : 'ach.unlocked', { n: achName(a) }));
    }
  }
  if (newAch && typeof onAchievementUnlocked === 'function') onAchievementUnlocked();
  return newAch;
}

// Combien de succes : les secrets se comptent a part, et restent caches tant qu'ils ne sont pas trouves
function achCounts() {
  var c = { done: 0, total: 0, secrets: 0 };
  ACHIEVEMENTS.forEach(function(a) {
    var got = !!G.achievements[a.id];
    if (a.hidden) { if (got) c.secrets++; return; }
    c.total++;
    if (got) c.done++;
  });
  return c;
}
