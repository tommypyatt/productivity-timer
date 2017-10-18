(function () {
    'use strict';

    self.addEventListener('install', function(event) {
        event.waitUntil(
            caches.open('v1').then(function(cache) {
                return cache.addAll([]);
            })
        );
    });

    self.addEventListener('push', function (e) {
        e.waitUntil(
            self.registration.showNotification('Hello world!')
        );
    });
})();
