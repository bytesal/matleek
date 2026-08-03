const CACHE_NAME = 'matleek-cache-v2';

// 1. التثبيت والتفعيل المباشر بدون انتظار
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            // حذف أي ملفات قديمة مخزنة
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // استلام التحكم بالصفحة فوراً
  );
});

// 2. استراتيجية Network-First: جلب أحدث نسخة من الشبكة دائماً
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
