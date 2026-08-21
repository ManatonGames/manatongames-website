document.addEventListener("DOMContentLoaded", async () => {

    // ==========================
    // INICIALIZAR FUNCIONES
    // ==========================

    initializeMenu();
    initializeGameSearch();

    // ==========================
    // CARGAR DATOS
    // ==========================

    await loadStats();

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

    if(gamesCount){

        gamesCount.textContent = data.stats.totalGames;

    }

    if(membersCount){

        membersCount.textContent =
            Number(data.group.members).toLocaleString();

    }

    if(visitsCount){

        visitsCount.textContent =
            Number(data.stats.totalVisits).toLocaleString();

    }

    if(favoritesCount){

        favoritesCount.textContent =
            Number(data.stats.totalFavorites).toLocaleString();

    }

}


// ==========================
// JUEGOS
// ==========================

let allGames = [];

async function loadGames(){

    const games = await RobloxAPI.getGames();

    const container = document.getElementById("games-container");
    const noGames = document.getElementById("no-games");

    if(!container){

        return;

    }

    if(!games || games.length === 0){

        container.innerHTML = "";

        if(noGames){

            noGames.style.display = "block";

        }

        return;

    }

    // Guardar todos los juegos
    allGames = games;

    // Mostrar todos inicialmente
    renderGames(allGames);

}


// ==========================
// RENDERIZAR JUEGOS
// ==========================

function renderGames(games){

    const container = document.getElementById("games-container");
    const noGames = document.getElementById("no-games");

    if(!container){

        return;

    }

    container.innerHTML = "";

    // ==========================
    // SIN RESULTADOS
    // ==========================

    if(games.length === 0){

        if(noGames){

            noGames.style.display = "block";

        }

        return;

    }

    if(noGames){

        noGames.style.display = "none";

    }


    // ==========================
    // CREAR TARJETAS
    // ==========================

    games.forEach(game => {

        // Determinar clase del estado
        let statusClass = "released";
        let statusIcon = "🟢";

        if(game.status === "In Development"){

            statusClass = "development";
            statusIcon = "🟠";

        }

        // ==========================
        // CREAR BADGES
        // ==========================

        let badges = "";

        if(game.featured){

            badges += `
                <span class="game-badge featured">
                    ⭐ Featured
                </span>
            `;

        }

        if(game.new){

            badges += `
                <span class="game-badge new">
                    🆕 New
                </span>
            `;

        }

        if(game.hot){

            badges += `
                <span class="game-badge hot">
                    🔥 Hot
                </span>
            `;

        }


        // ==========================
        // CREAR TARJETA
        // ==========================

        container.innerHTML += `

            <div class="game-card">

                <div class="game-image-wrapper">

                    <img
                        src="assets/games/${game.image}"
                        alt="${game.name}"
                    >

                    <div class="game-badges">

                        ${badges}

                    </div>

                </div>

                <div class="game-info">

                    <span class="game-status ${statusClass}">

                        ${statusIcon} ${game.status}

                    </span>

                    <h3>
                        ${game.name}
                    </h3>

                    <p>
                        ${game.description}
                    </p>

                    <div class="game-stats">

                        <span>
                            👥 ${game.players}
                        </span>

                        <span>
                            👁️ ${game.visits}
                        </span>

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
// BUSCADOR + FILTRO DE JUEGOS
// ==========================

function initializeGameSearch(){

    const searchInput =
        document.getElementById("game-search");

    const filter =
        document.getElementById("game-filter");

    if(!searchInput && !filter){

        return;

    }


    // ==========================
    // APLICAR FILTROS
    // ==========================

    function applyFilters(){

        const search =
            searchInput
                ? searchInput.value.trim().toLowerCase()
                : "";

        const selectedFilter =
            filter
                ? filter.value
                : "all";


        const filteredGames = allGames.filter(game => {

            // ==========================
            // BUSCAR
            // ==========================

            const matchesSearch =

                game.name
                    .toLowerCase()
                    .includes(search)

                ||

                game.description
                    .toLowerCase()
                    .includes(search);


            // ==========================
            // FILTRAR ESTADO
            // ==========================

            const matchesFilter =

                selectedFilter === "all"

                ||

                game.status === selectedFilter;


            return matchesSearch && matchesFilter;

        });


        // Mostrar resultados
        renderGames(filteredGames);

    }


    // ==========================
    // EVENTO BUSCADOR
    // ==========================

    if(searchInput){

        searchInput.addEventListener("input", () => {

            applyFilters();

        });

    }


    // ==========================
    // EVENTO FILTRO
    // ==========================

    if(filter){

        filter.addEventListener("change", () => {

            applyFilters();

        });

    }

}


// ==========================
// STUDIO NEWS
// ==========================

async function loadNews(){

    const news = await RobloxAPI.getNews();

    const newsContainer =
        document.getElementById("news-container");

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


// ==============================
// SERVICE WORKER (PWA)
// ==============================

if ("serviceWorker" in navigator){

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

    if(!loader){

        return;

    }

    setTimeout(() => {

        loader.classList.add("hidden");

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
    new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if(entry.isIntersecting){

                entry.target.classList.add("active");

                observer.unobserve(entry.target);

            }

        });

    }, {

        threshold:0.15

    });


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

        if(!status){

            return;

        }


        status.textContent =
            `${data.icon} ${data.title}`;


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


        switch(data.status){

            case "operational":

                status.classList.add(
                    "status-operational"
                );

                if(statusBar){

                    statusBar.classList.add(
                        "statusbar-operational"
                    );

                }

                break;


            case "minor":

                status.classList.add(
                    "status-minor"
                );

                if(statusBar){

                    statusBar.classList.add(
                        "statusbar-minor"
                    );

                }

                break;


            case "maintenance":

                status.classList.add(
                    "status-maintenance"
                );

                if(statusBar){

                    statusBar.classList.add(
                        "statusbar-maintenance"
                    );

                }

                break;


            case "outage":

                status.classList.add(
                    "status-outage"
                );

                if(statusBar){

                    statusBar.classList.add(
                        "statusbar-outage"
                    );

                }

                break;


            default:

                status.classList.add(
                    "status-operational"
                );

                if(statusBar){

                    statusBar.classList.add(
                        "statusbar-operational"
                    );

                }

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


    if(gamesStatus){

        gamesStatus.textContent =
            `🎮 ${games.length} Games`;

    }


    if(membersStatus){

        membersStatus.textContent =
            `👥 ${Number(
                data.group.members
            ).toLocaleString()} Members`;

    }


    if(visitsStatus){

        visitsStatus.textContent =
            `🔥 ${Number(
                data.stats.totalVisits
            ).toLocaleString()} Visits`;

    }

}

loadStatusStats();


// ==========================================
// UPDATE MANAGER
// ==========================================

async function checkWebsiteUpdate(){

    const versionData =
        await RobloxAPI.getVersion();

    if(!versionData){

        return;

    }

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


    // Nueva versión

    if(savedVersion !== currentVersion){

        showUpdateBanner(versionData);

    }

}


function showUpdateBanner(versionData){

    const popup =
        document.createElement("div");

    popup.id =
        "update-center";


    popup.innerHTML = `

        <div class="update-box">

            <h2>
                🚀 ${versionData.title}
            </h2>

            <p>
                ${versionData.message}
            </p>

            <ul>

                ${versionData.changes
                    .map(change => `
                        <li>
                            ✅ ${change}
                        </li>
                    `)
                    .join("")
                }

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


    // Later

    document
        .getElementById("later-update")
        .addEventListener("click", () => {

            popup.remove();

        });


    // Update Now

    document
        .getElementById("update-now")
        .addEventListener("click", () => {

            localStorage.setItem(
                "website-version",
                versionData.version
            );

            location.reload();

        });

}


checkWebsiteUpdate();
