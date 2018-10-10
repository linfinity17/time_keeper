var staticCacheName = 'time_record-v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        'static/js/idbop.js',
        'static/js/test.js',
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);
  console.log(requestUrl.pathname);
  if (requestUrl.pathname === '/logged_in') {
        event.waitUntil(
          caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
              '/base_layout',
            ]);
          })
        );
      return;
}
  if (requestUrl.pathname === '/logout') {
        console.log("im here");
        caches.delete(staticCacheName);
      return;
}
    if (requestUrl.origin === location.origin) {
      if ((requestUrl.pathname === '/') && !navigator.onLine) {
          console.log("now im here");
        event.respondWith(caches.match('/base_layout'));
        return;
      }
    }
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
});