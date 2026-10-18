const CACHE_NAME = 'fx-dance-pwa-v5';
const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/extras.css',
  '/app_stable.js',
  '/extras.js',
  '/manifest.webmanifest',
  '/app-icon.svg',
  '/app-icon-192.png',
  '/app-icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith('fx-dance-pwa-') && key !== CACHE_NAME)
        .map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cached = await caches.match(request);
    const network = fetch(request).then(response => {
      if (response.ok && response.type === 'basic') {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    });

    if (request.mode === 'navigate') {
      try { return await network; }
      catch { return cached || caches.match('/index.html'); }
    }

    return cached || network;
  })());
});
