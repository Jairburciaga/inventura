// Guarda la página en el teléfono para que se abra también sin conexión.
// Al publicar una versión nueva, cambiar VERZE.
const VERZE = 'inventura-v1';
const SOUBORY = ['./', './index.html', './jsQR.js', './manifest.webmanifest', './ikona-192.png', './ikona-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERZE).then(c => c.addAll(SOUBORY)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== VERZE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
// Solo los archivos de la propia página; los envíos a Google van siempre por la red
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => { const kopie = r.clone(); caches.open(VERZE).then(c => c.put(e.request, kopie)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
