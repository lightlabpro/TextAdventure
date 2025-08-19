/**
 * Service Worker for offline functionality
 */

const CACHE_NAME = 'space-lifeline-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/gameEngine.js',
    '/story.js',
    '/characters.js',
    '/game.js',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});
```

```

