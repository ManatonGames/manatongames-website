document.addEventListener("DOMContentLoaded", () => {

    const loginButton = document.getElementById("login-btn");

    if (!loginButton) return;

    const session =
        JSON.parse(localStorage.getItem("mg_session"));

    if (!session) return;

    loginButton.innerHTML =
        `👤 ${session.username} ▼`;

    loginButton.addEventListener("click", toggleUserMenu);

});

function toggleUserMenu() {

    let menu = document.getElementById("user-menu");

    if (menu) {

        menu.remove();

        return;

    }

    menu = document.createElement("div");

    menu.id = "user-menu";

    menu.innerHTML = `

        <div class="user-header">

            <img
                src="assets/logo/logo.png"
                class="user-avatar"
            >

            <div>

                <strong>Guest</strong>

                <p>Logged in as Guest</p>

            </div>

        </div>

        <hr>

        <button id="profile-btn">
            👤 My Profile
        </button>

        <button id="favorites-btn">
            ⭐ Favorites
        </button>

        <button id="settings-btn">
            ⚙️ Settings
        </button>

        <button id="updates-btn">
            📢 Updates
        </button>

        <button id="logout-btn">
            🚪 Logout
        </button>

    `;

    document.body.appendChild(menu);
    
    setTimeout(() => {

    document.addEventListener("click", closeUserMenu);

},100);

    const loginButton =
        document.getElementById("login-btn");

    const rect =
        loginButton.getBoundingClientRect();

    menu.style.top =
        rect.bottom + 10 + "px";

    menu.style.left =
        rect.right - 220 + "px";

    document
        .getElementById("logout-btn")
        .onclick = () => {

            localStorage.removeItem("mg_session");

            location.reload();

        };

}

function closeUserMenu(event){

    const menu =
        document.getElementById("user-menu");

    const button =
        document.getElementById("login-btn");

    if(!menu) return;

    if(
        menu.contains(event.target) ||
        button.contains(event.target)
    ){

        return;

    }

    menu.remove();

    document.removeEventListener(
        "click",
        closeUserMenu
    );

}
