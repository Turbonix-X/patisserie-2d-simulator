/* ============================================
   PATISSERIE 2D SIMULATOR - TEXTES DE LA VERSION 1.1.2
   Les nouveaux textes, dans les 10 langues
   ============================================ */

(function() {
  var add = {
    fr: {
      'update.toast':`Une mise à jour est disponible : {{v}}.`, 'update.bob':`Une mise à jour du jeu est disponible ! Clique sur le numéro de version, en haut, pour la charger sans quitter ta partie.`,
      'update.available':`Mise à jour disponible : {{v}}`, 'update.help':`Le jeu se met à jour tout de suite, sans recharger la page. Ta partie est sauvegardée avant.`, 'update.btn':`Mettre à jour`, 'update.applying':`Mise à jour…`,
      'offline.noSave':`Tu es hors ligne : la partie n’est pas sauvegardée tant que tu n’as pas de connexion.`, 'offline.back':`De retour en ligne : la partie est de nouveau sauvegardée.`,
      'tabs.hint':`Niveau 450 ! Tu peux maintenant faire glisser les onglets à gauche ou à droite pour les ranger.`, 'mach.brokenTip':`Machines en panne`,
      'console.tabs.activate':`Rangement des onglets activé : fais-les glisser.`, 'console.tabs.deactivate':`Rangement des onglets désactivé.`, 'console.tabs.reset':`Onglets remis dans leur ordre d’origine.`,
      'console.appPrice':`{{n}} coûte {{v}} : tu n’as pas assez d’argent. Ajoute free pour l’embaucher gratuitement.`, 'console.appHiredPaid':`{{n}} est embauché pour {{v}}.`, 'console.needBakeries':`Il faut au moins {{n}} pâtisseries pour avoir des transporteurs.`
    },
    en: {
      'update.toast':`An update is available: {{v}}.`, 'update.bob':`A game update is available! Click the version number at the top to load it without leaving your game.`,
      'update.available':`Update available: {{v}}`, 'update.help':`The game updates right away, without reloading the page. Your game is saved first.`, 'update.btn':`Update`, 'update.applying':`Updating…`,
      'offline.noSave':`You are offline: your game is not saved until you have a connection.`, 'offline.back':`Back online: your game is being saved again.`,
      'tabs.hint':`Level 450! You can now drag the tabs left or right to arrange them.`, 'mach.brokenTip':`Broken machines`,
      'console.tabs.activate':`Tab arranging turned on: drag the tabs.`, 'console.tabs.deactivate':`Tab arranging turned off.`, 'console.tabs.reset':`Tabs back in their original order.`,
      'console.appPrice':`{{n}} costs {{v}}: you don’t have enough money. Add free to hire them for free.`, 'console.appHiredPaid':`{{n}} hired for {{v}}.`, 'console.needBakeries':`You need at least {{n}} bakeries to have carriers.`
    },
    es: {
      'update.toast':`Hay una actualización disponible: {{v}}.`, 'update.bob':`¡Hay una actualización del juego! Haz clic en el número de versión, arriba, para cargarla sin salir de tu partida.`,
      'update.available':`Actualización disponible: {{v}}`, 'update.help':`El juego se actualiza al instante, sin recargar la página. Tu partida se guarda antes.`, 'update.btn':`Actualizar`, 'update.applying':`Actualizando…`,
      'offline.noSave':`Estás sin conexión: la partida no se guarda hasta que tengas conexión.`, 'offline.back':`De nuevo en línea: la partida se vuelve a guardar.`,
      'tabs.hint':`¡Nivel 450! Ahora puedes arrastrar las pestañas a la izquierda o a la derecha para ordenarlas.`, 'mach.brokenTip':`Máquinas averiadas`,
      'console.tabs.activate':`Orden de pestañas activado: arrástralas.`, 'console.tabs.deactivate':`Orden de pestañas desactivado.`, 'console.tabs.reset':`Pestañas en su orden original.`,
      'console.appPrice':`{{n}} cuesta {{v}}: no tienes suficiente dinero. Añade free para contratarlo gratis.`, 'console.appHiredPaid':`{{n}} contratado por {{v}}.`, 'console.needBakeries':`Necesitas al menos {{n}} pastelerías para tener transportistas.`
    },
    pt: {
      'update.toast':`Há uma atualização disponível: {{v}}.`, 'update.bob':`Há uma atualização do jogo! Clica no número da versão, no topo, para a carregar sem sair do teu jogo.`,
      'update.available':`Atualização disponível: {{v}}`, 'update.help':`O jogo atualiza-se logo, sem recarregar a página. O teu jogo é guardado antes.`, 'update.btn':`Atualizar`, 'update.applying':`A atualizar…`,
      'offline.noSave':`Estás offline: o jogo não é guardado até teres ligação.`, 'offline.back':`De volta online: o jogo volta a ser guardado.`,
      'tabs.hint':`Nível 450! Agora podes arrastar os separadores para a esquerda ou para a direita para os organizar.`, 'mach.brokenTip':`Máquinas avariadas`,
      'console.tabs.activate':`Organização dos separadores ativada: arrasta-os.`, 'console.tabs.deactivate':`Organização dos separadores desativada.`, 'console.tabs.reset':`Separadores na ordem original.`,
      'console.appPrice':`{{n}} custa {{v}}: não tens dinheiro suficiente. Acrescenta free para contratar de graça.`, 'console.appHiredPaid':`{{n}} contratado por {{v}}.`, 'console.needBakeries':`Precisas de pelo menos {{n}} pastelarias para ter transportadores.`
    },
    de: {
      'update.toast':`Ein Update ist verfügbar: {{v}}.`, 'update.bob':`Ein Spiel-Update ist verfügbar! Klicke oben auf die Versionsnummer, um es zu laden, ohne dein Spiel zu verlassen.`,
      'update.available':`Update verfügbar: {{v}}`, 'update.help':`Das Spiel aktualisiert sich sofort, ohne die Seite neu zu laden. Dein Spiel wird vorher gespeichert.`, 'update.btn':`Aktualisieren`, 'update.applying':`Aktualisiere …`,
      'offline.noSave':`Du bist offline: Dein Spiel wird erst wieder gespeichert, wenn du eine Verbindung hast.`, 'offline.back':`Wieder online: Dein Spiel wird wieder gespeichert.`,
      'tabs.hint':`Stufe 450! Du kannst die Reiter jetzt nach links oder rechts ziehen, um sie zu ordnen.`, 'mach.brokenTip':`Defekte Maschinen`,
      'console.tabs.activate':`Reiter-Anordnung aktiviert: Ziehe die Reiter.`, 'console.tabs.deactivate':`Reiter-Anordnung deaktiviert.`, 'console.tabs.reset':`Reiter wieder in der ursprünglichen Reihenfolge.`,
      'console.appPrice':`{{n}} kostet {{v}}: Du hast nicht genug Geld. Füge free hinzu, um kostenlos einzustellen.`, 'console.appHiredPaid':`{{n}} für {{v}} eingestellt.`, 'console.needBakeries':`Du brauchst mindestens {{n}} Bäckereien, um Fahrer zu haben.`
    },
    ar: {
      'update.toast':`يتوفّر تحديث: {{v}}.`, 'update.bob':`يتوفّر تحديث للعبة! انقر رقم الإصدار في الأعلى لتحميله دون مغادرة لعبتك.`,
      'update.available':`يتوفّر تحديث: {{v}}`, 'update.help':`تتحدّث اللعبة فورًا دون إعادة تحميل الصفحة. تُحفظ لعبتك قبل ذلك.`, 'update.btn':`حدّث`, 'update.applying':`جارٍ التحديث…`,
      'offline.noSave':`أنت غير متصل: لا تُحفظ لعبتك حتى يعود الاتصال.`, 'offline.back':`عدت متصلًا: تُحفظ لعبتك من جديد.`,
      'tabs.hint':`المستوى 450! يمكنك الآن سحب التبويبات يمينًا أو يسارًا لترتيبها.`, 'mach.brokenTip':`آلات معطّلة`,
      'console.tabs.activate':`تم تفعيل ترتيب التبويبات: اسحبها.`, 'console.tabs.deactivate':`تم إيقاف ترتيب التبويبات.`, 'console.tabs.reset':`عادت التبويبات إلى ترتيبها الأصلي.`,
      'console.appPrice':`{{n}} يكلّف {{v}}: ليس لديك مال كافٍ. أضف free لتوظيفه مجانًا.`, 'console.appHiredPaid':`تم توظيف {{n}} مقابل {{v}}.`, 'console.needBakeries':`تحتاج إلى {{n}} من المخابز على الأقل لامتلاك ناقلين.`
    },
    zh: {
      'update.toast':`有可用更新：{{v}}。`, 'update.bob':`游戏有更新啦！点击顶部的版本号，无需离开存档就能加载。`,
      'update.available':`有可用更新：{{v}}`, 'update.help':`游戏立即更新，无需刷新页面。更新前会先保存你的存档。`, 'update.btn':`更新`, 'update.applying':`正在更新……`,
      'offline.noSave':`你处于离线状态：恢复联网前不会保存存档。`, 'offline.back':`已重新联网：存档恢复保存。`,
      'tabs.hint':`450 级！现在你可以向左或向右拖动标签页来排列它们。`, 'mach.brokenTip':`损坏的机器`,
      'console.tabs.activate':`已开启标签页排序：拖动标签页即可。`, 'console.tabs.deactivate':`已关闭标签页排序。`, 'console.tabs.reset':`标签页已恢复原来的顺序。`,
      'console.appPrice':`{{n}} 需要 {{v}}：你的钱不够。加上 free 可免费雇用。`, 'console.appHiredPaid':`已以 {{v}} 雇用 {{n}}。`, 'console.needBakeries':`至少需要 {{n}} 家面包店才能有运输员。`
    },
    ja: {
      'update.toast':`アップデートがあります：{{v}}。`, 'update.bob':`ゲームのアップデートがあるよ！上のバージョン番号をクリックすると、ゲームを離れずに読み込めるよ。`,
      'update.available':`アップデートがあります：{{v}}`, 'update.help':`ページを再読み込みせずに、すぐに更新します。先にデータを保存します。`, 'update.btn':`更新する`, 'update.applying':`更新中…`,
      'offline.noSave':`オフラインです：接続が戻るまでデータは保存されません。`, 'offline.back':`オンラインに戻りました：データの保存を再開します。`,
      'tabs.hint':`レベル450！タブを左右にドラッグして並べ替えられるようになりました。`, 'mach.brokenTip':`故障した機械`,
      'console.tabs.activate':`タブの並べ替えを有効にしました：タブをドラッグしてください。`, 'console.tabs.deactivate':`タブの並べ替えを無効にしました。`, 'console.tabs.reset':`タブを元の順番に戻しました。`,
      'console.appPrice':`{{n}} は {{v}} かかります：お金が足りません。free を付けると無料で採用できます。`, 'console.appHiredPaid':`{{n}} を {{v}} で採用しました。`, 'console.needBakeries':`運送係を雇うには、パン屋が最低 {{n}} 軒必要です。`
    },
    ko: {
      'update.toast':`업데이트가 있습니다: {{v}}.`, 'update.bob':`게임 업데이트가 있어요! 위의 버전 번호를 클릭하면 게임을 떠나지 않고 불러올 수 있어요.`,
      'update.available':`업데이트 가능: {{v}}`, 'update.help':`페이지를 새로고침하지 않고 바로 업데이트합니다. 먼저 게임을 저장합니다.`, 'update.btn':`업데이트`, 'update.applying':`업데이트 중…`,
      'offline.noSave':`오프라인입니다: 연결될 때까지 게임이 저장되지 않습니다.`, 'offline.back':`다시 온라인입니다: 게임 저장을 다시 시작합니다.`,
      'tabs.hint':`레벨 450! 이제 탭을 왼쪽이나 오른쪽으로 끌어서 정렬할 수 있습니다.`, 'mach.brokenTip':`고장 난 기계`,
      'console.tabs.activate':`탭 정렬을 켰습니다: 탭을 끌어 보세요.`, 'console.tabs.deactivate':`탭 정렬을 껐습니다.`, 'console.tabs.reset':`탭을 원래 순서로 되돌렸습니다.`,
      'console.appPrice':`{{n}}님은 {{v}}가 필요합니다: 돈이 부족합니다. free를 붙이면 무료로 고용합니다.`, 'console.appHiredPaid':`{{n}}님을 {{v}}에 고용했습니다.`, 'console.needBakeries':`운송원을 두려면 제과점이 최소 {{n}}개 필요합니다.`
    },
    ru: {
      'update.toast':`Доступно обновление: {{v}}.`, 'update.bob':`Вышло обновление игры! Нажми на номер версии вверху, чтобы загрузить его, не выходя из игры.`,
      'update.available':`Доступно обновление: {{v}}`, 'update.help':`Игра обновится сразу, без перезагрузки страницы. Сначала твоя игра сохранится.`, 'update.btn':`Обновить`, 'update.applying':`Обновление…`,
      'offline.noSave':`Ты не в сети: игра не сохраняется, пока нет подключения.`, 'offline.back':`Снова в сети: игра опять сохраняется.`,
      'tabs.hint':`Уровень 450! Теперь вкладки можно перетаскивать влево и вправо, чтобы расставить их по-своему.`, 'mach.brokenTip':`Сломанные машины`,
      'console.tabs.activate':`Расстановка вкладок включена: перетаскивай их.`, 'console.tabs.deactivate':`Расстановка вкладок выключена.`, 'console.tabs.reset':`Вкладки вернулись в исходный порядок.`,
      'console.appPrice':`{{n}} стоит {{v}}: не хватает денег. Добавь free, чтобы нанять бесплатно.`, 'console.appHiredPaid':`{{n}} нанят за {{v}}.`, 'console.needBakeries':`Для перевозчиков нужно минимум {{n}} кондитерских.`
    }
  };
  Object.keys(add).forEach(function(l) { Object.assign(LANGS[l], add[l]); });

  var cmd = {
    pt: { '/tabs':`Organiza os separadores como quiseres.`, 'c:/tabs customization activate':`Ativa a organização dos separadores, mesmo antes do nível 450. Arrasta-os para a esquerda ou para a direita.`, 'c:/tabs customization deactivate':`Desativa: os separadores voltam à ordem normal.`, 'c:/tabs customization reset':`Repõe a ordem e a definição originais.`,
      'c:/employee hire NAME':`Contrata o candidato com este nome, ao seu preço.`, 'c:/employee hire NAME free':`Contrata de graça o candidato com este nome.` },
    de: { '/tabs':`Ordne die Reiter, wie du willst.`, 'c:/tabs customization activate':`Schaltet das Ordnen der Reiter ein, auch vor Stufe 450. Ziehe sie nach links oder rechts.`, 'c:/tabs customization deactivate':`Schaltet es aus: Die Reiter gehen zurück in die normale Reihenfolge.`, 'c:/tabs customization reset':`Setzt Reihenfolge und Einstellung zurück.`,
      'c:/employee hire NAME':`Stellt den Bewerber mit diesem Namen zu seinem Preis ein.`, 'c:/employee hire NAME free':`Stellt den Bewerber mit diesem Namen kostenlos ein.` },
    ar: { '/tabs':`رتّب التبويبات كما تشاء.`, 'c:/tabs customization activate':`يفعّل ترتيب التبويبات حتى قبل المستوى 450. اسحبها يمينًا أو يسارًا.`, 'c:/tabs customization deactivate':`يوقفه: تعود التبويبات إلى ترتيبها العادي.`, 'c:/tabs customization reset':`يعيد الترتيب والإعداد إلى الأصل.`,
      'c:/employee hire NAME':`يوظّف المرشّح الذي يحمل هذا الاسم بسعره.`, 'c:/employee hire NAME free':`يوظّف مجانًا المرشّح الذي يحمل هذا الاسم.` },
    zh: { '/tabs':`按你想要的方式排列标签页。`, 'c:/tabs customization activate':`开启标签页排序，即使未到 450 级。向左或向右拖动即可。`, 'c:/tabs customization deactivate':`关闭排序：标签页回到正常顺序。`, 'c:/tabs customization reset':`恢复原来的顺序和设置。`,
      'c:/employee hire NAME':`按价格雇用这个名字的应聘者。`, 'c:/employee hire NAME free':`免费雇用这个名字的应聘者。` },
    ja: { '/tabs':`タブを好きな順に並べます。`, 'c:/tabs customization activate':`レベル450前でもタブの並べ替えを有効にします。左右にドラッグしてください。`, 'c:/tabs customization deactivate':`無効にします：タブは通常の順番に戻ります。`, 'c:/tabs customization reset':`順番と設定を元に戻します。`,
      'c:/employee hire NAME':`この名前の応募者を、その価格で採用します。`, 'c:/employee hire NAME free':`この名前の応募者を無料で採用します。` },
    ko: { '/tabs':`탭을 원하는 대로 정렬합니다.`, 'c:/tabs customization activate':`450레벨 전에도 탭 정렬을 켭니다. 왼쪽이나 오른쪽으로 끌어 보세요.`, 'c:/tabs customization deactivate':`끕니다: 탭이 원래 순서로 돌아갑니다.`, 'c:/tabs customization reset':`순서와 설정을 원래대로 되돌립니다.`,
      'c:/employee hire NAME':`이 이름의 지원자를 해당 가격에 고용합니다.`, 'c:/employee hire NAME free':`이 이름의 지원자를 무료로 고용합니다.` },
    ru: { '/tabs':`Расставляет вкладки как тебе удобно.`, 'c:/tabs customization activate':`Включает расстановку вкладок, даже до 450 уровня. Перетаскивай их влево или вправо.`, 'c:/tabs customization deactivate':`Выключает: вкладки возвращаются в обычный порядок.`, 'c:/tabs customization reset':`Возвращает порядок и настройку к исходным.`,
      'c:/employee hire NAME':`Нанимает кандидата с этим именем по его цене.`, 'c:/employee hire NAME free':`Бесплатно нанимает кандидата с этим именем.` }
  };
  Object.keys(cmd).forEach(function(l) { Object.assign(I18N_EXTRA[l].cmd, cmd[l]); });
})();
