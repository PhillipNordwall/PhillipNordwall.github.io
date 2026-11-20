const cacheName = 'shared-deep-research-v4';
const home = new URL('./', self.registration.scope);
const index = new URL('index.html', home);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.add(index.href)));
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.mode !== 'navigate' || url.origin !== home.origin) return;
  if (url.pathname !== home.pathname && url.pathname !== index.pathname) return;

  event.respondWith(fetch(event.request).catch(async () => {
    const cache = await caches.open(cacheName);
    return (await cache.match(index.href)) || Response.error();
  }));
});
