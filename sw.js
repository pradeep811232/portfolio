const CACHE_NAME = 'portfolio-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/images/profile-placeholder.svg',
  '/images/project-placeholder.svg',
  '/images/profile-photo.jpg',
  '/resume.html',
  '/ecommerce_project.html',
  '/contact.php'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});