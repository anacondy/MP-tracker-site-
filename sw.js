// Service Worker for MP Tracker PWA
const CACHE_NAME = 'mp-tracker-v1';
const OFFLINE_URL = '/offline.html';

// Allowed external domains for API calls (not cached)
const ALLOWED_API_DOMAINS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'generativelanguage.googleapis.com',
  'api.openai.com'
];

// Assets to cache for offline use
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/legislation.html',
  '/know_your_rep.html',
  '/about.html',
  '/legislation_detail.html',
  '/styles/main.css',
  '/styles/themes.css',
  '/styles/about.css',
  '/styles/pumpkin-animation.css',
  '/scripts/main.js',
  '/scripts/filter.js',
  '/scripts/database.js',
  '/scripts/about.js',
  '/scripts/api-integration.js',
  '/manifest.json'
];

/**
 * Check if a URL is an external API domain that should not be cached
 * @param {string} urlString - The URL to check
 * @returns {boolean} - True if the URL is an allowed external API
 */
function isExternalApiUrl(urlString) {
  try {
    const url = new URL(urlString);
    return ALLOWED_API_DOMAINS.some(domain => url.hostname === domain || url.hostname.endsWith('.' + domain));
  } catch (e) {
    return false;
  }
}

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('[ServiceWorker] Install complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[ServiceWorker] Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      console.log('[ServiceWorker] Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests that aren't from our origin
  if (!event.request.url.startsWith(self.location.origin)) {
    // Allow external API requests to pass through without caching
    if (isExternalApiUrl(event.request.url)) {
      return;
    }
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version while fetching update
          event.waitUntil(
            fetch(event.request)
              .then((response) => {
                if (response && response.status === 200) {
                  const responseClone = response.clone();
                  caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                  });
                }
              })
              .catch(() => { /* Ignore network errors */ })
          );
          return cachedResponse;
        }

        // Not in cache - fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cache the new response
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL) || caches.match('/index.html');
            }
            return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
          });
      })
  );
});

// Background sync for data updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('[ServiceWorker] Background sync triggered');
    event.waitUntil(syncData());
  }
});

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New updates available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'view', title: 'View Updates' },
      { action: 'close', title: 'Close' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('MP Tracker', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-legislation') {
    console.log('[ServiceWorker] Periodic sync: updating legislation data');
    event.waitUntil(syncData());
  }
});

// Helper function to sync data
async function syncData() {
  try {
    // This would be implemented to sync with the backend
    console.log('[ServiceWorker] Syncing data...');
    return Promise.resolve();
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
    return Promise.reject(error);
  }
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('[ServiceWorker] Cache cleared');
    });
  }
});
