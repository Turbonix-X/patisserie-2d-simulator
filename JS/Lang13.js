/* ============================================
   PATISSERIE 2D SIMULATOR - TEXTES DE LA 1.2 (SNAPSHOT 2)
   ============================================ */

(function() {
  var add = {
    fr: {
      'home.language':`Langue`, 'home.newGame':`Nouvelle partie`, 'home.pasteCode':`Coller un code`, 'home.openFile':`Ouvrir un fichier`, 'home.fileHelp':`Choisis le fichier de sauvegarde (.p2ds ou .txt) pour le retrouver dans une nouvelle case.`,
      'home.use':`Utiliser`, 'home.adminPanel':`Panneau admin`, 'changelog.older':`Voir les versions plus anciennes`, 'bld.brokenTip':`Bâtiments en panne`,
      'emp.mgrReject':`Refuser les candidatures de niveau trop bas`, 'emp.mgrRejectHelp':`Il refuse tout seul les candidatures dont le niveau est sous le niveau minimum choisi plus bas.`,
      'settings.lockCookies':`après 100 000 cookies vendus`
    },
    en: {
      'home.language':`Language`, 'home.newGame':`New game`, 'home.pasteCode':`Paste a code`, 'home.openFile':`Open a file`, 'home.fileHelp':`Pick the save file (.p2ds or .txt) to get it back in a new slot.`,
      'home.use':`Use`, 'home.adminPanel':`Admin panel`, 'changelog.older':`Show older versions`, 'bld.brokenTip':`Broken buildings`,
      'emp.mgrReject':`Refuse applications with a level that is too low`, 'emp.mgrRejectHelp':`He automatically refuses applications below the minimum level you choose below.`,
      'settings.lockCookies':`after 100,000 cookies sold`
    },
    es: {
      'home.language':`Idioma`, 'home.newGame':`Nueva partida`, 'home.pasteCode':`Pegar un código`, 'home.openFile':`Abrir un archivo`, 'home.fileHelp':`Elige el archivo de partida (.p2ds o .txt) para recuperarla en una casilla nueva.`,
      'home.use':`Usar`, 'home.adminPanel':`Panel de administración`, 'changelog.older':`Ver versiones anteriores`, 'bld.brokenTip':`Edificios averiados`,
      'emp.mgrReject':`Rechazar candidaturas de nivel demasiado bajo`, 'emp.mgrRejectHelp':`Rechaza solo las candidaturas cuyo nivel está por debajo del nivel mínimo que elijas abajo.`,
      'settings.lockCookies':`tras vender 100 000 galletas`
    },
    pt: {
      'home.language':`Idioma`, 'home.newGame':`Novo jogo`, 'home.pasteCode':`Colar um código`, 'home.openFile':`Abrir um ficheiro`, 'home.fileHelp':`Escolhe o ficheiro de gravação (.p2ds ou .txt) para o recuperar numa casa nova.`,
      'home.use':`Usar`, 'home.adminPanel':`Painel de administração`, 'changelog.older':`Ver versões mais antigas`, 'bld.brokenTip':`Edifícios avariados`,
      'emp.mgrReject':`Recusar candidaturas de nível demasiado baixo`, 'emp.mgrRejectHelp':`Recusa sozinho as candidaturas com nível abaixo do nível mínimo que escolheres abaixo.`,
      'settings.lockCookies':`depois de vender 100 000 bolachas`
    },
    de: {
      'home.language':`Sprache`, 'home.newGame':`Neues Spiel`, 'home.pasteCode':`Code einfügen`, 'home.openFile':`Datei öffnen`, 'home.fileHelp':`Wähle die Spielstand-Datei (.p2ds oder .txt), um sie in einem neuen Feld zurückzuholen.`,
      'home.use':`Verwenden`, 'home.adminPanel':`Admin-Bereich`, 'changelog.older':`Ältere Versionen anzeigen`, 'bld.brokenTip':`Defekte Gebäude`,
      'emp.mgrReject':`Bewerbungen mit zu niedriger Stufe ablehnen`, 'emp.mgrRejectHelp':`Er lehnt Bewerbungen unter der unten gewählten Mindeststufe automatisch ab.`,
      'settings.lockCookies':`nach 100.000 verkauften Keksen`
    },
    ar: {
      'home.language':`اللغة`, 'home.newGame':`لعبة جديدة`, 'home.pasteCode':`ألصق رمزًا`, 'home.openFile':`افتح ملفًا`, 'home.fileHelp':`اختر ملف الحفظ (‎.p2ds أو ‎.txt) لاستعادته في خانة جديدة.`,
      'home.use':`استخدم`, 'home.adminPanel':`لوحة الإدارة`, 'changelog.older':`عرض الإصدارات الأقدم`, 'bld.brokenTip':`مبانٍ معطّلة`,
      'emp.mgrReject':`رفض الطلبات ذات المستوى المنخفض جدًا`, 'emp.mgrRejectHelp':`يرفض تلقائيًا الطلبات التي مستواها أقل من الحدّ الأدنى الذي تختاره أدناه.`,
      'settings.lockCookies':`بعد بيع 100 ألف كوكيز`
    },
    zh: {
      'home.language':`语言`, 'home.newGame':`新游戏`, 'home.pasteCode':`粘贴代码`, 'home.openFile':`打开文件`, 'home.fileHelp':`选择存档文件（.p2ds 或 .txt），把它找回到新的存档位里。`,
      'home.use':`使用`, 'home.adminPanel':`管理面板`, 'changelog.older':`查看更早的版本`, 'bld.brokenTip':`损坏的建筑`,
      'emp.mgrReject':`拒绝等级过低的应聘`, 'emp.mgrRejectHelp':`他会自动拒绝低于下方所选最低等级的应聘。`,
      'settings.lockCookies':`卖出 10 万块饼干后`
    },
    ja: {
      'home.language':`言語`, 'home.newGame':`新しいゲーム`, 'home.pasteCode':`コードを貼り付け`, 'home.openFile':`ファイルを開く`, 'home.fileHelp':`セーブファイル（.p2ds または .txt）を選んで、新しい枠に取り込みます。`,
      'home.use':`切り替える`, 'home.adminPanel':`管理パネル`, 'changelog.older':`古いバージョンを表示`, 'bld.brokenTip':`故障した建物`,
      'emp.mgrReject':`レベルが低すぎる応募を断る`, 'emp.mgrRejectHelp':`下で選んだ最低レベルより低い応募を、自動で断ります。`,
      'settings.lockCookies':`クッキーを 10 万個売ったら`
    },
    ko: {
      'home.language':`언어`, 'home.newGame':`새 게임`, 'home.pasteCode':`코드 붙여넣기`, 'home.openFile':`파일 열기`, 'home.fileHelp':`저장 파일(.p2ds 또는 .txt)을 골라 새 칸으로 가져옵니다.`,
      'home.use':`사용`, 'home.adminPanel':`관리자 패널`, 'changelog.older':`이전 버전 보기`, 'bld.brokenTip':`고장 난 건물`,
      'emp.mgrReject':`레벨이 너무 낮은 지원 거절`, 'emp.mgrRejectHelp':`아래에서 고른 최소 레벨보다 낮은 지원을 자동으로 거절합니다.`,
      'settings.lockCookies':`쿠키 10만 개를 판 뒤`
    },
    ru: {
      'home.language':`Язык`, 'home.newGame':`Новая игра`, 'home.pasteCode':`Вставить код`, 'home.openFile':`Открыть файл`, 'home.fileHelp':`Выбери файл сохранения (.p2ds или .txt), чтобы вернуть его в новую ячейку.`,
      'home.use':`Выбрать`, 'home.adminPanel':`Панель администратора`, 'changelog.older':`Показать старые версии`, 'bld.brokenTip':`Сломанные здания`,
      'emp.mgrReject':`Отклонять заявки со слишком низким уровнем`, 'emp.mgrRejectHelp':`Сам отклоняет заявки с уровнем ниже минимального, выбранного ниже.`,
      'settings.lockCookies':`после 100 000 проданного печенья`
    }
  };
  Object.keys(add).forEach(function(l) { Object.assign(LANGS[l], add[l]); });

  // « Local » : les parties gardées sur cet appareil, sans compte
  var local = {
    fr: `Sans compte (cet appareil)`, en: `No account (this device)`, es: `Sin cuenta (este dispositivo)`, pt: `Sem conta (este dispositivo)`, de: `Ohne Konto (dieses Gerät)`,
    ar: `بدون حساب (هذا الجهاز)`, zh: `无账号（本设备）`, ja: `アカウントなし（この端末）`, ko: `계정 없음(이 기기)`, ru: `Без аккаунта (это устройство)`
  };
  Object.keys(local).forEach(function(l) { LANGS[l]['home.profileLocal'] = local[l]; });

  var auto = { fr: `Automatique`, en: `Automatic`, es: `Automático`, pt: `Automático`, de: `Automatisch`, ar: `تلقائي`, zh: `自动`, ja: `自動`, ko: `자동`, ru: `Автоматически` };
  Object.keys(auto).forEach(function(l) { LANGS[l]['settings.themeAuto'] = auto[l]; });
})();
