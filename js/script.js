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

    try{

        const games =
            await RobloxAPI.getGames();

        const container =
            document.getElementById("games-container");

        if(!container){

            return;

        }

        if(!games || games.length === 0){

            container.innerHTML = "";

            const noGames =
                document.getElementById("no-games");

            if(noGames){
                noGames.style.display = "block";
            }

            return;

        }

        container.innerHTML = "";

        games.forEach(game => {

            // ==========================
            // ESTADO DEL JUEGO
            // ==========================

            const isReleased =
                game.status === "Released";

            const statusClass =
                isReleased
                    ? "released"
                    : "development";

            const statusIcon =
                isReleased
                    ? "🟢"
                    : "🟡";


            // ==========================
            // CREAR TARJETA
            // ==========================

            const card =
                document.createElement("div");

            card.className =
                "game-card";


            // ==========================
            // CONTENIDO
            // ==========================

            card.innerHTML = `

                <img
                    src="assets/games/${game.image}"
                    alt="${game.name}"
                    loading="lazy"
                >

                <div class="game-info">

                    <span class="game-status ${statusClass}">

                        ${statusIcon}
                        ${game.status}

                    </span>

                    <h3>
                        ${game.name}
                    </h3>

                    <p>
                        ${game.description}
                    </p>

                    <div class="game-stats">

                        <span>
                            👥 ${game.players || "Coming Soon"}
                        </span>

                        <span>
                            👁️ ${game.visits || "Coming Soon"}
                        </span>

                    </div>

                    <a
                        href="https://www.roblox.com/games/${game.id}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="play-btn"
                    >

                        ▶ Play Now

                    </a>

                </div>

            `;


            // ==========================
            // AGREGAR TARJETA
            // ==========================

            container.appendChild(card);

        });


        // ==========================
        // OCULTAR NO GAMES
        // ==========================

        const noGames =
            document.getElementById("no-games");

        if(noGames){

            noGames.style.display = "none";

        }

        // ==========================
        // APLICAR REVEAL A LAS TARJETAS
        // ==========================

        initializeGameCardAnimations();

    }

    catch(error){

        console.error(
            "❌ Games Error:",
            error
        );

    }

}


// =====================================================
// ANIMACIÓN DE TARJETAS DE JUEGOS
// =====================================================

function initializeGameCardAnimations(){

    const cards =
        document.querySelectorAll(".game-card");

    cards.forEach((card, index) => {

        card.classList.add("stagger");

        card.style.transitionDelay =
            `${index * 0.08}s`;

        if(
            typeof revealObserver !== "undefined" &&
            revealObserver
        ){

            revealObserver.observe(card);

        }

    });

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

checkWebsiteUpdate();
