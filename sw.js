const APP_VERSION = "1.0.1";
const CACHE_NAME = `manaton-games-${APP_VERSION}`;

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/manifest.json",

    "/css/style.css",
    "/css/responsive.css",

    "/js/script.js",

    "/assets/logo/logo.png",
    "/assets/logo/favicon.png",
    "/assets/logo/icon-192.png",
    "/assets/logo/icon-512.png",
    "/assets/logo/apple-touch-icon.png",

    "/assets/games/pd3.png",
    "/assets/games/pd2.png",
    "/assets/games/growagarden.png",
    "/assets/games/rsc.png",
    "/assets/games/speedescape.png"
];

// Instalar
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );

    self.skipWaiting();
});

// Activar
self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys =>

            Promise.all(

                keys.map(key => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            )

        )

    );

    self.clients.claim();

});

// Obtener archivos (Network First)
self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        fetch(event.request)
            .then(response => {

                const responseClone = response.clone();

                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });

                return response;

            })
            .catch(() => {

                return caches.match(event.request);

            })

    );

});
