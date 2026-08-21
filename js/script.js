document.addEventListener("DOMContentLoaded", async () => {

    // Inicializar funciones
    initializeMenu();
    initializeGameSearch();

    // Cargar datos
    await loadStats();

    // Cargar juegos
    await loadGames();

    // Cargar noticias
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
        membersCount.textContent =
            Number(data.group.members).toLocaleString();

    if(visitsCount)
        visitsCount.textContent =
            Number(data.stats.totalVisits).toLocaleString();

    if(favoritesCount)
        favoritesCount.textContent =
            Number(data.stats.totalFavorites).toLocaleString();

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

            <img
                src="assets/games/${game.image}"
                alt="${game.name}"
            >

            <div class="game-info">

                <span class="game-status ${game.status === "Released" ? "released" : "development"}">

                    ${game.status === "Released" ? "🟢" : "🟡"}

                    ${game.status}

                </span>

                <h3>${game.name}</h3>

                <p>${game.description}</p>

                <div class="game-stats">

                    <span>👥 ${game.players || "Coming Soon"}</span>

                    <span>👁️ ${game.visits || "Coming Soon"}</span>

                </div>

                <a
                    href="https://www.roblox.com/games/${game.id}"
                    target="_blank"
                    rel="noopener noreferrer"
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

                    <span class="news-category">
                        ${item.category}
                    </span>

                    <span class="news-date">
                        ${item.date}
                    </span>

                </div>

                <h3>
                    ${item.icon} ${item.title}
                </h3>

                <p>
                    ${item.description}
                </p>

            </div>

        `;

    });

}

// ==========================
// BUSCADOR + FILTRO DE JUEGOS
// ==========================

function initializeGameSearch(){

    const searchInput = document.getElementById("game-search");
    const filterSelect = document.getElementById("game-filter");
    const noGames = document.getElementById("no-games");

    if(!searchInput || !filterSelect){

        return;

    }

    function filterGames(){

        const search =
            searchInput.value.toLowerCase().trim();

        const filter =
            filterSelect.value;

        const cards =
            document.querySelectorAll(".game-card");

        let visibleGames = 0;

        cards.forEach(card => {

            const title =
                card.querySelector("h3")?.textContent
                    .toLowerCase() || "";

            const description =
                card.querySelector("p")?.textContent
                    .toLowerCase() || "";

            const status =
                card.querySelector(".game-status")?.textContent
                    .trim() || "";

            // ==========================
            // BUSCADOR
            // ==========================

            const matchesSearch =
                title.includes(search) ||
                description.includes(search);

            // ==========================
            // FILTRO
            // ==========================

            const matchesFilter =
                filter === "all" ||
                status.includes(filter);

            // ==========================
            // RESULTADO
            // ==========================

            if(matchesSearch && matchesFilter){

                card.style.display = "";

                visibleGames++;

            }else{

                card.style.display = "none";

            }

        });

        // ==========================
        // NO GAMES FOUND
        // ==========================

        if(noGames){

            if(visibleGames === 0){

                noGames.style.display = "block";

            }else{

                noGames.style.display = "none";

            }

        }

    }

    // Buscar mientras escribe
    searchInput.addEventListener(
        "input",
        filterGames
    );

    // Filtrar al cambiar selección
    filterSelect.addEventListener(
        "change",
        filterGames
    );

}

// ==============================
// SERVICE WORKER (PWA)
// ==============================

if("serviceWorker" in navigator){

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("/sw.js")

            .then(registration => {

                console.log(
                    "✅ Service Worker registrado correctamente."
                );

            })

            .catch(error => {

                console.error(
                    "❌ Error al registrar el Service Worker:",
                    error
                );

            });

    });

}

// ==========================================
// LOADING SCREEN
// ==========================================

window.addEventListener("load", () => {

    const loader =
        document.getElementById("loader");

    if(!loader) return;

    // Esperar para mostrar la animación

    setTimeout(() => {

        loader.classList.add("hidden");

        // Eliminar después de la animación

        setTimeout(() => {

            loader.remove();

        }, 600);

    }, 1200);

});

// ==========================================
// WEBSITE VERSION
// ==========================================

const versionElement =
    document.getElementById("website-version");

if(versionElement){

    versionElement.textContent =
        `Website Version v${APP_VERSION}`;

}

// ==========================================
// SCROLL REVEAL
// ==========================================

const observer =
    new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if(entry.isIntersecting){

                    entry.target.classList.add("active");

                    observer.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.15
        }

    );

document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-zoom, .stagger"
).forEach((element) => {

    observer.observe(element);

});

// ==========================================
// STAGGER DELAY
// ==========================================

document.querySelectorAll(".stagger").forEach(
    (element, index) => {

        element.style.transitionDelay =
            `${index * 0.08}s`;

    }
);

// ==========================================
// SYSTEM STATUS
// ==========================================

async function loadSystemStatus(){

    try{

        const response =
            await fetch("/data/status.json");

        const data =
            await response.json();

        const status =
            document.getElementById("system-status");

        const statusBar =
            document.getElementById("status-bar");

        if(!status) return;

        status.textContent =
            `${data.icon} ${data.title}`;

        // Eliminar clases anteriores

        status.classList.remove(
            "status-operational",
            "status-minor",
            "status-maintenance",
            "status-outage"
        );

        if(statusBar){

            statusBar.classList.remove(
                "statusbar-operational",
                "statusbar-minor",
                "statusbar-maintenance",
                "statusbar-outage"
            );

        }

        // Agregar clase correspondiente

        switch(data.status){

            case "operational":

                status.classList.add(
                    "status-operational"
                );

                if(statusBar)
                    statusBar.classList.add(
                        "statusbar-operational"
                    );

                break;

            case "minor":

                status.classList.add(
                    "status-minor"
                );

                if(statusBar)
                    statusBar.classList.add(
                        "statusbar-minor"
                    );

                break;

            case "maintenance":

                status.classList.add(
                    "status-maintenance"
                );

                if(statusBar)
                    statusBar.classList.add(
                        "statusbar-maintenance"
                    );

                break;

            case "outage":

                status.classList.add(
                    "status-outage"
                );

                if(statusBar)
                    statusBar.classList.add(
                        "statusbar-outage"
                    );

                break;

            default:

                status.classList.add(
                    "status-operational"
                );

                if(statusBar)
                    statusBar.classList.add(
                        "statusbar-operational"
                    );

        }

    }

    catch(error){

        console.error(
            "Status Error:",
            error
        );

    }

}

loadSystemStatus();

// ==========================================
// STATUS BAR LIVE STATS
// ==========================================

async function loadStatusStats(){

    const data =
        await RobloxAPI.getStats();

    const gamesStatus =
        document.getElementById("games-status");

    const membersStatus =
        document.getElementById("members-status");

    const visitsStatus =
        document.getElementById("visits-status");

    if(!data || !data.success){

        if(gamesStatus)
            gamesStatus.textContent =
                "🎮 Unavailable";

        if(membersStatus)
            membersStatus.textContent =
                "👥 Unavailable";

        if(visitsStatus)
            visitsStatus.textContent =
                "🔥 Unavailable";

        return;

    }

    const games =
        await RobloxAPI.getGames();

    if(gamesStatus)
        gamesStatus.textContent =
            `🎮 ${games.length} Games`;

    if(membersStatus)
        membersStatus.textContent =
            `👥 ${Number(
                data.group.members
            ).toLocaleString()} Members`;

    if(visitsStatus)
        visitsStatus.textContent =
            `🔥 ${Number(
                data.stats.totalVisits
            ).toLocaleString()} Visits`;

}

loadStatusStats();

// ==========================================
// UPDATE MANAGER
// ==========================================

async function checkWebsiteUpdate(){

    const versionData =
        await RobloxAPI.getVersion();

    if(!versionData) return;

    const currentVersion =
        versionData.version;

    const savedVersion =
        localStorage.getItem(
            "website-version"
        );

    // Primera visita

    if(!savedVersion){

        localStorage.setItem(
            "website-version",
            currentVersion
        );

        return;

    }

    // ¿Existe una nueva versión?

    if(savedVersion !== currentVersion){

        showUpdateBanner(versionData);

    }

}

// ==========================================
// UPDATE BANNER
// ==========================================

function showUpdateBanner(versionData){

    const popup =
        document.createElement("div");

    popup.id = "update-center";

    popup.innerHTML = `

        <div class="update-box">

            <h2>
                🚀 ${versionData.title}
            </h2>

            <p>
                ${versionData.message}
            </p>

            <ul>

                ${versionData.changes.map(change => `

                    <li>
                        ✅ ${change}
                    </li>

                `).join("")}

            </ul>

            <div class="update-buttons">

                <button id="later-update">
                    Later
                </button>

                <button id="update-now">
                    Update Now
                </button>

            </div>

        </div>

    `;

    document.body.appendChild(popup);

    // ==========================
    // BOTÓN LATER
    // ==========================

    document
        .getElementById("later-update")
        .addEventListener("click", () => {

            popup.remove();

        });

    // ==========================
    // BOTÓN UPDATE NOW
    // ==========================

    document
        .getElementById("update-now")
        .addEventListener("click", () => {

            // Guardar nueva versión

            localStorage.setItem(
                "website-version",
                versionData.version
            );

            // Recargar página

            location.reload();

        });

}

// Ejecutar Update Manager

checkWebsiteUpdate();
