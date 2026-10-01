// Service worker: o app abre mais rápido e funciona sem internet.
// Páginas e scripts: rede primeiro (para receber atualizações), com cópia em cache de reserva.
// Fontes e ícones: cache primeiro. Outros domínios (ex.: imagens do Wikimedia) não passam pelo cache.
var CACHE = 'paz-v1';
var SHELL = ['./', 'index.html', 'manifest.webmanifest', 'fonts/fonts.css', 'icons/icon-192.png',
  'src/styles.css', 'src/data.js', 'src/articles.js', 'src/saints.js', 'src/viasacra.js', 'src/devocional.js', 'src/playlist.js',
  'src/art.js', 'src/commons.js', 'src/share.js', 'src/audio.js', 'src/app.js'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (/\/(fonts|icons)\//.test(url.pathname)) {
    e.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) { var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, cp); }); return res; });
    }));
    return;
  }
  e.respondWith(fetch(req).then(function (res) {
    if (res.ok) { var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, cp); }); }
    return res;
  }).catch(function () {
    return caches.match(req).then(function (hit) { return hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined); });
  }));
});
