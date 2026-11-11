/* ==========================================================================
   ALEJANDRA SPACE - Service Worker Oficial PWA (sw.js)
   Soporta GitHub Pages en subrutas, caché offline y actualización automática
   ========================================================================== */

const CACHE_VERSION = 'alejandra-space-laptop-pwa-v1';

const PRECACHE_PATHS = [
  './',
  './index.html',
  './manifest.json',
  './pages/perfil.html',
  './pages/categorias.html',
  './pages/horario.html',
  './pages/favoritos.html',
  './pages/contacto.html',
  './css/dark-mode.css',
  './css/light-mode.css',
  './css/animations.css',
  './css/style.css',
  './css/responsive.css',
  './assets/vendor/jquery.min.js',
  './js/theme.js',
  './js/categories.js',
  './js/filters.js',
  './js/validation.js',
  './js/jquery-functions.js',
  './js/main.js',
  './js/hydration.js',
  './images/icons/icon-192.png',
  './images/icons/icon-512.png',
  './images/icons/icon-maskable-512.png',
  './images/icons/apple-touch-icon.png',
  './images/profile/profile.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      Promise.all(
        PRECACHE_PATHS.map((relPath) => {
          const assetUrl = new URL(relPath, self.location.href).href;
          return cache.add(assetUrl).catch(() => null);
        })
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((oldKey) => caches.delete(oldKey))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navegación HTML: Network-First con respaldo offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkRes) => {
          if (networkRes && networkRes.ok) {
            const copy = networkRes.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return networkRes;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) => cached || caches.match(new URL('./index.html', self.location.href).href)
          )
        )
    );
    return;
  }

  // Recursos estáticos: Stale-While-Revalidate (respuesta rápida + actualización en segundo plano)
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((networkRes) => {
          if (networkRes && networkRes.ok) {
            const copy = networkRes.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return networkRes;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
