// ==========================================
// GAME PAGE
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);

    const gameId = Number(params.get("id"));

    if (!gameId) {

        showError("Game not found.");

        return;

    }

    try {

        const games = await RobloxAPI.getGames();

        const game = games.find(g => g.id === gameId);

        if (!game) {

            showError("Game not found.");

            return;

        }

        loadGame(game);

    }

    catch (error) {

        console.error(error);

        showError("Failed to load game.");

    }

});

// ==========================================
// LOAD GAME
// ==========================================

function loadGame(game) {

    document.title = `${game.name} | Manaton Games`;

    // ----------------------------------
    // Banner
    // ----------------------------------

    document.getElementById("game-image").src =
        "../assets/games/" + game.image;

    document.getElementById("game-image").alt =
        game.name;

    // ----------------------------------
    // Main Info
    // ----------------------------------

    document.getElementById("game-title").textContent =
        game.name;

    document.getElementById("game-description").textContent =
        game.description;

    // ----------------------------------
    // Status
    // ----------------------------------

    const statusElement =
        document.getElementById("game-status");

    const statusText =
        document.getElementById("game-status-text");

    let icon = "🟢";
    let cssClass = "released";

    switch (game.status) {

        case "Released":

            icon = "🟢";
            cssClass = "released";
            break;

        case "In Development":

            icon = "🟡";
            cssClass = "development";
            break;

        case "Coming Soon":

            icon = "🔵";
            cssClass = "coming";
            break;

    }

    statusElement.className =
        "game-status " + cssClass;

    statusElement.textContent =
        `${icon} ${game.status}`;

    statusText.textContent =
        game.status;

    // ----------------------------------
    // Details
    // ----------------------------------

    document.getElementById("game-id").textContent =
        game.id;

    document.getElementById("game-genre").textContent =
        game.genre || "Unknown";

    document.getElementById("game-maxplayers").textContent =
        game.maxPlayers || "Coming Soon";

    // ----------------------------------
    // Statistics
    // ----------------------------------

    document.getElementById("game-players").textContent =
        "👥 " + (game.players || "Coming Soon");

    document.getElementById("game-visits").textContent =
        "👁️ " + (game.visits || "Coming Soon");

    // ----------------------------------
    // Update
    // ----------------------------------

    document.getElementById("game-update").textContent =
        game.update || "No updates available.";

    // ----------------------------------
    // Screenshots
    // ----------------------------------

    const gallery =
        document.getElementById("game-screenshots");

    gallery.innerHTML = "";

    if (game.screenshots && game.screenshots.length > 0) {

        game.screenshots.forEach(image => {

            gallery.innerHTML += `

                <img
                    src="../assets/games/${image}"
                    alt="${game.name}"
                    loading="lazy"
                >

            `;

        });

    }

    else {

        gallery.innerHTML = `

            <p>No screenshots available.</p>

        `;

    }

    // ----------------------------------
    // Roblox Button
    // ----------------------------------

    document.getElementById("play-button").href =
        `https://www.roblox.com/games/${game.id}`;

}

// ==========================================
// ERROR
// ==========================================

function showError(message) {

    document.title = "Game | Manaton Games";

    document.getElementById("game-title").textContent =
        message;

}
