// ============================================================
// MANATON EARTHQUAKE ALERT (MEA)
// CORE ENGINE
// ============================================================
//
// Version: 0.1.0
// Status: FOUNDATION
//
// Este archivo contiene el núcleo inicial de MEA.
// En esta etapa NO se conecta todavía a APIs sísmicas reales.
//
// ============================================================


"use strict";


// ============================================================
// MEA CONFIGURATION
// ============================================================

const MEA_CONFIG = {

    // --------------------------------------------------------
    // SYSTEM
    // --------------------------------------------------------

    name: "Manaton Earthquake Alert",

    shortName: "MEA",

    version: "0.1.0",

    environment: "development",


    // --------------------------------------------------------
    // SYSTEM STATUS
    // --------------------------------------------------------

    enabled: true,

    initialized: false,

    monitoring: false,


    // --------------------------------------------------------
    // EARTHQUAKE DEFAULTS
    // --------------------------------------------------------

    minimumMagnitude: 0,

    maximumAlertDistanceKm: 500,

    locationAccuracyRequired: false,


    // --------------------------------------------------------
    // UPDATE SETTINGS
    // --------------------------------------------------------

    updateInterval: 30000,


    // --------------------------------------------------------
    // DEBUG
    // --------------------------------------------------------

    debug: true

};


// ============================================================
// MEA STATE
// ============================================================

const MEA_STATE = {

    // --------------------------------------------------------
    // SYSTEM
    // --------------------------------------------------------

    initialized: false,

    monitoring: false,

    lastUpdate: null,

    lastEarthquake: null,


    // --------------------------------------------------------
    // LOCATION
    // --------------------------------------------------------

    location: {

        available: false,

        latitude: null,

        longitude: null,

        accuracy: null

    },


    // --------------------------------------------------------
    // EARTHQUAKES
    // --------------------------------------------------------

    earthquakes: [],

    activeAlerts: [],

    processedEarthquakes: [],


    // --------------------------------------------------------
    // CONNECTION
    // --------------------------------------------------------

    connected: false,

    lastConnectionCheck: null

};


// ============================================================
// MEA EVENTS
// ============================================================

const MEA_EVENTS = {

    initialized: "mea:initialized",

    update: "mea:update",

    earthquake: "mea:earthquake",

    alert: "mea:alert",

    location: "mea:location",

    error: "mea:error",

    monitoringStarted: "mea:monitoring-started",

    monitoringStopped: "mea:monitoring-stopped"

};


// ============================================================
// DEBUG LOGGER
// ============================================================

function meaLog(...messages) {

    if (!MEA_CONFIG.debug) {

        return;

    }


    console.log(
        "[MEA]",
        ...messages
    );

}


// ============================================================
// ERROR LOGGER
// ============================================================

function meaError(...messages) {

    console.error(
        "[MEA ERROR]",
        ...messages
    );


    dispatchMEAEvent(
        MEA_EVENTS.error,
        {
            messages
        }
    );

}


// ============================================================
// EVENT DISPATCHER
// ============================================================

function dispatchMEAEvent(
    eventName,
    detail = {}
) {

    try {

        const event =
            new CustomEvent(
                eventName,
                {
                    detail
                }
            );


        window.dispatchEvent(event);

    }

    catch (error) {

        console.error(
            "[MEA] Failed to dispatch event:",
            error
        );

    }

}


// ============================================================
// SYSTEM INITIALIZATION
// ============================================================

function initializeMEA() {

    if (MEA_STATE.initialized) {

        meaLog(
            "MEA ya estaba inicializado."
        );

        return;

    }


    if (!MEA_CONFIG.enabled) {

        meaLog(
            "MEA está desactivado."
        );

        return;

    }


    meaLog(
        `Inicializando Manaton Earthquake Alert v${MEA_CONFIG.version}...`
    );


    MEA_STATE.initialized = true;

    MEA_STATE.lastUpdate =
        new Date().toISOString();


    dispatchMEAEvent(
        MEA_EVENTS.initialized,
        {
            version: MEA_CONFIG.version
        }
    );


    meaLog(
        "MEA inicializado correctamente."
    );

}


// ============================================================
// START MONITORING
// ============================================================

function startMEAMonitoring() {

    if (!MEA_STATE.initialized) {

        initializeMEA();

    }


    if (MEA_STATE.monitoring) {

        meaLog(
            "MEA ya está monitoreando."
        );

        return;

    }


    MEA_STATE.monitoring = true;


    meaLog(
        "Monitoreo sísmico iniciado."
    );


    dispatchMEAEvent(
        MEA_EVENTS.monitoringStarted
    );


    updateMEA();

}


// ============================================================
// STOP MONITORING
// ============================================================

function stopMEAMonitoring() {

    if (!MEA_STATE.monitoring) {

        return;

    }


    MEA_STATE.monitoring = false;


    meaLog(
        "Monitoreo sísmico detenido."
    );


    dispatchMEAEvent(
        MEA_EVENTS.monitoringStopped
    );

}


// ============================================================
// UPDATE MEA
// ============================================================

async function updateMEA() {

    if (!MEA_STATE.initialized) {

        return;

    }


    MEA_STATE.lastUpdate =
        new Date().toISOString();


    meaLog(
        "Actualizando estado de MEA..."
    );


    dispatchMEAEvent(
        MEA_EVENTS.update,
        {
            timestamp: MEA_STATE.lastUpdate
        }
    );

}


// ============================================================
// REGISTER EARTHQUAKE
// ============================================================

function registerMEAEarthquake(
    earthquake
) {

    if (!earthquake) {

        meaError(
            "Se intentó registrar un terremoto inexistente."
        );

        return null;

    }


    const normalized =
        normalizeMEAEarthquake(
            earthquake
        );


    if (!normalized) {

        return null;

    }


    const exists =
        MEA_STATE.earthquakes.some(
            item =>
                item.id === normalized.id
        );


    if (exists) {

        meaLog(
            "Terremoto ya registrado:",
            normalized.id
        );

        return normalized;

    }


    MEA_STATE.earthquakes.push(
        normalized
    );


    MEA_STATE.lastEarthquake =
        normalized;


    MEA_STATE.processedEarthquakes.push(
        normalized.id
    );


    meaLog(
        "Nuevo terremoto registrado:",
        normalized
    );


    dispatchMEAEvent(
        MEA_EVENTS.earthquake,
        normalized
    );


    return normalized;

}


// ============================================================
// NORMALIZE EARTHQUAKE
// ============================================================

function normalizeMEAEarthquake(
    earthquake
) {

    if (
        typeof earthquake !== "object" ||
        earthquake === null
    ) {

        meaError(
            "Formato de terremoto inválido."
        );

        return null;

    }


    const normalized = {

        id:
            earthquake.id ||
            `mea-${Date.now()}`,

        magnitude:
            Number(
                earthquake.magnitude ?? 0
            ),

        latitude:
            Number(
                earthquake.latitude ?? 0
            ),

        longitude:
            Number(
                earthquake.longitude ?? 0
            ),

        depth:
            Number(
                earthquake.depth ?? 0
            ),

        location:
            earthquake.location ||
            "Ubicación desconocida",

        timestamp:
            earthquake.timestamp ||
            new Date().toISOString(),

        source:
            earthquake.source ||
            "unknown"

    };


    return normalized;

}


// ============================================================
// GET MEA STATE
// ============================================================

function getMEAState() {

    return {

        ...MEA_STATE,

        location: {

            ...MEA_STATE.location

        },

        earthquakes: [

            ...MEA_STATE.earthquakes

        ],

        activeAlerts: [

            ...MEA_STATE.activeAlerts

        ]

    };

}


// ============================================================
// GET MEA CONFIG
// ============================================================

function getMEAConfig() {

    return {

        ...MEA_CONFIG

    };

}


// ============================================================
// SET LOCATION
// ============================================================

function setMEALocation(
    latitude,
    longitude,
    accuracy = null
) {

    const lat =
        Number(latitude);

    const lon =
        Number(longitude);


    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lon)
    ) {

        meaError(
            "Coordenadas inválidas."
        );

        return false;

    }


    if (
        lat < -90 ||
        lat > 90 ||
        lon < -180 ||
        lon > 180
    ) {

        meaError(
            "Coordenadas fuera de rango."
        );

        return false;

    }


    MEA_STATE.location = {

        available: true,

        latitude: lat,

        longitude: lon,

        accuracy:
            accuracy !== null
                ? Number(accuracy)
                : null

    };


    meaLog(
        "Ubicación MEA actualizada:",
        MEA_STATE.location
    );


    dispatchMEAEvent(
        MEA_EVENTS.location,
        {
            ...MEA_STATE.location
        }
    );


    return true;

}


// ============================================================
// CLEAR LOCATION
// ============================================================

function clearMEALocation() {

    MEA_STATE.location = {

        available: false,

        latitude: null,

        longitude: null,

        accuracy: null

    };


    meaLog(
        "Ubicación MEA eliminada."
    );

}


// ============================================================
// CLEAR EARTHQUAKE DATA
// ============================================================

function clearMEAEarthquakes() {

    MEA_STATE.earthquakes = [];

    MEA_STATE.activeAlerts = [];

    MEA_STATE.processedEarthquakes = [];

    MEA_STATE.lastEarthquake = null;


    meaLog(
        "Datos sísmicos locales limpiados."
    );

}


// ============================================================
// SYSTEM STATUS
// ============================================================

function getMEAStatus() {

    return {

        name:
            MEA_CONFIG.name,

        version:
            MEA_CONFIG.version,

        environment:
            MEA_CONFIG.environment,

        enabled:
            MEA_CONFIG.enabled,

        initialized:
            MEA_STATE.initialized,

        monitoring:
            MEA_STATE.monitoring,

        connected:
            MEA_STATE.connected,

        lastUpdate:
            MEA_STATE.lastUpdate,

        locationAvailable:
            MEA_STATE.location.available,

        earthquakeCount:
            MEA_STATE.earthquakes.length,

        activeAlertCount:
            MEA_STATE.activeAlerts.length

    };

}


// ============================================================
// TEST EARTHQUAKE
// ============================================================

function testMEAEarthquake() {

    const testEarthquake = {

        id:
            `mea-test-${Date.now()}`,

        magnitude: 5.0,

        latitude: 4.7110,

        longitude: -74.0721,

        depth: 10,

        location:
            "MEA Test Event",

        timestamp:
            new Date().toISOString(),

        source:
            "MEA_TEST"

    };


    return registerMEAEarthquake(
        testEarthquake
    );

}


// ============================================================
// PUBLIC API
// ============================================================
//
// Exponemos MEA de forma controlada mediante window.MEA.
//
// Esto permite que otros módulos puedan utilizar el núcleo
// sin tener que acceder directamente a variables internas.
//

window.MEA = {

    // System

    initialize:
        initializeMEA,

    start:
        startMEAMonitoring,

    stop:
        stopMEAMonitoring,

    update:
        updateMEA,


    // State

    getState:
        getMEAState,

    getConfig:
        getMEAConfig,

    getStatus:
        getMEAStatus,


    // Earthquakes

    registerEarthquake:
        registerMEAEarthquake,

    testEarthquake:
        testMEAEarthquake,

    clearEarthquakes:
        clearMEAEarthquakes,


    // Location

    setLocation:
        setMEALocation,

    clearLocation:
        clearMEALocation,


    // Events

    events:
        MEA_EVENTS

};


// ============================================================
// AUTO INITIALIZATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeMEA();

    }
);


// ============================================================
// END OF MEA CORE
// ============================================================

meaLog(
    "MEA Core cargado."
);
