// ==========================================
// MANATON GAMES - USER PANEL
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const loginButton =
        document.getElementById("login-btn");

    if (!loginButton) return;


    // ==========================================
    // GET SESSION
    // ==========================================

    const session = getSession();

    if (!session) return;


    // ==========================================
    // UPDATE LOGIN BUTTON
    // ==========================================

    const username =
        session.username || "Guest";

    loginButton.innerHTML = `
        <span class="user-panel-icon">👤</span>
        <span>${username}</span>
        <span class="user-panel-arrow">▼</span>
    `;


    loginButton.addEventListener(
        "click",
        toggleUserMenu
    );

});


// ==========================================
// TOGGLE USER MENU
// ==========================================

function toggleUserMenu() {

    let menu =
        document.getElementById("user-menu");


    // ==========================================
    // CLOSE IF ALREADY OPEN
    // ==========================================

    if (menu) {

        menu.remove();

        document.removeEventListener(
            "click",
            closeUserMenu
        );

        return;

    }


    // ==========================================
    // GET SESSION
    // ==========================================

    const session =
        getSession();

    if (!session) return;


    // ==========================================
    // USER DATA
    // ==========================================

    const username =
        session.username || "Guest";

    const avatar =
        session.avatar ||
        "assets/logo/logo.png";

    const loginType =
        session.loginType || "guest";


    // ==========================================
    // ROBLOX DATA
    // ==========================================

    const robloxLinked =
        !!session.robloxUserId;

    const robloxUsername =
        session.robloxUsername ||
        null;


    // ==========================================
    // CREATE MENU
    // ==========================================

    menu =
        document.createElement("div");

    menu.id =
        "user-menu";


    menu.innerHTML = `

        <!-- ==================================
             USER HEADER
        ================================== -->

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

                <p>
                    ${loginType === "guest"
                        ? "Guest Account"
                        : "Manaton Games Account"
                    }
                </p>

            </div>

        </div>


        <!-- ==================================
             ROBLOX STATUS
        ================================== -->

        <div class="user-roblox-status">

            <div class="user-roblox-icon">
                🎮
            </div>

            <div class="user-roblox-info">

                <span class="user-roblox-label">
                    Roblox
                </span>

                ${
                    robloxLinked
                    ? `
                        <strong>
                            ${robloxUsername}
                        </strong>

                        <small>
                            Account Linked
                        </small>
                    `
                    : `
                        <strong>
                            Not Linked
                        </strong>

                        <small>
                            Link your Roblox account
                        </small>
                    `
                }

            </div>

        </div>


        <hr>


        <!-- ==================================
             MENU OPTIONS
        ================================== -->

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


        <hr>


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


    // ==========================================
    // ADD TO PAGE
    // ==========================================

    document.body.appendChild(menu);


    // ==========================================
    // POSITION MENU
    // ==========================================

    const loginButton =
        document.getElementById("login-btn");

    if (loginButton) {

        const rect =
            loginButton.getBoundingClientRect();


        menu.style.top =
            `${rect.bottom + 10}px`;


        menu.style.left =
            `${Math.max(
                10,
                rect.right - 300
            )}px`;

    }


    // ==========================================
    // LOGOUT
    // ==========================================

    const logoutButton =
        document.getElementById("logout-btn");


    if (logoutButton) {

        logoutButton.onclick = () => {

            logout();

        };

    }


    // ==========================================
    // CLOSE WHEN CLICKING OUTSIDE
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

function closeUserMenu(event) {

    const menu =
        document.getElementById("user-menu");

    const button =
        document.getElementById("login-btn");


    if (!menu) return;


    // ==========================================
    // CLICK INSIDE MENU
    // ==========================================

    if (menu.contains(event.target)) {

        return;

    }


    // ==========================================
    // CLICK LOGIN BUTTON
    // ==========================================

    if (
        button &&
        button.contains(event.target)
    ) {

        return;

    }


    // ==========================================
    // REMOVE MENU
    // ==========================================

    menu.remove();


    document.removeEventListener(
        "click",
        closeUserMenu
    );

}
