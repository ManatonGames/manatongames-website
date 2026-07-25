const CACHE_NAME = "manaton-games-v1";

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

// Obtener archivos
self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

            .then(response => {

                return response || fetch(event.request);

            })

    );

});
