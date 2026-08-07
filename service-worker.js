/*!
 * service-worker.js — فوج القدس - سيدي داود
 * استراتيجيات تخزين مؤقت متعددة حسب نوع المورد + دعم العمل دون اتصال
 */
"use strict";

const VERSION = "v1.0.0";
const SCOPE = "/scout-elkouds/";
const CACHE_STATIC = "fk-static-" + VERSION;
const CACHE_PAGES = "fk-pages-" + VERSION;
const CACHE_IMAGES = "fk-images-" + VERSION;
const CACHE_DATA = "fk-data-" + VERSION;
const OFFLINE_URL = SCOPE + "offline.html";

// أهم الملفات التي تُخزَّن مسبقاً عند التثبيت (App Shell)
const PRECACHE_URLS = [
  SCOPE,
  SCOPE + "index.html",
  SCOPE + "about.html",
  SCOPE + "organization.html",
  SCOPE + "activities/index.html",
  SCOPE + "news/index.html",
  SCOPE + "gallery.html",
  SCOPE + "contact.html",
  SCOPE + "join.html",
  SCOPE + "404.html",
  OFFLINE_URL,
  SCOPE + "manifest.webmanifest",
  SCOPE + "assets/css/main.css",
  SCOPE + "assets/css/animations.css",
  SCOPE + "assets/css/responsive.css",
  SCOPE + "assets/css/modern.css",
  SCOPE + "assets/js/app.js",
  SCOPE + "assets/js/navigation.js",
  SCOPE + "assets/js/theme.js",
  SCOPE + "assets/js/modal.js",
  SCOPE + "assets/js/share.js",
  SCOPE + "assets/js/search.js",
  SCOPE + "assets/js/pwa.js",
  SCOPE + "assets/js/analytics.js",
  SCOPE + "assets/js/gallery.js",
  SCOPE + "assets/js/ads.js",
  SCOPE + "assets/icons/icon.jpg",
  SCOPE + "assets/icons/scout-logo.png",
  SCOPE + "assets/data/posts.json",
  SCOPE + "assets/data/gallery.json",
  SCOPE + "assets/data/stages.json",
  SCOPE + "assets/data/faq.json",
];

// ---------------------------------------------------------------- Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

// ---------------------------------------------------------------- Activate
self.addEventListener("activate", (event) => {
  const keep = [CACHE_STATIC, CACHE_PAGES, CACHE_IMAGES, CACHE_DATA];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// استقبال أمر تخطي الانتظار من واجهة تحديث الـ PWA (pwa.js)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

// ---------------------------------------------------------------- Fetch
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // اترك موارد الطرف الثالث (خطوط، إعلانات) للمتصفح

  // 1) صفحات HTML: Network First مع رجوع للتخزين المؤقت ثم صفحة عدم الاتصال
  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) {
    event.respondWith(networkFirst(req, CACHE_PAGES));
    return;
  }

  // 2) بيانات JSON: Stale-While-Revalidate
  if (url.pathname.startsWith(SCOPE + "assets/data/")) {
    event.respondWith(staleWhileRevalidate(req, CACHE_DATA));
    return;
  }

  // 3) الصور: Cache First (المحتوى الأكبر حجماً ونادراً ما يتغير)
  if (req.destination === "image") {
    event.respondWith(cacheFirst(req, CACHE_IMAGES));
    return;
  }

  // 4) CSS/JS: Stale-While-Revalidate
  if (req.destination === "style" || req.destination === "script") {
    event.respondWith(staleWhileRevalidate(req, CACHE_STATIC));
    return;
  }

  // الافتراضي: محاولة الشبكة ثم التخزين المؤقت
  event.respondWith(networkFirst(req, CACHE_STATIC));
});

function networkFirst(request, cacheName) {
  return fetch(request)
    .then((response) => {
      const copy = response.clone();
      caches.open(cacheName).then((cache) => cache.put(request, copy));
      return response;
    })
    .catch(() =>
      caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))
    );
}

function cacheFirst(request, cacheName) {
  return caches.match(request).then((cached) => {
    if (cached) return cached;
    return fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(cacheName).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(SCOPE + "assets/icons/icon.jpg"));
  });
}

function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then((cache) =>
    cache.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
}

// ---------------------------------------------------------------- Background Sync (هيكل جاهز)
// ملاحظة: التزامن الخلفي الفعلي يتطلب خادماً (Backend) لاستقبال الطلبات المؤجلة.
// الكود التالي جاهز للربط مستقبلاً بخادم استمارات (مثال: نموذج اتصال يعمل دون اتصال).
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-contact-form") {
    // event.waitUntil(sendQueuedContactForms());
  }
});

// ---------------------------------------------------------------- Push (هيكل جاهز)
// يتطلب تفعيل هذه الميزة مفتاح VAPID وخادم إشعارات (Push Server) غير متوفر حالياً.
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let data = {};
  try { data = event.data.json(); } catch (e) { data = { title: "فوج القدس", body: event.data.text() }; }
  event.waitUntil(
    self.registration.showNotification(data.title || "فوج القدس - سيدي داود", {
      body: data.body || "",
      icon: SCOPE + "assets/icons/icon.jpg",
      badge: SCOPE + "assets/icons/icon.jpg",
      dir: "rtl",
      lang: "ar",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(SCOPE));
});
