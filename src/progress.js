// Perfis locais, plano diário e registro de atividades.
// Tudo fica no localStorage deste aparelho. O PIN serve para separar pessoas que dividem o
// mesmo aparelho; não é uma proteção forte (os dados não são criptografados).
(function () {
  'use strict';
  var PREFIX = 'pp:';
  function get(k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v === null ? def : v; } catch (e) { return def; } }
  function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  function sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sput(k, v) { try { if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) {} }
  function dkey(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function addDays(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  async function hash(pin, salt) {
    var data = new TextEncoder().encode(salt + ':' + pin);
    if (window.crypto && crypto.subtle) {
      var buf = await crypto.subtle.digest('SHA-256', data);
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    }
    var h = 0; for (var i = 0; i < data.length; i++) h = (h * 31 + data[i]) | 0; return 'x' + h; // contexto sem crypto.subtle
  }

  var PRESETS = [
    { id: 'suave', name: 'Começo suave', desc: 'Cinco minutos por dia para criar o hábito.', goal: 5,
      items: [{ kind: 'devotional' }, { kind: 'practice', ref: 'respirar' }, { kind: 'practice', ref: 'jaculatoria' }, { kind: 'custom', label: 'Agradecer por uma coisa do dia' }] },
    { id: 'rotina', name: 'Rotina de oração', desc: 'Manhã, meio-dia e noite, com terço e leitura.', goal: 30,
      items: [{ kind: 'devotional' }, { kind: 'prayer', ref: 'manha' }, { kind: 'prayer', ref: 'angelus' }, { kind: 'practice', ref: 'terco' }, { kind: 'reading' }, { kind: 'practice', ref: 'exame' }] },
    { id: 'ansiedade', name: 'Dias de ansiedade', desc: 'Práticas curtas para acalmar corpo e mente.', goal: 10,
      items: [{ kind: 'practice', ref: 'respirar' }, { kind: 'practice', ref: 'aterramento' }, { kind: 'prayer', ref: 'sl131' }, { kind: 'custom', label: 'Conversar com alguém de confiança' }, { kind: 'custom', label: 'Caminhar 15 minutos ao ar livre' }] }
  ];

  var P = {
    PRESETS: PRESETS,
    dkey: dkey,
    addDays: addDays,
    profiles: function () { return get('profiles', []); },
    current: null,
    // Restaura a sessão: perfis com PIN pedem o PIN de novo a cada sessão do navegador.
    restore: function () {
      var id = sget('pp-session') || get('pp-remember', null);
      var pr = id && P.profiles().filter(function (x) { return x.id === id; })[0];
      P.current = pr ? P.data(id) : null;
      return P.current;
    },
    data: function (id) { return get(PREFIX + id, null); },
    save: function () { if (P.current) put(PREFIX + P.current.id, P.current); },
    create: async function (name, pin) {
      var id = uid(), d = { id: id, name: name.trim().slice(0, 40), created: Date.now(), goal: 10, plan: [], log: {}, journal: [], moods: {} };
      if (pin) d.pin = await hash(pin, id);
      // Leva para o novo perfil o diário e os humores já guardados neste aparelho (sem apagar os originais).
      if (!P.profiles().length) { d.journal = get('journal', []); d.moods = get('moods', {}); }
      var list = P.profiles(); list.push({ id: id, name: d.name, pin: !!pin }); put('profiles', list);
      put(PREFIX + id, d);
      P.enter(id);
      return d;
    },
    login: async function (id, pin) {
      var d = P.data(id); if (!d) return false;
      if (d.pin && (await hash(pin || '', id)) !== d.pin) return false;
      P.enter(id); return true;
    },
    enter: function (id) {
      var d = P.data(id); if (!d) return;
      sput('pp-session', id);
      if (!d.pin) put('pp-remember', id); else del('pp-remember');
      P.current = d;
    },
    logout: function () { sput('pp-session', null); del('pp-remember'); P.current = null; },
    remove: function (id) {
      put('profiles', P.profiles().filter(function (x) { return x.id !== id; }));
      del(PREFIX + id);
      if (P.current && P.current.id === id) P.logout();
    },
    setPin: async function (pin) {
      var d = P.current; if (!d) return;
      if (pin) d.pin = await hash(pin, d.id); else delete d.pin;
      put('profiles', P.profiles().map(function (x) { return x.id === d.id ? { id: x.id, name: d.name, pin: !!pin } : x; }));
      if (pin) del('pp-remember'); else put('pp-remember', d.id);
      P.save();
    },

    /* registro de atividades */
    log: function (key, label, minutes, kind) {
      var d = P.current; if (!d) return;
      var day = dkey(), L = d.log[day] = d.log[day] || { acts: [] };
      L.acts.push({ k: key, l: label, m: Math.max(0, Math.round(minutes || 0)), kind: kind || 'practice', t: Date.now() });
      P.save();
    },
    day: function (k) { var d = P.current; return (d && d.log[k]) || { acts: [] }; },
    minutes: function (k) { return P.day(k).acts.reduce(function (a, x) { return a + x.m; }, 0); },
    did: function (k, key) { return P.day(k).acts.some(function (x) { return x.k === key; }); },
    streak: function () {
      var t = new Date(), n = 0, i = P.day(dkey(t)).acts.length ? 0 : 1;
      while (P.day(dkey(addDays(t, -i - n))).acts.length) n++;
      return n;
    },
    best: function () {
      var d = P.current; if (!d) return 0;
      var keys = Object.keys(d.log).filter(function (k) { return d.log[k].acts.length; }).sort(), best = 0, run = 0, prev = null;
      keys.forEach(function (k) {
        var dt = new Date(k + 'T12:00:00');
        run = prev && Math.round((dt - prev) / 864e5) === 1 ? run + 1 : 1; best = Math.max(best, run); prev = dt;
      });
      return best;
    },

    /* plano diário */
    planItemKey: function (it) { return it.kind === 'custom' ? 'custom:' + it.id : it.kind === 'reading' ? 'reading:*' : it.kind === 'devotional' ? 'devotional:*' : it.kind + ':' + it.ref; },
    applyPreset: function (pid) {
      var pr = PRESETS.filter(function (x) { return x.id === pid; })[0]; if (!pr || !P.current) return;
      P.current.plan = pr.items.map(function (x) { return Object.assign({ id: uid() }, x); });
      P.current.goal = pr.goal; P.save();
    },
    addItem: function (it) { if (!P.current) return; P.current.plan.push(Object.assign({ id: uid() }, it)); P.save(); },
    removeItem: function (id) { if (!P.current) return; P.current.plan = P.current.plan.filter(function (x) { return x.id !== id; }); P.save(); },
    // Um item do plano está feito se a atividade correspondente foi registrada hoje (ou marcada à mão).
    itemDone: function (it, k) {
      var day = P.day(k || dkey()), key = P.planItemKey(it);
      if (key === 'reading:*') return day.acts.some(function (x) { return x.kind === 'reading'; });
      return day.acts.some(function (x) { return x.k === key; });
    },
    toggleCustom: function (it) {
      var d = P.current, day = dkey(), key = P.planItemKey(it); if (!d) return;
      var L = d.log[day] = d.log[day] || { acts: [] };
      var i = L.acts.map(function (x) { return x.k; }).indexOf(key);
      if (i > -1) L.acts.splice(i, 1); else L.acts.push({ k: key, l: it.label, m: 0, kind: 'custom', t: Date.now() });
      P.save();
    },

    /* backup */
    exportJSON: function () { return JSON.stringify({ app: 'paz-em-oracao', v: 1, profile: P.current }, null, 1); },
    importJSON: function (txt) {
      var o = JSON.parse(txt), d = o && o.profile;
      if (!d || !d.id || !d.name || typeof d.log !== 'object') throw new Error('Arquivo de backup inválido.');
      var list = P.profiles().filter(function (x) { return x.id !== d.id; });
      list.push({ id: d.id, name: d.name, pin: !!d.pin }); put('profiles', list); put(PREFIX + d.id, d);
      return d;
    }
  };
  window.Progress = P;
})();
