            var CACHE = 'humhub-sw-cache';
            var OFFLINE_PAGE_URL = '/offline.pwa.html';
        
            self.addEventListener('install', function (event) {
                console.log('********** The service worker is being installed.');
    
                // Store "Offline" page
                var offlineRequest = new Request(OFFLINE_PAGE_URL);
                event.waitUntil(
                    fetch(offlineRequest).then(function (response) {
                        return caches.open('offline').then(function (cache) {
                                console.log('[oninstall] Cached offline page', response.url);
                                return cache.put(offlineRequest, response);
                            });
                    })
                );
            });
            self.addEventListener('fetch', function (event) {
                var request = event.request;
                
                // Check is "page" request
                if (request.method === 'GET' && request.destination === 'document') {
                    event.respondWith(
                        fetch(request).catch(function (error) {
                        console.error('[onfetch] Failed. Serving cached offline fallback ' + error);
                        return caches.open('offline').then(function (cache) {
                                return cache.match(OFFLINE_PAGE_URL);
                            });
                        })
                    );
                }
            });