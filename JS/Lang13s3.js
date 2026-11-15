/* ============================================
   PATISSERIE 2D SIMULATOR - TEXTES DE LA 1.3 SNAPSHOT 3
   ============================================ */

(function() {
  var v = {
    fr: { 'changelog.archives':`Archives` },
    en: { 'changelog.archives':`Archives` },
    es: { 'changelog.archives':`Archivo` },
    pt: { 'changelog.archives':`Arquivo` },
    de: { 'changelog.archives':`Archiv` },
    ar: { 'changelog.archives':`الأرشيف` },
    zh: { 'changelog.archives':`存档` },
    ja: { 'changelog.archives':`アーカイブ` },
    ko: { 'changelog.archives':`아카이브` },
    ru: { 'changelog.archives':`Архив` }
  };
  Object.keys(v).forEach(function(l) { Object.assign(LANGS[l], v[l]); });
})();
