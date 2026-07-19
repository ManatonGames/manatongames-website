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

/* ===========================
   HEADER EFFECT
=========================== */

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

    if(window.scrollY > 30){

        header.classList.add("scrolled");

    }else{

        header.classList.remove("scrolled");

    }

});
