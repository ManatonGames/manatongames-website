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

    loginButton.innerHTML = `
        <span class="user-panel-icon">👤</span>
        <span class="user-panel-name">
            ${session.username || "Guest"}
        </span>
        <span class="user-panel-arrow">▼</span>
    `;

    loginButton.classList.add(
        "mg-user-panel-button"
    );

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

    if(menu){

        menu.remove();

        document.removeEventListener(
            "click",
            closeUserMenu
        );

        return;

    }


    const session =
        getSession();

    if(!session) return;


    const username =
        session.username || "Guest";

    const avatar =
        session.avatar ||
        "assets/logo/logo.png";


    // ==========================================
    // ROBLOX INFORMATION
    // ==========================================

    let robloxHTML = "";


    if(session.robloxUserId){

        robloxHTML = `

            <div class="user-roblox-info">

                <div class="user-roblox-icon">
                    🎮
                </div>

                <div class="user-roblox-data">

                    <strong>
                        ${session.robloxUsername || "Roblox Account"}
                    </strong>

                    <span>
                        ${
                            session.robloxRole ||
                            "Roblox account linked"
                        }
                    </span>

                </div>

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

            <div class="user-header-info">

                <strong>
                    ${username}
                </strong>

                <span>
                    ${
                        session.loginType === "guest"
                        ? "Guest Account"
                        : `${session.loginType || "Account"}`
                    }
                </span>

            </div>

        </div>


        ${
            robloxHTML
        }


        <div class="user-menu-divider"></div>


        <button
            id="profile-btn"
            class="user-menu-item"
        >

            <span>👤</span>

            <span>
                My Profile
            </span>

        </button>


        <button
            id="favorites-btn"
            class="user-menu-item"
        >

            <span>⭐</span>

            <span>
                Favorites
            </span>

        </button>


        <button
            id="settings-btn"
            class="user-menu-item"
        >

            <span>⚙️</span>

            <span>
                Settings
            </span>

        </button>


        <button
            id="updates-btn"
            class="user-menu-item"
        >

            <span>📢</span>

            <span>
                Updates
            </span>

        </button>


        <div class="user-menu-divider"></div>


        <button
            id="logout-btn"
            class="user-menu-item logout-item"
        >

            <span>🚪</span>

            <span>
                Logout
            </span>

        </button>

    `;


    document.body.appendChild(menu);


    // ==========================================
    // POSITION MENU
    // ==========================================

    const loginButton =
        document.getElementById("login-btn");

    const rect =
        loginButton.getBoundingClientRect();


    menu.style.top =
        `${rect.bottom + 10}px`;


    menu.style.left =
        `${Math.max(
            10,
            rect.right - 250
        )}px`;


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
