// Service Worker for Story App with Offline Capability
const CACHE_NAME = 'story-app-v1';
const STATIC_CACHE_NAME = 'static-v1';
const DYNAMIC_CACHE_NAME = 'dynamic-v1';

// Assets to cache during installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/js/app.js',
  '/js/auth.js',
  '/js/story.js',
  '/js/notification.js',
  '/images/icons/icon-72x72.png',
  '/images/icons/icon-96x96.png',
  '/images/icons/icon-128x128.png',
  '/images/icons/icon-144x144.png',
  '/images/icons/icon-152x152.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-384x384.png',
  '/images/icons/icon-512x512.png',
  '/offline.html'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Listen for push events
self.addEventListener('push', function(event) {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: 'Story App', options: { body: event.data.text() } };
  }
  const title = data.title || 'Story App';
  const options = data.options || { body: '' };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', function(event) {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - Network First strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Static assets & HTML - Cache First + Offline fallback
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
            return response;
          })
          .catch(() => {
            // Fallback offline.html untuk request root (/) atau dokumen HTML
            if (
              request.mode === 'navigate' ||
              (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) ||
              url.pathname === '/'
            ) {
              return caches.match('/offline.html');
            }
            // Untuk asset lain, bisa return undefined atau Response kosong
            return new Response('', { status: 503, statusText: 'Offline' });
          });
      })
  );
});