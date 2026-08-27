// ============================================================
// MANATON EARTHQUAKE ALERT (MEA)
// CORE ENGINE
// ============================================================
//
// Version: 0.2.0
// Status: LIVE DATA CONNECTION
//
// En esta versión MEA:
// - Se conecta con /api/earthquakes
// - Obtiene terremotos reales desde el backend
// - Normaliza los eventos
// - Detecta terremotos nuevos
// - Mantiene el estado local de MEA
// - Comprueba la conexión con el backend
// - Actualiza automáticamente cada 30 segundos
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
    // API
    // --------------------------------------------------------

    apiEndpoint: "/api/earthquakes",

    requestTimeout: 10000,


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

    lastConnectionCheck: null,

    lastConnectionError: null,


    // --------------------------------------------------------
    // API
    // --------------------------------------------------------

    apiRequestInProgress: false

};


// ============================================================
// MEA INTERNALS
// ============================================================

let MEA_UPDATE_TIMER = null;


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

        meaLog(
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
    // Crear intervalo de actualización
    // --------------------------------------------------------

    MEA_UPDATE_TIMER =
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
    // Detener intervalo
    // --------------------------------------------------------

    if (
        MEA_UPDATE_TIMER !== null
    ) {

        clearInterval(
            MEA_UPDATE_TIMER
        );

        MEA_UPDATE_TIMER = null;

    }


    meaLog(
        "Monitoreo sísmico detenido."
    );


    dispatchMEAEvent(
        MEA_EVENTS.monitoringStopped
    );

}


// ============================================================
// FETCH EARTHQUAKES FROM API
// ============================================================

async function fetchMEAEarthquakes() {

    if (
        MEA_STATE.apiRequestInProgress
    ) {

        meaLog(
            "Ya existe una solicitud sísmica en progreso."
        );

        return null;

    }


    MEA_STATE.apiRequestInProgress = true;


    const controller =
        new AbortController();


    const timeout =
        setTimeout(
            () => {

                controller.abort();

            },
            MEA_CONFIG.requestTimeout
        );


    try {

        meaLog(
            "Consultando API sísmica:",
            MEA_CONFIG.apiEndpoint
        );


        const response =
            await fetch(
                MEA_CONFIG.apiEndpoint,
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


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status} ${response.statusText}`
            );

        }


        const data =
            await response.json();


        // ----------------------------------------------------
        // Validar respuesta
        // ----------------------------------------------------

        if (
            !data ||
            typeof data !== "object"
        ) {

            throw new Error(
                "La API devolvió una respuesta inválida."
            );

        }


        if (
            data.success === false
        ) {

            throw new Error(
                data.error ||
                "La API sísmica informó un error."
            );

        }


        if (
            !Array.isArray(
                data.earthquakes
            )
        ) {

            throw new Error(
                "La respuesta de la API no contiene un array 'earthquakes'."
            );

        }


        // ----------------------------------------------------
        // Conexión correcta
        // ----------------------------------------------------

        MEA_STATE.connected = true;

        MEA_STATE.lastConnectionCheck =
            new Date().toISOString();

        MEA_STATE.lastConnectionError =
            null;


        meaLog(
            `API sísmica conectada. Eventos recibidos: ${data.earthquakes.length}`
        );


        return data.earthquakes;

    }

    catch (error) {

        MEA_STATE.connected = false;

        MEA_STATE.lastConnectionCheck =
            new Date().toISOString();

        MEA_STATE.lastConnectionError =
            error?.message ||
            "Error desconocido";


        if (
            error?.name === "AbortError"
        ) {

            meaError(
                "La solicitud a la API sísmica superó el tiempo límite."
            );

        }

        else {

            meaError(
                "No se pudo consultar la API sísmica:",
                error?.message ||
                error
            );

        }


        return null;

    }

    finally {

        clearTimeout(
            timeout
        );

        MEA_STATE.apiRequestInProgress =
            false;

    }

}


// ============================================================
// UPDATE MEA
// ============================================================

async function updateMEA() {

    if (!MEA_STATE.initialized) {

        initializeMEA();

    }


    if (!MEA_CONFIG.enabled) {

        return null;

    }


    MEA_STATE.lastUpdate =
        new Date().toISOString();


    meaLog(
        "Actualizando estado de MEA..."
    );


    // --------------------------------------------------------
    // Obtener datos sísmicos
    // --------------------------------------------------------

    const earthquakes =
        await fetchMEAEarthquakes();


    if (
        earthquakes === null
    ) {

        dispatchMEAEvent(
            MEA_EVENTS.update,
            {

                timestamp:
                    MEA_STATE.lastUpdate,

                success:
                    false,

                connected:
                    MEA_STATE.connected

            }
        );


        return null;

    }


    // --------------------------------------------------------
    // Registrar terremotos
    // --------------------------------------------------------

    let newEarthquakes = 0;


    for (
        const earthquake
        of earthquakes
    ) {

        const normalized =
            normalizeMEAEarthquake(
                earthquake
            );


        if (!normalized) {

            continue;

        }


        if (
            normalized.magnitude <
            MEA_CONFIG.minimumMagnitude
        ) {

            continue;

        }


        const exists =
            MEA_STATE.earthquakes.some(
                item =>
                    item.id ===
                    normalized.id
            );


        if (!exists) {

            registerMEAEarthquake(
                normalized
            );

            newEarthquakes++;

        }

    }


    // --------------------------------------------------------
    // Update event
    // --------------------------------------------------------

    dispatchMEAEvent(
        MEA_EVENTS.update,
        {

            timestamp:
                MEA_STATE.lastUpdate,

            success:
                true,

            connected:
                MEA_STATE.connected,

            count:
                earthquakes.length,

            newEarthquakes

        }
    );


    meaLog(
        `Actualización completada. ${earthquakes.length} eventos recibidos, ${newEarthquakes} nuevos.`
    );


    return earthquakes;

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
                item.id ===
                normalized.id
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


    if (
        !MEA_STATE.processedEarthquakes.includes(
            normalized.id
        )
    ) {

        MEA_STATE.processedEarthquakes.push(
            normalized.id
        );

    }


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
        Number(
            earthquake.depth ?? 0
        );


    if (
        !Number.isFinite(magnitude) ||
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        !Number.isFinite(depth)
    ) {

        meaError(
            "Datos numéricos inválidos en terremoto:",
            earthquake
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
            "Coordenadas sísmicas fuera de rango:",
            earthquake
        );

        return null;

    }


    const normalized = {

        id:
            earthquake.id ||
            `mea-${Date.now()}`,

        magnitude,

        latitude,

        longitude,

        depth,

        location:
            earthquake.location ||
            "Ubicación desconocida",

        timestamp:
            earthquake.timestamp ||
            new Date().toISOString(),

        source:
            earthquake.source ||
            "unknown",

        url:
            earthquake.url ||
            null

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

        ],

        processedEarthquakes: [

            ...MEA_STATE.processedEarthquakes

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

        locationAvailable:
            MEA_STATE.location.available,

        earthquakeCount:
            MEA_STATE.earthquakes.length,

        activeAlertCount:
            MEA_STATE.activeAlerts.length,

        apiRequestInProgress:
            MEA_STATE.apiRequestInProgress

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
    // API
    // --------------------------------------------------------

    fetchEarthquakes:
        fetchMEAEarthquakes,


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
// END OF MEA CORE
// ============================================================

meaLog(
    `MEA Core v${MEA_CONFIG.version} cargado.`
);
