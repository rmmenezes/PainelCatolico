// Ilustrações originais em SVG (arte sacra estilizada). Sem imagens externas.
window.SACRED = (function () {
  'use strict';
  var n = 0;
  var C = { navy: '#151a3d', deep: '#0a0d22', gold: '#d9b45f', gold2: '#f3e2ad', cream: '#f7f0e0', wine: '#8a2a3b', blue: '#35479a', teal: '#2d6f7c', green: '#3f6b4f' };

  // Estrelas pseudoaleatórias estáveis
  function stars(count, seed, h) {
    var s = '', x = seed;
    for (var i = 0; i < count; i++) {
      x = (x * 9301 + 49297) % 233280; var px = x / 233280 * 400;
      x = (x * 9301 + 49297) % 233280; var py = x / 233280 * (h || 150);
      x = (x * 9301 + 49297) % 233280; var r = 0.5 + x / 233280 * 1.3;
      s += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="' + r.toFixed(2) + '" fill="#fff" opacity="' + (0.35 + r / 3).toFixed(2) + '"/>';
    }
    return s;
  }
  function rays(cx, cy, count, len, op, id) {
    var s = '<g opacity="' + op + '">';
    for (var i = 0; i < count; i++) {
      var a = i / count * Math.PI * 2, a2 = a + Math.PI / count * 0.5;
      s += '<path d="M' + cx + ' ' + cy + 'L' + (cx + Math.cos(a) * len).toFixed(1) + ' ' + (cy + Math.sin(a) * len).toFixed(1) + 'L' + (cx + Math.cos(a2) * len).toFixed(1) + ' ' + (cy + Math.sin(a2) * len).toFixed(1) + 'Z" fill="url(#ry' + id + ')"/>';
    }
    return s + '</g>';
  }
  function base(id, top, bot, glow, gx, gy) {
    return '<defs><linearGradient id="bg' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + top + '"/><stop offset="1" stop-color="' + bot + '"/></linearGradient>' +
      '<radialGradient id="gl' + id + '"><stop offset="0" stop-color="' + (glow || C.gold2) + '" stop-opacity=".6"/><stop offset="1" stop-color="' + (glow || C.gold2) + '" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="ry' + id + '" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(' + (gx || 200) + ' ' + (gy || 110) + ') scale(260)"><stop offset="0" stop-color="' + C.gold2 + '" stop-opacity=".5"/><stop offset="1" stop-color="' + C.gold2 + '" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="gd' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e3a6"/><stop offset=".5" stop-color="' + C.gold + '"/><stop offset="1" stop-color="#9c7424"/></linearGradient>' +
      '</defs><rect width="400" height="240" fill="url(#bg' + id + ')"/>';
  }
  function svg(inner, label, vb) {
    return '<svg class="art" viewBox="' + (vb || '0 0 400 240') + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + label + '">' + inner + '</svg>';
  }

  var draw = {
    rosary: function (i) {
      var s = base(i, '#1b2150', C.deep) + stars(40, 7) + '<circle cx="200" cy="100" r="140" fill="url(#gl' + i + ')"/>';
      for (var k = 0; k < 40; k++) {
        var a = k / 40 * Math.PI * 2 + Math.PI / 2, big = k % 11 === 0 && k !== 0;
        if (k === 0) continue;
        var x = 200 + Math.cos(a) * 92, y = 82 + Math.sin(a) * 56;
        s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (big ? 6.5 : 4.6) + '" fill="url(#gd' + i + ')"/>';
      }
      s += '<path d="M200 138 Q200 150 200 160" stroke="' + C.gold + '" stroke-width="1.2" fill="none"/>';
      s += '<circle cx="200" cy="140" r="7" fill="url(#gd' + i + ')" stroke="#fff4" /><circle cx="200" cy="158" r="4.6" fill="url(#gd' + i + ')"/><circle cx="200" cy="170" r="4.6" fill="url(#gd' + i + ')"/><circle cx="200" cy="182" r="4.6" fill="url(#gd' + i + ')"/>';
      s += '<rect x="195.5" y="192" width="9" height="42" rx="2" fill="url(#gd' + i + ')"/><rect x="184" y="202" width="32" height="9" rx="2" fill="url(#gd' + i + ')"/>';
      return svg(s, 'Terço dourado');
    },
    dove: function (i) {
      var s = base(i, '#26336e', '#121634', null, 200, 40) + rays(200, 40, 18, 260, 0.55, i) + '<circle cx="200" cy="60" r="120" fill="url(#gl' + i + ')"/>' + stars(18, 3, 200);
      s += '<g transform="translate(95 60) scale(1.05)">' +
        '<path d="M100 78C110 50 130 25 165 10C152 40 142 60 122 72Z" fill="#dcd6ea"/>' +
        '<path d="M20 95L55 85C70 80 85 78 100 78C95 55 80 30 55 8C90 20 115 45 122 72C130 62 140 55 152 54C160 54 166 58 168 62L181 65L168 69C164 77 156 84 144 90C120 104 90 108 60 102L22 112L40 100Z" fill="#fbf8f1"/>' +
        '<circle cx="158" cy="60" r="2.2" fill="' + C.navy + '"/>' +
        '<path d="M181 65C190 70 196 78 198 88" stroke="' + C.green + '" stroke-width="2" fill="none"/><ellipse cx="192" cy="76" rx="6" ry="2.6" transform="rotate(40 192 76)" fill="#6d9a62"/><ellipse cx="197" cy="86" rx="6" ry="2.6" transform="rotate(70 197 86)" fill="#6d9a62"/>' +
        '</g>';
      return svg(s, 'Pomba do Espírito Santo');
    },
    candle: function (i) {
      var s = base(i, '#1a1433', '#07081a', '#ffcf7a', 200, 80) + '<circle cx="200" cy="90" r="150" fill="url(#gl' + i + ')"/>';
      s += '<defs><linearGradient id="wx' + i + '" x1="0" x2="1"><stop offset="0" stop-color="#e8dcc0"/><stop offset=".45" stop-color="#fffaf0"/><stop offset="1" stop-color="#cdbf9f"/></linearGradient><radialGradient id="fl' + i + '" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#ffe7a0"/><stop offset="1" stop-color="#f0a53a"/></radialGradient></defs>';
      [[140, 150, 26], [200, 112, 32], [260, 160, 24]].forEach(function (c) {
        var x = c[0], top = c[1], w = c[2];
        s += '<circle cx="' + x + '" cy="' + (top - 22) + '" r="' + (w * 1.1) + '" fill="#ffd98a" opacity=".18"/>';
        s += '<rect x="' + (x - w / 2) + '" y="' + top + '" width="' + w + '" height="' + (228 - top) + '" rx="3" fill="url(#wx' + i + ')"/>';
        s += '<path d="M' + (x - w / 2) + ' ' + (top + 2) + 'q4 10 8 0q2 14 6 0" fill="#fffaf0"/>';
        s += '<path d="M' + x + ' ' + (top - 36) + 'C' + (x + 9) + ' ' + (top - 22) + ' ' + (x + 9) + ' ' + (top - 10) + ' ' + x + ' ' + (top - 3) + 'C' + (x - 9) + ' ' + (top - 10) + ' ' + (x - 9) + ' ' + (top - 22) + ' ' + x + ' ' + (top - 36) + 'Z" fill="url(#fl' + i + ')"/>';
        s += '<path d="M' + x + ' ' + (top - 3) + 'v4" stroke="#3a2a14" stroke-width="1.4"/>';
      });
      s += '<ellipse cx="200" cy="230" rx="130" ry="10" fill="#b8892b" opacity=".5"/>';
      return svg(s, 'Velas acesas');
    },
    book: function (i) {
      var s = base(i, '#2b2352', '#0f1030', null, 200, 150) + rays(200, 150, 16, 260, 0.5, i) + '<circle cx="200" cy="140" r="120" fill="url(#gl' + i + ')"/>' + stars(20, 11, 90);
      s += '<path d="M200 160C170 146 130 142 92 150L92 212C130 204 170 206 200 220Z" fill="' + C.cream + '"/><path d="M200 160C230 146 270 142 308 150L308 212C270 204 230 206 200 220Z" fill="#efe5cf"/>';
      s += '<path d="M200 160V220" stroke="#b9a57a" stroke-width="1.2"/><path d="M92 212C130 204 170 206 200 220C230 206 270 204 308 212L308 218C270 210 230 212 200 226C170 212 130 210 92 218Z" fill="' + C.wine + '"/>';
      for (var k = 0; k < 5; k++) { var y = 162 + k * 9; s += '<path d="M108 ' + y + 'C140 ' + (y - 6) + ' 170 ' + (y - 3) + ' 190 ' + (y + 5) + '" stroke="#b9a57a" stroke-width="1" fill="none" opacity=".7"/><path d="M210 ' + (y + 5) + 'C230 ' + (y - 3) + ' 260 ' + (y - 6) + ' 292 ' + y + '" stroke="#b9a57a" stroke-width="1" fill="none" opacity=".7"/>'; }
      s += '<rect x="196" y="58" width="8" height="54" rx="2" fill="url(#gd' + i + ')"/><rect x="181" y="72" width="38" height="8" rx="2" fill="url(#gd' + i + ')"/>';
      return svg(s, 'Bíblia aberta com luz');
    },
    heart: function (i) {
      var s = base(i, '#3a1426', '#12081a', '#ffb88a', 200, 120) + rays(200, 120, 24, 260, 0.7, i) + '<circle cx="200" cy="125" r="110" fill="url(#gl' + i + ')"/>';
      s += '<defs><radialGradient id="ht' + i + '" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#e45d6e"/><stop offset="1" stop-color="#7a1a2b"/></radialGradient><radialGradient id="fl' + i + '" cx=".5" cy=".8" r=".7"><stop offset="0" stop-color="#fff2c0"/><stop offset="1" stop-color="#f09a30"/></radialGradient></defs>';
      s += '<path d="M200 86C192 70 196 56 206 44C204 58 214 62 212 76C218 70 220 64 219 58C228 70 224 84 214 92Z" fill="url(#fl' + i + ')"/>';
      s += '<rect x="197" y="22" width="6" height="30" rx="1.5" fill="url(#gd' + i + ')"/><rect x="189" y="29" width="22" height="6" rx="1.5" fill="url(#gd' + i + ')"/>';
      s += '<path d="M200 206C150 176 124 146 134 118C144 92 180 90 200 116C220 90 256 92 266 118C276 146 250 176 200 206Z" fill="url(#ht' + i + ')"/>';
      s += '<ellipse cx="200" cy="138" rx="68" ry="14" fill="none" stroke="#5a3b1c" stroke-width="4"/><ellipse cx="200" cy="138" rx="68" ry="14" fill="none" stroke="' + C.gold + '" stroke-width="1.5" stroke-dasharray="3 5"/>';
      s += '<path d="M172 112C176 104 184 102 190 106" stroke="#fff" stroke-opacity=".4" stroke-width="3" fill="none" stroke-linecap="round"/>';
      return svg(s, 'Sagrado Coração');
    },
    moon: function (i) {
      var s = base(i, '#0c1440', '#1c2a5e') + stars(70, 5, 170);
      s += '<defs><mask id="mk' + i + '"><rect width="400" height="240" fill="#fff"/><circle cx="302" cy="54" r="30" fill="#000"/></mask></defs>';
      s += '<circle cx="290" cy="62" r="70" fill="url(#gl' + i + ')"/><circle cx="288" cy="62" r="30" fill="' + C.gold2 + '" mask="url(#mk' + i + ')"/>';
      s += '<path d="M0 190C60 160 120 170 180 185C240 200 320 165 400 175V240H0Z" fill="#141a3f"/>';
      s += '<path d="M0 210C80 190 150 200 220 212C290 224 350 200 400 206V240H0Z" fill="#0a0e26"/>';
      s += '<g transform="translate(110 150)"><path d="M0 32V12L14 0L28 12V32Z" fill="#0a0e26"/><rect x="11" y="-18" width="6" height="20" fill="#0a0e26"/><rect x="8" y="-12" width="12" height="4" fill="#0a0e26"/><rect x="10" y="16" width="8" height="10" rx="4" fill="#ffd98a"/></g>';
      return svg(s, 'Noite estrelada com capela');
    },
    lily: function (i) {
      var s = base(i, '#e9d9b0', '#9fb58f', '#fff6d8', 300, 40) + '<circle cx="300" cy="40" r="130" fill="url(#gl' + i + ')"/>';
      s += '<path d="M0 180C100 160 200 170 400 150V240H0Z" fill="#7d9b72"/><path d="M0 205C120 190 260 200 400 185V240H0Z" fill="#5f7f58"/>';
      [[120, 70, 1], [200, 55, 1.15], [285, 85, .9]].forEach(function (l) {
        var x = l[0], y = l[1], k = l[2];
        s += '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')"><path d="M0 40C2 90 -4 130 0 175" stroke="#4f7a45" stroke-width="3" fill="none"/>' +
          '<path d="M0 120C-18 104 -30 104 -40 112C-26 118 -14 122 0 124" fill="#6b9a5c"/><path d="M0 95C18 80 30 82 38 90C24 96 12 98 0 99" fill="#6b9a5c"/>' +
          '<path d="M0 44C-14 30 -30 12 -26 -4C-14 6 -6 20 0 36Z" fill="#fffdf6"/><path d="M0 44C14 30 30 12 26 -4C14 6 6 20 0 36Z" fill="#f4eee0"/><path d="M0 40C-6 22 -4 0 0 -14C4 0 6 22 0 40Z" fill="#fff"/>' +
          '<path d="M0 36L-6 14M0 36L6 14M0 36V8" stroke="#c99a2e" stroke-width="1.2"/><circle cx="-6" cy="13" r="2" fill="#b8892b"/><circle cx="6" cy="13" r="2" fill="#b8892b"/><circle cx="0" cy="7" r="2" fill="#b8892b"/></g>';
      });
      s += '<path d="M40 60q8-6 16 0q8-6 16 0" stroke="#4a4a5a" stroke-width="1.8" fill="none"/><path d="M330 110q6-5 12 0q6-5 12 0" stroke="#4a4a5a" stroke-width="1.6" fill="none"/>';
      return svg(s, 'Lírios do campo');
    },
    halo: function (i) {
      var s = base(i, '#1d2a6a', '#0b1030', null, 200, 110) + rays(200, 110, 32, 260, 0.8, i) + '<circle cx="200" cy="110" r="120" fill="url(#gl' + i + ')"/>';
      for (var k = 0; k < 12; k++) {
        var a = k / 12 * Math.PI * 2 - Math.PI / 2, x = 200 + Math.cos(a) * 78, y = 110 + Math.sin(a) * 78;
        s += '<path d="M' + x.toFixed(1) + ' ' + (y - 7).toFixed(1) + 'l2 5 5 .5-4 3.5 1.5 5-4.5-3-4.5 3 1.5-5-4-3.5 5-.5Z" fill="' + C.gold2 + '"/>';
      }
      s += '<circle cx="200" cy="110" r="52" fill="none" stroke="url(#gd' + i + ')" stroke-width="5"/><circle cx="200" cy="110" r="44" fill="none" stroke="' + C.gold + '" stroke-width="1" opacity=".6"/>';
      s += '<text x="200" y="126" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="46" font-weight="700" fill="' + C.gold2 + '">M</text>';
      return svg(s, 'Coroa de doze estrelas');
    },
    // Glória: raios e auréola, sem letra (fundo das páginas dos santos)
    glory: function (i) {
      var s = base(i, '#1d2a6a', '#0b1030', null, 280, 110) + rays(280, 110, 32, 300, 0.7, i) + '<circle cx="280" cy="110" r="130" fill="url(#gl' + i + ')"/>' + stars(30, 13, 240);
      s += '<circle cx="280" cy="110" r="70" fill="none" stroke="url(#gd' + i + ')" stroke-width="4" opacity=".7"/><circle cx="280" cy="110" r="60" fill="none" stroke="#d9b45f" stroke-width="1" opacity=".4"/>';
      return svg(s, 'Glória dos santos');
    },
    // Vitral gótico com rosácea — ilustração principal (retrato)
    window: function (i) {
      var s = '<defs><linearGradient id="bg' + i + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f2760"/><stop offset="1" stop-color="#0a0d22"/></linearGradient>' +
        '<linearGradient id="lt' + i + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e2ad" stop-opacity=".55"/><stop offset="1" stop-color="#f3e2ad" stop-opacity="0"/></linearGradient>' +
        '<linearGradient id="gd' + i + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e3a6"/><stop offset=".5" stop-color="#d9b45f"/><stop offset="1" stop-color="#9c7424"/></linearGradient>' +
        '<radialGradient id="gl' + i + '"><stop offset="0" stop-color="#f3e2ad" stop-opacity=".7"/><stop offset="1" stop-color="#f3e2ad" stop-opacity="0"/></radialGradient>' +
        '<clipPath id="cp' + i + '"><path d="M90 470V210Q90 80 200 34Q310 80 310 210V470Z"/></clipPath></defs>';
      
      s += '<circle cx="200" cy="170" r="190" fill="url(#gl' + i + ')"/>';
      s += '<g clip-path="url(#cp' + i + ')"><rect x="80" y="20" width="240" height="460" fill="#141a44"/>';
      var cols = ['#35479a', '#8a2a3b', '#2d6f7c', '#d9b45f', '#5b3f8c', '#35479a', '#8a2a3b', '#2d6f7c', '#c98b2e', '#5b3f8c', '#35479a', '#8a2a3b', '#2d6f7c', '#d9b45f', '#5b3f8c', '#35479a'];
      for (var k = 0; k < 16; k++) {
        var a0 = k / 16 * Math.PI * 2, a1 = (k + 1) / 16 * Math.PI * 2;
        s += '<path d="M200 160L' + (200 + Math.cos(a0) * 84).toFixed(1) + ' ' + (160 + Math.sin(a0) * 84).toFixed(1) + 'A84 84 0 0 1 ' + (200 + Math.cos(a1) * 84).toFixed(1) + ' ' + (160 + Math.sin(a1) * 84).toFixed(1) + 'Z" fill="' + cols[k] + '" opacity=".92"/>';
      }
      for (k = 0; k < 8; k++) {
        var a = k / 8 * Math.PI * 2, x = 200 + Math.cos(a) * 60, y = 160 + Math.sin(a) * 60;
        s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="16" fill="' + (k % 2 ? '#e7c46e' : '#4f63c4') + '" stroke="#0d1030" stroke-width="3"/>';
      }
      s += '<circle cx="200" cy="160" r="84" fill="none" stroke="#0d1030" stroke-width="5"/><circle cx="200" cy="160" r="30" fill="#f3e2ad" stroke="#0d1030" stroke-width="4"/>';
      s += '<rect x="196" y="140" width="8" height="40" fill="#8a2a3b"/><rect x="184" y="152" width="32" height="8" fill="#8a2a3b"/>';
      // lancetas
      [[108, 180], [212, 180]].forEach(function (p) {
        var x0 = p[0];
        s += '<path d="M' + x0 + ' 470V300Q' + x0 + ' 262 ' + (x0 + 40) + ' 250Q' + (x0 + 80) + ' 262 ' + (x0 + 80) + ' 300V470Z" fill="#0d1030"/>';
        for (var r = 0; r < 6; r++) for (var c = 0; c < 3; c++) {
          var col = cols[(r * 3 + c + (x0 > 150 ? 5 : 0)) % cols.length];
          s += '<rect x="' + (x0 + 5 + c * 24.5) + '" y="' + (300 + r * 28) + '" width="21" height="24" fill="' + col + '" opacity=".85"/>';
        }
        s += '<path d="M' + (x0 + 5) + ' 296Q' + (x0 + 5) + ' 268 ' + (x0 + 40) + ' 257Q' + (x0 + 75) + ' 268 ' + (x0 + 75) + ' 296Z" fill="#e7c46e" opacity=".85"/>';
      });
      s += '</g>';
      s += '<path d="M90 470V210Q90 80 200 34Q310 80 310 210V470" fill="none" stroke="url(#gd' + i + ')" stroke-width="7"/>';
      s += '<path d="M78 480V206Q78 70 200 20Q322 70 322 206V480" fill="none" stroke="#d9b45f" stroke-opacity=".35" stroke-width="2"/>';
      s += '<path d="M110 470L20 480H380L290 470Z" fill="url(#lt' + i + ')"/>';
      return svg(s, 'Vitral gótico com rosácea', '0 0 400 480');
    }
  };

  // Medalhão de santo: iniciais sob auréola dourada.
  function medal(name, c) {
    n++; var i = n, ini = name.replace(/^(Santa|Santo|São|Beato)\s+/, '').split(/\s+/).filter(function (w) { return w.length > 2 && w[0] === w[0].toUpperCase(); }).slice(0, 2).map(function (w) { return w[0]; }).join('');
    var s = '<defs><radialGradient id="md' + i + '" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></radialGradient>' +
      '<linearGradient id="gd' + i + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e3a6"/><stop offset=".5" stop-color="#d9b45f"/><stop offset="1" stop-color="#9c7424"/></linearGradient></defs>' +
      '<circle cx="60" cy="60" r="58" fill="url(#md' + i + ')"/><circle cx="60" cy="60" r="54" fill="none" stroke="url(#gd' + i + ')" stroke-width="3"/>' +
      '<circle cx="60" cy="60" r="47" fill="none" stroke="#f3e2ad" stroke-opacity=".35" stroke-width="1" stroke-dasharray="2 4"/>' +
      '<ellipse cx="60" cy="30" rx="20" ry="5" fill="none" stroke="url(#gd' + i + ')" stroke-width="2.5"/>' +
      '<text x="60" y="78" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-size="38" font-weight="700" fill="#f7f0e0">' + ini + '</text>';
    return '<svg class="art" viewBox="0 0 120 120" role="img" aria-label="' + name + '">' + s + '</svg>';
  }

  return {
    medal: medal,
    draw: function (kind) { n++; return (draw[kind] || draw.halo)(n); },
    ornament: '<svg class="orn" viewBox="0 0 240 20" aria-hidden="true"><path d="M0 10H96M144 10H240" stroke="currentColor" stroke-width="1"/><path d="M120 2V18M113 8H127" stroke="currentColor" stroke-width="1.6"/><circle cx="104" cy="10" r="2" fill="currentColor"/><circle cx="136" cy="10" r="2" fill="currentColor"/></svg>'
  };
})();
