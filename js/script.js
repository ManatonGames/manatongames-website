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
