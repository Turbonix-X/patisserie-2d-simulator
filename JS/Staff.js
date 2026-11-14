/* ============================================
   PATISSERIE 2D SIMULATOR - L'EQUIPE
   Tetes, recherche, candidats et reglages de
   chaque metier
   ============================================ */

// ============ LES TETES ============
function nameHash(str) {
  var h = 0;
  for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

// Le haut du corps prend la couleur du metier
var EMP_SHIRT = { versatile:'#6A4C93', novice:'#A1887F', collector:'#7B9B3E', baker:'#F4EFE6', seller:'#C62842', manager:'#37474F', maitre:'#26262B', carrier:'#1E78C8', chef:'#FFFFFF', buyer:'#3F8F2B' };

function shadeHex(hex, amt) {
  var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  function ch(c) { return Math.max(0, Math.min(255, Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt)))); }
  return '#' + ((1 << 24) | (ch(r) << 16) | (ch(g) << 8) | ch(b)).toString(16).slice(1);
}

function empAvatar(type, name, gender) {
  var h = nameHash(String(name || ''));
  var female = (gender || (EMP_TYPES.some(function(et) { return et.id === name; }) ? 'm' : empGender(name))) === 'f';
  var skin = ['#FFDCC2', '#F3C59B', '#E0AC7E', '#C68650', '#8D5A33', '#5C3A21'][h % 6];
  var shade = shadeHex(skin, -0.16), light = shadeHex(skin, 0.22), deep = shadeHex(skin, -0.3);
  var hair = ['#2B1B12', '#5A3418', '#8A5A2B', '#C9A15A', '#A33A1E', '#3B3B3B', '#E8DFC8'][(h >>> 3) % 7];
  var hairLight = shadeHex(hair, 0.35), hairDark = shadeHex(hair, -0.3);
  // Femmes : cheveux longs, boucles ou chignon. Hommes : courts, boucles ou tres courts, parfois barbe ou moustache.
  var style = female ? [1, 2, 3, 5, 6][(h >>> 6) % 5] : [0, 2, 4, 7][(h >>> 6) % 4];
  var beard = !female && (h >>> 9) % 4 === 0;
  var stache = !female && !beard && (h >>> 9) % 4 === 1;
  var eye = ['#5B3A1E', '#2F5F8A', '#3E7A3E', '#4A3626'][(h >>> 11) % 4];
  var shirt = EMP_SHIRT[type] || '#9E9E9E';
  var lightShirt = shirt === '#FFFFFF' || shirt === '#F4EFE6';
  var s = '<svg class="emp-face" viewBox="0 0 40 40" aria-hidden="true">';
  // Derriere la tete : cheveux longs ou chignon
  if (style === 1) s += '<path d="M8.300 22C7.800 11 13 7.200 20 7.200S32.200 11 31.700 22c.300 6-1 10.500-3.200 12.500V21H11.500v13.500C9.300 32.500 8 28 8.300 22z" fill="' + hair + '"/><path d="M9.500 24c.2 4 1 7 2.500 9" stroke="' + hairDark + '" stroke-width=".8" fill="none" opacity=".6"/>';
  if (style === 5) s += '<path d="M9 24C8 12 13 7.500 20 7.500S32 12 31 24c-.3 4-1.300 7-3 8.500-1.500.5-3 .2-4-1V19H16v12.500c-1 1.200-2.500 1.500-4 1C10.300 31 9.300 28 9 24z" fill="' + hair + '"/>';
  if (style === 6) s += '<path d="M29.500 12c5 1 8 5 6.500 11-.8 3-2.500 5-4.500 6 1-3 1-6-.5-9z" fill="' + hair + '"/><path d="M33 14c1.200 3 1 6-.4 9" stroke="' + hairLight + '" stroke-width=".7" fill="none" opacity=".6"/><circle cx="30" cy="11.500" r="1.400" fill="#E91E63"/>';
  if (style === 3) s += '<circle cx="20" cy="7.300" r="4.200" fill="' + hair + '"/><path d="M17.500 6.200c1.300-1 3.200-1 4.600 0" stroke="' + hairLight + '" stroke-width=".8" fill="none"/>';
  // Cou, ombre sous le menton, epaules et col
  s += '<path d="M16.200 26.500h7.600v6h-7.600z" fill="' + skin + '"/><path d="M16.200 28.200c2.500 1.800 5.100 1.800 7.600 0v-1.700h-7.600z" fill="' + deep + '" opacity=".45"/>';
  s += '<path d="M4.500 40c0-7 6-10 15.500-10S35.500 33 35.500 40z" fill="' + shirt + '"' + (lightShirt ? ' stroke="#D8D0C5" stroke-width=".8"' : '') + '/>';
  s += '<path d="M4.500 40c0-3 1.200-5.200 3.200-6.800 2.600 1.200 5.200 1.800 12.300 1.800s9.700-.6 12.300-1.800c2 1.600 3.200 3.800 3.200 6.800z" fill="#000" opacity=".1"/>';
  s += '<path d="M15.800 30.500l4.200 4 4.200-4" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="1.100" stroke-linejoin="round"/><path d="M20 34.500v5.500" stroke="rgba(0,0,0,.14)" stroke-width=".8"/>';
  if (!female && type !== 'novice') s += '<circle cx="20" cy="36.800" r=".6" fill="rgba(0,0,0,.25)"/><circle cx="20" cy="39" r=".6" fill="rgba(0,0,0,.25)"/>';
  // Oreilles
  s += '<ellipse cx="10.700" cy="21" rx="1.800" ry="2.700" fill="' + skin + '"/><ellipse cx="29.300" cy="21" rx="1.800" ry="2.700" fill="' + skin + '"/>';
  s += '<path d="M10.200 20c.7.2 1 1 .6 2.300M29.800 20c-.7.2-1 1-.6 2.300" stroke="' + shade + '" stroke-width=".7" fill="none" stroke-linecap="round"/>';
  if (female && (h >>> 13) % 2 === 0) s += '<circle cx="10.700" cy="23.600" r=".9" fill="#FFD54F"/><circle cx="29.300" cy="23.600" r=".9" fill="#FFD54F"/>';
  // Visage : une machoire plus fine, des ombres et des reflets
  s += '<path d="M11 17.800c0-6.300 4-9.800 9-9.800s9 3.500 9 9.800c0 3-.7 5.700-2.100 7.900-1.500 2.400-4 3.800-6.900 3.800s-5.400-1.400-6.900-3.800C11.700 23.500 11 20.800 11 17.800z" fill="' + skin + '"/>';
  s += '<path d="M29 17.800c0 3-.7 5.700-2.100 7.900-1.500 2.400-4 3.800-6.900 3.800 2.500-.6 4.600-2.200 5.800-4.800 1.100-2.400 1.700-5.600 1.400-8.700z" fill="' + shade + '" opacity=".55"/>';
  s += '<ellipse cx="17.500" cy="13" rx="3.600" ry="2" fill="' + light + '" opacity=".35"/>';
  // Cheveux de devant, avec des meches et un peu d'ombre sur le front
  if (style === 2) {
    [11.500, 14.500, 17.500, 20.500, 23.500, 26.500, 28.500].forEach(function(x, i) { s += '<circle cx="' + x + '" cy="' + (i === 0 || i === 6 ? 15 : 11.300) + '" r="3.300" fill="' + hair + '"/>'; });
    [13, 18.500, 24].forEach(function(x) { s += '<path d="M' + (x - 1.200) + ' 10.600q1.200-1.300 2.400 0" stroke="' + hairLight + '" stroke-width=".8" fill="none" stroke-linecap="round"/>'; });
  } else if (style === 5) {
    s += '<path d="M10.600 20C10 11.500 14.500 8.300 20 8.300S30 11.500 29.400 20c-1.200-4-3.500-6.800-6.500-8.200-3.500 3-8 4.500-12.300 8.200z" fill="' + hair + '"/><path d="M14 11.800c2.500-1.800 6-2.300 9.200-1.300" stroke="' + hairLight + '" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".7"/>';
  } else if (style === 6) {
    s += '<path d="M10.800 19C10.200 11 14.500 8.200 20 8.200S29.800 11 29.200 19c-1.500-3.800-4-5.800-6.600-6.200-3.200 1.700-8 2-11.800 6.200z" fill="' + hair + '"/><path d="M14 11.500c2.300-1.500 5.500-2 8.500-1.200" stroke="' + hairLight + '" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".7"/>';
  } else if (style === 7) {
    s += '<path d="M10.500 19C9.800 11 14 8 20 8s10.200 3 9.500 11c-.6-3-2-5-4-6.200-4 1.800-9.500 1.500-14.300 4.700 1-1.600 1-3 1.300-4.500C11.500 14 10.800 16 10.500 19z" fill="' + hair + '"/><path d="M16 9.500c2-.8 4.800-.8 7.500.2M13 13.500c3.500-.3 8-1.500 11-3.500" stroke="' + hairLight + '" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".7"/>';
  } else if (style === 4) {
    s += '<path d="M11.100 16.800C11.400 11.300 15 8.800 20 8.800s8.600 2.500 8.900 8c-2-2.600-5-3.600-8.900-3.600S13.100 14.200 11.100 16.800z" fill="' + hair + '"/><path d="M14 11.500c2-1.200 4.500-1.600 7-1.200" stroke="' + hairLight + '" stroke-width=".8" fill="none" stroke-linecap="round" opacity=".7"/>';
  } else {
    s += '<path d="M10.500 19C9.900 11.300 14 8.200 20 8.200s10.100 3.100 9.500 10.800c-.9-3.100-2.500-5.100-4.600-5.600-2.600 1.500-6.600 2-11.100 1.500-1.600 1-2.700 2.400-3.300 4.100z" fill="' + hair + '"/>';
    s += '<path d="M13.500 11c2.200-1.700 5.500-2.200 8.500-1.300" stroke="' + hairLight + '" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".75"/><path d="M12 14.500c3 1.200 8 1.300 12.500-.4" stroke="' + hairDark + '" stroke-width=".8" fill="none" opacity=".5"/>';
  }
  // Sourcils effiles
  var bw = female ? .9 : 1.3;
  s += '<path d="M13.300 17.200c1.400-1.200 3.200-1.400 4.800-.5-.200.400-.500.700-.9.700-1.300-.4-2.600-.3-3.900.6z" fill="' + hairDark + '"/><path d="M22 16.700c1.600-.9 3.400-.7 4.800.5-1.300-.9-2.600-1-3.900-.6-.4 0-.7-.3-.9-.7z" fill="' + hairDark + '"/>';
  // Yeux en amande, paupieres, iris, reflets
  s += '<path d="M13.600 19.800c1.200-1.700 3.400-1.700 4.800 0-1.400 1.300-3.600 1.300-4.800 0z" fill="#fff"/><path d="M21.600 19.800c1.400-1.700 3.600-1.700 4.800 0-1.200 1.300-3.400 1.300-4.800 0z" fill="#fff"/>';
  s += '<circle cx="16" cy="19.800" r="1.250" fill="' + eye + '"/><circle cx="24" cy="19.800" r="1.250" fill="' + eye + '"/>';
  s += '<circle cx="16" cy="19.800" r=".6" fill="#111"/><circle cx="24" cy="19.800" r=".6" fill="#111"/><circle cx="16.400" cy="19.350" r=".35" fill="#fff"/><circle cx="24.400" cy="19.350" r=".35" fill="#fff"/>';
  s += '<path d="M13.400 19.900c1.500-2.200 3.800-2.200 5.200 0M21.400 19.900c1.400-2.200 3.700-2.200 5.200 0" stroke="' + deep + '" stroke-width=".7" fill="none" stroke-linecap="round"/>';
  if (female) s += '<path d="M13.300 19.600l-.9-.8M14.400 18.800l-.5-1M25.600 18.800l.5-1M26.700 19.600l.9-.8" stroke="#2B1B12" stroke-width=".6" stroke-linecap="round"/><path d="M14 21.200c1 .6 2.300.6 3.200 0M22.800 21.200c1 .6 2.300.6 3.200 0" stroke="' + shade + '" stroke-width=".5" fill="none" opacity=".7"/>';
  // Nez : arete, ombre et narines
  s += '<path d="M19.600 19.800c-.1 1.700-.4 3-.9 3.800.6.5 1.500.7 2.600.1" fill="none" stroke="' + shade + '" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.600 23.700c.4.300.8.3 1.200.1M20.800 23.800c.4.200.8.100 1.100-.1" stroke="' + deep + '" stroke-width=".6" fill="none" stroke-linecap="round"/>';
  s += '<ellipse cx="14" cy="23.200" rx="2" ry="1.100" fill="#E57373" opacity="' + (female ? '.32' : '.2') + '"/><ellipse cx="26" cy="23.200" rx="2" ry="1.100" fill="#E57373" opacity="' + (female ? '.32' : '.2') + '"/>';
  if ((h >>> 15) % 4 === 0) s += '<g fill="' + deep + '" opacity=".55"><circle cx="14.500" cy="22.200" r=".45"/><circle cx="16" cy="23" r=".45"/><circle cx="13.600" cy="23.600" r=".45"/><circle cx="25.500" cy="22.200" r=".45"/><circle cx="24" cy="23" r=".45"/><circle cx="26.400" cy="23.600" r=".45"/></g>';
  if (beard) s += '<path d="M11.100 20.500c.4 5.500 4.300 9 8.900 9s8.500-3.500 8.900-9c-1 3.200-2.700 4.700-4.300 5-1.100-.8-2.800-1.100-4.600-1.100s-3.500.3-4.600 1.100c-1.600-.3-3.300-1.800-4.300-5z" fill="' + hair + '" opacity=".92"/><path d="M14 27c1.800 1.700 3.800 2.400 6 2.400" stroke="' + hairLight + '" stroke-width=".6" fill="none" opacity=".5"/>';
  if (stache) s += '<path d="M15.400 24.600c1.400-1.300 3.200-1.200 4.600 0 1.400-1.200 3.200-1.300 4.600 0-1.400.5-3.200.9-4.600.1-1.400.8-3.200.4-4.600-.1z" fill="' + hairDark + '"/>';
  // Bouche : levres haute et basse, reflet
  var lipTop = female ? '#B83A5C' : '#A5584A', lipLow = female ? '#D8607F' : '#BE6D5C';
  s += '<path d="M17 25.700c1.200-1 2.300-.9 3-.3.700-.6 1.800-.7 3 .3-1.500.5-4.500.5-6 0z" fill="' + lipTop + '"/><path d="M17.300 25.800c1.500 2 4.500 2 5.800 0-1.700.6-4.100.6-5.800 0z" fill="' + lipLow + '"/>';
  if (female) s += '<ellipse cx="20" cy="26.900" rx="1" ry=".35" fill="#fff" opacity=".45"/>';
  // Ce qui distingue chaque metier
  if (type === 'collector') s += '<ellipse cx="20" cy="12.500" rx="15" ry="3.500" fill="#E8C468" stroke="#B8922E" stroke-width=".8"/><path d="M12 12c0-6 3-8 8-8s8 2 8 8z" fill="#F2D57E" stroke="#B8922E" stroke-width=".8"/><path d="M12 11h16" stroke="#6DB54F" stroke-width="2"/>';
  else if (type === 'baker') s += '<path d="M11 14c-3-3-1-8 3-7 1-3 11-3 12 0 4-1 6 4 3 7z" fill="#fff" stroke="#D8D0C5"/><circle cx="26" cy="19" r="1.300" fill="#fff"/><circle cx="13" cy="26" r="1.200" fill="#fff"/>';
  else if (type === 'seller') s += '<path d="M10 13c1-6 5-8 10-8s9 2 10 8z" fill="#D81B3C"/><path d="M8 13h24c1 1 0 2-1 2H9c-1 0-2-1-1-2z" fill="#A31330"/>';
  else if (type === 'manager') s += '<rect x="12.500" y="17.800" width="7" height="4.600" rx="1.500" fill="rgba(180,220,255,.12)" stroke="#222" stroke-width="1.100"/><rect x="20.500" y="17.800" width="7" height="4.600" rx="1.500" fill="rgba(180,220,255,.12)" stroke="#222" stroke-width="1.100"/><path d="M19.500 19.800h1" stroke="#222" stroke-width="1.100"/><path d="M18 33l2 6 2-6-2-1.500z" fill="#1C74C4"/>';
  else if (type === 'maitre') s += (female ? '' : '<path d="M15.500 24.700c1.600-1.600 3.200-1.200 4.500 0 1.300-1.200 2.900-1.600 4.500 0-1.600.800-3 .800-4.500 0-1.500.800-2.900.800-4.500 0z" fill="#2C1B10"/>') + '<path d="M14 33l6 2 6-2v5l-6-2-6 2z" fill="#222"/>';
  else if (type === 'carrier') s += '<path d="M10 14c0-6 5-9 10-9s10 3 10 9z" fill="#1E88E5"/><path d="M6 14h28l-3 2.500H9z" fill="#125EA8"/><path d="M17 8h6v3h-6z" fill="#FFD54F"/>';
  else if (type === 'chef') s += '<path d="M11 14c-5-2-5-9 0-10 1-4 17-4 18 0 5 1 5 8 0 10z" fill="#fff" stroke="#D8D0C5"/><path d="M11 12h18v4H11z" fill="#fff" stroke="#D8D0C5"/><path d="M16 5v7M20 4v8M24 5v7" stroke="#E0D9CE" stroke-width="1"/>';
  else if (type === 'buyer') s += '<circle cx="16" cy="19.800" r="3" fill="rgba(180,220,255,.12)" stroke="#6D4C41" stroke-width="1.100"/><circle cx="24" cy="19.800" r="3" fill="rgba(180,220,255,.12)" stroke="#6D4C41" stroke-width="1.100"/><path d="M19 19.800h2" stroke="#6D4C41" stroke-width="1.100"/><path d="M12 12c1-5 4-7 8-7s7 2 8 7z" fill="#3F8F2B"/><path d="M28 28h7v9h-7z" fill="#fff" stroke="#6D4C41"/><path d="M29.500 31h4M29.500 33.500h4" stroke="#6D4C41" stroke-width=".8"/>';
  else if (type === 'versatile') s += '<path d="M10 13c1-6 5-8 10-8s9 2 10 8z" fill="#6A4C93"/><path d="M8 13h24c1 1 0 2-1 2H9c-1 0-2-1-1-2z" fill="#4B3470"/><circle cx="20" cy="9" r="1.500" fill="#FFD54F"/>';
  else if (type === 'novice') s += '<path d="M20 10c-2-4 0-6 2-6" fill="none" stroke="' + hair + '" stroke-width="2.400" stroke-linecap="round"/>';
  return s + '</svg>';
}

// Le titre d'un employe : au feminin pour les femmes (cueilleuse, boulangere, patissiere...)
function empTitle(type, name) {
  if (name && !EMP_TYPES.some(function(et) { return et.id === name; }) && empGender(name) === 'f') {
    var k = 'emp.' + type + '.f';
    if (LANGS[currentLang] && LANGS[currentLang][k]) return t(k);
  }
  return t('emp.' + type);
}

// Le niveau : les apprentis n'en ont pas, et le niveau or a son badge a lui
function levelBadge(x) {
  if (x.type === 'novice') return '';
  var L = Math.max(1, Math.min(EMP_GOLD_LVL, x.level || 1));
  if (L >= EMP_GOLD_LVL) return '<span class="emp-skill-badge gold" title="' + escH(t('emp.goldHelp')) + '">★ ' + t('emp.levelGold') + '</span>';
  if (x.type === 'versatile') return '<span class="emp-skill-badge">' + t('emp.ownLevel', { v: L }) + ' / ' + EMP_MAX_LVL + '</span>';
  return '<span class="emp-skill-badge">' + t('emp.levelTxt', { v: L }) + ' / ' + EMP_MAX_LVL + '</span>';
}

// Perte du cueilleur, specialiste, metiers du touche-a-tout
function empExtraBadges(x) {
  var h = '';
  if (x.type === 'collector') h += '<span class="emp-loss-badge" title="' + escH(t('emp.lossHelp')) + '">' + t('emp.lossShort', { v: x.lossPct === undefined ? 10 : x.lossPct }) + '</span>';
  if (x.specialty) h += '<span class="emp-spec-badge" title="' + escH(t('emp.specialistHelp')) + '">' + getIngEmoji(x.specialty) + ' ' + t('emp.specialist') + '</span>';
  if (x.type === 'versatile') (x.jobs || []).forEach(function(j) { h += '<span class="emp-job-chip">' + t('emp.' + j.type) + ' ' + j.level + '</span>'; });
  return h;
}

// ============ L'ONGLET ============
function renderEmployees() {
  var el = document.getElementById('main-panel');
  if (!el) return;
  var h = '<div class="panel-head"><h2>' + t('emp.title') + '</h2></div>';
  if (G.creative) h += '<p class="order-butler">' + t('emp.creative') + '</p>';
  var head = h;
  h = '';
  var sal = totalSalary();
  if (sal > 0) h += '<div class="emp-total-salary">' + t('emp.totalSalary', { v: fmtMoney(sal * 3600) }) + '</div>';
  var open = EMP_TYPES.filter(function(et) { return empTypeOpen(et) && !et.hidden; });
  if (open.length === 0) {
    h += '<p class="empty-note">' + t('emp.lockedAll') + '</p>';
  } else {
    // Chercher un ou deux metiers : ca prend du temps, et ca ne marche pas toujours
    var sel = (ui.searchSel || []).filter(function(id) { return !searchFor(id); });
    ui.searchSel = sel;
    h += '<div class="recruit-section"><h4>' + t('emp.search') + '</h4><div class="recruit-row">';
    open.forEach(function(et) {
      var job = searchFor(et.id);
      if (job) {
        h += '<button class="btn btn-small search-going" disabled>' + empAvatar(et.id, et.id) + t('emp.' + et.id) + ' · ' + fmtTime(Math.max(0, (job.doneAt - Date.now()) / 1000)) + '</button>';
      } else {
        h += '<button class="btn btn-small' + (sel.indexOf(et.id) >= 0 ? ' btn-primary' : '') + '" aria-pressed="' + (sel.indexOf(et.id) >= 0) + '" onclick="toggleSearchSel(\'' + et.id + '\')" title="' + escH(t('emp.desc.' + et.id)) + '">' + empAvatar(et.id, et.id) + t('emp.' + et.id) + '</button>';
      }
    });
    h += '</div><button class="btn btn-small btn-primary search-go" onclick="doSearchSelected()"' + (sel.length ? '' : ' disabled') + '>' + t('emp.searchGo', { n: sel.map(function(x) { return t('emp.' + x); }).join(' + ') || '…' }) + '</button>';
    h += '<p class="hint-note">' + t('emp.searchHint', { v: Math.round(searchChance() * 100) }) + ' ' + t('emp.searchTwoHint') + '</p></div>';
  }
  // A partir du niveau 20, le tableau de bord est tout en haut, avec la recherche dedans
  h = head + (G.level >= 20 ? empDashboardHTML(h) : h);
  if (G.applicants && G.applicants.length > 0) {
    h += '<div class="applicants-section"><h4>' + t('emp.applicants') + ' (' + G.applicants.length + ')</h4>';
    G.applicants.forEach(function(app) {
      var remaining = Math.max(0, Math.ceil((app.expiresAt - Date.now()) / 1000));
      var lv = app.level || 1;
      h += '<div class="applicant-card' + (lv >= EMP_GOLD_LVL ? ' gold' : lv >= 3 ? ' rare' : '') + '" role="button" tabindex="0" onclick="if(!event.target.closest(\'button\'))showApplicantModal(' + app.id + ')" title="' + escH(t('emp.desc.' + app.type)) + '">' + empAvatar(app.type, app.name);
      h += '<span class="app-name">' + escH(app.name) + '</span>';
      h += '<span class="app-type">' + empTitle(app.type, app.name) + '</span>';
      h += levelBadge(app) + empExtraBadges(app);
      h += '<span class="app-skill">' + t('emp.skill', { v: app.skill }) + '</span>';
      h += '<span class="app-cost">' + fmtMoney(app.hireCost) + '</span>';
      h += '<span class="app-timer">' + fmtTime(remaining) + '</span>';
      h += '<button class="btn btn-small btn-primary" onclick="doAcceptApplicant(' + app.id + ')"' + (G.money < app.hireCost ? ' disabled' : '') + '>' + t('emp.accept') + '</button>';
      h += '<button class="btn btn-small btn-danger" onclick="doRejectApplicant(' + app.id + ')">' + t('emp.reject') + '</button>';
      h += '</div>';
    });
    h += '</div>';
  } else if (open.length > 0) {
    h += '<p class="empty-note">' + t(G.level < 10 ? 'emp.onlySearch' : 'emp.noApplicants') + '</p>';
  }
  if (G.employees.length > 0) {
    var groups = {};
    G.employees.forEach(function(emp) { (groups[emp.type] = groups[emp.type] || []).push(emp); });
    empGroupOrder().forEach(function(type) {
      var list = groups[type];
      if (!list) return;
      h += '<section class="emp-group" data-type="' + type + '"><div class="emp-group-head">';
      h += '<span class="emp-group-handle" title="' + escH(t('emp.groupDrag')) + '" aria-hidden="true">⠿</span>' + empAvatar(type, type);
      h += '<b>' + t('emp.' + type) + '</b><span class="emp-group-count">' + list.length + '</span>';
      h += '<button class="btn-tiny" onclick="nudgeEmpGroup(\'' + type + '\',-1)" title="' + escH(t('emp.groupUp')) + '" aria-label="' + escH(t('emp.groupUp')) + '">↑</button>';
      h += '<button class="btn-tiny" onclick="nudgeEmpGroup(\'' + type + '\',1)" title="' + escH(t('emp.groupDown')) + '" aria-label="' + escH(t('emp.groupDown')) + '">↓</button></div>';
      h += '<div class="emp-list">';
      list.forEach(function(emp) {
        var moraleColor = emp.morale > 60 ? 'morale-good' : (emp.morale > 30 ? 'morale-mid' : 'morale-bad');
        var training = empTraining(emp), switching = empSwitching(emp), moving = hasJob(emp, 'collector') && collectorMoving(emp);
        var status = training ? t('emp.training', { v: fmtTime((emp.trainingUntil - Date.now()) / 1000) }) : emp.paused ? t('emp.paused') : switching ? t('emp.switching', { t: fmtTime((emp.switchUntil - Date.now()) / 1000) }) : moving ? t('emp.moving', { n: t('i.' + emp.assignedIng), t: fmtTime((emp.moveUntil - Date.now()) / 1000) }) : t('emp.' + emp.status);
        var statusCls = training || emp.paused || switching || moving ? 'status-warn' : emp.status === 'working' ? 'status-good' : (emp.status === 'striking' ? 'status-bad' : 'status-warn');
        h += '<div class="emp-card" role="button" tabindex="0" onclick="showEmpInfoModal(' + emp.id + ')" title="' + escH(t('emp.desc.' + emp.type)) + '">';
        h += '<div class="emp-header">' + empAvatar(emp.type, emp.name);
        h += '<span class="emp-name">' + escH(emp.name) + '</span>';
        h += '<span class="emp-type">' + empTitle(emp.type, emp.name) + '</span>';
        h += '<span class="emp-status ' + statusCls + '">' + status + '</span>';
        h += levelBadge(emp) + empExtraBadges(emp);
        h += '<span class="app-skill">' + t('emp.skill', { v: emp.skill }) + '</span>';
        h += '</div>';
        h += '<div class="emp-morale-bar" title="' + escH(t('emp.morale')) + ' : ' + Math.floor(emp.morale) + ' / ' + maxMorale(emp) + ' %"><div class="emp-morale-fill ' + moraleColor + '" style="width:' + Math.min(100, Math.floor(emp.morale)) + '%"></div></div>';
        h += '</div>';
      });
      h += '</div></section>';
    });
  }
  setHTML(el, h);
}

// Choisir un ou deux metiers a chercher, puis lancer la recherche
function toggleSearchSel(typeId) {
  var sel = ui.searchSel || [];
  var i = sel.indexOf(typeId);
  if (i >= 0) sel.splice(i, 1);
  else { if (sel.length >= 2) sel.shift(); sel.push(typeId); }
  ui.searchSel = sel;
  renderEmployees();
}
function doSearchSelected() {
  var sel = (ui.searchSel || []).slice();
  if (startSearch(sel)) {
    toast(t('emp.searchStarted', { n: sel.map(function(x) { return t('emp.' + x); }).join(' + ') }));
    ui.searchSel = [];
    renderEmployees();
  }
}

// Le tableau de bord, en haut de l'onglet a partir du niveau 20
function empDashboardHTML(extra) {
  if (!G.explained.dashboard && typeof bobTell === 'function') { G.explained.dashboard = true; bobTell(t('unl.dashboard')); }
  var d = empDashboard();
  var h = '<section class="emp-dash"><h4>' + t('dash.title') + '</h4><div class="dash-tiles">';
  h += '<div class="dash-tile dash-total"><b>' + d.total + '</b><span>' + t('dash.total') + '</span></div>';
  empGroupOrder().forEach(function(type) {
    if (!d.byType[type]) return;
    h += '<div class="dash-tile">' + empAvatar(type, type) + '<b>' + d.byType[type] + '</b><span>' + t('emp.' + type) + '</span></div>';
  });
  h += '</div><div class="dash-states"><span class="dash-good">' + t('dash.working') + ' : ' + d.working + '</span>';
  if (d.paused) h += '<span class="dash-warn">' + t('dash.paused') + ' : ' + d.paused + '</span>';
  if (d.striking) h += '<span class="dash-bad">' + t('dash.striking') + ' : ' + d.striking + '</span>';
  var road = shipmentsOnRoad();
  if (road) h += '<span>' + t('dash.transit', { v: road }) + '</span>';
  h += '</div><h5>' + t('dash.collectors') + '</h5>';
  var ids = Object.keys(d.collectors);
  if (ids.length === 0) h += '<p class="empty-note">' + t('dash.noCollector') + '</p>';
  else {
    h += '<div class="dash-coll">';
    ING.forEach(function(ing) {
      if (!d.collectors[ing.id]) return;
      h += '<span class="dash-coll-item">' + ing.e + ' ' + t('i.' + ing.id) + ' <b>×' + d.collectors[ing.id] + '</b> <small>' + t('ing.autoRate', { v: fmt(autoRate(ing.id)) }) + '</small></span>';
    });
    h += '</div>';
  }
  return h + (extra || '') + '</section>';
}

function nudgeEmpGroup(type, dir) {
  var order = empGroupOrder();
  var present = order.filter(function(id) { return G.employees.some(function(e) { return e.type === id; }); });
  var i = present.indexOf(type), j = i + dir;
  if (i < 0 || j < 0 || j >= present.length) return;
  moveEmpGroup(type, dir < 0 ? present[j] : (present[j + 1] || null));
  save();
  renderEmployees();
}

// Glisser un metier pour le mettre plus haut ou plus bas, a la souris comme au doigt
(function() {
  var drag = null;
  document.addEventListener('pointerdown', function(e) {
    var handle = e.target.closest && e.target.closest('.emp-group-head');
    if (!handle || e.target.closest('button')) return;
    var group = handle.closest('.emp-group');
    drag = { type: group.getAttribute('data-type'), y: e.clientY, moved: false };
    try { handle.setPointerCapture(e.pointerId); } catch (err) { /* pas grave */ }
    e.preventDefault();
  });
  function targetAt(y) {
    var groups = document.querySelectorAll('.emp-group');
    for (var i = 0; i < groups.length; i++) {
      var r = groups[i].getBoundingClientRect();
      if (y < r.top + r.height / 2) return groups[i].getAttribute('data-type');
    }
    return null;
  }
  document.addEventListener('pointermove', function(e) {
    if (!drag) return;
    if (Math.abs(e.clientY - drag.y) > 6) drag.moved = true;
    if (!drag.moved) return;
    document.querySelectorAll('.emp-group').forEach(function(g) {
      g.classList.toggle('dragging', g.getAttribute('data-type') === drag.type);
      g.classList.toggle('drop-before', g.getAttribute('data-type') === targetAt(e.clientY) && g.getAttribute('data-type') !== drag.type);
    });
  });
  function end(e) {
    if (!drag) return;
    var d = drag;
    drag = null;
    document.querySelectorAll('.emp-group').forEach(function(g) { g.classList.remove('dragging', 'drop-before'); });
    if (!d.moved || e.type !== 'pointerup') return;
    var before = targetAt(e.clientY);
    if (before === d.type) return;
    moveEmpGroup(d.type, before);
    save();
    renderEmployees();
  }
  document.addEventListener('pointerup', end);
  document.addEventListener('pointercancel', end);
})();

function doSearchEmployee(typeId) {
  if (startSearch(typeId)) {
    toast(t('emp.searchStarted', { n: t('emp.' + typeId) }));
    renderEmployees();
  }
}

// La fiche d'une candidature : le metier, son niveau, et ce que ca veut dire
function showApplicantModal(appId) {
  var app = null;
  G.applicants.forEach(function(a) { if (a.id === appId) app = a; });
  if (!app) return;
  var lv = app.level || 1;
  var h = '<div class="emp-sheet-head">' + empAvatar(app.type, app.name) + '<div><h2>' + escH(app.name) + '</h2><p>' + empTitle(app.type, app.name) + '</p></div></div>';
  h += '<p class="set-help">' + t('emp.desc.' + app.type) + '</p>';
  h += '<div class="emp-facts">' + levelBadge(app) + '<span>' + t('emp.skill', { v: app.skill }) + '</span><span>' + fmtMoney(app.hireCost) + '</span>' + empExtraBadges(app) + '</div>';
  if (app.type !== 'novice') h += '<p class="set-help">' + t(lv >= EMP_GOLD_LVL ? 'emp.goldHelp' : 'emp.levelHelp', { v: lv, x: fmt(lvlMultOf(lv)) }) + '</p>';
  else h += '<p class="set-help">' + t('emp.noviceNoLevel') + '</p>';
  if (app.type === 'collector') h += '<p class="set-help">' + t('emp.lossInfo', { v: app.lossPct === undefined ? 10 : app.lossPct }) + '</p>';
  if (app.specialty) h += '<p class="set-help">' + t('emp.specialistInfo', { n: t('i.' + app.specialty) }) + '</p>';
  if (app.type === 'versatile') h += '<p class="set-help">' + t('emp.versatileInfo') + '</p>';
  h += '<div class="modal-btns"><button class="btn btn-primary" onclick="hideModal();doAcceptApplicant(' + app.id + ')"' + (G.money < app.hireCost ? ' disabled' : '') + '>' + t('emp.accept') + '</button>';
  h += '<button class="btn btn-danger" onclick="hideModal();doRejectApplicant(' + app.id + ')">' + t('emp.reject') + '</button>';
  h += '<button class="btn" onclick="hideModal()">' + t('common.close') + '</button></div>';
  showModal(h, 'modal-emp');
}

function doAcceptApplicant(appId) {
  if (acceptApplicant(appId)) {
    toast(t('emp.hired'));
    renderEmployees();
    renderHeader();
    renderTabs();
  }
}

function doRejectApplicant(appId) {
  rejectApplicant(appId);
  renderEmployees();
  renderTabs();
}

// ============ LA FICHE D'UN EMPLOYE ============
function showEmpInfoModal(empId) {
  var emp = findEmp(empId);
  if (!emp) return;
  var h = '<div class="emp-sheet-head">' + empAvatar(emp.type, emp.name) + '<div><h2>' + escH(emp.name) + '</h2><p>' + empTitle(emp.type, emp.name) + '</p></div></div>';
  h += '<p class="set-help">' + t('emp.desc.' + emp.type) + '</p>';
  h += '<div class="emp-facts">' + levelBadge(emp) + '<span>' + t('emp.skill', { v: emp.skill }) + '</span><span>' + t('emp.morale') + ' : ' + Math.floor(emp.morale) + ' / ' + maxMorale(emp) + ' %</span><span>' + t('emp.salary', { v: fmtMoney(getEmpSalary(emp) * 3600) }) + '</span>' + empExtraBadges(emp) + '</div>';
  if (emp.type !== 'novice' && emp.level >= EMP_GOLD_LVL) h += '<p class="set-help">' + t('emp.goldHelp') + '</p>';
  if (empTraining(emp)) h += '<p class="warning js-count" data-key="emp.training" data-p="v" data-until="' + emp.trainingUntil + '">' + t('emp.training', { v: fmtTime((emp.trainingUntil - Date.now()) / 1000) }) + '</p>';
  if (emp.paused) h += '<p class="warning">' + t('emp.pauseHelp') + '</p>';
  // Les comptes a rebours se mettent a jour tout seuls (voir tickMoveLabels)
  if (hasJob(emp, 'collector') && collectorMoving(emp)) h += '<p class="warning js-move" data-emp="' + emp.id + '" data-until="' + emp.moveUntil + '" data-ing="' + emp.assignedIng + '">' + t('emp.moving', { n: t('i.' + emp.assignedIng), t: fmtTime((emp.moveUntil - Date.now()) / 1000) }) + '</p>';
  if (empSwitching(emp)) h += '<p class="warning js-switch" data-until="' + emp.switchUntil + '">' + t('emp.switching', { t: fmtTime((emp.switchUntil - Date.now()) / 1000) }) + '</p>';
  var config = empConfigHTML(emp);
  if (config) h += '<section class="set-card emp-config"><h3>' + t('emp.config') + '</h3>' + config + '</section>';
  // La paie : plus bas, moins motive. Trop bas, il demissionne.
  h += '<section class="set-card emp-config"><h3>' + t('emp.pay') + '</h3><label class="cfg-row">' + t('emp.payAdj') + '<select class="set-select" onchange="setEmpPay(' + emp.id + ',parseInt(this.value,10))">';
  PAY_STEPS.forEach(function(p) { h += '<option value="' + p + '"' + ((emp.payAdj || 0) === p ? ' selected' : '') + '>' + (p > 0 ? '+' : '') + p + ' %</option>'; });
  h += '</select></label><p class="set-help">' + t('emp.payHelp') + '</p></section>';
  h += '<div class="emp-actions">';
  if (emp.type !== 'novice') {
    if ((emp.level || 1) >= EMP_MAX_LVL) h += '<button class="btn" disabled>' + t('emp.trainMax') + '</button>';
    else h += '<button class="btn btn-primary" onclick="doTrainEmployee(' + emp.id + ')"' + (G.money < getTrainCost(emp) || empTraining(emp) ? ' disabled' : '') + '>' + t('emp.trainBtn', { v: fmtMoney(getTrainCost(emp)) }) + '</button>';
  }
  h += '<button class="btn" title="' + escH(t('emp.pauseHelp')) + '" onclick="toggleEmpPause(' + emp.id + ')">' + t(emp.paused ? 'emp.resume' : 'emp.pause') + '</button>';
  h += '<button class="btn" onclick="doGiveBonus(' + emp.id + ')">' + t('emp.bonus', { v: fmtMoney(getBonusCost(emp)) }) + '</button>';
  h += '<button class="btn btn-danger" onclick="confirmFire(' + emp.id + ')">' + t('emp.fire') + '</button></div>';
  h += '<div class="modal-btns"><button class="btn" onclick="hideModal()">' + t('common.close') + '</button></div>';
  showModal(h, 'modal-emp');
}

function setEmpPay(empId, adj) {
  var emp = findEmp(empId);
  if (!emp) return;
  var name = emp.name;
  var r = setPay(emp, adj);
  if (r === 'quit') { toast(t('emp.payQuit', { n: name })); hideModal(); renderEmployees(); return; }
  save();
  showEmpInfoModal(empId);
  renderEmployees();
}

// Le compte a rebours d'un cueilleur ou d'un touche-a-tout qui change de poste, mis a jour en direct dans sa fiche
function tickMoveLabels() {
  document.querySelectorAll('.js-count').forEach(function(el) {
    var left = (+el.getAttribute('data-until') - Date.now()) / 1000;
    if (left <= 0) { el.remove(); return; }
    var p = {}; p[el.getAttribute('data-p')] = fmtTime(left);
    el.textContent = t(el.getAttribute('data-key'), p);
  });
  document.querySelectorAll('.js-move').forEach(function(el) {
    var left = (+el.getAttribute('data-until') - Date.now()) / 1000;
    if (left <= 0) { el.remove(); return; }
    el.textContent = t('emp.moving', { n: t('i.' + el.getAttribute('data-ing')), t: fmtTime(left) });
  });
  document.querySelectorAll('.js-switch').forEach(function(el) {
    var left = (+el.getAttribute('data-until') - Date.now()) / 1000;
    if (left <= 0) { el.remove(); return; }
    el.textContent = t('emp.switching', { t: fmtTime(left) });
  });
}

function empConfigHTML(emp) {
  if (emp.type === 'versatile') return versatileConfig(emp);
  return jobConfigHTML(emp, emp.type);
}

function jobConfigHTML(emp, type) {
  if (type === 'collector') return collectorConfig(emp);
  if (type === 'seller') return sellerConfig(emp);
  if (type === 'chef') return chefConfig(emp);
  if (type === 'manager') return managerConfig(emp);
  if (type === 'carrier') return carrierConfig(emp);
  if (type === 'novice') return noviceConfig(emp);
  return '';
}

// Le touche-a-tout : sur quel metier il se concentre, et les reglages de chacun de ses metiers
function versatileConfig(emp) {
  var focus = emp.focus || 'all';
  var h = '<p class="set-help">' + t('emp.versatileHelp') + '</p><div class="segmented theme-scope">';
  h += '<button class="' + (focus === 'all' ? 'active' : '') + '" onclick="setEmpFocus(' + emp.id + ',\'all\')">' + t('emp.focusAll') + '</button>';
  (emp.jobs || []).forEach(function(j) {
    h += '<button class="' + (focus === j.type ? 'active' : '') + '" onclick="setEmpFocus(' + emp.id + ',\'' + j.type + '\')">' + t('emp.' + j.type) + ' ' + j.level + '</button>';
  });
  h += '</div><p class="set-help">' + t('emp.focusHelp') + '</p>';
  (emp.jobs || []).forEach(function(j) {
    var c = jobConfigHTML(emp, j.type);
    if (c) h += '<h4 class="cfg-sub">' + t('emp.' + j.type) + ' · ' + t('emp.levelTxt', { v: j.level }) + '</h4>' + c;
  });
  return h;
}
function setEmpFocus(empId, type) {
  var emp = findEmp(empId);
  if (emp && setFocus(emp, type)) { save(); showEmpInfoModal(empId); renderEmployees(); }
}

function collectorConfig(emp) {
  var h = '';
  if (emp.specialty) {
    h += '<p class="set-help">' + t('emp.specialistInfo', { n: t('i.' + emp.specialty) }) + '</p>';
  } else {
    h += '<label class="cfg-row">' + t('emp.assign') + '<select class="set-select" onchange="assignCollector(' + emp.id + ',this.value)">';
    ING.forEach(function(ing) {
      if (!ingUnlocked(ing)) return;
      h += '<option value="' + ing.id + '"' + (emp.assignedIng === ing.id ? ' selected' : '') + '>' + t('i.' + ing.id) + ' (' + fmtQty(autoRate(ing.id)) + '/s)</option>';
    });
    h += '</select></label><p class="set-help">' + t('emp.moveHelp') + '</p>';
  }
  h += '<p class="set-help">' + t('emp.lossInfo', { v: collectorLoss(emp) }) + '</p>';
  // Une limite : il ne cueille que s'il y en a moins de N, ou N par heure au plus
  var mode = emp.limitMode || 'none';
  h += '<label class="cfg-row">' + t('emp.limit') + '<select class="set-select" onchange="setCollectorLimit(' + emp.id + ',this.value,null)">';
  [['none', 'emp.limitNone'], ['below', 'emp.limitBelow'], ['hour', 'emp.limitHour']].forEach(function(o) {
    h += '<option value="' + o[0] + '"' + (mode === o[0] ? ' selected' : '') + '>' + t(o[1]) + '</option>';
  });
  h += '</select></label>';
  if (mode !== 'none') h += '<label class="cfg-row">N<input type="number" min="0" step="any" value="' + (emp.limitN || 0) + '" onchange="setCollectorLimit(' + emp.id + ',null,this.value)"></label><p class="set-help">' + t(mode === 'below' ? 'emp.limitBelowHelp' : 'emp.limitHourHelp') + '</p>';
  return h;
}
function setCollectorLimit(empId, mode, n) {
  var emp = findEmp(empId);
  if (!emp) return;
  if (mode !== null) emp.limitMode = mode;
  if (n !== null) emp.limitN = Math.max(0, parseFloat(n) || 0);
  save();
  if (mode !== null) showEmpInfoModal(empId);
}

function assignCollector(empId, ingId) {
  var emp = findEmp(empId);
  if (moveCollector(emp, ingId)) { save(); showEmpInfoModal(empId); }
}

function sellerConfig(emp) {
  var pct = emp.sellPct === undefined ? 100 : emp.sellPct;
  var h = '<p class="set-help">' + t('emp.sellHelp') + '</p>';
  h += '<div class="volume-row"><input type="range" min="0" max="100" step="5" value="' + pct + '" oninput="document.getElementById(\'sell-pct\').textContent=this.value+\' %\'" onchange="setSellPct(' + emp.id + ',this.value,false)"><span id="sell-pct">' + pct + ' %</span></div>';
  h += '<button class="btn btn-small" onclick="setSellPct(' + emp.id + ',' + pct + ',true)">' + t('emp.sellAll') + '</button>';
  return h;
}

function setSellPct(empId, value, everyone) {
  var pct = Math.max(0, Math.min(100, parseInt(value, 10) || 0));
  G.employees.forEach(function(e) {
    if ((e.type === 'seller' || (e.type === 'versatile' && jobRec(e, 'seller'))) && (everyone || e.id === empId)) e.sellPct = pct;
  });
  if (everyone) toast(t('emp.sellAllDone', { v: pct }));
  showEmpInfoModal(empId);
}

function chefConfig(emp) {
  var mode = emp.chefMode || 'all';
  var list = emp.chefList || [];
  var h = '<div class="segmented theme-scope">';
  [['all', 'emp.chefAll'], ['orders', 'emp.chefOrders'], ['only', 'emp.chefOnly'], ['priority', 'emp.chefPriority']].forEach(function(m) {
    h += '<button class="' + (mode === m[0] ? 'active' : '') + '" onclick="setChefMode(' + emp.id + ',\'' + m[0] + '\')">' + t(m[1]) + '</button>';
  });
  h += '</div><p class="set-help">' + t('emp.chefHelp.' + mode) + '</p>';
  // Limites d'argent
  h += '<label class="cfg-row">' + t('emp.chefBudget') + '<input type="number" min="0" step="any" value="' + (emp.chefBudget || '') + '" placeholder="∞" onchange="setChefLimit(' + emp.id + ',\'budget\',this.value)"></label>';
  h += '<label class="cfg-row">' + t('emp.chefMinMoney') + '<input type="number" min="0" step="any" value="' + (emp.chefMinMoney || '') + '" placeholder="0" onchange="setChefLimit(' + emp.id + ',\'min\',this.value)"></label>';
  h += '<p class="set-help">' + t('emp.chefLimitHelp') + '</p>';
  if (mode === 'all' || mode === 'orders') return h;
  h += '<div class="chef-list">';
  REC.forEach(function(rec) {
    if (!recUnlocked(rec)) return;
    var pos = list.indexOf(rec.id);
    h += '<button type="button" class="chef-rec' + (pos >= 0 ? ' on' : '') + '" onclick="toggleChefRec(' + emp.id + ',\'' + rec.id + '\')">' + rec.e + '<span>' + recShortName(rec) + '</span>' + (pos >= 0 && mode === 'priority' ? '<b>' + (pos + 1) + '</b>' : '') + '</button>';
  });
  return h + '</div>';
}
function setChefLimit(empId, which, value) {
  var emp = findEmp(empId);
  if (!emp) return;
  var n = Math.max(0, parseFloat(value) || 0);
  if (which === 'budget') { emp.chefBudget = n; emp.chefWinT = 0; } else emp.chefMinMoney = n;
  save();
}

function setChefMode(empId, mode) {
  var emp = findEmp(empId);
  if (emp) { emp.chefMode = mode; showEmpInfoModal(empId); }
}

function toggleChefRec(empId, recId) {
  var emp = findEmp(empId);
  if (!emp) return;
  emp.chefList = emp.chefList || [];
  var pos = emp.chefList.indexOf(recId);
  if (pos >= 0) emp.chefList.splice(pos, 1);
  else emp.chefList.push(recId);
  showEmpInfoModal(empId);
}

function managerConfig(emp) {
  var on = !!emp.mgrAuto;
  var min = emp.mgrMin === undefined ? 50 : emp.mgrMin;
  var h = setRow(t('emp.mgrAuto'), t('emp.mgrHelp'), setSwitch(on, 'toggleManager(' + emp.id + ')', t('emp.mgrAuto')));
  h += '<div class="cfg-row">' + t('emp.mgrMin') + '<div class="volume-row"><input type="range" min="1" max="100" value="' + min + '" oninput="document.getElementById(\'mgr-min\').textContent=this.value" onchange="setManagerMin(' + emp.id + ',this.value)"><span id="mgr-min">' + min + '</span></div></div>';
  // Quels metiers il embauche, dans quel ordre, et a quels niveaux
  var jobs = emp.mgrJobs || [], prio = emp.mgrPrio || [];
  var types = EMP_TYPES.filter(function(et) { return empTypeOpen(et) && !et.hidden; });
  h += '<p class="set-help"><b>' + t('emp.mgrJobs') + '</b> ' + t('emp.mgrJobsHelp') + '</p><div class="chef-list">';
  types.forEach(function(et) {
    h += '<button type="button" class="chef-rec' + (jobs.indexOf(et.id) >= 0 ? ' on' : '') + '" onclick="toggleMgrJob(' + emp.id + ',\'' + et.id + '\')">' + empAvatar(et.id, et.id) + '<span>' + t('emp.' + et.id) + '</span></button>';
  });
  h += '</div><p class="set-help"><b>' + t('emp.mgrPrio') + '</b> ' + t('emp.mgrPrioHelp') + '</p><div class="chef-list">';
  types.forEach(function(et) {
    var pos = prio.indexOf(et.id);
    h += '<button type="button" class="chef-rec' + (pos >= 0 ? ' on' : '') + '" onclick="toggleMgrPrio(' + emp.id + ',\'' + et.id + '\')">' + empAvatar(et.id, et.id) + '<span>' + t('emp.' + et.id) + '</span>' + (pos >= 0 ? '<b>' + (pos + 1) + '</b>' : '') + '</button>';
  });
  h += '</div>';
  var lmin = emp.mgrLvlMin || 1, lmax = emp.mgrLvlMax || EMP_GOLD_LVL;
  function lvlSelect(which, cur) {
    var o = '<select class="set-select" onchange="setMgrLvl(' + emp.id + ',\'' + which + '\',this.value)">';
    for (var L = 1; L <= EMP_GOLD_LVL; L++) o += '<option value="' + L + '"' + (cur === L ? ' selected' : '') + '>' + (L >= EMP_GOLD_LVL ? '★ ' + t('emp.levelGold') : L) + '</option>';
    return o + '</select>';
  }
  h += '<div class="cfg-row">' + t('emp.mgrLvl') + '<span class="cfg-pair">' + lvlSelect('min', lmin) + ' → ' + lvlSelect('max', lmax) + '</span></div>';
  return h;
}
function toggleMgrJob(empId, type) {
  var emp = findEmp(empId);
  if (!emp) return;
  emp.mgrJobs = emp.mgrJobs || [];
  var i = emp.mgrJobs.indexOf(type);
  if (i >= 0) emp.mgrJobs.splice(i, 1); else emp.mgrJobs.push(type);
  showEmpInfoModal(empId);
}
function toggleMgrPrio(empId, type) {
  var emp = findEmp(empId);
  if (!emp) return;
  emp.mgrPrio = emp.mgrPrio || [];
  var i = emp.mgrPrio.indexOf(type);
  if (i >= 0) emp.mgrPrio.splice(i, 1); else emp.mgrPrio.push(type);
  showEmpInfoModal(empId);
}
function setMgrLvl(empId, which, value) {
  var emp = findEmp(empId);
  if (!emp) return;
  var v = Math.max(1, Math.min(EMP_GOLD_LVL, parseInt(value, 10) || 1));
  if (which === 'min') { emp.mgrLvlMin = v; if ((emp.mgrLvlMax || EMP_GOLD_LVL) < v) emp.mgrLvlMax = v; }
  else { emp.mgrLvlMax = v; if ((emp.mgrLvlMin || 1) > v) emp.mgrLvlMin = v; }
  showEmpInfoModal(empId);
}

function toggleManager(empId) {
  var emp = findEmp(empId);
  if (emp) { emp.mgrAuto = !emp.mgrAuto; showEmpInfoModal(empId); }
}

function setManagerMin(empId, value) {
  var emp = findEmp(empId);
  if (emp) emp.mgrMin = parseInt(value, 10) || 1;
}

function noviceConfig(emp) {
  var h = '<p class="set-help">' + t('emp.noviceHelp') + '</p><div class="recruit-row">';
  EMP_TYPES.forEach(function(et) {
    if (et.id === 'novice' || et.hidden || !empTypeOpen(et)) return;
    var c = jobCost(et);
    h += '<button class="btn btn-small" onclick="doGiveJob(' + emp.id + ',\'' + et.id + '\')"' + (G.money < c ? ' disabled' : '') + '>' + empAvatar(et.id, emp.name) + t('emp.' + et.id) + ' (' + fmtMoney(c) + ')</button>';
  });
  return h + '</div>';
}

function doGiveJob(empId, typeId) {
  if (giveJob(empId, typeId)) {
    toast(t('emp.jobDone', { n: t('emp.' + typeId) }));
    playSuccessSound();
    showEmpInfoModal(empId);
    renderEmployees();
    renderHeader();
  }
}

// Le transporteur : ou, quoi, et combien
function carrierConfig(emp) {
  ensureBakeryList();
  if (G.bakeries.length < 2) return '<p class="set-help">' + t('carry.noShop') + '</p>';
  var to = carrierTarget(emp, G.currentBakeryIndex);
  var what = emp.carryWhat || 'money';
  var h = '<label class="cfg-row">' + t('carry.to') + '<select class="set-select" onchange="assignCarrier(' + emp.id + ',\'to\',this.value)">';
  G.bakeries.forEach(function(b, i) {
    if (i === G.currentBakeryIndex) return;
    h += '<option value="' + bakeryUid(b) + '"' + (i === to ? ' selected' : '') + '>' + escH(b.name) + '</option>';
  });
  h += '</select></label><label class="cfg-row">' + t('carry.what') + '<select class="set-select" onchange="assignCarrier(' + emp.id + ',\'what\',this.value)">';
  [['money', 'carry.money'], ['cakes', 'carry.cakes'], ['ings', 'carry.ings']].forEach(function(o) {
    h += '<option value="' + o[0] + '"' + (what === o[0] ? ' selected' : '') + '>' + t(o[1]) + '</option>';
  });
  h += '<optgroup label="' + escH(t('carry.oneCake')) + '">';
  REC.forEach(function(r) { if (recUnlocked(r)) h += '<option value="cake:' + r.id + '"' + (what === 'cake:' + r.id ? ' selected' : '') + '>' + recShortName(r) + '</option>'; });
  h += '</optgroup><optgroup label="' + escH(t('carry.oneIng')) + '">';
  ING.forEach(function(i) { if (ingUnlocked(i)) h += '<option value="ing:' + i.id + '"' + (what === 'ing:' + i.id ? ' selected' : '') + '>' + t('i.' + i.id) + '</option>'; });
  h += '</optgroup></select></label>';
  h += '<label class="cfg-row">' + t('carry.qty') + '<input type="number" min="0" step="any" value="' + (emp.carryQty || '') + '" placeholder="' + escH(t('carry.max')) + '" onchange="assignCarrier(' + emp.id + ',\'qty\',this.value)"></label>';
  // Le rythme : en continu comme avant, une seule fois, ou toutes les N minutes
  var ev = emp.carryEvery === undefined ? 'auto' : String(emp.carryEvery);
  h += '<label class="cfg-row">' + t('carry.every') + '<select class="set-select" onchange="assignCarrier(' + emp.id + ',\'every\',this.value)"><option value="auto"' + (ev === 'auto' ? ' selected' : '') + '>' + t('carry.everyAuto') + '</option><option value="0"' + (ev === '0' ? ' selected' : '') + '>' + t('carry.once') + '</option>';
  CARRIER_EVERY_MIN.forEach(function(mn) { h += '<option value="' + mn + '"' + (ev === String(mn) ? ' selected' : '') + '>' + t('carry.everyMin', { v: mn }) + '</option>'; });
  h += '</select></label>';
  if (emp.carryEvery !== undefined) {
    var label = emp.carryEvery === 0 ? t('carry.goNow') : emp.carryActive ? t('carry.stop') : t('carry.start');
    h += '<button class="btn btn-primary carry-go" onclick="doCarrierGo(' + emp.id + ')">' + label + '</button>';
    if (emp.carryEvery > 0 && emp.carryActive && emp.carryNextAt) h += '<p class="set-help js-count" data-key="carry.next" data-p="t" data-until="' + emp.carryNextAt + '">' + t('carry.next', { t: fmtTime(Math.max(0, (emp.carryNextAt - Date.now()) / 1000)) }) + '</p>';
  }
  h += '<p class="set-help">' + t('carry.help') + '</p>';
  var road = [];
  for (var i = 0; i < G.bakeries.length; i++) {
    var st = bakeryStateAt(i);
    (st && st.incoming || []).forEach(function(ship) { if (ship.by === emp.name) road.push(ship); });
  }
  if (road.length) {
    h += '<p class="set-help"><b>' + t('carry.onRoad') + '</b></p><ul class="carry-road">';
    road.forEach(function(ship) { h += '<li>' + t('carry.eta', { v: shipLabel(ship), t: fmtTime(Math.max(0, (ship.eta - Date.now()) / 1000)) }) + '</li>'; });
    h += '</ul>';
  }
  return h;
}

function assignCarrier(empId, field, value) {
  var emp = findEmp(empId);
  if (!emp) return;
  if (field === 'to') emp.carryTo = value;
  else if (field === 'what') emp.carryWhat = value;
  else if (field === 'every') {
    if (value === 'auto') { delete emp.carryEvery; delete emp.carryActive; delete emp.carryNextAt; }
    else { emp.carryEvery = parseFloat(value) || 0; emp.carryActive = false; emp.carryNextAt = 0; }
    showEmpInfoModal(empId);
  }
  else emp.carryQty = parseFloat(value) || 0;
}

function doCarrierGo(empId) {
  var emp = findEmp(empId);
  var r = carrierGo(emp);
  if (r === 'noShop') toast(t('carry.noShop'));
  else if (r === 'busy') toast(t('carry.busy'));
  else if (r !== 'no') toast(t('carry.' + r));
  save();
  showEmpInfoModal(empId);
}

function doTrainEmployee(empId) {
  if (trainEmployee(empId)) {
    toast(t('emp.trained'));
    showEmpInfoModal(empId);
    renderEmployees();
    renderHeader();
  } else {
    toast(t('ing.noMoney'));
    playErrorSound();
  }
}

function doGiveBonus(empId) {
  if (giveBonus(empId)) {
    toast(t('emp.bonusDone'));
    showEmpInfoModal(empId);
    renderEmployees();
    renderHeader();
  } else {
    playErrorSound();
  }
}

function confirmFire(empId) {
  var emp = findEmp(empId);
  if (!emp) return;
  var h = '<h2>' + t('emp.fire') + '</h2><p>' + t('emp.fireConfirm', { n: escH(emp.name) }) + '</p>';
  h += '<div class="modal-btns"><button class="btn btn-danger" onclick="doFireEmployee(' + emp.id + ')">' + t('common.yes') + '</button>';
  h += '<button class="btn" onclick="showEmpInfoModal(' + emp.id + ')">' + t('common.cancel') + '</button></div>';
  showModal(h);
}

function doFireEmployee(empId) {
  fireEmployee(empId);
  hideModal();
  renderEmployees();
}

// Mettre un employe en pause : il arrete de travailler, mais il est toujours paye
function toggleEmpPause(empId) {
  var emp = findEmp(empId);
  if (!emp) return;
  emp.paused = !emp.paused;
  save();
  renderEmployees();
  showEmpInfoModal(empId);
}
