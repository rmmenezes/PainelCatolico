// Imagens do Wikimedia Commons exibidas dentro do app.
// A busca é feita pelo navegador do visitante na API pública do Commons (CORS liberado com origin=*),
// com cache local de 30 dias. Cada imagem mostra autor e licença, como pedem as licenças livres.
(function () {
  'use strict';
  var API = 'https://commons.wikimedia.org/w/api.php', TTL = 30 * 864e5, pending = {};
  function strip(h) { var d = document.createElement('div'); d.innerHTML = h || ''; return (d.textContent || '').replace(/\s+/g, ' ').trim(); }
  function cget(k) { try { var v = JSON.parse(localStorage.getItem('cm:' + k)); return v && Date.now() - v.t < TTL ? v.r : null; } catch (e) { return null; } }
  function cput(k, r) { try { localStorage.setItem('cm:' + k, JSON.stringify({ t: Date.now(), r: r })); } catch (e) {} }

  function find(q, n) {
    var key = q + '|' + n, hit = cget(key);
    if (hit) return Promise.resolve(hit);
    if (pending[key]) return pending[key];
    var url = API + '?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=' + Math.max(n, 3) +
      '&gsrsearch=' + encodeURIComponent(q + ' filetype:bitmap') + '&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=900';
    pending[key] = fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) {
      var pages = j.query ? Object.keys(j.query.pages).map(function (k) { return j.query.pages[k]; }) : [];
      pages.sort(function (a, b) { return (a.index || 0) - (b.index || 0); });
      var out = pages.filter(function (p) { return p.imageinfo && p.imageinfo[0]; }).slice(0, n).map(function (p) {
        var ii = p.imageinfo[0], md = ii.extmetadata || {};
        return { thumb: ii.thumburl || ii.url, full: ii.url, page: ii.descriptionurl, title: p.title.replace(/^File:|\.\w+$/g, ''),
          artist: strip(md.Artist && md.Artist.value) || 'Autor desconhecido', license: strip(md.LicenseShortName && md.LicenseShortName.value) || '' };
      });
      cput(key, out); delete pending[key]; return out;
    }).catch(function (e) { delete pending[key]; throw e; });
    return pending[key];
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function credit(im) { return esc(im.artist) + (im.license ? ' · ' + esc(im.license) : '') + ' · Wikimedia Commons'; }

  function fill(el) {
    if (el.dataset.done) return; el.dataset.done = '1';
    var n = +(el.dataset.n || 1);
    find(el.dataset.cq, n).then(function (list) {
      if (!list.length) throw new Error('vazio');
      el.classList.add('ok');
      el.innerHTML = list.map(function (im, i) {
        return '<button class="cm-img" data-i="' + i + '" aria-label="Ampliar imagem: ' + esc(im.title) + '"><img src="' + esc(im.thumb) + '" alt="' + esc(el.dataset.alt || im.title) + '" loading="lazy" decoding="async"></button>';
      }).join('') + (n === 1 ? '<figcaption>' + credit(list[0]) + '</figcaption>' : '');
      Array.prototype.forEach.call(el.querySelectorAll('.cm-img'), function (b) { b.onclick = function () { open(list, +b.dataset.i, el.dataset.alt); }; });
      Array.prototype.forEach.call(el.querySelectorAll('img'), function (img) { img.onerror = function () { img.parentNode.remove(); if (!el.querySelector('img')) fail(el); }; });
    }).catch(function () { fail(el); });
  }
  var FB = {};
  function fail(el) { if (el.dataset.fb && FB[el.dataset.fb]) { el.classList.add('fb'); el.innerHTML = FB[el.dataset.fb]; return; } el.classList.add('off'); el.innerHTML = '<span>Imagem indisponível agora (sem conexão com o acervo).</span>'; }

  // Visualizador em tela cheia, dentro do app.
  function open(list, i, alt) {
    var box = document.getElementById('lbox');
    if (!box) { box = document.createElement('div'); box.id = 'lbox'; box.className = 'lbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); document.body.appendChild(box); }
    function show() {
      var im = list[i];
      box.innerHTML = '<button class="lb-x" aria-label="Fechar">✕</button>' + (list.length > 1 ? '<button class="lb-p" aria-label="Anterior">‹</button><button class="lb-n" aria-label="Próxima">›</button>' : '') +
        '<figure><img src="' + esc(im.full) + '" alt="' + esc(alt || im.title) + '"><figcaption><strong>' + esc(alt || im.title) + '</strong><br>' + credit(im) + ' · <a href="' + esc(im.page) + '" target="_blank" rel="noopener">detalhes da licença</a></figcaption></figure>';
      box.querySelector('.lb-x').onclick = close;
      if (list.length > 1) { box.querySelector('.lb-p').onclick = function () { i = (i + list.length - 1) % list.length; show(); }; box.querySelector('.lb-n').onclick = function () { i = (i + 1) % list.length; show(); }; }
    }
    function close() { box.classList.remove('on'); document.removeEventListener('keydown', key); }
    function key(e) { if (e.key === 'Escape') close(); if (list.length > 1 && e.key === 'ArrowRight') { i = (i + 1) % list.length; show(); } if (list.length > 1 && e.key === 'ArrowLeft') { i = (i + list.length - 1) % list.length; show(); } }
    box.onclick = function (e) { if (e.target === box) close(); };
    document.addEventListener('keydown', key);
    show(); box.classList.add('on'); box.querySelector('.lb-x').focus();
  }

  // Preenche os marcadores <figure data-cq> quando aparecem na tela.
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); fill(e.target); } }); }, { rootMargin: '300px' }) : null;
  window.Commons = {
    find: find,
    hydrate: function (root) { Array.prototype.forEach.call((root || document).querySelectorAll('[data-cq]:not([data-done])'), function (el) { if (io) io.observe(el); else fill(el); }); },
    // fallback: HTML exibido se a imagem não puder ser carregada (ex.: sem internet).
    slot: function (q, alt, n, cls, fallback) {
      var fb = ''; if (fallback) { fb = 'f' + Object.keys(FB).length; FB[fb] = fallback; }
      return '<figure class="cimg ' + (cls || '') + '" data-cq="' + esc(q) + '" data-alt="' + esc(alt || '') + '" data-n="' + (n || 1) + '"' + (fb ? ' data-fb="' + fb + '"' : '') + '><span class="cm-load" aria-hidden="true"></span></figure>';
    }
  };
})();
