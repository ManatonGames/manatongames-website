// ==========================================
// MANATON GAMES - USER PANEL
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const loginButton =
        document.getElementById("login-btn");


    if(!loginButton) return;


    const session =
        getSession();


    if(!session) return;


    // ==========================================
    // LOGIN BUTTON
    // ==========================================

    loginButton.innerHTML =
        `👤 ${session.username} ▼`;


    loginButton.addEventListener(
        "click",
        toggleUserMenu
    );

});


// ==========================================
// TOGGLE USER MENU
// ==========================================

function toggleUserMenu(){

    let menu =
        document.getElementById("user-menu");


    // ==========================================
    // CLOSE
    // ==========================================

    if(menu){

        menu.remove();

        document.removeEventListener(
            "click",
            closeUserMenu
        );

        return;

    }


    // ==========================================
    // SESSION
    // ==========================================

    const session =
        getSession();


    if(!session) return;


    // ==========================================
    // USER DATA
    // ==========================================

    const username =
        session.username || "Guest";

    const avatar =
        session.avatar ||
        "assets/logo/logo.png";

    const loginType =
        session.loginType ||
        "Guest";

    const robloxUsername =
        session.robloxUsername ||
        null;

    const robloxRole =
        session.robloxRole ||
        null;


    // ==========================================
    // ROLE DISPLAY
    // ==========================================

    let robloxRoleHTML = "";

    if(robloxUsername){

        robloxRoleHTML = `

            <div class="user-roblox-role">

                🎮 ${robloxUsername}

                ${
                    robloxRole
                    ? `<span>${robloxRole}</span>`
                    : ""
                }

            </div>

        `;

    }
    else{

        robloxRoleHTML = `

            <div class="user-roblox-role">

                🔗 Roblox not linked

            </div>

        `;

    }


    // ==========================================
    // CREATE MENU
    // ==========================================

    menu =
        document.createElement("div");

    menu.id =
        "user-menu";


    menu.innerHTML = `

        <div class="user-header">

            <img
                src="${avatar}"
                class="user-avatar"
                alt="User Avatar"
            >

            <div>

                <strong>
                    ${username}
                </strong>

                <p>
                    Logged in as ${loginType}
                </p>

            </div>

        </div>


        ${robloxRoleHTML}


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


    // ==========================================
    // POSITION
    // ==========================================

    const loginButton =
        document.getElementById("login-btn");


    const rect =
        loginButton.getBoundingClientRect();


    menu.style.top =
        rect.bottom + 10 + "px";


    menu.style.left =
        rect.right - 220 + "px";


    // ==========================================
    // LOGOUT
    // ==========================================

    document
        .getElementById("logout-btn")
        .onclick = () => {

            logout();

        };


    // ==========================================
    // CLOSE OUTSIDE
    // ==========================================

    setTimeout(() => {

        document.addEventListener(
            "click",
            closeUserMenu
        );

    }, 100);

}


// ==========================================
// CLOSE USER MENU
// ==========================================

function closeUserMenu(event){

    const menu =
        document.getElementById("user-menu");

    const button =
        document.getElementById("login-btn");


    if(!menu) return;


    if(
        menu.contains(event.target) ||
        button?.contains(event.target)
    ){

        return;

    }


    menu.remove();


    document.removeEventListener(
        "click",
        closeUserMenu
    );

}
