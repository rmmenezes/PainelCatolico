// Música ambiente. As faixas sintetizadas são geradas em tempo real (Web Audio): melodias antigas de
// domínio público ou improvisos originais em estilos tradicionais. Gravações reais (MP3) podem ser
// listadas em src/playlist.js.
//
// Cada faixa toca por um canal próprio (`out`). Ao trocar ou pausar, esse canal é silenciado e
// desligado, o que corta também as notas que a faixa anterior já havia agendado.
(function () {
  'use strict';
  var ctx, master, bus, out = null, on = false, vol = 0.7, timers = [], held = [], listeners = [], cur = null, fileEl = null, gen = 0;
  var TRACKS = [], trackIdx = 0;
  var LEVEL = 2.2;

  function ensure() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = vol * LEVEL;
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
  // Agenda um passo da faixa; ignorado se a faixa já foi trocada ou pausada.
  function later(fn, s) { var g = gen; timers.push(setTimeout(function () { if (on && g === gen) fn(); }, s * 1000)); }
  function hz(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }
  var NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function m(n) { var r = /^([A-G])(#|b)?(-?\d)$/.exec(n); return 12 * (+r[3] + 1) + NOTE[r[1]] + (r[2] === '#' ? 1 : r[2] === 'b' ? -1 : 0); }
  function f(n) { return hz(m(n)); }
  function env(g, t, a, dur, rel, peak) {
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.setValueAtTime(peak, t + Math.max(a, dur - 0.05)); g.gain.linearRampToValueAtTime(0, t + dur + rel);
  }
  function osc(type, freq, t, stop, dest, gain, detune) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq; if (detune) o.detune.value = detune; g.gain.value = gain;
    o.connect(g); g.connect(dest); o.start(t); o.stop(stop); return o;
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  var noiseBuf = null;
  function noise() {
    if (noiseBuf) return noiseBuf;
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
  }

  /* ---------- timbres (todos saem pelo canal da faixa atual) ---------- */
  // Coro masculino: dentes-de-serra desafinadas por formantes da vogal "a", com vibrato.
  function choir(freq, t, dur, level) {
    var g = ctx.createGain(), mix = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 2600; mix.gain.value = level * 0.5;
    var vib = ctx.createOscillator(), vg = ctx.createGain();
    vib.frequency.value = 4.8; vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(freq * 0.004, t + 1.8);
    vib.connect(vg); vib.start(t); vib.stop(t + dur + 2.5);
    [-6, 0, 7].forEach(function (c) { vg.connect(osc('sawtooth', freq, t, t + dur + 2.5, mix, 1, c).frequency); });
    [[650, 7, 1], [1080, 9, 0.5], [2650, 12, 0.18]].forEach(function (p) {
      var bp = ctx.createBiquadFilter(), fg = ctx.createGain();
      bp.type = 'bandpass'; bp.frequency.value = p[0]; bp.Q.value = p[1]; fg.gain.value = p[2];
      mix.connect(bp); bp.connect(fg); fg.connect(lp);
    });
    env(g, t, Math.min(1.2, dur / 2), dur, 2, 1); lp.connect(g); g.connect(out);
  }
  // Órgão de tubos: registros de 8', 4' e 2 2/3'.
  function organ(freq, t, dur, level) {
    var g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 1800;
    [[1, 'sine', 1], [2, 'sine', 0.45], [3, 'sine', 0.18], [1, 'square', 0.06]].forEach(function (p) { osc(p[1], freq * p[0], t, t + dur + 1.5, lp, p[2] * level); });
    env(g, t, 0.25, dur, 0.9, 1); lp.connect(g); g.connect(out);
  }
  // Harmônio (órgão de capela): palheta suave.
  function reed(freq, t, dur, level) {
    var g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 1400; lp.Q.value = 0.7;
    [0, 5].forEach(function (c) { osc('sawtooth', freq, t, t + dur + 1, lp, level * 0.35, c); });
    env(g, t, 0.12, dur, 0.5, 1); lp.connect(g); g.connect(out);
  }
  // Sanfona (acordeão) com o leve "batimento" das palhetas musette.
  function accordion(freq, t, dur, level) {
    var g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 2400;
    [-11, 0, 11].forEach(function (c) { osc('sawtooth', freq, t, t + dur + 0.3, lp, level * 0.22, c); });
    osc('square', freq / 2, t, t + dur + 0.3, lp, level * 0.08);
    env(g, t, 0.03, dur, 0.12, 1); lp.connect(g); g.connect(out);
  }
  // Corda dedilhada (harpa).
  function harp(freq, t, level) {
    var g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(4000, t); lp.frequency.exponentialRampToValueAtTime(700, t + 2.5);
    [[1, 'triangle', 1], [2, 'sine', 0.35], [3, 'sine', 0.12]].forEach(function (p) { osc(p[1], freq * p[0], t, t + 4.5, lp, p[2] * level); });
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + 0.008); g.gain.exponentialRampToValueAtTime(0.001, t + 4.2);
    lp.connect(g); g.connect(out);
  }
  // Viola caipira: cordas duplas (a segunda levemente desafinada e atrasada, como no ponteio).
  function viola(freq, t, level) {
    [[0, 0], [0.012, 6]].forEach(function (c) {
      var g = ctx.createGain(), lp = ctx.createBiquadFilter(), s = t + c[0];
      lp.type = 'lowpass'; lp.frequency.setValueAtTime(3800, s); lp.frequency.exponentialRampToValueAtTime(800, s + 0.9);
      osc('sawtooth', freq, s, s + 2.8, lp, level * 0.5, c[1]);
      osc('triangle', freq * 2, s, s + 2.8, lp, level * 0.2, c[1]);
      g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(1, s + 0.004); g.gain.exponentialRampToValueAtTime(0.001, s + 2.6);
      lp.connect(g); g.connect(out);
    });
  }
  // Piano suave.
  function piano(freq, t, level) {
    var g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(3000, t); lp.frequency.exponentialRampToValueAtTime(900, t + 3);
    [[1, 1, 'triangle'], [2, 0.35, 'sine'], [3, 0.12, 'sine'], [4, 0.05, 'sine']].forEach(function (p) { osc(p[2], freq * p[0], t, t + 6, lp, p[1] * level, p[0] > 1 ? 2 : 0); });
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + 0.006); g.gain.exponentialRampToValueAtTime(0.25, t + 0.8); g.gain.exponentialRampToValueAtTime(0.001, t + 5.5);
    lp.connect(g); g.connect(out);
  }
  // Flauta de madeira: seno com sopro e vibrato tardio.
  function flute(freq, t, dur, level) {
    var g = ctx.createGain(), vib = ctx.createOscillator(), vg = ctx.createGain();
    vib.frequency.value = 5.2; vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(freq * 0.006, t + Math.min(0.8, dur));
    vib.connect(vg); vib.start(t); vib.stop(t + dur + 0.6);
    vg.connect(osc('sine', freq, t, t + dur + 0.6, g, level).frequency);
    osc('sine', freq * 2, t, t + dur + 0.6, g, level * 0.12);
    var n = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), ng = ctx.createGain();
    n.buffer = noise(); n.loop = true; bp.type = 'bandpass'; bp.frequency.value = freq * 2; bp.Q.value = 3; ng.gain.value = level * 0.25;
    n.connect(bp); bp.connect(ng); ng.connect(g); n.start(t); n.stop(t + dur + 0.6);
    env(g, t, 0.12, dur, 0.35, 1); g.connect(out);
  }
  // Violoncelo: arco lento, com vibrato.
  function cello(freq, t, dur, level) {
    var g = ctx.createGain(), lp = ctx.createBiquadFilter(), bp = ctx.createBiquadFilter(), vib = ctx.createOscillator(), vg = ctx.createGain();
    lp.type = 'lowpass'; lp.frequency.value = 1500; bp.type = 'peaking'; bp.frequency.value = 280; bp.gain.value = 6;
    vib.frequency.value = 5; vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(freq * 0.005, t + 1.5);
    vib.connect(vg); vib.start(t); vib.stop(t + dur + 2);
    [-4, 4].forEach(function (c) { vg.connect(osc('sawtooth', freq, t, t + dur + 2, lp, level * 0.4, c).frequency); });
    lp.connect(bp); env(g, t, 0.9, dur, 1.4, 1); bp.connect(g); g.connect(out);
  }
  // Sino de bronze: parciais inarmônicas.
  function bell(freq, t, level) {
    [[0.5, 0.5, 9], [1, 1, 7], [1.2, 0.5, 5], [1.5, 0.35, 4], [2, 0.3, 3.5], [2.74, 0.2, 2.5], [3.76, 0.12, 1.8]].forEach(function (p) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = freq * p[0];
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(p[1] * level, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
      o.connect(g); g.connect(out); o.start(t); o.stop(t + p[2] + 0.1);
    });
  }
  // Caixinha de música / celesta.
  function celesta(freq, t, level) {
    [[1, 1, 2.2], [4, 0.12, 0.6], [2, 0.2, 1.2]].forEach(function (p) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = freq * p[0];
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(p[1] * level, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
      o.connect(g); g.connect(out); o.start(t); o.stop(t + p[2] + 0.1);
    });
  }
  // Som contínuo (bordão) que dura enquanto a faixa toca.
  function drone(freqs, level, type) {
    freqs.forEach(function (fr, k) {
      var o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      o.type = type || (k === 0 ? 'sine' : 'triangle'); o.frequency.value = fr; o.detune.value = k * 3;
      lp.type = 'lowpass'; lp.frequency.value = 420;
      g.gain.setValueAtTime(0, ctx.currentTime); g.gain.linearRampToValueAtTime(level / (k + 1), ctx.currentTime + 3);
      lfo.frequency.value = 0.05 + k * 0.03; lg.gain.value = level / (k + 1) * 0.3;
      lfo.connect(lg); lg.connect(g.gain); o.connect(lp); lp.connect(g); g.connect(out);
      o.start(); lfo.start(); held.push(o, lfo);
    });
  }
  // Chuva: ruído filtrado em camadas.
  function rainBed(level) {
    [['bandpass', 1400, 0.4, 0.5], ['lowpass', 350, 0.7, 0.9], ['highpass', 5000, 0.5, 0.18]].forEach(function (p) {
      var s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      s.buffer = noise(); s.loop = true; s.playbackRate.value = rnd(0.9, 1.1);
      fl.type = p[0]; fl.frequency.value = p[1]; fl.Q.value = p[2];
      g.gain.setValueAtTime(0, ctx.currentTime); g.gain.linearRampToValueAtTime(level * p[3], ctx.currentTime + 4);
      lfo.frequency.value = rnd(0.03, 0.08); lg.gain.value = level * p[3] * 0.3; lfo.connect(lg); lg.connect(g.gain);
      s.connect(fl); fl.connect(g); g.connect(out); s.start(); lfo.start(); held.push(s, lfo);
    });
  }
  function drip(t, level) {
    var fr = rnd(1800, 3800), o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(fr, t); o.frequency.exponentialRampToValueAtTime(fr * 1.6, t + 0.05);
    g.gain.setValueAtTime(level, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.08);
  }

  // Frase cantada: uma voz de coro que muda de nota e de vogal a cada sílaba (imita o texto salmodiado).
  var VOW = { a: [700, 1220, 2600], e: [450, 1900, 2550], i: [300, 2250, 2900], o: [480, 850, 2450], u: [340, 750, 2400] };
  function sung(notes, t0, level, pan) {
    var g = ctx.createGain(), mix = ctx.createGain(), lp = ctx.createBiquadFilter(), dest = g, end = t0;
    notes.forEach(function (n) { end += n[1]; });
    lp.type = 'lowpass'; lp.frequency.value = 2800; mix.gain.value = level * 0.5;
    if (pan && ctx.createStereoPanner) { var pn = ctx.createStereoPanner(); pn.pan.value = pan; g.connect(pn); pn.connect(out); } else g.connect(out);
    var vib = ctx.createOscillator(), vg = ctx.createGain();
    vib.frequency.value = 4.6; vg.gain.value = notes[0][0] * 0.0025; vib.connect(vg); vib.start(t0); vib.stop(end + 0.6);
    var oscs = [-7, 0, 6].map(function (c) { var o = osc('sawtooth', notes[0][0], t0, end + 0.6, mix, 1, c); vg.connect(o.frequency); return o; });
    var fs = [0, 1, 2].map(function (k) {
      var bp = ctx.createBiquadFilter(), fg = ctx.createGain();
      bp.type = 'bandpass'; bp.Q.value = [7, 9, 12][k]; bp.frequency.value = VOW.a[k]; fg.gain.value = [1, 0.5, 0.18][k];
      mix.connect(bp); bp.connect(fg); fg.connect(lp); return bp;
    });
    lp.connect(dest);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(1, t0 + 0.08);
    var t = t0;
    notes.forEach(function (n, k) {
      oscs.forEach(function (o) { o.frequency.setTargetAtTime(n[0], t, 0.018); });
      var v = VOW[n[2] || 'a']; fs.forEach(function (bp, j) { bp.frequency.setTargetAtTime(v[j], t, 0.025); });
      if (k) { g.gain.setTargetAtTime(0.6, t, 0.008); g.gain.setTargetAtTime(1, t + 0.035, 0.025); }
      t += n[1];
    });
    g.gain.setTargetAtTime(0, end - 0.05, 0.12);
    return end;
  }
  // Salmodia em estilo gregoriano: antífona, versículos recitados numa corda (tenor) com cadência
  // de meio de verso e final, em coros alternados, e doxologia. As melodias são geradas, não transcritas.
  function psalmody(o) {
    var S = o.scale.map(f), V = ['a', 'e', 'i', 'o', 'u', 'a', 'e', 'o'], syl = o.syl || 0.24, ant = null;
    function vow() { return pick(V); }
    function antiphon() {
      var i = o.final, notes = [], len = 9 + Math.floor(Math.random() * 4);
      for (var k = 0; k < len - 1; k++) {
        var neume = Math.random() < 0.35;
        notes.push([S[i], neume ? 0.2 : 0.36, vow()]);
        if (neume) notes.push([S[Math.min(S.length - 1, i + 1)], 0.2, notes[notes.length - 1][2]]);
        var target = k < len / 2 ? o.tenor : o.final;
        i = Math.max(0, Math.min(S.length - 1, i + (i < target ? pick([1, 1, 2, -1]) : i > target ? pick([-1, -1, -2, 1]) : pick([-1, 1]))));
      }
      notes.push([S[o.final], 1.1, 'a']);
      return notes;
    }
    function verse(first) {
      var n = [], k;
      (first || o.intoneAll ? o.inton : []).forEach(function (i) { n.push([S[i], syl * 1.2, vow()]); });
      for (k = 0; k < 6 + Math.floor(Math.random() * 7); k++) n.push([S[o.tenor], syl, vow()]);
      o.med.forEach(function (i, j) { n.push([S[i], j === o.med.length - 1 ? syl * 3 : syl * 1.4, vow()]); });
      n.push([0, 0.55]);
      for (k = 0; k < 5 + Math.floor(Math.random() * 8); k++) n.push([S[o.tenor], syl, vow()]);
      o.term.forEach(function (i, j) { n.push([S[i], j === o.term.length - 1 ? syl * 4 : syl * 1.4, j === o.term.length - 1 ? 'a' : vow()]); });
      return n;
    }
    // Canta uma sequência com pausas ([0, segundos]) e devolve o instante final.
    function sing(seq, t, level, pan) {
      var buf = [];
      seq.concat([[0, 0]]).forEach(function (x) {
        if (x[0]) buf.push(x);
        else { if (buf.length) t = sung(buf, t, level, pan); buf = []; t += x[1]; }
      });
      return t;
    }
    drone([S[o.final] / 2], 0.05, 'sine');
    (function cycle() {
      ant = antiphon();
      var t = ctx.currentTime + 0.2, v;
      t = sing(ant, t, 0.17, 0) + 1.1;
      for (v = 0; v < o.verses; v++) {
        t = sing(verse(v === 0), t, 0.15, v % 2 ? 0.35 : -0.35) + 0.9;
        if (o.refrain && v % o.refrain === o.refrain - 1) t = sing(ant, t, 0.17, 0) + 1.1;
      }
      t = sing(verse(false), t, 0.15, -0.35) + 0.9;   // Glória ao Pai…
      t = sing(verse(false), t, 0.15, 0.35) + 0.9;    // …Como era no princípio
      t = sing(ant, t, 0.17, 0) + 1.2;
      later(cycle, t - ctx.currentTime + 5);
    })();
  }

  /* ---------- geradores ---------- */
  // Canto modal improvisado: movimento por graus conjuntos, atraído pela finalis.
  function chant(scale, droneFreqs, opts) {
    var SC = scale.map(f), idx = opts.start || 4, last = -1;
    drone(droneFreqs, opts.drone || 0.17);
    (function next() {
      var step = pick([-2, -1, -1, 0, 1, 1, 2]), pull = idx > SC.length - 4 ? -1 : (idx < 1 ? 1 : 0);
      idx = Math.max(0, Math.min(SC.length - 1, idx + step + pull));
      if (idx === last && Math.random() < 0.6) idx = Math.min(SC.length - 1, idx + 1);
      last = idx;
      var dur = rnd(opts.min || 3, opts.max || 6), t = ctx.currentTime + 0.05;
      choir(SC[idx], t, dur, 0.16);
      if (Math.random() < (opts.organum || 0.3)) choir(SC[idx] * (opts.ratio || 0.75), t, dur, 0.09);
      later(next, dur * 0.75 + (Math.random() < 0.22 ? rnd(3, 6) : 0));
    })();
  }
  // Toca uma melodia com acordes. mel: [nota, tempos]; ch: um acorde por compasso.
  function song(mel, chords, beat, beatsPerBar, voice, pad, gap) {
    (function play() {
      var t0 = ctx.currentTime + 0.1, t = t0;
      mel.forEach(function (x) { if (x[0] !== 'R') voice(f(x[0]), t, x[1] * beat); t += x[1] * beat; });
      chords.forEach(function (c, k) { c.forEach(function (n) { pad(f(n), t0 + k * beatsPerBar * beat, beatsPerBar * beat); }); });
      later(play, (t - t0) + gap);
    })();
  }

  /* ---------- faixas ---------- */
  var T = {};
  // Sacro
  T.gregoriano = function () { chant(['D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'], [73.42, 110, 146.83], {}); };
  T.vesperas = function () { chant(['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'], [98, 146.83], { organum: 0.85, ratio: 2 / 3, min: 4, max: 7, start: 3, drone: 0.14 }); };
  T.orgao = function () {
    var CH = [['D3', 'A3', 'D4', 'F#4'], ['B2', 'G3', 'D4', 'G4'], ['B2', 'F#3', 'D4', 'F#4'], ['A2', 'E3', 'C#4', 'E4'],
      ['G2', 'G3', 'B3', 'D4'], ['F#2', 'A3', 'D4', 'D4'], ['E2', 'G3', 'B3', 'E4'], ['A2', 'E3', 'A3', 'C#4'],
      ['D3', 'F#3', 'A3', 'D4'], ['G2', 'D3', 'B3', 'D4'], ['E2', 'E3', 'G3', 'B3'], ['A2', 'E3', 'A3', 'C#4']];
    var i = 0;
    (function next() {
      var c = CH[i++ % CH.length], t = ctx.currentTime + 0.05, d = 5.5;
      c.forEach(function (n, k) { organ(f(n), t, d, k === 0 ? 0.1 : 0.07); });
      if (i % CH.length === 0) organ(f('D2'), t, d, 0.08);
      later(next, d);
    })();
  };
  T.harpa = function () {
    var CH = [['D3', 'A3', 'D4', 'F#4', 'A4', 'D5'], ['B2', 'F#3', 'B3', 'D4', 'F#4', 'B4'], ['G2', 'D3', 'G3', 'B3', 'D4', 'G4'], ['A2', 'E3', 'A3', 'C#4', 'E4', 'A4']];
    var i = 0;
    drone([73.42], 0.07, 'sine');
    (function next() {
      var c = CH[i++ % CH.length], t = ctx.currentTime + 0.05, step = 0.42;
      c.concat(c.slice(1, -1).reverse()).forEach(function (n, k) { harp(f(n), t + k * step, k === 0 ? 0.22 : 0.15); });
      later(next, step * 10 + 0.8);
    })();
  };
  T.angelus = function () {
    var P = ['D3', 'A3', 'D4', 'F#4', 'A4'].map(f), n = 0;
    drone([73.42, 110], 0.13);
    (function next() {
      var t = ctx.currentTime + 0.05;
      if (n % 12 < 3) bell(P[2], t, 0.14); else bell(pick(P), t, 0.1);
      n++;
      later(next, n % 12 < 3 ? 2.2 : rnd(4, 9));
    })();
  };
  // Liturgia das Horas (salmodia em estilo gregoriano)
  var MODE_F = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'Bb3', 'C4', 'D4', 'E4', 'F4'];
  var MODE_G = ['D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4'];
  var MODE_D = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'Bb3', 'C4', 'D4', 'E4', 'F4'];
  // Invitatório: a antífona volta depois de cada estrofe, como no início do Ofício.
  T.invitatorio = function () { psalmody({ scale: MODE_F, final: 3, tenor: 5, inton: [3, 4], med: [4, 5], term: [4, 3, 3], verses: 10, refrain: 2, syl: 0.23 }); };
  T.laudes = function () { psalmody({ scale: MODE_G, final: 3, tenor: 6, inton: [3, 4], med: [7, 6], term: [5, 6, 4, 3], verses: 8 }); };
  T.completas = function () { psalmody({ scale: MODE_D, final: 1, tenor: 5, inton: [3, 4], med: [6, 5, 4, 5], term: [4, 3, 2, 1], verses: 8, syl: 0.27 }); };
  T.magnificat = function () { psalmody({ scale: MODE_D, final: 1, tenor: 3, inton: [1, 2], med: [4, 3], term: [2, 1], verses: 10, intoneAll: true, syl: 0.25 }); };
  // Clássicos de domínio público
  // Cânon em Ré — Johann Pachelbel, séc. XVII: baixo ostinato e linha superior.
  T.canon = function () {
    var bass = ['D3', 'A2', 'B2', 'F#2', 'G2', 'D2', 'G2', 'A2'];
    var chords = [['D4', 'F#4', 'A4'], ['C#4', 'E4', 'A4'], ['B3', 'D4', 'F#4'], ['A3', 'C#4', 'F#4'], ['B3', 'D4', 'G4'], ['A3', 'D4', 'F#4'], ['B3', 'D4', 'G4'], ['C#4', 'E4', 'A4']];
    var tops = [['F#5', 'E5', 'D5', 'C#5', 'B4', 'A4', 'B4', 'C#5'], ['D5', 'C#5', 'B4', 'A4', 'G4', 'F#4', 'G4', 'E4']];
    var cycle = 0, beat = 1.25;
    (function play() {
      var t0 = ctx.currentTime + 0.1, top = tops[Math.floor(cycle / 2) % 2];
      bass.forEach(function (b, k) {
        var t = t0 + k * 2 * beat;
        organ(f(b), t, 2 * beat, 0.09);
        chords[k].forEach(function (n) { reed(f(n), t, 2 * beat, 0.02); });
        if (cycle > 0) harp(f(top[k]), t, 0.16);
        if (cycle > 1) harp(f(chords[k][2]) * 2, t + beat, 0.08);
      });
      cycle++;
      later(play, bass.length * 2 * beat);
    })();
  };
  // Noite Feliz — Franz Gruber, 1818.
  T['noite-feliz'] = function () {
    var C = ['C3', 'E3', 'G3'], G = ['B2', 'D3', 'G3'], F = ['A2', 'C3', 'F3'];
    var mel = [['G4', 1.5], ['A4', .5], ['G4', 1], ['E4', 3], ['G4', 1.5], ['A4', .5], ['G4', 1], ['E4', 3],
      ['D5', 2], ['D5', 1], ['B4', 3], ['C5', 2], ['C5', 1], ['G4', 3],
      ['A4', 2], ['A4', 1], ['C5', 1.5], ['B4', .5], ['A4', 1], ['G4', 1.5], ['A4', .5], ['G4', 1], ['E4', 3],
      ['A4', 2], ['A4', 1], ['C5', 1.5], ['B4', .5], ['A4', 1], ['G4', 1.5], ['A4', .5], ['G4', 1], ['E4', 3],
      ['D5', 2], ['D5', 1], ['F5', 1.5], ['D5', .5], ['B4', 1], ['C5', 3], ['E5', 3],
      ['C5', 1], ['G4', 1], ['E4', 1], ['G4', 1.5], ['F4', .5], ['D4', 1], ['C4', 6]];
    var ch = [C, C, C, C, G, G, C, C, F, F, C, C, F, F, C, C, G, G, C, C, C, G, C, C];
    song(mel, ch, 0.62, 3, function (fr, t, d) { celesta(fr, t, 0.2); reed(fr, t, d * 0.95, 0.05); }, function (fr, t, d) { reed(fr, t, d, 0.035); }, 5);
  };
  T.violoncelos = function () {
    var CH = [['D2', 'A2', 'F3', 'D4'], ['Bb2', 'F3', 'D4', 'F4'], ['F2', 'C3', 'A3', 'F4'], ['C3', 'G3', 'E4', 'G4'],
      ['G2', 'D3', 'Bb3', 'G4'], ['D2', 'A2', 'F3', 'D4'], ['A2', 'E3', 'C#4', 'E4'], ['D2', 'A2', 'F3', 'D4']];
    var i = 0;
    (function next() {
      var c = CH[i++ % CH.length], t = ctx.currentTime + 0.05, d = 6.5;
      c.forEach(function (n, k) { cello(f(n), t + k * 0.08, d, k === 0 ? 0.11 : 0.08); });
      later(next, d + 0.3);
    })();
  };
  T.piano = function () {
    var CH = [['D3', 'A3', 'C#4', 'F#4'], ['B2', 'F#3', 'A3', 'D4'], ['G2', 'D3', 'F#3', 'B3'], ['A2', 'E3', 'A3', 'D4']];
    var PEN = ['D5', 'E5', 'F#5', 'A5', 'B5', 'A4', 'B4'], i = 0, bar = 5;
    (function next() {
      var c = CH[i++ % CH.length], t = ctx.currentTime + 0.05;
      c.forEach(function (n, k) { piano(f(n), t + k * 0.14, k === 0 ? 0.2 : 0.1); });
      if (i % 4 === 0) piano(f('C#4'), t + bar * 0.6, 0.09);
      [1, 2, 3].forEach(function (b) { if (Math.random() < 0.7) piano(f(pick(PEN)), t + b * bar / 4 + rnd(0, 0.15), 0.09); });
      later(next, bar);
    })();
  };
  T.flauta = function () {
    var SC = ['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'].map(f), idx = 4;
    drone([73.42, 110], 0.12);
    (function next() {
      idx = Math.max(0, Math.min(SC.length - 1, idx + pick([-2, -1, -1, 1, 1, 2]) + (idx > 6 ? -1 : 0)));
      var t = ctx.currentTime + 0.05, dur = pick([0.5, 0.8, 1.2, 1.6, 2.4]);
      if (Math.random() < 0.3 && idx < SC.length - 1) { flute(SC[idx + 1], t, 0.12, 0.1); t += 0.12; }
      flute(SC[idx], t, dur, 0.12);
      later(next, dur + 0.15 + (Math.random() < 0.18 ? rnd(1.5, 3.5) : 0));
    })();
  };
  // Natureza
  T.chuva = function () {
    rainBed(0.35);
    drone([73.42, 110], 0.06);
    (function drops() { drip(ctx.currentTime + 0.02, rnd(0.004, 0.02)); later(drops, rnd(0.04, 0.35)); })();
    (function bells() { bell(f('D4'), ctx.currentTime + 0.05, 0.05); later(bells, rnd(18, 30)); })();
  };
  // Brasil (estilos tradicionais; melodias improvisadas, não são obras específicas)
  T.viola = function () {
    var S = ['D3', 'E3', 'F#3', 'G3', 'A3', 'B3', 'C#4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5', 'E5', 'F#5'];
    var PAIRS = { D: [['D4', 'F#4'], ['F#4', 'A4'], ['A4', 'D5'], ['D5', 'F#5']], A: [['C#4', 'E4'], ['E4', 'A4'], ['A4', 'C#5'], ['C#5', 'E5']], G: [['B3', 'D4'], ['D4', 'G4'], ['G4', 'B4'], ['B4', 'D5']] };
    var BASS = { D: ['D3', 'A2'], A: ['A2', 'E3'], G: ['G2', 'D3'] };
    var PROG = ['D', 'D', 'A', 'A', 'A', 'A', 'D', 'D', 'G', 'G', 'D', 'D', 'A', 'A', 'D', 'D'];
    var bar = 0, beat = 0.62;
    function pair(p, t, lv) { viola(f(p[0]), t, lv); viola(f(p[1]), t + 0.01, lv); }
    (function next() {
      var c = PROG[bar % PROG.length], t = ctx.currentTime + 0.05;
      viola(f(BASS[c][bar % 2]), t, 0.2);
      if (bar % 8 === 7) {
        // ponteio: descida em terças paralelas
        for (var k = 0; k < 6; k++) { var i = 11 - k; pair([S[i], S[i + 2]], t + k * beat / 2, 0.11); }
      } else {
        pair(pick(PAIRS[c]), t, 0.12); pair(pick(PAIRS[c]), t + beat, 0.1); pair(pick(PAIRS[c]), t + 2 * beat, 0.1);
      }
      bar++;
      later(next, 3 * beat);
    })();
  };
  T.sanfona = function () {
    var S = ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5'];
    var TONES = { G: ['G4', 'B4', 'D5', 'G5'], D: ['F#4', 'A4', 'D5', 'C5'], C: ['E4', 'G4', 'C5', 'E5'] };
    var CH = { G: ['G3', 'B3', 'D4'], D: ['F#3', 'A3', 'C4'], C: ['E3', 'G3', 'C4'] };
    var BASS = { G: ['G2', 'D3'], D: ['D3', 'A2'], C: ['C3', 'G2'] };
    var PROG = ['G', 'G', 'D', 'D', 'D', 'D', 'G', 'G', 'C', 'C', 'G', 'G', 'D', 'D', 'G', 'G'];
    var RHY = [[2, 1], [1, 1, 1], [3], [1.5, 0.5, 1], [2, 1]];
    var bar = 0, beat = 0.5, prev = 'B4';
    function third(n) { var i = S.indexOf(n); return i >= 2 ? S[i - 2] : null; }
    (function next() {
      var c = PROG[bar % PROG.length], t = ctx.currentTime + 0.05, last = bar % PROG.length === PROG.length - 1;
      accordion(f(BASS[c][bar % 2]), t, beat * 0.55, 0.14);
      CH[c].forEach(function (n) { accordion(f(n), t + beat, beat * 0.35, 0.05); accordion(f(n), t + 2 * beat, beat * 0.35, 0.05); });
      var rhy = last ? [3] : pick(RHY), tt = t;
      rhy.forEach(function (d) {
        var opts = TONES[c].slice().sort(function (a, b) { return Math.abs(m(a) - m(prev)) - Math.abs(m(b) - m(prev)); });
        var n = last ? 'G4' : opts[Math.random() < 0.7 ? 0 : 1];
        if (n === prev && Math.random() < 0.5) n = opts[1];
        accordion(f(n), tt, d * beat * 0.95, 0.1);
        var th = third(n); if (th) accordion(f(th), tt, d * beat * 0.95, 0.06);
        prev = n; tt += d * beat;
      });
      bar++;
      later(next, 3 * beat + (last ? 1.5 : 0));
    })();
  };
  T.bendito = function () {
    // Modo mixolídio de ré (sétima abaixada), típico dos benditos do sertão.
    var S = ['A3', 'C4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C5', 'D5'];
    var beat = 0.55, n = 0;
    drone([73.42, 110], 0.11);
    function phrase(end) {
      var len = pick([6, 7, 8]), i = pick([2, 6]), out2 = [];
      for (var k = 0; k < len - 1; k++) { out2.push(i); i = Math.max(1, Math.min(S.length - 1, i + pick([-2, -1, -1, 1, 1, 2]))); }
      out2.push(end); return out2;
    }
    var RHY = [1, 1, 1, 1, 2, 1, 1, 3];
    (function next() {
      var p = phrase(n % 2 ? 2 : 6), t = ctx.currentTime + 0.1, tt = t;
      [0, 1].forEach(function (rep) {
        p.forEach(function (i, k) {
          var d = (k === p.length - 1 ? 3 : RHY[k % RHY.length]) * beat;
          choir(f(S[i]), tt, d, rep ? 0.13 : 0.15);
          if (i >= 2) choir(f(S[i - 2]), tt, d, 0.07);
          tt += d;
        });
        tt += beat;
      });
      n++;
      later(next, tt - t + 1.2);
    })();
  };

  TRACKS = [
    { id: 'gregoriano', gain: 0.8, group: 'Sacro', name: 'Canto gregoriano', desc: 'Coro em modo dórico, com bordão' },
    { id: 'vesperas', gain: 2.5, group: 'Sacro', name: 'Vésperas no mosteiro', desc: 'Coro a duas vozes em quintas (organum)' },
    { id: 'orgao', group: 'Sacro', name: 'Órgão da catedral', desc: 'Coral lento de órgão de tubos' },
    { id: 'harpa', gain: 1.3, group: 'Sacro', name: 'Harpa dos Salmos', desc: 'Arpejos suaves de harpa' },
    { id: 'angelus', group: 'Sacro', name: 'Sinos do Ângelus', desc: 'Sinos de bronze ao longe' },
    { id: 'invitatorio', gain: 2.2, group: 'Liturgia das Horas', name: 'Invitatório (Sl 94)', desc: 'Antífona e salmo em coros alternados · abertura do dia', text: 'sl95' },
    { id: 'laudes', gain: 1.4, group: 'Liturgia das Horas', name: 'Laudes · Salmo 62', desc: 'Salmodia da manhã em estilo gregoriano', text: 'sl63' },
    { id: 'magnificat', gain: 3.4, group: 'Liturgia das Horas', name: 'Magnificat', desc: 'Cântico de Maria, das Vésperas', text: 'magnificat' },
    { id: 'completas', gain: 3.4, group: 'Liturgia das Horas', name: 'Completas · Salmo 90', desc: 'Salmodia da noite, mais lenta', text: 'sl91' },
    { id: 'bendito', gain: 1.1, group: 'Brasil', name: 'Bendito do sertão', desc: 'Coro em modo mixolídio, estilo nordestino' },
    { id: 'viola', gain: 3, group: 'Brasil', name: 'Viola de romaria', desc: 'Viola caipira em terças, toada' },
    { id: 'sanfona', gain: 4, group: 'Brasil', name: 'Sanfona de novena', desc: 'Valsa de sanfona, como nas novenas do interior' },
    { id: 'canon', gain: 1.3, group: 'Clássicos', name: 'Cânon em Ré', desc: 'Pachelbel, séc. XVII · órgão e harpa' },
    { id: 'noite-feliz', gain: 2, group: 'Clássicos', name: 'Noite Feliz', desc: 'Gruber, 1818 · harmônio e celesta' },
    { id: 'violoncelos', gain: 1.7, group: 'Clássicos', name: 'Violoncelos em oração', desc: 'Acordes lentos de cordas' },
    { id: 'piano', gain: 3, group: 'Clássicos', name: 'Piano contemplativo', desc: 'Acordes e notas soltas, sem pressa' },
    { id: 'flauta', gain: 0.8, group: 'Natureza', name: 'Flauta do deserto', desc: 'Flauta de madeira sobre bordão' },
    { id: 'chuva', group: 'Natureza', name: 'Chuva no claustro', desc: 'Chuva, gotas e um sino distante · bom para dormir' }
  ];
  TRACKS.forEach(function (tr) { tr.play = T[tr.id]; });
  // Gravações reais adicionadas pelo mantenedor do site (src/playlist.js)
  (window.PLAYLIST || []).forEach(function (p, k) {
    TRACKS.push({ id: 'file-' + k, group: 'Gravações', name: p.title, desc: p.credit || 'Gravação', file: p.file });
  });

  function emit() { listeners.forEach(function (fn) { fn(on); }); }
  function startTrack() {
    var tr = TRACKS[trackIdx]; cur = tr; gen++;
    if (tr.file) {
      fileEl = fileEl || new Audio();
      fileEl.src = tr.file; fileEl.loop = TRACKS.filter(function (x) { return x.file; }).length === 1;
      fileEl.volume = Math.min(1, vol);
      fileEl.onended = function () { Ambient.next(); };
      fileEl.play().catch(function () {});
      return;
    }
    out = ctx.createGain(); out.connect(bus);
    out.gain.setValueAtTime(0, ctx.currentTime); out.gain.linearRampToValueAtTime(tr.gain || 1, ctx.currentTime + 1.5);
    tr.play();
  }
  // Silencia e desliga o canal da faixa atual: cortam-se também as notas já agendadas.
  function stopTrack() {
    gen++;
    timers.forEach(clearTimeout); timers = [];
    if (fileEl) fileEl.pause();
    if (!ctx) return;
    var t = ctx.currentTime, o = out, h = held;
    out = null; held = [];
    if (o) {
      o.gain.cancelScheduledValues(t); o.gain.setValueAtTime(o.gain.value, t); o.gain.linearRampToValueAtTime(0, t + 0.4);
      setTimeout(function () { try { o.disconnect(); } catch (e) {} }, 600);
    }
    h.forEach(function (n) { try { n.stop(t + 0.5); } catch (e) {} });
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
      trackIdx = k;
      if (on) { stopTrack(); startTrack(); }
      emit();
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
      if (ctx) master.gain.setTargetAtTime(vol * LEVEL, ctx.currentTime, 0.2);
    },
    // Sino suave, usado no início e no fim do tempo de silêncio.
    chime: function () {
      if (!ensure()) return;
      ctx.resume();
      var t = ctx.currentTime, g = ctx.createGain(), o2 = ctx.createGain();
      o2.gain.value = Math.max(0.15, vol) * 0.5;
      [[523.25, 1], [1046.5, 0.4], [1567.98, 0.15]].forEach(function (p) { osc('sine', p[0], t, t + 4, g, p[1] * 0.3); });
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);
      g.connect(o2); o2.connect(ctx.destination);
    }
  };
  window.Ambient = Ambient;
})();
