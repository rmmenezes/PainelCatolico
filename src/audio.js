// Música ambiente gerada em tempo real (Web Audio), inspirada no canto gregoriano:
// bordão grave contínuo, melodia lenta no modo dórico e, às vezes, órgão paralelo (quarta abaixo).
// Nada é baixado: não há arquivos de áudio nem direitos autorais envolvidos.
(function () {
  'use strict';
  var ctx, master, bus, on = false, vol = 0.7, timers = [], drones = [], listeners = [], idx = 3, last = 0;
  // Modo dórico de ré: D3 E3 F3 G3 A3 B3 C4 D4 E4 F4 G4 A4
  var SCALE = [146.83, 164.81, 174.61, 196.0, 220.0, 246.94, 261.63, 293.66, 329.63, 349.23, 392.0, 440.0];

  function ensure() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0;
    var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -10; comp.ratio.value = 4;
    var conv = ctx.createConvolver(); conv.buffer = impulse(ctx, 5);
    var wet = ctx.createGain(); wet.gain.value = 0.8;
    var dry = ctx.createGain(); dry.gain.value = 0.35;
    bus = ctx.createGain();
    bus.connect(dry); bus.connect(conv); conv.connect(wet);
    dry.connect(comp); wet.connect(comp); comp.connect(master); master.connect(ctx.destination);
    return ctx;
  }
  // Reverberação de catedral sintética: ruído com decaimento exponencial.
  function impulse(c, secs) {
    var len = Math.floor(c.sampleRate * secs), buf = c.createBuffer(2, len, c.sampleRate);
    for (var ch = 0; ch < 2; ch++) {
      var d = buf.getChannelData(ch);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    return buf;
  }
  function startDrone() {
    // D2 e A2 (quinta) com leve batimento; respiração lenta por LFO.
    [[73.42, 0.5], [110.0, 0.28], [146.83, 0.16]].forEach(function (p, k) {
      var o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      o.type = k === 0 ? 'sine' : 'triangle'; o.frequency.value = p[0]; o.detune.value = k * 3;
      f.type = 'lowpass'; f.frequency.value = 420;
      g.gain.value = p[1] * 0.35;
      lfo.frequency.value = 0.05 + k * 0.03; lg.gain.value = p[1] * 0.12;
      lfo.connect(lg); lg.connect(g.gain);
      o.connect(f); f.connect(g); g.connect(bus);
      o.start(); lfo.start();
      drones.push(o, lfo);
    });
  }
  // Voz de coro masculino: dentes-de-serra levemente desafinadas passando por formantes da vogal "a".
  function voice(freq, dur, level) {
    var t = ctx.currentTime, g = ctx.createGain(), mix = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 2600; mix.gain.value = level * 0.5;
    var vib = ctx.createOscillator(), vg = ctx.createGain();
    vib.frequency.value = 4.8; vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(freq * 0.004, t + 1.8);
    vib.connect(vg); vib.start(t); vib.stop(t + dur + 2.5);
    [-6, 0, 7].forEach(function (cents) {
      var o = ctx.createOscillator();
      o.type = 'sawtooth'; o.frequency.value = freq; o.detune.value = cents;
      vg.connect(o.frequency); o.connect(mix); o.start(t); o.stop(t + dur + 2.5);
    });
    [[650, 7, 1], [1080, 9, 0.5], [2650, 12, 0.18]].forEach(function (f) {
      var bp = ctx.createBiquadFilter(), fg = ctx.createGain();
      bp.type = 'bandpass'; bp.frequency.value = f[0]; bp.Q.value = f[1]; fg.gain.value = f[2];
      mix.connect(bp); bp.connect(fg); fg.connect(lp);
    });
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(1, t + 1.2);
    g.gain.setValueAtTime(1, t + dur - 0.4);
    g.gain.linearRampToValueAtTime(0, t + dur + 2);
    lp.connect(g); g.connect(bus);
  }
  function nextNote() {
    if (!on) return;
    // Movimento em graus conjuntos, com tendência a voltar à finalis (ré) e à repercussa (lá).
    var step = [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)];
    var pull = idx > 8 ? -1 : (idx < 1 ? 1 : 0);
    idx = Math.max(0, Math.min(SCALE.length - 1, idx + step + pull));
    if (idx === last && Math.random() < 0.6) idx = Math.min(SCALE.length - 1, idx + 1);
    last = idx;
    var dur = 3 + Math.random() * 3;
    voice(SCALE[idx], dur, 0.16);
    if (Math.random() < 0.3) voice(SCALE[idx] * 0.75, dur, 0.09); // organum paralelo: quarta abaixo
    var rest = Math.random() < 0.22 ? 3 + Math.random() * 3 : 0;
    timers.push(setTimeout(nextNote, (dur * 0.75 + rest) * 1000));
  }
  function emit() { listeners.forEach(function (fn) { fn(on); }); }

  var Ambient = {
    isOn: function () { return on; },
    onchange: function (fn) { listeners.push(fn); },
    volume: function () { return vol; },
    start: function () {
      if (on || !ensure()) return;
      on = true;
      ctx.resume();
      if (!drones.length) startDrone();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(vol * 2.2, ctx.currentTime, 2);
      nextNote();
      emit();
    },
    stop: function () {
      if (!on) return;
      on = false;
      timers.forEach(clearTimeout); timers = [];
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.6);
      emit();
    },
    toggle: function () { on ? Ambient.stop() : Ambient.start(); },
    setVolume: function (v) {
      vol = Math.max(0, Math.min(1, v));
      if (ctx && on) master.gain.setTargetAtTime(vol * 2.2, ctx.currentTime, 0.2);
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
      g.connect(out); out.connect(ctx.destination); out.connect(bus);
      if (ctx.state === 'suspended') ctx.resume();
    }
  };
  window.Ambient = Ambient;
})();
