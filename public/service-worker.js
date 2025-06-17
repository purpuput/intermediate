const CACHE_NAME = 'andrestory-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles/style.css',
  '/app.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://unpkg.com/leaflet/dist/leaflet.css',
  'https://unpkg.com/leaflet/dist/leaflet.js',
];

// INSTALL: Caching aset statis
self.addEventListener('install', (event) => {
  console.log('✅ [SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ACTIVATE: Bersihkan cache lama
self.addEventListener('activate', (event) => {
  console.log('✅ [SW] Activate');
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('🧹 [SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH: Strategi cache-first
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    }).catch(() => {
      // Fallback untuk navigasi offline
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});

// PUSH TEST: Lokal dari tombol
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'push-test') {
    const { title, body } = event.data;
    self.registration.showNotification(title, {
      body,
      icon: '/icons/icon-192x192.png',
    });
  }
});
