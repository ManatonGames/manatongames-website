// ============================================================
// MANATON EARTHQUAKE ALERT (MEA)
// EARTHQUAKE API
// ============================================================
//
// Version: 0.2.0
// Status: LIVE DATA
//
// Fuente:
// U.S. Geological Survey (USGS)
//
// Endpoint:
// /api/earthquakes
//
// ============================================================

"use strict";


// ============================================================
// CONFIGURATION
// ============================================================

const MEA_API_CONFIG = {

    USGS_FEED:
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",

    timeout:
        10000,

    maxEvents:
        100

};


// ============================================================
// FETCH WITH TIMEOUT
// ============================================================

async function fetchWithTimeout(url, timeout) {

    const controller =
        new AbortController();

    const timer =
        setTimeout(
            () => controller.abort(),
            timeout
        );

    try {

        const response =
            await fetch(
                url,
                {
                    method: "GET",

                    headers: {
                        "Accept": "application/json"
                    },

                    signal:
                        controller.signal
                }
            );

        return response;

    }

    finally {

        clearTimeout(timer);

    }

}


// ============================================================
// NORMALIZE USGS EVENT
// ============================================================

function normalizeUSGSEvent(feature) {

    if (
        !feature ||
        typeof feature !== "object"
    ) {

        return null;

    }


    const properties =
        feature.properties || {};

    const geometry =
        feature.geometry || {};

    const coordinates =
        Array.isArray(
            geometry.coordinates
        )
            ? geometry.coordinates
            : [];


    const longitude =
        Number(coordinates[0]);

    const latitude =
        Number(coordinates[1]);

    const depth =
        Number(coordinates[2]);


    if (
        !Number.isFinite(longitude) ||
        !Number.isFinite(latitude)
    ) {

        return null;

    }


    const magnitude =
        Number(properties.mag);


    return {

        id:
            feature.id ||
            `usgs-${properties.code || Date.now()}`,

        magnitude:
            Number.isFinite(magnitude)
                ? magnitude
                : 0,

        latitude,

        longitude,

        depth:
            Number.isFinite(depth)
                ? depth
                : null,

        location:
            properties.place ||
            "Ubicación desconocida",

        timestamp:
            properties.time
                ? new Date(
                    properties.time
                ).toISOString()
                : null,

        updated:
            properties.updated
                ? new Date(
                    properties.updated
                ).toISOString()
                : null,

        source:
            "USGS",

        sourceUrl:
            properties.url ||
            null,

        detailUrl:
            properties.detail ||
            null,

        alert:
            properties.alert ||
            null,

        tsunami:
            Number(properties.tsunami || 0) === 1,

        significance:
            Number(properties.sig || 0),

        magnitudeType:
            properties.magType ||
            null,

        status:
            properties.status ||
            null,

        type:
            properties.type ||
            null

    };

}


// ============================================================
// API HANDLER
// ============================================================

export default async function handler(req, res) {

    // ========================================================
    // CORS
    // ========================================================

    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    // ========================================================
    // OPTIONS
    // ========================================================

    if (req.method === "OPTIONS") {

        return res
            .status(200)
            .end();

    }


    // ========================================================
    // GET ONLY
    // ========================================================

    if (req.method !== "GET") {

        return res
            .status(405)
            .json({

                success: false,

                error:
                    "Method Not Allowed"

            });

    }


    // ========================================================
    // REQUEST USGS
    // ========================================================

    try {

        console.log(
            "[MEA API] Consultando USGS..."
        );


        const response =
            await fetchWithTimeout(
                MEA_API_CONFIG.USGS_FEED,
                MEA_API_CONFIG.timeout
            );


        console.log(
            "[MEA API] USGS HTTP:",
            response.status
        );


        // ====================================================
        // USGS RESPONSE ERROR
        // ====================================================

        if (!response.ok) {

            throw new Error(
                `USGS respondió con HTTP ${response.status}`
            );

        }


        // ====================================================
        // PARSE JSON
        // ====================================================

        const feed =
            await response.json();


        if (
            !feed ||
            !Array.isArray(feed.features)
        ) {

            throw new Error(
                "USGS devolvió un formato GeoJSON inválido."
            );

        }


        // ====================================================
        // NORMALIZE
        // ====================================================

        const earthquakes =
            feed.features

                .map(
                    normalizeUSGSEvent
                )

                .filter(
                    event =>
                        event !== null
                )

                .slice(
                    0,
                    MEA_API_CONFIG.maxEvents
                );


        console.log(
            "[MEA API] Terremotos obtenidos:",
            earthquakes.length
        );


        // ====================================================
        // SUCCESS RESPONSE
        // ====================================================

        return res
            .status(200)
            .json({

                success: true,

                system:
                    "Manaton Earthquake Alert",

                systemCode:
                    "MEA",

                version:
                    "0.2.0",

                environment:
                    "production",

                status:
                    "online",

                source:
                    "USGS",

                count:
                    earthquakes.length,

                data:
                    earthquakes,

                generated:
                    feed.metadata &&
                    feed.metadata.generated
                        ? new Date(
                            feed.metadata.generated
                        ).toISOString()
                        : null,

                timestamp:
                    new Date().toISOString()

            });

    }

    catch (error) {

        console.error(
            "[MEA API ERROR]",
            error
        );


        // ====================================================
        // ERROR RESPONSE
        // ====================================================

        return res
            .status(502)
            .json({

                success: false,

                system:
                    "Manaton Earthquake Alert",

                systemCode:
                    "MEA",

                version:
                    "0.2.0",

                status:
                    "offline",

                source:
                    "USGS",

                error:
                    "No fue posible obtener los datos sísmicos.",

                timestamp:
                    new Date().toISOString()

            });

    }

}
