const CACHE_NAME = 'the-app-hub-v1';
const CORE_ASSETS = ['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png','./apps/y2k.html','./apps/shazam.html','./apps/whitegold.html','./apps/sugar.html'];
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => Promise.all(CORE_ASSETS.map((u) => cache.add(u).catch(() => {})))));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      const net = fetch(req).then((res) => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {}); } return res; }).catch(() => cached);
      return cached || net;
    })
  );
});
