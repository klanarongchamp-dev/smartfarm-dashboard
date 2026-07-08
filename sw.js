/* Service Worker – สวนลุงนะ Smart Farm V8.0 */
const CACHE = 'sonlungna-v8';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './suanlungna_icon_180.png',
  './suanlungna_icon_512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network-first for API calls, cache-first for assets
  if (e.request.url.includes('api.open-meteo.com') ||
      e.request.url.includes('hivemq.cloud') ||
      e.request.url.includes('unpkg.com')) {
    e.respondWith(fetch(e.request).catch(() => new Response('', {status: 503})));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
