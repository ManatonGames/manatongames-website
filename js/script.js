document.addEventListener("DOMContentLoaded", async () => {

    initializeMenu();

    await loadStats();

// Próximamente
// await loadGames();

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

    document.getElementById("games-count").textContent =
        data.stats.totalGames;

    document.getElementById("members-count").textContent =
        data.group.members.toLocaleString();

    document.getElementById("visits-count").textContent =
        data.stats.totalVisits.toLocaleString();

    document.getElementById("favorites-count").textContent =
        data.stats.totalFavorites.toLocaleString();

}

// ==========================
// JUEGOS
// ==========================

async function loadGames(){

    const games = await RobloxAPI.getGames();

    console.log(games);

}

// ==========================
// NOTICIAS
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
