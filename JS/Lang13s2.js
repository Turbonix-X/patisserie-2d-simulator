/* ============================================
   PATISSERIE 2D SIMULATOR - TEXTES DE LA 1.3 SNAPSHOT 2
   ============================================ */

(function() {
  var v = {
    fr: { 'changelog.alpha':`Jouer aux versions Alpha dans le navigateur`, 'changelog.alphaPick':`Choisis une version…` },
    en: { 'changelog.alpha':`Play the Alpha versions in your browser`, 'changelog.alphaPick':`Pick a version…` },
    es: { 'changelog.alpha':`Jugar a las versiones Alpha en el navegador`, 'changelog.alphaPick':`Elige una versión…` },
    pt: { 'changelog.alpha':`Jogar as versões Alpha no navegador`, 'changelog.alphaPick':`Escolhe uma versão…` },
    de: { 'changelog.alpha':`Alpha-Versionen im Browser spielen`, 'changelog.alphaPick':`Version wählen …` },
    ar: { 'changelog.alpha':`العب نسخ ألفا في المتصفح`, 'changelog.alphaPick':`اختر نسخة…` },
    zh: { 'changelog.alpha':`在浏览器中玩 Alpha 版本`, 'changelog.alphaPick':`选择一个版本…` },
    ja: { 'changelog.alpha':`アルファ版をブラウザで遊ぶ`, 'changelog.alphaPick':`バージョンを選ぶ…` },
    ko: { 'changelog.alpha':`알파 버전을 브라우저에서 플레이`, 'changelog.alphaPick':`버전을 고르세요…` },
    ru: { 'changelog.alpha':`Играть в Alpha-версии в браузере`, 'changelog.alphaPick':`Выбери версию…` }
  };
  Object.keys(v).forEach(function(l) { Object.assign(LANGS[l], v[l]); });
})();
