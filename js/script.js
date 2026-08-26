// =====================================================
// MANATON GAMES - MAIN SCRIPT
// =====================================================


// =====================================================
// DOM CONTENT LOADED
// =====================================================

document.addEventListener("DOMContentLoaded", async () => {

    // ==========================
    // PRIVATE MODE
    // ==========================

    initializePrivateMode();


    // ==========================
    // CHECK PRIVATE ACCESS
    // ==========================

    const websiteIsPrivate =
        typeof WEBSITE_MODE !== "undefined" &&
        WEBSITE_MODE === "private";


    const ownerAccess =
        isWebsiteOwner();


    if(websiteIsPrivate && !ownerAccess){

        console.log(
            "🔒 Manaton Games está en Private Mode."
        );

        return;

    }


    if(websiteIsPrivate && ownerAccess){

        console.log(
            "👑 Owner detected. Private Mode bypass enabled."
        );

    }


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


    // ==========================
    // INICIALIZAR FAVORITES
    // ==========================

    initializeFavorites();


    // ==========================
    // CARGAR NEWS
    // ==========================

    await loadNews();


    // ==========================
    // INICIALIZAR ANIMACIONES
    // ==========================

    initializeScrollReveal();
    initializeStagger();

});


// =====================================================
// OWNER ACCESS
// =====================================================

function isWebsiteOwner(){

    // =================================================
    // OPCIÓN 1
    // =================================================

    if(
        typeof window.isOwner === "boolean"
    ){

        return window.isOwner;

    }


    // =================================================
    // OPCIÓN 2
    // =================================================

    if(
        typeof window.IS_OWNER === "boolean"
    ){

        return window.IS_OWNER;

    }


    // =================================================
    // OPCIÓN 3
    // =================================================

    if(
        typeof window.isWebsiteOwner === "boolean"
    ){

        return window.isWebsiteOwner;

    }


    // =================================================
    // OPCIÓN 4
    // Buscar información del usuario
    // =================================================

    const possibleUsers = [

        window.currentUser,
        window.currentSessionUser,
        window.sessionUser,
        window.loggedUser,
        window.user,
        window.session

    ];


    // =================================================
    // OWNER ROBLOX ID
    // =================================================

    const ownerId =
        window.OWNER_ROBLOX_ID ||
        window.MANATON_OWNER_ROBLOX_ID ||
        window.OWNER_ID ||
        window.ownerRobloxId;


    if(ownerId){

        const normalizedOwnerId =
            String(ownerId);


        for(
            const user of possibleUsers
        ){

            if(!user){

                continue;

            }


            const possibleId =
                user.robloxUserId ||
                user.robloxId ||
                user.robloxID ||
                user.userId ||
                user.id;


            if(
                possibleId &&
                String(possibleId) ===
                normalizedOwnerId
            ){

                return true;

            }

        }

    }


    // =================================================
    // REVISAR OBJETOS DE SESIÓN
    // =================================================

    for(
        const user of possibleUsers
    ){

        if(!user){

            continue;

        }


        if(
            user.isOwner === true ||
            user.owner === true ||
            user.role === "Owner" ||
            user.role === "owner"
        ){

            return true;

        }

    }


    return false;

}


// =====================================================
// MENÚ HAMBURGUESA
// =====================================================

function initializeMenu(){

    const menuToggle =
        document.getElementById(
            "menu-toggle"
        );


    const navbar =
        document.getElementById(
            "navbar"
        );


    if(!menuToggle || !navbar){

        return;

    }


    menuToggle.addEventListener(
        "click",
        () => {

            navbar.classList.toggle(
                "active"
            );

        }
    );


    document
        .querySelectorAll("#navbar a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navbar.classList.remove(
                        "active"
                    );

                }
            );

        });

}


// =====================================================
// ESTADÍSTICAS DEL STUDIO
// =====================================================

async function loadStats(){

    try{

        const data =
            await RobloxAPI.getStats();


        if(
            !data ||
            !data.stats ||
            !data.group
        ){

            console.warn(
                "⚠️ No se pudieron cargar las estadísticas."
            );

            return;

        }


        const gamesCount =
            document.getElementById(
                "games-count"
            );


        const membersCount =
            document.getElementById(
                "members-count"
            );


        const visitsCount =
            document.getElementById(
                "visits-count"
            );


        const favoritesCount =
            document.getElementById(
                "favorites-count"
            );


        // ==========================
        // GAMES
        // ==========================

        if(gamesCount){

            gamesCount.textContent =
                Number(
                    data.stats.totalGames || 0
                );

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

    try{

        // ==========================
        // OBTENER DATOS
        // ==========================

        const localGames =
            await RobloxAPI.getGames();


        const robloxData =
            await RobloxAPI.getStats();


        // ==========================
        // VALIDAR DATOS
        // ==========================

        if(
            !localGames ||
            localGames.length === 0
        ){

            console.warn(
                "⚠️ No se encontraron juegos en games.json."
            );

            return;

        }


        const robloxGames =
            robloxData?.games || [];


        // ==========================
        // COMBINAR DATOS
        // ==========================

        const games =
            localGames.map(localGame => {

                const robloxGame =
                    robloxGames.find(
                        game =>
                            String(game.id) ===
                            String(localGame.id)
                    );


                return {

                    ...localGame,

                    ...(robloxGame || {})

                };

            });


        // ==========================
        // CONTENEDOR
        // ==========================

        const container =
            document.getElementById(
                "games-container"
            );


        if(!container){

            console.warn(
                "⚠️ No se encontró #games-container."
            );

            return;

        }


        container.innerHTML = "";


        // ==========================
        // CREAR TARJETAS
        // ==========================

        games.forEach(
            (game, index) => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "game-card";


                card.dataset.gameIndex =
                    index;


                card.dataset.gameId =
                    game.id;


                // ==========================
                // IMAGEN
                // ==========================

                let gameImage =
                    "assets/images/game-placeholder.png";


                if(game.thumbnail){

                    gameImage =
                        game.thumbnail;

                }

                else if(game.image){

                    if(
                        game.image.startsWith(
                            "http://"
                        ) ||
                        game.image.startsWith(
                            "https://"
                        )
                    ){

                        gameImage =
                            game.image;

                    }

                    else{

                        gameImage =
                            `assets/games/${game.image}`;

                    }

                }


                // ==========================
                // STATUS
                // ==========================

                const released =
                    game.status === "Released";


                // ==========================
                // FAVORITE
                // ==========================

                const favorite =
                    typeof isFavorite === "function"
                        ? isFavorite(game.id)
                        : false;


                // ==========================
                // TARJETA
                // ==========================

                card.innerHTML = `

                    <img
                        src="${gameImage}"
                        alt="${game.name || "Game"}"
                        loading="lazy"
                    >

                    <div class="game-info">

                        <span
                            class="game-status ${
                                released
                                    ? "released"
                                    : "development"
                            }"
                        >

                            ${
                                released
                                    ? "🟢"
                                    : "🟡"
                            }

                            ${game.status || "Unknown"}

                        </span>


                        <h3>
                            ${game.name || "Unknown Game"}
                        </h3>


                        <p>
                            ${
                                game.description ||
                                "No description available."
                            }
                        </p>


                        <div class="game-stats">

                            <span>
                                👥
                                ${
                                    game.players ??
                                    "Coming Soon"
                                }
                            </span>


                            <span>
                                👁️
                                ${
                                    game.visits ??
                                    "Coming Soon"
                                }
                            </span>

                        </div>


                        <div class="game-card-buttons">

                            <a
                                href="https://www.roblox.com/games/${game.id}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="play-btn"
                            >
                                Play Now
                            </a>


                            <button
                                class="favorite-btn ${
                                    favorite
                                        ? "favorited"
                                        : ""
                                }"
                                data-game-id="${game.id}"
                                type="button"
                                aria-pressed="${
                                    favorite
                                        ? "true"
                                        : "false"
                                }"
                            >

                                ${
                                    favorite
                                        ? "⭐ Favorited"
                                        : "☆ Favorite"
                                }

                            </button>

                        </div>

                    </div>

                `;


                // ==========================
                // ERROR DE IMAGEN
                // ==========================

                const cardImage =
                    card.querySelector(
                        "img"
                    );


                if(cardImage){

                    cardImage.addEventListener(
                        "error",
                        () => {

                            if(
                                cardImage.src.includes(
                                    "game-placeholder.png"
                                )
                            ){

                                return;

                            }


                            cardImage.src =
                                "assets/images/game-placeholder.png";

                        }
                    );

                }


                // ==========================
                // BOTÓN FAVORITE
                // ==========================

                const favoriteButton =
                    card.querySelector(
                        ".favorite-btn"
                    );


                if(favoriteButton){

                    favoriteButton.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();
                            event.stopPropagation();


                            if(
                                typeof toggleFavorite !==
                                "function"
                            ){

                                console.error(
                                    "❌ favorites.js no está cargado."
                                );

                                return;

                            }


                            toggleFavorite(game);


                            const isNowFavorite =
                                typeof isFavorite === "function"
                                    ? isFavorite(game.id)
                                    : false;


                            updateFavoriteButton(
                                favoriteButton,
                                isNowFavorite,
                                true
                            );


                            refreshFavoriteButtons();

                        }
                    );

                }


                // ==========================
                // ABRIR MODAL
                // ==========================

                card.addEventListener(
                    "click",
                    event => {

                        if(
                            event.target.closest(
                                ".play-btn"
                            )
                        ){

                            return;

                        }


                        if(
                            event.target.closest(
                                ".favorite-btn"
                            )
                        ){

                            return;

                        }


                        openGameModal(game);

                    }
                );


                container.appendChild(
                    card
                );

            }
        );


        // ==========================
        // GUARDAR JUEGOS
        // ==========================

        window.manatonGames =
            games;


        // ==========================
        // ACTUALIZAR FAVORITES
        // ==========================

        refreshFavoriteButtons();


        console.log(
            "✅ Games loaded:",
            games
        );

    }

    catch(error){

        console.error(
            "❌ Games Error:",
            error
        );

    }

}


// =====================================================
// FAVORITES SYSTEM
// =====================================================

function initializeFavorites(){

    if(
        typeof isFavorite !== "function" ||
        typeof toggleFavorite !== "function"
    ){

        console.warn(
            "⚠️ favorites.js no está disponible."
        );

        return;

    }


    refreshFavoriteButtons();


    window.addEventListener(
        "favoritesUpdated",
        () => {

            refreshFavoriteButtons();

        }
    );


    window.addEventListener(
        "storage",
        event => {

            if(
                event.key === "mg_favorites"
            ){

                refreshFavoriteButtons();

            }

        }
    );

}


// =====================================================
// ACTUALIZAR BOTONES FAVORITE
// =====================================================

function refreshFavoriteButtons(){

    if(
        typeof isFavorite !== "function"
    ){

        return;

    }


    document
        .querySelectorAll(".favorite-btn")
        .forEach(button => {

            const gameId =
                button.dataset.gameId;


            if(!gameId){

                return;

            }


            const favorite =
                isFavorite(gameId);


            updateFavoriteButton(
                button,
                favorite
            );

        });

}


// =====================================================
// ACTUALIZAR BOTÓN FAVORITE
// =====================================================

function updateFavoriteButton(
    button,
    favorite,
    animate = false
){

    if(!button){

        return;

    }


    button.classList.toggle(
        "favorited",
        favorite
    );


    button.setAttribute(
        "aria-pressed",
        favorite
            ? "true"
            : "false"
    );


    button.textContent =
        favorite
            ? "⭐ Favorited"
            : "☆ Favorite";


    if(animate){

        button.classList.remove(
            "favorite-pop"
        );


        void button.offsetWidth;


        button.classList.add(
            "favorite-pop"
        );


        setTimeout(() => {

            button.classList.remove(
                "favorite-pop"
            );

        }, 700);

    }

}


// =====================================================
// STUDIO NEWS
// =====================================================

async function loadNews(){

    try{

        const news =
            await RobloxAPI.getNews();


        const newsContainer =
            document.getElementById(
                "news-container"
            );


        if(!newsContainer){

            return;

        }


        if(
            !news ||
            news.length === 0
        ){

            newsContainer.innerHTML = "";

            return;

        }


        newsContainer.innerHTML = "";


        news.forEach(item => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "news-card";


            card.innerHTML = `

                <div class="news-header">

                    <span class="news-category">
                        ${item.category || ""}
                    </span>


                    <span class="news-date">
                        ${item.date || ""}
                    </span>

                </div>


                <h3>
                    ${item.icon || "📰"}
                    ${item.title || ""}
                </h3>


                <p>
                    ${item.description || ""}
                </p>

            `;


            newsContainer.appendChild(
                card
            );

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
        document.getElementById(
            "game-search"
        );


    const filterSelect =
        document.getElementById(
            "game-filter"
        );


    const noGames =
        document.getElementById(
            "no-games"
        );


    if(
        !searchInput ||
        !filterSelect
    ){

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
            document.querySelectorAll(
                ".game-card"
            );


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
                card.querySelector(
                    ".game-status"
                )
                    ?.textContent
                    .trim() || "";


            const matchesSearch =
                title.includes(search) ||
                description.includes(search);


            const matchesFilter =
                filter === "all" ||
                status.includes(filter);


            if(
                matchesSearch &&
                matchesFilter
            ){

                card.style.display = "";

                visibleGames++;

            }

            else{

                card.style.display =
                    "none";

            }

        });


        if(noGames){

            noGames.style.display =
                visibleGames === 0
                    ? "block"
                    : "none";

        }

    }


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

if(
    "serviceWorker" in navigator
){

    window.addEventListener(
        "load",
        () => {

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

        }
    );

}


// =====================================================
// LOADING SCREEN
// =====================================================

window.addEventListener(
    "load",
    () => {

        const loader =
            document.getElementById(
                "loader"
            );


        if(!loader){

            return;

        }


        setTimeout(() => {

            loader.classList.add(
                "hidden"
            );


            setTimeout(() => {

                if(loader){

                    loader.remove();

                }

            }, 600);

        }, 1200);

    }
);


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

    if(
        !("IntersectionObserver" in window)
    ){

        document
            .querySelectorAll(
                ".reveal, .reveal-left, .reveal-right, .reveal-zoom, .stagger"
            )
            .forEach(element => {

                element.classList.add(
                    "active"
                );

            });


        return;

    }


    revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if(
                        entry.isIntersecting
                    ){

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
                threshold: 0.15
            }
        );


    document
        .querySelectorAll(
            ".reveal, .reveal-left, .reveal-right, .reveal-zoom, .stagger"
        )
        .forEach(element => {

            revealObserver.observe(
                element
            );

        });

}


// =====================================================
// STAGGER DELAY
// =====================================================

function initializeStagger(){

    document
        .querySelectorAll(
            ".stagger"
        )
        .forEach((element, index) => {

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
            await fetch(
                "/data/status.json",
                {
                    cache: "no-store"
                }
            );


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


        status.textContent =
            `${data.icon || "🟢"} ${data.title || "Operational"}`;


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

            if(gamesStatus){

                gamesStatus.textContent =
                    "🎮 Unavailable";

            }


            if(membersStatus){

                membersStatus.textContent =
                    "👥 Unavailable";

            }


            if(visitsStatus){

                visitsStatus.textContent =
                    "🔥 Unavailable";

            }


            return;

        }


        const games =
            data.games || [];


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


        if(!savedVersion){

            localStorage.setItem(
                "website-version",
                currentVersion
            );

            return;

        }


        if(
            savedVersion !==
            currentVersion
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

function showUpdateBanner(
    versionData
){

    if(
        document.getElementById(
            "update-center"
        )
    ){

        return;

    }


    const popup =
        document.createElement(
            "div"
        );


    popup.id =
        "update-center";


    popup.innerHTML = `

        <div class="update-box">

            <h2>
                🚀 ${versionData.title || "Website Updated"}
            </h2>


            <p>
                ${versionData.message || ""}
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


// =====================================================
// GAME DETAILS MODAL
// =====================================================

function openGameModal(game){

    if(!game){

        console.error(
            "❌ No game data was provided."
        );

        return;

    }


    let modal =
        document.getElementById(
            "game-details-modal"
        );


    // ==========================
    // CREAR MODAL
    // ==========================

    if(!modal){

        modal =
            document.createElement(
                "div"
            );


        modal.id =
            "game-details-modal";


        modal.className =
            "game-modal";


        modal.innerHTML = `

            <div class="game-modal-overlay"></div>


            <div class="game-modal-box">

                <button
                    class="close-game-modal"
                    aria-label="Close game details"
                    type="button"
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
                        ></span>


                        <h2 id="modal-game-title"></h2>

                    </div>


                    <p
                        id="modal-game-description"
                        class="game-modal-description"
                    ></p>


                    <div class="game-modal-stats">

                        <div class="modal-stat">

                            <span
                                class="modal-stat-icon"
                                aria-hidden="true"
                            >
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

                            <span
                                class="modal-stat-icon"
                                aria-hidden="true"
                            >
                                🖥️
                            </span>

                            <div>

                                <small>
                                    Max Players
                                </small>

                                <strong id="modal-game-max-players">
                                    -
                                </strong>

                            </div>

                        </div>


                        <div class="modal-stat">

                            <span
                                class="modal-stat-icon"
                                aria-hidden="true"
                            >
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

                            <span
                                class="modal-stat-icon"
                                aria-hidden="true"
                            >
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


                    <div class="game-modal-extra">

                        <div class="game-extra-item">

                            <span>
                                🎮 Genre
                            </span>

                            <strong id="modal-game-genre">
                                -
                            </strong>

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
                            🎮 Play Now
                        </a>


                        <button
                            id="modal-copy-btn"
                            class="copy-game-btn"
                            type="button"
                        >
                            📋 Copy Link
                        </button>

                    </div>


                    <button
                        id="modal-favorite-btn"
                        class="favorite-btn modal-favorite-btn"
                        type="button"
                    >
                        ☆ Favorite
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        const closeButton =
            modal.querySelector(
                ".close-game-modal"
            );


        const overlay =
            modal.querySelector(
                ".game-modal-overlay"
            );


        if(closeButton){

            closeButton.addEventListener(
                "click",
                closeGameModal
            );

        }


        if(overlay){

            overlay.addEventListener(
                "click",
                closeGameModal
            );

        }

    }


    // ==========================
    // ELEMENTOS
    // ==========================

    const image =
        modal.querySelector(
            "#modal-game-image"
        );


    const title =
        modal.querySelector(
            "#modal-game-title"
        );


    const description =
        modal.querySelector(
            "#modal-game-description"
        );


    const status =
        modal.querySelector(
            "#modal-game-status"
        );


    const players =
        modal.querySelector(
            "#modal-game-players"
        );


    const maxPlayers =
        modal.querySelector(
            "#modal-game-max-players"
        );


    const visits =
        modal.querySelector(
            "#modal-game-visits"
        );


    const favorites =
        modal.querySelector(
            "#modal-game-favorites"
        );


    const genre =
        modal.querySelector(
            "#modal-game-genre"
        );


    const update =
        modal.querySelector(
            "#modal-game-update"
        );


    const playButton =
        modal.querySelector(
            "#modal-play-btn"
        );


    const copyButton =
        modal.querySelector(
            "#modal-copy-btn"
        );


    const modalFavoriteButton =
        modal.querySelector(
            "#modal-favorite-btn"
        );


    // =================================================
    // IMAGE
    // =================================================

    if(image){

        if(game.thumbnail){

            image.src =
                game.thumbnail;

        }

        else if(game.image){

            if(
                game.image.startsWith(
                    "http://"
                ) ||
                game.image.startsWith(
                    "https://"
                )
            ){

                image.src =
                    game.image;

            }

            else{

                image.src =
                    `assets/games/${game.image}`;

            }

        }

        else{

            image.src =
                "assets/images/game-placeholder.png";

        }


        image.alt =
            game.name || "Game";


        image.onerror = () => {

            if(
                !image.src.includes(
                    "game-placeholder.png"
                )
            ){

                image.src =
                    "assets/images/game-placeholder.png";

            }

        };

    }


    // =================================================
    // TITLE
    // =================================================

    if(title){

        title.textContent =
            game.name ||
            "Unknown Game";

    }


    // =================================================
    // DESCRIPTION
    // =================================================

    if(description){

        description.textContent =
            game.description ||
            "No description available.";

    }


    // =================================================
    // STATUS
    // =================================================

    if(status){

        const released =
            game.status === "Released";


        status.textContent =
            released
                ? "🟢 Released"
                : "🟡 In Development";


        status.className =
            released
                ? "game-status released"
                : "game-status development";

    }


    // =================================================
    // PLAYERS
    // =================================================

    if(players){

        players.textContent =
            formatGameNumber(
                game.players
            );

    }


    // =================================================
    // MAX PLAYERS
    // =================================================

    if(maxPlayers){

        maxPlayers.textContent =
            formatGameNumber(
                game.maxPlayers
            );

    }


    // =================================================
    // VISITS
    // =================================================

    if(visits){

        visits.textContent =
            formatGameNumber(
                game.visits
            );

    }


    // =================================================
    // FAVORITES
    // =================================================

    if(favorites){

        favorites.textContent =
            formatGameNumber(
                game.favorites
            );

    }


    // =================================================
    // GENRE
    // =================================================

    if(genre){

        genre.textContent =
            game.genre ||
            "Unknown";

    }


    // =================================================
    // LATEST UPDATE
    // =================================================

    if(update){

        update.textContent =
            game.update ||
            "More information coming soon.";

    }


    // =================================================
    // PLAY BUTTON
    // =================================================

    if(playButton){

        if(game.id){

            playButton.href =
                `https://www.roblox.com/games/${game.id}`;


            playButton.style.display =
                "inline-flex";

        }

        else{

            playButton.href =
                "#";


            playButton.style.display =
                "none";

        }

    }


    // =================================================
    // COPY GAME LINK
    // =================================================

    if(copyButton){

        copyButton.onclick =
            async () => {

                if(!game.id){

                    return;

                }


                const gameUrl =
                    `https://www.roblox.com/games/${game.id}`;


                try{

                    await navigator.clipboard.writeText(
                        gameUrl
                    );


                    copyButton.textContent =
                        "✅ Copied!";


                    setTimeout(() => {

                        copyButton.textContent =
                            "📋 Copy Link";

                    }, 2000);

                }

                catch(error){

                    console.error(
                        "❌ Could not copy game link:",
                        error
                    );

                }

            };

    }


    // =================================================
    // MODAL FAVORITE
    // =================================================

    if(modalFavoriteButton){

        const favorite =
            typeof isFavorite === "function"
                ? isFavorite(game.id)
                : false;


        updateFavoriteButton(
            modalFavoriteButton,
            favorite
        );


        modalFavoriteButton.dataset.gameId =
            game.id;


        modalFavoriteButton.onclick =
            event => {

                event.preventDefault();
                event.stopPropagation();


                if(
                    typeof toggleFavorite !==
                    "function"
                ){

                    console.error(
                        "❌ favorites.js no está cargado."
                    );

                    return;

                }


                toggleFavorite(game);


                const isNowFavorite =
                    typeof isFavorite === "function"
                        ? isFavorite(game.id)
                        : false;


                updateFavoriteButton(
                    modalFavoriteButton,
                    isNowFavorite,
                    true
                );


                refreshFavoriteButtons();

            };

    }


    // =================================================
    // MOSTRAR MODAL
    // =================================================

    modal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


// =====================================================
// FORMATEAR NÚMEROS
// =====================================================

function formatGameNumber(value){

    if(
        value === undefined ||
        value === null ||
        value === ""
    ){

        return "Coming Soon";

    }


    if(
        typeof value === "string"
    ){

        return value;

    }


    if(
        typeof value === "number"
    ){

        return value.toLocaleString(
            "en-US"
        );

    }


    return "Coming Soon";

}


// =====================================================
// CLOSE GAME MODAL
// =====================================================

function closeGameModal(){

    const modal =
        document.getElementById(
            "game-details-modal"
        );


    if(!modal){

        return;

    }


    modal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


// =====================================================
// ESC PARA CERRAR MODAL
// =====================================================

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key !== "Escape"
        ){

            return;

        }


        const modal =
            document.getElementById(
                "game-details-modal"
            );


        if(
            modal &&
            modal.classList.contains(
                "active"
            )
        ){

            closeGameModal();

        }

    }
);


// =====================================================
// CHECK WEBSITE UPDATE
// =====================================================

checkWebsiteUpdate();
