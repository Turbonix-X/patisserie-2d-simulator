/* ============================================
   PATISSERIE 2D SIMULATOR - LANGUAGES
   Translation system - 10 languages
   ============================================ */
var currentLang = 'fr';
var LANG_LIST = [
  {code:'fr',name:'Francais',flag:'\u{1F1EB}\u{1F1F7}'},
  {code:'en',name:'English',flag:'\u{1F1FA}\u{1F1F8}'},
  {code:'es',name:'Espanol',flag:'\u{1F1EA}\u{1F1F8}'},
  {code:'de',name:'Deutsch',flag:'\u{1F1E9}\u{1F1EA}'},
  {code:'pt',name:'Portugues',flag:'\u{1F1E7}\u{1F1F7}'},
  {code:'zh',name:'\u4E2D\u6587',flag:'\u{1F1E8}\u{1F1F3}'},
  {code:'ja',name:'\u65E5\u672C\u8A9E',flag:'\u{1F1EF}\u{1F1F5}'},
  {code:'ko',name:'\uD55C\uAD6D\uC5B4',flag:'\u{1F1F0}\u{1F1F7}'},
  {code:'ar',name:'\u0627\u0644\u0639\u0631\u0628\u064A\u0629',flag:'\u{1F1F8}\u{1F1E6}'},
  {code:'hi',name:'\u0939\u093F\u0928\u094D\u0926\u0940',flag:'\u{1F1EE}\u{1F1F3}'},
];
var LANGS = {};

// ======================== FRANCAIS ========================
LANGS.fr = {
  'title':'Patisserie 2D Simulator',
  'version':'Version',
  'level':'Niv. {{v}}','money':'{{v}}',
  'ing.title':'Ingredients','ing.locked':'Niveau {{v}}','ing.perClick':'+{{v}} / clic','ing.cost':'Cout: {{v}}','ing.autoRate':'{{v}}/sec',
  'ing.resell':'Revendre','ing.resellPrice':'Revente: {{v}}','ing.craftBtn':'Fabriquer','ing.craftTime':'Fabrication: {{v}}',
  'xp.level':'Niveau {{v}}','xp.text':'{{c}} / {{n}} XP',
  'space.label':'Espace','space.text':'{{u}} / {{m}} m\u00b2','space.buy':'+{{a}}m\u00b2 pour {{c}}','space.locked':'Niv.{{v}} requis','space.max':'Espace max !','space.rent':'Loyer : {{v}}/h','space.debt':'DETTE : {{v}} !','space.noSpace':'Pas assez d\'espace','space.overflow':'Espace depasse ! Items en trop perdus.',
  'rec.title':'Recettes','rec.prepare':'Preparer','rec.noIng':'Manque ingredients','rec.noSpace':'Espace insuffisant','rec.prepared':'{{e}} {{q}}x {{n}} en preparation !','rec.crafting':'En cours... {{t}}','rec.xp':'XP: +{{v}}','rec.time':'Temps: {{v}}','rec.space':'Espace: {{v}}m\u00b2',
  'sell.title':'Ventes','sell.stock':'Stock : {{v}}','sell.sell':'Vendre','sell.sellAll':'Tout vendre','sell.sellAllGlobal':'Tout vendre','sell.earned':'+{{v}} pour {{q}}x {{e}}','sell.price':'{{v}}/piece','sell.filter':'Filtrer','sell.noStock':'Rien a vendre',
  'sell.inflUp':'\u2191 +{{v}}%','sell.inflDown':'\u2193 {{v}}%','sell.inflNeutral':'= 0%',
  'bld.title':'Batiments','bld.buy':'Acheter','bld.qty':'x{{v}}','bld.prod':'{{v}}/sec','bld.cost':'{{v}}','bld.locked':'Niv.{{v}}','bld.bought':'{{n}} achete !',
  'emp.title':'Employes','emp.hire':'Embaucher','emp.fire':'Virer','emp.salary':'{{v}}/sec','emp.morale':'Moral','emp.assign':'Affecter','emp.working':'Travaille','emp.striking':'En greve !','emp.poor':'Travail mediocre','emp.idle':'Inactif',
  'emp.event.quit':'{{n}} a demissionne !','emp.event.strike':'{{n}} fait greve !','emp.event.poor':'{{n}} travaille mal...','emp.event.happy':'{{n}} est motive !',
  'emp.unpaid':'Salaires impayes !','emp.totalSalary':'Salaires : {{v}}/sec',
  'emp.collector':'Cueilleur','emp.baker':'Boulanger','emp.seller':'Vendeur','emp.manager':'Manager','emp.chef':'Chef patissier',
  'emp.hireCost':'{{v}}','emp.skill':'Competence','emp.skillLvl':'Niv. {{v}}/100',
  'emp.train':'Former','emp.trainCost':'Formation: {{v}}','emp.info':'Infos employe',
  'emp.applicant':'Candidature !','emp.applicants':'Candidatures','emp.accept':'Embaucher','emp.reject':'Rejeter',
  'emp.noApplicants':'Aucune candidature pour le moment.',
  'ach.title':'Succes','ach.locked':'???','ach.lockedDesc':'Continue de jouer...',
  'ach.unlocked':'Succes : {{n}} !',
  'ach.first_click':'Premier clic','ach.click100':'Cliqueur assidu','ach.click1000':'Cliqueur fou','ach.click10000':'Cliqueur legendaire','ach.click100k':'Mega cliqueur',
  'ach.first_cake':'Premier gateau','ach.cake10':'Apprenti','ach.cake50':'Confirme','ach.cake200':'Maitre','ach.cake1000':'Chef etoile','ach.cake10000':'Legendaire',
  'ach.first_sell':'Premier euro','ach.sell50':'Vendeur','ach.sell500':'Pro','ach.sell5000':'Magnat',
  'ach.earn100':'100\u20ac','ach.earn1000':'1k\u20ac','ach.earn10k':'10k\u20ac','ach.earn100k':'100k\u20ac','ach.earn1m':'Millionnaire','ach.earn1b':'Milliardaire',
  'ach.lvl5':'Niv.5','ach.lvl10':'Niv.10','ach.lvl25':'Niv.25','ach.lvl50':'Niv.50','ach.lvl100':'Niv.100','ach.lvl500':'Niv.500','ach.lvl1000':'Niv.1000',
  'ach.space20':'20m\u00b2','ach.space50':'50m\u00b2','ach.space100':'100m\u00b2','ach.space500':'500m\u00b2',
  'ach.rebirth1':'Rebirth 1','ach.rebirth3':'Rebirth 3','ach.rebirth5':'Rebirth 5','ach.rebirth7':'Rebirth 7',
  'ach.emp1':'1er employe','ach.emp5':'5 employes','ach.emp20':'20 employes',
  'ach.bld1':'1er batiment','ach.bld10':'10 batiments',
  'ach.golden':'Gateau en or','ach.infinimade':'Gateau infini',
  'rebirth.title':'Nouvelle Patisserie !','rebirth.desc':'Ouvre {{name}} et gagne des bonus permanents !',
  'rebirth.btn':'Ouvrir !','rebirth.cancel':'Annuler',
  'rebirth.warning':'Tu perds tout sauf argent et niveaux !',
  'rebirth.cost':'Cout : {{v}}','rebirth.bonus':'Bonus : +{{v}}%',
  'rebirth.minLvl':'Niveau {{v}} requis','rebirth.done':'Bienvenue dans {{name}} ! Rebirth {{n}} !',
  'rebirth.banner':'Ouvrir une NOUVELLE Patisserie','rebirth.bannerInfo':'Rebirth disponible !',
  'rename.title':'Renommer la patisserie','rename.placeholder':'Nouveau nom...','rename.btn':'Renommer','rename.done':'Patisserie renommee : {{n}} !',
  'acc.title':'Connexion / Inscription','acc.user':'Pseudo','acc.pass':'Mot de passe','acc.login':'Connexion','acc.register':'Inscription','acc.logout':'Deconnexion','acc.save':'Sauvegarder','acc.close':'Fermer',
  'acc.welcome':'Bienvenue {{n}} !','acc.welcomeBack':'Content de te revoir {{n}} !','acc.created':'Compte cree !','acc.saved':'Partie sauvegardee !','acc.bye':'Deconnecte.',
  'acc.errShort':'Pseudo trop court','acc.errPassShort':'MDP trop court','acc.errTaken':'Pseudo pris','acc.errNotFound':'Introuvable','acc.errPass':'MDP incorrect','acc.errFill':'Remplis tout',
  'anticlick.cooldown':'Trop rapide ! Attend {{v}}s','anticlick.captcha':'Anti-bot : {{q}}','anticlick.wrong':'Mauvaise reponse !','anticlick.ok':'Merci !',
  'misc.perSec':'{{v}}/sec','misc.perPiece':'{{v}}/piece',
  'tab.rec':'Recettes','tab.sell':'Ventes','tab.bld':'Batiments','tab.emp':'Employes','tab.ach':'Succes','tab.stats':'Stats',
  // Stats tab
  'stats.title':'Statistiques','stats.totalEarned':'Argent total gagne','stats.totalCakes':'Gateaux fabriques','stats.totalSold':'Gateaux vendus',
  'stats.totalClicks':'Clics totaux','stats.playTime':'Temps de jeu','stats.totalSalary':'Salaires payes','stats.totalRent':'Loyers payes',
  'stats.totalIngCost':'Cout ingredients','stats.rebirths':'Rebirths',
  // Tutorial
  'tuto.skip':'Passer le tutoriel','tuto.next':'Suivant',
  'tuto.step1':'Bienvenue ! Clique sur la Farine pour commencer.',
  'tuto.step2':'Super ! Maintenant va dans l\'onglet Recettes.',
  'tuto.step3':'Prepare des Cookies avec tes ingredients !',
  'tuto.step4':'Parfait ! Va dans Ventes pour vendre tes gateaux.',
  'tuto.done':'Bravo ! Tu connais les bases. Bonne chance !',
  // Offline
  'offline.title':'Bienvenue !','offline.text':'Absent depuis {{t}} : tu as recu {{i}} ingredients et {{m}} de ventes auto.',
  // Game over
  'gameover.title':'Faillite !','gameover.text':'Tu as perdu tout ton argent...','gameover.sellCakes':'Vendre des patisseries','gameover.restart':'Recommencer',
  // Events
  'event.price_surge':'Hausse des prix ! Ventes +30% pendant {{t}}s','event.price_drop':'Chute des prix ! Ventes -20% pendant {{t}}s',
  'event.inflation':'Inflation ! Ingredients +25% pendant {{t}}s','event.deflation':'Deflation ! Ingredients -15% pendant {{t}}s',
  'event.rush_hour':'Rush ! Vendeurs x2 pendant {{t}}s','event.ingredient_sale':'Soldes ! Ingredients -30% pendant {{t}}s',
  'event.tax_break':'Reduction fiscale ! Loyer -50% pendant {{t}}s','event.strike_wave':'Vague de greves ! Moral -20',
  'event.lucky_day':'Jour de chance ! XP x3 pendant {{t}}s','event.inspection':'Inspection ! Nettoyage oblige...',
  'event.customer_wave':'Vague de clients ! Ventes x2 pendant {{t}}s','event.power_outage':'Coupure de courant ! Auto-prod arretee {{t}}s',
  'event.sugar_rush':'Rush sucre ! Clics x3 pendant {{t}}s','event.food_critic':'Critique gastronomique ! Valeur +50% pendant {{t}}s',
  'event.supplier_strike':'Greve fournisseurs ! Ingredients +50% pendant {{t}}s','event.festival':'Festival ! Tout +15% pendant {{t}}s',
  'event.bad_review':'Mauvais avis ! Ventes -25% pendant {{t}}s','event.health_check':'Controle sanitaire ! Gateaux confisques...',
  'event.tv_feature':'Passage TV ! XP x5 pendant {{t}}s','event.apprentice_day':'Journee apprenti ! Employes x2 pendant {{t}}s',
  // Settings
  'settings.title':'Parametres','settings.lang':'Langue','settings.currency':'Monnaie','settings.theme':'Theme',
  'settings.themeLight':'Clair','settings.themeDark':'Sombre','settings.themeGreen':'Nature',
  'settings.themeNatureFleur':'Nature Fleur','settings.themeNatureAutomne':'Nature Automne','settings.themeNatureNeige':'Nature Neige',
  'settings.themePlage':'Plage','settings.themeEspace':'Espace','settings.themeAnniversaire':'Anniversaire',
  'settings.themeDateLock':'Disponible le {{d}}','settings.themeNatureLock':'Debloque les 3 themes Nature d\'abord',
  'settings.themeLevelLock':'Niveau {{v}} requis',
  'settings.reset':'Reinitialiser le jeu','settings.resetConfirm':'Es-tu SUR de vouloir tout effacer ? Toutes tes sauvegardes seront perdues !','settings.resetDone':'Jeu reinitialise !',
  'settings.cheatCode':'Code ADMIN','settings.cheatPlaceholder':'Entrer le code...','settings.cheatUnlocked':'Console de commandes debloquer !','settings.cheatWrong':'Code incorrect.',
  'settings.console':'Console de commandes',
  'settings.music':'Musique','settings.musicOn':'ON','settings.musicOff':'OFF','settings.musicVolume':'Volume','settings.musicTrack':'Piste',
  'settings.sound':'Sons','settings.soundOn':'ON','settings.soundOff':'OFF',
  'settings.particles':'Particules','settings.particlesOn':'ON','settings.particlesOff':'OFF',
  'settings.export':'Exporter la partie','settings.import':'Importer une partie','settings.exportBtn':'Copier','settings.importBtn':'Charger','settings.exported':'Code copie !','settings.imported':'Partie importee !','settings.importError':'Code invalide !',
  'console.title':'Console de commandes','console.placeholder':'Tapez une commande...','console.send':'OK',
  'console.help':'Commandes: /help, /level, /money, /max, /unmax, /undo, /building, /employee, /stats, /xp, /space, /rebirth, /debt, /theme, /buy, /sell, /random, /time, /patisserie, /birthday, /gameover, /reset, /(ingredient)',
  'ban.message':'Vous etes banni pendant {{v}} minutes !',
  'lvl1000.title':'FELICITATIONS !','lvl1000.text':'Tu as atteint le niveau 1000 ! Tu es un Maitre Patissier Legendaire ! Tu as debloque TOUS les contenus du jeu !',
  'debt.pay':'Payer','debt.paid':'Dettes payees ! Solde: {{v}}','debt.cantPay':'Pas assez d\'argent pour payer la dette !',
  // Pause
  'pause.title':'Pause','pause.resume':'Reprendre','pause.bakeries':'Mes patisseries',
  // Bakeries
  'bakery.title':'Mes Patisseries','bakery.current':'Actuelle','bakery.go':'Aller','bakery.sell':'Vendre','bakery.rename':'Renommer',
  'bakery.value':'Valeur : {{v}}','bakery.sellConfirm':'Vendre {{n}} pour {{v}} ?','bakery.sold':'Patisserie vendue pour {{v}} !',
  'bakery.openNew':'Ouvrir une nouvelle patisserie','bakery.openCost':'Cout : {{v}}','bakery.opened':'Nouvelle patisserie ouverte : {{n}} !',
  // Birthday
  'birthday.title':'Quelle est ta date d\'anniversaire ?','birthday.warning':'Attention, tu ne pourras pas modifier cette date !',
  'birthday.confirm':'Confirmer','birthday.boost':'Joyeux anniversaire ! Bonus x2 pendant 24h !',
  'birthday.happy':'Joyeux anniversaire !','birthday.dayLabel':'Jour','birthday.monthLabel':'Mois',
};

// ======================== ENGLISH ========================
LANGS.en = {
  'title':'Bakery 2D Simulator',
  'version':'Version',
  'level':'Lv. {{v}}','money':'{{v}}',
  'ing.title':'Ingredients','ing.locked':'Level {{v}}','ing.perClick':'+{{v}} / click','ing.cost':'Cost: {{v}}','ing.autoRate':'{{v}}/sec',
  'ing.resell':'Resell','ing.resellPrice':'Resell: {{v}}','ing.craftBtn':'Craft','ing.craftTime':'Crafting: {{v}}',
  'xp.level':'Level {{v}}','xp.text':'{{c}} / {{n}} XP',
  'space.label':'Space','space.text':'{{u}} / {{m}} m\u00b2','space.buy':'+{{a}}m\u00b2 for {{c}}','space.locked':'Lv.{{v}} required','space.max':'Max space!','space.rent':'Rent: {{v}}/h','space.debt':'DEBT: {{v}}!','space.noSpace':'Not enough space','space.overflow':'Space exceeded! Excess items lost.',
  'rec.title':'Recipes','rec.prepare':'Prepare','rec.noIng':'Missing ingredients','rec.noSpace':'Not enough space','rec.prepared':'{{e}} {{q}}x {{n}} crafting!','rec.crafting':'Crafting... {{t}}','rec.xp':'XP: +{{v}}','rec.time':'Time: {{v}}','rec.space':'Space: {{v}}m\u00b2',
  'sell.title':'Sales','sell.stock':'Stock: {{v}}','sell.sell':'Sell','sell.sellAll':'Sell all','sell.sellAllGlobal':'Sell all','sell.earned':'+{{v}} for {{q}}x {{e}}','sell.price':'{{v}}/piece','sell.filter':'Filter','sell.noStock':'Nothing to sell',
  'sell.inflUp':'\u2191 +{{v}}%','sell.inflDown':'\u2193 {{v}}%','sell.inflNeutral':'= 0%',
  'bld.title':'Buildings','bld.buy':'Buy','bld.qty':'x{{v}}','bld.prod':'{{v}}/sec','bld.cost':'{{v}}','bld.locked':'Lv.{{v}}','bld.bought':'{{n}} bought!',
  'emp.title':'Employees','emp.hire':'Hire','emp.fire':'Fire','emp.salary':'{{v}}/sec','emp.morale':'Morale','emp.assign':'Assign','emp.working':'Working','emp.striking':'On strike!','emp.poor':'Poor work','emp.idle':'Idle',
  'emp.event.quit':'{{n}} quit!','emp.event.strike':'{{n}} is on strike!','emp.event.poor':'{{n}} working poorly...','emp.event.happy':'{{n}} is motivated!',
  'emp.unpaid':'Unpaid wages!','emp.totalSalary':'Wages: {{v}}/sec',
  'emp.collector':'Collector','emp.baker':'Baker','emp.seller':'Seller','emp.manager':'Manager','emp.chef':'Head Chef',
  'emp.hireCost':'{{v}}','emp.skill':'Skill','emp.skillLvl':'Lv. {{v}}/100',
  'emp.train':'Train','emp.trainCost':'Training: {{v}}','emp.info':'Employee info',
  'emp.applicant':'New applicant!','emp.applicants':'Applicants','emp.accept':'Hire','emp.reject':'Reject',
  'emp.noApplicants':'No applicants right now.',
  'ach.title':'Achievements','ach.locked':'???','ach.lockedDesc':'Keep playing...',
  'ach.unlocked':'Achievement: {{n}}!',
  'ach.first_click':'First click','ach.click100':'100 clicks','ach.click1000':'1000 clicks','ach.click10000':'10k clicks','ach.click100k':'100k clicks',
  'ach.first_cake':'First cake','ach.cake10':'10 cakes','ach.cake50':'50 cakes','ach.cake200':'200 cakes','ach.cake1000':'1000 cakes','ach.cake10000':'10k cakes',
  'ach.first_sell':'First sale','ach.sell50':'50 sold','ach.sell500':'500 sold','ach.sell5000':'5000 sold',
  'ach.earn100':'100\u20ac','ach.earn1000':'1k\u20ac','ach.earn10k':'10k\u20ac','ach.earn100k':'100k\u20ac','ach.earn1m':'Millionaire','ach.earn1b':'Billionaire',
  'ach.lvl5':'Lv.5','ach.lvl10':'Lv.10','ach.lvl25':'Lv.25','ach.lvl50':'Lv.50','ach.lvl100':'Lv.100','ach.lvl500':'Lv.500','ach.lvl1000':'Lv.1000',
  'ach.space20':'20m\u00b2','ach.space50':'50m\u00b2','ach.space100':'100m\u00b2','ach.space500':'500m\u00b2',
  'ach.rebirth1':'Rebirth 1','ach.rebirth3':'Rebirth 3','ach.rebirth5':'Rebirth 5','ach.rebirth7':'Rebirth 7',
  'ach.emp1':'1st employee','ach.emp5':'5 employees','ach.emp20':'20 employees',
  'ach.bld1':'1st building','ach.bld10':'10 buildings',
  'ach.golden':'Golden cake','ach.infinimade':'Infinite cake',
  'rebirth.title':'New Bakery!','rebirth.desc':'Open {{name}} and earn permanent bonuses!',
  'rebirth.btn':'Open!','rebirth.cancel':'Cancel',
  'rebirth.warning':'You lose everything except money and levels!',
  'rebirth.cost':'Cost: {{v}}','rebirth.bonus':'Bonus: +{{v}}%',
  'rebirth.minLvl':'Level {{v}} required','rebirth.done':'Welcome to {{name}}! Rebirth {{n}}!',
  'rebirth.banner':'Open a NEW Bakery','rebirth.bannerInfo':'Rebirth available!',
  'rename.title':'Rename bakery','rename.placeholder':'New name...','rename.btn':'Rename','rename.done':'Bakery renamed: {{n}}!',
  'acc.title':'Login / Register','acc.user':'Username','acc.pass':'Password','acc.login':'Login','acc.register':'Register','acc.logout':'Logout','acc.save':'Save','acc.close':'Close',
  'acc.welcome':'Welcome {{n}}!','acc.welcomeBack':'Welcome back {{n}}!','acc.created':'Account created!','acc.saved':'Game saved!','acc.bye':'Logged out.',
  'acc.errShort':'Username too short','acc.errPassShort':'Password too short','acc.errTaken':'Username taken','acc.errNotFound':'Not found','acc.errPass':'Wrong password','acc.errFill':'Fill all fields',
  'anticlick.cooldown':'Too fast! Wait {{v}}s','anticlick.captcha':'Anti-bot: {{q}}','anticlick.wrong':'Wrong answer!','anticlick.ok':'Thanks!',
  'misc.perSec':'{{v}}/sec','misc.perPiece':'{{v}}/piece',
  'tab.rec':'Recipes','tab.sell':'Sales','tab.bld':'Buildings','tab.emp':'Employees','tab.ach':'Achievements','tab.stats':'Stats',
  'stats.title':'Statistics','stats.totalEarned':'Total money earned','stats.totalCakes':'Cakes crafted','stats.totalSold':'Cakes sold',
  'stats.totalClicks':'Total clicks','stats.playTime':'Play time','stats.totalSalary':'Wages paid','stats.totalRent':'Rent paid',
  'stats.totalIngCost':'Ingredients cost','stats.rebirths':'Rebirths',
  'tuto.skip':'Skip tutorial','tuto.next':'Next',
  'tuto.step1':'Welcome! Click on Flour to start.',
  'tuto.step2':'Great! Now go to the Recipes tab.',
  'tuto.step3':'Prepare some Cookies with your ingredients!',
  'tuto.step4':'Perfect! Go to Sales to sell your cakes.',
  'tuto.done':'Well done! You know the basics. Good luck!',
  'offline.title':'Welcome back!','offline.text':'Away for {{t}}: you earned {{i}} ingredients and {{m}} from auto-sales.',
  'gameover.title':'Bankrupt!','gameover.text':'You lost all your money...','gameover.sellCakes':'Sell pastries','gameover.restart':'Restart',
  'event.price_surge':'Price surge! Sales +30% for {{t}}s','event.price_drop':'Price drop! Sales -20% for {{t}}s',
  'event.inflation':'Inflation! Ingredients +25% for {{t}}s','event.deflation':'Deflation! Ingredients -15% for {{t}}s',
  'event.rush_hour':'Rush hour! Sellers x2 for {{t}}s','event.ingredient_sale':'Sale! Ingredients -30% for {{t}}s',
  'event.tax_break':'Tax break! Rent -50% for {{t}}s','event.strike_wave':'Strike wave! Morale -20',
  'event.lucky_day':'Lucky day! XP x3 for {{t}}s','event.inspection':'Inspection! Forced cleanup...',
  'event.customer_wave':'Customer wave! Sales x2 for {{t}}s','event.power_outage':'Power outage! Auto-production stopped {{t}}s',
  'event.sugar_rush':'Sugar rush! Clicks x3 for {{t}}s','event.food_critic':'Food critic! Value +50% for {{t}}s',
  'event.supplier_strike':'Supplier strike! Ingredients +50% for {{t}}s','event.festival':'Festival! Everything +15% for {{t}}s',
  'event.bad_review':'Bad review! Sales -25% for {{t}}s','event.health_check':'Health check! Cakes confiscated...',
  'event.tv_feature':'TV feature! XP x5 for {{t}}s','event.apprentice_day':'Apprentice day! Employees x2 for {{t}}s',
  'settings.title':'Settings','settings.lang':'Language','settings.currency':'Currency','settings.theme':'Theme',
  'settings.themeLight':'Light','settings.themeDark':'Dark','settings.themeGreen':'Nature',
  'settings.themeNatureFleur':'Spring Blossom','settings.themeNatureAutomne':'Autumn','settings.themeNatureNeige':'Winter Snow',
  'settings.themePlage':'Beach','settings.themeEspace':'Space','settings.themeAnniversaire':'Birthday',
  'settings.themeDateLock':'Available on {{d}}','settings.themeNatureLock':'Unlock all 3 Nature themes first',
  'settings.themeLevelLock':'Level {{v}} required',
  'settings.reset':'Reset game','settings.resetConfirm':'Are you SURE you want to erase everything? All saves will be lost!','settings.resetDone':'Game reset!',
  'settings.cheatCode':'ADMIN Code','settings.cheatPlaceholder':'Enter code...','settings.cheatUnlocked':'Command console unlocked!','settings.cheatWrong':'Wrong code.',
  'settings.console':'Command console',
  'settings.music':'Music','settings.musicOn':'ON','settings.musicOff':'OFF','settings.musicVolume':'Volume','settings.musicTrack':'Track',
  'settings.sound':'Sounds','settings.soundOn':'ON','settings.soundOff':'OFF',
  'settings.particles':'Particles','settings.particlesOn':'ON','settings.particlesOff':'OFF',
  'settings.export':'Export save','settings.import':'Import save','settings.exportBtn':'Copy','settings.importBtn':'Load','settings.exported':'Code copied!','settings.imported':'Save imported!','settings.importError':'Invalid code!',
  'console.title':'Command console','console.placeholder':'Type a command...','console.send':'OK',
  'console.help':'Commands: /help, /level, /money, /max, /unmax, /undo, /building, /employee, /stats, /xp, /space, /rebirth, /debt, /theme, /buy, /sell, /random, /time, /patisserie, /birthday, /gameover, /reset, /(ingredient)',
  'ban.message':'You are banned for {{v}} minutes!',
  'lvl1000.title':'CONGRATULATIONS!','lvl1000.text':'You reached level 1000! You are a Legendary Master Baker! You unlocked ALL game content!',
  'debt.pay':'Pay','debt.paid':'Debts paid! Balance: {{v}}','debt.cantPay':'Not enough money to pay the debt!',
  'pause.title':'Paused','pause.resume':'Resume','pause.bakeries':'My bakeries',
  'bakery.title':'My Bakeries','bakery.current':'Current','bakery.go':'Go','bakery.sell':'Sell','bakery.rename':'Rename',
  'bakery.value':'Value: {{v}}','bakery.sellConfirm':'Sell {{n}} for {{v}}?','bakery.sold':'Bakery sold for {{v}}!',
  'bakery.openNew':'Open a new bakery','bakery.openCost':'Cost: {{v}}','bakery.opened':'New bakery opened: {{n}}!',
  // Birthday
  'birthday.title':'When is your birthday?','birthday.warning':'Warning: you cannot change this date later!',
  'birthday.confirm':'Confirm','birthday.boost':'Happy birthday! x2 bonus for 24h!',
  'birthday.happy':'Happy birthday!','birthday.dayLabel':'Day','birthday.monthLabel':'Month',
};

// ======================== ESPANOL ========================
LANGS.es = Object.assign({}, LANGS.en, {
  'title':'Pasteleria 2D Simulador',
  'ing.title':'Ingredientes','rec.title':'Recetas','sell.title':'Ventas',
  'bld.title':'Edificios','emp.title':'Empleados','ach.title':'Logros',
  'tab.rec':'Recetas','tab.sell':'Ventas','tab.bld':'Edificios','tab.emp':'Empleados','tab.ach':'Logros','tab.stats':'Estadisticas',
  'rebirth.title':'Nueva Pasteleria!','rebirth.btn':'Abrir!','rebirth.cancel':'Cancelar',
  'acc.title':'Entrar / Registrar','acc.login':'Entrar','acc.register':'Registrar','acc.logout':'Salir','acc.close':'Cerrar',
  'emp.collector':'Recolector','emp.baker':'Panadero','emp.seller':'Vendedor','emp.manager':'Gerente','emp.chef':'Chef',
  'stats.title':'Estadisticas','settings.title':'Ajustes',
  'pause.title':'Pausa','pause.resume':'Reanudar','pause.bakeries':'Mis pastelerias',
  'gameover.title':'Bancarrota!','gameover.text':'Perdiste todo tu dinero...',
  'tuto.step1':'Bienvenido! Haz clic en Harina para comenzar.',
  'sell.sellAllGlobal':'Vender todo','sell.noStock':'Nada que vender',
  'ing.resell':'Revender','ing.craftBtn':'Fabricar',
  'emp.applicants':'Candidatos','emp.accept':'Contratar','emp.reject':'Rechazar','emp.train':'Entrenar','emp.skill':'Habilidad',
});

// ======================== DEUTSCH ========================
LANGS.de = Object.assign({}, LANGS.en, {
  'title':'Konditorei 2D Simulator',
  'ing.title':'Zutaten','rec.title':'Rezepte','sell.title':'Verkauf',
  'bld.title':'Gebaude','emp.title':'Mitarbeiter','ach.title':'Erfolge',
  'tab.rec':'Rezepte','tab.sell':'Verkauf','tab.bld':'Gebaude','tab.emp':'Mitarbeiter','tab.ach':'Erfolge','tab.stats':'Statistik',
  'rebirth.title':'Neue Konditorei!','rebirth.btn':'Eroffnen!','rebirth.cancel':'Abbrechen',
  'acc.title':'Anmelden / Registrieren','acc.login':'Anmelden','acc.register':'Registrieren','acc.logout':'Abmelden','acc.close':'Schliessen',
  'emp.collector':'Sammler','emp.baker':'Backer','emp.seller':'Verkaufer','emp.manager':'Manager','emp.chef':'Chefkoch',
  'stats.title':'Statistik','settings.title':'Einstellungen',
  'pause.title':'Pause','pause.resume':'Fortsetzen','pause.bakeries':'Meine Konditoreien',
  'gameover.title':'Bankrott!','gameover.text':'Du hast dein ganzes Geld verloren...',
  'sell.sellAllGlobal':'Alles verkaufen',
  'emp.applicants':'Bewerber','emp.accept':'Einstellen','emp.reject':'Ablehnen','emp.train':'Ausbilden','emp.skill':'Fahigkeit',
});

// ======================== PORTUGUES ========================
LANGS.pt = Object.assign({}, LANGS.en, {
  'title':'Confeitaria 2D Simulador',
  'ing.title':'Ingredientes','rec.title':'Receitas','sell.title':'Vendas',
  'bld.title':'Edificios','emp.title':'Funcionarios','ach.title':'Conquistas',
  'tab.rec':'Receitas','tab.sell':'Vendas','tab.bld':'Edificios','tab.emp':'Funcionarios','tab.ach':'Conquistas','tab.stats':'Estatisticas',
  'emp.collector':'Coletor','emp.baker':'Padeiro','emp.seller':'Vendedor','emp.manager':'Gerente','emp.chef':'Chef',
  'stats.title':'Estatisticas','settings.title':'Configuracoes',
  'pause.title':'Pausa','pause.resume':'Continuar',
  'gameover.title':'Falencia!','gameover.text':'Voce perdeu todo o seu dinheiro...',
});

// ======================== CHINOIS ========================
LANGS.zh = Object.assign({}, LANGS.en, {
  'title':'\u7CD5\u70B9\u5E972D\u6A21\u62DF\u5668',
  'ing.title':'\u539F\u6599','rec.title':'\u914D\u65B9','sell.title':'\u9500\u552E',
  'bld.title':'\u5EFA\u7B51','emp.title':'\u5458\u5DE5','ach.title':'\u6210\u5C31',
  'tab.rec':'\u914D\u65B9','tab.sell':'\u9500\u552E','tab.bld':'\u5EFA\u7B51','tab.emp':'\u5458\u5DE5','tab.ach':'\u6210\u5C31','tab.stats':'\u7EDF\u8BA1',
  'stats.title':'\u7EDF\u8BA1','settings.title':'\u8BBE\u7F6E',
  'emp.collector':'\u91C7\u96C6\u5458','emp.baker':'\u9762\u5305\u5E08','emp.seller':'\u9500\u552E\u5458','emp.manager':'\u7ECF\u7406','emp.chef':'\u4E3B\u53A8',
});

// ======================== JAPONAIS ========================
LANGS.ja = Object.assign({}, LANGS.en, {
  'title':'\u30B1\u30FC\u30AD\u5C4B2D\u30B7\u30DF\u30E5\u30EC\u30FC\u30BF\u30FC',
  'ing.title':'\u6750\u6599','rec.title':'\u30EC\u30B7\u30D4','sell.title':'\u8CA9\u58F2',
  'bld.title':'\u5EFA\u7269','emp.title':'\u5F93\u696D\u54E1','ach.title':'\u5B9F\u7E3E',
  'tab.rec':'\u30EC\u30B7\u30D4','tab.sell':'\u8CA9\u58F2','tab.bld':'\u5EFA\u7269','tab.emp':'\u5F93\u696D\u54E1','tab.ach':'\u5B9F\u7E3E','tab.stats':'\u7D71\u8A08',
  'stats.title':'\u7D71\u8A08','settings.title':'\u8A2D\u5B9A',
  'emp.collector':'\u63A1\u96C6\u8005','emp.baker':'\u30D1\u30F3\u5C4B','emp.seller':'\u8CA9\u58F2\u54E1','emp.manager':'\u30DE\u30CD\u30FC\u30B8\u30E3\u30FC','emp.chef':'\u30B7\u30A7\u30D5',
});

// ======================== COREEN ========================
LANGS.ko = Object.assign({}, LANGS.en, {
  'title':'\uC81C\uACFC\uC810 2D \uC2DC\uBBAC\uB808\uC774\uD130',
  'ing.title':'\uC7AC\uB8CC','rec.title':'\uB808\uC2DC\uD53C','sell.title':'\uD310\uB9E4',
  'bld.title':'\uAC74\uBB3C','emp.title':'\uC9C1\uC6D0','ach.title':'\uC5C5\uC801',
  'tab.rec':'\uB808\uC2DC\uD53C','tab.sell':'\uD310\uB9E4','tab.bld':'\uAC74\uBB3C','tab.emp':'\uC9C1\uC6D0','tab.ach':'\uC5C5\uC801','tab.stats':'\uD1B5\uACC4',
  'stats.title':'\uD1B5\uACC4','settings.title':'\uC124\uC815',
});

// ======================== ARABE ========================
LANGS.ar = Object.assign({}, LANGS.en, {
  'title':'\u0645\u062E\u0628\u0632 2D \u0645\u062D\u0627\u0643\u064A',
  'ing.title':'\u0627\u0644\u0645\u0643\u0648\u0646\u0627\u062A','rec.title':'\u0627\u0644\u0648\u0635\u0641\u0627\u062A','sell.title':'\u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A',
  'bld.title':'\u0627\u0644\u0645\u0628\u0627\u0646\u064A','emp.title':'\u0627\u0644\u0645\u0648\u0638\u0641\u0648\u0646','ach.title':'\u0627\u0644\u0625\u0646\u062C\u0627\u0632\u0627\u062A',
  'tab.stats':'\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A',
  'stats.title':'\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A','settings.title':'\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A',
});

// ======================== HINDI ========================
LANGS.hi = Object.assign({}, LANGS.en, {
  'title':'\u092C\u0947\u0915\u0930\u0940 2D \u0938\u093F\u092E\u0941\u0932\u0947\u091F\u0930',
  'ing.title':'\u0938\u093E\u092E\u0917\u094D\u0930\u0940','rec.title':'\u0930\u0947\u0938\u093F\u092A\u0940','sell.title':'\u092C\u093F\u0915\u094D\u0930\u0940',
  'bld.title':'\u0907\u092E\u093E\u0930\u0924\u0947\u0902','emp.title':'\u0915\u0930\u094D\u092E\u091A\u093E\u0930\u0940','ach.title':'\u0909\u092A\u0932\u092C\u094D\u0927\u093F\u092F\u093E\u0902',
  'tab.stats':'\u0906\u0901\u0915\u0921\u093C\u0947',
  'stats.title':'\u0906\u0901\u0915\u0921\u093C\u0947','settings.title':'\u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938',
});

// Ingredient names for FR and EN (other languages fall back to EN)
(function() {
  var frIng = {farine:'Farine',oeuf:'Oeufs',sucre:'Sucre',beurre:'Beurre',lait:'Lait',cacao:'Cacao',fraise:'Fraises',chocolat:'Chocolat',vanille:'Vanille',creme:'Creme',amande:'Amandes',miel:'Miel',citron:'Citron',pomme:'Pommes',cannelle:'Cannelle',cafe:'Cafe',pistache:'Pistache',caramel:'Caramel',framb:'Framboises',noixcoco:'Noix de coco',safran:'Safran',truffe:'Truffe',orfeuille:'Or alimentaire',matcha:'Matcha',mangue:'Mangue',lavande:'Lavande',noisette:'Noisettes',gingembre:'Gingembre',rhum:'Rhum',rose:'Rose',bergamote:'Bergamote',yuzu:'Yuzu',praline:'Praline',meringue:'Meringue',mascarpone:'Mascarpone',cardamome:'Cardamome',anis:'Anis etoile',piment:'Piment',wasabi:'Wasabi',edelfleiss:'Edelweiss',ambrosie:'Ambrosie',nectar:'Nectar divin',poudreetoile:'Poudre d\'etoile',essencetps:'Essence du temps',cristalceleste:'Cristal celeste',flamcosm:'Flamme cosmique',infinipur:'Infini pur'};
  var enIng = {farine:'Flour',oeuf:'Eggs',sucre:'Sugar',beurre:'Butter',lait:'Milk',cacao:'Cocoa',fraise:'Strawberries',chocolat:'Chocolate',vanille:'Vanilla',creme:'Cream',amande:'Almonds',miel:'Honey',citron:'Lemon',pomme:'Apples',cannelle:'Cinnamon',cafe:'Coffee',pistache:'Pistachio',caramel:'Caramel',framb:'Raspberries',noixcoco:'Coconut',safran:'Saffron',truffe:'Truffle',orfeuille:'Edible gold',matcha:'Matcha',mangue:'Mango',lavande:'Lavender',noisette:'Hazelnuts',gingembre:'Ginger',rhum:'Rum',rose:'Rose',bergamote:'Bergamot',yuzu:'Yuzu',praline:'Praline',meringue:'Meringue',mascarpone:'Mascarpone',cardamome:'Cardamom',anis:'Star anise',piment:'Chili',wasabi:'Wasabi',edelfleiss:'Edelweiss',ambrosie:'Ambrosia',nectar:'Divine nectar',poudreetoile:'Stardust',essencetps:'Time essence',cristalceleste:'Celestial crystal',flamcosm:'Cosmic flame',infinipur:'Pure infinity'};
  for (var k in frIng) { LANGS.fr['i.'+k] = frIng[k]; }
  for (var k in enIng) { LANGS.en['i.'+k] = enIng[k]; }

  // Recipe names
  var frRec = {cookie:'Cookies x6',cake:'Gateau simple',crepe:'Crepes x8',madel:'Madeleines x4',pancake:'Pancakes x10',brownie:'Brownie',muffin:'Muffins x6',eclair:'Eclairs x4',fraisier:'Fraisier',fondant:'Fondant chocolat',tiramisu:'Tiramisu',cheesecake:'Cheesecake',chouquette:'Chouquettes x12',tarte_cit:'Tarte citron',macaron:'Macarons x8',millefeuille:'Mille-feuille',tarte_pom:'Tarte pommes',parisb:'Paris-Brest',opera:'Opera',baba:'Baba au rhum',canele:'Caneles x6',saintho:'Saint-Honore',pistamac:'Macarons pistache',mousse_ch:'Mousse chocolat',cremet:'Creme brulee x4',trop:'Tropezienne',coconut:'Gateau coco',caramelia:'Caramelia',framboisier:'Framboisier',royale:'Galette des rois',safranc:'Gateau safran',montblanc:'Mont-Blanc',truffecake:'Gateau truffe',croquemb:'Croquembouche',piecemont:'Piece montee',goldengate:'Gateau en or',matchacake:'Gateau matcha',manguier:'Manguier',lavandine:'Lavandine',pralineur:'Pralineur',gingemb:'Pain d\'epice',rhumba:'Baba royal',rosecake:'Gateau rose',bergamotte:'Bergamotte cake',yuzutart:'Tarte yuzu',pralineroyal:'Praline royal',meringuee:'Meringuee celeste',tiramigrand:'Tiramisu imperial',cardamomecake:'Gateau cardamome',anisstar:'Etoile anisee',volcancake:'Volcan chocolat',cloudcake:'Gateau nuage',wasabisurp:'Surprise wasabi',ambrosiacake:'Gateau ambrosie',nectarcake:'Gateau nectar',rainbowcake:'Rainbow cake',temporalcake:'Gateau temporel',celestecake:'Gateau celeste',cosmocake:'Gateau cosmique',infinicake:'Gateau infini'};
  var enRec = {cookie:'Cookies x6',cake:'Simple cake',crepe:'Crepes x8',madel:'Madeleines x4',pancake:'Pancakes x10',brownie:'Brownie',muffin:'Muffins x6',eclair:'Eclairs x4',fraisier:'Strawberry cake',fondant:'Chocolate fondant',tiramisu:'Tiramisu',cheesecake:'Cheesecake',chouquette:'Chouquettes x12',tarte_cit:'Lemon tart',macaron:'Macarons x8',millefeuille:'Mille-feuille',tarte_pom:'Apple tart',parisb:'Paris-Brest',opera:'Opera',baba:'Rum baba',canele:'Caneles x6',saintho:'Saint-Honore',pistamac:'Pistachio macarons',mousse_ch:'Chocolate mousse',cremet:'Creme brulee x4',trop:'Tropezienne',coconut:'Coconut cake',caramelia:'Caramelia',framboisier:'Raspberry cake',royale:'King cake',safranc:'Saffron cake',montblanc:'Mont-Blanc',truffecake:'Truffle cake',croquemb:'Croquembouche',piecemont:'Wedding cake',goldengate:'Golden cake',matchacake:'Matcha cake',manguier:'Mango cake',lavandine:'Lavender cake',pralineur:'Praline cake',gingemb:'Gingerbread',rhumba:'Royal baba',rosecake:'Rose cake',bergamotte:'Bergamot cake',yuzutart:'Yuzu tart',pralineroyal:'Royal praline',meringuee:'Celestial meringue',tiramigrand:'Imperial tiramisu',cardamomecake:'Cardamom cake',anisstar:'Anise star',volcancake:'Chocolate volcano',cloudcake:'Cloud cake',wasabisurp:'Wasabi surprise',ambrosiacake:'Ambrosia cake',nectarcake:'Nectar cake',rainbowcake:'Rainbow cake',temporalcake:'Temporal cake',celestecake:'Celestial cake',cosmocake:'Cosmic cake',infinicake:'Infinite cake'};
  for (var k in frRec) { LANGS.fr['r.'+k] = frRec[k]; }
  for (var k in enRec) { LANGS.en['r.'+k] = enRec[k]; }

  // Building names
  var frBld = {moulin:'Moulin',ferme:'Ferme',sucrerie:'Sucrerie',beurrerie:'Beurrerie',laiterie:'Laiterie',cacaotiere:'Cacaotiere',serrefraise:'Serre fraises',chocolaterie:'Chocolaterie',vanillerie:'Vanillerie',cremerie:'Cremerie',verger:'Verger',rucher:'Rucher',citronnier:'Citronniers',pommier:'Pommiers',fourind:'Four industriel',fourpat:'Four patissier',usinegat:'Usine gateaux',megafour:'Mega-four',labochoc:'Labo chocolat',plantasafran:'Plantation safran',truffiere:'Truffiere',alchimie:'Alchimie doree',megausine:'Mega-usine',complexe:'Complexe laitier',paradis:'Paradis vanille',quantumoven:'Four quantique',tempsfour:'Four temporel',celestefarm:'Ferme celeste',infinibaker:'Boulangerie infinie'};
  var enBld = {moulin:'Mill',ferme:'Farm',sucrerie:'Sugar mill',beurrerie:'Creamery',laiterie:'Dairy',cacaotiere:'Cocoa plantation',serrefraise:'Strawberry greenhouse',chocolaterie:'Chocolate factory',vanillerie:'Vanilla farm',cremerie:'Cream dairy',verger:'Orchard',rucher:'Apiary',citronnier:'Lemon grove',pommier:'Apple orchard',fourind:'Industrial oven',fourpat:'Pastry oven',usinegat:'Cake factory',megafour:'Mega-oven',labochoc:'Chocolate lab',plantasafran:'Saffron plantation',truffiere:'Truffle farm',alchimie:'Golden alchemy',megausine:'Mega-factory',complexe:'Dairy complex',paradis:'Vanilla paradise',quantumoven:'Quantum oven',tempsfour:'Temporal oven',celestefarm:'Celestial farm',infinibaker:'Infinite bakery'};
  for (var k in frBld) { LANGS.fr['b.'+k] = frBld[k]; }
  for (var k in enBld) { LANGS.en['b.'+k] = enBld[k]; }
})();

// ============ Translation function ============
function t(key, params) {
  var str = (LANGS[currentLang] && LANGS[currentLang][key]) || (LANGS.en[key]) || (LANGS.fr[key]) || key;
  if (params) {
    for (var k in params) {
      if (params.hasOwnProperty(k)) {
        str = str.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), params[k]);
      }
    }
  }
  return str;
}

function setLanguage(code) {
  if (!LANGS[code]) return;
  currentLang = code;
  document.documentElement.lang = code;
  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
  if (typeof G !== 'undefined') G.settings.lang = code;
  if (typeof fullRender === 'function') fullRender();
}

function getLangName(code) {
  for (var i = 0; i < LANG_LIST.length; i++) {
    if (LANG_LIST[i].code === code) return LANG_LIST[i].flag + ' ' + LANG_LIST[i].name;
  }
  return code;
}

// Format money with current currency (supports up to Centillion)
function fmtMoney(amount) {
  var curr = CURRENCIES[0]; // default EUR
  if (typeof G !== 'undefined' && G.settings && G.settings.currency) {
    for (var i = 0; i < CURRENCIES.length; i++) {
      if (CURRENCIES[i].id === G.settings.currency) { curr = CURRENCIES[i]; break; }
    }
  }
  var converted = amount * curr.rate;
  if (converted < 1000) return Math.floor(converted) + curr.symbol;
  // Use fmt() for large numbers if available
  if (typeof fmt === 'function') return fmt(converted) + curr.symbol;
  return Math.floor(converted) + curr.symbol;
}
