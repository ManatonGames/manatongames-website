document.addEventListener("DOMContentLoaded", async () => {

    // ==========================
    // MENÚ HAMBURGUESA
    // ==========================

    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.getElementById("navbar");

    if (menuToggle && navbar) {

        menuToggle.addEventListener("click", () => {
            navbar.classList.toggle("active");
        });

        // Cerrar el menú al pulsar un enlace
        document.querySelectorAll("#navbar a").forEach(link => {
            link.addEventListener("click", () => {
                navbar.classList.remove("active");
            });
        });

    }

    // ==========================
    // API DE ROBLOX
    // ==========================

    const data = await RobloxAPI.getStats();

    if (!data) {
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

});
