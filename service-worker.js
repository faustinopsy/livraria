const CACHE_NAME = 'readowl-cache-v1';
const urlsToCache = [
    '/',
    '/js/app.js',
    '/js/router.js',
    '/js/paginas/shop.js',
    '/js/paginas/login.js',
    '/js/paginas/livros.js',
    '/js/paginas/register.js',
    '/js/componentes/books.js',
    '/js/componentes/navbar.js',
    '/js/componentes/sidebar.js',
    '/css/styles.css',
    '/img/livro1.png',
    '/img/livro2.png',
    '/img/livro3.png',
    '/img/livro4.png',
    '/img/livro5.png',
    '/img/livro6.png',
    '/img/eu.jpg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(
                    response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    }
                );
            })
    );
});
