// Service Worker for SokaPulse PWA
const CACHE_NAME = 'sokapulse-cache-v1';
const urlsToCache = [
  '/',
  '/pwa-init.js',
  '/pwa.js',
  '/pwa-meta.html',
  '/pwa-styles.css',
  '/assets/images/manifest.json', 
  // Primary manifest file for PWA
  '/assets/images/favicon.ico',
  '/assets/images/android-icon-36x36.png',
  '/assets/images/android-icon-48x48.png',
  '/assets/images/android-icon-72x72.png',
  '/assets/images/android-icon-96x96.png',
  '/assets/images/android-icon-144x144.png',
  '/assets/images/android-icon-192x192.png',
  '/assets/images/android-icon-512x512.png',
  // Static assets that are always available
  '/globe.svg',
  '/next.svg',
  '/vercel.svg',
  '/window.svg',
  '/file.svg',
  '/sokapulse.webp',
  '/sokapulse-dark.webp'
  // Be careful not to include too many or non-existent files
];

// External domains that should be allowed but not cached
const externalAllowedDomains = [
  'api-sports.io',
  'media.api-sports.io',
  'media-2.api-sports.io',
  'media-3.api-sports.io',
  'betwinner360.com',
  'pngimg.com',
  'upload.wikimedia.org',
  'cdn.britannica.com',
  'seekflag.com',
  'www.wikipedia.org',
  'en.wikipedia.org',
  'cdn.onesignal.com'
];

// For handling all image URLs regardless of domain
const isImageRequest = (url) => {
  return url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) !== null;
};

// Install event - cache important files
self.addEventListener('install', (event) => {
  // Skip waiting forces the waiting service worker to become the active service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Cache files individually to prevent total failure
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              console.warn(`Failed to cache: ${url}`, err);
              // Continue despite individual file caching errors
              return Promise.resolve();
            })
          )
        );
      })
      .catch((error) => {
        console.error('Error during service worker installation:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  // Claim control immediately
  event.waitUntil(clients.claim());
  
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Check if a URL is from an allowed external domain
function isAllowedExternalDomain(url) {
  return externalAllowedDomains.some(domain => url.includes(domain));
}

// Fetch event - serve from cache if available, then network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Special handling for image requests from any domain
  if (isImageRequest(event.request.url)) {
    event.respondWith(
      fetch(event.request, { mode: 'no-cors' })
        .catch(error => {
          console.log('Image fetch failed:', error);
          return caches.match('/assets/images/logo.png');
        })
    );
    return;
  }
  
  // Handle specific external domains
  if (isAllowedExternalDomain(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .catch(error => {
          console.log('External fetch failed:', error);
          
          // For other resources, let the request fail gracefully
          return new Response('', {
            status: 408,
            statusText: 'External resource unavailable'
          });
        })
    );
    return;
  }
  
  // Default handling for same-origin requests
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        // Fetch from network
        return fetch(fetchRequest)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Add to cache for future use
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Only cache same-origin GET requests
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              });
              
            return response;
          })
          .catch((error) => {
            // If both cache and network fail, show offline fallback
            console.log('Fetch failed; returning offline fallback', error);
            
            // If it's an HTML request, show offline page
            if (event.request.headers.get('Accept') && 
                event.request.headers.get('Accept').includes('text/html')) {
              return caches.match('/');
            }
            
            // For image requests, you could return a default offline image
            if (isImageRequest(event.request.url)) {
              return caches.match('/assets/images/logo.png');
            }
            
            // Return a proper response for other resources
            return new Response('', {
              status: 408,
              statusText: 'Resource unavailable offline'
            });
          });
      })
  );
});

// Handle push notifications if you add this feature in the future
self.addEventListener('push', (event) => {
  if (event && event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New update from SokaPulse',
      icon: '/assets/images/android-icon-192x192.png',
      badge: '/assets/images/android-icon-96x96.png'
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'SokaPulse', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
}); 