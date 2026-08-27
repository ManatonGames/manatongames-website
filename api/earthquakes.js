// ============================================================
// MANATON EARTHQUAKE ALERT (MEA)
// EARTHQUAKE API ENDPOINT
// ============================================================
//
// Version: 0.1.0
// Status: FOUNDATION
//
// Este endpoint será la puerta de entrada de MEA hacia los
// datos sísmicos reales.
//
// Por ahora NO consulta ninguna fuente externa.
// Devuelve únicamente información de prueba.
//
// ============================================================


"use strict";


// ============================================================
// API HANDLER
// ============================================================

export default function handler(req, res) {

    // --------------------------------------------------------
    // CORS
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // OPTIONS
    // --------------------------------------------------------

    if (req.method === "OPTIONS") {

        return res.status(200).end();

    }


    // --------------------------------------------------------
    // ONLY GET
    // --------------------------------------------------------

    if (req.method !== "GET") {

        return res.status(405).json({

            success: false,

            error:
                "Method Not Allowed"

        });

    }


    // --------------------------------------------------------
    // TEST RESPONSE
    // --------------------------------------------------------

    return res.status(200).json({

        success: true,

        system: "Manaton Earthquake Alert",

        systemCode: "MEA",

        version: "0.1.0",

        environment: "development",

        status: "online",

        source: null,

        data: [],

        timestamp:
            new Date().toISOString()

    });

}
