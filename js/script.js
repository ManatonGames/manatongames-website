document.addEventListener("DOMContentLoaded", async () => {

    // Inicializar funciones
    initializeMenu();
    initializeGameSearch();

    // Cargar datos
    await loadStats();

    // Próximamente
    await loadGames();

    await loadNews();

});

// ==========================
// MENÚ HAMBURGUESA
// ==========================

function initializeMenu(){

    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.getElementById("navbar");

    if(menuToggle && navbar){

        menuToggle.addEventListener("click", () => {
            navbar.classList.toggle("active");
        });

        document.querySelectorAll("#navbar a").forEach(link => {

            link.addEventListener("click", () => {
                navbar.classList.remove("active");
            });

        });

    }

}

// ==========================
// ESTADÍSTICAS
// ==========================

async function loadStats(){

    const data = await RobloxAPI.getStats();

    if(!data){

        console.log("API Error");

        return;

    }

    const gamesCount = document.getElementById("games-count");
    const membersCount = document.getElementById("members-count");
    const visitsCount = document.getElementById("visits-count");
    const favoritesCount = document.getElementById("favorites-count");

    if(gamesCount)
        gamesCount.textContent = data.stats.totalGames;

    if(membersCount)
        membersCount.textContent = data.group.members.toLocaleString();

    if(visitsCount)
        visitsCount.textContent = data.stats.totalVisits.toLocaleString();

    if(favoritesCount)
        favoritesCount.textContent = data.stats.totalFavorites.toLocaleString();

}

// ==========================
// JUEGOS
// ==========================

async function loadGames(){

    const games = await RobloxAPI.getGames();

    const container = document.getElementById("games-container");

    if(!container || games.length === 0){
        return;
    }

    container.innerHTML = "";

    games.forEach(game => {

        container.innerHTML += `

        <div class="game-card">

            <img src="assets/games/${game.image}" alt="${game.name}">

            <div class="game-info">

                <span class="game-status released">

                    🟢 ${game.status}

                </span>

                <h3>${game.name}</h3>

                <p>${game.description}</p>

                <div class="game-stats">

                    <span>👥 Coming Soon</span>

                    <span>👁️ Coming Soon</span>

                </div>

                <a
                    href="https://www.roblox.com/games/${game.id}"
                    target="_blank"
                    class="play-btn"
                >

                    Play Now

                </a>

            </div>

        </div>

        `;

    });

}

// ==========================
// STUDIO NEWS
// ==========================

async function loadNews(){

    const news = await RobloxAPI.getNews();

    const newsContainer = document.getElementById("news-container");

    if(!newsContainer || news.length === 0){
        return;
    }

    newsContainer.innerHTML = "";

    news.forEach(item => {

        newsContainer.innerHTML += `

            <div class="news-card">

                <div class="news-header">

                    <span class="news-category">${item.category}</span>

                    <span class="news-date">${item.date}</span>

                </div>

                <h3>${item.icon} ${item.title}</h3>

                <p>${item.description}</p>

            </div>

        `;

    });

}

// ==========================
// BUSCADOR DE JUEGOS
// ==========================

function initializeGameSearch(){

    const searchInput = document.getElementById("game-search");

    if(!searchInput){
        return;
    }

    searchInput.addEventListener("input", () => {

        const search = searchInput.value.toLowerCase();

        const cards = document.querySelectorAll(".game-card");

        cards.forEach(card => {

            const title = card.querySelector("h3").textContent.toLowerCase();
            const description = card.querySelector("p").textContent.toLowerCase();

            if(
                title.includes(search) ||
                description.includes(search)
            ){

                card.style.display = "";

            }else{

                card.style.display = "none";

            }

        });

    });

}

// ==============================
// Service Worker (PWA)
// ==============================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("/sw.js")

            .then(registration => {

                console.log("✅ Service Worker registrado correctamente.");

            })

            .catch(error => {

                console.error("❌ Error al registrar el Service Worker:", error);

            });

    });

}

// ==========================================
// Loading Screen
// ==========================================

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if (!loader) return;

    // Espera un poco para que se vea la animación
    setTimeout(() => {

        loader.classList.add("hidden");

        // Elimina el loader del DOM cuando termine la animación
        setTimeout(() => {

            loader.remove();

        }, 600);

    }, 1200);

});

// ==========================================
// Website Version
// ==========================================

const versionElement = document.getElementById("website-version");

if (versionElement) {

    versionElement.textContent = `Website Version v${APP_VERSION}`;

}

// ==========================================
// Scroll Reveal (Intersection Observer)
// ==========================================

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.classList.add("active");

            observer.unobserve(entry.target);

        }

    });

}, {

    threshold: 0.15

});

document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-zoom, .stagger"
).forEach((element) => {

    observer.observe(element);

});

// ==========================================
// Stagger Delay
// ==========================================

document.querySelectorAll(".stagger").forEach((element, index) => {

    element.style.transitionDelay = `${index * 0.08}s`;

});

// ==========================================
// System Status
// ==========================================

async function loadSystemStatus() {

    try {

        const response = await fetch("/data/status.json");
        const data = await response.json();

        const status = document.getElementById("system-status");
        const statusBar = document.getElementById("status-bar");

        if (!status) return;

        status.textContent = `${data.icon} ${data.title}`;

        // Elimina clases anteriores
 status.classList.remove(
    "status-operational",
    "status-minor",
    "status-maintenance",
    "status-outage"
);

statusBar.classList.remove(
    "statusbar-operational",
    "statusbar-minor",
    "statusbar-maintenance",
    "statusbar-outage"
);

        // Agrega la clase correspondiente
switch(data.status){

    case "operational":

        status.classList.add("status-operational");
        statusBar.classList.add("statusbar-operational");

        break;

    case "minor":

        status.classList.add("status-minor");
        statusBar.classList.add("statusbar-minor");

        break;

    case "maintenance":

        status.classList.add("status-maintenance");
        statusBar.classList.add("statusbar-maintenance");

        break;

    case "outage":

        status.classList.add("status-outage");
        statusBar.classList.add("statusbar-outage");

        break;

    default:

        status.classList.add("status-operational");
        statusBar.classList.add("statusbar-operational");

}

    }

    catch(error){

        console.error("Status Error:", error);

    }

}

loadSystemStatus();

// ==========================================
// Status Bar Live Stats
// ==========================================

async function loadStatusStats() {

    const data = await RobloxAPI.getStats();

    if (!data || !data.success) {

        document.getElementById("games-status").textContent =
            "🎮 Unavailable";

        document.getElementById("members-status").textContent =
            "👥 Unavailable";

        document.getElementById("visits-status").textContent =
            "🔥 Unavailable";

        return;

    }

    const games = await RobloxAPI.getGames();

document.getElementById("games-status").textContent =
    `🎮 ${games.length} Games`;

    document.getElementById("members-status").textContent =
        `👥 ${Number(data.group.members).toLocaleString()} Members`;

    document.getElementById("visits-status").textContent =
        `🔥 ${Number(data.stats.totalVisits).toLocaleString()} Visits`;

}

loadStatusStats();

// ==========================================
// Update Manager
// ==========================================

async function checkWebsiteUpdate() {

    const versionData = await RobloxAPI.getVersion();

    if (!versionData) return;

    const currentVersion = versionData.version;

    const savedVersion = localStorage.getItem("website-version");

    // Primera visita
    if (!savedVersion) {

        localStorage.setItem("website-version", currentVersion);

        return;

    }

    // ¿Hay una versión nueva?
    if (savedVersion !== currentVersion) {

        showUpdateBanner(versionData);

    }

}

function showUpdateBanner(versionData) {

    console.log("🚀 Nueva versión disponible:", versionData.version);

}
