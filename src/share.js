// Gera imagens para redes sociais (Instagram: Story 9:16, Post 4:5, Quadrado) a partir de um texto,
// com as ilustrações do app, e compartilha pela folha nativa do celular (Web Share) ou baixa o PNG.
(function () {
  'use strict';
  var FORMATS = { story: [1080, 1920, 'Story'], post: [1080, 1350, 'Post'], quad: [1080, 1080, 'Quadrado'] };
  var STYLES = {
    noite: { name: 'Noite', bg: ['#1c2256', '#0a0d22'], ink: '#fbf6e8', soft: '#c8c6dd', gold: '#e6c677', artOp: 0.55 },
    pergaminho: { name: 'Pergaminho', bg: ['#fbf6ea', '#efe4cc'], ink: '#23243a', soft: '#5d5a6e', gold: '#a8781f', artOp: 0.9 },
    vitral: { name: 'Vitral', bg: ['#4a1426', '#120818'], ink: '#fbf2ea', soft: '#e0c9cf', gold: '#f0cf7a', artOp: 0.5 }
  };
  var state = { fmt: 'story', style: 'noite' }, cur = null, lastBlob = null;
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  function siteUrl() { return (location.host + location.pathname).replace(/index\.html$/, '').replace(/\/$/, ''); }

  function svgImage(svg, w, h) {
    return new Promise(function (res) {
      var s = svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" ');
      var img = new Image(); img.onload = function () { res(img); }; img.onerror = function () { res(null); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
    });
  }
  // Quebra o texto em linhas que cabem na largura, respeitando quebras de linha do original.
  function wrap(ctx, text, maxW) {
    var lines = [];
    text.split('\n').forEach(function (par) {
      if (!par.trim()) { lines.push(''); return; }
      var line = '';
      par.split(/\s+/).forEach(function (w) {
        var test = line ? line + ' ' + w : w;
        if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
      });
      lines.push(line);
    });
    while (lines.length && !lines[lines.length - 1]) lines.pop();
    return lines;
  }

  async function render(p) {
    var F = FORMATS[state.fmt], W = F[0], H = F[1], S = STYLES[state.style];
    var serif = cssVar('--serif') || 'Georgia, serif', sans = cssVar('--sans') || 'system-ui, sans-serif';
    try { await Promise.all([document.fonts.load('italic 500 60px ' + serif), document.fonts.load('600 60px ' + serif), document.fonts.load('600 30px ' + sans)]); } catch (e) {}
    var c = document.createElement('canvas'); c.width = W; c.height = H;
    var x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, S.bg[0]); g.addColorStop(1, S.bg[1]);
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    // ilustração no topo, esmaecida na direção do texto
    var artH = Math.round(H * (state.fmt === 'story' ? 0.36 : 0.32));
    if ((p.svg || p.art) && window.SACRED) {
      var img = await svgImage(p.svg || window.SACRED.draw(p.art), W, artH);
      if (img) {
        // a ilustração se dissolve no fundo por máscara de transparência (sem emenda visível)
        var a = document.createElement('canvas'); a.width = W; a.height = artH;
        var ax = a.getContext('2d'); ax.drawImage(img, 0, 0, W, artH);
        ax.globalCompositeOperation = 'destination-in';
        var mk = ax.createLinearGradient(0, 0, 0, artH); mk.addColorStop(0, 'rgba(0,0,0,1)'); mk.addColorStop(0.55, 'rgba(0,0,0,1)'); mk.addColorStop(1, 'rgba(0,0,0,0)');
        ax.fillStyle = mk; ax.fillRect(0, 0, W, artH);
        x.save(); x.globalAlpha = S.artOp; x.drawImage(a, 0, 0); x.restore();
      }
    }
    var pad = 96, top = artH + 40, bottom = H - (state.fmt === 'story' ? 260 : 200), boxW = W - pad * 2;
    // rótulo
    x.textAlign = 'center'; x.fillStyle = S.gold; x.font = '600 30px ' + sans;
    if (p.eyebrow) { x.save(); x.letterSpacing = '6px'; x.fillText(p.eyebrow.toUpperCase(), W / 2, top); x.restore(); top += 40; }
    // ornamento
    x.strokeStyle = S.gold; x.lineWidth = 2; x.beginPath(); x.moveTo(W / 2 - 120, top); x.lineTo(W / 2 - 28, top); x.moveTo(W / 2 + 28, top); x.lineTo(W / 2 + 120, top); x.stroke();
    x.beginPath(); x.moveTo(W / 2, top - 16); x.lineTo(W / 2, top + 16); x.moveTo(W / 2 - 10, top - 6); x.lineTo(W / 2 + 10, top - 6); x.stroke();
    top += 60;
    // texto de apoio (medido antes, para reservar espaço)
    x.font = 'italic 500 36px ' + serif;
    var subLines = p.sub ? wrap(x, p.sub, boxW).slice(0, 3) : [];
    var reserve = (p.ref ? 74 : 0) + (subLines.length ? subLines.length * 46 + 24 : 0);
    // texto principal: a maior fonte que caiba
    var text = (p.quote ? '“' + p.text + '”' : p.text), size = 76, lines, lh, avail = bottom - top - reserve;
    for (; size >= 30; size -= 2) {
      x.font = 'italic 500 ' + size + 'px ' + serif; lh = size * 1.32;
      lines = wrap(x, text, boxW);
      if (lines.length * lh <= avail) break;
    }
    var maxLines = Math.max(1, Math.floor(avail / lh));
    if (lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '') + '…'; }
    var blockH = lines.length * lh + reserve, y = top + Math.max(0, (bottom - top - blockH) / 2) + size;
    x.fillStyle = S.ink; x.font = 'italic 500 ' + size + 'px ' + serif;
    lines.forEach(function (l) { x.fillText(l, W / 2, y); y += lh; });
    if (p.ref) { x.fillStyle = S.gold; x.font = '600 34px ' + sans; x.fillText(p.ref, W / 2, y + 26); y += 74; }
    if (subLines.length) { x.fillStyle = S.soft; x.font = 'italic 500 36px ' + serif; y += 10; subLines.forEach(function (l) { x.fillText(l, W / 2, y); y += 46; }); }
    // rodapé com a marca
    var fy = H - (state.fmt === 'story' ? 170 : 90);
    x.fillStyle = S.gold; x.font = '600 44px ' + serif; x.fillText('✝  Paz em Oração', W / 2, fy);
    x.fillStyle = S.soft; x.font = '500 26px ' + sans; x.fillText(siteUrl(), W / 2, fy + 44);
    return new Promise(function (res) { c.toBlob(function (b) { res(b); }, 'image/png'); });
  }

  function filename() { return 'paz-em-oracao-' + (cur.slug || 'mensagem') + '-' + state.fmt + '.png'; }
  async function refresh() {
    var box = document.getElementById('shbox'), pv = box.querySelector('.sh-prev');
    pv.classList.add('busy');
    lastBlob = await render(cur);
    var url = URL.createObjectURL(lastBlob), im = pv.querySelector('img');
    if (im.dataset.url) URL.revokeObjectURL(im.dataset.url);
    im.src = url; im.dataset.url = url; pv.classList.remove('busy');
    box.querySelector('.sh-prev').style.aspectRatio = FORMATS[state.fmt][0] + '/' + FORMATS[state.fmt][1];
  }
  function segs(name, map, val) {
    return '<div class="segs" role="group" aria-label="' + name + '">' + Object.keys(map).map(function (k) { return '<button data-' + name + '="' + k + '" aria-pressed="' + (k === val) + '">' + (map[k][2] || map[k].name) + '</button>'; }).join('') + '</div>';
  }
  function draw() {
    var box = document.getElementById('shbox');
    box.querySelector('.sh-ctl').innerHTML = '<span class="ap-lbl">Formato</span>' + segs('fmt', FORMATS, state.fmt) + '<span class="ap-lbl">Estilo</span>' + segs('sty', STYLES, state.style);
    Array.prototype.forEach.call(box.querySelectorAll('[data-fmt]'), function (b) { b.onclick = function () { state.fmt = b.dataset.fmt; draw(); refresh(); }; });
    Array.prototype.forEach.call(box.querySelectorAll('[data-sty]'), function (b) { b.onclick = function () { state.style = b.dataset.sty; draw(); refresh(); }; });
  }
  function close() { var b = document.getElementById('shbox'); if (b) b.classList.remove('on'); document.removeEventListener('keydown', onKey); }
  function onKey(e) { if (e.key === 'Escape') close(); }
  function download() {
    var a = document.createElement('a'), url = URL.createObjectURL(lastBlob);
    a.href = url; a.download = filename(); document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
  }
  async function share() {
    if (!lastBlob) return;
    var file = new File([lastBlob], filename(), { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'Paz em Oração', text: (cur.text.length < 200 ? cur.text + (cur.ref ? ' (' + cur.ref + ')' : '') + '\n' : '') + siteUrl() }); } catch (e) { /* cancelado */ }
    } else download();
  }
  function open(p) {
    cur = p;
    var box = document.getElementById('shbox');
    if (!box) {
      box = document.createElement('div'); box.id = 'shbox'; box.className = 'shbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Compartilhar como imagem');
      box.innerHTML = '<div class="sh-card"><div class="ap-head"><h3>Compartilhar</h3><button class="icon-btn ap-x" data-close aria-label="Fechar">✕</button></div>' +
        '<div class="sh-body"><div class="sh-prev"><img alt="Prévia da imagem para compartilhar"></div><div><div class="sh-ctl"></div>' +
        '<div class="sh-btns"><button class="btn gold" data-go>Compartilhar</button><button class="btn ghost" data-dl>Baixar imagem</button></div>' +
        '<p class="note sh-tip">No celular, “Compartilhar” abre a lista de apps: escolha Instagram (Story ou Feed), WhatsApp ou outro.</p></div></div></div>';
      document.body.appendChild(box);
      box.onclick = function (e) { if (e.target === box || e.target.closest('[data-close]')) close(); };
      box.querySelector('[data-go]').onclick = share;
      box.querySelector('[data-dl]').onclick = download;
    }
    var canShareFiles = !!(navigator.canShare && window.File && navigator.canShare({ files: [new File([''], 'x.png', { type: 'image/png' })] }));
    box.querySelector('[data-go]').hidden = !canShareFiles;
    box.querySelector('.sh-tip').hidden = !canShareFiles;
    draw(); box.classList.add('on'); document.addEventListener('keydown', onKey);
    box.querySelector('[data-close]').focus();
    refresh();
  }

  var REG = {}, n = 0;
  window.Share = {
    open: open, render: render, state: state,
    // Botão que abre o compartilhamento do conteúdo informado.
    btn: function (p, label, cls) { var k = 's' + (++n); REG[k] = p; return '<button class="' + (cls || 'btn ghost sm') + ' sh-btn" data-share="' + k + '" aria-label="Compartilhar como imagem">' + '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13"/></svg>' + (label === '' ? '' : '<span>' + esc(label || 'Compartilhar') + '</span>') + '</button>'; }
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-share]'); if (!b) return;
    e.preventDefault(); e.stopPropagation(); var p = REG[b.dataset.share]; if (p) open(p);
  });
})();
