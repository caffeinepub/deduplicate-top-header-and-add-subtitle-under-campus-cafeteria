const CACHE_NAME = 'cafeteria-v2';
const RUNTIME_CACHE = 'cafeteria-runtime-v2';
const IMAGE_CACHE = 'cafeteria-images-v2';

// Assets to cache on install - expanded list for immediate offline access
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/generated/pwa-icon-192-v2.dim_192x192.png',
  '/assets/generated/pwa-icon-512-v2.dim_512x512.png',
  '/assets/generated/pwa-maskable-icon-v2.dim_192x192.png',
  '/assets/generated/app-logo.dim_256x256.png',
  '/assets/generated/samosa.dim_400x400.jpg',
  '/assets/generated/vada-pav.dim_400x400.jpg',
  '/assets/generated/idli.dim_400x400.jpg',
  '/assets/generated/dosa.dim_400x400.jpg',
  '/assets/generated/upma.dim_400x400.jpg',
  '/assets/generated/poha.dim_400x400.jpg',
  '/assets/generated/veg-thali.dim_400x400.jpg',
  '/assets/generated/sandwich.dim_400x400.jpg',
  '/assets/generated/pav-bhaji.dim_400x400.jpg',
  '/assets/generated/fried-rice.dim_400x400.jpg',
  '/assets/generated/noodles.dim_400x400.jpg',
  '/assets/generated/tea.dim_400x400.jpg',
  '/assets/generated/coffee.dim_400x400.jpg',
  '/assets/generated/cold-drinks.dim_400x400.jpg',
];

// Install event - cache essential assets immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((error) => {
        console.error('Failed to cache assets:', error);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE && cacheName !== IMAGE_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache first for instant loading
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle API calls - Network first, fallback to cache
  if (url.pathname.includes('/api/') || url.pathname.includes('?canisterId=')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response(
              JSON.stringify({ error: 'Offline - data not available' }),
              {
                headers: { 'Content-Type': 'application/json' },
                status: 503,
              }
            );
          });
        })
    );
    return;
  }

  // Handle images and assets - Cache first for instant loading
  if (request.destination === 'image' || url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(IMAGE_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Handle navigation requests - Cache first for instant loading
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version immediately, update in background
          fetch(request).then((response) => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
          }).catch(() => {});
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        }).catch(() => {
          return caches.match('/index.html');
        });
      })
    );
    return;
  }

  // Default: Cache first for instant loading
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });
        return response;
      });
    })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});
