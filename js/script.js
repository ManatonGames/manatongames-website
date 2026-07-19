document.addEventListener("DOMContentLoaded", async () => {

    const data = await RobloxAPI.getStats();

    if(!data){

        console.log("API Error");

        return;

    }

    console.log("Manaton Games API");

    console.log(data);

});
