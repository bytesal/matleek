// Service Worker لتنظيف الكاش وإعادة التوجيه للموقع المباشر

self.addEventListener('install', (event) => {
  // التفعيل الفوري للـ Service Worker الجديد دون الانتظار
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // حصر ومسح جميع النسخ المخزنة سابقاً في الكاش
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          console.log('حذف الكاش القديم:', cache);
          return caches.delete(cache);
        })
      );
    }).then(() => {
      // إجبار المتصفح/الـ WebView على استلام السيطرة فوراً
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // جلب البيانات دائماً بشكل مباشر من السيرفر (GitHub) وتجاوز الـ Cache
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
