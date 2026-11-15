/* ============================================
   PATISSERIE 2D SIMULATOR - TEXTES DE LA 1.2.2
   ============================================ */

(function() {
  var v = {
    fr: {
      'console.bobGold':`Bob est maintenant en or massif.`, 'console.bobUngold':`Bob a retrouvé sa couleur normale.`,
      'console.achMax':`{{n}} succès débloqués.`, 'console.achUnknown':`Succès inconnu. Tape son nom ou son identifiant.`, 'console.achUnlocked':`Succès débloqué : {{n}}`,
      'console.langUnknown':`Langue inconnue. Essaie un code (fr, en, es…) ou un nom (français, english…).`, 'console.langSet':`Langue : {{n}}`,
      'stats.totalIngMade':`Ingrédients préparés`, 'stats.nothingYet':`Rien pour l'instant.`,
      'offline.bar':`Pas de wifi : ta partie n'est pas sauvegardée.`,
      'offline.bob':`Oh non, plus de wifi ! Ta partie n'est pas sauvegardée tant que la connexion ne revient pas. Tes autres parties restent jouables, mais elles ne sont pas sauvegardées non plus.`,
      'update.failed':`La mise à jour n'a pas pu se faire. Réessaie dans un moment.`,
      'home.newPassTitle':`Nouveau mot de passe`, 'home.newPassHelp':`Choisis le mot de passe de ton compte.`, 'home.newPassBtn':`Changer le mot de passe`, 'home.passShort':`Au moins 6 caractères.`, 'home.newPassDone':`Mot de passe changé !`
    },
    en: {
      'console.bobGold':`Bob is now solid gold.`, 'console.bobUngold':`Bob is back to his normal colour.`,
      'console.achMax':`{{n}} achievements unlocked.`, 'console.achUnknown':`Unknown achievement. Type its name or its id.`, 'console.achUnlocked':`Achievement unlocked: {{n}}`,
      'console.langUnknown':`Unknown language. Try a code (fr, en, es…) or a name (français, english…).`, 'console.langSet':`Language: {{n}}`,
      'stats.totalIngMade':`Ingredients prepared`, 'stats.nothingYet':`Nothing yet.`,
      'offline.bar':`No wifi: your game is not being saved.`,
      'offline.bob':`Oh no, the wifi is gone! Your game is not saved until the connection is back. You can still play your other games, but they are not saved either.`,
      'update.failed':`The update could not be done. Try again in a moment.`,
      'home.newPassTitle':`New password`, 'home.newPassHelp':`Choose the password for your account.`, 'home.newPassBtn':`Change password`, 'home.passShort':`At least 6 characters.`, 'home.newPassDone':`Password changed!`
    },
    es: {
      'console.bobGold':`Bob ahora es de oro macizo.`, 'console.bobUngold':`Bob ha recuperado su color normal.`,
      'console.achMax':`{{n}} logros desbloqueados.`, 'console.achUnknown':`Logro desconocido. Escribe su nombre o su id.`, 'console.achUnlocked':`Logro desbloqueado: {{n}}`,
      'console.langUnknown':`Idioma desconocido. Prueba un código (fr, en, es…) o un nombre (français, english…).`, 'console.langSet':`Idioma: {{n}}`,
      'stats.totalIngMade':`Ingredientes preparados`, 'stats.nothingYet':`Nada por ahora.`,
      'offline.bar':`Sin wifi: tu partida no se está guardando.`,
      'offline.bob':`¡Oh no, se fue el wifi! Tu partida no se guarda hasta que vuelva la conexión. Puedes seguir jugando tus otras partidas, pero tampoco se guardan.`,
      'update.failed':`No se pudo actualizar. Inténtalo de nuevo en un momento.`,
      'home.newPassTitle':`Nueva contraseña`, 'home.newPassHelp':`Elige la contraseña de tu cuenta.`, 'home.newPassBtn':`Cambiar la contraseña`, 'home.passShort':`Al menos 6 caracteres.`, 'home.newPassDone':`¡Contraseña cambiada!`
    },
    pt: {
      'console.bobGold':`O Bob agora é de ouro maciço.`, 'console.bobUngold':`O Bob voltou à cor normal.`,
      'console.achMax':`{{n}} conquistas desbloqueadas.`, 'console.achUnknown':`Conquista desconhecida. Escreve o nome ou o id.`, 'console.achUnlocked':`Conquista desbloqueada: {{n}}`,
      'console.langUnknown':`Idioma desconhecido. Experimenta um código (fr, en, es…) ou um nome (français, english…).`, 'console.langSet':`Idioma: {{n}}`,
      'stats.totalIngMade':`Ingredientes preparados`, 'stats.nothingYet':`Nada por agora.`,
      'offline.bar':`Sem wifi: o teu jogo não está a ser guardado.`,
      'offline.bob':`Oh não, acabou o wifi! O teu jogo não é guardado enquanto a ligação não voltar. Podes continuar a jogar os outros jogos, mas também não são guardados.`,
      'update.failed':`Não foi possível atualizar. Tenta de novo daqui a pouco.`,
      'home.newPassTitle':`Nova palavra-passe`, 'home.newPassHelp':`Escolhe a palavra-passe da tua conta.`, 'home.newPassBtn':`Mudar a palavra-passe`, 'home.passShort':`Pelo menos 6 caracteres.`, 'home.newPassDone':`Palavra-passe alterada!`
    },
    de: {
      'console.bobGold':`Bob ist jetzt aus purem Gold.`, 'console.bobUngold':`Bob hat wieder seine normale Farbe.`,
      'console.achMax':`{{n}} Erfolge freigeschaltet.`, 'console.achUnknown':`Unbekannter Erfolg. Gib seinen Namen oder seine ID ein.`, 'console.achUnlocked':`Erfolg freigeschaltet: {{n}}`,
      'console.langUnknown':`Unbekannte Sprache. Versuche einen Code (fr, en, es…) oder einen Namen (français, english…).`, 'console.langSet':`Sprache: {{n}}`,
      'stats.totalIngMade':`Zubereitete Zutaten`, 'stats.nothingYet':`Noch nichts.`,
      'offline.bar':`Kein WLAN: dein Spiel wird nicht gespeichert.`,
      'offline.bob':`Oh nein, das WLAN ist weg! Dein Spiel wird erst wieder gespeichert, wenn die Verbindung zurück ist. Deine anderen Spiele kannst du weiterspielen, sie werden aber auch nicht gespeichert.`,
      'update.failed':`Das Update ist fehlgeschlagen. Versuche es gleich noch einmal.`,
      'home.newPassTitle':`Neues Passwort`, 'home.newPassHelp':`Wähle das Passwort für dein Konto.`, 'home.newPassBtn':`Passwort ändern`, 'home.passShort':`Mindestens 6 Zeichen.`, 'home.newPassDone':`Passwort geändert!`
    },
    ar: {
      'console.bobGold':`أصبح بوب من الذهب الخالص.`, 'console.bobUngold':`عاد بوب إلى لونه العادي.`,
      'console.achMax':`تم فتح {{n}} إنجازًا.`, 'console.achUnknown':`إنجاز غير معروف. اكتب اسمه أو معرّفه.`, 'console.achUnlocked':`تم فتح الإنجاز: {{n}}`,
      'console.langUnknown':`لغة غير معروفة. جرّب رمزًا (fr، en، es…) أو اسمًا (français، english…).`, 'console.langSet':`اللغة: {{n}}`,
      'stats.totalIngMade':`المكوّنات المحضّرة`, 'stats.nothingYet':`لا شيء بعد.`,
      'offline.bar':`لا يوجد واي فاي: لعبتك لا تُحفظ.`,
      'offline.bob':`يا للأسف، انقطع الواي فاي! لا تُحفظ لعبتك حتى يعود الاتصال. يمكنك اللعب بألعابك الأخرى، لكنها لا تُحفظ أيضًا.`,
      'update.failed':`تعذّر التحديث. حاول مجددًا بعد قليل.`,
      'home.newPassTitle':`كلمة مرور جديدة`, 'home.newPassHelp':`اختر كلمة مرور حسابك.`, 'home.newPassBtn':`تغيير كلمة المرور`, 'home.passShort':`6 أحرف على الأقل.`, 'home.newPassDone':`تم تغيير كلمة المرور!`
    },
    zh: {
      'console.bobGold':`鲍勃现在是纯金的了。`, 'console.bobUngold':`鲍勃恢复了原来的颜色。`,
      'console.achMax':`已解锁 {{n}} 个成就。`, 'console.achUnknown':`未知成就。请输入它的名称或 ID。`, 'console.achUnlocked':`成就已解锁：{{n}}`,
      'console.langUnknown':`未知语言。试试代码（fr、en、es…）或名称（français、english…）。`, 'console.langSet':`语言：{{n}}`,
      'stats.totalIngMade':`已制作的原料`, 'stats.nothingYet':`暂时没有。`,
      'offline.bar':`没有 Wi-Fi：你的游戏不会被保存。`,
      'offline.bob':`糟糕，没有 Wi-Fi 了！在网络恢复之前，你的游戏不会被保存。你仍然可以玩其他存档，但它们也不会被保存。`,
      'update.failed':`更新失败。请稍后再试。`,
      'home.newPassTitle':`新密码`, 'home.newPassHelp':`为你的账号选择密码。`, 'home.newPassBtn':`修改密码`, 'home.passShort':`至少 6 个字符。`, 'home.newPassDone':`密码已修改！`
    },
    ja: {
      'console.bobGold':`ボブは純金になりました。`, 'console.bobUngold':`ボブは元の色に戻りました。`,
      'console.achMax':`{{n}} 個の実績を解除しました。`, 'console.achUnknown':`その実績は見つかりません。名前かIDを入力してください。`, 'console.achUnlocked':`実績を解除：{{n}}`,
      'console.langUnknown':`その言語は見つかりません。コード（fr、en、es…）か名前（français、english…）を試してください。`, 'console.langSet':`言語：{{n}}`,
      'stats.totalIngMade':`作った材料`, 'stats.nothingYet':`まだありません。`,
      'offline.bar':`Wi-Fiがありません：ゲームは保存されません。`,
      'offline.bob':`大変、Wi-Fiが切れました！接続が戻るまでゲームは保存されません。ほかのゲームも遊べますが、保存されません。`,
      'update.failed':`アップデートできませんでした。しばらくしてからもう一度お試しください。`,
      'home.newPassTitle':`新しいパスワード`, 'home.newPassHelp':`アカウントのパスワードを決めてください。`, 'home.newPassBtn':`パスワードを変更`, 'home.passShort':`6文字以上にしてください。`, 'home.newPassDone':`パスワードを変更しました！`
    },
    ko: {
      'console.bobGold':`밥이 이제 순금이 되었어요.`, 'console.bobUngold':`밥이 원래 색으로 돌아왔어요.`,
      'console.achMax':`업적 {{n}}개를 해제했어요.`, 'console.achUnknown':`알 수 없는 업적이에요. 이름이나 ID를 입력하세요.`, 'console.achUnlocked':`업적 해제: {{n}}`,
      'console.langUnknown':`알 수 없는 언어예요. 코드(fr, en, es…)나 이름(français, english…)을 써 보세요.`, 'console.langSet':`언어: {{n}}`,
      'stats.totalIngMade':`만든 재료`, 'stats.nothingYet':`아직 없어요.`,
      'offline.bar':`와이파이가 없어요: 게임이 저장되지 않아요.`,
      'offline.bob':`앗, 와이파이가 끊겼어요! 연결이 돌아올 때까지 게임이 저장되지 않아요. 다른 게임도 할 수 있지만 저장되지 않아요.`,
      'update.failed':`업데이트하지 못했어요. 잠시 후 다시 시도하세요.`,
      'home.newPassTitle':`새 비밀번호`, 'home.newPassHelp':`계정의 비밀번호를 정하세요.`, 'home.newPassBtn':`비밀번호 변경`, 'home.passShort':`6자 이상이어야 해요.`, 'home.newPassDone':`비밀번호를 바꿨어요!`
    },
    ru: {
      'console.bobGold':`Боб теперь из чистого золота.`, 'console.bobUngold':`Боб снова обычного цвета.`,
      'console.achMax':`Открыто достижений: {{n}}.`, 'console.achUnknown':`Неизвестное достижение. Введи его название или id.`, 'console.achUnlocked':`Достижение открыто: {{n}}`,
      'console.langUnknown':`Неизвестный язык. Попробуй код (fr, en, es…) или название (français, english…).`, 'console.langSet':`Язык: {{n}}`,
      'stats.totalIngMade':`Приготовлено ингредиентов`, 'stats.nothingYet':`Пока ничего.`,
      'offline.bar':`Нет Wi-Fi: игра не сохраняется.`,
      'offline.bob':`Ой, пропал Wi-Fi! Игра не сохраняется, пока не вернётся соединение. В другие игры тоже можно играть, но они не сохраняются.`,
      'update.failed':`Не удалось обновить. Попробуй ещё раз чуть позже.`,
      'home.newPassTitle':`Новый пароль`, 'home.newPassHelp':`Выбери пароль для своего аккаунта.`, 'home.newPassBtn':`Сменить пароль`, 'home.passShort':`Не меньше 6 символов.`, 'home.newPassDone':`Пароль изменён!`
    }
  };
  Object.keys(v).forEach(function(l) { Object.assign(LANGS[l], v[l]); });
})();
