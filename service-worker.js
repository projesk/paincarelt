const CACHE_NAME = 'paincarelt-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json'
  // Jeigu turi atskirus CSS/JS – įdėk ir juos
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME) && caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(cached => cached ||
      fetch(req).then(res => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
        return res;
      }).catch(() => caches.match('./index.html')))
  );
});
