/* ============================================
   PATISSERIE 2D SIMULATOR - DECORS DES SAISONS
   Tout est dessine ici, en SVG : fleurs, plage,
   neige et feuilles d'automne.
   ============================================ */

var Decor = (function() {
  function uri(svg) { return 'data:image/svg+xml,' + encodeURIComponent(svg); }
  function url(svg) { return 'url("' + uri(svg) + '")'; }
  function svg(w, h, body) { return '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' + body + '</svg>'; }
  function at(x, y, s, r, body, op) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + (r || 0) + ') scale(' + (s || 1) + ')"' + (op ? ' opacity="' + op + '"' : '') + '>' + body + '</g>';
  }
  function rotations(n, body) {
    var h = '';
    for (var i = 0; i < n; i++) h += '<g transform="rotate(' + (i * 360 / n) + ')">' + body + '</g>';
    return h;
  }

  // ---------- Printemps ----------
  // Fleur de cerisier : 5 petales, chacun avec sa petite encoche
  function blossom(c1, c2, heart) {
    return rotations(5, '<path d="M0 0C-5-2.500-5.500-8-2.200-10.500L0-9l2.200-1.500C5.500-8 5-2.500 0 0z" fill="' + c1 + '"/><path d="M0-1.500C-1.800-3-2-6-.8-8h1.600C2-6 1.800-3 0-1.500z" fill="' + c2 + '"/>') +
      rotations(5, '<path d="M0-1.500V-5" stroke="' + heart + '" stroke-width=".7" stroke-linecap="round"/><circle cy="-5.300" r=".8" fill="' + heart + '"/>') +
      '<circle r="1.700" fill="' + heart + '"/>';
  }
  function daisy() {
    return rotations(12, '<ellipse cy="-6.500" rx="1.900" ry="4.300" fill="#fff" stroke="#d9e8cf" stroke-width=".4"/>') +
      '<circle r="3.300" fill="#FFC928"/><circle cx="-.8" cy="-.8" r="1.300" fill="#FFE27A"/>';
  }
  function buttercup() {
    return rotations(5, '<ellipse cy="-4.800" rx="3.300" ry="4.300" fill="#FFD83D" stroke="#F3B716" stroke-width=".5"/>') + '<circle r="2" fill="#F39C12"/>';
  }
  function tulip(c1, c2) {
    return '<path d="M0 24V5" stroke="#4E9A32" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M0 20c-6-1-8-6-8-10 4 1 7 4 8 8z" fill="#5FB03F"/><path d="M0 22c5-1 7-5 7-9-3 1-6 4-7 7z" fill="#6DBD4B"/>' +
      '<path d="M-7-7C-8 2-4 6 0 6s8-4 7-13L3.500-2.500 0-9-3.500-2.500z" fill="' + c1 + '"/><path d="M0-9l3.500 6.500L0 6-3.500-2.500z" fill="' + c2 + '"/>';
  }
  function leafSmall(fill) { return '<path d="M0 0C-4-3-4-8 0-12 4-8 4-3 0 0z" fill="' + fill + '"/><path d="M0-1V-10" stroke="#3E8A28" stroke-width=".6"/>'; }
  function butterfly() {
    return '<path d="M0-1C-5-10-13-9-12-3-11 2-5 2 0 1z" fill="#F48FB1"/><path d="M0 1C-5 2-9 5-7 8-4 11 0 6 0 2z" fill="#F8BBD0"/>' +
      '<path d="M0-1C5-10 13-9 12-3 11 2 5 2 0 1z" fill="#F48FB1"/><path d="M0 1C5 2 9 5 7 8 4 11 0 6 0 2z" fill="#F8BBD0"/>' +
      '<circle cx="-7" cy="-4" r="1.500" fill="#fff"/><circle cx="7" cy="-4" r="1.500" fill="#fff"/>' +
      '<path d="M0-4V6" stroke="#5D4037" stroke-width="1.600" stroke-linecap="round"/><path d="M0-4c-1-2-2-3-3-3.500M0-4c1-2 2-3 3-3.500" fill="none" stroke="#5D4037" stroke-width=".6"/>';
  }
  var PINK = function() { return blossom('#FFB7D0', '#FFD9E6', '#D81B60'); };

  var spring = {
    strip: svg(240, 26,
      '<path d="M0 4Q30 13 60 4T120 4T180 4T240 4" fill="none" stroke="#3E7D2A" stroke-width="2.200"/>' +
      at(18, 8, .7, 150, leafSmall('#6DBD4B')) + at(45, 8, .7, 215, leafSmall('#5FB03F')) + at(138, 8, .7, 150, leafSmall('#6DBD4B')) + at(226, 7, .7, 205, leafSmall('#5FB03F')) +
      at(32, 11, .95, 0, PINK()) + at(92, 8, .85, 20, daisy()) + at(152, 11, .95, 40, PINK()) + at(208, 9, .95, 0, buttercup())),
    ground: svg(200, 22,
      '<path d="M0 22V15c10-3 18-1 28 0s18-3 30-2 20 3 32 1 22-3 34-1 24 3 36 1 24-2 40 1v7z" fill="#6DBD4B"/>' +
      '<path d="M12 16l-3-8M15 16l1-10M45 15l-4-7M86 15l-2-8M90 15l3-9M132 16l-3-8M170 15l3-8" stroke="#4E9A32" stroke-width="1.600" stroke-linecap="round"/>' +
      at(26, 12, .55, 0, daisy()) + at(70, 12, .55, 10, PINK()) + at(112, 12, .5, 0, buttercup()) + at(152, 11, .55, 0, daisy()) + at(188, 12, .55, 20, PINK())),
    corner: svg(230, 190,
      at(190, 142, 1.3, 0, tulip('#F06292', '#F8BBD0')) + at(150, 150, 1.05, -6, tulip('#FFCA28', '#FFE082')) + at(214, 156, .95, 7, tulip('#BA68C8', '#E1BEE7')) +
      '<path d="M120 190c8-26 14-44 16-70M100 190c-2-18-6-34-14-48" fill="none" stroke="#4E9A32" stroke-width="2.200" stroke-linecap="round"/>' +
      at(126, 150, 1, 60, leafSmall('#6DBD4B')) + at(95, 165, 1, -40, leafSmall('#5FB03F')) +
      at(136, 112, 1.5, 0, daisy()) + at(84, 134, 1.25, 20, PINK()) + at(60, 172, .9, 0, buttercup()) + at(36, 178, .7, 0, daisy()) +
      at(66, 74, 1.15, -18, butterfly())),
    top: svg(150, 70,
      '<path d="M150 8C112 6 80 16 42 10" fill="none" stroke="#4E9A32" stroke-width="2" stroke-linecap="round"/>' +
      at(132, 14, 1.2, 0, PINK()) + at(100, 16, 1, 30, PINK()) + at(70, 17, .85, 0, daisy()) + at(46, 13, .8, 10, PINK()) + at(84, 28, .8, 170, leafSmall('#6DBD4B')) + at(116, 30, .8, 200, leafSmall('#5FB03F'))),
    tile: svg(130, 130,
      at(26, 28, .62, 10, PINK(), .3) + at(96, 70, .55, 0, daisy(), .4) + at(38, 104, .5, 30, buttercup(), .32) + at(104, 14, .42, 40, PINK(), .3)),
    card: svg(48, 48, at(24, 24, 1.5, 12, PINK(), .34)),
    mark: svg(28, 28, at(14, 14, 1.15, 0, PINK())),
    motion: 'fall', count: 14,
    pieces: [
      svg(20, 20, at(10, 10, 1, 0, '<path d="M0-8C5-6 6 2 0 8-6 2-5-6 0-8z" fill="#FFB7D0"/><path d="M0-6C2-3 2 2 0 5" fill="none" stroke="#FFDCE8" stroke-width="1"/>')),
      svg(20, 20, at(10, 10, 1, 30, '<path d="M0-8C5-6 6 2 0 8-6 2-5-6 0-8z" fill="#FFD3E2"/><path d="M0-6C2-3 2 2 0 5" fill="none" stroke="#FFF" stroke-width="1"/>')),
      svg(20, 20, at(10, 10, 1, -20, '<path d="M0-8C5-6 6 2 0 8-6 2-5-6 0-8z" fill="#fff" stroke="#F8BBD0" stroke-width=".6"/>')),
      svg(24, 24, at(12, 12, .95, 0, PINK())),
    ],
  };

  // ---------- Ete : la plage ----------
  function starfish(c1, c2) {
    return rotations(5, '<path d="M-4.200-2.500C-3-6-1.500-10 0-12.500 1.500-10 3-6 4.200-2.500z" fill="' + c1 + '"/><circle cy="-5" r=".8" fill="' + c2 + '"/><circle cy="-8" r=".6" fill="' + c2 + '"/>') + '<circle r="4.300" fill="' + c1 + '"/><circle r="1" fill="' + c2 + '"/>';
  }
  function shell(c1, c2) {
    return '<path d="M0 9C-3 9-10 3-10-3-10-8-5-10 0-10S10-8 10-3C10 3 3 9 0 9z" fill="' + c1 + '"/>' +
      '<path d="M0 8.500V-10M0 8.500L-5-9M0 8.500L5-9M0 8.500L-9-5M0 8.500L9-5" stroke="' + c2 + '" stroke-width="1" stroke-linecap="round"/>' +
      '<path d="M-3 9H3L4.500 11.500H-4.500z" fill="' + c1 + '"/>';
  }
  function ball() {
    return '<circle r="14" fill="#fff"/>' +
      '<path d="M0 0L-12.500-6.400A14 14 0 0 1-2-13.900z" fill="#1E88E5"/><path d="M0 0L9.500-10.300A14 14 0 0 1 13.900 2z" fill="#FFC91F"/><path d="M0 0L9.900 9.900A14 14 0 0 1-6 12.600z" fill="#29B6F6"/>' +
      '<circle r="3" fill="#fff"/><path d="M-9-7a11 11 0 0 1 5-3" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/><circle r="14" fill="none" stroke="#0F4C81" stroke-width=".7" opacity=".35"/>';
  }
  function parasol() {
    return '<path d="M2 60L-6-6" stroke="#8D6E63" stroke-width="3.500" stroke-linecap="round"/>' +
      '<path d="M-52 2C-50-30-24-46-7-46S40-34 42-4C36-11 26-11 19-2 13-10 3-10-5-1-13-9-24-8-30 1-37-5-46-4-52 2z" fill="#fff" stroke="#0F4C81" stroke-width=".8"/>' +
      '<path d="M-7-46C-26-40-33-18-30 1-24-8-13-9-5-1-10-18-11-34-7-46z" fill="#1E88E5"/><path d="M-7-46C9-38 18-20 19-2 26-11 36-11 42-4 40-26 18-46-7-46z" fill="#1E88E5"/>' +
      '<circle cx="-7" cy="-47" r="2.500" fill="#FFC91F"/>';
  }
  function sailboat() {
    return '<path d="M-22 12H22L14 22H-14z" fill="#1565C0"/><path d="M-20 14H20l-1.500 2H-18.500z" fill="#fff"/>' +
      '<path d="M0 10V-24" stroke="#5D4037" stroke-width="2"/><path d="M2-24L22 8H2z" fill="#fff" stroke="#BBDEFB" stroke-width=".8"/><path d="M-2-18L-18 8H-2z" fill="#FFC91F"/>' +
      '<path d="M2-24L10-22 2-19z" fill="#1E88E5"/>';
  }
  function sun() {
    return rotations(12, '<path d="M0-30L3-22H-3z" fill="#FFB300"/>') +
      '<circle r="20" fill="#FFC91F"/><circle r="15" fill="#FFE082"/>' +
      '<circle cx="-6" cy="-3" r="1.700" fill="#0F4C81"/><circle cx="6" cy="-3" r="1.700" fill="#0F4C81"/><path d="M-6 4q6 5 12 0" fill="none" stroke="#0F4C81" stroke-width="1.600" stroke-linecap="round"/>';
  }

  var summer = {
    strip: svg(120, 22,
      '<path d="M0 0H120V9q-15 9-30 0t-30 0-30 0-30 0z" fill="#2B8FD8"/>' +
      '<path d="M0 0H120V4q-15 8-30 0t-30 0-30 0-30 0z" fill="#7CC8F2"/>' +
      '<path d="M0 9q15 9 30 0t30 0 30 0 30 0" fill="none" stroke="#fff" stroke-width="1.800" stroke-linecap="round"/>'),
    ground: svg(320, 22,
      '<path d="M0 22V10c30-6 60-5 90-2s70 5 110 1 80-4 120 1v12z" fill="#F7DC7E"/><path d="M0 22v-5c50-4 110-3 160 0s110 2 160-1v6z" fill="#EFC95A"/>' +
      '<g fill="#D9A93B"><circle cx="24" cy="16" r="1"/><circle cx="60" cy="19" r="1"/><circle cx="130" cy="17" r="1"/><circle cx="214" cy="19" r="1"/><circle cx="290" cy="17" r="1"/></g>' +
      at(46, 12, .55, 15, starfish('#FF8A5C', '#FFD0B8')) + at(120, 12, .55, -15, shell('#FFF1E0', '#E5B98E')) + at(196, 13, .5, 40, starfish('#42A5F5', '#BBDEFB')) + at(272, 12, .55, 12, shell('#BBDEFB', '#5C9BD6'))),
    corner: svg(240, 190,
      '<path d="M0 190c20-22 60-34 110-34s100 10 130 26v8z" fill="#F7DC7E"/><path d="M60 190c30-14 70-20 110-16s60 8 70 16z" fill="#EFC95A"/>' +
      at(160, 112, 1.05, 4, parasol()) +
      at(74, 156, 1.15, 12, ball()) + at(218, 170, .75, 20, starfish('#FF8A5C', '#FFD0B8')) + at(118, 176, .65, -20, shell('#FFF1E0', '#E5B98E')) +
      '<g transform="translate(26 168)"><path d="M-9-10H9L6 8H-6z" fill="#1E88E5"/><path d="M-9-10C-7-20 7-20 9-10" fill="none" stroke="#0F4C81" stroke-width="1.500"/><path d="M-8.500-6H8.500" stroke="#fff" stroke-width="2"/></g>'),
    corner2: svg(190, 110,
      '<path d="M0 110C8 84 34 72 64 70s72-2 98 8 28 22 28 32z" fill="#7CC8F2"/>' + at(96, 56, 1, -3, sailboat()) +
      '<path d="M10 110C20 94 44 86 70 85s66 0 90 8 22 12 24 17z" fill="#2B8FD8"/>' +
      '<path d="M34 98q10-6 20 0t20 0M104 100q10-6 20 0t20 0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".85"/>'),
    top: svg(90, 76, at(52, 36, 1, 0, sun())),
    tile: svg(150, 150,
      at(30, 30, .55, 20, starfish('#1E88E5', '#BBDEFB'), .2) + at(112, 60, .6, -15, shell('#1E88E5', '#fff'), .2) + at(50, 118, .5, 0, '<path d="M-14 0q7-7 14 0t14 0" fill="none" stroke="#1E88E5" stroke-width="2.400" stroke-linecap="round"/><path d="M-14 8q7-7 14 0t14 0" fill="none" stroke="#1E88E5" stroke-width="2.400" stroke-linecap="round"/>', .3)),
    card: svg(48, 48, at(24, 24, 1.3, 15, starfish('#42A5F5', '#E3F2FD'), .34)),
    mark: svg(28, 28, at(14, 14, .9, 10, starfish('#1E88E5', '#BBDEFB'))),
    motion: 'fly', count: 4,
    pieces: [
      svg(44, 20, '<path d="M2 12C8 3 16 4 22 12 28 4 36 3 42 12" fill="none" stroke="#0F4C81" stroke-width="2.400" stroke-linecap="round"/>'),
    ],
  };

  // ---------- Hiver : la neige ----------
  function flake(c, w) {
    var arm = '<path d="M0 0V-11M0-4L-2.800-6.800M0-4L2.800-6.800M0-7.500L-2.200-9.700M0-7.500L2.200-9.700" fill="none" stroke="' + c + '" stroke-width="' + (w || 1.300) + '" stroke-linecap="round"/>';
    return rotations(6, arm) + '<circle r="1.300" fill="' + c + '"/>';
  }
  function pine() {
    return '<rect x="-3" y="30" width="6" height="10" fill="#6D4C41"/>' +
      '<path d="M0-34L18-8H8L24 14H12L30 34H-30L-12 14H-24L-8-8H-18z" fill="#1F6F8B"/>' +
      '<path d="M0-34L10-20C6-17 3-19 0-16-3-19-6-17-10-20zM-14 3C-8 0-4 4 0 1 4 4 8 0 14 3L8-8H-8zM-22 23C-14 19-7 25 0 21 7 25 14 19 22 23L12 14H-12z" fill="#fff"/>';
  }
  function snowman() {
    return '<circle cy="26" r="24" fill="#fff" stroke="#BCD9EF" stroke-width="1.200"/><circle cy="-10" r="17" fill="#fff" stroke="#BCD9EF" stroke-width="1.200"/>' +
      '<path d="M-14 4C-5 9 5 9 14 4L15 9C5 14-5 14-15 9z" fill="#E53935"/><path d="M6 10l1 15 6-1-2-15z" fill="#C62828"/>' +
      '<circle cx="-6" cy="-13" r="2" fill="#0F2F4F"/><circle cx="6" cy="-13" r="2" fill="#0F2F4F"/><path d="M0-9L15-6 0-5z" fill="#FF8F00"/>' +
      '<g fill="#0F2F4F"><circle cx="-5" cy="-2.500" r="1"/><circle cx="-1.500" cy="-1" r="1"/><circle cx="2" cy="-1" r="1"/><circle cx="5.500" cy="-2.500" r="1"/><circle cy="20" r="2"/><circle cy="30" r="2"/></g>' +
      '<path d="M-20-23H20V-20H-20z" fill="#0F2F4F"/><path d="M-12-22V-40H12V-22z" fill="#0F2F4F"/><path d="M-12-29H12V-24H-12z" fill="#1C74C4"/>' +
      '<path d="M-20 20L-40 6M-40 6L-46 4M-40 6L-44 11M20 20L38 2M38 2L44 0M38 2L40-5" fill="none" stroke="#6D4C41" stroke-width="2.200" stroke-linecap="round"/>';
  }

  var winter = {
    strip: svg(180, 24,
      '<path d="M0 0H180V8c-6 4-10 2-15 3-3 8-8 8-10 0-8 3-16 0-24 2-5 2-8 5-14 3-6-3-14 0-20-1-2 9-8 10-10 0-8-1-14 3-22 1-7-1-12-2-18 0-3 7-8 7-10 0-9 2-14-1-21-2-4 1-6-2-16-5z" fill="#fff"/>' +
      '<path d="M0 8c10 3 12 6 16 5 7 1 12 4 21 2 2 7 7 7 10 0 6-2 11-1 18 0 8 2 14-2 22-1 2 10 8 9 10 0 6 1 14-2 20 1 6 2 9-1 14-3 8-2 16 1 24-2 2 8 7 8 10 0 5-1 9 1 15-3" fill="none" stroke="#CFE5F7" stroke-width="1.400"/>' +
      '<path d="M40 14l2 9 2-9zM110 15l1.500 7 1.500-7zM156 13l1.800 8 1.800-8z" fill="#E8F5FF"/>'),
    ground: svg(240, 22,
      '<path d="M0 22V12c14-8 30-8 46-2s30 4 46-2 34-5 50 2 32 7 48 1 34-4 50 1v10z" fill="#fff"/>' +
      '<path d="M0 12c14-8 30-8 46-2s30 4 46-2 34-5 50 2 32 7 48 1 34-4 50 1" fill="none" stroke="#BCD9EF" stroke-width="1.400"/>'),
    corner: svg(240, 190,
      '<path d="M0 190c18-26 56-38 110-36s100 14 130 26v10z" fill="#fff"/><path d="M0 190c18-26 56-38 110-36s100 14 130 26" fill="none" stroke="#BCD9EF" stroke-width="1.500"/>' +
      at(204, 116, 1.15, 0, pine()) + at(46, 134, .8, 0, pine()) + at(124, 112, 1, 0, snowman()) +
      at(82, 50, 1.3, 10, flake('#fff', 1.500)) + at(180, 30, 1, 0, flake('#fff', 1.500)) + at(30, 70, .8, 20, flake('#fff', 1.500))),
    corner2: svg(170, 90,
      '<path d="M0 90c20-22 50-30 86-28s66 12 84 22v6z" fill="#fff"/><path d="M0 90c20-22 50-30 86-28s66 12 84 22" fill="none" stroke="#BCD9EF" stroke-width="1.400"/>' +
      at(122, 42, .75, 0, pine()) + at(60, 36, 1, 0, flake('#fff', 1.500))),
    top: svg(110, 70, at(84, 24, 1.3, 15, flake('#fff', 1.500)) + at(40, 16, .8, 0, flake('#fff', 1.500)) + at(58, 50, .6, 30, flake('#fff', 1.500))),
    tile: svg(140, 140,
      at(30, 34, .9, 10, flake('#fff'), .75) + at(104, 74, .7, 25, flake('#fff'), .7) + at(46, 112, .55, 0, flake('#fff'), .65) + at(112, 16, .5, 15, flake('#fff'), .6) +
      '<g fill="#fff" opacity=".7"><circle cx="72" cy="28" r="1.400"/><circle cx="16" cy="78" r="1.200"/><circle cx="84" cy="118" r="1.500"/><circle cx="128" cy="116" r="1.100"/></g>'),
    card: svg(48, 48, at(24, 24, 1.8, 12, flake('#A9D0EE', 1.100), .6)),
    mark: svg(28, 28, at(14, 14, 1.1, 0, flake('#1C74C4', 1.500))),
    motion: 'snow', count: 38,
    pieces: [
      svg(26, 26, at(13, 13, 1, 0, flake('#fff', 1.500))),
      svg(26, 26, at(13, 13, .8, 15, flake('#fff', 1.700))),
      svg(12, 12, '<circle cx="6" cy="6" r="4" fill="#fff"/>'),
    ],
  };

  // ---------- Automne : les feuilles ----------
  var MAPLE_PTS = [[0,-12],[1.700,-7],[3.800,-8.300],[3,-3.400],[5.700,-5.800],[6.600,-3.800],[10,-4.500],[8.900,-1],[11,.3],[6.400,4],[7.200,6],[1.300,5.300]];
  function maple(c, v) {
    var d = 'M' + MAPLE_PTS.map(function(p) { return p.join(' '); }).join('L');
    for (var i = MAPLE_PTS.length - 2; i > 0; i--) d += 'L' + (-MAPLE_PTS[i][0]) + ' ' + MAPLE_PTS[i][1];
    d += 'z';
    return '<path d="M0 5V12" stroke="' + v + '" stroke-width="1.100" stroke-linecap="round"/><path d="' + d + '" fill="' + c + '"/>' +
      '<path d="M0 5.200V-8M0 2L5-4M0 2L-5-4M0 4L6 1M0 4L-6 1" fill="none" stroke="' + v + '" stroke-width=".7" stroke-linecap="round"/>';
  }
  function oval(c, v) {
    return '<path d="M0 12V8" stroke="' + v + '" stroke-width="1.100" stroke-linecap="round"/><path d="M0-12C8-7 8 4 0 9-8 4-8-7 0-12z" fill="' + c + '"/>' +
      '<path d="M0 9V-9M0 5L4 1M0 5L-4 1M0 1L4.500-3M0 1L-4.500-3M0-3L3-6M0-3L-3-6" fill="none" stroke="' + v + '" stroke-width=".7" stroke-linecap="round"/>';
  }
  function ginkgo(c, v) {
    return '<path d="M0 12V5" stroke="' + v + '" stroke-width="1.100" stroke-linecap="round"/><path d="M0 7C-2 3-9 1-11-5-7-9-3-9-.5-5L0-3 .5-5C3-9 7-9 11-5 9 1 2 3 0 7z" fill="' + c + '"/>' +
      '<path d="M0 6L-7-5M0 6L-3.500-7M0 6L3.500-7M0 6L7-5" fill="none" stroke="' + v + '" stroke-width=".5"/>';
  }
  function acorn() {
    return '<path d="M0-7V-10" stroke="#5D4037" stroke-width="1.500" stroke-linecap="round"/><path d="M-6-2C-6 5-2 9 0 10 2 9 6 5 6-2z" fill="#C98A3D"/><path d="M-3 0C-3 4-1 6 0 7" fill="none" stroke="#E5B471" stroke-width="1" stroke-linecap="round"/>' +
      '<path d="M-7-2C-7-7-3-8 0-8S7-7 7-2z" fill="#7A4B22"/><path d="M-4-6l1 3M0-7v4M4-6l-1 3" stroke="#5D3517" stroke-width=".7"/>';
  }
  function mushroom() {
    return '<path d="M-4 0C-5 6-5 10-6 13H6C5 10 5 6 4 0z" fill="#FFF3E0" stroke="#E0C8A8" stroke-width=".6"/>' +
      '<path d="M-15 1C-15-11-7-15 0-15S15-11 15 1C8 3-8 3-15 1z" fill="#C62828"/>' +
      '<g fill="#fff"><circle cx="-7" cy="-6" r="2.400"/><circle cx="3" cy="-10" r="2"/><circle cx="8" cy="-3" r="1.800"/><circle cx="-1" cy="-3" r="1.300"/></g>';
  }
  var RED = ['#C62828', '#7F1D12'], ORANGE = ['#EF6C00', '#A63F00'], YELLOW = ['#F9B115', '#B9770A'], AMBER = ['#E53E12', '#8A2308'];

  var fall = {
    strip: svg(260, 28,
      '<path d="M0 3C40 9 80 1 130 5S220 8 260 3" fill="none" stroke="#6D3F1C" stroke-width="2.400" stroke-linecap="round"/>' +
      at(20, 11, .85, 170, maple(RED[0], RED[1])) + at(60, 10, .75, 200, ginkgo(YELLOW[0], YELLOW[1])) + at(100, 11, .85, 160, oval(ORANGE[0], ORANGE[1])) +
      at(145, 13, .85, 190, maple(ORANGE[0], ORANGE[1])) + at(186, 12, .75, 170, ginkgo(YELLOW[0], YELLOW[1])) + at(228, 11, .85, 200, maple(AMBER[0], AMBER[1]))),
    ground: svg(220, 22,
      '<path d="M0 22V14c20-6 40-4 60-1s40 2 60-1 50-3 100 2v8z" fill="#A9642A"/>' +
      at(18, 13, .7, 70, maple(RED[0], RED[1])) + at(46, 14, .65, -50, oval(YELLOW[0], YELLOW[1])) + at(78, 13, .7, 30, ginkgo(YELLOW[0], YELLOW[1])) + at(106, 14, .7, -80, maple(ORANGE[0], ORANGE[1])) +
      at(140, 13, .65, 60, oval(RED[0], RED[1])) + at(172, 14, .7, -20, maple(AMBER[0], AMBER[1])) + at(202, 13, .65, 100, ginkgo(YELLOW[0], YELLOW[1]))),
    corner: svg(240, 190,
      '<path d="M0 190c26-20 64-30 110-30s96 10 130 24v6z" fill="#B5722F"/>' +
      at(200, 158, 1.5, 0, mushroom()) + at(160, 170, 1, 0, mushroom()) + at(120, 164, 1.5, 15, acorn()) +
      at(78, 164, 2, 25, maple(RED[0], RED[1])) + at(32, 176, 1.6, -40, oval(ORANGE[0], ORANGE[1])) + at(120, 178, 1.5, 70, ginkgo(YELLOW[0], YELLOW[1])) + at(170, 180, 1.5, -70, maple(ORANGE[0], ORANGE[1])) + at(222, 178, 1.5, 30, oval(AMBER[0], AMBER[1])) +
      at(70, 106, 1.5, -30, maple(ORANGE[0], ORANGE[1])) + at(150, 76, 1.2, 40, ginkgo(YELLOW[0], YELLOW[1])) + at(36, 50, 1, 20, oval(RED[0], RED[1]))),
    corner2: svg(170, 90,
      '<path d="M0 90c20-14 50-22 84-22s66 8 86 18v4z" fill="#B5722F"/>' +
      at(40, 72, 1.4, -30, maple(ORANGE[0], ORANGE[1])) + at(84, 76, 1.3, 40, ginkgo(YELLOW[0], YELLOW[1])) + at(130, 76, 1.4, 15, maple(RED[0], RED[1])) + at(106, 58, 1.1, 0, acorn())),
    top: svg(150, 70,
      '<path d="M150 6C110 12 70 4 30 10" fill="none" stroke="#6D3F1C" stroke-width="2.600" stroke-linecap="round"/>' +
      at(126, 24, 1.3, 190, maple(RED[0], RED[1])) + at(88, 22, 1.1, 170, ginkgo(YELLOW[0], YELLOW[1])) + at(52, 24, 1.1, 195, oval(ORANGE[0], ORANGE[1]))),
    tile: svg(150, 150,
      at(32, 30, .95, 20, maple(RED[0], RED[1]), .2) + at(112, 64, .9, -30, ginkgo(YELLOW[0], YELLOW[1]), .34) + at(46, 116, .9, 40, oval(ORANGE[0], ORANGE[1]), .24)),
    card: svg(48, 48, at(24, 24, 1.7, -15, maple(ORANGE[0], ORANGE[1]), .3)),
    mark: svg(28, 28, at(14, 14, 1.05, 0, maple(RED[0], RED[1]))),
    motion: 'leaf', count: 16,
    pieces: [
      svg(30, 30, at(15, 15, 1, 0, maple(RED[0], RED[1]))),
      svg(30, 30, at(15, 15, 1, 0, maple(ORANGE[0], ORANGE[1]))),
      svg(30, 30, at(15, 15, 1, 0, maple(YELLOW[0], YELLOW[1]))),
      svg(30, 30, at(15, 15, 1, 0, oval(AMBER[0], AMBER[1]))),
      svg(30, 30, at(15, 15, 1, 0, ginkgo(YELLOW[0], YELLOW[1]))),
    ],
  };

  // ---------- Espace : le theme du niveau 1000 ----------
  function saturn() {
    return '<ellipse rx="44" ry="12" fill="none" stroke="#E8C98F" stroke-width="5" transform="rotate(-16)" opacity=".9"/>' +
      '<circle r="26" fill="#E0A458"/><path d="M-25-7C-10-11 12-11 25-6M-26 2C-10-2 14-2 26 3M-22 12C-8 8 10 8 22 12" fill="none" stroke="#B9783A" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="-9" cy="-11" r="6" fill="#fff" opacity=".22"/>' +
      '<path d="M-43 12A44 12 0 0 0 43-12" transform="rotate(-1)" fill="none" stroke="#F4DCA8" stroke-width="5" stroke-linecap="round"/>';
  }
  function earthPlanet() {
    return '<circle r="20" fill="#3D8BDE"/><path d="M-13-12C-6-16 2-12 0-7S-8-4-11-1-17-6-13-12zM5 0C11-3 17 1 15 7S6 15 3 10 0 3 5 0z" fill="#58B368"/><circle cx="-6" cy="-8" r="5" fill="#fff" opacity=".2"/>';
  }
  function marsPlanet() {
    return '<circle r="13" fill="#D9603B"/><circle cx="-4" cy="-3" r="3" fill="#A83F22"/><circle cx="5" cy="4" r="2" fill="#A83F22"/><circle cx="-2" cy="7" r="1.500" fill="#A83F22"/>';
  }
  function rocket() {
    return '<path d="M-7 22L-15 34-7 30zM7 22L15 34 7 30z" fill="#E53935"/><path d="M0-30C10-18 11 8 8 26H-8C-11 8-10-18 0-30z" fill="#ECEFF1"/>' +
      '<path d="M0-30C4-25 7-19 8-13H-8C-7-19-4-25 0-30z" fill="#E53935"/><circle cy="0" r="5.500" fill="#4FC3F7" stroke="#607D8B" stroke-width="2"/>' +
      '<path d="M-5 26L0 44 5 26z" fill="#FFB300"/><path d="M-2.500 26L0 36 2.500 26z" fill="#FFF59D"/>';
  }
  function star4(c, r) { return '<path d="M0-' + r + 'Q' + (r * .15) + '-' + (r * .15) + ' ' + r + ' 0Q' + (r * .15) + ' ' + (r * .15) + ' 0 ' + r + 'Q-' + (r * .15) + ' ' + (r * .15) + '-' + r + ' 0Q-' + (r * .15) + '-' + (r * .15) + ' 0-' + r + 'z" fill="' + c + '"/>'; }

  var space = {
    strip: svg(260, 18,
      '<path d="M14 4L52 11 96 3 138 10 180 4 226 11" fill="none" stroke="#9FB2FF" stroke-width="1" opacity=".75"/>' +
      at(14, 4, 1, 0, star4('#fff', 4)) + at(52, 11, 1, 0, star4('#FFE082', 3.500)) + at(96, 3, 1, 0, star4('#fff', 3)) + at(138, 10, 1, 0, star4('#fff', 4)) + at(180, 4, 1, 0, star4('#FFE082', 3)) + at(226, 11, 1, 0, star4('#fff', 3.500))),
    ground: svg(260, 22,
      '<path d="M0 22V13c20-5 44-5 70-1s50 3 80-1 70-3 110 2v9z" fill="#8791B5"/>' +
      '<g fill="#646E96"><ellipse cx="40" cy="17" rx="9" ry="2.500"/><ellipse cx="120" cy="18" rx="6" ry="1.800"/><ellipse cx="200" cy="17" rx="11" ry="2.700"/></g>'),
    corner: svg(250, 190,
      at(150, 96, 1.2, 0, saturn()) + at(46, 96, 1, 22, rocket()) + at(226, 40, 1, 0, marsPlanet()) +
      at(100, 30, 1, 0, star4('#fff', 7)) + at(20, 30, 1, 0, star4('#FFE082', 5)) + at(210, 160, 1, 0, star4('#fff', 6))),
    corner2: svg(170, 80, at(112, 42, 1.4, 0, earthPlanet()) + at(38, 22, 1, 0, star4('#fff', 6)) + at(60, 62, 1, 0, star4('#FFE082', 4))),
    top: svg(110, 60, at(84, 28, .85, 0, marsPlanet()) + at(38, 18, 1, 0, star4('#FFE082', 6))),
    tile: svg(150, 150,
      at(22, 30, 1, 0, star4('#fff', 2.500), .65) + at(94, 16, 1, 0, star4('#fff', 1.800), .55) + at(132, 66, 1, 0, star4('#BFD0FF', 2.800), .6) + at(54, 84, 1, 0, star4('#fff', 1.600), .5) + at(100, 122, 1, 0, star4('#FFE082', 2.200), .55) + at(20, 132, 1, 0, star4('#fff', 1.800), .55)),
    card: svg(48, 48, at(24, 24, 1, 0, star4('#9FB2FF', 11), .35)),
    mark: svg(28, 28, at(14, 14, .34, 0, saturn())),
    motion: 'twinkle', count: 34,
    pieces: [svg(16, 16, at(8, 8, 1, 0, star4('#fff', 7))), svg(10, 10, '<circle cx="5" cy="5" r="2.200" fill="#fff"/>'), svg(14, 14, at(7, 7, 1, 0, star4('#FFE082', 6)))],
    extra: '<span class="dp-comet"></span>',
  };

  // ---------- Fete : le disco ----------
  function discoBall(r) {
    var h = '<path d="M0-' + (r + 26) + 'V-' + r + '" stroke="#D9C2F0" stroke-width="1.500"/><circle r="' + r + '" fill="#B9B3D6"/>';
    var colors = ['#F5F3FF', '#7FE7FF', '#FF7BD1', '#D9D5F2', '#FFE27A', '#8E88B8', '#F5F3FF', '#B18CFF'];
    var size = r / 3.500, n = 0;
    for (var y = -r; y < r; y += size) {
      for (var x = -r; x < r; x += size) {
        if ((x + size / 2) * (x + size / 2) + (y + size / 2) * (y + size / 2) < r * r * .92) {
          h += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (size - .7).toFixed(1) + '" height="' + (size - .7).toFixed(1) + '" fill="' + colors[(n * 5 + Math.floor(y)) & 7] + '"/>';
          n++;
        }
      }
    }
    return h + '<circle cx="-' + (r * .35) + '" cy="-' + (r * .4) + '" r="' + (r * .25) + '" fill="#fff" opacity=".35"/>';
  }
  function balloon(c) { return '<path d="M0 18C-2 26 3 30 0 38" fill="none" stroke="#D9C2F0" stroke-width="1"/><ellipse rx="14" ry="17" fill="' + c + '"/><path d="M-3 17h6l-3-4z" fill="' + c + '"/><ellipse cx="-5" cy="-6" rx="3" ry="5" fill="#fff" opacity=".4"/>'; }
  function noteMusic(c) { return '<path d="M-3 7V-8L8-11V4" fill="none" stroke="' + c + '" stroke-width="2.200" stroke-linecap="round"/><ellipse cx="-6" cy="7" rx="3.500" ry="2.700" fill="' + c + '"/><ellipse cx="5" cy="4" rx="3.500" ry="2.700" fill="' + c + '"/>'; }
  function speaker() {
    return '<rect x="-22" y="-44" width="44" height="88" rx="6" fill="#1A0D2E" stroke="#E040FB" stroke-width="2"/>' +
      '<circle cy="-20" r="11" fill="#2E1B4F" stroke="#00E5FF" stroke-width="2"/><circle cy="-20" r="4" fill="#00E5FF"/>' +
      '<circle cy="16" r="17" fill="#2E1B4F" stroke="#FF4081" stroke-width="2"/><circle cy="16" r="7" fill="#FF4081"/>';
  }
  function vinyl() {
    return '<circle r="22" fill="#14091F"/><circle r="17" fill="none" stroke="#3E2C5C" stroke-width="1"/><circle r="12" fill="none" stroke="#3E2C5C" stroke-width="1"/><circle r="7" fill="#FFD740"/><circle r="1.500" fill="#14091F"/><path d="M-15-11A19 19 0 0 1-3-18" fill="none" stroke="#fff" stroke-width="1.500" opacity=".5"/>';
  }
  function flagTile() {
    var c = ['#FF4081', '#00E5FF', '#FFD740', '#69F0AE', '#E040FB', '#FF9100'], h = '<path d="M0 3Q60 9 120 3T240 3" fill="none" stroke="#FDF3FF" stroke-width="1.500"/>';
    for (var i = 0; i < 6; i++) {
      var x = 6 + i * 40, y = 3 + (i % 3 === 1 ? 3 : i % 3 === 0 ? 2 : 2);
      h += '<path d="M' + x + ' ' + y + 'h26l-13 16z" fill="' + c[i] + '"/>';
    }
    return h;
  }
  function danceFloor() {
    var c = ['#FF4081', '#00E5FF', '#FFD740', '#69F0AE', '#E040FB', '#7C4DFF'], h = '';
    for (var i = 0; i < 12; i++) {
      h += '<rect x="' + (i * 20) + '" y="4" width="19" height="8.500" fill="' + c[i % 6] + '"/><rect x="' + (i * 20) + '" y="13.500" width="19" height="8.500" fill="' + c[(i + 3) % 6] + '"/>';
    }
    return h;
  }

  var party = {
    strip: svg(240, 24, flagTile()),
    ground: svg(240, 22, danceFloor()),
    corner: svg(250, 190,
      at(220, 142, 1, 0, speaker()) + at(160, 166, 1, 0, vinyl()) + at(112, 96, 1, -8, balloon('#FF4081')) + at(70, 112, 1, 8, balloon('#00E5FF')) + at(150, 74, .85, 6, balloon('#FFD740')) +
      at(36, 150, 1.2, -10, noteMusic('#69F0AE')) + at(190, 44, 1.2, 10, noteMusic('#E040FB'))),
    corner2: svg(170, 90, at(120, 60, 1, 20, vinyl()) + at(50, 44, 1.2, -10, noteMusic('#00E5FF')) + at(82, 20, .9, 15, noteMusic('#FF4081'))),
    top: svg(110, 90, at(70, 44, 1, 0, discoBall(20))),
    tile: svg(150, 150,
      at(28, 30, .75, -10, noteMusic('#E040FB'), .28) + at(110, 62, .7, 12, noteMusic('#00E5FF'), .28) + at(46, 116, .7, 0, noteMusic('#FFD740'), .24) +
      at(100, 14, 1, 0, star4('#FF4081', 5), .4) + at(128, 120, 1, 0, star4('#69F0AE', 4), .4) + at(14, 82, 1, 0, star4('#FFD740', 4), .4)),
    card: svg(48, 48, at(26, 26, 1.6, 10, noteMusic('#E040FB'), .32)),
    mark: svg(28, 28, at(14, 16, .52, 0, discoBall(19))),
    motion: 'fall', count: 26,
    pieces: [
      svg(12, 18, '<rect x="2" y="2" width="8" height="14" rx="1.500" fill="#FF4081"/>'),
      svg(12, 18, '<rect x="2" y="2" width="8" height="14" rx="1.500" fill="#00E5FF"/>'),
      svg(14, 14, '<circle cx="7" cy="7" r="5" fill="#FFD740"/>'),
      svg(12, 18, '<rect x="2" y="2" width="8" height="14" rx="1.500" fill="#69F0AE"/>'),
      svg(16, 16, at(8, 8, 1, 0, star4('#E040FB', 7))),
    ],
    extra: '<span class="disco-beams"></span><span class="disco-ball"><img alt="" src="' + uri(svg(120, 150, at(60, 90, 1, 0, discoBall(44)))) + '"></span>',
  };

  // ---------- Anniversaire : gateaux, bougies, ballons et confettis ----------
  function candle(c) {
    return '<rect x="-1.800" y="-12" width="3.600" height="12" rx="1" fill="' + c + '"/><path d="M-1.800-9l3.600-2M-1.800-5l3.600-2" stroke="#fff" stroke-width=".9"/>' +
      '<path d="M0-20C3-16 2.500-13 0-12.500-2.500-13-3-16 0-20z" fill="#FFB300"/><path d="M0-17.500C1.200-15.500 1-14 0-13.500-1-14-1.200-15.500 0-17.500z" fill="#FFF59D"/>';
  }
  function bdayCake() {
    return at(-14, -30, 1, 0, candle('#42A5F5')) + at(0, -33, 1, 0, candle('#FFD54F')) + at(14, -30, 1, 0, candle('#69F0AE')) +
      '<path d="M-24-30v18h48v-18z" fill="#FFE0B2"/><path d="M-26-32c0-3 52-3 52 0v5c0 3-5 3-5 0 0-2-5-2-5 0v3c0 3-5 3-5 0v-3c0-2-5-2-5 0v5c0 3-5 3-5 0v-5c0-2-5-2-5 0v2c0 3-5 3-5 0v-2c0-2-5-2-5 0v1c0 3-7 3-7 0z" fill="#F48FB1"/>' +
      '<path d="M-36-12v28h72v-28z" fill="#FFCC80"/><path d="M-36 2h72v4h-72z" fill="#C2185B" opacity=".7"/>' +
      '<path d="M-38-14c0-3 76-3 76 0v5c0 3-6 3-6 0 0-2-6-2-6 0v5c0 3-6 3-6 0v-5c0-2-6-2-6 0v3c0 3-6 3-6 0v-3c0-2-6-2-6 0v6c0 3-6 3-6 0v-6c0-2-6-2-6 0v2c0 3-6 3-6 0v-2c0-2-6-2-6 0v4c0 3-8 3-8 0z" fill="#FF80AB"/>' +
      '<g fill="#FFD54F"><circle cx="-24" cy="10" r="1.800"/><circle cx="4" cy="12" r="1.800"/></g><g fill="#42A5F5"><circle cx="-8" cy="11" r="1.800"/><circle cx="22" cy="10" r="1.800"/></g>' +
      '<path d="M-44 16h88c2 0 2 4 0 4h-88c-2 0-2-4 0-4z" fill="#fff" stroke="#E0C8D4" stroke-width="1"/>';
  }
  function gift(c1, c2) {
    return '<rect x="-13" y="-8" width="26" height="20" rx="2" fill="' + c1 + '"/><rect x="-15" y="-13" width="30" height="7" rx="2" fill="' + c1 + '" stroke="' + c2 + '" stroke-width=".8"/><path d="M0-13v25" stroke="' + c2 + '" stroke-width="5"/>' +
      '<path d="M0-13C-9-22-13-14-5-13zM0-13C9-22 13-14 5-13z" fill="' + c2 + '"/>';
  }
  function cupcakeMini() {
    return '<path d="M-7 1h14l-2 9H-5z" fill="#FFCC80"/><path d="M-9 1c-2-6 3-8 5-7 1-5 7-5 8 0 2-1 7 1 5 7z" fill="#FF80AB"/><circle cy="-8" r="2.200" fill="#D81B3C"/>';
  }
  var birthday = {
    strip: svg(240, 26,
      '<path d="M0 3Q60 9 120 3T240 3" fill="none" stroke="#C2185B" stroke-width="1.500"/>' +
      '<path d="M6 5h24L18 21z" fill="#FF4081"/><path d="M46 7h24L58 23z" fill="#FFD54F"/><path d="M86 7h24L98 23z" fill="#42A5F5"/><path d="M126 5h24L138 21z" fill="#69F0AE"/><path d="M166 7h24L178 23z" fill="#FF9100"/><path d="M206 7h24L218 23z" fill="#BA68C8"/>'),
    ground: svg(200, 22,
      '<path d="M0 22V12c5 5 10 5 15 0s10-5 15 0 10 5 15 0 10-5 15 0 10 5 15 0 10-5 15 0 10 5 15 0 10-5 15 0 10 5 15 0 10-5 15 0 10 5 15 0 10-5 15 0 10 5 15 0v10z" fill="#FF80AB"/>' +
      '<g fill="#FFD54F"><circle cx="20" cy="18" r="1.500"/><circle cx="110" cy="19" r="1.500"/></g><g fill="#fff"><circle cx="55" cy="18" r="1.500"/><circle cx="150" cy="18" r="1.500"/></g><g fill="#42A5F5"><circle cx="85" cy="18" r="1.500"/><circle cx="185" cy="19" r="1.500"/></g>'),
    corner: svg(240, 190,
      at(150, 150, 1.25, 0, bdayCake()) + at(48, 172, 1, -4, gift('#42A5F5', '#FFD54F')) + at(222, 176, .8, 5, gift('#69F0AE', '#E91E63')) +
      at(44, 70, 1.1, -8, balloon('#FF4081')) + at(82, 50, .95, 6, balloon('#FFD54F')) + at(14, 110, .8, -4, balloon('#42A5F5'))),
    corner2: svg(170, 90, at(60, 62, 1.5, 0, cupcakeMini()) + at(120, 66, .9, 4, gift('#FF4081', '#FFD54F')) + at(30, 22, 1, 0, star4('#FFD54F', 6))),
    top: svg(120, 80, at(84, 26, .7, 6, balloon('#FF4081')) + at(52, 30, .6, -6, balloon('#42A5F5'))),
    tile: svg(150, 150,
      at(30, 30, .9, -10, cupcakeMini(), .28) + at(112, 66, 1, 0, star4('#FFD54F', 6), .45) + at(40, 112, .8, 8, candle('#42A5F5'), .3) + at(120, 124, 1, 0, star4('#FF4081', 5), .35)),
    card: svg(48, 48, at(24, 26, 1.5, 8, cupcakeMini(), .32)),
    mark: svg(28, 28, at(14, 16, 1.1, 0, cupcakeMini())),
    motion: 'fall', count: 24,
    pieces: [
      svg(12, 18, '<rect x="2" y="2" width="8" height="14" rx="1.500" fill="#FF4081"/>'),
      svg(12, 18, '<rect x="2" y="2" width="8" height="14" rx="1.500" fill="#42A5F5"/>'),
      svg(14, 14, '<circle cx="7" cy="7" r="5" fill="#FFD54F"/>'),
      svg(12, 18, '<rect x="2" y="2" width="8" height="14" rx="1.500" fill="#69F0AE"/>'),
      svg(20, 20, at(10, 10, 1, 0, star4('#FF9100', 9))),
    ],
  };

  // ---------- Boulangerie : le theme du niveau 100 ----------
  function baguette() {
    return '<rect x="-34" y="-7" width="68" height="14" rx="7" fill="#C9822F"/><rect x="-32" y="-6" width="64" height="7" rx="3.500" fill="#E3A957"/>' +
      '<path d="M-22-5l6 8M-8-5l6 8M6-5l6 8M20-5l5 7" stroke="#FBE6BC" stroke-width="2.600" stroke-linecap="round"/>';
  }
  function croissant() {
    return '<path d="M-21 9C-25-6-13-17 0-17S25-6 21 9C20 12 16 12 15 9 13 1 7-3 0-3S-13 1-15 9C-16 12-20 12-21 9z" fill="#D9963F"/>' +
      '<path d="M-10-14C-5-16 5-16 10-14" fill="none" stroke="#F4CD89" stroke-width="2.600" stroke-linecap="round"/>' +
      '<path d="M-7-16L-5-3M7-16L5-3M-17-8L-10 1M17-8L10 1" stroke="#9C5C22" stroke-width="1.700" stroke-linecap="round"/>';
  }
  function loaf() {
    return '<path d="M-24 9C-28-8-13-18 0-18S28-8 24 9C23 13 21 14 17 14H-17C-21 14-23 13-24 9z" fill="#B9772F"/>' +
      '<path d="M-20 0C-18-9-9-14 0-14" fill="none" stroke="#D9A25A" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M-10-11C-14-5-14 1-11 6M1-13C-3-6-3 1 0 7M12-11C8-5 8 1 11 6" fill="none" stroke="#F7E3B8" stroke-width="2.600" stroke-linecap="round"/>';
  }
  function wheat() {
    var h = '<path d="M0 26V-16" stroke="#B88A2E" stroke-width="1.600" stroke-linecap="round"/><ellipse cy="-18" rx="2.200" ry="4.200" fill="#E6B94A"/>';
    for (var y = -13; y < 8; y += 6) {
      h += '<ellipse cx="-3.600" cy="' + y + '" rx="2.200" ry="4.200" transform="rotate(-24 -3.600 ' + y + ')" fill="#E6B94A"/><ellipse cx="3.600" cy="' + y + '" rx="2.200" ry="4.200" transform="rotate(24 3.600 ' + y + ')" fill="#D9A93B"/>';
    }
    return h;
  }
  function pretzel() {
    return '<path d="M-11 10C-22-2-13-15-4-10 2-7 4 3 10 10M11 10C22-2 13-15 4-10-2-7-4 3-10 10" fill="none" stroke="#9C5C22" stroke-width="5.500" stroke-linecap="round"/>' +
      '<g fill="#FFF8E8"><circle cx="-13" cy="-5" r="1"/><circle cx="-6" cy="-9" r="1"/><circle cx="13" cy="-4" r="1"/><circle cx="7" cy="-9" r="1"/><circle cx="-1" cy="-3" r="1"/></g>';
  }
  function breadBasket() {
    return at(-12, -14, 1, -68, baguette()) + at(12, -14, 1, -112, baguette()) + at(0, -6, .6, 0, loaf()) +
      '<path d="M-36 0H36L27 30H-27z" fill="#B57B3E"/><path d="M-32 9H32M-29 18H29M-26 26H26M-22 0L-17 30M-8 0L-6 30M8 0L6 30M22 0L17 30" stroke="#8A5A2A" stroke-width="1.600"/>' +
      '<rect x="-39" y="-5" width="78" height="8" rx="4" fill="#8A5A2A"/>';
  }
  function flourSack() {
    return '<path d="M-20 28C-28 8-24-12-12-18H12C24-12 28 8 20 28z" fill="#FBF3E3" stroke="#D9C7A8" stroke-width="1.500"/><path d="M-12-18C-8-23-4-20 0-23 4-20 8-23 12-18z" fill="#EFE3CB" stroke="#D9C7A8" stroke-width="1.200"/><path d="M-13-16H13" stroke="#B57B3E" stroke-width="2.500"/>' +
      at(0, 6, .6, 0, wheat());
  }
  function awning() {
    var h = '';
    for (var i = 0; i < 6; i++) h += '<path d="M' + (i * 20) + ' 0h20v13a10 8 0 0 1-20 0z" fill="' + (i % 2 ? '#FFF4DE' : '#A8602A') + '"/>';
    return h;
  }

  var bakery = {
    strip: svg(120, 24, awning()),
    ground: svg(240, 22,
      '<rect y="12" width="240" height="10" fill="#A8703A"/><path d="M0 12H240" stroke="#7A4E24" stroke-width="2"/><path d="M0 17H60M84 18H160M186 17H240" stroke="#8A5A2A" stroke-width="1"/>' +
      at(36, 8, .42, 0, croissant()) + at(92, 7, .4, 0, loaf()) + at(158, 7, .42, -4, baguette()) + at(214, 8, .42, 0, croissant())),
    corner: svg(240, 190,
      '<path d="M0 190c26-14 66-22 116-22s94 8 124 20v2z" fill="#E9CFA0"/>' +
      at(150, 150, 1.2, 0, breadBasket()) + at(52, 158, 1, -3, flourSack()) +
      at(218, 150, 1.05, 8, wheat()) + at(204, 158, .9, -6, wheat()) +
      at(96, 180, .85, 0, croissant()) + at(216, 180, .7, 0, loaf())),
    corner2: svg(170, 90,
      at(46, 64, 1, 0, loaf()) + at(112, 66, .95, 0, croissant()) + at(148, 40, .9, 12, wheat()) + at(86, 26, .7, -14, baguette())),
    top: svg(150, 70,
      '<path d="M150 6H24" stroke="#7A4E24" stroke-width="3" stroke-linecap="round"/><path d="M122 6V16M78 6V14M42 6V16" stroke="#7A4E24" stroke-width="1.600"/>' +
      at(122, 32, 1, 0, pretzel()) + at(78, 28, .9, 180, croissant()) + at(42, 30, .85, 0, pretzel())),
    tile: svg(150, 150,
      at(32, 32, .75, -12, croissant(), .22) + at(112, 58, .6, 25, wheat(), .3) + at(44, 112, .55, -30, baguette(), .22) + at(116, 122, .6, 0, pretzel(), .2)),
    card: svg(48, 48, at(26, 28, .95, -10, croissant(), .3)),
    mark: svg(28, 28, at(14, 16, .55, 0, croissant())),
    motion: 'fall', count: 12,
    pieces: [
      svg(30, 30, at(15, 17, .55, 0, croissant())),
      svg(24, 24, at(12, 12, .75, 30, '<ellipse rx="2.800" ry="5" fill="#E6B94A"/><path d="M0-4V4" stroke="#B88A2E" stroke-width=".7"/>')),
      svg(12, 12, '<circle cx="6" cy="6" r="3" fill="#FFF8E8"/>'),
      svg(34, 34, at(17, 17, .34, 40, baguette())),
    ],
  };

  var THEMES = { birthday: birthday, spring: spring, summer: summer, winter: winter, fall: fall, space: space, party: party, bakery: bakery };
  var VARS = { strip: '--decor-strip', ground: '--decor-ground', corner: '--decor-corner', corner2: '--decor-corner2', top: '--decor-top', tile: '--decor-tile', card: '--decor-card', mark: '--decor-mark' };
  var applied = null;

  function buildPieces(d) {
    var uris = d.pieces.map(uri);
    var h = '';
    for (var i = 0; i < d.count; i++) {
      var src = uris[i % uris.length];
      var r = (i * 0.618034) % 1; // reparti regulierement, mais sans en avoir l'air
      var r2 = (i * 0.754877) % 1;
      if (d.motion === 'fly') {
        h += '<span class="dp dp-fly" style="--y:' + (10 + r2 * 34).toFixed(1) + 'vh;--d:' + (44 + r * 30).toFixed(0) + 's;--dl:-' + (r * 70).toFixed(0) + 's;--sz:' + (26 + r2 * 16).toFixed(0) + 'px;background-image:url(&quot;' + src + '&quot;)"></span>';
      } else {
        var small = d.motion === 'snow' || d.motion === 'twinkle';
        var size = small ? 8 + r2 * 16 : 14 + r2 * 16;
        h += '<span class="dp dp-' + d.motion + '" style="--x:' + (r * 100).toFixed(1) + '%;--y:' + (r2 * 92).toFixed(0) + 'vh;--d:' + ((small ? 11 : 17) + r2 * 11).toFixed(1) + 's;--dl:-' + (r * 28).toFixed(1) + 's;--sw:' + (18 + r * 46).toFixed(0) + 'px;--sp:' + (i % 2 ? '' : '-') + (120 + r2 * 220).toFixed(0) + 'deg;--sz:' + size.toFixed(0) + 'px;background-image:url(&quot;' + src + '&quot;)"></span>';
      }
    }
    return h;
  }

  function apply(theme) {
    if (applied === theme) return;
    applied = theme;
    var root = document.documentElement;
    var layer = document.getElementById('decor-layer');
    var d = THEMES[theme];
    if (!d) {
      root.removeAttribute('data-decor');
      Object.keys(VARS).forEach(function(k) { root.style.removeProperty(VARS[k]); });
      if (layer) layer.innerHTML = '';
      return;
    }
    root.setAttribute('data-decor', theme);
    Object.keys(VARS).forEach(function(k) {
      if (d[k]) root.style.setProperty(VARS[k], url(d[k]));
      else root.style.setProperty(VARS[k], 'none');
    });
    if (layer) layer.innerHTML = buildPieces(d) + (d.extra || '');
  }

  // Pour l'apercu des themes dans les reglages
  function mark(theme) {
    var d = THEMES[theme];
    return d ? '<img class="theme-mark" alt="" src="' + uri(d.mark) + '">' : '';
  }

  return { apply: apply, mark: mark };
})();
