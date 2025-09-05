// Simple Service Worker for ESCOM Citizen Scientist App
const CACHE_NAME = 'escom-citizen-scientist-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index-Cfv9MAob.js',
  '/assets/index-C2q5d6Xa.css',
  '/assets/vite-DcBtz0py.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Skip caching for JavaScript and CSS files to avoid stale content
  if (event.request.url.includes('/assets/') && 
      (event.request.url.endsWith('.js') || event.request.url.endsWith('.css'))) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
