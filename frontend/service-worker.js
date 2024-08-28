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
    // Limpeza de caches antigos, se necessário
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// self.addEventListener('fetch', event => {
//     console.log('Fetch event for ', event.request.url);
//     event.respondWith(
//         caches.match(event.request)
//             .then(response => {
//                 console.log('Cache response for ', event.request.url, response);
//                 const fetchPromise = fetch(event.request).then(networkResponse => {
//                     console.log('Network response for ', event.request.url, networkResponse);
//                     if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
//                         const responseToCache = networkResponse.clone();
//                         caches.open(CACHE_NAME).then(cache => {
//                             cache.put(event.request, responseToCache);
//                         });
//                     }
//                     return networkResponse;
//                 });

//                 return response || fetchPromise;
//             })
//     );
// });
self.addEventListener('fetch', event => {
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    console.log('Cache response for ', event.request.url);
                    fetchAndUpdateCache(event.request);
                    return cachedResponse;
                }
                return fetchAndUpdateCache(event.request);
            }).catch(() => {
                return caches.match('offline.html');
            })
        );
    } else {
        event.respondWith(fetch(event.request));
    }
});

async function fetchAndUpdateCache(request) {
    return fetch(request).then(networkResponse => {
        if (networkResponse && networkResponse.ok) {
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(request, networkResponse.clone());
                console.log('Network response for ', request.url);
                return networkResponse;
            });
        }
    }).catch(error => {
        console.error('Network request failed for ', request.url, error);
        throw error;
    });
}

