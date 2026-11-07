/* ============================================
   PATISSERIE 2D SIMULATOR - GAME DATA
   Monnaies, ingredients, recettes, batiments,
   employes, espace, rebirths, evenements, themes
   ============================================ */

var GAME_VERSION = 'B\u00eata 1.3';

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
  { id:'farine', e:'\u{1F33E}', unlockLvl:1, cost:0.8, resellRate:0.5 },
  { id:'oeuf', e:'\u{1F95A}', unlockLvl:1, cost:0.3, resellRate:0.5 },
  { id:'sucre', e:'\u{1F36C}', unlockLvl:1, cost:0.9, resellRate:0.5 },
  { id:'beurre', e:'\u{1F9C8}', unlockLvl:2, cost:1.5, resellRate:0.5 },
  { id:'lait', e:'\u{1F95B}', unlockLvl:3, cost:1.1, resellRate:0.5 },
  { id:'cacao', e:'\u{1FAD8}', unlockLvl:5, cost:2.5, resellRate:0.5 },
  { id:'fraise', e:'\u{1F353}', unlockLvl:6, cost:3, resellRate:0.5 },
  { id:'chocolat', e:'\u{1F36B}', unlockLvl:8, cost:4.5, resellRate:0.5, craftable:true, craftReq:{sucre:2,cacao:3}, craftQty:3, craftTime:3 },
  { id:'creme', e:'\u{1F376}', unlockLvl:8, cost:3.5, resellRate:0.5, craftable:true, craftReq:{lait:3,sucre:1}, craftQty:2, craftTime:2 },
  { id:'vanille', e:'\u{1F33C}', unlockLvl:10, cost:6, resellRate:0.5 },
  { id:'cafe', e:'\u2615', unlockLvl:11, cost:10, resellRate:0.5 },
  { id:'amande', e:'\u{1F95C}', unlockLvl:15, cost:5, resellRate:0.5 },
  { id:'citron', e:'\u{1F34B}', unlockLvl:16, cost:1.5, resellRate:0.5 },
  { id:'miel', e:'\u{1F36F}', unlockLvl:18, cost:7, resellRate:0.5 },
  { id:'pomme', e:'\u{1F34E}', unlockLvl:21, cost:2, resellRate:0.5 },
  { id:'cannelle', e:'\u{1F7E4}', unlockLvl:21, cost:8, resellRate:0.5 },
  { id:'pistache', e:'\u{1F7E2}', unlockLvl:30, cost:12, resellRate:0.5 },
  { id:'caramel', e:'\u{1F7E0}', unlockLvl:33, cost:5, resellRate:0.5, craftable:true, craftReq:{sucre:4,beurre:2,creme:1}, craftQty:3, craftTime:4 },
  { id:'framb', e:'\u{1FAD0}', unlockLvl:35, cost:4.5, resellRate:0.5 },
  { id:'noixcoco', e:'\u{1F965}', unlockLvl:38, cost:3.5, resellRate:0.5 },
  { id:'safran', e:'\u{1F33A}', unlockLvl:42, cost:30, resellRate:0.5 },
  { id:'truffe', e:'\u{1F344}', unlockLvl:48, cost:50, resellRate:0.5 },
  { id:'orfeuille', e:'\u2728', unlockLvl:55, cost:100, resellRate:0.5 },
  { id:'matcha', e:'\u{1F375}', unlockLvl:60, cost:25, resellRate:0.5 },
  { id:'mangue', e:'\u{1F96D}', unlockLvl:65, cost:4, resellRate:0.5 },
  { id:'lavande', e:'\u{1F49C}', unlockLvl:70, cost:15, resellRate:0.5 },
  { id:'noisette', e:'\u{1F330}', unlockLvl:75, cost:8, resellRate:0.5 },
  { id:'gingembre', e:'\u{1FADA}', unlockLvl:80, cost:6, resellRate:0.5 },
  { id:'rhum', e:'\u{1F943}', unlockLvl:85, cost:18, resellRate:0.5 },
  { id:'rose', e:'\u{1F339}', unlockLvl:90, cost:20, resellRate:0.5 },
  { id:'bergamote', e:'\u{1F34A}', unlockLvl:95, cost:12, resellRate:0.5 },
  { id:'yuzu', e:'\u{1F34B}', unlockLvl:100, cost:15, resellRate:0.5 },
  { id:'meringue', e:'\u2601\uFE0F', unlockLvl:105, cost:8, resellRate:0.5, craftable:true, craftReq:{oeuf:4,sucre:5}, craftQty:1, craftTime:6 },
  { id:'praline', e:'\u{1F36B}', unlockLvl:120, cost:20, resellRate:0.5, craftable:true, craftReq:{amande:3,sucre:3,caramel:2}, craftQty:2, craftTime:5 },
  { id:'mascarpone', e:'\u{1F9C0}', unlockLvl:160, cost:12, resellRate:0.5 },
  { id:'cardamome', e:'\u{1F33F}', unlockLvl:180, cost:25, resellRate:0.5 },
  { id:'anis', e:'\u2B50', unlockLvl:200, cost:18, resellRate:0.5 },
  { id:'piment', e:'\u{1F336}\uFE0F', unlockLvl:250, cost:5, resellRate:0.5 },
  { id:'wasabi', e:'\u{1F7E2}', unlockLvl:300, cost:35, resellRate:0.5 },
  { id:'edelfleiss', e:'\u{1F3D4}\uFE0F', unlockLvl:350, cost:80, resellRate:0.5 },
  { id:'ambrosie', e:'\u{1FA77}', unlockLvl:400, cost:200, resellRate:0.5 },
  { id:'nectar', e:'\u{1F31F}', unlockLvl:500, cost:500, resellRate:0.5 },
  { id:'poudreetoile', e:'\u{1FA90}', unlockLvl:600, cost:1000, resellRate:0.5 },
  { id:'essencetps', e:'\u231B', unlockLvl:700, cost:5000, resellRate:0.5 },
  { id:'cristalceleste', e:'\u{1F48E}', unlockLvl:800, cost:25000, resellRate:0.5 },
  { id:'flamcosm', e:'\u{1F525}', unlockLvl:900, cost:100000, resellRate:0.5 },
  { id:'infinipur', e:'\u267E\uFE0F', unlockLvl:1000, cost:1000000, resellRate:0.5 },
];

// ============ RECIPES ============
// val = prix d'une piece. Une fournee rapporte val x qty, soit environ 2 fois
// le prix de ses ingredients (verifie par tests/index.html).
var REC = [
  { id:'cookie', e:'\u{1F36A}', req:{farine:2,sucre:2,oeuf:1}, val:3, qty:6, unlockLvl:1, space:0.5, prepTime:2, xp:5 },
  { id:'cake', e:'\u{1F382}', req:{farine:3,oeuf:8,sucre:3,beurre:2}, val:22, qty:1, unlockLvl:2, space:1, prepTime:3, xp:5 },
  { id:'crepe', e:'\u{1F95E}', req:{farine:4,oeuf:11,lait:3,beurre:2}, val:3.5, qty:8, unlockLvl:3, space:0.5, prepTime:3, xp:5 },
  { id:'madel', e:'\u{1F9C1}', req:{farine:4,oeuf:10,sucre:4,beurre:2,lait:3}, val:8.6, qty:4, unlockLvl:4, space:0.5, prepTime:4, xp:6 },
  { id:'pancake', e:'\u{1F95E}', req:{farine:6,oeuf:15,lait:4,sucre:5}, val:4, qty:10, unlockLvl:5, space:0.5, prepTime:3, xp:8 },
  { id:'brownie', e:'\u{1F7EB}', req:{farine:5,oeuf:14,sucre:5,beurre:3,cacao:2}, val:46.8, qty:1, unlockLvl:6, space:1, prepTime:5, xp:9 },
  { id:'muffin', e:'\u{1F9C1}', req:{farine:6,oeuf:16,sucre:5,beurre:3,fraise:2}, val:8.9, qty:6, unlockLvl:7, space:1, prepTime:5, xp:11 },
  { id:'eclair', e:'\u{1F956}', req:{farine:7,oeuf:18,beurre:4,chocolat:1,creme:2}, val:15, qty:4, unlockLvl:8, space:1, prepTime:7, xp:12 },
  { id:'fraisier', e:'\u{1F370}', req:{farine:6,oeuf:17,sucre:6,beurre:3,lait:5,fraise:2}, val:67.5, qty:1, unlockLvl:9, space:2, prepTime:8, xp:14 },
  { id:'fondant', e:'\u{1F36E}', req:{farine:7,oeuf:19,sucre:6,beurre:4,cacao:2,chocolat:1}, val:75, qty:1, unlockLvl:10, space:1.5, prepTime:8, xp:15 },
  { id:'tiramisu', e:'\u{1F370}', req:{oeuf:25,sucre:8,creme:2,cafe:1,cacao:3}, val:83.6, qty:1, unlockLvl:11, space:1.5, prepTime:6, xp:17 },
  { id:'cheesecake', e:'\u{1F9C0}', req:{farine:10,oeuf:26,sucre:8,beurre:5,creme:2,vanille:1}, val:100, qty:1, unlockLvl:13, space:2, prepTime:10, xp:20 },
  { id:'chouquette', e:'\u{1F535}', req:{farine:13,oeuf:33,beurre:7,lait:9,sucre:11}, val:9.2, qty:12, unlockLvl:14, space:1, prepTime:6, xp:22 },
  { id:'tarte_cit', e:'\u{1F34B}', req:{farine:15,oeuf:40,sucre:13,beurre:8,citron:8}, val:130, qty:1, unlockLvl:16, space:2, prepTime:12, xp:26 },
  { id:'macaron', e:'\u{1F7E3}', req:{amande:3,sucre:15,oeuf:44,creme:4,fraise:4}, val:18, qty:8, unlockLvl:17, space:1, prepTime:10, xp:29 },
  { id:'millefeuille', e:'\u{1F4DA}', req:{farine:19,beurre:10,creme:4,vanille:2,sucre:17}, val:170, qty:1, unlockLvl:19, space:2, prepTime:15, xp:34 },
  { id:'tarte_pom', e:'\u{1F34E}', req:{farine:22,beurre:12,sucre:20,pomme:9,cannelle:2}, val:200, qty:1, unlockLvl:21, space:2, prepTime:12, xp:40 },
  { id:'parisb', e:'\u{1F950}', req:{farine:26,oeuf:69,beurre:14,creme:6,amande:4}, val:230, qty:1, unlockLvl:23, space:2.5, prepTime:15, xp:46 },
  { id:'opera', e:'\u{1F3AD}', req:{farine:25,oeuf:66,beurre:13,chocolat:4,cafe:2,creme:6}, val:260, qty:1, unlockLvl:25, space:2.5, prepTime:18, xp:52 },
  { id:'baba', e:'\u{1F369}', req:{farine:26,oeuf:70,sucre:23,beurre:14,creme:6,vanille:4}, val:280, qty:1, unlockLvl:26, space:2, prepTime:10, xp:56 },
  { id:'canele', e:'\u{1F7E4}', req:{farine:28,oeuf:74,lait:20,sucre:25,vanille:4,beurre:15}, val:48.5, qty:6, unlockLvl:27, space:1.5, prepTime:12, xp:58 },
  { id:'saintho', e:'\u{1F451}', req:{farine:31,oeuf:82,beurre:16,creme:7,sucre:27,vanille:4}, val:320, qty:1, unlockLvl:29, space:3, prepTime:20, xp:64 },
  { id:'pistamac', e:'\u{1F7E2}', req:{amande:6,pistache:3,sucre:36,oeuf:110,creme:9}, val:59.9, qty:6, unlockLvl:31, space:1.5, prepTime:12, xp:72 },
  { id:'mousse_ch', e:'\u{1FAD5}', req:{chocolat:8,oeuf:110,sucre:38,creme:10,vanille:6}, val:380, qty:1, unlockLvl:32, space:2, prepTime:8, xp:76 },
  { id:'cremet', e:'\u{1F36E}', req:{oeuf:130,sucre:42,creme:11,vanille:6,lait:35}, val:100, qty:4, unlockLvl:34, space:1.5, prepTime:10, xp:80 },
  { id:'trop', e:'\u{1F334}', req:{farine:37,oeuf:100,sucre:33,beurre:20,creme:9,vanille:5,framb:7}, val:460, qty:1, unlockLvl:36, space:3, prepTime:20, xp:92 },
  { id:'coconut', e:'\u{1F965}', req:{farine:48,oeuf:130,sucre:42,beurre:25,noixcoco:11,creme:11}, val:500, qty:1, unlockLvl:38, space:2.5, prepTime:15, xp:100 },
  { id:'caramelia', e:'\u{1F7E0}', req:{farine:52,oeuf:140,sucre:46,beurre:28,caramel:8,creme:12}, val:550, qty:1, unlockLvl:40, space:3, prepTime:18, xp:110 },
  { id:'framboisier', e:'\u{1FAD0}', req:{farine:56,oeuf:150,sucre:49,beurre:30,framb:10,creme:13}, val:590, qty:1, unlockLvl:41, space:3, prepTime:18, xp:120 },
  { id:'royale', e:'\u{1F451}', req:{farine:63,beurre:34,oeuf:170,amande:10,sucre:56,creme:14}, val:670, qty:1, unlockLvl:43, space:3.5, prepTime:22, xp:130 },
  { id:'safranc', e:'\u{1F33A}', req:{farine:61,oeuf:160,sucre:54,beurre:33,safran:2,creme:14,miel:7}, val:750, qty:1, unlockLvl:45, space:3.5, prepTime:25, xp:150 },
  { id:'montblanc', e:'\u{1F3D4}\uFE0F', req:{farine:69,oeuf:180,sucre:61,creme:16,vanille:9,amande:11,miel:8}, val:850, qty:1, unlockLvl:47, space:3.5, prepTime:22, xp:170 },
  { id:'truffecake', e:'\u{1F344}', req:{farine:90,oeuf:240,beurre:48,chocolat:16,truffe:1,creme:21}, val:950, qty:1, unlockLvl:49, space:4, prepTime:28, xp:190 },
  { id:'croquemb', e:'\u{1F5FC}', req:{farine:92,oeuf:250,beurre:49,sucre:82,creme:21,vanille:12,caramel:15}, val:1100, qty:1, unlockLvl:52, space:5, prepTime:35, xp:220 },
  { id:'piecemont', e:'\u{1F3F0}', req:{farine:97,oeuf:260,sucre:86,beurre:52,creme:22,chocolat:17,vanille:13,amande:15}, val:1400, qty:1, unlockLvl:55, space:6, prepTime:45, xp:280 },
  { id:'goldengate', e:'\u2728', req:{farine:92,oeuf:240,sucre:81,beurre:49,creme:21,chocolat:16,vanille:12,orfeuille:1,safran:2,truffe:2}, val:1600, qty:1, unlockLvl:58, space:8, prepTime:60, xp:320 },
  { id:'matchacake', e:'\u{1F375}', req:{farine:180,oeuf:490,sucre:160,matcha:6,creme:42,amande:29}, val:1900, qty:1, unlockLvl:62, space:4, prepTime:35, xp:380 },
  { id:'manguier', e:'\u{1F96D}', req:{farine:220,oeuf:590,sucre:200,mangue:44,creme:50,vanille:29}, val:2300, qty:1, unlockLvl:67, space:4, prepTime:38, xp:460 },
  { id:'lavandine', e:'\u{1F49C}', req:{farine:260,oeuf:690,lavande:14,miel:30,creme:59,vanille:35}, val:2700, qty:1, unlockLvl:72, space:4.5, prepTime:42, xp:540 },
  { id:'pralineur', e:'\u{1F330}', req:{farine:300,oeuf:810,noisette:30,chocolat:54,creme:69,caramel:49}, val:3200, qty:1, unlockLvl:77, space:4.5, prepTime:45, xp:640 },
  { id:'gingemb', e:'\u{1FADA}', req:{farine:350,oeuf:940,gingembre:47,miel:40,cannelle:35,sucre:310}, val:3700, qty:1, unlockLvl:82, space:4, prepTime:35, xp:740 },
  { id:'rhumba', e:'\u{1F943}', req:{farine:350,oeuf:930,rhum:15,sucre:310,beurre:190,vanille:46,creme:80}, val:4300, qty:1, unlockLvl:87, space:5, prepTime:48, xp:860 },
  { id:'rosecake', e:'\u{1F339}', req:{farine:460,oeuf:1200,rose:19,sucre:410,creme:110,vanille:62}, val:4900, qty:1, unlockLvl:92, space:5, prepTime:50, xp:980 },
  { id:'bergamotte', e:'\u{1F34A}', req:{farine:530,oeuf:1400,bergamote:35,citron:280,creme:120,miel:60}, val:5600, qty:1, unlockLvl:97, space:5, prepTime:55, xp:1100 },
  { id:'yuzutart', e:'\u{1F34B}', req:{farine:650,oeuf:1700,yuzu:35,sucre:580,creme:150,meringue:65}, val:6800, qty:1, unlockLvl:105, space:6, prepTime:60, xp:1400 },
  { id:'pralineroyal', e:'\u{1F451}', req:{farine:1000,oeuf:2800,praline:42,chocolat:180,creme:240,noisette:100}, val:11000, qty:1, unlockLvl:125, space:7, prepTime:75, xp:2200 },
  { id:'meringuee', e:'\u2601\uFE0F', req:{oeuf:4100,sucre:1400,meringue:160,creme:360,vanille:210,fraise:410}, val:16000, qty:1, unlockLvl:145, space:7, prepTime:85, xp:3200 },
  { id:'tiramigrand', e:'\u{1F370}', req:{oeuf:6400,mascarpone:160,cafe:190,cacao:770,sucre:2100,rhum:110}, val:25000, qty:1, unlockLvl:165, space:8, prepTime:100, xp:5000 },
  { id:'cardamomecake', e:'\u{1F33F}', req:{farine:3100,oeuf:8200,cardamome:98,miel:350,creme:700,rose:120,safran:82}, val:38000, qty:1, unlockLvl:185, space:8, prepTime:110, xp:7600 },
  { id:'anisstar', e:'\u2B50', req:{farine:4100,oeuf:11000,anis:180,sucre:3600,beurre:2200,miel:460,vanille:540}, val:50000, qty:1, unlockLvl:200, space:9, prepTime:120, xp:10000 },
  { id:'volcancake', e:'\u{1F30B}', req:{farine:12000,oeuf:31000,chocolat:2100,piment:1900,creme:2700,caramel:1900}, val:120000, qty:1, unlockLvl:260, space:10, prepTime:150, xp:24000 },
  { id:'cloudcake', e:'\u2601\uFE0F', req:{farine:22000,oeuf:59000,meringue:2200,vanille:3000,creme:5100,lavande:1200}, val:230000, qty:1, unlockLvl:310, space:11, prepTime:180, xp:46000 },
  { id:'wasabisurp', e:'\u{1F7E2}', req:{farine:39000,oeuf:100000,wasabi:890,gingembre:5200,yuzu:2100,miel:4500,edelfleiss:390}, val:480000, qty:1, unlockLvl:360, space:12, prepTime:220, xp:96000 },
  { id:'ambrosiacake', e:'\u{1FA77}', req:{farine:87000,oeuf:230000,ambrosie:350,miel:9900,creme:20000,orfeuille:690,rose:3500}, val:1.1e6, qty:1, unlockLvl:420, space:15, prepTime:300, xp:220000 },
  { id:'nectarcake', e:'\u{1F31F}', req:{farine:240000,oeuf:650000,nectar:390,safran:6500,truffe:3900,vanille:32000,orfeuille:1900}, val:3e6, qty:1, unlockLvl:500, space:18, prepTime:360, xp:600000 },
  { id:'rainbowcake', e:'\u{1F308}', req:{farine:850000,oeuf:2.3e6,poudreetoile:680,creme:190000,sucre:760000,fraise:230000,mangue:170000,matcha:27000}, val:1.2e7, qty:1, unlockLvl:620, space:20, prepTime:480, xp:2.4e6 },
  { id:'temporalcake', e:'\u231B', req:{farine:3.2e6,oeuf:8.7e6,essencetps:520,vanille:430000,creme:740000,miel:370000,safran:87000}, val:4e7, qty:1, unlockLvl:720, space:25, prepTime:600, xp:8e6 },
  { id:'celestecake', e:'\u{1F48E}', req:{farine:2e7,oeuf:5.4e7,cristalceleste:650,meringue:2e6,creme:4.6e6,orfeuille:160000,rose:810000}, val:2.5e8, qty:1, unlockLvl:820, space:30, prepTime:780, xp:5e7 },
  { id:'cosmocake', e:'\u{1FA90}', req:{farine:1.6e8,oeuf:4.3e8,flamcosm:1300,poudreetoile:130000,cristalceleste:5200,essencetps:26000,orfeuille:1.3e6}, val:2e9, qty:1, unlockLvl:920, space:40, prepTime:1000, xp:4e8 },
  { id:'infinicake', e:'\u267E\uFE0F', req:{farine:2.8e9,oeuf:7.6e9,infinipur:2300,flamcosm:23000,cristalceleste:91000,essencetps:450000,nectar:4.5e6,ambrosie:1.1e7,orfeuille:2.3e7,poudreetoile:2.3e6}, val:5e10, qty:1, unlockLvl:1000, space:50, prepTime:1800, xp:1e10 },
];

// ============ BUILDINGS ============
var BUILDINGS = [
  { id:'moulin',       e:'\u{1F33E}', produces:'farine',   baseRate:2,   baseCost:300,      unlockLvl:3 },
  { id:'ferme',        e:'\u{1F413}', produces:'oeuf',     baseRate:2,   baseCost:350,      unlockLvl:3 },
  { id:'sucrerie',     e:'\u{1F36C}', produces:'sucre',    baseRate:2,   baseCost:400,      unlockLvl:5 },
  { id:'beurrerie',    e:'\u{1F9C8}', produces:'beurre',   baseRate:2,   baseCost:500,      unlockLvl:7 },
  { id:'laiterie',     e:'\u{1F42E}', produces:'lait',     baseRate:2,   baseCost:600,      unlockLvl:8 },
  { id:'cacaotiere',   e:'\u{1FAD8}', produces:'cacao',    baseRate:2,   baseCost:800,      unlockLvl:10 },
  { id:'serrefraise',  e:'\u{1F353}', produces:'fraise',   baseRate:2,   baseCost:900,      unlockLvl:12 },
  { id:'cafeiere', e:'\u2615', produces:'cafe', baseRate:2, baseCost:3800, unlockLvl:13 },
  { id:'chocolaterie', e:'\u{1F36B}', produces:'chocolat', baseRate:2,   baseCost:1200,     unlockLvl:15 },
  { id:'vanillerie',   e:'\u{1F33C}', produces:'vanille',  baseRate:2,   baseCost:1500,     unlockLvl:18 },
  { id:'cremerie',     e:'\u{1F376}', produces:'creme',    baseRate:2,   baseCost:1800,     unlockLvl:20 },
  { id:'canneleraie', e:'\u{1F7E4}', produces:'cannelle', baseRate:2, baseCost:3000, unlockLvl:23 },
  { id:'verger',       e:'\u{1F95C}', produces:'amande',   baseRate:2,   baseCost:2500,     unlockLvl:25 },
  { id:'rucher',       e:'\u{1F36F}', produces:'miel',     baseRate:2,   baseCost:3000,     unlockLvl:28 },
  { id:'citronnier',   e:'\u{1F34B}', produces:'citron',   baseRate:2,   baseCost:3500,     unlockLvl:30 },
  { id:'pommier',      e:'\u{1F34E}', produces:'pomme',    baseRate:2,   baseCost:4000,     unlockLvl:32 },
  { id:'pistacheraie', e:'\u{1F7E2}', produces:'pistache', baseRate:2, baseCost:4500, unlockLvl:32 },
  { id:'fourind',      e:'\u{1F3ED}', produces:'farine',   baseRate:10,  baseCost:10000,    unlockLvl:35 },
  { id:'caramelerie', e:'\u{1F7E0}', produces:'caramel', baseRate:2, baseCost:1900, unlockLvl:35 },
  { id:'framboiseraie', e:'\u{1FAD0}', produces:'framb', baseRate:2, baseCost:1700, unlockLvl:37 },
  { id:'fourpat',      e:'\u{1F9C1}', produces:'oeuf',     baseRate:10,  baseCost:12000,    unlockLvl:38 },
  { id:'usinegat',     e:'\u{1F3ED}', produces:'sucre',    baseRate:10,  baseCost:15000,    unlockLvl:40 },
  { id:'cocoteraie', e:'\u{1F965}', produces:'noixcoco', baseRate:2, baseCost:1300, unlockLvl:40 },
  { id:'megafour',     e:'\u{1F525}', produces:'beurre',   baseRate:10,  baseCost:20000,    unlockLvl:45 },
  { id:'labochoc',     e:'\u{1F52C}', produces:'chocolat', baseRate:8,   baseCost:30000,    unlockLvl:50 },
  { id:'plantasafran', e:'\u{1F33A}', produces:'safran',   baseRate:3,   baseCost:50000,    unlockLvl:55 },
  { id:'truffiere',    e:'\u{1F344}', produces:'truffe',   baseRate:2,   baseCost:80000,    unlockLvl:60 },
  { id:'theier', e:'\u{1F375}', produces:'matcha', baseRate:2, baseCost:9400, unlockLvl:62 },
  { id:'manguerais', e:'\u{1F96D}', produces:'mangue', baseRate:2, baseCost:1500, unlockLvl:67 },
  { id:'alchimie',     e:'\u2728',    produces:'orfeuille',baseRate:1,   baseCost:200000,   unlockLvl:70 },
  { id:'lavanderaie', e:'\u{1F49C}', produces:'lavande', baseRate:2, baseCost:5600, unlockLvl:72 },
  { id:'noiseraie', e:'\u{1F330}', produces:'noisette', baseRate:2, baseCost:3000, unlockLvl:77 },
  { id:'gingembraie', e:'\u{1FADA}', produces:'gingembre', baseRate:2, baseCost:2200, unlockLvl:82 },
  { id:'rhumerie', e:'\u{1F943}', produces:'rhum', baseRate:2, baseCost:6800, unlockLvl:87 },
  { id:'roseraie', e:'\u{1F339}', produces:'rose', baseRate:2, baseCost:7500, unlockLvl:92 },
  { id:'bergamoteraie', e:'\u{1F34A}', produces:'bergamote', baseRate:2, baseCost:4500, unlockLvl:97 },
  { id:'megausine',    e:'\u{1F3ED}', produces:'farine',   baseRate:50,  baseCost:500000,   unlockLvl:100 },
  { id:'yuzuraie', e:'\u{1F34B}', produces:'yuzu', baseRate:2, baseCost:5600, unlockLvl:102 },
  { id:'meringuerie', e:'\u2601\uFE0F', produces:'meringue', baseRate:2, baseCost:3000, unlockLvl:107 },
  { id:'complexe',     e:'\u{1F3D7}\uFE0F', produces:'creme', baseRate:30, baseCost:800000, unlockLvl:120 },
  { id:'pralinerie', e:'\u{1F36B}', produces:'praline', baseRate:2, baseCost:7500, unlockLvl:122 },
  { id:'paradis',      e:'\u{1F3DD}\uFE0F', produces:'vanille',baseRate:20, baseCost:1500000, unlockLvl:150 },
  { id:'fromagerie', e:'\u{1F9C0}', produces:'mascarpone', baseRate:2, baseCost:4500, unlockLvl:162 },
  { id:'cardamomeraie', e:'\u{1F33F}', produces:'cardamome', baseRate:2, baseCost:9400, unlockLvl:182 },
  { id:'quantumoven',  e:'\u{1FA90}', produces:'chocolat', baseRate:100, baseCost:5000000,  unlockLvl:200 },
  { id:'badianeraie', e:'\u2B50', produces:'anis', baseRate:2, baseCost:6800, unlockLvl:202 },
  { id:'pimenteraie', e:'\u{1F336}\uFE0F', produces:'piment', baseRate:2, baseCost:1900, unlockLvl:252 },
  { id:'tempsfour',    e:'\u231B',    produces:'truffe',   baseRate:20,  baseCost:20000000, unlockLvl:300 },
  { id:'wasabiculture', e:'\u{1F7E2}', produces:'wasabi', baseRate:2, baseCost:13000, unlockLvl:302 },
  { id:'alpage', e:'\u{1F3D4}\uFE0F', produces:'edelfleiss', baseRate:2, baseCost:30000, unlockLvl:352 },
  { id:'jardinambro', e:'\u{1FA77}', produces:'ambrosie', baseRate:2, baseCost:75000, unlockLvl:402 },
  { id:'celestefarm',  e:'\u{1F48E}', produces:'orfeuille',baseRate:10, baseCost:100000000, unlockLvl:500 },
  { id:'ruchedivine', e:'\u{1F31F}', produces:'nectar', baseRate:2, baseCost:190000, unlockLvl:502 },
  { id:'capteuretoile', e:'\u{1FA90}', produces:'poudreetoile', baseRate:2, baseCost:380000, unlockLvl:602 },
  { id:'sablier', e:'\u231B', produces:'essencetps', baseRate:2, baseCost:1.9e6, unlockLvl:702 },
  { id:'infinibaker',  e:'\u267E\uFE0F', produces:'sucre', baseRate:1000,baseCost:1000000000,unlockLvl:800 },
  { id:'minecelest', e:'\u{1F48E}', produces:'cristalceleste', baseRate:2, baseCost:9.4e6, unlockLvl:802 },
  { id:'forgecosmique', e:'\u{1F525}', produces:'flamcosm', baseRate:2, baseCost:3.8e7, unlockLvl:902 },
  { id:'sourceinfinie', e:'\u267E\uFE0F', produces:'infinipur', baseRate:2, baseCost:3.8e8, unlockLvl:1002 },
];

// ============ EMPLOYEE TYPES ============
// baseSalary = euros par seconde
var EMP_TYPES = [
  { id:'collector', baseSalary:0.25, unlockLvl:5,  hireCost:200 },
  { id:'baker',     baseSalary:0.6,  unlockLvl:10, hireCost:500 },
  { id:'seller',    baseSalary:0.5,  unlockLvl:15, hireCost:400 },
  { id:'manager',   baseSalary:1,    unlockLvl:25, hireCost:1000 },
  { id:'chef',      baseSalary:2,    unlockLvl:40, hireCost:3000 },
  { id:'maitre',    baseSalary:1.5,  unlockLvl:30, hireCost:2500 },
  // Le transporteur n'a de travail qu'a partir de deux patisseries
  { id:'carrier',   baseSalary:0.8,  unlockLvl:20, hireCost:1500, needsBakeries:2 },
];

var EMP_NAMES_LANG = {
  fr: ['Pierre','Marie','Jean','Sophie','Louis','Claire','Thomas','Julie','Hugo','Emma','Lucas','L\u00e9a','Nathan','Manon','Paul','Camille','Arthur','Alice','Gabriel','Jade'],
  en: ['James','Emily','John','Sarah','William','Emma','Robert','Olivia','Michael','Sophia','David','Isabella','Chris','Mia','Daniel','Charlotte','Matt','Amelia','Andrew','Grace'],
};

var BAKERY_NAMES_LANG = {
  fr: ['Chez G\u00e2teau','Le Petit Four','La Gourmandise','D\u00e9lices Sucr\u00e9s','Au Bon Pain','La Mie Dor\u00e9e','Le Croissant Magique','Pain & Chocolat','La Tarte Enchant\u00e9e','Beurre & Sucre'],
  en: ['Sweet Dreams Bakery','The Golden Oven','Sugar & Spice','Flour Power','The Cake Shop','Crumb & Crust','Buttercream Bliss','The Rolling Pin','Happy Bakes','Dough & Co'],
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
// spaceMulti : l'espace de depart et les agrandissements sont multiplies d'autant
var REBIRTHS = [
  { id:1, name:'Boulangerie',             minLvl:40,   cost:5000,         bonus:0.15, spaceMulti:1.1 },
  { id:2, name:'Patisserie Fine',         minLvl:80,   cost:50000,        bonus:0.25, spaceMulti:1.25 },
  { id:3, name:'Maison de Luxe',          minLvl:120,  cost:500000,       bonus:0.40, spaceMulti:1.5 },
  { id:4, name:'Palace Gastronomique',    minLvl:200,  cost:5000000,      bonus:0.60, spaceMulti:2.0 },
  { id:5, name:'Empire de la Patisserie', minLvl:300,  cost:50000000,     bonus:0.80, spaceMulti:3.0 },
  { id:6, name:'Dynastie Sucree',         minLvl:500,  cost:500000000,    bonus:1.00, spaceMulti:5.0 },
  { id:7, name:'Legende Eternelle',       minLvl:1000, cost:10000000000,  bonus:2.00, spaceMulti:10.0 },
];

// ============ EVENT TYPES ============
// chance = poids du tirage
var EVENT_TYPES = [
  { id:'price_surge',  duration:60, chance:12 },
  { id:'price_drop',   duration:60, chance:10 },
  { id:'inflation',    duration:90, chance:8 },
  { id:'deflation',    duration:90, chance:8 },
  { id:'rush_hour',    duration:45, chance:10 },
  { id:'ingredient_sale', duration:60, chance:8 },
  { id:'tax_break',    duration:60, chance:6 },
  { id:'strike_wave',  duration:30, chance:3 },
  { id:'lucky_day',    duration:30, chance:5 },
  { id:'inspection',   duration:30, chance:5 },
  { id:'customer_wave', duration:60, chance:6 },
  { id:'power_outage',  duration:45, chance:4 },
  { id:'sugar_rush',    duration:40, chance:6 },
  { id:'food_critic',   duration:50, chance:5 },
  { id:'supplier_strike',duration:60,chance:4 },
  { id:'festival',      duration:90, chance:4 },
  { id:'bad_review',    duration:50, chance:5 },
  { id:'health_check',  duration:20, chance:3 },
  { id:'tv_feature',    duration:45, chance:3 },
  { id:'apprentice_day',duration:60, chance:5 },
];

// Petits incidents de la vie d'une patisserie
var INVISIBLE_EVENTS = [
  { id:'egg_break',    ing:'oeuf',     loss:[1,3] },
  { id:'milk_spill',   ing:'lait',     loss:[1,2] },
  { id:'choco_expire', ing:'chocolat', loss:[1,2] },
  { id:'flour_blown',  ing:'farine',   loss:[1,2] },
  { id:'sugar_ants',   ing:'sucre',    loss:[1,3] },
  { id:'butter_melt',  ing:'beurre',   loss:[1,2] },
  { id:'cream_sour',   ing:'creme',    loss:[1,2] },
];

// ============ XP ============
// Une fournee recente rapporte environ la moitie de son prix en XP.
// Un niveau demande quelques fournees au debut, une trentaine vers le niveau 1000.
var REVENUE_CURVE = [[1,18],[2,22],[3,28],[5,40],[8,60],[10,75],[14,110],[20,180],[25,260],[30,340],[40,550],[50,1000],[60,1800],[80,3500],[100,6000],[150,18000],[200,50000],[300,200000],[400,800000],[500,3e6],[620,1.2e7],[720,4e7],[820,2.5e8],[920,2e9],[1000,5e10]];

function revenueAt(lvl) {
  var c = REVENUE_CURVE;
  if (lvl <= c[0][0]) return c[0][1];
  for (var i = 1; i < c.length; i++) {
    if (lvl <= c[i][0]) {
      var f = (Math.log(lvl) - Math.log(c[i-1][0])) / (Math.log(c[i][0]) - Math.log(c[i-1][0]));
      return Math.exp(Math.log(c[i-1][1]) + f * (Math.log(c[i][1]) - Math.log(c[i-1][1])));
    }
  }
  // Apres le niveau 1000, ca continue doucement
  return c[c.length-1][1] * Math.pow(1.02, lvl - c[c.length-1][0]);
}

// La meilleure fournee disponible a ce niveau
var _bestRevenueCache = {};
function bestRevenueAt(lvl) {
  if (_bestRevenueCache[lvl] !== undefined) return _bestRevenueCache[lvl];
  var best = 0;
  for (var i = 0; i < REC.length; i++) {
    if (REC[i].unlockLvl <= lvl) best = Math.max(best, REC[i].val * REC[i].qty);
  }
  _bestRevenueCache[lvl] = best;
  return best;
}

function xpForLevel(lvl) {
  var batches = 3 + Math.pow(lvl, 0.5);
  return Math.floor(Math.min(revenueAt(lvl), bestRevenueAt(lvl)) * 0.5 * batches);
}

// ============ CONFIGS ============
var INFLATION = {
  sellDecay: 0.002,
  otherBoost: 0.0005,
  minMult: 0.30,
  maxMult: 1.50,
  recoveryPerSec: 0.002, // la demande revient toute seule
};

var ANTI_CLICK = {
  maxClicksPerSec: 15,
  cooldownMs: 3000,
  captchaAfter: 3,
  wrongBeforeBan: 3,
  banSeconds: 300,
};

var RENT_CONFIG = {
  basePricePerM2PerHour: 2,
  debtInterestPerSec: 0.00002,
  graceSec: 180, // le proprietaire attend 3 minutes avant de compter une dette
};

// La banque : plus le pret est gros, plus il coute cher. Un seul de chaque montant a la fois.
var LOANS = [
  { amount: 10, rate: 0.05, minutes: 2, minLvl: 1 },
  { amount: 20, rate: 0.05, minutes: 3, minLvl: 1 },
  { amount: 50, rate: 0.08, minutes: 5, minLvl: 1 },
  { amount: 100, rate: 0.10, minutes: 5, minLvl: 3 },
  { amount: 200, rate: 0.12, minutes: 8, minLvl: 5 },
  { amount: 500, rate: 0.15, minutes: 10, minLvl: 10 },
  { amount: 1000, rate: 0.18, minutes: 15, minLvl: 15 },
  { amount: 5000, rate: 0.22, minutes: 30, minLvl: 25 },
  { amount: 10000, rate: 0.25, minutes: 45, minLvl: 40 },
];

var RENAME_COST = 100;
var BUILDINGS_LVL = 40; // Les batiments s'achetent a partir de ce niveau
var BIRTHDAY_FIX_COST = 50;

// Les commandes des clients : plus c'est complique, plus la prime est grosse
var ORDER_CONFIG = {
  lvl: 30,
  everySec: 40,
  maxOpen: 4,
  // Multiplicateur du prix selon le nombre de gateaux differents demandes
  prime: { 1: 1.25, 2: 1.6, 3: 2.1, 4: 2.8 },
  butlerSec: 25, // un maitre d'hotel de niveau 1 livre une commande toutes les 25 s
};

// La boutique de machines : des ameliorations pour toujours, a prix eleve
var MACHINE_LVL = 50;
var MACHINES = [
  { id:'petrin',    e:'\u{1F3ED}', cost:100000, growth:6, max:5, step:5 },
  { id:'isolant',   e:'\u{1F3E0}', cost:150000, growth:6, max:5, step:8 },
  { id:'robot',     e:'\u26A1',    cost:200000, growth:6, max:5, step:3 },
  { id:'fourturbo', e:'\u{1F525}', cost:250000, growth:8, max:5, step:2 },
  { id:'convoyeur', e:'\u{1F3D7}\uFE0F', cost:300000, growth:7, max:5, step:10 },
  { id:'caisse',    e:'\u{1F9FE}', cost:350000, growth:7, max:5, step:15 },
  { id:'etiquette', e:'\u{1F3AF}', cost:400000, growth:7, max:5, step:10 },
  { id:'vitrine',   e:'\u{1F48E}', cost:500000, growth:8, max:5, step:5 },
  { id:'guichet',   e:'\u{1F91D}', cost:600000, growth:8, max:5, step:10 },
  { id:'academie',  e:'\u{1F3C5}', cost:800000, growth:9, max:5, step:10 },
];
var HISTORY_MAX = 240;

var OVEN_CONFIG = { start: 2, max: 30, baseCost: 200, growth: 4, maxQueue: 50 };

var BULK_OPTIONS = ['1', '10', '100', 'max'];

// Chaque succes donne ce bonus de prix de vente
var ACH_BONUS = 0.001;

// ============ LIQUID INGREDIENTS (console) ============
var LIQUID_ING = ['lait', 'creme', 'rhum'];

function fmtLiquid(amount) {
  if (amount < 10) return amount + ' ml';
  if (amount < 1000) return (amount / 10).toFixed(1) + ' cl';
  return (amount / 1000).toFixed(2) + ' L';
}

function parseLiquidAmount(rawAmount, unit) {
  var n = parseFloat(rawAmount);
  if (isNaN(n)) return NaN;
  unit = (unit || 'ml').toLowerCase();
  if (unit === 'cl') return n * 10;
  if (unit === 'l') return n * 1000;
  return n;
}

// ============ THEMES ============
// Clair et sombre : toujours. Saisons : pendant la saison, ou pour toujours avec /theme unlock.
// Anniversaire : le jour de ton anniversaire, ou pour toujours avec /theme unlock.
var THEME_LIST = [
  { id:'light',    langKey:'settings.themeLight' },
  { id:'dark',     langKey:'settings.themeDark' },
  { id:'spring',   langKey:'settings.themeSpring', season:true },
  { id:'summer',   langKey:'settings.themeSummer', season:true },
  { id:'fall',     langKey:'settings.themeFall',   season:true },
  { id:'winter',   langKey:'settings.themeWinter', season:true },
  { id:'birthday', langKey:'settings.themeBirthday', birthday:true },
  { id:'party',    langKey:'settings.themeParty', level:500 },
  { id:'space',    langKey:'settings.themeSpace', level:1000 },
];
