(function () {
  'use strict';
  var DEV = window.DEVOCIONAL, D = window.DATA, ARTS = window.ARTICLES, SAINTS = window.SAINTS, VS = window.VIASACRA, A = window.Ambient, app = document.getElementById('app');

  /* ---------- utilidades ---------- */
  function load(k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v === null ? def : v; } catch (e) { return def; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function dayIndex() { return Math.floor(Date.now() / 864e5); }
  function pid(id) { return D.prayers.filter(function (p) { return p.id === id; })[0]; }

  var ICONS = {
    home: '<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
    book: '<path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>',
    wind: '<path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7a2 2 0 1 1-2 2"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
    pen: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    help: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M4.9 4.9l4.3 4.3M14.8 14.8l4.3 4.3M14.8 9.2l4.3-4.3M4.9 19.1l4.3-4.3"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    mute: '<path d="M11 5L6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    beads: '<circle cx="12" cy="5" r="2"/><circle cx="6" cy="10" r="2"/><circle cx="18" cy="10" r="2"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    scroll: '<path d="M8 21h11a2 2 0 0 0 2-2v-1H10v1a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2h3M10 18V5a2 2 0 0 0-2-2h11a2 2 0 0 1 2 2v13"/>',
    moonstar: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
    play: '<path d="M8 5v14l11-7z"/>',
    pause: '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    saint: '<ellipse cx="12" cy="3.5" rx="4.5" ry="1.3"/><circle cx="12" cy="9" r="3.2"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    next: '<path d="M5 5l9 7-9 7zM18 5v14"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    cross: '<path d="M12 2v20M6 8h12"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    share: '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13"/>',
    tap: '<path d="M9 11V5a2 2 0 0 1 4 0v6M13 9a2 2 0 0 1 4 0v3a6 6 0 0 1-6 6h-1a5 5 0 0 1-4-2l-2-3a2 2 0 0 1 3-2l1 1"/>'
  };
  function ic(n) { return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[n] || '') + '</svg>'; }

  /* ---------- idioma ---------- */
  var lang = load('lang', 'pt');
  function para(t) { return '<p class="prayer">' + esc(t) + '</p>'; }
  // Renderiza um texto {pt, la} conforme o idioma escolhido (pt, la ou lado a lado)
  function body(o) {
    if (lang === 'pt' || (!o.la && lang === 'both')) return para(o.pt);
    if (!o.la) return para(o.pt) + '<p class="note">Sem versão latina tradicional; exibido em português.</p>';
    if (lang === 'la') return '<div lang="la">' + para(o.la) + '</div>';
    return '<div class="bi"><div><span class="lbl">Português</span>' + para(o.pt) + '</div><div lang="la"><span class="lbl">Latina</span>' + para(o.la) + '</div></div>';
  }
  function titleOf(p) { return (lang === 'la' && p.latin) ? p.latin : p.title; }
  function prayerCard(p, open) {
    var sub = (lang === 'both' && p.latin) ? '<span class="sub">' + esc(p.latin) + '</span>' : '';
    return '<details class="pray"' + (open ? ' open' : '') + '><summary><span class="pray-ic" aria-hidden="true">✝</span><span class="pt">' + esc(titleOf(p)) + sub + '</span><span class="tag">' + esc(p.cat) + '</span></summary><div class="inner">' + body(p) + '<div class="row" style="margin-top:10px">' + Share.btn({ eyebrow: 'Oração', text: lang === 'la' && p.la ? p.la : p.pt, ref: titleOf(p), art: 'candle', slug: p.id }) + '</div></div></details>';
  }
  function setLang(l) {
    lang = l; save('lang', l);
    syncLang();
    route();
  }

  /* ---------- temporizadores (limpos a cada troca de tela) ---------- */
  var timers = [];
  function every(fn, ms) { var t = setInterval(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearInterval); timers = []; }

  /* ---------- passo a passo genérico ---------- */
  function stepper(el, steps, opts) {
    var i = 0;
    function render() {
      var s = steps[i], last = i === steps.length - 1;
      el.innerHTML = '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + steps.length + '" aria-valuenow="' + (i + 1) + '"><i style="width:' + ((i + 1) / steps.length * 100) + '%"></i></div>' +
        '<p class="meta">Passo ' + (i + 1) + ' de ' + steps.length + '</p>' + s.html +
        '<div class="row" style="justify-content:center;margin-top:18px">' +
        '<button class="btn ghost" id="sp-prev"' + (i === 0 ? ' disabled' : '') + '>Anterior</button>' +
        '<button class="btn" id="sp-next">' + (last ? (opts.endLabel || 'Concluir') : 'Continuar') + '</button></div>';
      $('#sp-prev', el).onclick = function () { i--; render(); };
      $('#sp-next', el).onclick = function () { if (last) opts.onEnd(); else { i++; render(); } };
      if (s.after) s.after(el);
      Commons.hydrate(el);
    }
    render();
  }
  function doneCard(msg) {
    return '<div class="stage"><div class="step-n">✝</div><h3>Amém.</h3><p>' + msg + '</p><div class="row" style="justify-content:center"><a class="btn" href="#/praticas">Outras práticas</a><a class="btn ghost" href="#/">Início</a></div></div>';
  }

  /* ---------- telas ---------- */
  var NAV = [['', 'Início', 'home'], ['oracoes', 'Orações', 'book'], ['praticas', 'Práticas', 'heart'], ['viasacra', 'Via Sacra', 'cross', true], ['santos', 'Santos', 'saint'], ['leituras', 'Leituras', 'scroll']];

  var PRACTICES = [
    { id: 'terco', art: 'rosary', icon: 'beads', title: 'Santo Terço guiado', min: '20 min', desc: 'Reze o terço passo a passo, com os mistérios do dia e as orações em português e latim.' },
    { id: 'respirar', art: 'dove', icon: 'wind', title: 'Respirar com oração', min: '3–5 min', desc: 'Respiração guiada com uma frase de oração a cada ciclo. Ideal para a ansiedade.' },
    { id: 'aterramento', art: 'lily', icon: 'eye', title: 'Aterramento 5-4-3-2-1', min: '3 min', desc: 'Traga a mente ao presente usando os sentidos, com uma breve oração em cada passo.' },
    { id: 'lectio', art: 'book', icon: 'book', title: 'Lectio Divina', min: '10 min', desc: 'Leia, medite, reze e contemple uma passagem da Escritura, em português e latim.' },
    { id: 'silencio', art: 'candle', icon: 'timer', title: 'Silêncio diante de Deus', min: '3–10 min', desc: 'Um tempo de quietude com sino suave no início e no fim.' },
    { id: 'jaculatoria', art: 'heart', icon: 'tap', title: 'Oração do coração', min: 'livre', desc: 'Repita uma jaculatória com um toque a cada vez. Um contador simples, sem pressa.' },
    { id: 'viasacra', art: 'glory', icon: 'saint', title: 'Via Sacra guiada', min: '30 min', desc: 'As 14 estações com meditação para quem sofre, oração, Stabat Mater e obras de arte de cada estação.' },
    { id: 'misericordia', art: 'heart', icon: 'beads', title: 'Terço da Misericórdia', min: '10 min', desc: 'A oração ensinada a Santa Faustina, conta por conta: “Jesus, eu confio em Vós”.' },
    { id: 'exame', art: 'moon', icon: 'moonstar', title: 'Exame do dia', min: '8 min', desc: 'Um exame de fim de dia: gratidão, revisão sem julgamento, perdão e confiança.' }
  ];

  var ART_OF = { 'depressao-noite-escura': 'moon', 'luto': 'candle', 'solidao': 'lily', 'cuidar-de-quem-sofre': 'heart', 'via-sacra-de-quem-sofre': 'glory', 'kit-crise': 'dove', 'preocupacao-e-confianca': 'lily', 'ansiedade-e-fe': 'candle', 'mente-que-nao-para': 'rosary', 'noites-em-claro': 'moon', 'culpa-e-escrupulos': 'heart', 'santos-e-angustia': 'halo', 'fe-e-terapia': 'book' };
  function pcard(href, art, badge, title, desc, go) {
    return '<a class="pcard" href="' + href + '"><div class="cover">' + SACRED.draw(art) + (badge ? '<span class="badge">' + esc(badge) + '</span>' : '') + '</div>' +
      '<div class="txt"><h3>' + esc(title) + '</h3><p>' + esc(desc) + '</p><span class="go">' + esc(go || 'Abrir') + ' →</span></div></a>';
  }
  function practiceCard(x) { return pcard('#/praticas/' + x.id, x.art, x.min, x.title, x.desc, 'Começar'); }
  function articleCard(x) { return pcard('#/leituras/' + x.id, ART_OF[x.id], x.tag + ' · ' + x.minutes + ' min', x.title, x.lead, 'Ler'); }
  /* ---------- santos ---------- */
  function allQuotes() {
    var out = [];
    SAINTS.forEach(function (st) { st.quotes.forEach(function (q) { out.push({ q: q, s: st }); }); });
    return out;
  }
  function quoteText(q) { return (lang === 'la' && q.la) ? q.la : q.pt; }
  function quoteCard(x, big) {
    var q = x.q, st = x.s, sec = '';
    if (lang === 'both' && q.la) sec = '<p class="q-sec" lang="la">' + esc(q.la) + '</p>';
    else if (q.orig) sec = '<p class="q-sec">' + esc(q.orig) + '</p>';
    return '<figure class="qcard' + (big ? ' big' : '') + '">' + (big === 'feature' ? '<div class="q-bg">' + SACRED.draw('glory') + '</div>' : '') + '<blockquote>“' + esc(quoteText(q)) + '”</blockquote>' + sec +
      '<figcaption><a class="q-who" href="#/santos/' + st.id + '"><span class="q-medal">' + SACRED.medal(st.name, st.colors) + '</span><span><strong>' + esc(st.name) + '</strong><small>' + esc(q.src) + (q.attr ? ' · atribuída' : '') + '</small></span></a>' +
      Share.btn({ eyebrow: st.name, text: quoteText(q), ref: q.src + (q.attr ? ' (atribuída)' : ''), quote: true, art: 'glory', slug: st.id }, '', 'icon-btn q-copy') + '</figcaption></figure>';
  }
  function saintCard(st) {
    return '<a class="scard" href="#/santos/' + st.id + '"><span class="s-medal">' + SACRED.medal(st.name, st.colors) + '</span><span class="s-txt"><strong>' + esc(st.name) + '</strong><small>' + esc(st.dates) + ' · ' + esc(st.title) + '</small>' +
      '<em>“' + esc(st.quotes[0].pt.length > 95 ? st.quotes[0].pt.slice(0, 92).replace(/\s+\S*$/, '') + '…' : st.quotes[0].pt) + '”</em></span></a>';
  }
  function banner(art, eyebrow, title, desc, crumb) {
    return '<header class="pbanner"><div class="bg">' + SACRED.draw(art) + '</div><div class="in">' + (crumb ? '<a class="crumb" href="' + crumb[0] + '">← ' + crumb[1] + '</a><br>' : '') +
      '<span class="eyebrow">' + esc(eyebrow) + '</span><h2>' + esc(title) + '</h2>' + (desc ? '<p>' + esc(desc) + '</p>' : '') + '</div></header>';
  }

  var routes = {};

  routes[''] = function () {
    var r = D.reflections[dayIndex() % D.reflections.length], moods = load('moods', {}), sel = moods[today()];
    var nLa = D.prayers.filter(function (p) { return p.la; }).length;
    var feat = ['terco', 'respirar', 'aterramento', 'silencio'].map(function (id) { return PRACTICES.filter(function (x) { return x.id === id; })[0]; });
    feat[0] = Object.assign({}, feat[0], { title: 'Terço de hoje', desc: D.mysteries[todaySet()].name + '. Reze passo a passo, com as contas marcando o ritmo.' });
    app.innerHTML =
      '<section class="hero"><div class="hero-in"><div>' +
      '<span class="eyebrow">Oração · Silêncio · Esperança</span>' + SACRED.ornament +
      '<h1>Encontre <em>paz</em> em Deus, um passo de cada vez.</h1>' +
      '<p class="sub">Orações católicas em português e latim, práticas guiadas para acalmar a mente e leituras para quem convive com a ansiedade, com canto gregoriano ao fundo.</p>' +
      '<div class="hero-actions"><a class="btn gold lg" href="#/praticas/respirar">Respirar com oração</a><a class="btn ghost lg" href="#/oracoes/Ansiedade">Rezas para ansiedade</a></div>' +
      '<div class="stats"><div>' + D.prayers.length + '<span>orações</span></div><div>' + SAINTS.length + '<span>santos</span></div><div>' + nLa + '<span>em latim</span></div><div>' + PRACTICES.length + '<span>práticas guiadas</span></div><div>' + ARTS.length + '<span>leituras</span></div></div>' +
      '</div><div class="hero-art">' + SACRED.draw('window') + '</div></div></section>' +

      '<div class="wrap"><section class="blk">' + devCard(devOfDay()) + '</section>' + installCard() + '<section class="blk"><div class="grid two">' +
      '<div class="card refl"><div class="refl-art">' + SACRED.draw('lily') + '</div><span class="eyebrow">Reflexão do dia</span><p class="verse">“' + esc(r.verse) + '”<cite>' + esc(r.ref) + '</cite></p><p>' + esc(r.text) + '</p>' + Share.btn({ eyebrow: 'Reflexão do dia', text: r.verse, ref: r.ref, sub: r.text, quote: true, art: 'lily', slug: 'reflexao' }) + '</div>' +
      '<div class="card"><span class="eyebrow">Como você está agora?</span><p class="note" style="margin:.3em 0 0">Escolha e receba uma oração e uma prática.</p><div class="moods" role="group" aria-label="Humor">' +
      D.moods.map(function (m) { return '<button data-mood="' + m.id + '" aria-pressed="' + (sel === m.id) + '"><b>' + m.glyph + '</b>' + m.label + '</button>'; }).join('') + '</div><div id="mood-out"></div></div>' +
      '</div></section>' +

      '<section class="blk"><div class="sec-head"><div><span class="eyebrow">Práticas</span><h2>Para acalmar agora</h2><p>Exercícios curtos de oração para o corpo e a mente.</p></div><a class="more" href="#/praticas">Ver todas →</a></div>' +
      '<div class="grid">' + feat.map(practiceCard).join('') + '</div></section>' +

      '<section class="blk"><div class="band vs-band"><div class="bg">' + SACRED.station(12, 'death') + '</div><div class="in">' +
      '<span class="eyebrow">Quaresma e sextas-feiras</span><h2 style="color:#fbf6e8;margin:.2em 0">Via Sacra</h2><p style="color:#d5d3e6;max-width:48ch">As 14 estações com meditações para quem atravessa a dor, e um guia das grandes obras de arte e dos lugares onde rezar e fotografar o caminho da cruz.</p>' +
      '<div class="row" style="margin-top:18px"><a class="btn gold" href="#/praticas/viasacra">Rezar a Via Sacra</a><a class="btn ghost" href="#/viasacra">Guia de arte e lugares</a></div></div></div></section>' +

      '<section class="blk"><div class="sec-head"><div><span class="eyebrow">Os santos na tribulação</span><h2>Palavra dos santos</h2><p>Eles também conheceram o medo, a doença e a escuridão, e nos deixaram conselhos.</p></div><a class="more" href="#/santos">Ver todos os santos →</a></div>' +
      '<div class="saints-home">' + quoteCard(allQuotes()[dayIndex() % allQuotes().length], 'feature') + '<div class="scol">' + [0, 1, 2].map(function (k) { return saintCard(SAINTS[(dayIndex() * 3 + k) % SAINTS.length]); }).join('') + '</div></div></section>' +

      '<section class="blk"><div class="band"><div class="bg">' + SACRED.draw('dove') + '</div><div class="in">' +
      '<span class="eyebrow">Palavra de Deus</span><blockquote>“Deixo-vos a paz, dou-vos a minha paz. Não se perturbe o vosso coração.”</blockquote>' +
      '<p class="la">Pacem relinquo vobis, pacem meam do vobis… Non turbetur cor vestrum.</p><cite>JOÃO 14,27</cite>' +
      '<div class="row" style="margin-top:20px"><a class="btn gold" href="#/praticas/lectio">Fazer Lectio Divina</a>' + Share.btn({ eyebrow: 'Palavra de Deus', text: 'Deixo-vos a paz, dou-vos a minha paz. Não se perturbe o vosso coração.', ref: 'João 14,27', quote: true, art: 'dove', slug: 'jo-14-27' }, 'Compartilhar', 'btn ghost') + '</div></div></div></section>' +

      '<section class="blk"><div class="sec-head"><div><span class="eyebrow">Leituras</span><h2>Fé e ansiedade</h2><p>Textos breves para compreender e acolher o que você sente.</p></div><a class="more" href="#/leituras">Ver todas →</a></div>' +
      '<div class="grid">' + ARTS.slice(0, 4).map(articleCard).join('') + '</div></section>' +

      '<section class="blk"><div class="card crisis"><div class="row" style="justify-content:space-between"><div style="max-width:60ch"><h3>Está difícil demais agora?</h3><p>Você não precisa passar por isso sozinho(a). O CVV atende 24 horas, de graça e em sigilo.</p></div>' +
      '<div class="row"><a class="btn" href="tel:188">Ligar 188</a><a class="btn outline-w" href="#/ajuda">Outros contatos</a></div></div></div></section></div>';
    function show(id) {
      var m = D.moods.filter(function (x) { return x.id === id; })[0], p = pid(m.prayer);
      var links = (m.act || []).map(function (a) { var pr = PRACTICES.filter(function (x) { return x.id === a; })[0]; return pr ? '<a class="btn ghost" href="#/praticas/' + a + '">' + esc(pr.title) + '</a>' : ''; }).join(' ');
      $('#mood-out').innerHTML = '<p style="margin-top:16px">' + esc(m.tip) + '</p>' + prayerCard(p, true) + (links ? '<div class="row">' + links + '</div>' : '') +
        ((id === 'ansioso' || id === 'triste') ? '<p class="note">Se a angústia estiver muito forte, <a href="#/ajuda">procure apoio agora</a>.</p>' : '');
    }
    if (sel) show(sel);
    $$('[data-mood]').forEach(function (b) {
      b.onclick = function () {
        moods[today()] = b.dataset.mood; save('moods', moods);
        $$('[data-mood]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        show(b.dataset.mood);
      };
    });
  };

  routes.oracoes = function (parts) {
    var f = parts[1] ? decodeURIComponent(parts[1]) : '';
    var list = D.prayers.filter(function (p) { return !f || p.cat === f; });
    app.innerHTML = banner('window', 'Orações', f ? 'Orações · ' + f : 'Orações', 'Textos tradicionais em português e latim. Use PT, LA ou PT·LA no topo para trocar o idioma.') +
      '<div class="wrap" style="margin-top:28px"><div class="chips"><a class="chip" href="#/oracoes" aria-current="' + !f + '">Todas</a>' +
      D.categories.map(function (c) { return '<a class="chip" href="#/oracoes/' + encodeURIComponent(c) + '" aria-current="' + (f === c) + '">' + c + '</a>'; }).join('') + '</div>' +
      list.map(function (p, i) { return prayerCard(p, list.length === 1 || (f && i === 0)); }).join('') + '</div>';
  };

  /* ---------- Via Sacra ---------- */
  function vr() { var v = lang === 'la' ? VS.vr.la : VS.vr.pt; return '<p class="vr"><strong>V.</strong> ' + esc(v[0]) + '<br><strong>R.</strong> ' + esc(v[1]) + '</p>' + (lang === 'both' ? '<p class="vr" lang="la"><strong>V.</strong> ' + esc(VS.vr.la[0]) + '<br><strong>R.</strong> ' + esc(VS.vr.la[1]) + '</p>' : ''); }
  function workCard(w) {
    var img = w.noimg ? '<div class="cimg off"><span>Obra protegida por direitos autorais: veja-a pessoalmente ou em livros de arte.</span></div>' : Commons.slot(w.q, w.t + ', ' + w.a);
    return '<div class="work">' + img + '<div class="w-txt"><strong>' + esc(w.t) + '</strong><span class="meta" style="text-transform:none;letter-spacing:0">' + esc(w.a) + ' · ' + esc(w.y) + '</span><small>' + esc(w.p) + '</small><p>' + esc(w.look) + '</p></div></div>';
  }
  function stationBody(st, compact) {
    var sb = VS.stabat[(st.n - 1) % VS.stabat.length];
    return vr() + '<p class="verse" style="font-size:1.25rem">' + esc(st.med) + '<cite>' + esc(st.ref) + '</cite></p>' +
      '<div class="pbox"><span class="lbl">Oração</span><p class="prayer">' + esc(st.pray) + '</p><p class="note" style="margin:.4em 0 .8em">Pai Nosso, Ave Maria, Glória ao Pai.</p>' + Share.btn({ eyebrow: st.n + 'ª estação · Via Sacra', text: st.med, ref: st.title, svg: SACRED.station(st.n, st.sym), slug: 'via-sacra-' + st.n }) + '</div>' +
      (compact ? '' : '') + '<div class="stabat">' + body({ pt: sb.pt, la: sb.la }) + '<span class="note">Stabat Mater</span></div>';
  }
  routes.viasacra = function (parts) {
    var st = parts[1] && VS.stations.filter(function (x) { return String(x.n) === parts[1]; })[0];
    if (parts[1] === 'rezar') { location.replace('#/praticas/viasacra'); return; }
    if (!st) {
      app.innerHTML = banner('glory', 'Via Sacra', 'O caminho da cruz', 'Rezar as 14 estações, conhecer as grandes obras de arte que as retratam e os lugares onde a Via Sacra é rezada ao ar livre.') +
        '<div class="wrap"><section class="blk" style="margin-top:32px"><div class="row"><a class="btn gold lg" href="#/praticas/viasacra">Rezar a Via Sacra agora</a><a class="btn ghost lg" href="#/leituras/via-sacra-de-quem-sofre">Por que rezar a Via Sacra</a></div></section>' +
        '<section class="blk"><div class="sec-head"><div><span class="eyebrow">Estações</span><h2>As 14 estações e suas obras</h2><p>Toque numa estação para a meditação e o guia de pinturas e esculturas.</p></div></div><div class="grid">' +
        VS.stations.map(function (x) { return '<a class="pcard" href="#/viasacra/' + x.n + '"><div class="cover">' + SACRED.station(x.n, x.sym) + '</div><div class="txt"><span class="meta">' + x.n + 'ª estação</span><h3>' + esc(x.title) + '</h3><p>' + esc(x.works.map(function (w) { return w.a; }).join(' · ')) + '</p><span class="go">Meditar e ver obras →</span></div></a>'; }).join('') + '</div></section>' +
        '<section class="blk"><div class="grid two"><div class="card"><span class="eyebrow">Visio Divina</span><h3 style="margin:.3em 0 .6em">Rezar diante de uma obra de arte</h3><ol class="steps">' + VS.visio.map(function (v) { return '<li><strong>' + esc(v.t) + '.</strong> ' + esc(v.d) + '</li>'; }).join('') + '</ol></div>' +
        '<div class="card"><span class="eyebrow">Fotografia</span><h3 style="margin:.3em 0 .6em">Fotografar a Via Sacra com respeito</h3><ul class="steps">' + VS.photoTips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div></div></section>' +
        '<section class="blk"><div class="sec-head"><div><span class="eyebrow">Lugares</span><h2>Onde rezar e fotografar</h2><p>Vias Sacras célebres no Brasil e no mundo. Toque numa foto para ampliar.</p></div></div><div class="grid">' +
        VS.places.map(function (pl) { return '<div class="card place"><span class="meta">' + esc(pl.where) + '</span><h3>' + esc(pl.name) + '</h3><p>' + esc(pl.desc) + '</p>' + Commons.slot(pl.q, pl.name, 3, 'strip') + '</div>'; }).join('') + '</div></section></div>';
      return;
    }
    var prev = VS.stations[st.n - 2], next = VS.stations[st.n];
    app.innerHTML = '<header class="pbanner"><div class="bg" style="left:0">' + SACRED.station(st.n, st.sym) + '</div><div class="in"><a class="crumb" href="#/viasacra">← Via Sacra</a><br><span class="eyebrow">' + st.n + 'ª estação</span><h2>' + esc(st.title) + '</h2></div></header>' +
      '<article class="article" style="margin-top:28px">' + stationBody(st) +
      '<h3 class="h-sec">Na arte</h3>' + st.works.map(workCard).join('') +
      '<p class="note">Imagens de licença livre do acervo Wikimedia Commons, carregadas dentro do app (toque para ampliar). A busca é automática: se a imagem não corresponder exatamente à obra, conte-nos.</p>' +
      '<div class="row" style="margin-top:24px">' + (prev ? '<a class="btn ghost" href="#/viasacra/' + prev.n + '">← ' + prev.n + 'ª estação</a>' : '') + (next ? '<a class="btn" href="#/viasacra/' + next.n + '">' + next.n + 'ª estação →</a>' : '<a class="btn" href="#/viasacra">Concluir</a>') + '</div></article>';
  };

  /* ---------- utilidades de data, avisos e devocional ---------- */
  var DOW = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  var MON = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  function fdate(d) { return DOW[d.getDay()] + ', ' + d.getDate() + ' ' + MON[d.getMonth()]; }
  function toast(msg) {
    var t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('on'); }, 2600);
  }
  function devOfDay(off) { var n = DEV.length; return DEV[(((dayIndex() + (off || 0)) % n) + n) % n]; }
  function devCard(d, full) {
    return '<div class="card devo"><span class="eyebrow">Devocional do dia · ' + esc(d.theme) + '</span><p class="verse">“' + esc(d.verse) + '”<cite>' + esc(d.ref) + '</cite></p><p>' + esc(d.text) + '</p>' +
      '<div class="devo-act"><span class="lbl">Gesto de hoje</span><p>' + esc(d.act) + '</p></div><p class="prayer" style="font-size:1.15rem">' + esc(d.pray) + '</p>' + (full === false ? '' : '<div class="row" style="margin-bottom:10px">' + Share.btn({ eyebrow: 'Devocional · ' + d.theme, text: d.verse, ref: d.ref, sub: d.act, quote: true, art: 'book', slug: 'devocional' }) + '</div>') +
      (full ? '' : '<div class="row"><a class="btn ghost" href="#/devocional">Dias anteriores</a></div>') + '</div>';
  }
  routes.devocional = function () {
    var past = [1, 2, 3, 4, 5, 6].map(function (k) { return { d: devOfDay(-k), dt: new Date(Date.now() - k * 864e5) }; });
    app.innerHTML = banner('book', 'Devocional diário', 'Um encontro por dia', 'Um versículo, uma reflexão, um gesto concreto e uma oração. Cinco minutos para começar o dia com Deus.') +
      '<div class="wrap" style="max-width:820px;margin-top:28px">' + devCard(devOfDay(), true) +
      '<h3 class="h-sec">Dias anteriores</h3>' + past.map(function (x) { return '<details class="pray"><summary><span class="pray-ic" aria-hidden="true">✝</span><span class="pt">' + esc(x.d.theme) + '<span class="sub">' + esc(fdate(x.dt)) + '</span></span></summary><div class="inner">' + devCard(x.d, false) + '</div></details>'; }).join('') + '</div>';
  };

  routes.oracao = function (parts) {
    var p = pid(parts[1]);
    if (!p) { routes.oracoes([]); return; }
    app.innerHTML = banner('window', 'Oração · ' + p.cat, titleOf(p), '', ['#/oracoes/' + encodeURIComponent(p.cat), 'Orações · ' + p.cat]) + '<div class="wrap" style="max-width:820px;margin-top:28px">' + prayerCard(p, true) + '</div>';
  };

  /* ---------- Instalar como app (PWA) ---------- */
  var installEvt = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); installEvt = e; $$('[data-install]').forEach(function (b) { b.hidden = false; }); });
  window.addEventListener('appinstalled', function () { installEvt = null; toast('App instalado! Procure o ícone “Paz em Oração” na tela inicial.'); var c = $('.install-card'); if (c) c.remove(); });
  function standalone() { return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; }
  function platform() {
    var ua = navigator.userAgent || '';
    if (/iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
    if (/android/i.test(ua)) return 'android';
    return 'desktop';
  }
  function doInstall() {
    if (installEvt) { installEvt.prompt(); installEvt.userChoice.then(function () { installEvt = null; }); }
    else location.hash = '#/instalar';
  }
  function installCard() {
    if (standalone() || load('installHide', false)) return '';
    return '<section class="blk"><div class="card install-card"><img src="icons/icon-192.png" alt="" width="64" height="64"><div><span class="eyebrow">Aplicativo</span><h3 style="margin:.2em 0">Tenha o Paz em Oração na tela inicial</h3><p class="note" style="margin:0">Abre como um app, em tela cheia, e funciona mesmo sem internet. Não precisa de loja de aplicativos.</p></div>' +
      '<div class="row"><button class="btn gold" data-do-install>Instalar</button><button class="btn ghost sm" data-hide-install>Agora não</button></div></div></section>';
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-do-install]')) doInstall();
    if (e.target.closest('[data-hide-install]')) { save('installHide', true); var c = $('.install-card'); if (c) c.closest('section').remove(); }
  });
  routes.instalar = function () {
    var pf = platform();
    var ios = '<div class="card inst' + (pf === 'ios' ? ' mine' : '') + '"><span class="eyebrow">iPhone e iPad</span><h3>No Safari</h3><ol class="steps">' +
      '<li>Abra este site no <strong>Safari</strong>.</li>' +
      '<li>Toque no botão <strong>Compartilhar</strong> <span class="kbd">' + ic('share') + '</span> (quadrado com seta para cima), na barra de baixo ou de cima.</li>' +
      '<li>Role a lista e toque em <strong>Adicionar à Tela de Início</strong> <span class="kbd">＋</span>.</li>' +
      '<li>Confirme em <strong>Adicionar</strong>. O ícone “Paz em Oração” aparece junto com seus apps.</li></ol>' +
      '<p class="note">No iOS 16.4 ou mais recente, o Chrome e outros navegadores também mostram essa opção no menu Compartilhar.</p></div>';
    var android = '<div class="card inst' + (pf === 'android' ? ' mine' : '') + '"><span class="eyebrow">Android</span><h3>No Chrome</h3>' +
      '<p><button class="btn gold" data-do-install data-install' + (installEvt ? '' : ' hidden') + '>Instalar agora</button></p><ol class="steps">' +
      '<li>Abra este site no <strong>Chrome</strong> (ou Samsung Internet, Edge).</li>' +
      '<li>Toque no menu <span class="kbd">⋮</span> no canto superior direito.</li>' +
      '<li>Toque em <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>.</li>' +
      '<li>Confirme em <strong>Instalar</strong>. Pronto: o app abre em tela cheia, como os outros.</li></ol></div>';
    var desk = '<div class="card inst' + (pf === 'desktop' ? ' mine' : '') + '"><span class="eyebrow">Computador</span><h3>No Chrome ou Edge</h3><ol class="steps">' +
      '<li>Clique no ícone de instalar <span class="kbd">⊕</span> no fim da barra de endereço, ou no menu do navegador.</li><li>Escolha <strong>Instalar Paz em Oração</strong>.</li></ol></div>';
    var order = pf === 'ios' ? [ios, android, desk] : pf === 'android' ? [android, ios, desk] : [desk, android, ios];
    app.innerHTML = banner('window', 'Aplicativo', 'Instalar no celular', 'O Paz em Oração pode ficar na tela inicial como um app: abre em tela cheia, carrega rápido e funciona sem internet. É gratuito e não pede cadastro.') +
      '<div class="wrap" style="max-width:900px;margin-top:28px">' + (standalone() ? '<div class="card"><h3>Você já está usando o app instalado. 🙏</h3></div>' : '') +
      '<div class="grid two">' + order.join('') + '</div>' +
      '<p class="note">Atalhos: depois de instalar, toque e segure o ícone para abrir direto Respirar com oração, Santo Terço, Via Sacra ou Preciso de ajuda (Android).</p></div>';
  };

  routes.santos = function (parts) {
    var st = parts[1] && SAINTS.filter(function (x) { return x.id === parts[1]; })[0];
    if (!st) {
      var theme = parts[1] === 'tema' && parts[2] ? decodeURIComponent(parts[2]) : '';
      var themes = []; allQuotes().forEach(function (x) { (x.q.themes || []).forEach(function (t) { if (themes.indexOf(t) < 0) themes.push(t); }); });
      themes.sort();
      var qs = allQuotes().filter(function (x) { return !theme || (x.q.themes || []).indexOf(theme) > -1; });
      app.innerHTML = banner('glory', 'Santos', 'Os santos na tribulação', 'Homens e mulheres que conheceram a angústia, a doença, o medo e a escuridão, e encontraram em Deus a força para seguir. Suas palavras e conselhos para os nossos dias difíceis.') +
        '<div class="wrap"><section class="blk" style="margin-top:32px"><div class="sec-head"><div><span class="eyebrow">Conheça</span><h2>Companheiros de caminhada</h2></div></div><div class="sgrid">' + SAINTS.map(saintCard).join('') + '</div></section>' +
        '<section class="blk" id="frases"><div class="sec-head"><div><span class="eyebrow">Frases dos santos</span><h2>Palavras para a tribulação</h2><p>Filtre pelo que você está vivendo. Toque no ícone para copiar ou compartilhar.</p></div></div>' +
        '<div class="chips"><a class="chip" href="#/santos/tema" aria-current="' + !theme + '">Todas</a>' + themes.map(function (t) { return '<a class="chip" href="#/santos/tema/' + encodeURIComponent(t) + '" aria-current="' + (t === theme) + '">' + esc(t) + '</a>'; }).join('') + '</div>' +
        '<div class="qwall">' + qs.map(function (x) { return quoteCard(x); }).join('') + '</div>' +
        '<p class="note">Citações com a fonte indicada. As marcadas como “atribuída” são tradicionalmente ligadas ao santo, sem fonte documental precisa.</p></section></div>';
        if (parts[1] === 'tema') setTimeout(function () { var f = $('#frases'); if (f) f.scrollIntoView(); }, 0);
      return;
    }
    var k = SAINTS.indexOf(st), nx = SAINTS[(k + 1) % SAINTS.length];
    app.innerHTML = '<header class="pbanner sbanner"><div class="bg">' + SACRED.draw('glory') + '</div><div class="in"><a class="crumb" href="#/santos">← Todos os santos</a><div class="sb-row"><span class="sb-medal">' + SACRED.medal(st.name, st.colors) + '</span><div>' +
      '<span class="eyebrow">' + esc(st.dates) + ' · ' + esc(st.title) + '</span><h2>' + esc(st.name) + '</h2><div class="row" style="margin-top:10px">' + st.themes.map(function (t) { return '<a class="tag" href="#/santos/tema/' + encodeURIComponent(t) + '">' + esc(t) + '</a>'; }).join('') + '</div></div></div></div></header>' +
      '<article class="article"><h3 class="h-sec">Na tribulação</h3><p>' + esc(st.trial) + '</p>' +
      '<h3 class="h-sec">Suas palavras</h3>' + st.quotes.map(function (q) { return quoteCard({ q: q, s: st }, true); }).join('') +
      '<h3 class="h-sec">Para hoje</h3><p>' + esc(st.help) + '</p>' +
      '<div class="pbox"><span class="lbl">Pedido de intercessão</span><p class="prayer">' + esc(st.prayer) + '</p></div>' +
      '<div class="row"><a class="btn" href="#/santos/' + nx.id + '">Próximo: ' + esc(nx.name) + '</a><a class="btn ghost" href="#/santos">Todos os santos</a></div></article>';
  };

  routes.leituras = function (parts) {
    var a = parts[1] && ARTS.filter(function (x) { return x.id === parts[1]; })[0];
    if (!a) {
      app.innerHTML = banner('book', 'Leituras', 'Fé e ansiedade', 'Textos para acolher a ansiedade e a angústia à luz da fé, cada um com uma oração no final.') +
        '<div class="wrap" style="margin-top:32px"><div class="grid">' + ARTS.map(articleCard).join('') + '</div></div>';
      return;
    }
    var n = ARTS[(ARTS.indexOf(a) + 1) % ARTS.length];
    var v = a.verse ? '<p class="verse">“' + esc(lang === 'la' && a.verse.la ? a.verse.la : a.verse.pt) + '”<cite>' + esc(a.verse.ref) + '</cite></p>' : '';
    app.innerHTML = banner(ART_OF[a.id], a.tag + ' · ' + a.minutes + ' min de leitura', a.title, '', ['#/leituras', 'Todas as leituras']) +
      '<article class="article"><p class="lead">' + esc(a.lead) + '</p>' + v +
      a.body.map(function (p) { return '<p>' + p + '</p>'; }).join('') +
      '<div class="pbox"><span class="lbl">Oração</span><p class="prayer">' + esc(a.prayer) + '</p>' + Share.btn({ eyebrow: a.title, text: a.prayer, art: ART_OF[a.id], slug: a.id }) + '</div>' +
      '<div class="row"><a class="btn" href="#/leituras/' + n.id + '">Próxima: ' + esc(n.title) + '</a><a class="btn ghost" href="#/ajuda">Preciso de apoio</a></div></article>';
  };

  routes.ajuda = function () {
    app.innerHTML = banner('halo', 'Ajuda e apoio', 'Você não está sozinho(a)', 'Oração e cuidado profissional caminham juntos. Procure ajuda sempre que precisar.') +
      '<div class="wrap"><div class="panel crisis"><h3>Se você está em crise</h3><p><strong>Se está pensando em se machucar ou tirar a própria vida, ligue agora para o 188 (CVV) ou 192 (SAMU).</strong> Procure também uma pessoa de confiança que possa ficar ao seu lado.</p><div class="row"><a class="btn" href="tel:188">Ligar 188</a><a class="btn" href="tel:192">Ligar 192</a></div></div>' +
      '<div class="grid" style="margin-top:22px">' + D.help.map(function (h) {
        return '<section class="card"><h3>' + esc(h.name) + '</h3><p>' + esc(h.desc) + '</p><div class="row">' +
          (h.tel ? '<a class="btn" href="tel:' + h.tel + '">Ligar ' + h.tel + '</a>' : '') +
          (h.link ? '<a class="btn ghost" href="' + h.link + '" target="_blank" rel="noopener">Site</a>' : '') + '</div></section>';
      }).join('') + '</div>' +
      '<section class="card"><h3>Apoio espiritual</h3><p>Converse com seu pároco, um diretor espiritual ou uma pastoral da sua comunidade.</p><div class="row"><a class="btn ghost" href="#/leituras/fe-e-terapia">Fé e terapia caminham juntas</a><a class="btn ghost" href="#/oracoes/Consolo">Orações de consolo</a></div></section></div>';
  };

  routes.praticas = function (parts) {
    var p = parts[1] && PRACTICES.filter(function (x) { return x.id === parts[1]; })[0];
    if (!p) {
      app.innerHTML = banner('candle', 'Práticas', 'Práticas guiadas', 'Exercícios de oração para acalmar o corpo e a mente. Deixe o canto gregoriano tocando, se ajudar.') +
        '<div class="wrap" style="margin-top:32px"><div class="grid">' + PRACTICES.map(practiceCard).join('') + '</div></div>';
      return;
    }
    app.innerHTML = banner(p.art, 'Prática · ' + p.min, p.title, p.desc, ['#/praticas', 'Todas as práticas']) + '<div class="wrap" style="max-width:820px"><div class="panel" id="pr"></div></div>';
    PR[p.id]($('#pr'));
  };

  /* ---------- práticas ---------- */
  var PR = {};

  // Santo Terço
  function todaySet() {
    var d = new Date().getDay();
    return Object.keys(D.mysteries).filter(function (k) { return D.mysteries[k].days.indexOf(d) > -1; })[0];
  }
  var rosary = { set: null, i: 0 };
  function rosarySteps(set) {
    var m = D.mysteries[set], s = [];
    function add(id, extra) { s.push(Object.assign({ p: pid(id) }, extra || {})); }
    add('sinal-cruz', { label: 'Sinal da Cruz' }); add('credo', { label: 'Creio' }); add('pai-nosso', { label: 'Pai Nosso' });
    ['fé', 'esperança', 'caridade'].forEach(function (v, k) { add('ave-maria', { label: 'Ave Maria (' + (k + 1) + '/3) — pela ' + v }); });
    add('gloria', { label: 'Glória' });
    m.items.forEach(function (name, d) {
      var base = { dec: d + 1, mystery: name };
      add('pai-nosso', Object.assign({ label: 'Pai Nosso', intro: true }, base));
      for (var k = 1; k <= 10; k++) add('ave-maria', Object.assign({ label: 'Ave Maria', bead: k }, base));
      add('gloria', Object.assign({ label: 'Glória' }, base)); add('fatima', Object.assign({ label: 'Oração de Fátima' }, base));
    });
    add('salve-rainha', { label: 'Salve Rainha' }); add('sinal-cruz', { label: 'Sinal da Cruz — final' });
    return s;
  }
  PR.terco = function (el) {
    if (!rosary.set) rosary.set = todaySet();
    function render() {
      var steps = rosarySteps(rosary.set), i = Math.min(rosary.i, steps.length - 1), s = steps[i], m = D.mysteries[rosary.set];
      var beads = '';
      if (s.dec) { beads = '<div class="beads" aria-hidden="true">'; for (var k = 1; k <= 10; k++) beads += '<i class="' + (s.bead && k < s.bead ? 'on' : '') + (s.bead === k ? ' cur' : '') + '"></i>'; beads += '</div>'; }
      el.innerHTML = '<div class="stage"><div class="row" style="justify-content:center"><label class="meta" for="ms">Mistérios</label><select id="ms">' +
        Object.keys(D.mysteries).map(function (k) { return '<option value="' + k + '"' + (k === rosary.set ? ' selected' : '') + '>' + D.mysteries[k].name + (k === todaySet() ? ' (hoje)' : '') + '</option>'; }).join('') + '</select></div>' +
        '<div class="bar"><i style="width:' + ((i + 1) / steps.length * 100) + '%"></i></div>' +
        (s.dec ? '<p class="meta">' + s.dec + 'º Mistério — ' + m.name.replace('Mistérios ', '') + '</p><p class="mystery">' + esc(s.mystery) + '</p>' + beads : '<p class="meta">Orações iniciais' + (i > 8 ? ' / finais' : '') + '</p>') +
        '<div class="card" style="text-align:left"><span class="lbl">' + esc(s.label) + (s.bead ? ' · ' + s.bead + '/10' : '') + '</span>' + body(s.p) + '</div>' +
        '<div class="row" style="justify-content:center"><button class="btn ghost" id="pv"' + (i === 0 ? ' disabled' : '') + '>Anterior</button><button class="btn lg" id="nx">' + (i === steps.length - 1 ? 'Concluir' : 'Próxima') + '</button></div>' +
        '<p class="note">Passo ' + (i + 1) + ' de ' + steps.length + '. Seu ponto fica guardado enquanto você navega pelo app.</p></div>';
      $('#ms').onchange = function () { rosary.set = this.value; rosary.i = 0; render(); };
      $('#pv').onclick = function () { rosary.i = i - 1; render(); };
      $('#nx').onclick = function () {
        if (i === steps.length - 1) { rosary.i = 0; el.innerHTML = doneCard('Terço concluído. Que a paz de Cristo permaneça com você.'); } else { rosary.i = i + 1; render(); window.scrollTo(0, 0); }
      };
    }
    render();
  };

  // Respiração com oração
  var PATTERNS = {
    calma: { name: 'Calmante 4-4-6', ph: [['Inspire', 4, 1.6], ['Segure', 4, 1.6], ['Expire', 6, 1]] },
    relax: { name: 'Relaxante 4-7-8', ph: [['Inspire', 4, 1.6], ['Segure', 7, 1.6], ['Expire', 8, 1]] },
    quadrada: { name: 'Quadrada 4-4-4-4', ph: [['Inspire', 4, 1.6], ['Segure', 4, 1.6], ['Expire', 4, 1], ['Pausa', 4, 1]] }
  };
  PR.respirar = function (el) {
    el.innerHTML = '<div class="stage"><p class="note" style="margin-top:0">Sente-se com a coluna ereta, ombros soltos. A cada ciclo, reze a frase: uma parte ao inspirar, outra ao expirar.</p>' +
      '<div class="row" style="justify-content:center"><select id="pt" aria-label="Ritmo">' + Object.keys(PATTERNS).map(function (k) { return '<option value="' + k + '">' + PATTERNS[k].name + '</option>'; }).join('') + '</select>' +
      '<select id="ph" aria-label="Frase de oração">' + D.breathPhrases.map(function (p) { return '<option value="' + p.id + '">' + p.label + '</option>'; }).join('') + '</select>' +
      '<select id="cy" aria-label="Ciclos"><option value="6">6 ciclos</option><option value="10">10 ciclos</option><option value="0">Sem limite</option></select></div>' +
      '<div class="orb-wrap"><div class="orb" id="orb" role="status" aria-live="polite">Pronto</div></div><p class="phrase" id="phr"></p><p class="meta" id="cnt"></p>' +
      '<button class="btn lg" id="go">Começar</button></div>';
    var orb = $('#orb'), phr = $('#phr'), go = $('#go'), cnt = $('#cnt'), running = false;
    function phrase(idx) { var p = D.breathPhrases.filter(function (x) { return x.id === $('#ph').value; })[0]; var t = (lang === 'pt') ? p.pt : p.la; return t; }
    function stop(msg) { running = false; clearTimers(); go.textContent = 'Começar'; orb.textContent = msg || 'Pronto'; orb.style.transform = ''; }
    go.onclick = function () {
      if (running) { stop(); phr.textContent = ''; return; }
      running = true; go.textContent = 'Parar';
      var ph = PATTERNS[$('#pt').value].ph, max = +$('#cy').value, pi = 0, left = 0, cur = null, cycles = 0;
      function tick() {
        if (left <= 0) {
          if (pi > 0 && pi % ph.length === 0) { cycles++; if (max && cycles >= max) { stop('Amém'); phr.textContent = ''; cnt.textContent = cycles + ' ciclos concluídos'; A.chime(); return; } }
          cur = ph[pi % ph.length]; pi++; left = cur[1];
          orb.style.transitionDuration = cur[1] + 's'; orb.style.transform = 'scale(' + cur[2] + ')';
          var pp = phrase(), inhale = cur[0] === 'Inspire' || cur[0] === 'Segure' && cur[2] > 1;
          if (cur[0] !== 'Pausa') phr.textContent = inhale ? pp[0] : pp[1];
          cnt.textContent = 'Ciclo ' + (cycles + 1) + (max ? ' de ' + max : '');
        }
        orb.textContent = cur[0] + ' ' + left; left--;
      }
      tick(); every(tick, 1000);
    };
  };

  // Aterramento 5-4-3-2-1
  PR.aterramento = function (el) {
    var steps = [{ html: '<div class="stage"><p class="lead" style="font:500 1.3rem var(--serif)">Respire fundo. Você está seguro(a) neste momento. Vamos trazer a mente para o presente, com Deus.</p></div>' }].concat(
      D.grounding.map(function (g) { return { html: '<div class="stage"><div class="step-n">' + g.n + '</div><h3>coisas para ' + g.sense + '</h3><p>' + esc(g.ask) + '</p><p class="verse" style="text-align:left">' + esc(g.pray) + '</p></div>' }; }),
      [{ html: '<div class="stage"><h3>Respire mais uma vez</h3><p>Diga em voz baixa: “Jesus, eu confio em Vós”. Se a angústia continuar forte, repita o exercício ou procure apoio.</p>' + prayerCard(pid('panico'), true) + '</div>' }]);
    stepper(el, steps, { endLabel: 'Concluir', onEnd: function () { el.innerHTML = doneCard('Você voltou ao presente. Vá com calma pelo resto do dia.'); } });
  };

  // Lectio Divina
  PR.lectio = function (el) {
    var l = D.lectio[dayIndex() % D.lectio.length];
    var text = body({ pt: '“' + l.pt + '”', la: l.la ? '“' + l.la + '”' : null });
    var steps = [
      { html: '<div class="stage"><span class="meta">Lectio · Ler</span><h3>' + esc(l.ref) + '</h3><div style="text-align:left">' + text + '</div><p class="note">Leia devagar, duas ou três vezes, em voz baixa. Não analise: apenas escute.</p></div>' },
      { html: '<div class="stage"><span class="meta">Meditatio · Meditar</span><h3>Que palavra ou frase chama a sua atenção?</h3><div style="text-align:left">' + text + '</div><p>Repita-a. O que ela diz a você, hoje, com o que você está vivendo?</p></div>' },
      { html: '<div class="stage"><span class="meta">Oratio · Rezar</span><h3>Responda a Deus</h3><p>Fale com Ele com simplicidade: agradeça, peça, chore, questione. Pode ser com suas próprias palavras.</p></div>' },
      { html: '<div class="stage"><span class="meta">Contemplatio · Contemplar</span><h3>Fique em silêncio</h3><p>Descanse na presença de Deus, sem falar e sem esforço. Se vierem pensamentos, deixe-os passar e volte à palavra que escolheu.</p><a class="btn ghost" href="#/praticas/silencio">Abrir o temporizador de silêncio</a></div>' }
    ];
    stepper(el, steps, { endLabel: 'Concluir', onEnd: function () {
      el.innerHTML = doneCard('Que a Palavra continue a agir em você ao longo do dia.');
    } });
  };

  // Silêncio
  PR.silencio = function (el) {
    var s = D.silence;
    el.innerHTML = '<div class="stage"><p class="verse" style="text-align:left">“' + esc(lang === 'la' ? s.la : s.pt) + '”<cite>' + s.ref + (lang === 'both' ? ' · ' + esc(s.la) : '') + '</cite></p>' +
      '<div class="row" style="justify-content:center"><select id="mn" aria-label="Duração"><option value="3">3 minutos</option><option value="5" selected>5 minutos</option><option value="10">10 minutos</option></select></div>' +
      '<div class="orb-wrap"><div class="count" id="tm">05:00</div></div><button class="btn lg" id="go">Começar</button></div>';
    var go = $('#go'), tm = $('#tm'), running = false, left;
    function fmt(n) { return ('0' + Math.floor(n / 60)).slice(-2) + ':' + ('0' + (n % 60)).slice(-2); }
    $('#mn').onchange = function () { if (!running) tm.textContent = fmt(+this.value * 60); };
    go.onclick = function () {
      if (running) { running = false; clearTimers(); go.textContent = 'Começar'; tm.textContent = fmt(+$('#mn').value * 60); return; }
      running = true; left = +$('#mn').value * 60; go.textContent = 'Encerrar'; A.chime(); tm.textContent = fmt(left);
      every(function () {
        left--; tm.textContent = fmt(Math.max(left, 0));
        if (left <= 0) { running = false; clearTimers(); A.chime(); go.textContent = 'Começar'; tm.textContent = 'Amém'; }
      }, 1000);
    };
  };

  // Oração do coração (contador)
  PR.jaculatoria = function (el) {
    var opts = D.prayers.filter(function (p) { return p.cat === 'Jaculatórias'; }), st = load('jac', {});
    if (st.d !== today()) st = { d: today(), n: 0, id: st.id };
    function render() {
      var p = pid(st.id) || opts[0];
      el.innerHTML = '<div class="stage"><div class="row" style="justify-content:center"><select id="jp" aria-label="Jaculatória">' +
        opts.map(function (o) { return '<option value="' + o.id + '"' + (o.id === p.id ? ' selected' : '') + '>' + esc(o.title) + '</option>'; }).join('') + '</select></div>' +
        '<div class="orb-wrap" style="height:260px"><button class="tap" id="tp" aria-label="Rezar uma vez: ' + esc(p.title) + '">' + esc(lang === 'la' && p.la ? p.la : p.pt) + '</button></div>' +
        '<p class="count" aria-live="polite">' + st.n + '</p><p class="meta">repetições hoje</p>' +
        (lang === 'both' && p.la ? '<p class="prayer" lang="la">' + esc(p.la) + '</p>' : '') +
        '<div class="row" style="justify-content:center"><button class="btn ghost" id="rs">Zerar</button></div></div>';
      $('#jp').onchange = function () { st.id = this.value; save('jac', st); render(); };
      $('#tp').onclick = function () { st.n++; st.id = p.id; save('jac', st); $('.count', el).textContent = st.n; if (navigator.vibrate) navigator.vibrate(15); };
      $('#rs').onclick = function () { st.n = 0; save('jac', st); render(); };
    }
    render();
  };

  // Via Sacra guiada
  PR.viasacra = function (el) {
    var steps = [{ html: '<div class="stage"><div class="step-n">✝</div><h3>Início</h3>' + body(pid('sinal-cruz')) + '<p>Faça o sinal da cruz e ofereça esta Via Sacra por alguém que sofre, ou pelo seu próprio coração cansado.</p><p class="note">Se preferir, reze apenas algumas estações. Em cada uma, é costume fazer uma genuflexão ou uma pequena inclinação.</p></div>' }].concat(
      VS.stations.map(function (st) {
        var w0 = st.works.filter(function (w) { return !w.noimg; })[0];
        var art = w0 ? Commons.slot(w0.q, w0.t + ', ' + w0.a, 1, 'st-img', '<div class="st-art">' + SACRED.station(st.n, st.sym) + '</div>') : '<div class="st-art">' + SACRED.station(st.n, st.sym) + '</div>';
        return { html: '<div class="stage">' + art + '<span class="meta">' + st.n + 'ª estação</span><h3 style="margin:.2em 0 .6em">' + esc(st.title) + '</h3><div style="text-align:left">' + stationBody(st) + '</div><a class="more" href="#/viasacra/' + st.n + '">Ver as obras de arte desta estação →</a></div>' };
      }),
      [{ html: '<div class="stage"><h3>Conclusão</h3><p>Pelas intenções do Santo Padre: Pai Nosso, Ave Maria, Glória ao Pai.</p>' + prayerCard(pid('anima-christi'), true) + '</div>' }]);
    stepper(el, steps, { endLabel: 'Concluir', onEnd: function () { el.innerHTML = doneCard('Via Sacra concluída. Que a cruz de Cristo seja luz na sua cruz.'); } });
  };

  // Terço da Misericórdia
  var mercy = { i: 0 };
  PR.misericordia = function (el) {
    var E = 'Eterno Pai, eu Vos ofereço o Corpo e Sangue, Alma e Divindade de Vosso diletíssimo Filho, Nosso Senhor Jesus Cristo, em expiação dos nossos pecados e dos do mundo inteiro.';
    var P = 'Pela Sua dolorosa Paixão, tende misericórdia de nós e do mundo inteiro.';
    var S = 'Deus Santo, Deus Forte, Deus Imortal, tende piedade de nós e do mundo inteiro.';
    var steps = [{ label: 'Sinal da Cruz', p: pid('sinal-cruz') }, { label: 'Oração inicial (opcional)', p: { pt: 'Ó Sangue e Água que jorrastes do Coração de Jesus como fonte de misericórdia para nós, eu confio em Vós!' } },
      { label: 'Pai Nosso', p: pid('pai-nosso') }, { label: 'Ave Maria', p: pid('ave-maria') }, { label: 'Creio', p: pid('credo') }];
    for (var d = 1; d <= 5; d++) {
      steps.push({ label: 'Conta grande', dec: d, p: { pt: E } });
      for (var k = 1; k <= 10; k++) steps.push({ label: 'Conta pequena', dec: d, bead: k, p: { pt: P } });
    }
    for (k = 1; k <= 3; k++) steps.push({ label: 'Encerramento (' + k + '/3)', p: { pt: S } });
    steps.push({ label: 'Jaculatória final', p: pid('jac-confio') });
    function render() {
      var i = Math.min(mercy.i, steps.length - 1), s = steps[i], beads = '';
      if (s.dec) { beads = '<div class="beads" aria-hidden="true">'; for (var k = 1; k <= 10; k++) beads += '<i class="' + (s.bead && k < s.bead ? 'on' : '') + (s.bead === k ? ' cur' : '') + '"></i>'; beads += '</div>'; }
      el.innerHTML = '<div class="stage"><div class="bar"><i style="width:' + ((i + 1) / steps.length * 100) + '%"></i></div>' +
        (s.dec ? '<p class="meta">' + s.dec + 'ª dezena</p>' + beads : '<p class="meta">' + (i < 5 ? 'Orações iniciais' : 'Encerramento') + '</p>') +
        '<div class="card" style="text-align:left"><span class="lbl">' + esc(s.label) + (s.bead ? ' · ' + s.bead + '/10' : '') + '</span>' + body(s.p) + '</div>' +
        '<div class="row" style="justify-content:center"><button class="btn ghost" id="pv"' + (i === 0 ? ' disabled' : '') + '>Anterior</button><button class="btn lg" id="nx">' + (i === steps.length - 1 ? 'Concluir' : 'Próxima') + '</button></div>' +
        '<p class="note">Passo ' + (i + 1) + ' de ' + steps.length + '. Tradicionalmente rezado às 15h, a Hora da Misericórdia.</p></div>';
      $('#pv').onclick = function () { mercy.i = i - 1; render(); };
      $('#nx').onclick = function () { if (i === steps.length - 1) { mercy.i = 0; el.innerHTML = doneCard('Jesus, eu confio em Vós.'); } else { mercy.i = i + 1; render(); } };
    }
    render();
  };

  // Exame do dia
  PR.exame = function (el) {
    var steps = D.examen.map(function (e, k) {
      return { html: '<div class="stage"><span class="meta">' + (k + 1) + '. ' + esc(e.t) + '</span><h3>' + esc(e.t) + '</h3><p>' + esc(e.ask) + '</p>' +
        '</div>' };
    });
    stepper(el, steps, { endLabel: 'Concluir', onEnd: function () {
      el.innerHTML = doneCard('Você entregou o dia ao Senhor. Descanse em paz.') + '<div style="margin-top:14px">' + prayerCard(pid('noite'), true) + '</div>';
    } });
  };

  /* ---------- navegação e cabeçalho ---------- */
  function buildNav() {
    $('.dnav').innerHTML = NAV.map(function (n) { return '<a href="#/' + n[0] + '" data-r="' + n[0] + '">' + n[1] + '</a>'; }).join('');
    $('.bnav').innerHTML = NAV.filter(function (n) { return !n[3]; }).map(function (n) { return '<a href="#/' + n[0] + '" data-r="' + n[0] + '">' + ic(n[2]) + '<span>' + n[1] + '</span></a>'; }).join('');
  }
  function route() {
    clearTimers();
    var parts = location.hash.replace(/^#\/?/, '').split('/'), r = parts[0] || '';
    (routes[r] || routes[''])(parts);
    Commons.hydrate(app);
    $$('.dnav a, .bnav a').forEach(function (a) { if (a.dataset.r === r) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    window.scrollTo(0, 0);
  }

  function syncMusic() {
    var b = $('#music'), on = A.isOn();
    b.setAttribute('aria-pressed', on); $('#player').classList.toggle('on', on);
    b.innerHTML = ic(on ? 'pause' : 'play');
    b.setAttribute('aria-label', on ? 'Pausar música ambiente' : 'Tocar música ambiente');
    var tr = A.track();
    $('#ptitle').textContent = tr.name;
    $('#pstate').textContent = on ? 'Tocando · ' + tr.desc : 'Pausado · toque para ouvir';
    renderTracks();
  }
  function renderTracks() {
    var cur = A.track().id;
    var last = '';
    $('#tracks').innerHTML = A.tracks().map(function (t) {
      var h = t.group !== last ? '<p class="tk-h">' + esc(t.group) + '</p>' : ''; last = t.group;
      return h + '<button role="menuitemradio" aria-checked="' + (t.id === cur) + '" data-track="' + t.id + '"><strong>' + esc(t.name) + '</strong><small>' + esc(t.desc) + '</small></button>';
    }).join('') + '<p class="tk-note">Faixas geradas no seu navegador: melodias de domínio público e improvisos em estilos tradicionais.</p>';
    $$('[data-track]').forEach(function (b) { b.onclick = function () { save('track', b.dataset.track); save('music', 'on'); A.setTrack(b.dataset.track); if (!A.isOn()) A.start(); toggleMenu(false); }; });
  }
  function toggleMenu(force) {
    var m = $('#tracks'), open = force === undefined ? m.hidden : force;
    m.hidden = !open; $('#plist').setAttribute('aria-expanded', open);
  }
  function syncLang() {
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lang === lang); });
    $('#langc').textContent = { pt: 'PT', la: 'LA', both: 'P·L' }[lang];
  }
  function syncTheme() {}
  /* ---------- Aparência: estilo de fonte, tamanho do texto e tema ---------- */
  var FONTS = [
    { id: 'classico', name: 'Clássico', serif: "'Cormorant Garamond'", sans: 'Inter', note: 'Cormorant Garamond + Inter', desc: 'Elegante, de inspiração renascentista.' },
    { id: 'tradicional', name: 'Tradicional', serif: "'EB Garamond'", sans: "'Source Sans 3'", note: 'EB Garamond + Source Sans 3', desc: 'Como um missal impresso: sóbrio e fácil de ler.' },
    { id: 'moderno', name: 'Moderno', serif: "'Playfair Display'", sans: "'DM Sans'", note: 'Playfair Display + DM Sans', desc: 'Contraste marcante e visual contemporâneo.' },
    { id: 'suave', name: 'Suave', serif: 'Lora', sans: 'Nunito', note: 'Lora + Nunito', desc: 'Arredondada e acolhedora.' },
    { id: 'legivel', name: 'Leitura fácil', serif: "'Atkinson Hyperlegible'", sans: "'Atkinson Hyperlegible'", note: 'Atkinson Hyperlegible', desc: 'Criada para pessoas com baixa visão: letras bem distintas.' }
  ];
  var SIZES = [['p', 'A−', 'Texto menor'], ['m', 'A', 'Texto normal'], ['g', 'A+', 'Texto maior'], ['gg', 'A++', 'Texto muito maior']];
  var THEMES = [['auto', 'Automático'], ['light', 'Claro'], ['dark', 'Escuro']];
  function applyTheme() {
    var t = (function () { try { return localStorage.getItem('theme'); } catch (e) { return null; } })() || 'auto';
    var eff = t === 'auto' ? (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light') : t;
    document.documentElement.dataset.theme = eff;
  }
  function setPref(k, v) {
    var h = document.documentElement;
    try { localStorage.setItem(k, v); } catch (e) {}
    if (k === 'font') h.dataset.font = v;
    if (k === 'fs') h.dataset.fs = v;
    if (k === 'theme') applyTheme();
    renderAppearance();
  }
  function renderAppearance() {
    var h = document.documentElement, font = h.dataset.font || 'classico', fs = h.dataset.fs || 'm', th = (function () { try { return localStorage.getItem('theme') || 'auto'; } catch (e) { return 'auto'; } })();
    $('#apanel').innerHTML = '<div class="ap-head"><h3>Aparência</h3><button class="icon-btn ap-x" id="apx" aria-label="Fechar">✕</button></div>' +
      '<span class="ap-lbl" id="lf">Estilo da fonte</span><div class="fopts" role="radiogroup" aria-labelledby="lf">' + FONTS.map(function (f) {
        return '<button class="fopt" role="radio" aria-checked="' + (f.id === font) + '" data-font="' + f.id + '"><span class="fn"><b style="font-family:' + f.serif + ',serif">' + f.name + '</b><small style="font-family:' + f.sans + ',sans-serif">' + f.note + '</small></span>' +
          '<span class="fs" style="font-family:' + f.serif + ',serif">Pai nosso, que estais nos céus…</span><span class="fd" style="font-family:' + f.sans + ',sans-serif">' + f.desc + '</span></button>';
      }).join('') + '</div>' +
      '<span class="ap-lbl">Tamanho do texto</span><div class="segs" role="group" aria-label="Tamanho do texto">' + SIZES.map(function (z) { return '<button data-fs="' + z[0] + '" aria-pressed="' + (z[0] === fs) + '" aria-label="' + z[2] + '">' + z[1] + '</button>'; }).join('') + '</div>' +
      '<span class="ap-lbl">Tema</span><div class="segs" role="group" aria-label="Tema">' + THEMES.map(function (t) { return '<button data-th="' + t[0] + '" aria-pressed="' + (t[0] === th) + '">' + t[1] + '</button>'; }).join('') + '</div>';
    $('#apx').onclick = function () { toggleAppearance(false); };
    $$('#apanel [data-font]').forEach(function (b) { b.onclick = function () { setPref('font', b.dataset.font); }; });
    $$('#apanel [data-fs]').forEach(function (b) { b.onclick = function () { setPref('fs', b.dataset.fs); }; });
    $$('#apanel [data-th]').forEach(function (b) { b.onclick = function () { setPref('theme', b.dataset.th); }; });
  }
  function toggleAppearance(force) {
    var p = $('#apanel'), open = force === undefined ? p.hidden : force;
    if (open) renderAppearance();
    p.hidden = !open; $('#appear').setAttribute('aria-expanded', open);
    if (open) { var c = $('#apanel [aria-checked=true]'); if (c) c.focus(); } else if (force === false) $('#appear').focus();
  }

  function init() {
    buildNav();
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('sw.js').catch(function () {});
    $$('[data-lang]').forEach(function (b) { b.onclick = function () { setLang(b.dataset.lang); }; });
    $('#langc').onclick = function () { setLang({ pt: 'la', la: 'both', both: 'pt' }[lang]); };
    syncLang();
    var vol = load('vol', 70); $('#vol').value = vol; A.setVolume(vol / 100);
    $('#vol').oninput = function () { save('vol', +this.value); A.setVolume(this.value / 100); };
    var tk = load('track', null); if (tk) A.setTrack(tk);
    A.onchange(syncMusic); syncMusic(); syncTheme();
    $('#plist').onclick = function (e) { e.stopPropagation(); toggleMenu(); };
    $('#pnext').onclick = function (e) { e.stopPropagation(); A.next(); save('track', A.track().id); save('music', 'on'); if (!A.isOn()) A.start(); };
    document.addEventListener('click', function (e) { if (!e.target.closest('#player')) toggleMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggleMenu(false); });
    $('#music').onclick = function (e) { e.stopPropagation(); save('music', A.isOn() ? 'off' : 'on'); A.toggle(); };
    $('#appear').onclick = function (e) { e.stopPropagation(); toggleAppearance(); };
    document.addEventListener('click', function (e) { if (e.target.isConnected && !$('#apanel').hidden && !e.target.closest('#apanel, #appear')) toggleAppearance(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('#apanel').hidden) toggleAppearance(false); });
    try { matchMedia('(prefers-color-scheme:dark)').addEventListener('change', applyTheme); } catch (e) {}
    // Navegadores só liberam áudio após um gesto do usuário: inicia na primeira interação, salvo se o usuário pausou.
    function first(e) {
      if (e.target.closest && e.target.closest('#player')) return;
      document.removeEventListener('pointerdown', first, true);
      if (load('music', 'on') !== 'off') A.start();
    }
    document.addEventListener('pointerdown', first, true);
    window.addEventListener('hashchange', route);
    route();
  }
  init();
})();
