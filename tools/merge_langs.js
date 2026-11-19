/* Regroupe les textes par langue : node tools/merge_langs.js
   Avant : Languages.js + 8 fichiers de langue + 13 fichiers « Lang11, Lang111... » qui ajoutent chacun des textes aux 10 langues.
   Apres : chaque langue a son propre fichier (LangFR.js, LangEN.js, LangES.js...), avec TOUS ses textes.
   Le script lit les fichiers actuels, calcule ce que les anciens fichiers ajoutent a chaque langue, l'ecrit a la fin du fichier de la langue,
   puis supprime les anciens fichiers. A relancer seulement s'il reste des fichiers « LangNN.js » a regrouper. */
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.dirname(__dirname);
const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const files = [...idx.matchAll(/src="(JS\/Lang[^"?]+)/g)].map(m => m[1]);
const BASE = ['JS/LangES.js', 'JS/LangPT.js', 'JS/LangDE.js', 'JS/LangAR.js', 'JS/LangZH.js', 'JS/LangJA.js', 'JS/LangKO.js', 'JS/LangRU.js'];
const extras = files.filter(f => BASE.indexOf(f) < 0 && f !== 'JS/Languages.js');
if (!extras.length) { console.log('Rien a regrouper.'); process.exit(0); }

function ctxNew() {
  const ctx = { console, Object, Math, Date, JSON, String, Number, Array, RegExp, parseInt, parseFloat, Intl, setTimeout, clearTimeout, isNaN, Set, Map };
  ctx.window = ctx;
  ctx.document = { documentElement: {}, addEventListener() {}, getElementById() { return null; }, querySelector() { return null; }, body: { classList: {} }, createElement() { return {}; } };
  ctx.localStorage = { getItem() { return null; }, setItem() {} };
  ctx.navigator = { language: 'fr' };
  ctx.matchMedia = () => ({ matches: false });
  return vm.createContext(ctx);
}
function run(ctx, list) { for (const f of list) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f }); }
function snap(ctx) {
  return JSON.parse(vm.runInContext('JSON.stringify({ L: LANGS, X: typeof I18N_EXTRA === "undefined" ? {} : I18N_EXTRA, E: typeof CONSOLE_ES === "undefined" ? {} : CONSOLE_ES })', ctx));
}
const before = ctxNew(); run(before, ['JS/GameData.js', 'JS/Languages.js'].concat(BASE));
const b = snap(before);
const after = ctxNew(); run(after, ['JS/GameData.js', 'JS/Languages.js'].concat(BASE).concat(extras));
const a = snap(after);

function diff(x, y) {   // ce qui est nouveau ou change dans y
  const out = {};
  for (const k of Object.keys(y || {})) {
    if (y[k] !== null && typeof y[k] === 'object' && !Array.isArray(y[k])) {
      const d = diff((x || {})[k], y[k]);
      if (Object.keys(d).length) out[k] = d;
    } else if (JSON.stringify((x || {})[k]) !== JSON.stringify(y[k])) out[k] = y[k];
  }
  return out;
}
const codes = Object.keys(a.L);
const fileOf = { fr: 'JS/LangFR.js', en: 'JS/LangEN.js', es: 'JS/LangES.js', pt: 'JS/LangPT.js', de: 'JS/LangDE.js', ar: 'JS/LangAR.js', zh: 'JS/LangZH.js', ja: 'JS/LangJA.js', ko: 'JS/LangKO.js', ru: 'JS/LangRU.js' };
for (const c of codes) {
  const more = diff(b.L[c], a.L[c]);
  const xd = diff((b.X || {})[c], (a.X || {})[c]);
  let txt = '\n\n// ---------- Textes ajoutes depuis les premieres versions (regroupes ici : un seul fichier par langue) ----------\n';
  txt += '(function() {\n  Object.assign(LANGS.' + c + ', ' + JSON.stringify(more, null, 1).replace(/\n/g, '\n  ') + ');\n';
  for (const sec of Object.keys(xd)) txt += '  Object.assign(I18N_EXTRA.' + c + '.' + sec + ', ' + JSON.stringify(xd[sec], null, 1).replace(/\n/g, '\n  ') + ');\n';
  if (c === 'es') {
    const e = diff(b.E, a.E);
    if (Object.keys(e).length) txt += '  if (typeof CONSOLE_ES !== "undefined") Object.assign(CONSOLE_ES, ' + JSON.stringify(e, null, 1).replace(/\n/g, '\n  ') + ');\n';
  }
  txt += '})();\n';
  const target = path.join(ROOT, fileOf[c]);
  let head = fs.existsSync(target) ? fs.readFileSync(target, 'utf8').replace(/\s+$/, '\n') : '/* Textes en ' + c + ' */\n';
  fs.writeFileSync(target, head + txt);
  console.log(c, Object.keys(more).length + ' textes', Object.keys(xd).map(k => k + ':' + Object.keys(xd[k]).length).join(' '));
}
for (const f of extras) fs.unlinkSync(path.join(ROOT, f));
console.log('Anciens fichiers supprimes : ' + extras.length + '. Il reste a mettre a jour index.html et tests/index.html.');
