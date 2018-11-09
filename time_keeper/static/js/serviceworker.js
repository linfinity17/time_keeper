var staticCacheName = 'time_record-v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        'static/js/idbop.js',
        'static/js/test.js',
        'static/js/serviceworker.js',
        'static/css/stylev2.css',
        'static/fonts/Dosis-Light.ttf',
        'static/fonts/Roboto-Regular.ttf',
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
              '/timer',
              '/getdata',
            ]);
          })
        );
      return;
}
  if (requestUrl.pathname === '/logout') {
        console.log("im here");
        caches.delete(staticCacheName);
        var req = indexedDB.deleteDatabase('time-db');
        req.onsuccess = function () {
            console.log("Deleted database successfully");
        };
        req.onerror = function () {
            console.log("Couldn't delete database");
        };
        req.onblocked = function () {
            console.log("Couldn't delete database due to the operation being blocked");
        };
      return;
}

      if ((requestUrl.pathname === '/') && !navigator.onLine) {
        event.respondWith(caches.match('/timer'));
        return;
      }

      if ((requestUrl.pathname === '/timer') && !navigator.onLine) {
          event.respondWith(caches.match('/timer'));
        return;
      }


    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
});