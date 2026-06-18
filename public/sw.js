const CACHE_NAME = 'gloiremedia-cache-v10';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// 1. Installation du Service Worker et mise en cache des fichiers de base
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Nettoyage des anciens caches lors de la mise à jour
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Stratégie de Cache : Charger depuis le cache d'abord pour économiser la 3G
self.addEventListener('fetch', (event) => {
  // Ne pas mettre en cache les requêtes de base de données (Supabase) ou Cloudinary
  if (event.request.url.includes('supabase.co') || event.request.url.includes('cloudinary.com')) {
    return event.respondWith(fetch(event.request));
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
