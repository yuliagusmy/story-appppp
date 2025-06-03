// Minimal Service Worker for Story App
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clients.claim();
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

// Optional: Cache basic assets (can be expanded as needed)
self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});