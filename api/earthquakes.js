// ============================================================
// MANATON EARTHQUAKE ALERT (MEA)
// CORE ENGINE
// ============================================================
//
// Version: 0.2.0
// Status: LIVE DATA
//
// MEA obtiene datos sísmicos reales mediante:
// /api/earthquakes
//
// Fuente de datos:
// U.S. Geological Survey (USGS)
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

    version: "0.2.0",

    environment: "production",


    // --------------------------------------------------------
    // SYSTEM STATUS
    // --------------------------------------------------------

    enabled: true,

    initialized: false,

    monitoring: false,


    // --------------------------------------------------------
    // EARTHQUAKE SETTINGS
    // --------------------------------------------------------

    minimumMagnitude: 0,

    maximumAlertDistanceKm: 500,

    locationAccuracyRequired: false,


    // --------------------------------------------------------
    // API
    // --------------------------------------------------------

    apiEndpoint: "/api/earthquakes",

    requestTimeout: 10000,

    updateInterval: 30000,


    // --------------------------------------------------------
    // DATA
    // --------------------------------------------------------

    maximumStoredEarthquakes: 100,


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

    lastConnectionCheck: null,

    lastConnectionError: null,

    apiRequestInProgress: false,

    lastApiResponse: null,

    updateTimer: null

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

        window.dispatchEvent(
            new CustomEvent(
                eventName,
                {
                    detail
                }
            )
        );

    }

    catch (error) {

        console.error(
            "[MEA] Failed to dispatch event:",
            error
        );

    }

}


// ============================================================
// FETCH WITH TIMEOUT
// ============================================================

async function fetchMEAWithTimeout(
    url,
    timeout
) {

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
                        "Accept":
                            "application/json"
                    },

                    cache: "no-store",

                    signal:
                        controller.signal
                }
            );


        clearTimeout(timer);


        return response;

    }

    catch (error) {

        clearTimeout(timer);

        throw error;

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
        `Inicializando ${MEA_CONFIG.name} v${MEA_CONFIG.version}...`
    );


    MEA_STATE.initialized = true;

    MEA_STATE.lastUpdate =
        new Date().toISOString();


    dispatchMEAEvent(
        MEA_EVENTS.initialized,
        {
            version:
                MEA_CONFIG.version
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


    if (!MEA_CONFIG.enabled) {

        meaError(
            "No se puede iniciar MEA porque está desactivado."
        );

        return false;

    }


    if (MEA_STATE.monitoring) {

        meaLog(
            "MEA ya está monitoreando."
        );

        return true;

    }


    MEA_STATE.monitoring = true;


    meaLog(
        "Monitoreo sísmico iniciado."
    );


    dispatchMEAEvent(
        MEA_EVENTS.monitoringStarted
    );


    // --------------------------------------------------------
    // Primera actualización inmediata
    // --------------------------------------------------------

    updateMEA();


    // --------------------------------------------------------
    // Actualizaciones periódicas
    // --------------------------------------------------------

    MEA_STATE.updateTimer =
        setInterval(
            () => {

                if (
                    MEA_STATE.monitoring
                ) {

                    updateMEA();

                }

            },
            MEA_CONFIG.updateInterval
        );


    return true;

}


// ============================================================
// STOP MONITORING
// ============================================================

function stopMEAMonitoring() {

    if (!MEA_STATE.monitoring) {

        return;

    }


    MEA_STATE.monitoring = false;


    // --------------------------------------------------------
    // Detener timer
    // --------------------------------------------------------

    if (
        MEA_STATE.updateTimer !== null
    ) {

        clearInterval(
            MEA_STATE.updateTimer
        );

        MEA_STATE.updateTimer = null;

    }


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

        return null;

    }


    if (
        MEA_STATE.apiRequestInProgress
    ) {

        meaLog(
            "Ya existe una solicitud API en progreso."
        );

        return null;

    }


    MEA_STATE.lastUpdate =
        new Date().toISOString();


    meaLog(
        "Actualizando estado de MEA..."
    );


    dispatchMEAEvent(
        MEA_EVENTS.update,
        {
            timestamp:
                MEA_STATE.lastUpdate
        }
    );


    return fetchMEAEarthquakes();

}


// ============================================================
// FETCH EARTHQUAKES
// ============================================================

async function fetchMEAEarthquakes() {

    if (
        MEA_STATE.apiRequestInProgress
    ) {

        return null;

    }


    MEA_STATE.apiRequestInProgress = true;


    const connectionTime =
        new Date().toISOString();


    try {

        meaLog(
            "Consultando API sísmica:",
            MEA_CONFIG.apiEndpoint
        );


        const response =
            await fetchMEAWithTimeout(
                MEA_CONFIG.apiEndpoint,
                MEA_CONFIG.requestTimeout
            );


        // ----------------------------------------------------
        // HTTP ERROR
        // ----------------------------------------------------

        if (!response.ok) {

            throw new Error(
                `API MEA respondió con HTTP ${response.status}`
            );

        }


        // ----------------------------------------------------
        // JSON
        // ----------------------------------------------------

        const result =
            await response.json();


        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        if (
            !result ||
            result.success !== true ||
            !Array.isArray(result.data)
        ) {

            throw new Error(
                "Respuesta inválida de la API MEA."
            );

        }


        // ----------------------------------------------------
        // CONNECTION SUCCESS
        // ----------------------------------------------------

        MEA_STATE.connected = true;

        MEA_STATE.lastConnectionCheck =
            connectionTime;

        MEA_STATE.lastConnectionError =
            null;

        MEA_STATE.lastApiResponse =
            result;


        meaLog(
            `API conectada. ${result.data.length} eventos recibidos.`
        );


        // ----------------------------------------------------
        // REGISTER EVENTS
        // ----------------------------------------------------

        let newEarthquakes = 0;


        for (
            const earthquake
            of result.data
        ) {

            const registered =
                registerMEAEarthquake(
                    earthquake
                );


            if (
                registered &&
                registered.__meaNew === true
            ) {

                newEarthquakes++;

            }

        }


        // ----------------------------------------------------
        // REMOVE INTERNAL FLAG
        // ----------------------------------------------------

        MEA_STATE.earthquakes =
            MEA_STATE.earthquakes.map(
                earthquake => {

                    const clean =
                        {
                            ...earthquake
                        };

                    delete clean.__meaNew;

                    return clean;

                }
            );


        meaLog(
            `Actualización completada. ${newEarthquakes} terremotos nuevos.`
        );


        return result;

    }

    catch (error) {

        MEA_STATE.connected = false;

        MEA_STATE.lastConnectionCheck =
            connectionTime;


        MEA_STATE.lastConnectionError =
            error?.message ||
            "Error desconocido";


        meaError(
            "No fue posible actualizar los datos sísmicos.",
            error
        );


        return null;

    }

    finally {

        MEA_STATE.apiRequestInProgress =
            false;

    }

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


    // --------------------------------------------------------
    // MAGNITUDE FILTER
    // --------------------------------------------------------

    if (
        normalized.magnitude <
        MEA_CONFIG.minimumMagnitude
    ) {

        return null;

    }


    // --------------------------------------------------------
    // DUPLICATE CHECK
    // --------------------------------------------------------

    const exists =
        MEA_STATE.earthquakes.some(
            item =>
                item.id === normalized.id
        );


    if (exists) {

        return normalized;

    }


    // --------------------------------------------------------
    // MARK AS NEW
    // --------------------------------------------------------

    normalized.__meaNew = true;


    // --------------------------------------------------------
    // STORE
    // --------------------------------------------------------

    MEA_STATE.earthquakes.unshift(
        normalized
    );


    // --------------------------------------------------------
    // LIMIT STORAGE
    // --------------------------------------------------------

    if (
        MEA_STATE.earthquakes.length >
        MEA_CONFIG.maximumStoredEarthquakes
    ) {

        MEA_STATE.earthquakes =
            MEA_STATE.earthquakes.slice(
                0,
                MEA_CONFIG.maximumStoredEarthquakes
            );

    }


    // --------------------------------------------------------
    // LAST EARTHQUAKE
    // --------------------------------------------------------

    MEA_STATE.lastEarthquake =
        normalized;


    // --------------------------------------------------------
    // PROCESSED
    // --------------------------------------------------------

    MEA_STATE.processedEarthquakes.push(
        normalized.id
    );


    // --------------------------------------------------------
    // EVENT
    // --------------------------------------------------------

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


    const magnitude =
        Number(
            earthquake.magnitude ?? 0
        );


    const latitude =
        Number(
            earthquake.latitude ?? 0
        );


    const longitude =
        Number(
            earthquake.longitude ?? 0
        );


    const depth =
        earthquake.depth !== null &&
        earthquake.depth !== undefined
            ? Number(earthquake.depth)
            : null;


    if (
        !Number.isFinite(magnitude) ||
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {

        meaError(
            "Datos numéricos inválidos en terremoto."
        );

        return null;

    }


    if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
    ) {

        meaError(
            "Coordenadas sísmicas fuera de rango."
        );

        return null;

    }


    return {

        id:
            earthquake.id ||
            `mea-${Date.now()}`,

        magnitude,

        latitude,

        longitude,

        depth:
            Number.isFinite(depth)
                ? depth
                : null,

        location:
            earthquake.location ||
            "Ubicación desconocida",

        timestamp:
            earthquake.timestamp ||
            new Date().toISOString(),

        updated:
            earthquake.updated ||
            null,

        source:
            earthquake.source ||
            "unknown",

        sourceUrl:
            earthquake.sourceUrl ||
            null,

        detailUrl:
            earthquake.detailUrl ||
            null,

        alert:
            earthquake.alert ||
            null,

        tsunami:
            earthquake.tsunami === true,

        significance:
            Number(
                earthquake.significance ?? 0
            ),

        magnitudeType:
            earthquake.magnitudeType ||
            null,

        status:
            earthquake.status ||
            null,

        type:
            earthquake.type ||
            null

    };

}


// ============================================================
// GET EARTHQUAKES
// ============================================================

function getMEAEarthquakes() {

    return MEA_STATE.earthquakes.map(
        earthquake => {

            const clean =
                {
                    ...earthquake
                };

            delete clean.__meaNew;

            return clean;

        }
    );

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

        earthquakes:
            getMEAEarthquakes(),

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


    let normalizedAccuracy = null;


    if (
        accuracy !== null &&
        accuracy !== undefined
    ) {

        const numericAccuracy =
            Number(accuracy);


        if (
            Number.isFinite(
                numericAccuracy
            ) &&
            numericAccuracy >= 0
        ) {

            normalizedAccuracy =
                numericAccuracy;

        }

    }


    MEA_STATE.location = {

        available: true,

        latitude: lat,

        longitude: lon,

        accuracy:
            normalizedAccuracy

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


    dispatchMEAEvent(
        MEA_EVENTS.location,
        {
            ...MEA_STATE.location
        }
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

        lastConnectionCheck:
            MEA_STATE.lastConnectionCheck,

        lastConnectionError:
            MEA_STATE.lastConnectionError,

        apiRequestInProgress:
            MEA_STATE.apiRequestInProgress,

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

window.MEA = {

    // --------------------------------------------------------
    // System
    // --------------------------------------------------------

    initialize:
        initializeMEA,

    start:
        startMEAMonitoring,

    stop:
        stopMEAMonitoring,

    update:
        updateMEA,


    // --------------------------------------------------------
    // LIVE DATA
    // --------------------------------------------------------

    fetchEarthquakes:
        fetchMEAEarthquakes,

    getEarthquakes:
        getMEAEarthquakes,


    // --------------------------------------------------------
    // State
    // --------------------------------------------------------

    getState:
        getMEAState,

    getConfig:
        getMEAConfig,

    getStatus:
        getMEAStatus,


    // --------------------------------------------------------
    // Earthquakes
    // --------------------------------------------------------

    registerEarthquake:
        registerMEAEarthquake,

    testEarthquake:
        testMEAEarthquake,

    clearEarthquakes:
        clearMEAEarthquakes,


    // --------------------------------------------------------
    // Location
    // --------------------------------------------------------

    setLocation:
        setMEALocation,

    clearLocation:
        clearMEALocation,


    // --------------------------------------------------------
    // Events
    // --------------------------------------------------------

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
// END
// ============================================================

meaLog(
    `MEA Core v${MEA_CONFIG.version} cargado`
);
