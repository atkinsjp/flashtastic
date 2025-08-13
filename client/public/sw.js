const CACHE_NAME = 'flashtastic-v1';
const STATIC_CACHE_NAME = 'flashtastic-static-v1';
const API_CACHE_NAME = 'flashtastic-api-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/study',
  '/quiz', 
  '/progress',
  '/profile',
  '/manifest.json'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/flashcards',
  '/api/users',
  '/api/achievements'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_FILES);
      }),
      caches.open(API_CACHE_NAME)
    ]).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== API_CACHE_NAME &&
              cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return fetch(request).then((response) => {
          // Cache successful GET requests
          if (response.status === 200 && request.method === 'GET') {
            cache.put(request, response.clone());
          }
          return response;
        }).catch(() => {
          // Return cached version if network fails
          return cache.match(request);
        });
      })
    );
    return;
  }

  // Handle static files
  if (request.destination === 'document' || 
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'image') {
    
    event.respondWith(
      caches.match(request).then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Fetch from network and cache
        return fetch(request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(STATIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        });
      })
    );
    return;
  }

  // Default - try network first, fallback to cache
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New achievement unlocked!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Achievement',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close notification',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('FlashKademy', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app and navigate to achievements
    event.waitUntil(
      clients.openWindow('/profile?tab=achievements')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sync offline data when back online
async function syncOfflineData() {
  try {
    // Get offline study sessions
    const cache = await caches.open(API_CACHE_NAME);
    const offlineData = await cache.match('/offline-sessions');
    
    if (offlineData) {
      const sessions = await offlineData.json();
      
      // Send each session to the server
      for (const session of sessions) {
        try {
          await fetch('/api/study-sessions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(session)
          });
        } catch (error) {
          console.error('Failed to sync session:', error);
        }
      }
      
      // Clear offline sessions after successful sync
      await cache.delete('/offline-sessions');
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'content-sync') {
      event.waitUntil(syncContent());
    }
  });
}

async function syncContent() {
  try {
    // Fetch latest flash cards and cache them
    const response = await fetch('/api/flashcards');
    if (response.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      await cache.put('/api/flashcards', response.clone());
    }
  } catch (error) {
    console.error('Content sync failed:', error);
  }
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_FLASHCARDS') {
    const { grade, subject, cards } = event.data.payload;
    cacheFlashCards(grade, subject, cards);
  }
});

// Cache specific flash cards
async function cacheFlashCards(grade, subject, cards) {
  try {
    const cache = await caches.open(API_CACHE_NAME);
    const url = `/api/flashcards?grade=${grade}&subject=${subject}`;
    const response = new Response(JSON.stringify(cards), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put(url, response);
  } catch (error) {
    console.error('Failed to cache flash cards:', error);
  }
}
