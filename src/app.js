(function () {
  'use strict';
  var D = window.DATA, app = document.getElementById('app');

  // --- armazenamento local (dados ficam apenas neste dispositivo) ---
  function load(k, def) { try { return JSON.parse(localStorage.getItem(k)) || def; } catch (e) { return def; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function dayIndex() { return Math.floor(Date.now() / 864e5); }
  function prayerById(id) { return D.prayers.filter(function (p) { return p.id === id; })[0]; }
  function prayerHtml(p) { return '<details><summary>' + esc(p.title) + '<span class="tag">' + esc(p.tag) + '</span></summary><p class="prayer">' + esc(p.text) + '</p></details>'; }

  var timer = null;
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

  // --- telas ---
  var routes = {
    '': function () {
      var r = D.reflections[dayIndex() % D.reflections.length];
      var moods = load('moods', {}), sel = moods[today()];
      var html = '<h2>Bem-vindo(a)</h2><section class="card"><h3>Reflexão do dia</h3><p class="verse">' + esc(r.verse) + '</p><p>' + esc(r.text) + '</p></section>' +
        '<section class="card"><h3>Como você está agora?</h3><div class="moods" role="group" aria-label="Humor">' +
        D.moods.map(function (m) { return '<button data-mood="' + m.id + '" aria-pressed="' + (sel === m.id) + '">' + m.emoji + '<span>' + m.label + '</span></button>'; }).join('') +
        '</div><div id="mood-out"></div></section>';
      app.innerHTML = html;
      function show(id) {
        var m = D.moods.filter(function (x) { return x.id === id; })[0], p = prayerById(m.prayer);
        document.getElementById('mood-out').innerHTML = '<p>' + esc(m.tip) + '</p>' + prayerHtml(p) +
          ((id === 'ansioso' || id === 'triste') ? '<p><a class="btn ghost" href="#/respirar">Respirar juntos</a> <a class="btn ghost" href="#/ajuda">Falar com alguém</a></p>' : '');
      }
      if (sel) show(sel);
      app.querySelectorAll('[data-mood]').forEach(function (b) {
        b.onclick = function () {
          moods[today()] = b.dataset.mood; save('moods', moods);
          app.querySelectorAll('[data-mood]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
          show(b.dataset.mood);
        };
      });
    },
    oracoes: function () {
      app.innerHTML = '<h2>Orações</h2><section class="card">' + D.prayers.map(prayerHtml).join('') + '</section>';
    },
    respirar: function () {
      app.innerHTML = '<h2>Respiração guiada</h2><p class="muted">Inspire 4s, segure 4s, expire 6s. Faça a Ave Maria ou a oração de Jesus ("Jesus, eu confio em Vós") a cada ciclo.</p>' +
        '<div class="breath"><div class="circle" id="c" role="status" aria-live="polite">Pronto</div></div>' +
        '<p><button id="go">Começar</button></p>';
      var c = document.getElementById('c'), go = document.getElementById('go');
      var steps = [['Inspire…', 4, 1.6], ['Segure…', 4, 1.6], ['Expire…', 6, 1]], i = 0, left = 0, running = false;
      function tick() {
        if (left <= 0) {
          var s = steps[i++ % 3]; left = s[1]; c.textContent = s[0];
          c.style.transitionDuration = s[1] + 's'; c.style.transform = 'scale(' + s[2] + ')';
        }
        left--;
      }
      go.onclick = function () {
        stopTimer();
        if (running) { running = false; go.textContent = 'Começar'; c.textContent = 'Pronto'; c.style.transform = ''; return; }
        running = true; i = 0; left = 0; go.textContent = 'Parar'; tick(); timer = setInterval(tick, 1000);
      };
    },
    diario: function () {
      var entries = load('journal', []);
      app.innerHTML = '<h2>Diário de gratidão e emoções</h2><p class="muted">Suas anotações ficam apenas neste aparelho.</p>' +
        '<section class="card"><label for="t">O que você quer entregar a Deus ou agradecer hoje?</label><textarea id="t"></textarea><p><button id="s">Salvar</button></p></section>' +
        '<section id="list"></section>';
      function render() {
        document.getElementById('list').innerHTML = entries.map(function (e, n) {
          return '<div class="entry"><span class="muted">' + esc(e.d) + '</span><p class="prayer">' + esc(e.t) + '</p><button class="ghost" data-del="' + n + '">Apagar</button></div>';
        }).join('') || '<p class="muted">Nenhuma anotação ainda.</p>';
        document.querySelectorAll('[data-del]').forEach(function (b) {
          b.onclick = function () { entries.splice(+b.dataset.del, 1); save('journal', entries); render(); };
        });
      }
      document.getElementById('s').onclick = function () {
        var t = document.getElementById('t'), v = t.value.trim();
        if (!v) return;
        entries.unshift({ d: new Date().toLocaleString('pt-BR'), t: v }); save('journal', entries); t.value = ''; render();
      };
      render();
    },
    ajuda: function () {
      app.innerHTML = '<h2>Ajuda e apoio</h2><section class="card"><p><strong>Se você está pensando em se machucar ou tirar a própria vida, ligue agora para o 188 (CVV) ou 192 (SAMU).</strong> Você não precisa passar por isso sozinho(a).</p></section>' +
        D.help.map(function (h) {
          return '<section class="card"><h3>' + esc(h.name) + '</h3><p>' + esc(h.desc) + '</p>' +
            (h.tel ? '<a class="btn" href="tel:' + h.tel + '">Ligar ' + h.tel + '</a> ' : '') +
            (h.link ? '<a class="btn ghost" href="' + h.link + '" target="_blank" rel="noopener">Site</a>' : '') + '</section>';
        }).join('') +
        '<section class="card"><h3>Apoio espiritual</h3><p>Converse com seu pároco ou procure a pastoral da sua comunidade. Oração e acompanhamento profissional caminham juntos.</p></section>';
    }
  };

  function route() {
    stopTimer();
    var r = (location.hash.replace(/^#\/?/, '') || '');
    (routes[r] || routes[''])();
    document.querySelectorAll('.tabs a').forEach(function (a) {
      if (a.dataset.r === r) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
})();
