const CACHE_NAME = "scout-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/style.css",
    "/icons/icon.jpg",
    // أضف باقي ملفات الصور والـ JS المهمة
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
});
