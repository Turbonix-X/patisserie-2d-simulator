/* ============================================
   PATISSERIE 2D SIMULATOR - TEXTES DE LA 1.3 SNAPSHOT 1
   ============================================ */

(function() {
  var v = {
    fr: {
      'backup.title':`Sauvegarde automatique`, 'backup.help':`Un fichier de ta sauvegarde est téléchargé tout seul, à l'intervalle choisi, pour ne jamais la perdre.`, 'backup.off':`Désactivée`, 'backup.minutes':`Toutes les {{n}} minutes`, 'backup.hours':`Toutes les {{n}} h`, 'backup.done':`Sauvegarde téléchargée.`,
      'changelog.play':`Jouer à cette version`
    },
    en: {
      'backup.title':`Automatic backup`, 'backup.help':`A file of your save is downloaded by itself at the chosen interval, so you never lose it.`, 'backup.off':`Off`, 'backup.minutes':`Every {{n}} minutes`, 'backup.hours':`Every {{n}} h`, 'backup.done':`Backup downloaded.`,
      'changelog.play':`Play this version`
    },
    es: {
      'backup.title':`Copia automática`, 'backup.help':`Se descarga solo un archivo de tu partida cada cierto tiempo, para no perderla nunca.`, 'backup.off':`Desactivada`, 'backup.minutes':`Cada {{n}} minutos`, 'backup.hours':`Cada {{n}} h`, 'backup.done':`Copia descargada.`,
      'changelog.play':`Jugar esta versión`
    },
    pt: {
      'backup.title':`Cópia automática`, 'backup.help':`Um ficheiro do teu jogo é descarregado sozinho ao intervalo escolhido, para nunca o perderes.`, 'backup.off':`Desativada`, 'backup.minutes':`A cada {{n}} minutos`, 'backup.hours':`A cada {{n}} h`, 'backup.done':`Cópia descarregada.`,
      'changelog.play':`Jogar esta versão`
    },
    de: {
      'backup.title':`Automatische Sicherung`, 'backup.help':`Eine Datei deines Spielstands wird im gewählten Abstand von selbst heruntergeladen, damit er nie verloren geht.`, 'backup.off':`Aus`, 'backup.minutes':`Alle {{n}} Minuten`, 'backup.hours':`Alle {{n}} Std.`, 'backup.done':`Sicherung heruntergeladen.`,
      'changelog.play':`Diese Version spielen`
    },
    ar: {
      'backup.title':`نسخ احتياطي تلقائي`, 'backup.help':`يُنزَّل ملف من حفظك تلقائيًا كل فترة تختارها حتى لا تفقده أبدًا.`, 'backup.off':`متوقف`, 'backup.minutes':`كل {{n}} دقيقة`, 'backup.hours':`كل {{n}} ساعة`, 'backup.done':`تم تنزيل النسخة.`,
      'changelog.play':`العب هذه النسخة`
    },
    zh: {
      'backup.title':`自动备份`, 'backup.help':`按你选的间隔自动下载存档文件，永远不会丢档。`, 'backup.off':`关闭`, 'backup.minutes':`每 {{n}} 分钟`, 'backup.hours':`每 {{n}} 小时`, 'backup.done':`备份已下载。`,
      'changelog.play':`玩这个版本`
    },
    ja: {
      'backup.title':`自動バックアップ`, 'backup.help':`選んだ間隔でセーブのファイルが自動でダウンロードされ、失う心配がありません。`, 'backup.off':`オフ`, 'backup.minutes':`{{n}} 分ごと`, 'backup.hours':`{{n}} 時間ごと`, 'backup.done':`バックアップをダウンロードしました。`,
      'changelog.play':`このバージョンを遊ぶ`
    },
    ko: {
      'backup.title':`자동 백업`, 'backup.help':`고른 간격마다 저장 파일이 자동으로 내려받아져 절대 잃어버리지 않습니다.`, 'backup.off':`끄기`, 'backup.minutes':`{{n}}분마다`, 'backup.hours':`{{n}}시간마다`, 'backup.done':`백업을 내려받았습니다.`,
      'changelog.play':`이 버전 플레이`
    },
    ru: {
      'backup.title':`Автобэкап`, 'backup.help':`Файл сохранения скачивается сам через выбранный интервал, чтобы ты никогда его не потерял.`, 'backup.off':`Выключено`, 'backup.minutes':`Каждые {{n}} мин.`, 'backup.hours':`Каждые {{n}} ч`, 'backup.done':`Бэкап скачан.`,
      'changelog.play':`Играть в эту версию`
    }
  };
  Object.keys(v).forEach(function(l) { Object.assign(LANGS[l], v[l]); });
})();
