/* ============================================
   PATISSERIE 2D SIMULATOR - ICONES & EFFETS
   Icones du jeu (Twemoji + dessins maison),
   icones d'interface, rendu fluide, particules
   ============================================ */

// Les fichiers presents dans assets/icons (nom = code de l'emoji)
var ICON_FILES = {};
'1f1e7-1f1f7,1f1e8-1f1f3,1f1e9-1f1ea,1f1ea-1f1f8,1f1eb-1f1f7,1f1ee-1f1f3,1f1ef-1f1f5,1f1f0-1f1f7,1f1f8-1f1e6,1f1fa-1f1f8,1f300,1f306,1f308,1f30b,1f30d,1f319,1f31f,1f330,1f331,1f334,1f336,1f338,1f339,1f33a,1f33c,1f33e,1f33f,1f342,1f344,1f34a,1f34b,1f34e,1f353,1f369,1f36a,1f36b,1f36c,1f36e,1f36f,1f370,1f375,1f376,1f381,1f382,1f388,1f389,1f3ad,1f3ae,1f3af,1f3b5,1f3c5,1f3c6,1f3d4,1f3d6,1f3d7,1f3dd,1f3e0,1f3e2,1f3e6,1f3ea,1f3ec,1f3ed,1f3f0,1f413,1f42e,1f446,1f451,1f465,1f468-200d-1f373,1f47b,1f48e,1f49c,1f4a5,1f4ab,1f4ad,1f4af,1f4b0,1f4b5,1f4b6,1f4b8,1f4c8,1f4d0,1f50d,1f512,1f51f,1f525,1f52c,1f5b1,1f5fc,1f62d,1f634,1f6aa,1f911,1f91d,1f92b,1f92f,1f943,1f947,1f950,1f95a,1f95b,1f95c,1f95e,1f965,1f96d,1f9c0,1f9c1,1f9c8,1f9d1-200d-1f373,1f9d9,1f9fe,1fa77,1fa90,1fad5,1fad8,1fada,231b,23f0,2600,2601,2615,267e,26a0,26a1,2728,2744,2b50,35-20e3'
  .split(',').forEach(function(n) { ICON_FILES[n] = true; });

var CUSTOM_ICONS = {};
'brownie,canele,cannelle,caramel,caramelia,chouquette,eclair,framboise,macaron,macaron_pistache,meringue,millefeuille,pistache,praline,tarte_citron,tarte_pomme,wasabi,yuzu'
  .split(',').forEach(function(n) { CUSTOM_ICONS[n] = true; });

// Ces patisseries n'ont pas d'emoji : on utilise un dessin maison.
(function() {
  var ingIcons = { caramel:'caramel', cannelle:'cannelle', pistache:'pistache', wasabi:'wasabi', framb:'framboise', yuzu:'yuzu', praline:'praline', meringue:'meringue' };
  var recIcons = { brownie:'brownie', chouquette:'chouquette', macaron:'macaron', pistamac:'macaron_pistache', eclair:'eclair', millefeuille:'millefeuille', tarte_cit:'tarte_citron', tarte_pom:'tarte_pomme', canele:'canele', caramelia:'caramelia', meringuee:'meringue', wasabisurp:'wasabi', framboisier:'framboise', yuzutart:'yuzu', pralineroyal:'praline', cardamomecake:'caramelia' };
  ING.forEach(function(i) { if (ingIcons[i.id]) i.e = '[[' + ingIcons[i.id] + ']]'; });
  REC.forEach(function(r) { if (recIcons[r.id]) r.e = '[[' + recIcons[r.id] + ']]'; });
  // Un batiment porte l'icone de ce qu'il produit, s'il n'a pas la sienne
  BUILDINGS.forEach(function(b) { if (ingIcons[b.produces]) b.e = '[[' + ingIcons[b.produces] + ']]'; });
})();

var ICON_RE = new RegExp('\\[\\[([a-z_]+)\\]\\]|\\p{Regional_Indicator}{2}|[0-9#*]\\uFE0F?\\u20E3|(?![\\u00A9\\u00AE\\u2122])\\p{Extended_Pictographic}\\uFE0F?(?:\\u200D\\p{Extended_Pictographic}\\uFE0F?)*', 'gu');

function iconFileName(emoji) {
  var codes = [];
  var hasZwj = emoji.indexOf('‍') >= 0;
  for (var c of emoji) {
    var cp = c.codePointAt(0);
    if (cp === 0xFE0F && !hasZwj) continue;
    if (cp === 0xFE0F) continue;
    codes.push(cp.toString(16));
  }
  return codes.join('-');
}

// Remplace les emojis d'un bout de HTML par des images, sans toucher aux balises.
// Dans <option> et <textarea>, une image est impossible : on les laisse tels quels.
function iconify(html) {
  var parts = String(html).split(/(<[^>]*>)/);
  var skip = 0;
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i];
    if (!p) continue;
    if (p.charAt(0) === '<') {
      if (/^<(option|textarea|select)\b/i.test(p)) skip++;
      else if (/^<\/(option|textarea|select)>/i.test(p)) skip--;
      continue;
    }
    if (skip > 0) continue;
    parts[i] = p.replace(ICON_RE, function(m, custom) {
      if (custom) {
        return CUSTOM_ICONS[custom] ? '<img class="ico" alt="" draggable="false" src="assets/icons/custom/' + custom + '.svg">' : m;
      }
      var file = iconFileName(m);
      return ICON_FILES[file] ? '<img class="ico" alt="" draggable="false" src="assets/icons/' + file + '.svg">' : m;
    });
  }
  return parts.join('');
}

// ============ ICONES D'INTERFACE (SVG, traits de 2 px) ============
var UI_ICONS = {
  bank: '<path d="M3 10l9-6 9 6"/><path d="M4 10h16M6 10v8M10 10v8M14 10v8M18 10v8M4 18h16M3 21h18"/>',
  chart: '<path d="M4 4v16h16"/><path d="M7 15l4-5 3 3 5-7"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3.800 6 3.800 9s-.8 6-3.800 9c-3-3-3.800-6-3.800-9S9 6 12 3z"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.500 0 2-1 2-2s-.7-1.500-.7-2.500.8-1.500 2-1.500H18a3 3 0 0 0 3-3c0-5-4-9-9-9z"/><circle cx="8" cy="10" r="1.200"/><circle cx="12" cy="7.500" r="1.200"/><circle cx="16" cy="10" r="1.200"/>',
  music: '<path d="M9 18V6l11-2v12"/><circle cx="6.500" cy="18" r="2.500"/><circle cx="17.500" cy="16" r="2.500"/>',
  musicOff: '<path d="M9 18V6l11-2v12"/><circle cx="6.500" cy="18" r="2.500"/><circle cx="17.500" cy="16" r="2.500"/><path d="M3 3l18 18"/>',
  save: '<path d="M5 3h11l4 4v14H5z"/><path d="M8 3v6h7V3M8 21v-7h9v7"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  search: '<circle cx="11" cy="11" r="6.500"/><path d="M16 16l5 5"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  play: '<path d="M7 4.500v15l12-7.500z"/>',
  soundOn: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.500 8.500a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>',
  soundOff: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/>',
  settings: '<path d="M4 6h9M19 6h1M4 12h1M11 12h9M4 18h7M17 18h3"/><circle cx="16" cy="6" r="2.500"/><circle cx="8" cy="12" r="2.500"/><circle cx="14" cy="18" r="2.500"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.500-4 4.500-6 8-6s6.500 2 8 6"/>',
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  rec: '<path d="M12 6c-2-1.500-5-2-8-2v15c3 0 6 .5 8 2 2-1.500 5-2 8-2V4c-3 0-6 .5-8 2z"/><path d="M12 6v15"/>',
  sell: '<path d="M6 8h12l1 13H5z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  bld: '<path d="M3 21V10l6 4v-4l6 4V4h6v17z"/><path d="M8 17h1M13 17h1"/>',
  emp: '<circle cx="9" cy="8" r="3.500"/><path d="M2.500 20c1-3.500 3.500-5.500 6.500-5.500s5.500 2 6.500 5.500"/><path d="M16 4.800a3.500 3.500 0 0 1 0 6.400M18 14.800c1.800.8 3 2.600 3.500 5.200"/>',
  ach: '<path d="M8 4h8v6a4 4 0 0 1-8 0z"/><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 14v4M8 21h8M10 18h4v3h-4z"/>',
  stats: '<path d="M4 4v16h16"/><path d="M9 16v-5M14 16V8M19 16v-8"/>',
  clock: '<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3 2"/>',
  spark: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  area: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 4v3M14 4v3M4 9h3M4 14h3"/>',
  terminal: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 9 3 3-3 3M13 15h4"/>',
  pencil: '<path d="M4 20l1-4L16 5l3 3L8 19z"/>',
  star: '<path d="M12 3l2.800 5.800 6.200.9-4.500 4.400 1.100 6.300L12 17.400 6.400 20.400l1.100-6.300L3 9.700l6.200-.9z"/>',
  cart: '<path d="M3 4h2l2.500 11h10L20 7H6"/><circle cx="9" cy="19.500" r="1.500"/><circle cx="17" cy="19.500" r="1.500"/>',
  flame: '<path d="M12 3c1 4 5 5.500 5 11a5 5 0 0 1-10 0c0-2 1-3.500 2-4.500 0 1.500.5 2.500 1.500 3C10 9 10.500 6 12 3z"/>'
};

function uiIcon(name) {
  return '<svg class="uii" viewBox="0 0 24 24" aria-hidden="true">' + UI_ICONS[name] + '</svg>';
}

// ============ RENDU FLUIDE ============
// Met a jour une zone en ne changeant que ce qui a change. Les elements restent
// les memes : les barres glissent au lieu de sauter, et les animations ne
// redemarrent pas a chaque rafraichissement.
function setHTML(el, html) {
  html = iconify(html);
  if (el._lastHTML === html) return;
  el._lastHTML = html;
  var tpl = document.createElement('template');
  tpl.innerHTML = html;
  morphChildren(el, tpl.content);
}

function morphChildren(a, b) {
  var ac = a.firstChild;
  var bc = b.firstChild;
  while (bc) {
    var nextB = bc.nextSibling;
    if (!ac) {
      a.appendChild(bc);
    } else if (ac.nodeType === bc.nodeType && ac.nodeName === bc.nodeName) {
      morphNode(ac, bc);
      ac = ac.nextSibling;
    } else {
      var nextA = ac.nextSibling;
      a.replaceChild(bc, ac);
      ac = nextA;
    }
    bc = nextB;
  }
  while (ac) {
    var rest = ac.nextSibling;
    a.removeChild(ac);
    ac = rest;
  }
}

function morphNode(a, b) {
  if (a.nodeType !== 1) {
    if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue;
    return;
  }
  var attrs = b.attributes;
  for (var i = 0; i < attrs.length; i++) {
    if (a.getAttribute(attrs[i].name) !== attrs[i].value) a.setAttribute(attrs[i].name, attrs[i].value);
  }
  for (var j = a.attributes.length - 1; j >= 0; j--) {
    if (!b.hasAttribute(a.attributes[j].name)) a.removeAttribute(a.attributes[j].name);
  }
  if (a.nodeName === 'OPTION') a.selected = b.hasAttribute('selected');
  morphChildren(a, b);
}

// ============ EFFETS ============
function fxEnabled() {
  if (typeof G !== 'undefined' && G.settings && G.settings.reducedParticles) return false;
  return !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
}

// Petite explosion de particules a un point de l'ecran
function fxBurst(x, y, amount, colors, stars) {
  if (!fxEnabled()) return;
  colors = colors || ['#ffd60a', '#9b6dff', '#ffffff', '#ffe766', '#c4a8ff'];
  for (var k = 0; k < amount; k++) {
    var p = document.createElement('span');
    p.className = 'fx-particle' + (stars && k % 2 === 0 ? ' star' : '');
    var size = 4 + Math.random() * (stars ? 9 : 6);
    p.style.width = p.style.height = size + 'px';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.background = colors[k % colors.length];
    document.body.appendChild(p);
    var a = Math.random() * Math.PI * 2;
    var d = 30 + Math.random() * (stars ? 120 : 60);
    var anim = p.animate([
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
      { transform: 'translate(calc(-50% + ' + (Math.cos(a) * d) + 'px), calc(-50% + ' + (Math.sin(a) * d) + 'px)) scale(.2)', opacity: 0 }
    ], { duration: 500 + Math.random() * 450, easing: 'cubic-bezier(.15,.7,.3,1)' });
    anim.onfinish = (function(node) { return function() { node.remove(); }; })(p);
  }
}

function fxBurstOn(elem, amount, colors, stars) {
  if (!elem) return;
  var r = elem.getBoundingClientRect();
  fxBurst(r.left + r.width / 2, r.top + r.height / 2, amount, colors, stars);
}

// Rebond d'un element, sans toucher a ses classes
function fxBump(elem, scale) {
  if (!elem || !elem.animate || !fxEnabled()) return;
  elem.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(' + (scale || 1.25) + ')' },
    { transform: 'scale(1)' }
  ], { duration: 320, easing: 'cubic-bezier(.34,1.56,.64,1)' });
}

// Clic sur un ingredient : la carte reagit, un "+1" monte
function fxIngredient(ingId, amount) {
  var card = document.querySelector('.ing-card[data-ing="' + ingId + '"]');
  if (!card) return;
  fxBump(card.querySelector('.ing-emoji'), 1.35);
  fxBump(card.querySelector('.ing-count'), 1.3);
  if (!fxEnabled()) return;
  var r = card.getBoundingClientRect();
  var s = document.createElement('span');
  s.className = 'float-plus';
  s.textContent = '+' + amount;
  s.style.left = (r.left + r.width / 2 + (Math.random() * 30 - 15)) + 'px';
  s.style.top = (r.top + 18) + 'px';
  document.body.appendChild(s);
  setTimeout(function() { s.remove(); }, 800);
}

function fxShake(elem) {
  if (!elem || !elem.animate || !fxEnabled()) return;
  elem.animate([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(-2px)' }, { transform: 'none' }], { duration: 220 });
}

function fxLevelUp() {
  var lvl = document.querySelector('.level-display');
  fxBump(lvl, 1.5);
  fxBurstOn(lvl, 34, null, true);
}
