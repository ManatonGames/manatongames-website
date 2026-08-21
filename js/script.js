document.addEventListener("DOMContentLoaded", async () => {

    // ==========================
    // INICIALIZAR
    // ==========================

    initializeMenu();
    initializeGameSearch();

    // ==========================
    // CARGAR DATOS
    // ==========================

    await loadStats();
    await loadGames();
    await loadNews();

    // ==========================
    // INICIALIZAR ANIMACIONES
    // ==========================

    initializeScrollReveal();
    initializeStagger();

});


// =====================================================
// MENÚ HAMBURGUESA
// =====================================================

function initializeMenu(){

    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.getElementById("navbar");

    if(!menuToggle || !navbar){
        return;
    }

    menuToggle.addEventListener("click", () => {

        navbar.classList.toggle("active");

    });

    document.querySelectorAll("#navbar a").forEach(link => {

        link.addEventListener("click", () => {

            navbar.classList.remove("active");

        });

    });

}


// =====================================================
// ESTADÍSTICAS DEL STUDIO
// =====================================================

async function loadStats(){

    try{

        const data = await RobloxAPI.getStats();

        if(!data || !data.stats || !data.group){

            console.warn("⚠️ No se pudieron cargar las estadísticas.");

            return;

        }

        const gamesCount =
            document.getElementById("games-count");

        const membersCount =
            document.getElementById("members-count");

        const visitsCount =
            document.getElementById("visits-count");

        const favoritesCount =
            document.getElementById("favorites-count");


        // ==========================
        // GAMES
        // ==========================

        if(gamesCount){

            gamesCount.textContent =
                Number(data.stats.totalGames || 0);

        }


        // ==========================
        // MEMBERS
        // ==========================

        if(membersCount){

            membersCount.textContent =
                Number(
                    data.group.members || 0
                ).toLocaleString();

        }


        // ==========================
        // VISITS
        // ==========================

        if(visitsCount){

            visitsCount.textContent =
                Number(
                    data.stats.totalVisits || 0
                ).toLocaleString();

        }


        // ==========================
        // FAVORITES
        // ==========================

        if(favoritesCount){

            favoritesCount.textContent =
                Number(
                    data.stats.totalFavorites || 0
                ).toLocaleString();

        }

    }

    catch(error){

        console.error(
            "❌ Stats Error:",
            error
        );

    }

}


// =====================================================
// OUR GAMES
// =====================================================

async function loadGames(){

    const games = await RobloxAPI.getGames();

    const container = document.getElementById("games-container");

    if(!container || !games || games.length === 0){

        return;

    }

    container.innerHTML = "";

    games.forEach((game, index) => {

        const card = document.createElement("div");

        card.className = "game-card";

        card.dataset.gameIndex = index;

        card.innerHTML = `

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

        `;

        // Abrir modal al hacer click en la tarjeta
        card.addEventListener("click", (event) => {

            // Si hizo click directamente en Play Now,
            // dejamos que el enlace funcione normalmente.
            if(event.target.closest(".play-btn")){

                return;

            }

            openGameModal(game);

        });

        container.appendChild(card);

    });

    // Guardar juegos para el buscador/modal
    window.manatonGames = games;

}


// =====================================================
// STUDIO NEWS
// =====================================================

async function loadNews(){

    try{

        const news =
            await RobloxAPI.getNews();

        const newsContainer =
            document.getElementById("news-container");

        if(!newsContainer){

            return;

        }

        if(!news || news.length === 0){

            newsContainer.innerHTML = "";

            return;

        }

        newsContainer.innerHTML = "";

        news.forEach(item => {

            const card =
                document.createElement("div");

            card.className =
                "news-card";

            card.innerHTML = `

                <div class="news-header">

                    <span class="news-category">

                        ${item.category}

                    </span>

                    <span class="news-date">

                        ${item.date}

                    </span>

                </div>

                <h3>

                    ${item.icon || "📰"}
                    ${item.title}

                </h3>

                <p>

                    ${item.description}

                </p>

            `;

            newsContainer.appendChild(card);

        });

    }

    catch(error){

        console.error(
            "❌ News Error:",
            error
        );

    }

}


// =====================================================
// BUSCADOR + FILTRO DE JUEGOS
// =====================================================

function initializeGameSearch(){

    const searchInput =
        document.getElementById("game-search");

    const filterSelect =
        document.getElementById("game-filter");

    const noGames =
        document.getElementById("no-games");

    if(!searchInput || !filterSelect){

        return;

    }


    function filterGames(){

        const search =
            searchInput.value
                .toLowerCase()
                .trim();

        const filter =
            filterSelect.value;

        const cards =
            document.querySelectorAll(".game-card");

        let visibleGames = 0;


        cards.forEach(card => {

            const title =
                card.querySelector("h3")
                    ?.textContent
                    .toLowerCase() || "";

            const description =
                card.querySelector("p")
                    ?.textContent
                    .toLowerCase() || "";

            const status =
                card.querySelector(".game-status")
                    ?.textContent
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
            // MOSTRAR / OCULTAR
            // ==========================

            if(
                matchesSearch &&
                matchesFilter
            ){

                card.style.display = "";

                visibleGames++;

            }

            else{

                card.style.display = "none";

            }

        });


        // ==========================
        // NO GAMES FOUND
        // ==========================

        if(noGames){

            noGames.style.display =
                visibleGames === 0
                    ? "block"
                    : "none";

        }

    }


    // ==========================
    // EVENTOS
    // ==========================

    searchInput.addEventListener(
        "input",
        filterGames
    );

    filterSelect.addEventListener(
        "change",
        filterGames
    );

}


// =====================================================
// SERVICE WORKER / PWA
// =====================================================

if("serviceWorker" in navigator){

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("/sw.js")

            .then(() => {

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


// =====================================================
// LOADING SCREEN
// =====================================================

window.addEventListener("load", () => {

    const loader =
        document.getElementById("loader");

    if(!loader){

        return;

    }

    setTimeout(() => {

        loader.classList.add("hidden");

        setTimeout(() => {

            if(loader){

                loader.remove();

            }

        }, 600);

    }, 1200);

});


// =====================================================
// WEBSITE VERSION
// =====================================================

function initializeWebsiteVersion(){

    const versionElement =
        document.getElementById(
            "website-version"
        );

    if(
        versionElement &&
        typeof APP_VERSION !== "undefined"
    ){

        versionElement.textContent =
            `Website Version v${APP_VERSION}`;

    }

}

initializeWebsiteVersion();


// =====================================================
// SCROLL REVEAL
// =====================================================

let revealObserver = null;


function initializeScrollReveal(){

    if(!("IntersectionObserver" in window)){

        document.querySelectorAll(
            ".reveal, .reveal-left, .reveal-right, .reveal-zoom, .stagger"
        ).forEach(element => {

            element.classList.add("active");

        });

        return;

    }


    revealObserver =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if(entry.isIntersecting){

                        entry.target.classList.add(
                            "active"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold:0.15
            }

        );


    document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-zoom, .stagger"
    ).forEach(element => {

        revealObserver.observe(element);

    });

}


// =====================================================
// STAGGER DELAY
// =====================================================

function initializeStagger(){

    document.querySelectorAll(
        ".stagger"
    ).forEach((element, index) => {

        element.style.transitionDelay =
            `${index * 0.08}s`;

    });

}


// =====================================================
// SYSTEM STATUS
// =====================================================

async function loadSystemStatus(){

    try{

        const response =
            await fetch("/data/status.json");

        if(!response.ok){

            throw new Error(
                `HTTP ${response.status}`
            );

        }

        const data =
            await response.json();

        const status =
            document.getElementById(
                "system-status"
            );

        const statusBar =
            document.getElementById(
                "status-bar"
            );

        if(!status){

            return;

        }


        // ==========================
        // TEXTO
        // ==========================

        status.textContent =
            `${data.icon} ${data.title}`;


        // ==========================
        // LIMPIAR CLASES
        // ==========================

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


        // ==========================
        // APLICAR ESTADO
        // ==========================

        switch(data.status){

            case "operational":

                status.classList.add(
                    "status-operational"
                );

                statusBar?.classList.add(
                    "statusbar-operational"
                );

                break;


            case "minor":

                status.classList.add(
                    "status-minor"
                );

                statusBar?.classList.add(
                    "statusbar-minor"
                );

                break;


            case "maintenance":

                status.classList.add(
                    "status-maintenance"
                );

                statusBar?.classList.add(
                    "statusbar-maintenance"
                );

                break;


            case "outage":

                status.classList.add(
                    "status-outage"
                );

                statusBar?.classList.add(
                    "statusbar-outage"
                );

                break;


            default:

                status.classList.add(
                    "status-operational"
                );

                statusBar?.classList.add(
                    "statusbar-operational"
                );

        }

    }

    catch(error){

        console.error(
            "❌ Status Error:",
            error
        );

    }

}

loadSystemStatus();


// =====================================================
// STATUS BAR LIVE STATS
// =====================================================

async function loadStatusStats(){

    try{

        const data =
            await RobloxAPI.getStats();

        const gamesStatus =
            document.getElementById(
                "games-status"
            );

        const membersStatus =
            document.getElementById(
                "members-status"
            );

        const visitsStatus =
            document.getElementById(
                "visits-status"
            );


        if(
            !data ||
            !data.success
        ){

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
                `👥 ${
                    Number(
                        data.group.members || 0
                    ).toLocaleString()
                } Members`;

        }


        if(visitsStatus){

            visitsStatus.textContent =
                `🔥 ${
                    Number(
                        data.stats.totalVisits || 0
                    ).toLocaleString()
                } Visits`;

        }

    }

    catch(error){

        console.error(
            "❌ Status Stats Error:",
            error
        );

    }

}

loadStatusStats();


// =====================================================
// UPDATE MANAGER
// =====================================================

async function checkWebsiteUpdate(){

    try{

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


        // ==========================
        // PRIMERA VISITA
        // ==========================

        if(!savedVersion){

            localStorage.setItem(
                "website-version",
                currentVersion
            );

            return;

        }


        // ==========================
        // NUEVA VERSIÓN
        // ==========================

        if(
            savedVersion !== currentVersion
        ){

            showUpdateBanner(
                versionData
            );

        }

    }

    catch(error){

        console.error(
            "❌ Update Manager Error:",
            error
        );

    }

}


// =====================================================
// UPDATE BANNER
// =====================================================

function showUpdateBanner(versionData){

    // Evitar duplicados

    if(
        document.getElementById(
            "update-center"
        )
    ){

        return;

    }


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

                ${
                    (versionData.changes || [])
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


    document.body.appendChild(
        popup
    );


    // ==========================
    // LATER
    // ==========================

    const laterButton =
        document.getElementById(
            "later-update"
        );

    if(laterButton){

        laterButton.addEventListener(
            "click",
            () => {

                popup.remove();

            }
        );

    }


    // ==========================
    // UPDATE NOW
    // ==========================

    const updateButton =
        document.getElementById(
            "update-now"
        );

    if(updateButton){

        updateButton.addEventListener(
            "click",
            () => {

                localStorage.setItem(
                    "website-version",
                    versionData.version
                );

                location.reload();

            }
        );

    }

}


// Ejecutar Update Manager

// ==========================================
// GAME DETAILS MODAL
// ==========================================

function openGameModal(game){

    let modal = document.getElementById("game-details-modal");

    // Crear modal si todavía no existe
    if(!modal){

        modal = document.createElement("div");

        modal.id = "game-details-modal";

        modal.className = "game-modal";

        modal.innerHTML = `

            <div class="game-modal-overlay"></div>

            <div class="game-modal-box">

                <button
                    class="close-game-modal"
                    aria-label="Close"
                >
                    ✕
                </button>

                <div class="game-modal-image">

                    <img
                        id="modal-game-image"
                        src=""
                        alt=""
                    >

                </div>

                <div class="game-modal-content">

                    <div class="game-modal-header">

                        <span
                            id="modal-game-status"
                            class="game-status"
                        >
                        </span>

                        <h2 id="modal-game-title"></h2>

                    </div>

                    <p
                        id="modal-game-description"
                        class="game-modal-description"
                    >
                    </p>

                    <div class="game-modal-stats">

                        <div class="modal-stat">

                            <span class="modal-stat-icon">
                                👥
                            </span>

                            <div>

                                <small>
                                    Players
                                </small>

                                <strong id="modal-game-players">
                                    -
                                </strong>

                            </div>

                        </div>

                        <div class="modal-stat">

                            <span class="modal-stat-icon">
                                👁️
                            </span>

                            <div>

                                <small>
                                    Visits
                                </small>

                                <strong id="modal-game-visits">
                                    -
                                </strong>

                            </div>

                        </div>

                        <div class="modal-stat">

                            <span class="modal-stat-icon">
                                ⭐
                            </span>

                            <div>

                                <small>
                                    Favorites
                                </small>

                                <strong id="modal-game-favorites">
                                    -
                                </strong>

                            </div>

                        </div>

                    </div>

                    <div class="game-modal-update">

                        <h3>
                            📢 Latest Update
                        </h3>

                        <p id="modal-game-update">
                            More information coming soon.
                        </p>

                    </div>

                    <div class="game-modal-buttons">

                        <a
                            id="modal-play-btn"
                            class="play-btn"
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Play Now
                        </a>

                    </div>

                </div>

            </div>

        `;

        document.body.appendChild(modal);

        // ==========================
        // CERRAR MODAL
        // ==========================

        const closeButton =
            modal.querySelector(".close-game-modal");

        const overlay =
            modal.querySelector(".game-modal-overlay");

        closeButton.addEventListener(
            "click",
            closeGameModal
        );

        overlay.addEventListener(
            "click",
            closeGameModal
        );

    }

    // ==========================
    // IMAGEN
    // ==========================

    const image =
        document.getElementById("modal-game-image");

    if(image){

        image.src =
            `assets/games/${game.image}`;

        image.alt =
            game.name;

    }

    // ==========================
    // TÍTULO
    // ==========================

    const title =
        document.getElementById("modal-game-title");

    if(title){

        title.textContent =
            game.name;

    }

    // ==========================
    // DESCRIPCIÓN
    // ==========================

    const description =
        document.getElementById(
            "modal-game-description"
        );

    if(description){

        description.textContent =
            game.description ||
            "No description available.";

    }

    // ==========================
    // STATUS
    // ==========================

    const status =
        document.getElementById(
            "modal-game-status"
        );

    if(status){

        const released =
            game.status === "Released";

        status.textContent =
            released
                ? "🟢 Released"
                : "🟡 In Development";

        status.className =
            `game-status ${
                released
                    ? "released"
                    : "development"
            }`;

    }

    // ==========================
    // PLAYERS
    // ==========================

    const players =
        document.getElementById(
            "modal-game-players"
        );

    if(players){

        players.textContent =
            game.players || "Coming Soon";

    }

    // ==========================
    // VISITS
    // ==========================

    const visits =
        document.getElementById(
            "modal-game-visits"
        );

    if(visits){

        visits.textContent =
            game.visits || "Coming Soon";

    }

    // ==========================
    // FAVORITES
    // ==========================

    const favorites =
        document.getElementById(
            "modal-game-favorites"
        );

    if(favorites){

        favorites.textContent =
            game.favorites || "Coming Soon";

    }

    // ==========================
    // UPDATE
    // ==========================

    const update =
        document.getElementById(
            "modal-game-update"
        );

    if(update){

        update.textContent =
            game.update ||
            "More information coming soon.";

    }

    // ==========================
    // PLAY BUTTON
    // ==========================

    const playButton =
        document.getElementById(
            "modal-play-btn"
        );

    if(playButton){

        playButton.href =
            `https://www.roblox.com/games/${game.id}`;

    }

    // ==========================
    // MOSTRAR MODAL
    // ==========================

    modal.classList.add("active");

    document.body.style.overflow = "hidden";

}


// ==========================================
// CLOSE GAME MODAL
// ==========================================

function closeGameModal(){

    const modal =
        document.getElementById(
            "game-details-modal"
        );

    if(!modal){

        return;

    }

    modal.classList.remove("active");

    document.body.style.overflow = "";

}


// ==========================================
// ESC PARA CERRAR
// ==========================================

document.addEventListener(
    "keydown",
    (event) => {

        if(event.key === "Escape"){

            closeGameModal();

        }

    }
);

checkWebsiteUpdate();
