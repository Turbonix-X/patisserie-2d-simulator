/* ============================================
   PATISSERIE 2D SIMULATOR - GAME DATA
   Ingredients, Recipes, Buildings,
   Employees, Space, Rebirths, Achievements,
   Currencies, Events
   ============================================ */

var GAME_VERSION = '1.4';

// ============ CURRENCIES ============
var CURRENCIES = [
  { id:'eur', symbol:'\u20ac', name:'Euro',              fullName:'Euro' ,              rate:1 },
  { id:'usd', symbol:'$',      name:'Dollar',            fullName:'Dollar americain',   rate:1.08 },
  { id:'gbp', symbol:'\u00a3', name:'Pound',             fullName:'Livre sterling',     rate:0.86 },
  { id:'mad', symbol:'MAD',    name:'Dirham marocain',   fullName:'Dirham marocain',    rate:10.80 },
  { id:'aed', symbol:'AED',    name:'Dirham emirati',    fullName:'Dirham des Emirats arabes unis', rate:3.97 },
  { id:'jpy', symbol:'\u00a5', name:'Yen',               fullName:'Yen japonais',       rate:162.0 },
  { id:'cny', symbol:'\u00a5', name:'Yuan',              fullName:'Yuan chinois',       rate:7.80 },
  { id:'krw', symbol:'\u20a9', name:'Won',               fullName:'Won sud-coreen',     rate:1420 },
  { id:'inr', symbol:'\u20b9', name:'Rupee',             fullName:'Roupie indienne',    rate:90.0 },
  { id:'brl', symbol:'R$',     name:'Real',              fullName:'Real bresilien',     rate:5.30 },
  { id:'sar', symbol:'SR',     name:'Riyal',             fullName:'Riyal saoudien',     rate:4.05 },
];

// ============ INGREDIENTS ============
var ING = [
  // Tier 1 - Basique (Niv 1-5)
  { id:'farine',    e:'\u{1F33E}', unlockLvl:1,  cost:0.80, space:0.5,  resellRate:0.5 },
  { id:'oeuf',      e:'\u{1F95A}', unlockLvl:1,  cost:0.30, space:0.05, resellRate:0.5 },
  { id:'sucre',     e:'\u{1F36C}', unlockLvl:1,  cost:0.90, space:0.5,  resellRate:0.5 },
  { id:'beurre',    e:'\u{1F9C8}', unlockLvl:2,  cost:1.50, space:0.2,  resellRate:0.5 },
  { id:'lait',      e:'\u{1F95B}', unlockLvl:3,  cost:1.10, space:0.3,  resellRate:0.5 },
  // Tier 2 - Intermediaire (Niv 5-15)
  { id:'cacao',     e:'\u{1FAD8}', unlockLvl:5,  cost:2.50, space:0.3,  resellRate:0.5 },
  { id:'fraise',    e:'\u{1F353}', unlockLvl:6,  cost:3.00, space:0.2,  resellRate:0.5 },
  { id:'chocolat',  e:'\u{1F36B}', unlockLvl:8,  cost:4.50, space:0.3,  resellRate:0.5, craftable:true, craftReq:{sucre:2,cacao:3}, craftTime:3 },
  { id:'vanille',   e:'\u{1F33C}', unlockLvl:10, cost:6.00, space:0.1,  resellRate:0.5 },
  { id:'creme',     e:'\u{1F376}', unlockLvl:12, cost:3.50, space:0.3,  resellRate:0.5, craftable:true, craftReq:{lait:3,sucre:1}, craftTime:2 },
  { id:'amande',    e:'\u{1F95C}', unlockLvl:15, cost:5.00, space:0.2,  resellRate:0.5 },
  // Tier 3 - Avance (Niv 18-35)
  { id:'miel',      e:'\u{1F36F}', unlockLvl:18, cost:7.00, space:0.2,  resellRate:0.5 },
  { id:'citron',    e:'\u{1F34B}', unlockLvl:20, cost:1.50, space:0.1,  resellRate:0.5 },
  { id:'pomme',     e:'\u{1F34E}', unlockLvl:22, cost:2.00, space:0.15, resellRate:0.5 },
  { id:'cannelle',  e:'\u{1F7E4}', unlockLvl:25, cost:8.00, space:0.05, resellRate:0.5 },
  { id:'cafe',      e:'\u2615',    unlockLvl:28, cost:10.00,space:0.2,  resellRate:0.5 },
  { id:'pistache',  e:'\u{1F7E2}', unlockLvl:30, cost:12.00,space:0.15, resellRate:0.5 },
  { id:'caramel',   e:'\u{1F7E0}', unlockLvl:33, cost:5.00, space:0.2,  resellRate:0.5, craftable:true, craftReq:{sucre:4,beurre:2,creme:1}, craftTime:4 },
  { id:'framb',     e:'\u{1FAD0}', unlockLvl:35, cost:4.50, space:0.15, resellRate:0.5 },
  // Tier 4 - Expert (Niv 38-55)
  { id:'noixcoco',  e:'\u{1F965}', unlockLvl:38, cost:3.50, space:0.3,  resellRate:0.5 },
  { id:'safran',    e:'\u{1F33A}', unlockLvl:42, cost:30.00,space:0.02, resellRate:0.5 },
  { id:'truffe',    e:'\u{1F344}', unlockLvl:48, cost:50.00,space:0.1,  resellRate:0.5 },
  { id:'orfeuille', e:'\u2728',    unlockLvl:55, cost:100.00,space:0.01,resellRate:0.5 },
  // Tier 5 - Maitre (Niv 60-100)
  { id:'matcha',    e:'\u{1F375}', unlockLvl:60, cost:25.00,space:0.1,  resellRate:0.5 },
  { id:'mangue',    e:'\u{1F96D}', unlockLvl:65, cost:4.00, space:0.2,  resellRate:0.5 },
  { id:'lavande',   e:'\u{1F49C}', unlockLvl:70, cost:15.00,space:0.05, resellRate:0.5 },
  { id:'noisette',  e:'\u{1F330}', unlockLvl:75, cost:8.00, space:0.15, resellRate:0.5 },
  { id:'gingembre', e:'\u{1FADA}', unlockLvl:80, cost:6.00, space:0.1,  resellRate:0.5 },
  { id:'rhum',      e:'\u{1F943}', unlockLvl:85, cost:18.00,space:0.2,  resellRate:0.5 },
  { id:'rose',      e:'\u{1F339}', unlockLvl:90, cost:20.00,space:0.05, resellRate:0.5 },
  { id:'bergamote', e:'\u{1F34A}', unlockLvl:95, cost:12.00,space:0.1,  resellRate:0.5 },
  // Tier 6 - Legendaire (Niv 100-200)
  { id:'yuzu',      e:'\u{1F34B}', unlockLvl:100,cost:15.00,space:0.1,  resellRate:0.5 },
  { id:'praline',   e:'\u{1F36B}', unlockLvl:120,cost:20.00,space:0.15, resellRate:0.5, craftable:true, craftReq:{amande:3,sucre:3,caramel:2}, craftTime:5 },
  { id:'meringue',  e:'\u2601\uFE0F',unlockLvl:140,cost:8.00,space:0.3,resellRate:0.5, craftable:true, craftReq:{oeuf:4,sucre:5}, craftTime:6 },
  { id:'mascarpone',e:'\u{1F9C0}', unlockLvl:160,cost:12.00,space:0.3, resellRate:0.5 },
  { id:'cardamome', e:'\u{1F33F}', unlockLvl:180,cost:25.00,space:0.05, resellRate:0.5 },
  { id:'anis',      e:'\u2B50',    unlockLvl:200,cost:18.00,space:0.05, resellRate:0.5 },
  // Tier 7 - Mythique (Niv 250-500)
  { id:'piment',    e:'\u{1F336}\uFE0F',unlockLvl:250,cost:5.00,space:0.05,resellRate:0.5 },
  { id:'wasabi',    e:'\u{1F7E2}', unlockLvl:300,cost:35.00,space:0.05, resellRate:0.5 },
  { id:'edelfleiss',e:'\u{1F3D4}\uFE0F',unlockLvl:350,cost:80.00,space:0.05,resellRate:0.5 },
  { id:'ambrosie',  e:'\u{1FA77}', unlockLvl:400,cost:200.00,space:0.05,resellRate:0.5 },
  { id:'nectar',    e:'\u{1F31F}', unlockLvl:500,cost:500.00,space:0.05,resellRate:0.5 },
  // Tier 8 - Divin (Niv 600-1000)
  { id:'poudreetoile', e:'\u{1FA90}',unlockLvl:600,cost:1000.00,space:0.02,resellRate:0.5 },
  { id:'essencetps',   e:'\u231B',   unlockLvl:700,cost:5000.00,space:0.01,resellRate:0.5 },
  { id:'cristalceleste',e:'\u{1F48E}',unlockLvl:800,cost:25000.00,space:0.01,resellRate:0.5 },
  { id:'flamcosm',     e:'\u{1F525}',unlockLvl:900,cost:100000.00,space:0.01,resellRate:0.5 },
  { id:'infinipur',    e:'\u267E\uFE0F',unlockLvl:1000,cost:1000000.00,space:0.01,resellRate:0.5 },
];

// ============ RECIPES ============
// val = sell price in euros (realistic bakery prices)
var REC = [
  // Tier 1 (Niv 1-5) - basic bakery items
  { id:'cookie',    e:'\u{1F36A}', req:{farine:2,sucre:2,oeuf:1},                           val:3,     qty:6,  unlockLvl:1,  space:0.5, prepTime:2,  xp:5 },
  { id:'cake',      e:'\u{1F382}', req:{farine:3,oeuf:2,sucre:2,beurre:1},                  val:6,     qty:1,  unlockLvl:2,  space:1,   prepTime:3,  xp:10 },
  { id:'crepe',     e:'\u{1F95E}', req:{farine:3,oeuf:3,lait:2,beurre:1},                   val:4,     qty:8,  unlockLvl:3,  space:0.5, prepTime:3,  xp:12 },
  { id:'madel',     e:'\u{1F9C1}', req:{farine:2,oeuf:2,sucre:3,beurre:2,lait:1},           val:5,     qty:4,  unlockLvl:4,  space:0.5, prepTime:4,  xp:18 },
  { id:'pancake',   e:'\u{1F95E}', req:{farine:4,oeuf:3,lait:3,sucre:2},                    val:4,     qty:10, unlockLvl:5,  space:0.5, prepTime:3,  xp:15 },
  // Tier 2 (Niv 6-12)
  { id:'brownie',   e:'\u{1F7EB}', req:{farine:4,oeuf:3,sucre:4,beurre:3,cacao:4},          val:8,     qty:1,  unlockLvl:6,  space:1,   prepTime:5,  xp:30 },
  { id:'muffin',    e:'\u{1F9C1}', req:{farine:3,oeuf:2,sucre:3,beurre:2,fraise:3},         val:6,     qty:6,  unlockLvl:7,  space:1,   prepTime:5,  xp:28 },
  { id:'eclair',    e:'\u{1F956}', req:{farine:5,oeuf:4,beurre:3,chocolat:4,creme:2},       val:12,    qty:4,  unlockLvl:8,  space:1,   prepTime:7,  xp:45 },
  { id:'fraisier',  e:'\u{1F370}', req:{farine:5,oeuf:4,sucre:5,beurre:2,lait:3,fraise:8},  val:22,    qty:1,  unlockLvl:9,  space:2,   prepTime:8,  xp:55 },
  { id:'fondant',   e:'\u{1F36E}', req:{farine:3,oeuf:4,sucre:3,beurre:4,cacao:5,chocolat:6},val:18,   qty:1,  unlockLvl:10, space:1.5, prepTime:8,  xp:65 },
  { id:'tiramisu',  e:'\u{1F370}', req:{oeuf:5,sucre:4,creme:5,cafe:3,cacao:3},             val:20,    qty:1,  unlockLvl:11, space:1.5, prepTime:6,  xp:70 },
  { id:'cheesecake',e:'\u{1F9C0}', req:{farine:4,oeuf:3,sucre:5,beurre:3,creme:6,vanille:2},val:25,    qty:1,  unlockLvl:13, space:2,   prepTime:10, xp:85 },
  // Tier 3 (Niv 14-25)
  { id:'chouquette',e:'\u{1F535}', req:{farine:5,oeuf:4,beurre:4,lait:3,sucre:4},           val:5,     qty:12, unlockLvl:14, space:1,   prepTime:6,  xp:75 },
  { id:'tarte_cit', e:'\u{1F34B}', req:{farine:6,oeuf:4,sucre:6,beurre:4,citron:8},         val:28,    qty:1,  unlockLvl:16, space:2,   prepTime:12, xp:100 },
  { id:'macaron',   e:'\u{1F7E3}', req:{amande:6,sucre:5,oeuf:3,creme:3,fraise:3},          val:4,     qty:8,  unlockLvl:17, space:1,   prepTime:10, xp:110 },
  { id:'millefeuille',e:'\u{1F4DA}',req:{farine:8,beurre:6,creme:5,vanille:3,sucre:4},      val:4,     qty:1,  unlockLvl:19, space:2,   prepTime:15, xp:140 },
  { id:'tarte_pom', e:'\u{1F34E}', req:{farine:6,beurre:5,sucre:4,pomme:10,cannelle:3},     val:26,    qty:1,  unlockLvl:21, space:2,   prepTime:12, xp:130 },
  { id:'parisb',    e:'\u{1F950}', req:{farine:7,oeuf:5,beurre:5,creme:6,amande:5},         val:35,    qty:1,  unlockLvl:23, space:2.5, prepTime:15, xp:170 },
  { id:'opera',     e:'\u{1F3AD}', req:{farine:6,oeuf:5,beurre:5,chocolat:6,cafe:5,creme:4},val:45,    qty:1,  unlockLvl:25, space:2.5, prepTime:18, xp:200 },
  // Tier 4 (Niv 26-40)
  { id:'baba',      e:'\u{1F369}', req:{farine:5,oeuf:4,sucre:5,beurre:3,creme:5,vanille:3},val:30,    qty:1,  unlockLvl:26, space:2,   prepTime:10, xp:160 },
  { id:'canele',    e:'\u{1F7E4}', req:{farine:4,oeuf:3,lait:5,sucre:4,vanille:4,beurre:3}, val:6,     qty:6,  unlockLvl:27, space:1.5, prepTime:12, xp:185 },
  { id:'saintho',   e:'\u{1F451}', req:{farine:8,oeuf:6,beurre:6,creme:8,sucre:6,vanille:4},val:55,    qty:1,  unlockLvl:29, space:3,   prepTime:20, xp:250 },
  { id:'pistamac',  e:'\u{1F7E2}', req:{amande:5,pistache:6,sucre:5,oeuf:3,creme:4},        val:8,     qty:6,  unlockLvl:31, space:1.5, prepTime:12, xp:230 },
  { id:'mousse_ch', e:'\u{1FAD5}', req:{chocolat:8,oeuf:5,sucre:4,creme:5,vanille:2},       val:35,    qty:1,  unlockLvl:32, space:2,   prepTime:8,  xp:215 },
  { id:'cremet',    e:'\u{1F36E}', req:{oeuf:6,sucre:5,creme:8,vanille:4,lait:4},            val:12,    qty:4,  unlockLvl:34, space:1.5, prepTime:10, xp:240 },
  { id:'trop',      e:'\u{1F334}', req:{farine:8,oeuf:5,sucre:6,beurre:5,creme:7,vanille:4,framb:5},val:60,qty:1, unlockLvl:36, space:3, prepTime:20, xp:320 },
  { id:'coconut',   e:'\u{1F965}', req:{farine:6,oeuf:4,sucre:5,beurre:4,noixcoco:8,creme:4},val:40,   qty:1,  unlockLvl:38, space:2.5, prepTime:15, xp:290 },
  { id:'caramelia', e:'\u{1F7E0}', req:{farine:7,oeuf:5,sucre:6,beurre:6,caramel:8,creme:5},val:50,    qty:1,  unlockLvl:40, space:3,   prepTime:18, xp:370 },
  // Tier 5 (Niv 41-58)
  { id:'framboisier',e:'\u{1FAD0}',req:{farine:150,oeuf:120,sucre:100,beurre:80,framb:200,creme:100}, val:55,    qty:1,  unlockLvl:41, space:3,   prepTime:18, xp:350 },
  { id:'royale',    e:'\u{1F451}', req:{farine:400,beurre:300,oeuf:250,amande:350,sucre:200,creme:180},val:70,    qty:1,  unlockLvl:43, space:3.5, prepTime:22, xp:440 },
  { id:'safranc',   e:'\u{1F33A}', req:{farine:800,oeuf:600,sucre:500,beurre:500,safran:1200,creme:600,miel:400},val:120,qty:1, unlockLvl:45, space:3.5, prepTime:25, xp:540 },
  { id:'montblanc', e:'\u{1F3D4}\uFE0F', req:{farine:2500,oeuf:2000,sucre:1800,creme:3000,vanille:1500,amande:2500,miel:1200},val:85,qty:1, unlockLvl:47, space:3.5, prepTime:22, xp:490 },
  { id:'truffecake',e:'\u{1F344}', req:{farine:8000,oeuf:6000,beurre:5000,chocolat:8000,truffe:12000,creme:6000},val:180,qty:1, unlockLvl:49, space:4, prepTime:28, xp:730 },
  { id:'croquemb',  e:'\u{1F5FC}', req:{farine:25000,oeuf:20000,beurre:15000,sucre:18000,creme:15000,vanille:10000,caramel:12000},val:250,qty:1, unlockLvl:52, space:5, prepTime:35, xp:980 },
  { id:'piecemont', e:'\u{1F3F0}', req:{farine:80000,oeuf:60000,sucre:50000,beurre:40000,creme:45000,chocolat:35000,vanille:25000,amande:30000},val:400,qty:1, unlockLvl:55, space:6, prepTime:45, xp:1450 },
  { id:'goldengate',e:'\u2728',    req:{farine:250000,oeuf:180000,sucre:150000,beurre:120000,creme:150000,chocolat:100000,vanille:80000,orfeuille:200000,safran:120000,truffe:100000},val:800,qty:1, unlockLvl:58, space:8, prepTime:60, xp:2700 },
  // Tier 6 (Niv 60-100)
  { id:'matchacake',e:'\u{1F375}', req:{farine:1e6,oeuf:800000,sucre:600000,matcha:1.5e6,creme:900000,amande:700000},val:900, qty:1, unlockLvl:62, space:4, prepTime:35, xp:2900 },
  { id:'manguier',  e:'\u{1F96D}', req:{farine:5e6,oeuf:3.5e6,sucre:3e6,mangue:8e6,creme:4e6,vanille:2e6},val:1100,qty:1, unlockLvl:67, space:4, prepTime:38, xp:3400 },
  { id:'lavandine', e:'\u{1F49C}', req:{farine:2e7,oeuf:1.5e7,lavande:3e7,miel:1.8e7,creme:1.5e7,vanille:1e7},val:1400,qty:1, unlockLvl:72, space:4.5, prepTime:42, xp:4100 },
  { id:'pralineur', e:'\u{1F330}', req:{farine:8e7,oeuf:5e7,noisette:1.2e8,chocolat:8e7,creme:6e7,caramel:4e7},val:1800,qty:1, unlockLvl:77, space:4.5, prepTime:45, xp:4800 },
  { id:'gingemb',   e:'\u{1FADA}', req:{farine:3e8,oeuf:2e8,gingembre:5e8,miel:2.5e8,cannelle:1.5e8,sucre:2e8},val:1500,qty:1, unlockLvl:82, space:4, prepTime:35, xp:4400 },
  { id:'rhumba',    e:'\u{1F943}', req:{farine:1e9,oeuf:7e8,rhum:1.5e9,sucre:8e8,beurre:7e8,vanille:4e8,creme:6e8},val:2200,qty:1, unlockLvl:87, space:5, prepTime:48, xp:5800 },
  { id:'rosecake',  e:'\u{1F339}', req:{farine:5e9,oeuf:3e9,rose:8e9,sucre:4e9,creme:5e9,vanille:2e9},val:2800,qty:1, unlockLvl:92, space:5, prepTime:50, xp:7200 },
  { id:'bergamotte',e:'\u{1F34A}', req:{farine:2e10,oeuf:1.2e10,bergamote:3e10,citron:1.5e10,creme:1.5e10,miel:1e10},val:3500,qty:1, unlockLvl:97, space:5, prepTime:55, xp:8700 },
  // Tier 7 (Niv 100-200) - common: billions to trillions, rare: small
  { id:'yuzutart',  e:'\u{1F34B}', req:{farine:5e9,oeuf:3e9,yuzu:8,sucre:4e9,creme:3e9,meringue:2e9},val:5000,qty:1, unlockLvl:105, space:6, prepTime:60, xp:12000 },
  { id:'pralineroyal',e:'\u{1F451}', req:{farine:3e10,oeuf:2e10,praline:12,chocolat:2.5e10,creme:2e10,noisette:1.5e10},val:8000,qty:1, unlockLvl:125, space:7, prepTime:75, xp:19000 },
  { id:'meringuee', e:'\u2601\uFE0F', req:{oeuf:2e11,sucre:2e11,meringue:3e11,creme:1.5e11,vanille:1e11,fraise:1.5e11},val:12000,qty:1, unlockLvl:145, space:7, prepTime:85, xp:29000 },
  { id:'tiramigrand',e:'\u{1F370}', req:{oeuf:1.5e12,mascarpone:15,cafe:1e12,cacao:8e11,sucre:1e12,rhum:5e11},val:18000,qty:1, unlockLvl:165, space:8, prepTime:100, xp:43000 },
  { id:'cardamomecake',e:'\u{1F33F}', req:{farine:1e13,oeuf:8e12,cardamome:10,miel:6e12,creme:8e12,rose:4e12,safran:4e12},val:28000,qty:1, unlockLvl:185, space:8, prepTime:110, xp:63000 },
  { id:'anisstar',  e:'\u2B50',    req:{farine:8e13,oeuf:5e13,anis:15,sucre:6e13,beurre:5e13,miel:4e13,vanille:3e13},val:40000,qty:1, unlockLvl:200, space:9, prepTime:120, xp:96000 },
  // Tier 8 (Niv 250-500) - common: trillions to quadrillions, rare: tens to hundreds
  { id:'volcancake',e:'\u{1F30B}', req:{farine:5e12,oeuf:3e12,chocolat:4e12,piment:20,creme:3e12,caramel:2e12},val:100000,qty:1, unlockLvl:260, space:10, prepTime:150, xp:240000 },
  { id:'cloudcake', e:'\u2601\uFE0F', req:{farine:3e13,oeuf:2e13,meringue:4e13,vanille:1.5e13,creme:2.5e13,lavande:1.5e13},val:200000,qty:1, unlockLvl:310, space:11, prepTime:180, xp:480000 },
  { id:'wasabisurp',e:'\u{1F7E2}', req:{farine:2e14,oeuf:1.5e14,wasabi:50,gingembre:1e14,yuzu:1e14,miel:1e14},val:400000,qty:1, unlockLvl:360, space:12, prepTime:220, xp:960000 },
  { id:'ambrosiacake',e:'\u{1FA77}', req:{farine:1.5e15,oeuf:1e15,ambrosie:80,miel:8e14,creme:1e15,orfeuille:5e14,rose:5e14},val:1000000,qty:1, unlockLvl:420, space:15, prepTime:300, xp:2400000 },
  { id:'nectarcake',e:'\u{1F31F}', req:{farine:1e16,oeuf:8e15,nectar:150,safran:5e15,truffe:5e15,vanille:3e15,orfeuille:5e15},val:3000000,qty:1, unlockLvl:500, space:18, prepTime:360, xp:7200000 },
  // Tier 9 (Niv 600-1000) - common ingredients: hundreds of quintillions, rare ingredients: hundreds to thousands
  { id:'rainbowcake',e:'\u{1F308}', req:{farine:5e18,oeuf:3e18,poudreetoile:200,creme:4e18,sucre:3e18,fraise:2e18,mangue:1.5e18,matcha:1.5e18},val:10000000,qty:1, unlockLvl:620, space:20, prepTime:480, xp:24000000 },
  { id:'temporalcake',e:'\u231B', req:{farine:3e19,oeuf:2e19,essencetps:500,vanille:1.5e19,creme:2.5e19,miel:1.8e19,safran:1e19},val:40000000,qty:1, unlockLvl:720, space:25, prepTime:600, xp:96000000 },
  { id:'celestecake',e:'\u{1F48E}', req:{farine:2e20,oeuf:1.5e20,cristalceleste:800,meringue:1e20,creme:1.8e20,orfeuille:8e19,rose:8e19},val:200000000,qty:1, unlockLvl:820, space:30, prepTime:780, xp:480000000 },
  { id:'cosmocake',e:'\u{1FA90}', req:{farine:8e20,oeuf:5e20,flamcosm:1500,poudreetoile:500,cristalceleste:1200,essencetps:800,orfeuille:5e20},val:1000000000,qty:1, unlockLvl:920, space:40, prepTime:1000, xp:2400000000 },
  { id:'infinicake',e:'\u267E\uFE0F', req:{farine:5e20,oeuf:3e20,infinipur:5000,flamcosm:3000,cristalceleste:3000,essencetps:2000,nectar:2000,ambrosie:2000,orfeuille:3e20,poudreetoile:1000},val:50000000000,qty:1, unlockLvl:1000, space:50, prepTime:1800, xp:100000000000 },
];

// ============ UPGRADES (removed in v1.4) ============
var UPG = [];

// ============ BUILDINGS ============
var BUILDINGS = [
  { id:'moulin',       e:'\u{1F33E}', produces:'farine',   baseRate:2,   baseCost:300,      unlockLvl:3 },
  { id:'ferme',        e:'\u{1F413}', produces:'oeuf',     baseRate:2,   baseCost:350,      unlockLvl:3 },
  { id:'sucrerie',     e:'\u{1F36C}', produces:'sucre',    baseRate:2,   baseCost:400,      unlockLvl:5 },
  { id:'beurrerie',    e:'\u{1F9C8}', produces:'beurre',   baseRate:2,   baseCost:500,      unlockLvl:7 },
  { id:'laiterie',     e:'\u{1F42E}', produces:'lait',     baseRate:2,   baseCost:600,      unlockLvl:8 },
  { id:'cacaotiere',   e:'\u{1FAD8}', produces:'cacao',    baseRate:2,   baseCost:800,      unlockLvl:10 },
  { id:'serrefraise',  e:'\u{1F353}', produces:'fraise',   baseRate:2,   baseCost:900,      unlockLvl:12 },
  { id:'chocolaterie', e:'\u{1F36B}', produces:'chocolat', baseRate:2,   baseCost:1200,     unlockLvl:15 },
  { id:'vanillerie',   e:'\u{1F33C}', produces:'vanille',  baseRate:2,   baseCost:1500,     unlockLvl:18 },
  { id:'cremerie',     e:'\u{1F376}', produces:'creme',    baseRate:2,   baseCost:1800,     unlockLvl:20 },
  { id:'verger',       e:'\u{1F95C}', produces:'amande',   baseRate:2,   baseCost:2500,     unlockLvl:25 },
  { id:'rucher',       e:'\u{1F36F}', produces:'miel',     baseRate:2,   baseCost:3000,     unlockLvl:28 },
  { id:'citronnier',   e:'\u{1F34B}', produces:'citron',   baseRate:2,   baseCost:3500,     unlockLvl:30 },
  { id:'pommier',      e:'\u{1F34E}', produces:'pomme',    baseRate:2,   baseCost:4000,     unlockLvl:32 },
  { id:'fourind',      e:'\u{1F3ED}', produces:'farine',   baseRate:10,  baseCost:10000,    unlockLvl:35 },
  { id:'fourpat',      e:'\u{1F9C1}', produces:'oeuf',     baseRate:10,  baseCost:12000,    unlockLvl:38 },
  { id:'usinegat',     e:'\u{1F3ED}', produces:'sucre',    baseRate:10,  baseCost:15000,    unlockLvl:40 },
  { id:'megafour',     e:'\u{1F525}', produces:'beurre',   baseRate:10,  baseCost:20000,    unlockLvl:45 },
  { id:'labochoc',     e:'\u{1F52C}', produces:'chocolat', baseRate:8,   baseCost:30000,    unlockLvl:50 },
  { id:'plantasafran', e:'\u{1F33A}', produces:'safran',   baseRate:3,   baseCost:50000,    unlockLvl:55 },
  { id:'truffiere',    e:'\u{1F344}', produces:'truffe',   baseRate:2,   baseCost:80000,    unlockLvl:60 },
  { id:'alchimie',     e:'\u2728',    produces:'orfeuille',baseRate:1,   baseCost:200000,   unlockLvl:70 },
  { id:'megausine',    e:'\u{1F3ED}', produces:'farine',   baseRate:50,  baseCost:500000,   unlockLvl:100 },
  { id:'complexe',     e:'\u{1F3D7}\uFE0F', produces:'creme', baseRate:30, baseCost:800000, unlockLvl:120 },
  { id:'paradis',      e:'\u{1F3DD}\uFE0F', produces:'vanille',baseRate:20, baseCost:1500000, unlockLvl:150 },
  { id:'quantumoven',  e:'\u{1FA90}', produces:'chocolat', baseRate:100, baseCost:5000000,  unlockLvl:200 },
  { id:'tempsfour',    e:'\u231B',    produces:'truffe',   baseRate:20,  baseCost:20000000, unlockLvl:300 },
  { id:'celestefarm',  e:'\u{1F48E}', produces:'orfeuille',baseRate:10, baseCost:100000000, unlockLvl:500 },
  { id:'infinibaker',  e:'\u267E\uFE0F', produces:'sucre', baseRate:1000,baseCost:1000000000,unlockLvl:800 },
];

// ============ EMPLOYEE TYPES ============
var EMP_TYPES = [
  { id:'collector', baseSalary:2,  baseProd:3,  unlockLvl:5,  hireCost:200 },
  { id:'baker',     baseSalary:5,  baseProd:1,  unlockLvl:10, hireCost:500 },
  { id:'seller',    baseSalary:4,  baseProd:1,  unlockLvl:15, hireCost:400 },
  { id:'manager',   baseSalary:8,  baseProd:0,  unlockLvl:25, hireCost:1000 },
  { id:'chef',      baseSalary:15, baseProd:2,  unlockLvl:40, hireCost:3000 },
];

// Employee names by language
var EMP_NAMES_LANG = {
  fr: ['Pierre','Marie','Jean','Sophie','Louis','Claire','Thomas','Julie','Hugo','Emma','Lucas','Lea','Nathan','Manon','Paul','Camille','Arthur','Alice','Gabriel','Jade'],
  en: ['James','Emily','John','Sarah','William','Emma','Robert','Olivia','Michael','Sophia','David','Isabella','Chris','Mia','Daniel','Charlotte','Matt','Amelia','Andrew','Grace'],
  es: ['Carlos','Maria','Juan','Ana','Pedro','Sofia','Miguel','Lucia','Pablo','Valentina','Diego','Camila','Andres','Isabella','Luis','Valeria','Jorge','Daniela','Alejandro','Mariana'],
  de: ['Hans','Greta','Klaus','Anna','Fritz','Lena','Markus','Sophie','Thomas','Marie','Stefan','Laura','Andreas','Lisa','Matthias','Julia','Jan','Sabine','Christian','Monika'],
  pt: ['Pedro','Ana','Joao','Maria','Carlos','Sofia','Paulo','Lucia','Rafael','Isabela','Lucas','Julia','Bruno','Beatriz','Tiago','Camila','Andre','Carolina','Gabriel','Lara'],
  zh: ['Wei','Fang','Jun','Mei','Hao','Xiu','Lei','Yan','Feng','Ling','Jian','Hui','Tao','Lan','Bo','Ying','Cheng','Li','Ming','Qing'],
  ja: ['Yuki','Sakura','Kenji','Aiko','Hiroshi','Yui','Takeshi','Hana','Ryota','Rin','Daiki','Mio','Shota','Akari','Haruto','Sora','Yuto','Koharu','Riku','Mei'],
  ko: ['Minho','Jisoo','Junwoo','Yuna','Seokhoon','Minji','Hyunjin','Soyeon','Doyoon','Hayoon','Jihoon','Eunbi','Seojin','Chaewon','Woobin','Subin','Taehyun','Dahyun','Jaehyun','Yerin'],
  ar: ['Ahmed','Fatima','Omar','Amira','Hassan','Mariam','Ali','Nour','Mohamed','Yasmin','Youssef','Salma','Ibrahim','Layla','Khaled','Hana','Samir','Dina','Tariq','Sara'],
  hi: ['Ravi','Priya','Arjun','Ananya','Vikram','Diya','Rohan','Meera','Aditya','Neha','Karan','Sita','Ishaan','Pooja','Dev','Rani','Aman','Kavita','Raj','Lakshmi'],
};

// Random bakery names by language
var BAKERY_NAMES_LANG = {
  fr: ['Chez Gateau','Le Petit Four','La Gourmandise','Delices Sucres','Au Bon Pain','La Mie Doree','Le Croissant Magique','Pain & Chocolat','La Tarte Enchantee','Beurre & Sucre'],
  en: ['Sweet Dreams Bakery','The Golden Oven','Sugar & Spice','Flour Power','The Cake Shop','Crumb & Crust','Buttercream Bliss','The Rolling Pin','Happy Bakes','Dough & Co'],
  es: ['Dulces Suenos','El Horno Dorado','Azucar y Canela','Pan y Mantequilla','La Pasteleria Feliz'],
  de: ['Zuckerbacker','Das Goldene Brot','Mehl und Zucker','Backstube Rosa','Tortenparadies'],
  pt: ['Doce Sonho','O Forno Dourado','Acucar e Canela','Padaria Feliz','Bolo Encantado'],
  zh: ['\u7CD5\u70B9\u5C4B','\u91D1\u8272\u70D8\u7119','\u751C\u871C\u68A6','\u5E78\u798F\u86CB\u7CD5','\u7F8E\u5473\u5C0F\u5C4B'],
  ja: ['\u304A\u83D3\u5B50\u306E\u5BB6','\u7518\u3044\u5922','\u5E78\u305B\u306E\u30B1\u30FC\u30AD','\u91D1\u306E\u30AA\u30FC\u30D6\u30F3','\u82B1\u306E\u83D3\u5B50'],
  ko: ['\uB2EC\uCF64\uD55C \uAFC8','\uD669\uAE08 \uC624\uBE10','\uD589\uBCF5\uD55C \uCF00\uC774\uD06C','\uC124\uD0D5\uACFC \uBC84\uD130','\uAF43 \uBE75'],
  ar: ['\u0627\u0644\u062D\u0644\u0645 \u0627\u0644\u062D\u0644\u0648','\u0627\u0644\u0641\u0631\u0646 \u0627\u0644\u0630\u0647\u0628\u064A','\u0633\u0643\u0631 \u0648\u0642\u0631\u0641\u0629'],
  hi: ['\u092E\u0940\u0920\u0940 \u0926\u0941\u0915\u093E\u0928','\u0938\u0941\u0928\u0939\u0930\u093E \u0938\u092A\u0928\u093E','\u0916\u0941\u0936\u0940 \u0915\u0947\u0915'],
};

// ============ SPACE UPGRADES ============
var SPACE_UPG = [
  { add:5,   cost:100,     lvlReq:1 },
  { add:5,   cost:250,     lvlReq:3 },
  { add:10,  cost:600,     lvlReq:6 },
  { add:10,  cost:1500,    lvlReq:10 },
  { add:15,  cost:3500,    lvlReq:15 },
  { add:15,  cost:8000,    lvlReq:20 },
  { add:20,  cost:15000,   lvlReq:25 },
  { add:20,  cost:30000,   lvlReq:30 },
  { add:25,  cost:60000,   lvlReq:35 },
  { add:30,  cost:120000,  lvlReq:40 },
  { add:40,  cost:250000,  lvlReq:50 },
  { add:50,  cost:500000,  lvlReq:60 },
  { add:75,  cost:1500000, lvlReq:80 },
  { add:100, cost:5000000, lvlReq:100 },
  { add:150, cost:20000000,lvlReq:150 },
  { add:200, cost:100000000,lvlReq:200 },
  { add:300, cost:1000000000,lvlReq:300 },
  { add:500, cost:10000000000,lvlReq:500 },
  { add:1000,cost:500000000000,lvlReq:800 },
];

// ============ REBIRTH SYSTEM ============
var REBIRTHS = [
  { id:1, name:'Boulangerie',             minLvl:40,   cost:5000,         bonus:0.15, spaceMulti:1.1 },
  { id:2, name:'Patisserie Fine',         minLvl:80,   cost:50000,        bonus:0.25, spaceMulti:1.25 },
  { id:3, name:'Maison de Luxe',          minLvl:120,  cost:500000,       bonus:0.40, spaceMulti:1.5 },
  { id:4, name:'Palace Gastronomique',    minLvl:200,  cost:5000000,      bonus:0.60, spaceMulti:2.0 },
  { id:5, name:'Empire de la Patisserie', minLvl:300,  cost:50000000,     bonus:0.80, spaceMulti:3.0 },
  { id:6, name:'Dynastie Sucree',         minLvl:500,  cost:500000000,    bonus:1.00, spaceMulti:5.0 },
  { id:7, name:'Legende Eternelle',       minLvl:1000, cost:10000000000,  bonus:2.00, spaceMulti:10.0 },
];

// ============ ACHIEVEMENTS ============
var ACHIEVEMENTS = [
  { id:'first_click',  icon:'\u{1F446}', check: function(g){return g.stats.totalClicks>=1;} },
  { id:'click100',     icon:'\u{1F5B1}\uFE0F', check: function(g){return g.stats.totalClicks>=100;} },
  { id:'click1000',    icon:'\u{1F92F}', check: function(g){return g.stats.totalClicks>=1000;} },
  { id:'click10000',   icon:'\u{1F3C6}', check: function(g){return g.stats.totalClicks>=10000;} },
  { id:'click100k',    icon:'\u{1F4A5}', check: function(g){return g.stats.totalClicks>=100000;} },
  { id:'first_cake',   icon:'\u{1F36A}', check: function(g){return g.stats.totalCakesMade>=1;} },
  { id:'cake10',       icon:'\u{1F9C1}', check: function(g){return g.stats.totalCakesMade>=10;} },
  { id:'cake50',       icon:'\u{1F382}', check: function(g){return g.stats.totalCakesMade>=50;} },
  { id:'cake200',      icon:'\u{1F468}\u200D\u{1F373}', check: function(g){return g.stats.totalCakesMade>=200;} },
  { id:'cake1000',     icon:'\u2B50',    check: function(g){return g.stats.totalCakesMade>=1000;} },
  { id:'cake10000',    icon:'\u{1F31F}', check: function(g){return g.stats.totalCakesMade>=10000;} },
  { id:'first_sell',   icon:'\u{1F4B6}', check: function(g){return g.stats.totalSold>=1;} },
  { id:'sell50',       icon:'\u{1F3EA}', check: function(g){return g.stats.totalSold>=50;} },
  { id:'sell500',      icon:'\u{1F3EC}', check: function(g){return g.stats.totalSold>=500;} },
  { id:'sell5000',     icon:'\u{1F3E2}', check: function(g){return g.stats.totalSold>=5000;} },
  { id:'earn100',      icon:'\u{1F4B0}', check: function(g){return g.totalEarned>=100;} },
  { id:'earn1000',     icon:'\u{1F4B5}', check: function(g){return g.totalEarned>=1000;} },
  { id:'earn10k',      icon:'\u{1F911}', check: function(g){return g.totalEarned>=10000;} },
  { id:'earn100k',     icon:'\u{1F3F0}', check: function(g){return g.totalEarned>=100000;} },
  { id:'earn1m',       icon:'\u{1F48E}', check: function(g){return g.totalEarned>=1000000;} },
  { id:'earn1b',       icon:'\u{1F30D}', check: function(g){return g.totalEarned>=1000000000;} },
  { id:'lvl5',         icon:'5\uFE0F\u20E3', check: function(g){return g.level>=5;} },
  { id:'lvl10',        icon:'\u{1F51F}', check: function(g){return g.level>=10;} },
  { id:'lvl25',        icon:'\u{1F3AF}', check: function(g){return g.level>=25;} },
  { id:'lvl50',        icon:'\u{1F31F}', check: function(g){return g.level>=50;} },
  { id:'lvl100',       icon:'\u{1F4AF}', check: function(g){return g.level>=100;} },
  { id:'lvl500',       icon:'\u{1F525}', check: function(g){return g.level>=500;} },
  { id:'lvl1000',      icon:'\u267E\uFE0F', check: function(g){return g.level>=1000;} },
  { id:'space20',      icon:'\u{1F4D0}', check: function(g){return g.maxSpace>=20;} },
  { id:'space50',      icon:'\u{1F3D7}\uFE0F', check: function(g){return g.maxSpace>=50;} },
  { id:'space100',     icon:'\u{1F3E2}', check: function(g){return g.maxSpace>=100;} },
  { id:'space500',     icon:'\u{1F306}', check: function(g){return g.maxSpace>=500;} },
  { id:'rebirth1',     icon:'\u2B50',    check: function(g){return g.rebirth>=1;} },
  { id:'rebirth3',     icon:'\u{1F31F}', check: function(g){return g.rebirth>=3;} },
  { id:'rebirth5',     icon:'\u{1F4AB}', check: function(g){return g.rebirth>=5;} },
  { id:'rebirth7',     icon:'\u{1F300}', check: function(g){return g.rebirth>=7;} },
  { id:'emp1',         icon:'\u{1F9D1}\u200D\u{1F373}', check: function(g){return g.employees.length>=1;} },
  { id:'emp5',         icon:'\u{1F465}', check: function(g){return g.employees.length>=5;} },
  { id:'emp20',        icon:'\u{1F3E2}', check: function(g){return g.employees.length>=20;} },
  { id:'bld1',         icon:'\u{1F3ED}', check: function(g){var t=0;BUILDINGS.forEach(function(b){t+=(g.buildings[b.id]||{qty:0}).qty;});return t>=1;} },
  { id:'bld10',        icon:'\u{1F3D7}\uFE0F', check: function(g){var t=0;BUILDINGS.forEach(function(b){t+=(g.buildings[b.id]||{qty:0}).qty;});return t>=10;} },
  { id:'golden',       icon:'\u2728',    check: function(g){return (g.stats.cakesMadeById.goldengate||0)>=1;} },
  { id:'infinimade',   icon:'\u267E\uFE0F', check: function(g){return (g.stats.cakesMadeById.infinicake||0)>=1;} },
];

// ============ CRYPTO SYSTEM (removed in v1.4) ============
var CRYPTO_COINS = [];

// ============ EVENT TYPES ============
var EVENT_TYPES = [
  { id:'price_surge',  duration:60, chance:0.12 },
  { id:'price_drop',   duration:60, chance:0.12 },
  { id:'inflation',    duration:90, chance:0.08 },
  { id:'deflation',    duration:90, chance:0.08 },
  { id:'rush_hour',    duration:45, chance:0.10 },
  { id:'ingredient_sale', duration:60, chance:0.08 },
  { id:'tax_break',    duration:60, chance:0.06 },
  { id:'strike_wave',  duration:30, chance:0.04 },
  { id:'lucky_day',    duration:30, chance:0.04 },
  { id:'inspection',   duration:30, chance:0.04 },
  // New events Beta 1.2
  { id:'customer_wave', duration:60, chance:0.06 },
  { id:'power_outage',  duration:45, chance:0.03 },
  { id:'sugar_rush',    duration:40, chance:0.05 },
  { id:'food_critic',   duration:50, chance:0.04 },
  { id:'supplier_strike',duration:60,chance:0.04 },
  { id:'festival',      duration:90, chance:0.03 },
  { id:'bad_review',    duration:50, chance:0.05 },
  { id:'health_check',  duration:20, chance:0.03 },
  { id:'tv_feature',    duration:45, chance:0.02 },
  { id:'apprentice_day',duration:60, chance:0.04 },
];

// ============ XP TABLE ============
function xpForLevel(lvl) {
  return Math.floor(50 * Math.pow(1.25, lvl - 1));
}

// ============ CONFIGS ============
var INFLATION = {
  sellDecay: 0.002,
  otherBoost: 0.001,
  minMult: 0.30,
  maxMult: 3.00,
};

var ANTI_CLICK = {
  maxClicksPerSec: 15,
  cooldownMs: 3000,
  captchaAfter: 3,
};

var RENT_CONFIG = {
  basePricePerM2PerHour: 0.5,
  debtInterestPerSec: 0.001,
};

var BULK_OPTIONS = [1, 5, 10, 25, 100];

// ============ CONSOLE COMMANDS LIST ============
var CONSOLE_COMMANDS = [
  '/help', '/level', '/money', '/max', '/unmax', '/undo',
  '/building', '/employee', '/stats', '/xp',
  '/space', '/rebirth', '/debt', '/theme',
  '/buy', '/sell', '/random', '/time', '/patisserie',
  '/gameover', '/reset', '/oeufs', '/birthday'
];

// ============ LIQUID INGREDIENTS ============
var LIQUID_ING = ['lait', 'creme', 'rhum'];

function fmtLiquid(amount) {
  if (amount < 100) return amount + ' ml';
  if (amount < 1000) return (amount / 100).toFixed(1) + ' cl';
  return (amount / 1000).toFixed(2) + ' L';
}

function parseLiquidAmount(parts) {
  // parts = ['53', 'ml'] or ['86', 'cl'] or ['2', 'l']
  var n = parseFloat(parts[0]);
  if (isNaN(n)) return NaN;
  var unit = (parts[1] || 'ml').toLowerCase();
  if (unit === 'ml') return n;
  if (unit === 'cl') return n * 100;
  if (unit === 'l') return n * 1000;
  return n; // default = units
}

// ============ INVISIBLE EVENTS ============
var INVISIBLE_EVENTS = [
  { id:'egg_break',    ing:'oeuf',     loss:[1,3], msg:'inv.egg_break' },
  { id:'milk_spill',   ing:'lait',     loss:[1,2], msg:'inv.milk_spill' },
  { id:'choco_expire', ing:'chocolat', loss:[1,2], msg:'inv.choco_expire' },
  { id:'flour_blown',  ing:'farine',   loss:[1,2], msg:'inv.flour_blown' },
  { id:'sugar_ants',   ing:'sucre',    loss:[1,3], msg:'inv.sugar_ants' },
  { id:'butter_melt',  ing:'beurre',   loss:[1,2], msg:'inv.butter_melt' },
  { id:'cream_sour',   ing:'creme',    loss:[1,2], msg:'inv.cream_sour' },
];

// ============ THEME LEVELS ============
var THEME_LEVELS = {
  light: 0, dark: 0,
  nature_fleur: 0, nature_automne: 0, nature_neige: 0,
  plage: 0,
  espace: 50,
  anniversaire: 0
};

// Theme names for display (key = body class)
// seasonal: {month,day} = only available on that date
// requiresNature: true = needs all 3 nature themes unlocked
// birthday: true = only on player's birthday
var THEME_LIST = [
  { id: 'light',           langKey: 'settings.themeLight' },
  { id: 'dark',            langKey: 'settings.themeDark' },
  { id: 'nature_fleur',    langKey: 'settings.themeNatureFleur',    seasonal: {month:3, day:21} },
  { id: 'nature_automne',  langKey: 'settings.themeNatureAutomne',  seasonal: {month:9, day:21} },
  { id: 'nature_neige',    langKey: 'settings.themeNatureNeige',    seasonal: {month:12, day:21} },
  { id: 'plage',           langKey: 'settings.themePlage',          seasonal: {month:6, day:21}, requiresNature: true },
  { id: 'espace',          langKey: 'settings.themeEspace',         seasonal: {month:1, day:9} },
  { id: 'anniversaire',    langKey: 'settings.themeAnniversaire',   birthday: true },
];

// ============ MUSIC TRACKS (Web Audio API) ============
// Each theme has 5 tracks: 1 default + 4 unlockable with theme
var MUSIC_TRACKS = [
  // Default (always available)
  { id:'default',       name:'Douce Melodie',       unlockLvl:0,    notes:[261.63,293.66,329.63,349.23,392.00,440.00,493.88], tempo:0.5,  type:'major' },
  { id:'default_waltz', name:'Valse Sucrée',        unlockLvl:0,    notes:[261.63,329.63,392.00,329.63,261.63,196.00,261.63], tempo:0.45, type:'waltz' },
  { id:'default_joy',   name:'Joie Patissiere',     unlockLvl:0,    notes:[261.63,293.66,329.63,392.00,329.63,293.66,261.63], tempo:0.55, type:'happy' },
  { id:'default_calm',  name:'Douceur du Soir',     unlockLvl:0,    notes:[220.00,261.63,293.66,261.63,220.00,196.00], tempo:0.35, type:'lullaby' },
  { id:'default_bake',  name:'Rythme du Four',      unlockLvl:0,    notes:[261.63,329.63,392.00,440.00,392.00,329.63], tempo:0.5,  type:'rhythmic' },
  // Nature (lvl 50)
  { id:'nature',        name:'Brise Forestiere',     unlockLvl:50,   notes:[261.63,293.66,329.63,392.00,440.00], tempo:0.4,  type:'pentatonic' },
  { id:'nature_rain',   name:'Pluie Legere',         unlockLvl:50,   notes:[329.63,349.23,329.63,293.66,261.63], tempo:0.3,  type:'ambient' },
  { id:'nature_wind',   name:'Vent des Prairies',    unlockLvl:50,   notes:[261.63,329.63,440.00,329.63,261.63], tempo:0.35, type:'wind' },
  { id:'nature_bird',   name:'Chant d\'Oiseaux',     unlockLvl:50,   notes:[523.25,587.33,659.25,587.33,523.25,440.00], tempo:0.45, type:'chirp' },
  { id:'nature_stream', name:'Ruisseau Tranquille',   unlockLvl:50,   notes:[261.63,293.66,329.63,293.66,261.63,220.00], tempo:0.3,  type:'flowing' },
  // Plage (seasonal)
  { id:'plage',         name:'Vagues Douces',        unlockLvl:0,    notes:[329.63,392.00,440.00,392.00,329.63], tempo:0.4,  type:'wave' },
  { id:'plage_surf',    name:'Surf et Sable',        unlockLvl:0,    notes:[261.63,329.63,392.00,440.00,523.25], tempo:0.5,  type:'surf' },
  // Espace (lvl 50, seasonal)
  { id:'espace',        name:'Nuit Cosmique',        unlockLvl:50,   notes:[220.00,277.18,329.63,440.00,554.37], tempo:0.3,  type:'cosmic' },
  { id:'espace_nebula', name:'Nebuleuse Sucree',     unlockLvl:50,   notes:[196.00,233.08,261.63,329.63,392.00], tempo:0.28, type:'nebula' },
  // Anniversaire
  { id:'anniv',         name:'Joyeux Anniversaire',  unlockLvl:0,    notes:[261.63,261.63,293.66,261.63,349.23,329.63], tempo:0.45, type:'birthday' },
  { id:'anniv_fete',    name:'Fete Patissiere',      unlockLvl:0,    notes:[329.63,392.00,440.00,523.25,587.33,659.25], tempo:0.6, type:'party' },
];
