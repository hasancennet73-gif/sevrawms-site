// SEVRA PWA Service Worker
const SEVRA_CACHE = "sevra-pwa-v1";

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/yuk-ilanlari.html",
  "/ilan-teklif.html",
  "/ilan-detay.html",
  "/manifest.webmanifest",
  "/sevra-icon-192.png",
  "/sevra-icon-512.png",
  "/kurumsal-ui.css",
  "/yuk-ilanlari.css"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(SEVRA_CACHE).then(cache => cache.addAll(CORE_ASSETS).catch(() => Promise.resolve()))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== SEVRA_CACHE).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  if (req.headers.get("accept") && req.headers.get("accept").includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(SEVRA_CACHE).then(cache => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then(cached => cached || caches.match("/index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      return cached || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(SEVRA_CACHE).then(cache => cache.put(req, copy));
        return res;
      }).catch(() => cached);
    })
  );
});
