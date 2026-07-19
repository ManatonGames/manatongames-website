document.addEventListener("DOMContentLoaded", async () => {

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

});
