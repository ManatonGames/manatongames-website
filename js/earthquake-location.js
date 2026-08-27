// ============================================================
// MANATON EARTHQUAKE ALERT (MEA)
// LOCATION ENGINE
// ============================================================
//
// Version: 0.1.0
// Status: FOUNDATION
//
// Este módulo controla la ubicación del usuario para MEA.
//
// IMPORTANTE:
// - No envía coordenadas a un servidor.
// - Utiliza únicamente la API de geolocalización del navegador.
// - La ubicación se mantiene en memoria dentro de la sesión.
// - El usuario debe conceder permiso al navegador.
//
// ============================================================

"use strict";


// ============================================================
// CONFIGURATION
// ============================================================

const MEA_LOCATION_CONFIG = {

    // Máximo tiempo que esperamos por una posición.
    timeout: 15000,

    // Permitir una posición previamente almacenada por el navegador.
    maximumAge: 60000,

    // Intentar obtener la máxima precisión disponible.
    enableHighAccuracy: true,

    debug: true

};


// ============================================================
// LOGGER
// ============================================================

function meaLocationLog(...messages) {

    if (!MEA_LOCATION_CONFIG.debug) {

        return;

    }

    console.log(
        "[MEA LOCATION]",
        ...messages
    );

}


// ============================================================
// ERROR LOGGER
// ============================================================

function meaLocationError(...messages) {

    console.error(
        "[MEA LOCATION ERROR]",
        ...messages
    );

}


// ============================================================
// CHECK GEOLOCATION SUPPORT
// ============================================================

function isMEAGeolocationSupported() {

    return (
        "geolocation" in navigator
    );

}


// ============================================================
// GET LOCATION
// ============================================================

function requestMEALocation() {

    return new Promise(
        (resolve, reject) => {

            // ------------------------------------------------
            // CHECK SUPPORT
            // ------------------------------------------------

            if (
                !isMEAGeolocationSupported()
            ) {

                const error =
                    new Error(
                        "Este navegador no soporta geolocalización."
                    );

                meaLocationError(
                    error.message
                );

                reject(error);

                return;

            }


            meaLocationLog(
                "Solicitando ubicación del usuario..."
            );


            // ------------------------------------------------
            // REQUEST POSITION
            // ------------------------------------------------

            navigator.geolocation.getCurrentPosition(

                position => {

                    const latitude =
                        position.coords.latitude;

                    const longitude =
                        position.coords.longitude;

                    const accuracy =
                        position.coords.accuracy;


                    meaLocationLog(
                        "Ubicación obtenida:",
                        {
                            latitude,
                            longitude,
                            accuracy
                        }
                    );


                    // ----------------------------------------
                    // SAVE LOCATION TO MEA
                    // ----------------------------------------

                    if (
                        typeof window.MEA !==
                        "undefined" &&
                        typeof window.MEA.setLocation ===
                        "function"
                    ) {

                        window.MEA.setLocation(
                            latitude,
                            longitude,
                            accuracy
                        );

                    }


                    // ----------------------------------------
                    // EVENT
                    // ----------------------------------------

                    window.dispatchEvent(

                        new CustomEvent(
                            "mea:location-acquired",
                            {
                                detail: {

                                    latitude,

                                    longitude,

                                    accuracy,

                                    timestamp:
                                        new Date()
                                            .toISOString()

                                }
                            }
                        )

                    );


                    resolve({

                        latitude,

                        longitude,

                        accuracy,

                        timestamp:
                            new Date()
                                .toISOString()

                    });

                },

                error => {

                    handleMEALocationError(
                        error
                    );

                    reject(error);

                },

                {

                    enableHighAccuracy:
                        MEA_LOCATION_CONFIG
                            .enableHighAccuracy,

                    timeout:
                        MEA_LOCATION_CONFIG
                            .timeout,

                    maximumAge:
                        MEA_LOCATION_CONFIG
                            .maximumAge

                }

            );

        }
    );

}


// ============================================================
// HANDLE LOCATION ERROR
// ============================================================

function handleMEALocationError(
    error
) {

    let message =
        "No fue posible obtener la ubicación.";


    switch (
        error.code
    ) {

        case 1:

            message =
                "El usuario no concedió permiso de ubicación.";

            break;


        case 2:

            message =
                "La ubicación no está disponible.";

            break;


        case 3:

            message =
                "La solicitud de ubicación agotó el tiempo de espera.";

            break;

    }


    meaLocationError(
        message
    );


    // --------------------------------------------------------
    // DISPATCH ERROR EVENT
    // --------------------------------------------------------

    window.dispatchEvent(

        new CustomEvent(
            "mea:location-error",
            {
                detail: {

                    code:
                        error.code,

                    message

                }
            }
        )

    );

}


// ============================================================
// GET CURRENT MEA LOCATION
// ============================================================

function getMEALocation() {

    if (
        typeof window.MEA ===
        "undefined"
    ) {

        return null;

    }


    if (
        typeof window.MEA.getState !==
        "function"
    ) {

        return null;

    }


    const state =
        window.MEA.getState();


    if (
        !state.location ||
        !state.location.available
    ) {

        return null;

    }


    return {

        latitude:
            state.location.latitude,

        longitude:
            state.location.longitude,

        accuracy:
            state.location.accuracy

    };

}


// ============================================================
// CLEAR MEA LOCATION
// ============================================================

function clearMEALocationData() {

    if (
        typeof window.MEA !==
        "undefined" &&
        typeof window.MEA.clearLocation ===
        "function"
    ) {

        window.MEA.clearLocation();

    }


    meaLocationLog(
        "Ubicación eliminada de MEA."
    );


    window.dispatchEvent(

        new CustomEvent(
            "mea:location-cleared"
        )

    );

}


// ============================================================
// HAVERSINE DISTANCE
// ============================================================
//
// Calcula la distancia aproximada entre dos coordenadas
// utilizando la fórmula de Haversine.
//
// Resultado: kilómetros.
//
// ============================================================

function calculateMEADistance(
    latitude1,
    longitude1,
    latitude2,
    longitude2
) {

    const lat1 =
        Number(latitude1);

    const lon1 =
        Number(longitude1);

    const lat2 =
        Number(latitude2);

    const lon2 =
        Number(longitude2);


    if (
        !Number.isFinite(lat1) ||
        !Number.isFinite(lon1) ||
        !Number.isFinite(lat2) ||
        !Number.isFinite(lon2)
    ) {

        return null;

    }


    const earthRadiusKm =
        6371;


    const degreesToRadians =
        Math.PI / 180;


    const deltaLatitude =
        (lat2 - lat1) *
        degreesToRadians;


    const deltaLongitude =
        (lon2 - lon1) *
        degreesToRadians;


    const a =

        Math.sin(
            deltaLatitude / 2
        ) ** 2

        +

        Math.cos(
            lat1 *
            degreesToRadians
        )

        *

        Math.cos(
            lat2 *
            degreesToRadians
        )

        *

        Math.sin(
            deltaLongitude / 2
        ) ** 2;


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return (
        earthRadiusKm *
        c
    );

}


// ============================================================
// DISTANCE FROM USER TO EARTHQUAKE
// ============================================================

function calculateMEAUserEarthquakeDistance(
    earthquake
) {

    const location =
        getMEALocation();


    if (!location) {

        return null;

    }


    if (
        !earthquake
    ) {

        return null;

    }


    return calculateMEADistance(

        location.latitude,

        location.longitude,

        earthquake.latitude,

        earthquake.longitude

    );

}


// ============================================================
// FORMAT DISTANCE
// ============================================================

function formatMEADistance(
    distanceKm
) {

    if (
        !Number.isFinite(distanceKm)
    ) {

        return "Distancia desconocida";

    }


    if (
        distanceKm < 1
    ) {

        return (
            `${Math.round(
                distanceKm * 1000
            )} m`
        );

    }


    if (
        distanceKm < 100
    ) {

        return (
            `${distanceKm.toFixed(1)} km`
        );

    }


    return (
        `${Math.round(
            distanceKm
        )} km`
    );

}


// ============================================================
// GET LOCATION STATUS
// ============================================================

function getMEALocationStatus() {

    const location =
        getMEALocation();


    if (!location) {

        return {

            available: false,

            supported:
                isMEAGeolocationSupported()

        };

    }


    return {

        available: true,

        supported: true,

        latitude:
            location.latitude,

        longitude:
            location.longitude,

        accuracy:
            location.accuracy

    };

}


// ============================================================
// PUBLIC LOCATION API
// ============================================================

window.MEALocation = {

    supported:
        isMEAGeolocationSupported,

    request:
        requestMEALocation,

    get:
        getMEALocation,

    clear:
        clearMEALocationData,

    distance:
        calculateMEADistance,

    distanceFromUser:
        calculateMEAUserEarthquakeDistance,

    formatDistance:
        formatMEADistance,

    status:
        getMEALocationStatus

};


// ============================================================
// INITIAL LOG
// ============================================================

meaLocationLog(
    "MEA Location Engine cargado."
);
