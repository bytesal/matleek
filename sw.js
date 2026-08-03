// Service Worker المحدث لتفادي مشكلة تعليق الكاش على الـ WebView

self.addEventListener('install', (event) => {
  // التفعيل الفوري وعدم الانتظار
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // تنظيف ومسح كل الكاش القديم فوراً عند التفعيل
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          return caches.delete(cache);
        })
      );
    }).then(() => {
      // إجبار المتصفح على استلام السيطرة المباشرة
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // الطلب المباشر من الشبكة والسيرفر (GitHub) لتسليم النسخة الأحدث دائماً
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
