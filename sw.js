/* V76: update-aware cache strategy for GitHub Pages */
const CACHE_PREFIX = "mhwilds-crown-pwa-";
const CACHE_VERSION = "v77";
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;

self.addEventListener("install", event => {
  // Activate the new worker promptly; the page reloads naturally on its next visit.
  event.waitUntil((async () => {
    await self.skipWaiting();
    const base = self.registration.scope;
    const cache = await caches.open(CACHE_NAME);
    try {
      await cache.add(new Request(new URL("./", base), {cache: "reload"}));
    } catch (_) {
      // Do not block installation if the hosting provider temporarily fails.
    }
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;

  // HTML/navigation: prefer the latest deployed version; use cache only when offline.
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request, {cache: "no-store"});
        if (response && response.ok) cache.put(request, response.clone());
        return response;
      } catch (_) {
        return (await cache.match(request)) || (await cache.match(new URL("./", scope))) || Response.error();
      }
    })());
    return;
  }

  // Images and other same-origin assets: network-first so replaced files appear
  // without requiring the user to clear site data; cached copy remains for offline use.
  if (request.destination === "image" || /\.(?:webp|png|jpe?g|svg|gif|css|js|json|woff2?)$/i.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request, {cache: "no-store"});
        if (response && response.ok) await cache.put(request, response.clone());
        return response;
      } catch (_) {
        return (await cache.match(request)) || Response.error();
      }
    })());
  }
});
