// Música ambiente. As faixas sintetizadas são geradas em tempo real (Web Audio), com melodias
// antigas de domínio público ou improvisos originais. Gravações reais (MP3) podem ser listadas em src/playlist.js.
(function () {
  'use strict';
  var ctx, master, bus, on = false, vol = 0.7, timers = [], held = [], listeners = [], cur = null, fileEl = null;
  var TRACKS = [], trackIdx = 0;

  function ensure() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0;
    var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -10; comp.ratio.value = 4;
    var conv = ctx.createConvolver(); conv.buffer = impulse(5);
    var wet = ctx.createGain(); wet.gain.value = 0.8;
    var dry = ctx.createGain(); dry.gain.value = 0.35;
    bus = ctx.createGain();
    bus.connect(dry); bus.connect(conv); conv.connect(wet);
    dry.connect(comp); wet.connect(comp); comp.connect(master); master.connect(ctx.destination);
    return ctx;
  }
  // Reverberação de igreja sintética: ruído com decaimento exponencial.
  function impulse(secs) {
    var len = Math.floor(ctx.sampleRate * secs), buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++) {
      var d = buf.getChannelData(ch);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    return buf;
  }
  function later(fn, s) { timers.push(setTimeout(function () { if (on) fn(); }, s * 1000)); }
  function hz(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }
  var NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function m(n) { var r = /^([A-G])(#|b)?(\d)$/.exec(n); return 12 * (+r[3] + 1) + NOTE[r[1]] + (r[2] === '#' ? 1 : r[2] === 'b' ? -1 : 0); }
  function env(g, t, a, dur, rel, peak) {
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.setValueAtTime(peak, t + Math.max(a, dur - 0.05)); g.gain.linearRampToValueAtTime(0, t + dur + rel);
  }

  /* ---------- timbres ---------- */
  // Coro masculino: dentes-de-serra desafinadas por formantes da vogal "a", com vibrato.
  function choir(freq, t, dur, level) {
    var g = ctx.createGain(), mix = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 2600; mix.gain.value = level * 0.5;
    var vib = ctx.createOscillator(), vg = ctx.createGain();
    vib.frequency.value = 4.8; vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(freq * 0.004, t + 1.8);
    vib.connect(vg); vib.start(t); vib.stop(t + dur + 2.5);
    [-6, 0, 7].forEach(function (c) {
      var o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = freq; o.detune.value = c;
      vg.connect(o.frequency); o.connect(mix); o.start(t); o.stop(t + dur + 2.5);
    });
    [[650, 7, 1], [1080, 9, 0.5], [2650, 12, 0.18]].forEach(function (f) {
      var bp = ctx.createBiquadFilter(), fg = ctx.createGain();
      bp.type = 'bandpass'; bp.frequency.value = f[0]; bp.Q.value = f[1]; fg.gain.value = f[2];
      mix.connect(bp); bp.connect(fg); fg.connect(lp);
    });
    env(g, t, 1.2, dur, 2, 1); lp.connect(g); g.connect(bus);
  }
  // Órgão de tubos: registros de 8', 4' e 2 2/3'.
  function organ(freq, t, dur, level) {
    var g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 1800;
    [[1, 'sine', 1], [2, 'sine', 0.45], [3, 'sine', 0.18], [1, 'square', 0.06]].forEach(function (p) {
      var o = ctx.createOscillator(), og = ctx.createGain();
      o.type = p[1]; o.frequency.value = freq * p[0]; og.gain.value = p[2] * level;
      o.connect(og); og.connect(lp); o.start(t); o.stop(t + dur + 1.5);
    });
    env(g, t, 0.25, dur, 0.9, 1); lp.connect(g); g.connect(bus);
  }
  // Harmônio (órgão de capela): palheta suave.
  function reed(freq, t, dur, level) {
    var g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 1400; lp.Q.value = 0.7;
    [0, 5].forEach(function (c) {
      var o = ctx.createOscillator(), og = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.value = freq; o.detune.value = c; og.gain.value = level * 0.35;
      o.connect(og); og.connect(lp); o.start(t); o.stop(t + dur + 1);
    });
    env(g, t, 0.12, dur, 0.5, 1); lp.connect(g); g.connect(bus);
  }
  // Corda dedilhada (harpa).
  function harp(freq, t, level) {
    var g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(4000, t); lp.frequency.exponentialRampToValueAtTime(700, t + 2.5);
    [[1, 'triangle', 1], [2, 'sine', 0.35], [3, 'sine', 0.12]].forEach(function (p) {
      var o = ctx.createOscillator(), og = ctx.createGain();
      o.type = p[1]; o.frequency.value = freq * p[0]; og.gain.value = p[2] * level;
      o.connect(og); og.connect(lp); o.start(t); o.stop(t + 4.5);
    });
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + 0.008); g.gain.exponentialRampToValueAtTime(0.001, t + 4.2);
    lp.connect(g); g.connect(bus);
  }
  // Sino de bronze: parciais inarmônicas.
  function bell(freq, t, level) {
    [[0.5, 0.5, 9], [1, 1, 7], [1.2, 0.5, 5], [1.5, 0.35, 4], [2, 0.3, 3.5], [2.74, 0.2, 2.5], [3.76, 0.12, 1.8]].forEach(function (p) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = freq * p[0];
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(p[1] * level, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
      o.connect(g); g.connect(bus); o.start(t); o.stop(t + p[2] + 0.1);
    });
  }
  // Caixinha de música / celesta.
  function celesta(freq, t, level) {
    [[1, 1, 2.2], [4, 0.12, 0.6], [2, 0.2, 1.2]].forEach(function (p) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = freq * p[0];
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(p[1] * level, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
      o.connect(g); g.connect(bus); o.start(t); o.stop(t + p[2] + 0.1);
    });
  }
  // Nota contínua (bordão) que dura enquanto a faixa toca.
  function drone(freqs, level, type) {
    freqs.forEach(function (f, k) {
      var o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      o.type = type || (k === 0 ? 'sine' : 'triangle'); o.frequency.value = f; o.detune.value = k * 3;
      lp.type = 'lowpass'; lp.frequency.value = 420;
      g.gain.setValueAtTime(0, ctx.currentTime); g.gain.linearRampToValueAtTime(level / (k + 1), ctx.currentTime + 3);
      lfo.frequency.value = 0.05 + k * 0.03; lg.gain.value = level / (k + 1) * 0.3;
      lfo.connect(lg); lg.connect(g.gain); o.connect(lp); lp.connect(g); g.connect(bus);
      o.start(); lfo.start(); held.push({ o: o, lfo: lfo, g: g });
    });
  }
  function releaseHeld() {
    var t = ctx.currentTime;
    held.forEach(function (h) { h.g.gain.cancelScheduledValues(t); h.g.gain.setTargetAtTime(0, t, 0.5); h.o.stop(t + 3); h.lfo.stop(t + 3); });
    held = [];
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* ---------- faixas sintetizadas ---------- */
  // 1. Improviso modal em estilo gregoriano (modo dórico de ré), com órgão paralelo.
  function gregorian() {
    var SC = ['D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'].map(function (n) { return hz(m(n)); });
    var idx = 4, last = 0;
    drone([73.42, 110, 146.83], 0.17);
    (function next() {
      var step = pick([-2, -1, -1, 0, 1, 1, 2]), pull = idx > 8 ? -1 : (idx < 1 ? 1 : 0);
      idx = Math.max(0, Math.min(SC.length - 1, idx + step + pull));
      if (idx === last && Math.random() < 0.6) idx = Math.min(SC.length - 1, idx + 1);
      last = idx;
      var dur = 3 + Math.random() * 3, t = ctx.currentTime + 0.05;
      choir(SC[idx], t, dur, 0.16);
      if (Math.random() < 0.3) choir(SC[idx] * 0.75, t, dur, 0.09);
      later(next, dur * 0.75 + (Math.random() < 0.22 ? 3 + Math.random() * 3 : 0));
    })();
  }
  // 2. Coral de órgão: progressão lenta em ré maior com condução de vozes.
  function organChorale() {
    var CH = [['D3', 'A3', 'D4', 'F#4'], ['B2', 'G3', 'D4', 'G4'], ['B2', 'F#3', 'D4', 'F#4'], ['A2', 'E3', 'C#4', 'E4'],
      ['G2', 'G3', 'B3', 'D4'], ['F#2', 'A3', 'D4', 'D4'], ['E2', 'G3', 'B3', 'E4'], ['A2', 'E3', 'A3', 'C#4'],
      ['D3', 'F#3', 'A3', 'D4'], ['G2', 'D3', 'B3', 'D4'], ['E2', 'E3', 'G3', 'B3'], ['A2', 'E3', 'A3', 'C#4']];
    var i = 0;
    (function next() {
      var c = CH[i++ % CH.length], t = ctx.currentTime + 0.05, d = 5.5;
      c.forEach(function (n, k) { organ(hz(m(n)), t, d, k === 0 ? 0.1 : 0.07); });
      if (i % CH.length === 0) organ(hz(m('D2')), t, d, 0.08);
      later(next, d);
    })();
  }
  // 3. Harpa dos Salmos: arpejos lentos sobre acordes.
  function psalmHarp() {
    var CH = [['D3', 'A3', 'D4', 'F#4', 'A4', 'D5'], ['B2', 'F#3', 'B3', 'D4', 'F#4', 'B4'], ['G2', 'D3', 'G3', 'B3', 'D4', 'G4'], ['A2', 'E3', 'A3', 'C#4', 'E4', 'A4']];
    var i = 0;
    drone([73.42], 0.07, 'sine');
    (function next() {
      var c = CH[i++ % CH.length], t = ctx.currentTime + 0.05, step = 0.42;
      c.concat(c.slice(1, -1).reverse()).forEach(function (n, k) { harp(hz(m(n)), t + k * step, k === 0 ? 0.22 : 0.15); });
      later(next, step * 10 + 0.8);
    })();
  }
  // 4. Sinos do Ângelus: sinos esparsos sobre um bordão grave.
  function angelus() {
    var P = ['D3', 'A3', 'D4', 'F#4', 'A4'].map(function (n) { return hz(m(n)); });
    drone([73.42, 110], 0.13);
    var n = 0;
    (function next() {
      var t = ctx.currentTime + 0.05;
      if (n % 12 < 3) bell(P[2], t, 0.14); else bell(pick(P), t, 0.1);
      n++;
      later(next, n % 12 < 3 ? 2.2 : 4 + Math.random() * 5);
    })();
  }
  // Toca uma melodia com acordes. mel: [nota, tempos]; ch: um acorde por compasso.
  function song(mel, chords, beat, beatsPerBar, voice, pad, gap) {
    (function play() {
      var t0 = ctx.currentTime + 0.1, t = t0;
      mel.forEach(function (x) { if (x[0] !== 'R') voice(hz(m(x[0])), t, x[1] * beat); t += x[1] * beat; });
      chords.forEach(function (c, k) { c.forEach(function (n) { pad(hz(m(n)), t0 + k * beatsPerBar * beat, beatsPerBar * beat); }); });
      later(play, (t - t0) + gap);
    })();
  }
  // 5. Noite Feliz — Franz Gruber, 1818 (domínio público).
  function silentNight() {
    var C = ['C3', 'E3', 'G3'], G = ['B2', 'D3', 'G3'], F = ['A2', 'C3', 'F3'];
    var mel = [['G4', 1.5], ['A4', .5], ['G4', 1], ['E4', 3], ['G4', 1.5], ['A4', .5], ['G4', 1], ['E4', 3],
      ['D5', 2], ['D5', 1], ['B4', 3], ['C5', 2], ['C5', 1], ['G4', 3],
      ['A4', 2], ['A4', 1], ['C5', 1.5], ['B4', .5], ['A4', 1], ['G4', 1.5], ['A4', .5], ['G4', 1], ['E4', 3],
      ['A4', 2], ['A4', 1], ['C5', 1.5], ['B4', .5], ['A4', 1], ['G4', 1.5], ['A4', .5], ['G4', 1], ['E4', 3],
      ['D5', 2], ['D5', 1], ['F5', 1.5], ['D5', .5], ['B4', 1], ['C5', 3], ['E5', 3],
      ['C5', 1], ['G4', 1], ['E4', 1], ['G4', 1.5], ['F4', .5], ['D4', 1], ['C4', 6]];
    var ch = [C, C, C, C, G, G, C, C, F, F, C, C, F, F, C, C, G, G, C, C, C, G, C, C];
    song(mel, ch, 0.62, 3, function (f, t, d) { celesta(f, t, 0.2); reed(f, t, d * 0.95, 0.05); }, function (f, t, d) { reed(f, t, d, 0.035); }, 5);
  }
  // 6. Cânon em Ré — Johann Pachelbel, séc. XVII (domínio público): baixo ostinato e linha superior.
  function canon() {
    var bass = ['D3', 'A2', 'B2', 'F#2', 'G2', 'D2', 'G2', 'A2'];
    var chords = [['D4', 'F#4', 'A4'], ['C#4', 'E4', 'A4'], ['B3', 'D4', 'F#4'], ['A3', 'C#4', 'F#4'], ['B3', 'D4', 'G4'], ['A3', 'D4', 'F#4'], ['B3', 'D4', 'G4'], ['C#4', 'E4', 'A4']];
    var tops = [['F#5', 'E5', 'D5', 'C#5', 'B4', 'A4', 'B4', 'C#5'], ['D5', 'C#5', 'B4', 'A4', 'G4', 'F#4', 'G4', 'E4']];
    var cycle = 0, beat = 1.25;
    (function play() {
      var t0 = ctx.currentTime + 0.1, top = tops[Math.floor(cycle / 2) % 2];
      bass.forEach(function (b, k) {
        var t = t0 + k * 2 * beat;
        organ(hz(m(b)), t, 2 * beat, 0.09);
        chords[k].forEach(function (n) { reed(hz(m(n)), t, 2 * beat, 0.02); });
        if (cycle > 0) harp(hz(m(top[k])), t, 0.16);
        if (cycle > 1) harp(hz(m(chords[k][2])) * 2, t + beat, 0.08);
      });
      cycle++;
      later(play, bass.length * 2 * beat);
    })();
  }

  TRACKS = [
    { id: 'gregoriano', name: 'Canto gregoriano', desc: 'Coro em modo dórico, com bordão', play: gregorian },
    { id: 'orgao', name: 'Órgão da catedral', desc: 'Coral lento de órgão de tubos', play: organChorale },
    { id: 'harpa', name: 'Harpa dos Salmos', desc: 'Arpejos suaves de harpa', play: psalmHarp },
    { id: 'angelus', name: 'Sinos do Ângelus', desc: 'Sinos de bronze ao longe', play: angelus },
    { id: 'canon', name: 'Cânon em Ré', desc: 'Pachelbel, séc. XVII · órgão e harpa', play: canon },
    { id: 'noite-feliz', name: 'Noite Feliz', desc: 'Gruber, 1818 · harmônio e celesta', play: silentNight }
  ];
  // Gravações reais adicionadas pelo mantenedor do site (src/playlist.js)
  (window.PLAYLIST || []).forEach(function (p, k) {
    TRACKS.push({ id: 'file-' + k, name: p.title, desc: p.credit || 'Gravação', file: p.file });
  });

  function emit() { listeners.forEach(function (fn) { fn(on); }); }
  function startTrack() {
    var tr = TRACKS[trackIdx]; cur = tr;
    if (tr.file) {
      fileEl = fileEl || new Audio();
      fileEl.src = tr.file; fileEl.loop = TRACKS.filter(function (x) { return x.file; }).length === 1;
      fileEl.volume = Math.min(1, vol);
      fileEl.onended = function () { Ambient.next(); };
      fileEl.play().catch(function () {});
      return;
    }
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(vol * 2.2, ctx.currentTime, 1.5);
    tr.play();
  }
  function stopTrack(fast) {
    timers.forEach(clearTimeout); timers = [];
    if (fileEl) fileEl.pause();
    if (ctx) { releaseHeld(); master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(0, ctx.currentTime, fast ? 0.15 : 0.6); }
  }

  var Ambient = {
    tracks: function () { return TRACKS; },
    track: function () { return TRACKS[trackIdx]; },
    isOn: function () { return on; },
    onchange: function (fn) { listeners.push(fn); },
    volume: function () { return vol; },
    setTrack: function (id) {
      var k = TRACKS.map(function (x) { return x.id; }).indexOf(id);
      if (k < 0) return;
      var was = on;
      if (on) { on = false; stopTrack(true); }
      trackIdx = k;
      if (was) { var self = this; setTimeout(function () { self.start(); }, 350); } else emit();
    },
    next: function () { this.setTrack(TRACKS[(trackIdx + 1) % TRACKS.length].id); },
    start: function () {
      if (on || !ensure()) return;
      on = true; ctx.resume(); startTrack(); emit();
    },
    stop: function () { if (!on) return; on = false; stopTrack(); emit(); },
    toggle: function () { on ? Ambient.stop() : Ambient.start(); },
    setVolume: function (v) {
      vol = Math.max(0, Math.min(1, v));
      if (fileEl) fileEl.volume = vol;
      if (ctx && on && !(cur && cur.file)) master.gain.setTargetAtTime(vol * 2.2, ctx.currentTime, 0.2);
    },
    // Sino suave, usado no início e no fim do tempo de silêncio.
    chime: function () {
      if (!ensure()) return;
      ctx.resume();
      var t = ctx.currentTime, g = ctx.createGain(), out = ctx.createGain();
      out.gain.value = Math.max(0.15, vol) * 0.5;
      [[523.25, 1], [1046.5, 0.4], [1567.98, 0.15]].forEach(function (p) {
        var o = ctx.createOscillator(), og = ctx.createGain();
        o.frequency.value = p[0]; og.gain.value = p[1] * 0.3;
        o.connect(og); og.connect(g); o.start(t); o.stop(t + 4);
      });
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);
      g.connect(out); out.connect(ctx.destination);
    }
  };
  window.Ambient = Ambient;
})();
