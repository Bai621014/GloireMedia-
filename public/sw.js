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
    }).then(() => self.skipWaiting())
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
    }).then(() => self.clients.claim())
  );
});

// 3. Stratégie de Cache Intelligente : Économie de données + Mode Hors-ligne Sécurisé
self.addEventListener('fetch', (event) => {
  // Sécurité : Ne pas interférer avec les requêtes de base de données (Supabase) ou de médias (Cloudinary)
  if (event.request.url.includes('supabase.co') || event.request.url.includes('cloudinary.com')) {
    return;
  }

  // Uniquement pour les requêtes de type GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      
      // On lance la récupération réseau en parallèle
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
        }
        return networkResponse;
      }).catch((err) => {
        console.log("Réseau indisponible pour cette ressource :", event.request.url);
        // Permet de ne pas faire crasher l'app si le fichier est déjà dans le cache
      });

      // CORRECTION CRITIQUE : Si pas en cache ET réseau en panne, on évite le crash undefined
      return cachedResponse || fetchPromise || Response.error();
    })
  );
});
