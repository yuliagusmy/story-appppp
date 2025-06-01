const CACHE_NAME = 'story-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/scripts/index.js',
  '/scripts/config.js',
  '/scripts/utils/push-notification.js',
  '/scripts/utils/push-handler.js',
  '/scripts/components/push-notification-toggle.js',
  '/styles/styles.css',
  '/icons/icon-192x192.svg'
];

// Install service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate service worker and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle push notifications
self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/icon-192x192.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Lihat Detail',
        icon: '/icons/icon-192x192.svg'
      },
      {
        action: 'close',
        title: 'Tutup',
        icon: '/icons/icon-192x192.svg'
      },
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Story App', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle fetch requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});