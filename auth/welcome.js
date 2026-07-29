document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("welcome-container");

    const response = await fetch("components/welcome.html");

    container.innerHTML = await response.text();

});
