/* ============================================
   PATISSERIE 2D SIMULATOR - LANGUES
   Francais et anglais
   ============================================ */
// La langue du navigateur choisit au depart : francais, espagnol, ou anglais pour tout le reste
function detectLang() {
  var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'fr'];
  if (/^fr/i.test(list[0])) return 'fr';
  if (/^es/i.test(list[0])) return 'es';
  return 'en';
}
var currentLang = detectLang();
var LANG_LIST = [
  { code:'fr', name:'Français', flag:'\u{1F1EB}\u{1F1F7}' },
  { code:'en', name:'English', flag:'\u{1F1FA}\u{1F1F8}' },
  { code:'es', name:'Español', flag:'\u{1F1EA}\u{1F1F8}' },
];
var LANGS = {};

// ======================== FRANCAIS ========================
LANGS.fr = {
  'bob.sugar3':'Du sucre… Je suis encore triste, mais un peu moins.|Mmm. Ça ne règle pas tout, mais ça aide.','bob.sugar2':'Encore du sucre… Je crois que ça va un peu mieux.|Oh. Ça, ça fait du bien.','bob.sugar1':'Je souris presque. Encore un sucre, peut-être…|Je ne suis presque plus triste.','bob.sugar0':'Merci ! Je suis de nouveau de bonne humeur !|Je t\'aime bien, finalement.',
  'bld.unlocked':'Niveau 40 ! Tu peux acheter des bâtiments : ils produisent des ingrédients tout seuls. Regarde l\'onglet Bâtiments.',
  'ach.lockedDesc':'???','ach.secretsFound':'+ {{v}} secret(s)','ach.nameOrders':'{{v}} commande(s) livrée(s)','ach.descOrders':'Livrer {{v}} commande(s).','ach.nameLoans':'{{v}} prêt(s) demandé(s)','ach.descLoans':'Demander {{v}} prêt(s).','ach.nameRepaid':'{{v}} prêt(s) remboursé(s)','ach.descRepaid':'Rembourser {{v}} prêt(s).','ach.nameMachine':'{{n}} : niveau {{v}}','ach.descMachine':'Monter {{n}} au niveau {{v}}.',
  'rb.1':'Boulangerie','rb.2':'Pâtisserie Fine','rb.3':'Maison de Luxe','rb.4':'Palace Gastronomique','rb.5':'Empire de la Pâtisserie','rb.6':'Dynastie Sucrée','rb.7':'Légende Éternelle',
  'settings.tabAch':'Succès','settings.tabStats':'Statistiques',
  'mus.default':'Douce Mélodie','mus.waltz':'Valse Sucrée','mus.joy':'Joie Pâtissière','mus.calm':'Douceur du Soir','mus.oven':'Rythme du Four','mus.night':'Nuit de Crème','mus.spring':'Valse des Fleurs','mus.summer':'Vagues Douces','mus.fall':'Feuilles de Caramel','mus.winter':'Sucre Glace','mus.birthday':'Joyeux Anniversaire',
  'adv.order':'La commande de {{n}} expire dans {{t}} !','adv.empStrike':'{{n}} fait grève !','adv.empSoon':'{{n}} va bientôt faire grève.','adv.space':'Ton stock déborde : {{v}} % de ton espace est plein.','adv.slow':'{{n}} se vend mal : prix à {{v}} %.','adv.rent':'Ton loyer est trop cher : il mange {{v}} % de tes revenus.','adv.rentNone':'Tu paies un loyer et tu ne gagnes presque rien.',
  'order.title':'Commandes','tab.orders':'Commandes','order.doneCount':'{{v}} livrées','order.help':'Des clients passent commande. Prépare les gâteaux demandés et livre avant la fin du temps : plus la commande est compliquée, plus la prime est grosse.','order.none':'Aucune commande pour l\'instant. Les clients arrivent vite !','order.level1':'Simple','order.level2':'Moyenne','order.level3':'Difficile','order.level4':'Extrême','order.prime':'dont {{v}} de prime','order.deliver':'Livrer','order.delivered':'Commande livrée : +{{v}} !','order.new':'Nouvelle commande !','order.butler':'{{v}} maître(s) d\'hôtel livrent tout seuls ce qui est prêt.','order.butlerDone':'{{n}} a livré une commande : +{{v}} !','order.unlocked':'Niveau 30 ! Des clients passent commande maintenant. Regarde l\'onglet Commandes.',
  'emp.maitre':'Maître d\'hôtel','emp.desc.maitre':'Livre les commandes des clients à ta place, dès que le stock est prêt.',
  'mach.title':'Boutique de machines','tab.machines':'Machines','mach.help':'Des améliorations pour toujours, pour toutes tes pâtisseries, même après un rebirth. Elles coûtent très cher.','mach.buy':'Acheter ({{v}})','mach.max':'Au maximum','mach.bought':'Machine installée !','mach.now':'Bonus actuel : {{v}} %','mach.unlocked':'Niveau 50 ! La boutique de machines est ouverte. Ça coûte cher, mais c\'est pour toujours.',
  'mach.petrin':'Pétrin industriel','mach.petrin.d':'Préparations {{v}} % plus rapides par niveau.','mach.isolant':'Isolation du local','mach.isolant.d':'Loyer {{v}} % moins cher par niveau.','mach.robot':'Robot de cuisine','mach.robot.d':'Ingrédients {{v}} % moins chers par niveau.','mach.fourturbo':'Four à convection','mach.fourturbo.d':'{{v}} fours de plus par niveau.','mach.convoyeur':'Tapis roulant','mach.convoyeur.d':'Bâtiments {{v}} % plus productifs par niveau.','mach.caisse':'Caisse automatique','mach.caisse.d':'Vendeurs {{v}} % plus rapides par niveau.','mach.etiquette':'Étiqueteuse de luxe','mach.etiquette.d':'Les prix baissent {{v}} % moins vite quand tu vends, par niveau.','mach.vitrine':'Vitrine réfrigérée','mach.vitrine.d':'Prix de vente +{{v}} % par niveau.','mach.guichet':'Guichet des commandes','mach.guichet.d':'Primes des commandes +{{v}} % par niveau.','mach.academie':'Académie du goût','mach.academie.d':'XP +{{v}} % par niveau.',
  'rent.late':'Loyer en retard ! Si tu ne trouves pas d\'argent, une dette commence dans {{v}}.',
  'bakery.level':'Niveau {{v}}','bakery.money':'Argent : {{v}}','bakery.debt':'Dette : {{v}}','bakery.sellTitle':'Vendre « {{n}} » ?','bakery.sellWarn':'Tu perds cette pâtisserie et toutes ses statistiques. Tes succès restent.','bakery.partCash':'Argent en caisse','bakery.partStock':'Gâteaux en stock','bakery.partIng':'Ingrédients','bakery.partEquip':'Bâtiments, fours et espace','bakery.partRep':'Réputation et fonds de commerce','bakery.partDebt':'Dette à rembourser','bakery.partTotal':'Prix de vente','bakery.sellConfirm':'Vendre','bakery.best':'Le plus rentable','bakery.bestChart':'Le gâteau qui rapporte le plus','bakery.bestChartSub':'dans chaque pâtisserie, en argent gagné','bakery.noBest':'Rien vendu encore',
  'bank.saving':'Tu économises {{v}} d\'intérêts','bank.levelReq':'Niveau {{v}} requis','bank.repayNow':'Rembourser ({{v}})','bank.limitHelp':'Plus ton niveau monte, plus la banque te fait confiance.',
  'settings.themeScope':'Appliquer','settings.scopeAll':'À tout le jeu','settings.scopeHere':'À cette pâtisserie','settings.ownTheme':'Cette pâtisserie a son propre thème.','settings.ownThemeReset':'Suivre le thème du jeu','settings.themeParty':'Fête','settings.themeSpace':'Espace','settings.lockLevel':'au niveau {{v}}','settings.themeEnded':'La saison est finie : son thème n\'est plus disponible.',
  'settings.birthdayFix':'Corriger ({{v}})','settings.birthdayFixed':'Date corrigée !','settings.birthdayHelpFix':'Tu t\'es trompé ? Corriger la date coûte {{v}}.',
  'bob.debtBonus':'Et tiens, voilà {{v}} de ma poche pour t\'aider. Ne le dis à personne.',
  'bob.challengeHello':'Psst ! J\'ai un défi pour toi. {{d}}. Tu as 24 heures. Réussis, et je te donne 5 % de tout ton argent, soit {{v}} pour l\'instant !','bob.challengeYes':'J\'accepte !','bob.challengeNo':'Pas cette fois','bob.challengeNoLine':'Tant pis. Je reviendrai dans quelques jours.','bob.challengeWin':'Défi réussi ! Voilà {{v}}, c\'est mérité.','bob.challengeLost':'Le défi est terminé. Raté ! On retentera plus tard.',
  'chal.banner':'Défi de Bob','chal.sold':'Vends {{v}} pièces','chal.made':'Prépare {{v}} pièces','chal.earned':'Gagne {{v}}','chal.buildings':'Achète {{v}} bâtiments','chal.orders':'Livre {{v}} commandes',
  'console.mostUsed':'Tes commandes les plus utilisées','console.challengeStarted':'Bob te propose un défi.','console.maxDone':'Tout est au maximum. Ingrédients : plus ils sont rares, moins tu peux en avoir.',
  'footer.rights':'Turbonix Entertainment. Tous droits réservés.','footer.icons':'Icônes :',
  'tab.bank':'Banque',
  'bank.title':'Banque','bank.whatIs':'Bob, c\'est quoi un prêt ?','bank.balance':'Ton compte','bank.toRepay':'Reste à rembourser','bank.perMin':'Prélevé par minute','bank.rentDebt':'Dette de loyer',
  'bank.active':'Tes prêts en cours','bank.offers':'Demander un prêt','bank.loanOf':'Prêt de {{v}}','bank.remaining':'Reste {{v}}','bank.late':'En retard : pas assez d\'argent, ce prêt coûte de plus en plus cher.','bank.autoPay':'{{v}} prélevés par minute','bank.repayAll':'Tout rembourser ({{v}})',
  'bank.rate':'Intérêts','bank.repay':'À rembourser','bank.during':'Sur','bank.minutes':'{{v}} min','bank.borrow':'Emprunter','bank.inProgress':'En cours','bank.oneEach':'Un seul prêt de chaque montant à la fois. Le remboursement est prélevé tout seul sur ton argent.',
  'bank.taken':'{{v}} sur ton compte !','bank.repaid':'Prêt remboursé !','bank.finished':'Prêt de {{v}} remboursé !',
  'bank.bobDebt':'Aïe. Tu n\'as plus de quoi payer le loyer : tu as {{v}} de dette. Pas de panique, je t\'ai créé un compte bancaire. Regarde, il y a un nouvel onglet : Banque.',
  'bank.bobLoan':'À la banque, tu peux demander un prêt. Un prêt, c\'est simple : la banque te donne de l\'argent tout de suite, et tu le lui rends petit à petit.',
  'bank.bobInterest':'Mais tu rends toujours un peu plus que ce que tu as reçu : ce petit plus, ce sont les intérêts. Par exemple, tu empruntes {{a}} et tu rembourses {{b}}. C\'est prélevé tout seul, un peu chaque seconde.',
  'bank.bobAdvice':'Si tu n\'as plus d\'argent au moment du prélèvement, le prêt coûte de plus en plus cher. Alors, emprunte seulement ce que tu sais pouvoir rembourser. Et rembourser en avance coûte moins cher : juste après l\'emprunt, tu ne perds rien !',
  'bank.bobGo':'Voir la banque',
  'rename.price':'Changer le nom de ta pâtisserie coûte {{v}}.','rename.noMoney':'Il te faut {{v}} pour la renommer.',
  'offline.loans':'Prêts remboursés : -{{v}}',
  'stats.totalInvested':'Investissements','stats.loansTaken':'Prêts demandés','stats.interestPaid':'Intérêts payés','stats.viewHere':'Cette pâtisserie','stats.viewCharts':'Graphiques','stats.viewAll':'Toutes mes pâtisseries',
  'stats.teaser':'Ouvre une deuxième pâtisserie pour débloquer les graphiques et les totaux de toutes tes boutiques.',
  'chart.log':'échelle logarithmique','chart.perMin':'/min','chart.empty':'Pas encore assez de données. Les courbes apparaissent après une minute de jeu dans cette pâtisserie.',
  'chart.kpiRate':'Revenus récents','chart.kpiRateHelp':'Moyenne des 10 dernières minutes de jeu.','chart.kpiMargin':'Marge brute','chart.kpiMarginHelp':'Ce qu\'il reste des ventes après les ingrédients.','chart.kpiAvg':'Prix moyen','chart.kpiAvgHelp':'Revenu total divisé par les pièces vendues.','chart.kpiFixed':'Charges fixes','chart.kpiFixedHelp':'Loyer et salaires, à payer quoi qu\'il arrive.','chart.kpiBreak':'Point mort','chart.kpiBreakHelp':'Pièces à vendre par heure pour couvrir les charges.','chart.kpiDemand':'Indice de demande','chart.kpiDemandHelp':'100 % = prix normal, moyenne de tes recettes.',
  'chart.wealth':'Ton argent','chart.wealthSub':'selon le temps de jeu','chart.money':'Argent','chart.flow':'Entrées et sorties','chart.flowSub':'euros par minute de jeu','chart.in':'Entrées','chart.out':'Sorties','chart.level':'Ta progression','chart.levelSub':'niveau selon le temps de jeu','chart.levelName':'Niveau','chart.costs':'Où part ton argent','chart.costsSub':'{{v}} dépensés au total','chart.top':'Tes recettes stars','chart.topSub':'les 8 plus préparées, en pièces','chart.showTable':'Voir les chiffres','chart.hideTable':'Cacher les chiffres','chart.spent':'Dépensé',
  'all.bakeries':'Pâtisseries','all.money':'Argent cumulé','all.ach':'Succès débloqués, toutes boutiques','all.achHelp':'Les succès sont communs à toutes tes pâtisseries, et les totaux ci-dessous comptent aussi pour les débloquer.','all.achCat':'Succès par catégorie','all.achCatSub':'nombre de succès débloqués','all.compare':'Comparaison','all.compareSub':'argent total gagné par chaque boutique','all.name':'Pâtisserie','all.achHere':'Succès obtenus ici','all.totals':'Totaux de toutes les pâtisseries',
  'bakery.statsUnlocked':'Deux boutiques ! Regarde dans les réglages, Statistiques : je t\'ai préparé des graphiques et les totaux de toutes tes pâtisseries.',
  'settings.langHelp':'La langue de tout le jeu.','settings.currencyHelp':'Pour l\'affichage de tes prix.','settings.birthdayHelpSet':'Elle ne peut plus être changée.','settings.themeHelp':'Les saisons et ton anniversaire ne sont disponibles qu\'au bon moment.','settings.particlesHelp':'Confettis, pièces et décors qui bougent.','settings.musicHelp':'Elle démarre à ton premier clic.','settings.soundHelp':'Les petits bruits quand tu cliques ou que tu vends.','settings.saveNowTitle':'Sauvegarde automatique','settings.saveHelp':'Toutes les 30 secondes, dans ce navigateur.','settings.saveNow':'Sauvegarder','settings.saved':'Partie sauvegardée !','settings.exportHelp':'Garde ce code : il contient toute ta partie.','settings.importHelp':'Colle un code pour récupérer une partie. Elle remplace celle-ci.','settings.resetHelp':'Efface tout, sans retour possible.','settings.resetBtn':'Tout effacer',
  'pause.kicker':'Le temps est arrêté','pause.sub':'{{n}} · {{t}} de jeu','pause.money':'Argent','pause.level':'Niveau','pause.baking':'Au four','pause.achievements':'Succès','pause.key':'Échap','pause.musicOn':'Musique : oui','pause.musicOff':'Musique : non','pause.soundOn':'Bruitages : oui','pause.soundOff':'Bruitages : non',
  'pause.tips':'Vendre moins à la fois fait moins baisser les prix.|Un bon vendeur vend tout seul, même quand tu n\'es pas là.|Regarde le bénéfice d\'une recette avant de la préparer.|Les bâtiments te font gagner du temps : achète ceux des ingrédients que tu utilises le plus.|Un four de plus, c\'est une fournée de plus en même temps.|La demande revient avec le temps : varie tes recettes.|Chaque succès augmente un peu tes prix de vente.|Surtout, ne clique pas trop sur moi.',
  'console.guideTitle':'Guide des commandes','console.guideHelp':'Clique sur un exemple pour le mettre dans la console, puis appuie sur Entrée.','console.guideSearch':'Chercher une commande...','console.guideAll':'Toutes','console.guideTry':'Essaie :','console.guideNone':'Aucune commande ne correspond.','console.guideDanger':'Attention : pas de retour en arrière.',
  'console.bankUnlocked':'Onglet Banque ouvert !','console.bankCleared':'Tous les prêts sont effacés.','console.bakeryCreated':'« {{n}} » créée : pâtisserie n° {{i}}.','console.bakeryDeleted':'« {{n}} » supprimée.','console.bakeryLast':'Impossible : c\'est ta dernière pâtisserie.','console.bakeryUnknown':'Numéro inconnu. Tes pâtisseries :',
  'level':'Niv. {{v}}',
  'ing.title':'Ingrédients','ing.locked':'Niveau {{v}}','ing.perClick':'+{{v}} / clic','ing.cost':'Coût : {{v}}','ing.autoRate':'{{v}}/s',
  'ing.resell':'Revendre','ing.craftBtn':'Fabriquer','ing.craftTime':'Fabrication : {{v}}','ing.search':'Chercher...','ing.noMoney':'Pas assez d\'argent !',
  'ing.craftTip':'Donne {{q}} pour {{c}} d\'ingrédients (acheté : {{b}})','ing.resellTip':'Revendre {{q}} pour {{v}}','bulk.label':'Quantité','bulk.max':'Max',
  'xp.text':'{{c}} / {{n}} XP','xp.level':'Niveau {{v}} !',
  'space.label':'Espace','space.text':'{{u}} / {{m}} m²','space.buy':'+{{a}} m² pour {{c}}','space.locked':'Niv. {{v}} requis','space.max':'Espace max !','space.rent':'Loyer : {{v}}/h','space.debt':'Dette : {{v}}','space.noSpace':'Pas assez d\'espace','space.refund':'Plus de place : ingrédients rendus !',
  'oven.label':'Fours : {{a}} / {{m}}','oven.queue':'{{v}} en attente','oven.title':'Fours','oven.desc':'Chaque four prépare une fournée à la fois. Les autres attendent leur tour.','oven.buy':'+1 four pour {{c}}','oven.max':'Tous les fours sont achetés','oven.bought':'Nouveau four !',
  'rec.title':'Recettes','rec.prepare':'Préparer','rec.prepareMax':'Max','rec.noIng':'Il manque des ingrédients','rec.noSpace':'Pas assez d\'espace','rec.queueFull':'File d\'attente pleine','rec.prepared':'{{e}} {{n}} en préparation !','rec.preparedMany':'{{e}} {{q}} fournées de {{n}} en préparation !','rec.ready':'{{q}} {{n}} prêt(s) !','rec.xp':'XP : +{{v}}','rec.time':'{{v}}',
  'rec.cost':'Coût : {{v}}','rec.revenue':'Vente : {{v}}','rec.profit':'Bénéfice : {{v}}','rec.buyMissing':'Acheter ce qui manque ({{v}})','rec.search':'Chercher une recette...','rec.onlyMakable':'Faisables','rec.onlyFav':'Favoris','rec.sortNew':'Plus récentes','rec.sortOld':'Plus anciennes','rec.sortProfit':'Plus rentables','rec.fav':'Favori','rec.none':'Aucune recette ne correspond.','rec.bought':'Ingrédients achetés !',
  'sell.title':'Ventes','sell.stock':'Stock : {{v}}','sell.sell':'Vendre 1','sell.sellAll':'Tout vendre','sell.sellAllGlobal':'Tout vendre ({{v}})','sell.earned':'+{{v}} pour {{q}} {{e}}','sell.earnedAll':'+{{v}} !','sell.price':'{{v}}/pièce','sell.noStock':'Rien à vendre pour l\'instant.','sell.inflUp':'↑ +{{v}} %','sell.inflDown':'↓ {{v}} %',
  'bld.title':'Bâtiments','bld.buy':'Acheter','bld.qty':'x{{v}}','bld.prod':'{{v}}/s','bld.locked':'Niv. {{v}}','bld.bought':'{{n}} acheté !','bld.none':'Pas assez d\'argent !',
  'emp.title':'Employés','emp.fire':'Virer','emp.fireConfirm':'Vraiment virer {{n}} ?','emp.salary':'Salaire : {{v}}/h','emp.morale':'Moral','emp.assign':'Affecté à','emp.working':'Travaille','emp.striking':'En grève !','emp.poor':'Travail médiocre','emp.bonus':'Prime +25 de moral ({{v}})','emp.bonusDone':'Prime versée !',
  'emp.event.quit':'{{n}} a démissionné !','emp.event.strike':'{{n}} fait grève !',
  'emp.totalSalary':'Salaires : {{v}}/h',
  'emp.carrier':'Transporteur','emp.desc.carrier':'Transporte de l\'argent, des gâteaux ou des ingrédients vers une autre de tes pâtisseries.','carry.to':'Vers','carry.what':'Transporte','carry.money':'De l\'argent','carry.cakes':'Des gâteaux','carry.ings':'Des ingrédients','carry.noShop':'Il lui faut une autre pâtisserie.','emp.collector':'Cueilleur','emp.baker':'Boulanger','emp.seller':'Vendeur','emp.manager':'Manager','emp.chef':'Chef pâtissier',
  'emp.desc.collector':'Produit un ingrédient tout seul.','emp.desc.baker':'Ajoute un four et prépare 5 % plus vite.','emp.desc.seller':'Vend tes gâteaux tout seul.','emp.desc.manager':'Remonte le moral de toute l\'équipe.','emp.desc.chef':'Prépare 8 % plus vite et fait monter les prix de 5 %.',
  'emp.skill':'Compétence {{v}}','emp.train':'Former','emp.trainBtn':'Former au niveau suivant ({{v}})','emp.trained':'Employé formé !','emp.info':'Infos employé','emp.levelTxt':'Niveau {{v}}','emp.recruit':'Recruter','emp.recruitBtn':'{{n}} ({{c}})','emp.recruitHint':'Recruter tout de suite coûte plus cher que d\'attendre un candidat.','emp.hired':'Embauché !',
  'emp.applicant':'Nouvelle candidature !','emp.applicants':'Candidatures','emp.accept':'Embaucher','emp.reject':'Rejeter','emp.noApplicants':'Aucune candidature pour le moment.','emp.lockedAll':'Les employés arrivent au niveau 5.',
  'ach.title':'Succès','ach.unlocked':'Succès : {{n}} !','ach.secretFound':'Succès secret : {{n}} !','ach.bonus':'Prestige : tes succès augmentent tes prix de vente de +{{v}} %','ach.hiddenCount':'Secrets trouvés : {{a}} / {{b}}','ach.hiddenName':'???','ach.hiddenDesc':'Succès secret. À toi de le trouver !',
  'ach.cat.general':'Général','ach.cat.cakes':'Gâteaux','ach.cat.money':'Argent','ach.cat.level':'Niveaux','ach.cat.shop':'Boutique','ach.cat.recipes':'Recettes','ach.cat.buildings':'Bâtiments','ach.cat.stock':'Réserves','ach.cat.secret':'Secrets',
  'ach.descRecipe':'Préparer {{v}} {{n}}.','ach.descBuilding':'Avoir {{v}} {{n}} en même temps.','ach.descStock':'Avoir {{v}} {{n}} en réserve.',
  'rebirth.title':'Nouvelle pâtisserie !','rebirth.desc':'Ouvre « {{name}} » et gagne des bonus permanents !','rebirth.btn':'Ouvrir !','rebirth.cancel':'Annuler',
  'rebirth.warning':'Tu repars avec une boutique vide : stock, bâtiments, employés, fours et agrandissements sont perdus.','rebirth.keep':'Tu gardes ton argent, ton niveau, tes succès, tes statistiques et ta dette.',
  'rebirth.cost':'Coût : {{v}}','rebirth.bonus':'Bonus : +{{v}} %','rebirth.spaceBonus':'Espace multiplié par {{v}}','rebirth.done':'Bienvenue dans {{name}} ! Rebirth {{n}} !','rebirth.banner':'Ouvrir une NOUVELLE pâtisserie',
  'rename.title':'Renommer la pâtisserie','rename.placeholder':'Nouveau nom...','rename.btn':'Renommer','rename.done':'Pâtisserie renommée : {{n}} !',
  'common.close':'Fermer','common.yes':'Oui','common.cancel':'Annuler','common.next':'Continuer',
  'anticlick.cooldown':'Trop rapide ! Attends {{v}} s','anticlick.captcha':'Anti-robot : {{q}}','anticlick.wrong':'Mauvaise réponse !','anticlick.ok':'Merci !','anticlick.banned':'Banni pendant encore {{v}} !',
  'tab.rec':'Recettes','tab.sell':'Ventes','tab.bld':'Bâtiments','tab.emp':'Employés','tab.key':'Raccourci : touche {{v}}',
  'stats.title':'Statistiques','stats.totalEarned':'Argent total gagné','stats.totalCakes':'Gâteaux préparés','stats.totalSold':'Gâteaux vendus','stats.totalClicks':'Achats d\'ingrédients','stats.playTime':'Temps de jeu','stats.totalSalary':'Salaires payés','stats.totalRent':'Loyers payés','stats.totalIngCost':'Coût des ingrédients','stats.rebirths':'Rebirths','stats.buildings':'Bâtiments','stats.employees':'Employés','stats.ovens':'Fours','stats.events':'Événements vus','stats.achievements':'Succès','stats.sellBonus':'Bonus de prix de vente',
  'stats.shortcuts':'Raccourcis clavier : 1 à {{n}} pour les onglets, Échap pour mettre en pause ou fermer une fenêtre.',
  'tuto.skip':'Passer le tutoriel','tuto.ok':'OK',
  'tuto.step1':'Pour tes premiers cookies, clique sur les ingrédients : 2 Farine, 2 Sucre et 1 Oeuf.',
  'tuto.step2':'Parfait ! Dans l\'onglet Recettes, clique sur Préparer pour lancer tes cookies.',
  'tuto.step3':'Ça cuit ! Pendant ce temps, va dans l\'onglet Ventes.',
  'tuto.step4':'Dès que tes cookies sont prêts, vends-les avec Vendre ou Tout vendre !',
  'tuto.done':'Bravo, tu connais les bases ! Et maintenant, laisse-moi travailler. Surtout, ne clique pas sur moi.',
  'intro.hello':'Salut ! Moi, c\'est Bob. Et j\'ai une grande nouvelle : ta pâtisserie est ouverte !',
  'intro.name':'Il lui faut un nom, quand même. Comment veux-tu l\'appeler ?',
  'intro.namePlaceholder':'Le nom de ta pâtisserie','intro.nameError':'Il faut au moins une lettre !',
  'intro.money':'« {{n}} », j\'adore ! Tiens, voilà 50 € pour commencer. Ne dépense pas tout d\'un coup !',
  'intro.outfit':'Bon, je vais enfiler ma tenue de chef. On se retrouve en cuisine !<small class="bob-aside">(Entre nous, je ne dis jamais non à un peu de sucre.)</small>',
  'intro.go':'C\'est parti !','intro.moneyToast':'+50 € de la part de Bob !',
  'bob.p0':'Hé, ça chatouille !|Oui ? Je surveille le four.|Je suis Bob, pas un bouton !|Tu veux quelque chose ?',
  'bob.p1':'Tu as fini de cliquer ?|Attention à ma toque !|Hé ! Je travaille, moi !|Ça devient lourd, là.',
  'bob.p2':'Bon, ça commence à m\'énerver.|ARRÊTE de cliquer sur moi !|Je vais te mettre de la farine partout !|Tu n\'as pas des gâteaux à vendre ?',
  'bob.p3':'MAIS ÇA SUFFIT !|JE VAIS BRÛLER TOUS TES GÂTEAUX !|MON FOUET VA TE PARLER !|TU VAS ARRÊTER, OUI ?!',
  'bob.p4':'GRRRAAAH !|MES CIRCUITS SURCHAUFFENT !|ENCORE UN CLIC ET JE… JE…|J\'AI UN FOUR ET JE SAIS M\'EN SERVIR !|JE DÉMISSIONNE ! NON ! JE RESTE ET JE TE HAIS !',
  'bob.giveup':'…Bon. Tu as gagné. Je cède. Voilà l\'accès à la console. Mais il te faut le code. Et ne me parle plus.',
  'bob.needcode':'Le code. Sans le code, rien. Comme ma vie.',
  'bob.unlocked':'Tiens, ta console. Amuse-toi. Moi, je ne m\'amuse plus depuis longtemps.',
  'bob.sour':'Avant, j\'aimais les gâteaux.|Fais ce que tu veux. De toute façon…|Mes macarons ne valent plus rien, comme tout le reste.|Je n\'attends plus rien de toi.|Ah. Encore toi.|Seul un peu de sucre me remonterait, peut-être.|Laisse. Je fouette, c\'est tout.',
  'bob.calm':'Ta console est en bas à droite. Laisse-moi cuisiner !',
  'offline.title':'Bon retour !','offline.time':'Absent pendant {{t}}.','offline.ing':'Ingrédients produits : {{v}}','offline.sales':'Ventes automatiques : +{{v}}','offline.rent':'Loyer payé : -{{v}}','offline.salaries':'Salaires payés : -{{v}}','offline.unpaid':'Tu n\'avais pas de quoi payer tous les salaires : ton équipe a perdu le moral.','offline.saveError':'Ta sauvegarde était abîmée : la copie de secours a été chargée.','offline.saveLost':'Ta sauvegarde était abîmée et n\'a pas pu être lue. Elle a été mise de côté.',
  'gameover.title':'Faillite !','gameover.text':'Tu n\'as plus d\'argent, et ton stock ne suffit pas à rembourser ta dette...','gameover.sellCakes':'Tout vendre pour tenter de s\'en sortir','gameover.restart':'Recommencer',
  'event.price_surge':'Hausse des prix ! Ventes +30 % pendant {{t}} s','event.price_drop':'Chute des prix ! Ventes -20 % pendant {{t}} s',
  'event.inflation':'Inflation ! Ingrédients +25 % pendant {{t}} s','event.deflation':'Déflation ! Ingrédients -15 % pendant {{t}} s',
  'event.rush_hour':'Coup de feu ! Vendeurs x2 pendant {{t}} s','event.ingredient_sale':'Soldes ! Ingrédients -30 % pendant {{t}} s',
  'event.tax_break':'Réduction fiscale ! Loyer -50 % pendant {{t}} s','event.strike_wave':'Vague de grèves ! Moral -20',
  'event.lucky_day':'Jour de chance ! XP x3 pendant {{t}} s','event.inspection':'Inspection ! Ventes -10 % pendant {{t}} s',
  'event.customer_wave':'Vague de clients ! Ventes x2 pendant {{t}} s','event.power_outage':'Coupure de courant ! Production arrêtée {{t}} s',
  'event.sugar_rush':'Rush sucré ! Clics x3 pendant {{t}} s','event.food_critic':'Critique gastronomique ! Ventes +50 % pendant {{t}} s',
  'event.supplier_strike':'Grève des fournisseurs ! Ingrédients +50 % pendant {{t}} s','event.festival':'Festival ! Tout +15 % pendant {{t}} s',
  'event.bad_review':'Mauvais avis ! Ventes -25 % pendant {{t}} s','event.health_check':'Contrôle sanitaire ! Des gâteaux sont confisqués...',
  'event.tv_feature':'Passage à la télé ! XP x5 pendant {{t}} s','event.apprentice_day':'Journée des apprentis ! Vendeurs x2 pendant {{t}} s',
  'inv.egg_break':'Oups, {{v}} œuf(s) cassé(s) !','inv.milk_spill':'Du lait renversé : -{{v}}','inv.choco_expire':'Du chocolat périmé : -{{v}}','inv.flour_blown':'Un courant d\'air dans la farine : -{{v}}','inv.sugar_ants':'Des fourmis dans le sucre : -{{v}}','inv.butter_melt':'Le beurre a fondu : -{{v}}','inv.cream_sour':'De la crème a tourné : -{{v}}',
  'settings.title':'Réglages','settings.tabGeneral':'Général','settings.tabLook':'Apparence','settings.tabAudio':'Son','settings.tabSave':'Sauvegarde',
  'settings.lang':'Langue','settings.currency':'Monnaie','settings.theme':'Thème','settings.themeLight':'Clair','settings.themeDark':'Sombre','settings.themeSpring':'Printemps','settings.themeSummer':'Été','settings.themeFall':'Automne','settings.themeWinter':'Hiver','settings.themeBirthday':'Anniversaire',
  'settings.lockSeason':'seulement pendant la saison','settings.lockBirthday':'seulement le jour de ton anniversaire','settings.lockNoBirthday':'indique ton anniversaire d\'abord',
  'settings.birthday':'Anniversaire','settings.birthdayHelp':'Facultatif. Le jour J : thème spécial et bonus x2 pendant 24 h. Corriger la date plus tard coûte de l\'argent.','settings.birthdaySet':'Ton anniversaire : le {{d}}/{{m}}','settings.birthdayBtn':'Enregistrer','settings.birthdayDone':'Anniversaire enregistré !','settings.day':'Jour','settings.month':'Mois','birthday.boost':'Joyeux anniversaire ! Bonus x2 pendant 24 h !',
  'settings.reset':'Réinitialiser le jeu','settings.resetConfirm':'Es-tu SÛR de vouloir tout effacer ? Toutes tes sauvegardes seront perdues !','settings.resetDone':'Jeu réinitialisé !',
  'settings.cheatCode':'Code de la console','settings.cheatPlaceholder':'Entre le code...','settings.cheatUnlocked':'Console de commandes débloquée !','settings.cheatWrong':'Code incorrect.',
  'settings.music':'Musique','settings.musicOn':'Activée','settings.musicOff':'Coupée','settings.musicVolume':'Volume','settings.musicTrack':'Morceau',
  'settings.sound':'Bruitages','settings.soundOn':'Activés','settings.soundOff':'Coupés',
  'settings.particles':'Particules et effets','settings.particlesOn':'Activés','settings.particlesOff':'Réduits',
  'settings.export':'Exporter la partie','settings.import':'Importer une partie','settings.exportBtn':'Copier','settings.importBtn':'Charger','settings.importPlaceholder':'Colle ton code ici...','settings.exported':'Code copié !','settings.imported':'Partie importée !','settings.importError':'Code invalide !','settings.saveFull':'Impossible de sauvegarder : le stockage du navigateur est plein !',
  'console.title':'Console de commandes','console.placeholder':'Tape une commande...','console.send':'OK','console.commands':'Commandes',
  'console.themesUnlocked':'Tous les thèmes sont débloqués pour toujours !','console.themeUnlocked':'{{n}} débloqué pour toujours !','console.unknownTheme':'Thème inconnu : {{n}}','console.themeLocked':'Thème verrouillé. Essaie /theme unlock.',
  'console.help':'Commandes : /help, /level, /money, /max, /unmax, /undo, /building, /employee, /stats, /xp, /space, /debt, /theme, /buy, /sell, /random, /time, /bakery, /bank, /birthday, /gameover, /reset, /(ingrédient), /(recette). Clique sur le bouton Commandes pour tout comprendre.',
  'ban.message':'Tu es banni pendant {{v}} minutes !',
  'lvl1000.title':'FÉLICITATIONS !','lvl1000.text':'Tu as atteint le niveau 1000 ! Tu es un Maître Pâtissier Légendaire !',
  'debt.pay':'Rembourser','debt.paid':'{{v}} remboursés !','debt.cantPay':'Tu n\'as pas d\'argent pour rembourser !',
  'pause.title':'Pause','pause.resume':'Reprendre',
  'bakery.title':'Mes pâtisseries','bakery.current':'Actuelle','bakery.go':'Y aller','bakery.sell':'Vendre','bakery.value':'Valeur : {{v}}','bakery.sold':'Pâtisserie vendue pour {{v}} !','bakery.openNew':'Ouvrir une nouvelle pâtisserie','bakery.opened':'Nouvelle pâtisserie ouverte : {{n}} !','bakery.help':'Chaque pâtisserie a son argent et son stock, et toutes travaillent en même temps.',
};

// ======================== ENGLISH ========================
LANGS.en = {
  'bob.sugar3':'Sugar… I\'m still sad, but a little less.|Mmm. It doesn\'t fix everything, but it helps.','bob.sugar2':'More sugar… I think I feel a bit better.|Oh. That does feel good.','bob.sugar1':'I\'m almost smiling. One more sugar, maybe…|I\'m hardly sad anymore.','bob.sugar0':'Thanks! I\'m in a good mood again!|I like you after all.',
  'bld.unlocked':'Level 40! You can buy buildings now: they produce ingredients on their own. Check the Buildings tab.',
  'ach.lockedDesc':'???','ach.secretsFound':'+ {{v}} secret(s)','ach.nameOrders':'{{v}} order(s) delivered','ach.descOrders':'Deliver {{v}} order(s).','ach.nameLoans':'{{v}} loan(s) taken','ach.descLoans':'Take {{v}} loan(s).','ach.nameRepaid':'{{v}} loan(s) repaid','ach.descRepaid':'Repay {{v}} loan(s).','ach.nameMachine':'{{n}}: level {{v}}','ach.descMachine':'Bring {{n}} to level {{v}}.',
  'rb.1':'Bakehouse','rb.2':'Fine Patisserie','rb.3':'Luxury House','rb.4':'Gastronomic Palace','rb.5':'Pastry Empire','rb.6':'Sweet Dynasty','rb.7':'Eternal Legend',
  'settings.tabAch':'Achievements','settings.tabStats':'Statistics',
  'mus.default':'Gentle Melody','mus.waltz':'Sugar Waltz','mus.joy':'Pastry Joy','mus.calm':'Evening Sweetness','mus.oven':'Oven Rhythm','mus.night':'Cream Night','mus.spring':'Waltz of the Flowers','mus.summer':'Gentle Waves','mus.fall':'Caramel Leaves','mus.winter':'Icing Sugar','mus.birthday':'Happy Birthday',
  'adv.order':'{{n}}\'s order expires in {{t}}!','adv.empStrike':'{{n}} is on strike!','adv.empSoon':'{{n}} will go on strike soon.','adv.space':'Your stock is overflowing: {{v}}% of your space is full.','adv.slow':'{{n}} is selling badly: price at {{v}}%.','adv.rent':'Your rent is too high: it eats {{v}}% of your income.','adv.rentNone':'You\'re paying rent and earning almost nothing.',
  'order.title':'Orders','tab.orders':'Orders','order.doneCount':'{{v}} delivered','order.help':'Customers place orders. Bake what they want and deliver before time runs out: the harder the order, the bigger the bonus.','order.none':'No orders right now. Customers will show up soon!','order.level1':'Simple','order.level2':'Medium','order.level3':'Hard','order.level4':'Extreme','order.prime':'including {{v}} bonus','order.deliver':'Deliver','order.delivered':'Order delivered: +{{v}}!','order.new':'New order!','order.butler':'{{v}} head waiter(s) deliver whatever is ready.','order.butlerDone':'{{n}} delivered an order: +{{v}}!','order.unlocked':'Level 30! Customers place orders now. Check the Orders tab.',
  'emp.maitre':'Head waiter','emp.desc.maitre':'Delivers customer orders for you, as soon as the stock is ready.',
  'mach.title':'Machine shop','tab.machines':'Machines','mach.help':'Upgrades that last forever, for all your bakeries, even after a rebirth. They cost a lot.','mach.buy':'Buy ({{v}})','mach.max':'Maxed out','mach.bought':'Machine installed!','mach.now':'Current bonus: {{v}}%','mach.unlocked':'Level 50! The machine shop is open. It\'s expensive, but it\'s forever.',
  'mach.petrin':'Industrial mixer','mach.petrin.d':'Baking {{v}}% faster per level.','mach.isolant':'Shop insulation','mach.isolant.d':'Rent {{v}}% cheaper per level.','mach.robot':'Kitchen robot','mach.robot.d':'Ingredients {{v}}% cheaper per level.','mach.fourturbo':'Convection oven','mach.fourturbo.d':'{{v}} more ovens per level.','mach.convoyeur':'Conveyor belt','mach.convoyeur.d':'Buildings {{v}}% more productive per level.','mach.caisse':'Self-checkout','mach.caisse.d':'Sellers {{v}}% faster per level.','mach.etiquette':'Luxury labeler','mach.etiquette.d':'Prices drop {{v}}% slower when you sell, per level.','mach.vitrine':'Chilled display','mach.vitrine.d':'Sale prices +{{v}}% per level.','mach.guichet':'Order desk','mach.guichet.d':'Order bonuses +{{v}}% per level.','mach.academie':'Taste academy','mach.academie.d':'XP +{{v}}% per level.',
  'rent.late':'Rent is late! If you don\'t find money, a debt starts in {{v}}.',
  'bakery.level':'Level {{v}}','bakery.money':'Money: {{v}}','bakery.debt':'Debt: {{v}}','bakery.sellTitle':'Sell "{{n}}"?','bakery.sellWarn':'You lose this bakery and all its statistics. Your achievements stay.','bakery.partCash':'Cash in the till','bakery.partStock':'Cakes in stock','bakery.partIng':'Ingredients','bakery.partEquip':'Buildings, ovens and space','bakery.partRep':'Reputation and goodwill','bakery.partDebt':'Debt to repay','bakery.partTotal':'Sale price','bakery.sellConfirm':'Sell','bakery.best':'Best earner','bakery.bestChart':'The cake that earns the most','bakery.bestChartSub':'in each bakery, in money earned','bakery.noBest':'Nothing sold yet',
  'bank.saving':'You save {{v}} of interest','bank.levelReq':'Level {{v}} required','bank.repayNow':'Repay ({{v}})','bank.limitHelp':'The higher your level, the more the bank trusts you.',
  'settings.themeScope':'Apply','settings.scopeAll':'To the whole game','settings.scopeHere':'To this bakery','settings.ownTheme':'This bakery has its own theme.','settings.ownThemeReset':'Follow the game theme','settings.themeParty':'Party','settings.themeSpace':'Space','settings.lockLevel':'at level {{v}}','settings.themeEnded':'The season is over: its theme is no longer available.',
  'settings.birthdayFix':'Correct it ({{v}})','settings.birthdayFixed':'Date corrected!','settings.birthdayHelpFix':'Made a mistake? Correcting the date costs {{v}}.',
  'bob.debtBonus':'And here, {{v}} from my own pocket to help you. Don\'t tell anyone.',
  'bob.challengeHello':'Psst! I have a challenge for you. {{d}}. You have 24 hours. Succeed, and I\'ll give you 5% of all your money, which is {{v}} right now!','bob.challengeYes':'I accept!','bob.challengeNo':'Not this time','bob.challengeNoLine':'Too bad. I\'ll be back in a few days.','bob.challengeWin':'Challenge complete! Here\'s {{v}}, well deserved.','bob.challengeLost':'The challenge is over. Missed it! We\'ll try again later.',
  'chal.banner':'Bob\'s challenge','chal.sold':'Sell {{v}} pieces','chal.made':'Bake {{v}} pieces','chal.earned':'Earn {{v}}','chal.buildings':'Buy {{v}} buildings','chal.orders':'Deliver {{v}} orders',
  'console.mostUsed':'Your most used commands','console.challengeStarted':'Bob offers you a challenge.','console.maxDone':'Everything is maxed out. Ingredients: the rarer they are, the fewer you can have.',
  'footer.rights':'Turbonix Entertainment. All rights reserved.','footer.icons':'Icons:',
  'tab.bank':'Bank',
  'bank.title':'Bank','bank.whatIs':'Bob, what\'s a loan?','bank.balance':'Your account','bank.toRepay':'Left to repay','bank.perMin':'Taken per minute','bank.rentDebt':'Rent debt',
  'bank.active':'Your current loans','bank.offers':'Ask for a loan','bank.loanOf':'{{v}} loan','bank.remaining':'{{v}} left','bank.late':'Late: not enough money, this loan keeps getting more expensive.','bank.autoPay':'{{v}} taken per minute','bank.repayAll':'Repay it all ({{v}})',
  'bank.rate':'Interest','bank.repay':'To repay','bank.during':'Over','bank.minutes':'{{v}} min','bank.borrow':'Borrow','bank.inProgress':'In progress','bank.oneEach':'Only one loan of each amount at a time. Repayments are taken from your money automatically.',
  'bank.taken':'{{v}} in your account!','bank.repaid':'Loan repaid!','bank.finished':'{{v}} loan repaid!',
  'bank.bobDebt':'Ouch. You can\'t pay the rent anymore: you have {{v}} of debt. Don\'t panic, I opened a bank account for you. Look, there\'s a new tab: Bank.',
  'bank.bobLoan':'At the bank, you can ask for a loan. A loan is simple: the bank gives you money right away, and you pay it back little by little.',
  'bank.bobInterest':'But you always pay back a bit more than you received: that little extra is called interest. For example, you borrow {{a}} and repay {{b}}. It\'s taken automatically, a little each second.',
  'bank.bobAdvice':'If you run out of money when a payment is due, the loan keeps getting more expensive. So only borrow what you know you can repay. And repaying early costs less: right after borrowing, you lose nothing!',
  'bank.bobGo':'See the bank',
  'rename.price':'Changing your bakery\'s name costs {{v}}.','rename.noMoney':'You need {{v}} to rename it.',
  'offline.loans':'Loans repaid: -{{v}}',
  'stats.totalInvested':'Investments','stats.loansTaken':'Loans taken','stats.interestPaid':'Interest paid','stats.viewHere':'This bakery','stats.viewCharts':'Charts','stats.viewAll':'All my bakeries',
  'stats.teaser':'Open a second bakery to unlock charts and totals across all your shops.',
  'chart.log':'logarithmic scale','chart.perMin':'/min','chart.empty':'Not enough data yet. Curves appear after one minute of play in this bakery.',
  'chart.kpiRate':'Recent income','chart.kpiRateHelp':'Average over the last 10 minutes of play.','chart.kpiMargin':'Gross margin','chart.kpiMarginHelp':'What\'s left of sales after ingredients.','chart.kpiAvg':'Average price','chart.kpiAvgHelp':'Total income divided by pieces sold.','chart.kpiFixed':'Fixed costs','chart.kpiFixedHelp':'Rent and wages, due no matter what.','chart.kpiBreak':'Break-even','chart.kpiBreakHelp':'Pieces to sell per hour to cover costs.','chart.kpiDemand':'Demand index','chart.kpiDemandHelp':'100% = normal price, average of your recipes.',
  'chart.wealth':'Your money','chart.wealthSub':'over play time','chart.money':'Money','chart.flow':'Money in and out','chart.flowSub':'euros per minute of play','chart.in':'In','chart.out':'Out','chart.level':'Your progress','chart.levelSub':'level over play time','chart.levelName':'Level','chart.costs':'Where your money goes','chart.costsSub':'{{v}} spent in total','chart.top':'Your star recipes','chart.topSub':'the 8 most baked, in pieces','chart.showTable':'Show the numbers','chart.hideTable':'Hide the numbers','chart.spent':'Spent',
  'all.bakeries':'Bakeries','all.money':'Combined money','all.ach':'Achievements unlocked, all shops','all.achHelp':'Achievements are shared by all your bakeries, and the totals below also count towards them.','all.achCat':'Achievements by category','all.achCatSub':'number of achievements unlocked','all.compare':'Comparison','all.compareSub':'total money earned by each shop','all.name':'Bakery','all.achHere':'Achievements earned here','all.totals':'Totals of all bakeries',
  'bakery.statsUnlocked':'Two shops! Check Settings, Statistics: I prepared charts and the totals of all your bakeries.',
  'settings.langHelp':'The language of the whole game.','settings.currencyHelp':'For showing your prices.','settings.birthdayHelpSet':'It can\'t be changed anymore.','settings.themeHelp':'Seasons and your birthday are only available at the right time.','settings.particlesHelp':'Confetti, coins and moving scenery.','settings.musicHelp':'It starts on your first click.','settings.soundHelp':'The little noises when you click or sell.','settings.saveNowTitle':'Automatic save','settings.saveHelp':'Every 30 seconds, in this browser.','settings.saveNow':'Save','settings.saved':'Game saved!','settings.exportHelp':'Keep this code: it holds your whole game.','settings.importHelp':'Paste a code to get a game back. It replaces this one.','settings.resetHelp':'Erases everything, with no way back.','settings.resetBtn':'Erase everything',
  'pause.kicker':'Time is stopped','pause.sub':'{{n}} · {{t}} played','pause.money':'Money','pause.level':'Level','pause.baking':'In the oven','pause.achievements':'Achievements','pause.key':'Esc','pause.musicOn':'Music: on','pause.musicOff':'Music: off','pause.soundOn':'Sounds: on','pause.soundOff':'Sounds: off',
  'pause.tips':'Selling less at a time lowers prices less.|A good seller sells on their own, even when you\'re away.|Check a recipe\'s profit before baking it.|Buildings save you time: buy the ones for the ingredients you use most.|One more oven means one more batch at the same time.|Demand comes back with time: vary your recipes.|Each achievement raises your sale prices a little.|Above all, don\'t click on me too much.',
  'console.guideTitle':'Command guide','console.guideHelp':'Click an example to put it in the console, then press Enter.','console.guideSearch':'Search a command...','console.guideAll':'All','console.guideTry':'Try:','console.guideNone':'No command matches.','console.guideDanger':'Careful: there is no going back.',
  'console.bankUnlocked':'Bank tab opened!','console.bankCleared':'All loans cleared.','console.bakeryCreated':'"{{n}}" created: bakery no. {{i}}.','console.bakeryDeleted':'"{{n}}" deleted.','console.bakeryLast':'Not possible: this is your last bakery.','console.bakeryUnknown':'Unknown number. Your bakeries:',
  'level':'Lv. {{v}}',
  'ing.title':'Ingredients','ing.locked':'Level {{v}}','ing.perClick':'+{{v}} / click','ing.cost':'Cost: {{v}}','ing.autoRate':'{{v}}/s',
  'ing.resell':'Resell','ing.craftBtn':'Craft','ing.craftTime':'Crafting: {{v}}','ing.search':'Search...','ing.noMoney':'Not enough money!',
  'ing.craftTip':'Makes {{q}} for {{c}} of ingredients (buying: {{b}})','ing.resellTip':'Resell {{q}} for {{v}}','bulk.label':'Amount','bulk.max':'Max',
  'xp.text':'{{c}} / {{n}} XP','xp.level':'Level {{v}}!',
  'space.label':'Space','space.text':'{{u}} / {{m}} m²','space.buy':'+{{a}} m² for {{c}}','space.locked':'Lv. {{v}} required','space.max':'Max space!','space.rent':'Rent: {{v}}/h','space.debt':'Debt: {{v}}','space.noSpace':'Not enough space','space.refund':'No more space: ingredients returned!',
  'oven.label':'Ovens: {{a}} / {{m}}','oven.queue':'{{v}} waiting','oven.title':'Ovens','oven.desc':'Each oven bakes one batch at a time. The others wait their turn.','oven.buy':'+1 oven for {{c}}','oven.max':'All ovens bought','oven.bought':'New oven!',
  'rec.title':'Recipes','rec.prepare':'Prepare','rec.prepareMax':'Max','rec.noIng':'Missing ingredients','rec.noSpace':'Not enough space','rec.queueFull':'Queue is full','rec.prepared':'{{e}} {{n}} in the oven!','rec.preparedMany':'{{e}} {{q}} batches of {{n}} in the oven!','rec.ready':'{{q}} {{n}} ready!','rec.xp':'XP: +{{v}}','rec.time':'{{v}}',
  'rec.cost':'Cost: {{v}}','rec.revenue':'Sale: {{v}}','rec.profit':'Profit: {{v}}','rec.buyMissing':'Buy what\'s missing ({{v}})','rec.search':'Search a recipe...','rec.onlyMakable':'Can make','rec.onlyFav':'Favorites','rec.sortNew':'Newest','rec.sortOld':'Oldest','rec.sortProfit':'Most profitable','rec.fav':'Favorite','rec.none':'No recipe matches.','rec.bought':'Ingredients bought!',
  'sell.title':'Sales','sell.stock':'Stock: {{v}}','sell.sell':'Sell 1','sell.sellAll':'Sell all','sell.sellAllGlobal':'Sell all ({{v}})','sell.earned':'+{{v}} for {{q}} {{e}}','sell.earnedAll':'+{{v}}!','sell.price':'{{v}}/piece','sell.noStock':'Nothing to sell yet.','sell.inflUp':'↑ +{{v}}%','sell.inflDown':'↓ {{v}}%',
  'bld.title':'Buildings','bld.buy':'Buy','bld.qty':'x{{v}}','bld.prod':'{{v}}/s','bld.locked':'Lv. {{v}}','bld.bought':'{{n}} bought!','bld.none':'Not enough money!',
  'emp.title':'Employees','emp.fire':'Fire','emp.fireConfirm':'Really fire {{n}}?','emp.salary':'Salary: {{v}}/h','emp.morale':'Morale','emp.assign':'Assigned to','emp.working':'Working','emp.striking':'On strike!','emp.poor':'Poor work','emp.bonus':'Bonus +25 morale ({{v}})','emp.bonusDone':'Bonus paid!',
  'emp.event.quit':'{{n}} quit!','emp.event.strike':'{{n}} is on strike!',
  'emp.totalSalary':'Wages: {{v}}/h',
  'emp.carrier':'Carrier','emp.desc.carrier':'Carries money, cakes or ingredients to another of your bakeries.','carry.to':'To','carry.what':'Carries','carry.money':'Money','carry.cakes':'Cakes','carry.ings':'Ingredients','carry.noShop':'They need another bakery.','emp.collector':'Collector','emp.baker':'Baker','emp.seller':'Seller','emp.manager':'Manager','emp.chef':'Head chef',
  'emp.desc.collector':'Produces an ingredient on their own.','emp.desc.baker':'Adds an oven and bakes 5% faster.','emp.desc.seller':'Sells your cakes on their own.','emp.desc.manager':'Lifts the whole team\'s morale.','emp.desc.chef':'Bakes 8% faster and raises prices by 5%.',
  'emp.skill':'Skill {{v}}','emp.train':'Train','emp.trainBtn':'Train to next level ({{v}})','emp.trained':'Employee trained!','emp.info':'Employee info','emp.levelTxt':'Level {{v}}','emp.recruit':'Recruit','emp.recruitBtn':'{{n}} ({{c}})','emp.recruitHint':'Recruiting right away costs more than waiting for an applicant.','emp.hired':'Hired!',
  'emp.applicant':'New applicant!','emp.applicants':'Applicants','emp.accept':'Hire','emp.reject':'Reject','emp.noApplicants':'No applicants right now.','emp.lockedAll':'Employees arrive at level 5.',
  'ach.title':'Achievements','ach.unlocked':'Achievement: {{n}}!','ach.secretFound':'Secret achievement: {{n}}!','ach.bonus':'Prestige: your achievements raise your sale prices by +{{v}}%','ach.hiddenCount':'Secrets found: {{a}} / {{b}}','ach.hiddenName':'???','ach.hiddenDesc':'Secret achievement. Find it yourself!',
  'ach.cat.general':'General','ach.cat.cakes':'Cakes','ach.cat.money':'Money','ach.cat.level':'Levels','ach.cat.shop':'Shop','ach.cat.recipes':'Recipes','ach.cat.buildings':'Buildings','ach.cat.stock':'Stock','ach.cat.secret':'Secrets',
  'ach.descRecipe':'Bake {{v}} {{n}}.','ach.descBuilding':'Own {{v}} {{n}} at once.','ach.descStock':'Hold {{v}} {{n}}.',
  'rebirth.title':'New bakery!','rebirth.desc':'Open "{{name}}" and earn permanent bonuses!','rebirth.btn':'Open!','rebirth.cancel':'Cancel',
  'rebirth.warning':'You restart with an empty shop: stock, buildings, employees, ovens and expansions are lost.','rebirth.keep':'You keep your money, level, achievements, statistics and debt.',
  'rebirth.cost':'Cost: {{v}}','rebirth.bonus':'Bonus: +{{v}}%','rebirth.spaceBonus':'Space multiplied by {{v}}','rebirth.done':'Welcome to {{name}}! Rebirth {{n}}!','rebirth.banner':'Open a NEW bakery',
  'rename.title':'Rename bakery','rename.placeholder':'New name...','rename.btn':'Rename','rename.done':'Bakery renamed: {{n}}!',
  'common.close':'Close','common.yes':'Yes','common.cancel':'Cancel','common.next':'Continue',
  'anticlick.cooldown':'Too fast! Wait {{v}}s','anticlick.captcha':'Anti-bot: {{q}}','anticlick.wrong':'Wrong answer!','anticlick.ok':'Thanks!','anticlick.banned':'Banned for another {{v}}!',
  'tab.rec':'Recipes','tab.sell':'Sales','tab.bld':'Buildings','tab.emp':'Employees','tab.key':'Shortcut: key {{v}}',
  'stats.title':'Statistics','stats.totalEarned':'Total money earned','stats.totalCakes':'Cakes baked','stats.totalSold':'Cakes sold','stats.totalClicks':'Ingredient purchases','stats.playTime':'Play time','stats.totalSalary':'Wages paid','stats.totalRent':'Rent paid','stats.totalIngCost':'Ingredient cost','stats.rebirths':'Rebirths','stats.buildings':'Buildings','stats.employees':'Employees','stats.ovens':'Ovens','stats.events':'Events seen','stats.achievements':'Achievements','stats.sellBonus':'Sale price bonus',
  'stats.shortcuts':'Keyboard shortcuts: 1 to {{n}} for tabs, Esc to pause or close a window.',
  'tuto.skip':'Skip tutorial','tuto.ok':'OK',
  'tuto.step1':'For your first cookies, click the ingredients: 2 Flour, 2 Sugar and 1 Egg.',
  'tuto.step2':'Perfect! In the Recipes tab, click Prepare to start your cookies.',
  'tuto.step3':'They\'re baking! Meanwhile, go to the Sales tab.',
  'tuto.step4':'As soon as your cookies are ready, sell them with Sell or Sell all!',
  'tuto.done':'Well done, you know the basics! Now let me work. Above all, don\'t click on me.',
  'intro.hello':'Hi! I\'m Bob. And I have great news: your bakery is open!',
  'intro.name':'It needs a name, though. What do you want to call it?',
  'intro.namePlaceholder':'Your bakery\'s name','intro.nameError':'At least one letter, please!',
  'intro.money':'"{{n}}", I love it! Here, take 50€ to get started. Don\'t spend it all at once!',
  'intro.outfit':'Right, I\'ll go put on my chef outfit. See you in the kitchen!<small class="bob-aside">(Between us, I never say no to a bit of sugar.)</small>',
  'intro.go':'Let\'s go!','intro.moneyToast':'+50€ from Bob!',
  'bob.p0':'Hey, that tickles!|Yes? I\'m watching the oven.|I\'m Bob, not a button!|Do you want something?',
  'bob.p1':'Are you done clicking?|Careful with my hat!|Hey! I\'m working here!|This is getting old.',
  'bob.p2':'OK, this is getting annoying.|STOP clicking on me!|I\'ll throw flour all over you!|Don\'t you have cakes to sell?',
  'bob.p3':'THAT\'S ENOUGH!|I\'LL BURN ALL YOUR CAKES!|MY WHISK WILL HAVE A WORD WITH YOU!|WILL YOU STOP?!',
  'bob.p4':'GRRRAAAH!|MY CIRCUITS ARE OVERHEATING!|ONE MORE CLICK AND I… I…|I HAVE AN OVEN AND I KNOW HOW TO USE IT!|I QUIT! NO! I\'M STAYING AND I HATE YOU!',
  'bob.giveup':'…Fine. You win. I give up. Here\'s console access. But you need the code. And don\'t talk to me.',
  'bob.needcode':'The code. No code, nothing. Like my life.',
  'bob.unlocked':'There\'s your console. Have fun. I stopped having fun long ago.',
  'bob.sour':'I used to love cakes.|Do what you want. It doesn\'t matter…|My macarons are worthless, like everything else.|I expect nothing from you anymore.|Oh. You again.|Only a bit of sugar might cheer me up.|Leave it. I just whisk now.',
  'bob.calm':'Your console is at the bottom right. Let me cook!',
  'offline.title':'Welcome back!','offline.time':'Away for {{t}}.','offline.ing':'Ingredients produced: {{v}}','offline.sales':'Auto-sales: +{{v}}','offline.rent':'Rent paid: -{{v}}','offline.salaries':'Wages paid: -{{v}}','offline.unpaid':'You couldn\'t pay all the wages: your team lost morale.','offline.saveError':'Your save was damaged: the backup copy was loaded.','offline.saveLost':'Your save was damaged and could not be read. It has been set aside.',
  'gameover.title':'Bankrupt!','gameover.text':'You\'re out of money, and your stock can\'t cover your debt...','gameover.sellCakes':'Sell everything and try to recover','gameover.restart':'Restart',
  'event.price_surge':'Price surge! Sales +30% for {{t}}s','event.price_drop':'Price drop! Sales -20% for {{t}}s',
  'event.inflation':'Inflation! Ingredients +25% for {{t}}s','event.deflation':'Deflation! Ingredients -15% for {{t}}s',
  'event.rush_hour':'Rush hour! Sellers x2 for {{t}}s','event.ingredient_sale':'Sale! Ingredients -30% for {{t}}s',
  'event.tax_break':'Tax break! Rent -50% for {{t}}s','event.strike_wave':'Strike wave! Morale -20',
  'event.lucky_day':'Lucky day! XP x3 for {{t}}s','event.inspection':'Inspection! Sales -10% for {{t}}s',
  'event.customer_wave':'Customer wave! Sales x2 for {{t}}s','event.power_outage':'Power outage! Production stopped {{t}}s',
  'event.sugar_rush':'Sugar rush! Clicks x3 for {{t}}s','event.food_critic':'Food critic! Sales +50% for {{t}}s',
  'event.supplier_strike':'Supplier strike! Ingredients +50% for {{t}}s','event.festival':'Festival! Everything +15% for {{t}}s',
  'event.bad_review':'Bad review! Sales -25% for {{t}}s','event.health_check':'Health check! Some cakes are confiscated...',
  'event.tv_feature':'TV feature! XP x5 for {{t}}s','event.apprentice_day':'Apprentice day! Sellers x2 for {{t}}s',
  'inv.egg_break':'Oops, {{v}} egg(s) broken!','inv.milk_spill':'Spilled milk: -{{v}}','inv.choco_expire':'Expired chocolate: -{{v}}','inv.flour_blown':'A draft in the flour: -{{v}}','inv.sugar_ants':'Ants in the sugar: -{{v}}','inv.butter_melt':'The butter melted: -{{v}}','inv.cream_sour':'Some cream went sour: -{{v}}',
  'settings.title':'Settings','settings.tabGeneral':'General','settings.tabLook':'Appearance','settings.tabAudio':'Sound','settings.tabSave':'Save',
  'settings.lang':'Language','settings.currency':'Currency','settings.theme':'Theme','settings.themeLight':'Light','settings.themeDark':'Dark','settings.themeSpring':'Spring','settings.themeSummer':'Summer','settings.themeFall':'Fall','settings.themeWinter':'Winter','settings.themeBirthday':'Birthday',
  'settings.lockSeason':'only during the season','settings.lockBirthday':'only on your birthday','settings.lockNoBirthday':'set your birthday first',
  'settings.birthday':'Birthday','settings.birthdayHelp':'Optional. On the day: a special theme and a x2 bonus for 24h. Correcting the date later costs money.','settings.birthdaySet':'Your birthday: {{d}}/{{m}}','settings.birthdayBtn':'Save','settings.birthdayDone':'Birthday saved!','settings.day':'Day','settings.month':'Month','birthday.boost':'Happy birthday! x2 bonus for 24h!',
  'settings.reset':'Reset game','settings.resetConfirm':'Are you SURE you want to erase everything? All saves will be lost!','settings.resetDone':'Game reset!',
  'settings.cheatCode':'Console code','settings.cheatPlaceholder':'Enter the code...','settings.cheatUnlocked':'Command console unlocked!','settings.cheatWrong':'Wrong code.',
  'settings.music':'Music','settings.musicOn':'On','settings.musicOff':'Off','settings.musicVolume':'Volume','settings.musicTrack':'Track',
  'settings.sound':'Sound effects','settings.soundOn':'On','settings.soundOff':'Off',
  'settings.particles':'Particles and effects','settings.particlesOn':'On','settings.particlesOff':'Reduced',
  'settings.export':'Export save','settings.import':'Import save','settings.exportBtn':'Copy','settings.importBtn':'Load','settings.importPlaceholder':'Paste your code here...','settings.exported':'Code copied!','settings.imported':'Save imported!','settings.importError':'Invalid code!','settings.saveFull':'Can\'t save: browser storage is full!',
  'console.title':'Command console','console.placeholder':'Type a command...','console.send':'OK','console.commands':'Commands',
  'console.themesUnlocked':'All themes unlocked forever!','console.themeUnlocked':'{{n}} unlocked forever!','console.unknownTheme':'Unknown theme: {{n}}','console.themeLocked':'Theme locked. Try /theme unlock.',
  'console.help':'Commands: /help, /level, /money, /max, /unmax, /undo, /building, /employee, /stats, /xp, /space, /debt, /theme, /buy, /sell, /random, /time, /bakery, /bank, /birthday, /gameover, /reset, /(ingredient), /(recipe). Click the Commands button to understand them all.',
  'ban.message':'You are banned for {{v}} minutes!',
  'lvl1000.title':'CONGRATULATIONS!','lvl1000.text':'You reached level 1000! You are a Legendary Master Baker!',
  'debt.pay':'Repay','debt.paid':'{{v}} repaid!','debt.cantPay':'You have no money to repay!',
  'pause.title':'Paused','pause.resume':'Resume',
  'bakery.title':'My bakeries','bakery.current':'Current','bakery.go':'Go','bakery.sell':'Sell','bakery.value':'Value: {{v}}','bakery.sold':'Bakery sold for {{v}}!','bakery.openNew':'Open a new bakery','bakery.opened':'New bakery opened: {{n}}!','bakery.help':'Each bakery has its own money and stock, and they all work at the same time.',
};

(function() {
  var frIng = {farine:'Farine',oeuf:'Œufs',sucre:'Sucre',beurre:'Beurre',lait:'Lait',cacao:'Cacao',fraise:'Fraises',chocolat:'Chocolat',vanille:'Vanille',creme:'Crème',amande:'Amandes',miel:'Miel',citron:'Citron',pomme:'Pommes',cannelle:'Cannelle',cafe:'Café',pistache:'Pistache',caramel:'Caramel',framb:'Framboises',noixcoco:'Noix de coco',safran:'Safran',truffe:'Truffe',orfeuille:'Or alimentaire',matcha:'Matcha',mangue:'Mangue',lavande:'Lavande',noisette:'Noisettes',gingembre:'Gingembre',rhum:'Rhum',rose:'Rose',bergamote:'Bergamote',yuzu:'Yuzu',praline:'Praline',meringue:'Meringue',mascarpone:'Mascarpone',cardamome:'Cardamome',anis:'Anis étoilé',piment:'Piment',wasabi:'Wasabi',edelfleiss:'Edelweiss',ambrosie:'Ambroisie',nectar:'Nectar divin',poudreetoile:'Poudre d\'étoile',essencetps:'Essence du temps',cristalceleste:'Cristal céleste',flamcosm:'Flamme cosmique',infinipur:'Infini pur'};
  var enIng = {farine:'Flour',oeuf:'Eggs',sucre:'Sugar',beurre:'Butter',lait:'Milk',cacao:'Cocoa',fraise:'Strawberries',chocolat:'Chocolate',vanille:'Vanilla',creme:'Cream',amande:'Almonds',miel:'Honey',citron:'Lemon',pomme:'Apples',cannelle:'Cinnamon',cafe:'Coffee',pistache:'Pistachio',caramel:'Caramel',framb:'Raspberries',noixcoco:'Coconut',safran:'Saffron',truffe:'Truffle',orfeuille:'Edible gold',matcha:'Matcha',mangue:'Mango',lavande:'Lavender',noisette:'Hazelnuts',gingembre:'Ginger',rhum:'Rum',rose:'Rose',bergamote:'Bergamot',yuzu:'Yuzu',praline:'Praline',meringue:'Meringue',mascarpone:'Mascarpone',cardamome:'Cardamom',anis:'Star anise',piment:'Chili',wasabi:'Wasabi',edelfleiss:'Edelweiss',ambrosie:'Ambrosia',nectar:'Divine nectar',poudreetoile:'Stardust',essencetps:'Time essence',cristalceleste:'Celestial crystal',flamcosm:'Cosmic flame',infinipur:'Pure infinity'};
  var frRec = {cookie:'Cookies x6',cake:'Gâteau simple',crepe:'Crêpes x8',madel:'Madeleines x4',pancake:'Pancakes x10',brownie:'Brownie',muffin:'Muffins x6',eclair:'Éclairs x4',fraisier:'Fraisier',fondant:'Fondant au chocolat',tiramisu:'Tiramisu',cheesecake:'Cheesecake',chouquette:'Chouquettes x12',tarte_cit:'Tarte au citron',macaron:'Macarons x8',millefeuille:'Mille-feuille',tarte_pom:'Tarte aux pommes',parisb:'Paris-Brest',opera:'Opéra',baba:'Baba au rhum',canele:'Canelés x6',saintho:'Saint-Honoré',pistamac:'Macarons pistache x6',mousse_ch:'Mousse au chocolat',cremet:'Crème brûlée x4',trop:'Tropézienne',coconut:'Gâteau coco',caramelia:'Caramélia',framboisier:'Framboisier',royale:'Galette des rois',safranc:'Gâteau au safran',montblanc:'Mont-Blanc',truffecake:'Gâteau à la truffe',croquemb:'Croquembouche',piecemont:'Pièce montée',goldengate:'Gâteau en or',matchacake:'Gâteau matcha',manguier:'Manguier',lavandine:'Lavandine',pralineur:'Pralineur',gingemb:'Pain d\'épices',rhumba:'Baba royal',rosecake:'Gâteau à la rose',bergamotte:'Gâteau bergamote',yuzutart:'Tarte au yuzu',pralineroyal:'Praliné royal',meringuee:'Meringue céleste',tiramigrand:'Tiramisu impérial',cardamomecake:'Gâteau cardamome',anisstar:'Étoile anisée',volcancake:'Volcan au chocolat',cloudcake:'Gâteau nuage',wasabisurp:'Surprise wasabi',ambrosiacake:'Gâteau d\'ambroisie',nectarcake:'Gâteau au nectar',rainbowcake:'Gâteau arc-en-ciel',temporalcake:'Gâteau temporel',celestecake:'Gâteau céleste',cosmocake:'Gâteau cosmique',infinicake:'Gâteau infini'};
  var enRec = {cookie:'Cookies x6',cake:'Simple cake',crepe:'Crepes x8',madel:'Madeleines x4',pancake:'Pancakes x10',brownie:'Brownie',muffin:'Muffins x6',eclair:'Eclairs x4',fraisier:'Strawberry cake',fondant:'Chocolate fondant',tiramisu:'Tiramisu',cheesecake:'Cheesecake',chouquette:'Chouquettes x12',tarte_cit:'Lemon tart',macaron:'Macarons x8',millefeuille:'Mille-feuille',tarte_pom:'Apple tart',parisb:'Paris-Brest',opera:'Opera',baba:'Rum baba',canele:'Caneles x6',saintho:'Saint-Honore',pistamac:'Pistachio macarons x6',mousse_ch:'Chocolate mousse',cremet:'Creme brulee x4',trop:'Tropezienne',coconut:'Coconut cake',caramelia:'Caramelia',framboisier:'Raspberry cake',royale:'King cake',safranc:'Saffron cake',montblanc:'Mont-Blanc',truffecake:'Truffle cake',croquemb:'Croquembouche',piecemont:'Wedding cake',goldengate:'Golden cake',matchacake:'Matcha cake',manguier:'Mango cake',lavandine:'Lavender cake',pralineur:'Praline cake',gingemb:'Gingerbread',rhumba:'Royal baba',rosecake:'Rose cake',bergamotte:'Bergamot cake',yuzutart:'Yuzu tart',pralineroyal:'Royal praline',meringuee:'Celestial meringue',tiramigrand:'Imperial tiramisu',cardamomecake:'Cardamom cake',anisstar:'Anise star',volcancake:'Chocolate volcano',cloudcake:'Cloud cake',wasabisurp:'Wasabi surprise',ambrosiacake:'Ambrosia cake',nectarcake:'Nectar cake',rainbowcake:'Rainbow cake',temporalcake:'Temporal cake',celestecake:'Celestial cake',cosmocake:'Cosmic cake',infinicake:'Infinite cake'};
  var frBld = {moulin:'Moulin',ferme:'Ferme',sucrerie:'Sucrerie',beurrerie:'Beurrerie',laiterie:'Laiterie',cacaotiere:'Cacaotière',serrefraise:'Serre à fraises',chocolaterie:'Chocolaterie',vanillerie:'Vanillerie',cremerie:'Crémerie',verger:'Amanderaie',rucher:'Rucher',citronnier:'Citronniers',pommier:'Pommiers',fourind:'Grande minoterie',fourpat:'Grand poulailler',usinegat:'Raffinerie de sucre',megafour:'Grande beurrerie',labochoc:'Labo du chocolat',plantasafran:'Safranière',truffiere:'Truffière',alchimie:'Atelier du doreur',megausine:'Méga-moulin',complexe:'Complexe laitier',paradis:'Paradis de la vanille',quantumoven:'Chocolaterie quantique',tempsfour:'Truffière temporelle',celestefarm:'Mine d\'or céleste',infinibaker:'Raffinerie infinie',canneleraie:'Canneleraie',cafeiere:'Caféière',pistacheraie:'Pistacheraie',caramelerie:'Caramélerie',framboiseraie:'Framboiseraie',cocoteraie:'Cocoteraie',theier:'Plantation de matcha',manguerais:'Manguiers',lavanderaie:'Champ de lavande',noiseraie:'Noiseraie',gingembraie:'Champ de gingembre',rhumerie:'Rhumerie',roseraie:'Roseraie',bergamoteraie:'Bergamoteraie',yuzuraie:'Verger de yuzu',pralinerie:'Pralinerie',meringuerie:'Meringuerie',fromagerie:'Fromagerie',cardamomeraie:'Champ de cardamome',badianeraie:'Badianiers',pimenteraie:'Champ de piments',wasabiculture:'Culture de wasabi',alpage:'Alpage d\'edelweiss',jardinambro:'Jardin d\'ambroisie',ruchedivine:'Ruche divine',capteuretoile:'Capteur d\'étoiles',sablier:'Sablier géant',minecelest:'Mine céleste',forgecosmique:'Forge cosmique',sourceinfinie:'Source infinie'};
  var enBld = {moulin:'Mill',ferme:'Farm',sucrerie:'Sugar mill',beurrerie:'Creamery',laiterie:'Dairy',cacaotiere:'Cocoa plantation',serrefraise:'Strawberry greenhouse',chocolaterie:'Chocolate factory',vanillerie:'Vanilla farm',cremerie:'Cream dairy',verger:'Almond orchard',rucher:'Apiary',citronnier:'Lemon grove',pommier:'Apple orchard',fourind:'Big flour mill',fourpat:'Big hen house',usinegat:'Sugar refinery',megafour:'Big creamery',labochoc:'Chocolate lab',plantasafran:'Saffron plantation',truffiere:'Truffle farm',alchimie:'Gilder\'s workshop',megausine:'Mega-mill',complexe:'Dairy complex',paradis:'Vanilla paradise',quantumoven:'Quantum chocolate factory',tempsfour:'Temporal truffle farm',celestefarm:'Celestial gold mine',infinibaker:'Infinite refinery',canneleraie:'Cinnamon grove',cafeiere:'Coffee plantation',pistacheraie:'Pistachio grove',caramelerie:'Caramel works',framboiseraie:'Raspberry field',cocoteraie:'Coconut grove',theier:'Matcha plantation',manguerais:'Mango grove',lavanderaie:'Lavender field',noiseraie:'Hazelnut grove',gingembraie:'Ginger field',rhumerie:'Rum distillery',roseraie:'Rose garden',bergamoteraie:'Bergamot grove',yuzuraie:'Yuzu orchard',pralinerie:'Praline works',meringuerie:'Meringue works',fromagerie:'Cheese dairy',cardamomeraie:'Cardamom field',badianeraie:'Star anise grove',pimenteraie:'Chili field',wasabiculture:'Wasabi farm',alpage:'Edelweiss pasture',jardinambro:'Ambrosia garden',ruchedivine:'Divine hive',capteuretoile:'Star catcher',sablier:'Giant hourglass',minecelest:'Celestial mine',forgecosmique:'Cosmic forge',sourceinfinie:'Infinite spring'};
  var k;
  for (k in frIng) LANGS.fr['i.' + k] = frIng[k];
  for (k in enIng) LANGS.en['i.' + k] = enIng[k];
  for (k in frRec) LANGS.fr['r.' + k] = frRec[k];
  for (k in enRec) LANGS.en['r.' + k] = enRec[k];
  for (k in frBld) LANGS.fr['b.' + k] = frBld[k];
  for (k in enBld) LANGS.en['b.' + k] = enBld[k];
})();

// ============ Traduction ============
function t(key, params) {
  var str = (LANGS[currentLang] && LANGS[currentLang][key]) || LANGS.fr[key] || LANGS.en[key] || key;
  if (params) {
    for (var k in params) {
      if (params.hasOwnProperty(k)) str = str.split('{{' + k + '}}').join(params[k]);
    }
  }
  return str;
}

function setLanguage(code) {
  if (!LANGS[code]) code = 'fr';
  currentLang = code;
  document.documentElement.lang = code;
  if (typeof G !== 'undefined') G.settings.lang = code;
  if (typeof fullRender === 'function') fullRender();
}

// Argent : les centimes s'affichent en dessous de 1000
function fmtMoney(amount) {
  var curr = CURRENCIES[0];
  if (typeof G !== 'undefined' && G.settings && G.settings.currency) {
    for (var i = 0; i < CURRENCIES.length; i++) {
      if (CURRENCIES[i].id === G.settings.currency) { curr = CURRENCIES[i]; break; }
    }
  }
  var converted = amount * curr.rate;
  var abs = Math.abs(converted);
  if (abs >= 1000) return fmt(converted) + curr.symbol;
  var txt = converted.toFixed(2).replace(/\.00$/, '');
  if (currentLang !== 'en') txt = txt.replace('.', ',');
  return txt + curr.symbol;
}

// ======================== BETA 1.4 ========================
Object.assign(LANGS.fr, {
  'is.oeuf':'Œuf','is.fraise':'Fraise','is.amande':'Amande','is.pomme':'Pomme','is.framb':'Framboise','is.noisette':'Noisette',
  'tuto.step1':'Pour tes premiers cookies, clique sur les ingrédients : 2 Farine, 2 Sucre et 1 Œuf.',
  'unlock.btn':'Débloquer ({{v}})','unlock.waiting':'Arrive dans {{v}}','unlock.started':'{{n}} arrive dans {{v}}.','unlock.done':'{{n}} est débloqué !',
  'sell.selling':'Vente : {{v}}',
  'bld.delivery':'+{{q}} {{n}} dans {{t}}','bld.eachHour':'Livre beaucoup de {{n}}, une fois par heure','bld.done':'{{n}} a livré {{q}} {{i}} !','bld.unlocked':'Niveau 40 ! Tu peux acheter des bâtiments.',
  'emp.novice':'Apprenti','emp.buyer':'Intendant','emp.desc.novice':'Il n\'a pas encore de métier. Paie-lui en un.','emp.desc.buyer':'Achète les ingrédients qui manquent pour tes recettes favorites, ou les plus récentes. La livraison prend du temps.',
  'emp.desc.baker':'Fait baisser le temps de préparation.','emp.desc.seller':'Vend tes gâteaux tout seul. Plus il y a de vendeurs, plus ça va vite.','emp.desc.manager':'Remonte le moral de l\'équipe, et peut embaucher à ta place.','emp.desc.chef':'Prépare tes pâtisseries tout seul, avec les ingrédients en stock.','emp.desc.carrier':'Emmène de l\'argent ou du stock vers une autre de tes pâtisseries. Clique sur lui pour le régler.',
  'emp.creative':'Mode créatif : des employés à l\'infini.','emp.search':'Chercher un employé','emp.searchHint':'Une recherche prend du temps, et ne marche pas toujours : {{v}} % de chances à ton niveau.','emp.searchStarted':'Recherche d\'un {{n}} en cours…','emp.searchFound':'Un {{n}} a répondu à ton annonce !','emp.searchNone':'Personne n\'a répondu pour le poste de {{n}}.',
  'emp.training':'En formation : {{v}}','emp.config':'Réglages','emp.trainMax':'Niveau maximum','emp.sellHelp':'La part de ce que tu prépares que ce vendeur a le droit de vendre.','emp.sellAll':'Appliquer à tous les vendeurs de cette pâtisserie','emp.sellAllDone':'Tous les vendeurs : {{v}} %.',
  'emp.chefAll':'Tout','emp.chefOnly':'Seulement','emp.chefPriority':'Priorité','emp.chefHelp.all':'Il prépare tout ce qu\'il peut, le plus rentable d\'abord.','emp.chefHelp.only':'Il prépare seulement les recettes que tu choisis.','emp.chefHelp.priority':'Il prépare d\'abord celles que tu choisis, dans l\'ordre, puis le reste.',
  'emp.mgrAuto':'Embauche automatique','emp.mgrHelp':'Il embauche le candidat le moins cher qui a la compétence demandée, si tu as cinq fois son prix. Un cueilleur va sur l\'ingrédient le moins produit.','emp.mgrMin':'Compétence minimum','emp.mgrHired':'{{n}} a embauché quelqu\'un !',
  'emp.noviceHelp':'Choisis son métier. C\'est moins cher que d\'embaucher.','emp.jobDone':'Il est maintenant {{n}} !','emp.buyerDone':'L\'intendant a reçu sa livraison !',
  'carry.oneCake':'Un gâteau précis','carry.oneIng':'Un ingrédient précis','carry.qty':'Combien par voyage','carry.max':'Le maximum','carry.help':'Un voyage toutes les {{v}} environ.',
  'mach.title':'Machines','mach.help':'Des améliorations permanentes, mais seulement dans cette pâtisserie. Chaque niveau coûte beaucoup plus cher que le précédent.','mach.level':'Niveau {{a}} / {{b}}',
  'mach.four':'Four','mach.four.d':'{{v}} fournées de plus en même temps, par niveau.','mach.fouet':'Fouet','mach.fouet.d':'Préparations {{v}} % plus rapides par niveau.','mach.balance':'Balance','mach.balance.d':'Ingrédients {{v}} % moins chers par niveau.','mach.batteur':'Batteur','mach.batteur.d':'Préparations {{v}} % plus rapides par niveau.','mach.minuteur':'Minuteur','mach.minuteur.d':'Préparations {{v}} % plus rapides par niveau.','mach.frigo':'Réfrigérateur','mach.frigo.d':'Espace +{{v}} % par niveau.','mach.caissereg':'Caisse enregistreuse','mach.caissereg.d':'Prix de vente +{{v}} % par niveau.','mach.sablier':'Sablier magique','mach.sablier.d':'Préparations {{v}} % plus rapides par niveau.','mach.labo':'Laboratoire du goût','mach.labo.d':'XP +{{v}} % par niveau.','mach.megafour':'Méga-four','mach.megafour.d':'{{v}} fournées de plus en même temps, par niveau.','mach.empire':'Enseigne géante','mach.empire.d':'Prix de vente +{{v}} % par niveau.','mach.fourturbo.d':'{{v}} fournées de plus en même temps, par niveau.','mach.convoyeur.d':'Livraisons des bâtiments +{{v}} % par niveau.',
  'adv.space':'Plus de place : {{v}} % de ton espace est plein. Agrandis ta pâtisserie, ou vends tes gâteaux.',
  'bakery.bobCongrats':'Bravo ! Une nouvelle pâtisserie, je suis fier de toi ! Comment veux-tu l\'appeler ?',
  'bakery.statsUnlocked':'Deux boutiques ! Dans les réglages, Statistiques, je t\'ai préparé des graphiques et les totaux de toutes tes pâtisseries.',
  'settings.tabGeneral':'Général',
  'bob.refuse':'Non. Je ne te parle pas.|Débrouille-toi.|Demande à quelqu\'un d\'autre.|Pas envie.|Va lire le wiki.|Tu crois que je vais t\'aider, après ça ?|…',
  'bob.grumbleA':'Bon. En vitesse.|Si ça peut te faire taire :|Vite fait :','bob.grumbleB':'Bon, d\'accord.|Puisqu\'il le faut.|Je veux bien te dire ça.','bob.grumbleC':'Ça va un peu mieux, alors écoute.|Tiens, je t\'explique.|Merci pour le sucre. Donc :',
  'bob.idle':'Tu es encore là ? Si tu pars, il y a un bouton pause en haut. Ou la touche Échap.',
  'bob.bldSoon':'Ta livraison de {{i}} ({{n}}) arrive dans une minute !',
  'unl.research':'Niveau 2 ! Une nouveauté t\'attend : clique sur un ingrédient ou une recette qui clignote pour le débloquer, puis attends un peu.',
  'unl.machines':'Regarde l\'onglet Machines : un four en plus, c\'est une fournée de plus en même temps. Un fouet, c\'est plus rapide. Elles restent, mais seulement dans cette pâtisserie.',
  'unl.staff':'Niveau 5 ! Tu peux embaucher. Lance une recherche dans l\'onglet Employés. Un cueilleur produit un ingrédient à la seconde. Attention : un employé mal payé ou démoralisé finit par démissionner.',
  'unl.baker':'Niveau 10 : le boulanger ! Il fait baisser le temps de préparation.',
  'unl.carrier':'Niveau 20 : le transporteur ! Avec deux pâtisseries, il emmène de l\'argent ou du stock de l\'une à l\'autre. Clique sur lui pour le régler.',
  'unl.manager':'Niveau 25 : le manager ! Il remonte le moral de l\'équipe, et peut embaucher à ta place. Clique sur lui pour le régler.',
  'unl.orders':'Niveau 30 : les commandes ! Des clients demandent des gâteaux, et plus c\'est compliqué, plus ça paie. Le maître d\'hôtel les livre à ta place.',
  'unl.seller':'Niveau 35 : le vendeur ! Il vend tout seul, mais lentement s\'il est seul. Tu peux choisir la part du stock qu\'il a le droit de vendre.',
  'unl.buildings':'Niveau 40 : les bâtiments ! Ils ne produisent pas à la seconde : ils livrent une énorme quantité d\'un coup, une fois par heure.',
  'unl.rebirth':'Avec assez d\'argent, tu peux aussi faire un rebirth : tu repars de zéro avec un bonus permanent.',
  'unl.chef':'Niveau 65 : le chef pâtissier ! Il prépare tout seul avec ce qu\'il y a en stock. Clique sur lui pour choisir ce qu\'il prépare.',
  'unl.buyer':'Niveau 90 : l\'intendant ! Il commande les ingrédients qui manquent. La livraison prend un peu de temps.',
  'unl.top':'Niveau 1000 ! Tu as tout vu. Tu peux continuer à monter, mais c\'est la fin du parcours. Bravo.',
  'console.machineSet':'{{n}} : niveau {{a}} / {{b}}','console.machineName':'NOM','console.machineUnknown':'Machine inconnue. Les machines : ','console.creativeOn':'Mode créatif : tout est à l\'infini !','console.creativeOff':'Mode créatif arrêté, ta partie est revenue.','console.creativeNone':'Le mode créatif n\'est pas activé.',
});

Object.assign(LANGS.en, {
  'is.oeuf':'Egg','is.fraise':'Strawberry','is.amande':'Almond','is.pomme':'Apple','is.framb':'Raspberry','is.noisette':'Hazelnut',
  'unlock.btn':'Unlock ({{v}})','unlock.waiting':'Arrives in {{v}}','unlock.started':'{{n}} arrives in {{v}}.','unlock.done':'{{n}} unlocked!',
  'sell.selling':'Selling: {{v}}',
  'bld.delivery':'+{{q}} {{n}} in {{t}}','bld.eachHour':'Delivers a lot of {{n}}, once an hour','bld.done':'{{n}} delivered {{q}} {{i}}!','bld.unlocked':'Level 40! You can buy buildings.',
  'emp.novice':'Apprentice','emp.buyer':'Purveyor','emp.desc.novice':'They have no job yet. Pay for one.','emp.desc.buyer':'Buys the ingredients missing for your favorite or latest recipes. Delivery takes a while.',
  'emp.desc.baker':'Lowers baking time.','emp.desc.seller':'Sells your cakes on their own. The more sellers, the faster it goes.','emp.desc.manager':'Lifts the team\'s morale, and can hire for you.','emp.desc.chef':'Bakes your pastries on their own, with the ingredients in stock.','emp.desc.carrier':'Takes money or stock to another of your bakeries. Click them to set it up.',
  'emp.creative':'Creative mode: infinite employees.','emp.search':'Search for an employee','emp.searchHint':'A search takes time and doesn\'t always work: {{v}}% chance at your level.','emp.searchStarted':'Searching for a {{n}}…','emp.searchFound':'A {{n}} answered your ad!','emp.searchNone':'Nobody answered for the {{n}} job.',
  'emp.training':'Training: {{v}}','emp.config':'Settings','emp.trainMax':'Maximum level','emp.sellHelp':'The share of what you bake that this seller may sell.','emp.sellAll':'Apply to all sellers of this bakery','emp.sellAllDone':'All sellers: {{v}}%.',
  'emp.chefAll':'All','emp.chefOnly':'Only','emp.chefPriority':'Priority','emp.chefHelp.all':'Bakes all they can, the most profitable first.','emp.chefHelp.only':'Bakes only the recipes you choose.','emp.chefHelp.priority':'Bakes the ones you choose first, in order, then the rest.',
  'emp.mgrAuto':'Automatic hiring','emp.mgrHelp':'Hires the cheapest applicant with the required skill, if you have five times their price. A collector goes to the least produced ingredient.','emp.mgrMin':'Minimum skill','emp.mgrHired':'{{n}} hired someone!',
  'emp.noviceHelp':'Choose their job. It costs less than hiring.','emp.jobDone':'They are now a {{n}}!','emp.buyerDone':'The purveyor got a delivery!',
  'carry.oneCake':'One specific cake','carry.oneIng':'One specific ingredient','carry.qty':'How much per trip','carry.max':'The maximum','carry.help':'One trip about every {{v}}.',
  'mach.title':'Machines','mach.help':'Permanent upgrades, but only in this bakery. Each level costs much more than the last.','mach.level':'Level {{a}} / {{b}}',
  'mach.four':'Oven','mach.four.d':'{{v}} more batches at the same time, per level.','mach.fouet':'Whisk','mach.fouet.d':'Baking {{v}}% faster per level.','mach.balance':'Scale','mach.balance.d':'Ingredients {{v}}% cheaper per level.','mach.batteur':'Mixer','mach.batteur.d':'Baking {{v}}% faster per level.','mach.minuteur':'Timer','mach.minuteur.d':'Baking {{v}}% faster per level.','mach.frigo':'Fridge','mach.frigo.d':'Space +{{v}}% per level.','mach.caissereg':'Cash register','mach.caissereg.d':'Sale prices +{{v}}% per level.','mach.sablier':'Magic hourglass','mach.sablier.d':'Baking {{v}}% faster per level.','mach.labo':'Taste lab','mach.labo.d':'XP +{{v}}% per level.','mach.megafour':'Mega-oven','mach.megafour.d':'{{v}} more batches at the same time, per level.','mach.empire':'Giant sign','mach.empire.d':'Sale prices +{{v}}% per level.','mach.fourturbo.d':'{{v}} more batches at the same time, per level.','mach.convoyeur.d':'Building deliveries +{{v}}% per level.',
  'adv.space':'Out of room: {{v}}% of your space is full. Expand your bakery, or sell your cakes.',
  'bakery.bobCongrats':'Well done! A new bakery, I\'m proud of you! What do you want to call it?',
  'bakery.statsUnlocked':'Two shops! In Settings, Statistics, I prepared charts and the totals of all your bakeries.',
  'bob.refuse':'No. I\'m not talking to you.|Figure it out.|Ask someone else.|Don\'t feel like it.|Go read the wiki.|You think I\'ll help you, after that?|…',
  'bob.grumbleA':'Fine. Quickly.|If it\'ll shut you up:|Short version:','bob.grumbleB':'Fine, OK.|If I must.|I\'ll tell you this.','bob.grumbleC':'I feel a bit better, so listen.|Here, let me explain.|Thanks for the sugar. So:',
  'bob.idle':'Still there? If you\'re leaving, there\'s a pause button at the top. Or the Esc key.',
  'bob.bldSoon':'Your {{i}} delivery ({{n}}) arrives in one minute!',
  'unl.research':'Level 2! Something new: click a blinking ingredient or recipe to unlock it, then wait a little.',
  'unl.machines':'Check the Machines tab: one more oven means one more batch at the same time. A whisk makes it faster. They stay, but only in this bakery.',
  'unl.staff':'Level 5! You can hire. Start a search in the Employees tab. A collector produces an ingredient every second. Careful: an unpaid or demoralized employee ends up quitting.',
  'unl.baker':'Level 10: the baker! They lower baking time.',
  'unl.carrier':'Level 20: the carrier! With two bakeries, they take money or stock from one to the other. Click them to set it up.',
  'unl.manager':'Level 25: the manager! They lift the team\'s morale and can hire for you. Click them to set it up.',
  'unl.orders':'Level 30: orders! Customers ask for cakes, and the harder it is, the more it pays. The head waiter delivers them for you.',
  'unl.seller':'Level 35: the seller! They sell on their own, but slowly if alone. You can choose the share of stock they may sell.',
  'unl.buildings':'Level 40: buildings! They don\'t produce every second: they deliver a huge amount at once, once an hour.',
  'unl.rebirth':'With enough money, you can also rebirth: you restart from zero with a permanent bonus.',
  'unl.chef':'Level 65: the head chef! They bake on their own with what\'s in stock. Click them to choose what they bake.',
  'unl.buyer':'Level 90: the purveyor! They order the missing ingredients. Delivery takes a little while.',
  'unl.top':'Level 1000! You\'ve seen it all. You can keep rising, but this is the end of the road. Well done.',
  'console.machineSet':'{{n}}: level {{a}} / {{b}}','console.machineName':'NAME','console.machineUnknown':'Unknown machine. The machines: ','console.creativeOn':'Creative mode: everything is infinite!','console.creativeOff':'Creative mode off, your game is back.','console.creativeNone':'Creative mode is not on.',
});

// Bob a beaucoup plus de choses a dire
LANGS.fr['bob.p0'] += '|Attention, le four est chaud.|Tu as vu mon fouet ? Il est neuf.|J\'adore l\'odeur de la vanille le matin.|Un jour, j\'ouvrirai ma propre pâtisserie. Ah non, c\'est la tienne.|Goûte ça. Non, attends, ça brûle.|Tu savais qu\'un robot pouvait avoir faim ?|Je compte les cookies. Il en manque un.|Ta boutique sent bon aujourd\'hui.|Si tu cherches la farine, elle est partout sur moi.|Bonjour, bonsoir, je ne sais plus, je n\'ai pas de fenêtre.';
LANGS.fr['bob.p1'] += '|Je vais finir par le noter quelque part.|Un clic de plus et je boude.|Tu n\'as vraiment rien d\'autre à faire ?|C\'est un fouet, pas un jouet. Et moi non plus.|Mes capteurs commencent à chauffer.|Je t\'ai à l\'œil. Aux deux, même.';
LANGS.fr['bob.p2'] += '|J\'ai déjà brûlé des gâteaux pour moins que ça.|Je préviens, je vais me fâcher.|Tu veux vraiment voir ce qu\'il y a après ?|Mes circuits n\'aiment pas ça.|Va cliquer sur un ingrédient, tiens !|Je perds ma patience, et elle était déjà petite.';
LANGS.fr['bob.p3'] += '|JE VAIS TOUT SALER !|PLUS JAMAIS DE MACARONS POUR TOI !|MA VISIÈRE VIRE AU ROUGE, TU VOIS ?!|JE DÉMONTE LE FOUR !|QUI T\'A APPRIS À CLIQUER, D\'ABORD ?!|ÇA VA MAL FINIR, JE TE LE DIS !';
LANGS.fr['bob.p4'] += '|TOUT VA BRÛLER !|ERREUR 404 : PATIENCE INTROUVABLE !|JE VAIS FAIRE UN GÂTEAU AU VINAIGRE !|ARRÊTE ! ARRÊTE ! ARRÊTE !|PLUS DE SUCRE ! PLUS RIEN !';
LANGS.fr['bob.sour'] += '|Même le four a arrêté de me parler.|Je fouette dans le vide, comme tous les jours.|Avant, je sifflais en cuisinant.|Tes clients ne me regardent même plus.|La crème retombe. Moi aussi.|Pourquoi cuire, au fond ?';
LANGS.en['bob.p0'] += '|Careful, the oven is hot.|Have you seen my whisk? It\'s new.|I love the smell of vanilla in the morning.|One day I\'ll open my own bakery. Oh wait, it\'s yours.|Taste this. No, wait, it\'s burning.|Did you know a robot can be hungry?|I\'m counting cookies. One is missing.|Your shop smells good today.|If you\'re looking for the flour, it\'s all over me.|Good morning, good evening, I can\'t tell, I have no window.';
LANGS.en['bob.p1'] += '|I\'m going to write this down somewhere.|One more click and I sulk.|Do you really have nothing else to do?|It\'s a whisk, not a toy. And neither am I.|My sensors are getting warm.|I\'ve got my eye on you. Both eyes, actually.';
LANGS.en['bob.p2'] += '|I\'ve burned cakes for less than this.|I\'m warning you, I\'ll get angry.|Do you really want to see what comes next?|My circuits don\'t like this.|Go click on an ingredient instead!|I\'m losing my patience, and it was small to begin with.';
LANGS.en['bob.p3'] += '|I\'LL SALT EVERYTHING!|NO MORE MACARONS FOR YOU!|MY VISOR IS TURNING RED, SEE?!|I\'M TAKING THE OVEN APART!|WHO TAUGHT YOU TO CLICK ANYWAY?!|THIS WILL END BADLY, I\'M TELLING YOU!';
LANGS.en['bob.p4'] += '|EVERYTHING WILL BURN!|ERROR 404: PATIENCE NOT FOUND!|I\'LL BAKE A VINEGAR CAKE!|STOP! STOP! STOP!|NO MORE SUGAR! NOTHING!';
LANGS.en['bob.sour'] += '|Even the oven stopped talking to me.|I whisk at nothing, like every day.|I used to whistle while cooking.|Your customers don\'t even look at me anymore.|The cream is falling. So am I.|Why bake, really?';
