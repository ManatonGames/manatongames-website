document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);

    const gameId = Number(params.get("id"));

    if(!gameId){

        document.getElementById("game-title").textContent = "Game not found";

        return;

    }

    const games = await RobloxAPI.getGames();

    const game = games.find(g => g.id === gameId);

    if(!game){

        document.getElementById("game-title").textContent = "Game not found";

        return;

    }

    loadGame(game);

});

function loadGame(game){

    document.title = game.name + " | Manaton Games";

    document.getElementById("game-title").textContent =
        game.name;

    document.getElementById("game-description").textContent =
        game.description;

    document.getElementById("game-status").textContent =
        "🟢 " + game.status;

    document.getElementById("game-image").src =
        "../assets/games/" + game.image;

    document.getElementById("play-button").href =
        "https://www.roblox.com/games/" + game.id;

}
