/* ============================================
   PATISSERIE 2D SIMULATOR - TEXTES DE LA VERSION 1.1.1
   Les nouveaux textes, dans les 10 langues
   ============================================ */

(function() {
  var add = {
    fr: {
      'carry.every':`Rythme`, 'carry.everyAuto':`En continu`, 'carry.once':`Une seule fois`, 'carry.everyMin':`Toutes les {{v}} min`,
      'carry.goNow':`Transférer maintenant`, 'carry.start':`Commencer le transfert`, 'carry.stop':`Arrêter les transferts`, 'carry.next':`Prochain transfert : {{t}}`,
      'carry.sent':`Transfert envoyé.`, 'carry.started':`Transferts lancés.`, 'carry.stopped':`Transferts arrêtés.`, 'carry.busy':`Le transporteur n’est pas disponible pour le moment.`,
      'console.empFired':`{{n}} est renvoyé.`, 'console.appUnknown':`Aucun candidat ne s’appelle {{n}}.`, 'console.appRejected':`Candidature de {{n}} refusée.`, 'console.appHired':`{{n}} est embauché, gratuitement.`,
      'console.appFailed':`Impossible d’embaucher ce candidat (limite atteinte ?).`, 'console.empLevelRange':`Le niveau doit être entre 1 et {{v}}.`, 'console.empLossRange':`La perte doit être entre 0 et 100.`, 'console.empCreated':`{{n}} créé : {{j}}, niveau {{v}}.`,
      'bob.goldOff':`Glou glou… le lait a lavé l’or : me revoilà mauve !`
    },
    en: {
      'carry.every':`Schedule`, 'carry.everyAuto':`Continuous`, 'carry.once':`Just once`, 'carry.everyMin':`Every {{v}} min`,
      'carry.goNow':`Transfer now`, 'carry.start':`Start transferring`, 'carry.stop':`Stop transferring`, 'carry.next':`Next transfer: {{t}}`,
      'carry.sent':`Transfer sent.`, 'carry.started':`Transfers started.`, 'carry.stopped':`Transfers stopped.`, 'carry.busy':`The carrier isn’t available right now.`,
      'console.empFired':`{{n}} was fired.`, 'console.appUnknown':`No applicant is named {{n}}.`, 'console.appRejected':`{{n}}’s application rejected.`, 'console.appHired':`{{n}} hired for free.`,
      'console.appFailed':`Couldn’t hire this applicant (limit reached?).`, 'console.empLevelRange':`The level must be between 1 and {{v}}.`, 'console.empLossRange':`The loss must be between 0 and 100.`, 'console.empCreated':`{{n}} created: {{j}}, level {{v}}.`,
      'bob.goldOff':`Glug glug… the milk washed the gold off: I’m purple again!`
    },
    es: {
      'carry.every':`Ritmo`, 'carry.everyAuto':`Continuo`, 'carry.once':`Una sola vez`, 'carry.everyMin':`Cada {{v}} min`,
      'carry.goNow':`Transferir ahora`, 'carry.start':`Empezar a transferir`, 'carry.stop':`Detener las transferencias`, 'carry.next':`Próxima transferencia: {{t}}`,
      'carry.sent':`Transferencia enviada.`, 'carry.started':`Transferencias iniciadas.`, 'carry.stopped':`Transferencias detenidas.`, 'carry.busy':`El transportista no está disponible ahora.`,
      'console.empFired':`{{n}} ha sido despedido.`, 'console.appUnknown':`Ningún candidato se llama {{n}}.`, 'console.appRejected':`Candidatura de {{n}} rechazada.`, 'console.appHired':`{{n}} contratado gratis.`,
      'console.appFailed':`No se pudo contratar a este candidato (¿límite alcanzado?).`, 'console.empLevelRange':`El nivel debe estar entre 1 y {{v}}.`, 'console.empLossRange':`La pérdida debe estar entre 0 y 100.`, 'console.empCreated':`{{n}} creado: {{j}}, nivel {{v}}.`,
      'bob.goldOff':`Glu glu… la leche ha lavado el oro: ¡vuelvo a ser morado!`
    },
    pt: {
      'carry.every':`Ritmo`, 'carry.everyAuto':`Contínuo`, 'carry.once':`Só uma vez`, 'carry.everyMin':`A cada {{v}} min`,
      'carry.goNow':`Transferir agora`, 'carry.start':`Começar a transferir`, 'carry.stop':`Parar as transferências`, 'carry.next':`Próxima transferência: {{t}}`,
      'carry.sent':`Transferência enviada.`, 'carry.started':`Transferências iniciadas.`, 'carry.stopped':`Transferências paradas.`, 'carry.busy':`O transportador não está disponível agora.`,
      'console.empFired':`{{n}} foi despedido.`, 'console.appUnknown':`Nenhum candidato se chama {{n}}.`, 'console.appRejected':`Candidatura de {{n}} recusada.`, 'console.appHired':`{{n}} contratado de graça.`,
      'console.appFailed':`Não foi possível contratar este candidato (limite atingido?).`, 'console.empLevelRange':`O nível deve estar entre 1 e {{v}}.`, 'console.empLossRange':`A perda deve estar entre 0 e 100.`, 'console.empCreated':`{{n}} criado: {{j}}, nível {{v}}.`,
      'bob.goldOff':`Glu glu… o leite lavou o ouro: voltei a ser roxo!`
    },
    de: {
      'carry.every':`Rhythmus`, 'carry.everyAuto':`Dauerhaft`, 'carry.once':`Nur einmal`, 'carry.everyMin':`Alle {{v}} Min.`,
      'carry.goNow':`Jetzt transferieren`, 'carry.start':`Transfers starten`, 'carry.stop':`Transfers stoppen`, 'carry.next':`Nächster Transfer: {{t}}`,
      'carry.sent':`Transfer gesendet.`, 'carry.started':`Transfers gestartet.`, 'carry.stopped':`Transfers gestoppt.`, 'carry.busy':`Der Fahrer ist gerade nicht verfügbar.`,
      'console.empFired':`{{n}} wurde entlassen.`, 'console.appUnknown':`Kein Bewerber heißt {{n}}.`, 'console.appRejected':`Bewerbung von {{n}} abgelehnt.`, 'console.appHired':`{{n}} kostenlos eingestellt.`,
      'console.appFailed':`Dieser Bewerber konnte nicht eingestellt werden (Grenze erreicht?).`, 'console.empLevelRange':`Die Stufe muss zwischen 1 und {{v}} liegen.`, 'console.empLossRange':`Der Verlust muss zwischen 0 und 100 liegen.`, 'console.empCreated':`{{n}} erstellt: {{j}}, Stufe {{v}}.`,
      'bob.goldOff':`Gluck gluck … die Milch hat das Gold abgewaschen: Ich bin wieder lila!`
    },
    ar: {
      'carry.every':`الإيقاع`, 'carry.everyAuto':`باستمرار`, 'carry.once':`مرة واحدة فقط`, 'carry.everyMin':`كل {{v}} د`,
      'carry.goNow':`انقل الآن`, 'carry.start':`ابدأ النقل`, 'carry.stop':`أوقف النقل`, 'carry.next':`النقل التالي: {{t}}`,
      'carry.sent':`أُرسل النقل.`, 'carry.started':`بدأت عمليات النقل.`, 'carry.stopped':`توقفت عمليات النقل.`, 'carry.busy':`الناقل غير متاح الآن.`,
      'console.empFired':`تم فصل {{n}}.`, 'console.appUnknown':`لا يوجد مرشّح اسمه {{n}}.`, 'console.appRejected':`رُفض طلب {{n}}.`, 'console.appHired':`تم توظيف {{n}} مجانًا.`,
      'console.appFailed':`تعذّر توظيف هذا المرشّح (بلغت الحدّ؟).`, 'console.empLevelRange':`يجب أن يكون المستوى بين 1 و{{v}}.`, 'console.empLossRange':`يجب أن يكون الفقد بين 0 و100.`, 'console.empCreated':`تم إنشاء {{n}}: {{j}}، المستوى {{v}}.`,
      'bob.goldOff':`قلب قلب… الحليب غسل الذهب: عدت بنفسجيًا!`
    },
    zh: {
      'carry.every':`频率`, 'carry.everyAuto':`持续进行`, 'carry.once':`仅一次`, 'carry.everyMin':`每 {{v}} 分钟`,
      'carry.goNow':`立即转运`, 'carry.start':`开始转运`, 'carry.stop':`停止转运`, 'carry.next':`下次转运：{{t}}`,
      'carry.sent':`已发出转运。`, 'carry.started':`已开始转运。`, 'carry.stopped':`已停止转运。`, 'carry.busy':`运输员现在无法出发。`,
      'console.empFired':`{{n}} 已被解雇。`, 'console.appUnknown':`没有叫 {{n}} 的应聘者。`, 'console.appRejected':`已拒绝 {{n}} 的申请。`, 'console.appHired':`已免费雇用 {{n}}。`,
      'console.appFailed':`无法雇用该应聘者（已达上限？）。`, 'console.empLevelRange':`等级必须在 1 到 {{v}} 之间。`, 'console.empLossRange':`损耗必须在 0 到 100 之间。`, 'console.empCreated':`已创建 {{n}}：{{j}}，{{v}} 级。`,
      'bob.goldOff':`咕嘟咕嘟……牛奶把金色洗掉了：我又变紫色啦！`
    },
    ja: {
      'carry.every':`頻度`, 'carry.everyAuto':`継続`, 'carry.once':`1回だけ`, 'carry.everyMin':`{{v}} 分ごと`,
      'carry.goNow':`今すぐ運ぶ`, 'carry.start':`運搬を開始`, 'carry.stop':`運搬を停止`, 'carry.next':`次の運搬：{{t}}`,
      'carry.sent':`運搬を送り出しました。`, 'carry.started':`運搬を開始しました。`, 'carry.stopped':`運搬を停止しました。`, 'carry.busy':`運送係は今は動けません。`,
      'console.empFired':`{{n}} を解雇しました。`, 'console.appUnknown':`{{n}} という応募者はいません。`, 'console.appRejected':`{{n}} の応募を断りました。`, 'console.appHired':`{{n}} を無料で採用しました。`,
      'console.appFailed':`この応募者を採用できません（上限に達した？）。`, 'console.empLevelRange':`レベルは 1〜{{v}} にしてください。`, 'console.empLossRange':`ロスは 0〜100 にしてください。`, 'console.empCreated':`{{n}} を作成：{{j}}、レベル {{v}}。`,
      'bob.goldOff':`ごくごく…ミルクで金が洗い流された：また紫に戻ったよ！`
    },
    ko: {
      'carry.every':`주기`, 'carry.everyAuto':`계속`, 'carry.once':`한 번만`, 'carry.everyMin':`{{v}}분마다`,
      'carry.goNow':`지금 운송`, 'carry.start':`운송 시작`, 'carry.stop':`운송 중지`, 'carry.next':`다음 운송: {{t}}`,
      'carry.sent':`운송을 보냈습니다.`, 'carry.started':`운송을 시작했습니다.`, 'carry.stopped':`운송을 중지했습니다.`, 'carry.busy':`운송원이 지금은 움직일 수 없습니다.`,
      'console.empFired':`{{n}}님이 해고되었습니다.`, 'console.appUnknown':`{{n}}(이)라는 지원자가 없습니다.`, 'console.appRejected':`{{n}}님의 지원을 거절했습니다.`, 'console.appHired':`{{n}}님을 무료로 고용했습니다.`,
      'console.appFailed':`이 지원자를 고용할 수 없습니다(한도 도달?).`, 'console.empLevelRange':`레벨은 1에서 {{v}} 사이여야 합니다.`, 'console.empLossRange':`손실은 0에서 100 사이여야 합니다.`, 'console.empCreated':`{{n}} 생성: {{j}}, 레벨 {{v}}.`,
      'bob.goldOff':`꿀꺽꿀꺽… 우유가 금을 씻어냈어: 다시 보라색이 됐어!`
    },
    ru: {
      'carry.every':`Ритм`, 'carry.everyAuto':`Постоянно`, 'carry.once':`Только один раз`, 'carry.everyMin':`Каждые {{v}} мин`,
      'carry.goNow':`Перевезти сейчас`, 'carry.start':`Начать перевозки`, 'carry.stop':`Остановить перевозки`, 'carry.next':`Следующая перевозка: {{t}}`,
      'carry.sent':`Перевозка отправлена.`, 'carry.started':`Перевозки начаты.`, 'carry.stopped':`Перевозки остановлены.`, 'carry.busy':`Перевозчик сейчас недоступен.`,
      'console.empFired':`{{n}} уволен.`, 'console.appUnknown':`Кандидата по имени {{n}} нет.`, 'console.appRejected':`Заявка {{n}} отклонена.`, 'console.appHired':`{{n}} нанят бесплатно.`,
      'console.appFailed':`Не удалось нанять этого кандидата (достигнут лимит?).`, 'console.empLevelRange':`Уровень должен быть от 1 до {{v}}.`, 'console.empLossRange':`Потери должны быть от 0 до 100.`, 'console.empCreated':`{{n}} создан: {{j}}, уровень {{v}}.`,
      'bob.goldOff':`Глык-глык… молоко смыло золото: я снова фиолетовый!`
    }
  };
  Object.keys(add).forEach(function(l) { Object.assign(LANGS[l], add[l]); });

  // Le guide des commandes, dans les langues qui ont leur propre fichier
  var cmd = {
    pt: { 'c:/employee fire NAME':`Despede o funcionário com este nome.`, 'c:/employee hire NAME':`Contrata de graça o candidato com este nome.`, 'c:/employee reject NAME':`Recusa o candidato com este nome.`,
      'c:/employee create JOB NAME LEVEL':`Cria um funcionário: o ofício, o nome e um nível de 1 a 11.`, 'c:/employee create collector NAME LEVEL INGREDIENT LOSS':`Cria um colhedor: o nível, o ingrediente que colhe e a perda em percentagem.` },
    de: { 'c:/employee fire NAME':`Entlässt den Mitarbeiter mit diesem Namen.`, 'c:/employee hire NAME':`Stellt den Bewerber mit diesem Namen kostenlos ein.`, 'c:/employee reject NAME':`Lehnt den Bewerber mit diesem Namen ab.`,
      'c:/employee create JOB NAME LEVEL':`Erstellt einen Mitarbeiter: Beruf, Name und eine Stufe von 1 bis 11.`, 'c:/employee create collector NAME LEVEL INGREDIENT LOSS':`Erstellt einen Sammler: Stufe, gesammelte Zutat und Verlust in Prozent.` },
    ar: { 'c:/employee fire NAME':`يفصل الموظف الذي يحمل هذا الاسم.`, 'c:/employee hire NAME':`يوظّف مجانًا المرشّح الذي يحمل هذا الاسم.`, 'c:/employee reject NAME':`يرفض المرشّح الذي يحمل هذا الاسم.`,
      'c:/employee create JOB NAME LEVEL':`ينشئ موظفًا: مهنته واسمه ومستوى من 1 إلى 11.`, 'c:/employee create collector NAME LEVEL INGREDIENT LOSS':`ينشئ جامعًا: مستواه والمكوّن الذي يجمعه ونسبة الفقد.` },
    zh: { 'c:/employee fire NAME':`解雇这个名字的员工。`, 'c:/employee hire NAME':`免费雇用这个名字的应聘者。`, 'c:/employee reject NAME':`拒绝这个名字的应聘者。`,
      'c:/employee create JOB NAME LEVEL':`创建员工：职业、名字，以及 1 到 11 的等级。`, 'c:/employee create collector NAME LEVEL INGREDIENT LOSS':`创建采集员：等级、采集的原料和损耗百分比。` },
    ja: { 'c:/employee fire NAME':`この名前の従業員を解雇します。`, 'c:/employee hire NAME':`この名前の応募者を無料で採用します。`, 'c:/employee reject NAME':`この名前の応募者を断ります。`,
      'c:/employee create JOB NAME LEVEL':`従業員を作成します：職業、名前、1〜11のレベル。`, 'c:/employee create collector NAME LEVEL INGREDIENT LOSS':`採集係を作成します：レベル、採集する材料、ロスの割合。` },
    ko: { 'c:/employee fire NAME':`이 이름의 직원을 해고합니다.`, 'c:/employee hire NAME':`이 이름의 지원자를 무료로 고용합니다.`, 'c:/employee reject NAME':`이 이름의 지원자를 거절합니다.`,
      'c:/employee create JOB NAME LEVEL':`직원을 만듭니다: 직업, 이름, 1에서 11까지의 레벨.`, 'c:/employee create collector NAME LEVEL INGREDIENT LOSS':`채집꾼을 만듭니다: 레벨, 채집할 재료, 손실 비율.` },
    ru: { 'c:/employee fire NAME':`Увольняет сотрудника с этим именем.`, 'c:/employee hire NAME':`Бесплатно нанимает кандидата с этим именем.`, 'c:/employee reject NAME':`Отклоняет кандидата с этим именем.`,
      'c:/employee create JOB NAME LEVEL':`Создаёт сотрудника: профессия, имя и уровень от 1 до 11.`, 'c:/employee create collector NAME LEVEL INGREDIENT LOSS':`Создаёт сборщика: уровень, собираемый ингредиент и процент потерь.` }
  };
  Object.keys(cmd).forEach(function(l) { Object.assign(I18N_EXTRA[l].cmd, cmd[l]); });
})();
