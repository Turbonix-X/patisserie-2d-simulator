/* ============================================
   PATISSERIE 2D SIMULATOR - TEXTES DE LA 1.2.3
   ============================================ */

(function() {
  var v = {
    fr: {
      'intro.name':`Avant de commencer : comment s'appelle ton entreprise ? Ce sera aussi le nom de ta partie.`, 'intro.namePlaceholder':`Le nom de ton entreprise`,
      'intro.firstBakery':`Maintenant, donne un nom à ta toute première pâtisserie !`,
      'ach.search':`Chercher un succès`, 'ach.fAll':`Tous`, 'ach.fDone':`Débloqués`, 'ach.fTodo':`À faire`, 'ach.none':`Aucun succès ne correspond.`
    },
    en: {
      'intro.name':`Before we start: what is your company called? It will also be the name of your game.`, 'intro.namePlaceholder':`Your company's name`,
      'intro.firstBakery':`Now, give your very first bakery a name!`,
      'ach.search':`Search an achievement`, 'ach.fAll':`All`, 'ach.fDone':`Unlocked`, 'ach.fTodo':`To do`, 'ach.none':`No achievement matches.`
    },
    es: {
      'intro.name':`Antes de empezar: ¿cómo se llama tu empresa? También será el nombre de tu partida.`, 'intro.namePlaceholder':`El nombre de tu empresa`,
      'intro.firstBakery':`Ahora, ¡ponle nombre a tu primerísima pastelería!`,
      'ach.search':`Buscar un logro`, 'ach.fAll':`Todos`, 'ach.fDone':`Desbloqueados`, 'ach.fTodo':`Por hacer`, 'ach.none':`Ningún logro coincide.`
    },
    pt: {
      'intro.name':`Antes de começar: como se chama a tua empresa? Será também o nome do teu jogo.`, 'intro.namePlaceholder':`O nome da tua empresa`,
      'intro.firstBakery':`Agora, dá um nome à tua primeiríssima pastelaria!`,
      'ach.search':`Procurar uma conquista`, 'ach.fAll':`Todas`, 'ach.fDone':`Desbloqueadas`, 'ach.fTodo':`Por fazer`, 'ach.none':`Nenhuma conquista corresponde.`
    },
    de: {
      'intro.name':`Bevor wir anfangen: Wie heißt dein Unternehmen? Das ist auch der Name deines Spiels.`, 'intro.namePlaceholder':`Name deines Unternehmens`,
      'intro.firstBakery':`Gib jetzt deiner allerersten Konditorei einen Namen!`,
      'ach.search':`Erfolg suchen`, 'ach.fAll':`Alle`, 'ach.fDone':`Freigeschaltet`, 'ach.fTodo':`Offen`, 'ach.none':`Kein Erfolg passt.`
    },
    ar: {
      'intro.name':`قبل أن نبدأ: ما اسم شركتك؟ سيكون أيضًا اسم لعبتك.`, 'intro.namePlaceholder':`اسم شركتك`,
      'intro.firstBakery':`الآن، أعطِ أول مخبز لك اسمًا!`,
      'ach.search':`ابحث عن إنجاز`, 'ach.fAll':`الكل`, 'ach.fDone':`المفتوحة`, 'ach.fTodo':`المتبقية`, 'ach.none':`لا يوجد إنجاز مطابق.`
    },
    zh: {
      'intro.name':`开始之前：你的公司叫什么名字？它也会是你这局游戏的名字。`, 'intro.namePlaceholder':`你的公司名称`,
      'intro.firstBakery':`现在，给你的第一家甜品店起个名字吧！`,
      'ach.search':`搜索成就`, 'ach.fAll':`全部`, 'ach.fDone':`已解锁`, 'ach.fTodo':`未完成`, 'ach.none':`没有匹配的成就。`
    },
    ja: {
      'intro.name':`始める前に：会社の名前は？それがこのゲームの名前にもなります。`, 'intro.namePlaceholder':`会社の名前`,
      'intro.firstBakery':`では、最初のお店に名前を付けましょう！`,
      'ach.search':`実績を検索`, 'ach.fAll':`すべて`, 'ach.fDone':`解除済み`, 'ach.fTodo':`未達成`, 'ach.none':`一致する実績がありません。`
    },
    ko: {
      'intro.name':`시작하기 전에: 회사 이름이 뭐예요? 이 게임의 이름도 됩니다.`, 'intro.namePlaceholder':`회사 이름`,
      'intro.firstBakery':`이제 첫 번째 제과점의 이름을 지어 주세요!`,
      'ach.search':`업적 검색`, 'ach.fAll':`전체`, 'ach.fDone':`해제됨`, 'ach.fTodo':`남은 것`, 'ach.none':`맞는 업적이 없어요.`
    },
    ru: {
      'intro.name':`Прежде чем начать: как называется твоя компания? Это будет и название твоей игры.`, 'intro.namePlaceholder':`Название компании`,
      'intro.firstBakery':`А теперь дай название своей самой первой кондитерской!`,
      'ach.search':`Найти достижение`, 'ach.fAll':`Все`, 'ach.fDone':`Открытые`, 'ach.fTodo':`Осталось`, 'ach.none':`Ничего не найдено.`
    }
  };
  Object.keys(v).forEach(function(l) { Object.assign(LANGS[l], v[l]); });
})();
