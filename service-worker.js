/**
 * Service Worker for offline support
 * Кеширане на статични ресурси и API отговори
 */

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `myapp-static-${CACHE_VERSION}`;
const API_CACHE = `myapp-api-${CACHE_VERSION}`;
const IMAGE_CACHE = `myapp-images-${CACHE_VERSION}`;

// Ресурси за кеширане при инсталиране
const STATIC_ASSETS = [
    '/',
    '/app.js',
    '/index.html',
    '/bootstrap.js',
    '/bootstrap.css',
    '/resources/css/app.css'
];

// Инсталиране на Service Worker
self.addEventListener('install', event => {
    console.log('[ServiceWorker] Инсталиране...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache => {
            console.log('[ServiceWorker] Кеширане на статични активи');
            return cache.addAll(STATIC_ASSETS).catch(err => {
                console.log('[ServiceWorker] Някои активи не могат да бъдат кеширани:', err);
                // Не прекъсваме инсталацията ако някой актив липсва
                return Promise.resolve();
            });
        })
    );
    self.skipWaiting();
});

// Активиране на Service Worker
self.addEventListener('activate', event => {
    console.log('[ServiceWorker] Активиране...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => {
                        return (cacheName.startsWith('myapp-') && 
                                cacheName !== STATIC_CACHE && 
                                cacheName !== API_CACHE &&
                                cacheName !== IMAGE_CACHE);
                    })
                    .map(cacheName => {
                        console.log('[ServiceWorker] Триене на старо кеше:', cacheName);
                        return caches.delete(cacheName);
                    })
            );
        })
    );
    self.clients.claim();
});

// Хватане на мрежови заявки
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Пропускане на non-GET заявки
    if (request.method !== 'GET') {
        return;
    }

    // API заявки
    if (url.hostname === 'vasil.iag.bg') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Кеширане на успешни API отговори
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(API_CACHE).then(cache => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                })
                .catch((error) => {
                    console.error('[ServiceWorker] API Fetch failed:', error);
                    // Връщане на кеширан отговор при оффлайн
                    return caches.match(request).then(cachedResponse => {
                        if (cachedResponse) {
                            console.log('[ServiceWorker] Връщане от кеше:', request.url);
                            return cachedResponse;
                        }
                        // Ако нищо в кеше, върни пустой отговор
                        return new Response(
                            JSON.stringify({ items: [], cached: true, offline: true }),
                            { headers: { 'Content-Type': 'application/json' } }
                        );
                    });
                })
        );
        return;
    }

    // Изображения
    if (request.destination === 'image') {
        event.respondWith(
            caches.open(IMAGE_CACHE).then(cache => {
                return cache.match(request).then(response => {
                    return (
                        response ||
                        fetch(request)
                            .then(response => {
                                if (!response || response.status !== 200 || response.type !== 'basic') {
                                    return response;
                                }
                                const responseClone = response.clone();
                                cache.put(request, responseClone);
                                return response;
                            })
                            .catch(() => {
                                // Връщане на placeholder при грешка
                                return new Response(
                                    '<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140"><rect fill="#ccc" width="140" height="140"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">No image</text></svg>',
                                    { headers: { 'Content-Type': 'image/svg+xml' } }
                                );
                            })
                    );
                });
            })
        );
        return;
    }

    // Статични активи (network first, fallback to cache)
    event.respondWith(
        fetch(request)
            .then(response => {
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(STATIC_CACHE).then(cache => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(request).then(cachedResponse => {
                    return cachedResponse || new Response('Offline', { status: 503 });
                });
            })
    );
});
