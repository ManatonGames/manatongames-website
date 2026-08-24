// ==========================================
// MANATON GAMES - USER PANEL
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const loginButton =
            document.getElementById(
                "login-btn"
            );


        if (!loginButton) return;


        const session =
            getSession();


        if (!session) return;


        updateLoginButton(
            loginButton,
            session
        );


        loginButton.addEventListener(
            "click",
            toggleUserMenu
        );

    }
);


// ==========================================
// UPDATE LOGIN BUTTON
// ==========================================

function updateLoginButton(
    loginButton,
    session
) {

    const username =
        session.robloxUsername ||
        session.username ||
        "Guest";


    loginButton.innerHTML = `

        <span class="user-panel-icon">
            👤
        </span>

        <span class="user-panel-username">
            ${username}
        </span>

        <span class="user-panel-arrow">
            ▼
        </span>

    `;

}


// ==========================================
// TOGGLE MENU
// ==========================================

function toggleUserMenu() {

    let menu =
        document.getElementById(
            "user-menu"
        );


    // ==========================================
    // CLOSE
    // ==========================================

    if (menu) {

        menu.remove();

        document.removeEventListener(
            "click",
            closeUserMenu
        );

        return;

    }


    const session =
        getSession();


    if (!session) return;


    // ==========================================
    // USER DATA
    // ==========================================

    const username =
        session.robloxUsername ||
        session.username ||
        "Guest";


    const avatar =
        session.robloxAvatar ||
        session.avatar ||
        "assets/logo/logo.png";


    const isRobloxLinked =
        !!session.robloxUserId;


    // ==========================================
    // ACCOUNT LABEL
    // ==========================================

    const accountLabel =
        isRobloxLinked
            ? "Roblox Account"
            : "Guest Account";


    // ==========================================
    // CREATE MENU
    // ==========================================

    menu =
        document.createElement(
            "div"
        );


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
                    ● ${accountLabel}
                </p>

            </div>

        </div>


        <!-- ==================================
             ROBLOX ACCOUNT
        ================================== -->

        <div class="user-roblox-card">

            <div class="user-roblox-card-header">

                <div class="user-roblox-icon">
                    🎮
                </div>


                <div>

                    <span>
                        Roblox
                    </span>

                    ${
                        isRobloxLinked
                            ? `
                                <strong>
                                    ${session.robloxUsername}
                                </strong>
                            `
                            : `
                                <strong>
                                    Not Linked
                                </strong>
                            `
                    }

                </div>

            </div>


            <div
                class="${
                    isRobloxLinked
                        ? "roblox-linked"
                        : "roblox-not-linked"
                }"
            >

                ${
                    isRobloxLinked
                        ? "✓ Account Linked"
                        : "Link your Roblox account"
                }

            </div>

        </div>


        <div class="user-menu-divider"></div>


        <!-- ==================================
             MY PROFILE
        ================================== -->

        <button
            id="profile-btn"
            class="user-menu-item"
        >

            <span class="user-menu-item-icon">
                👤
            </span>

            <span class="user-menu-item-text">
                My Profile
            </span>

        </button>


        <!-- ==================================
             FAVORITES
        ================================== -->

        <button
            id="favorites-btn"
            class="user-menu-item"
        >

            <span class="user-menu-item-icon">
                ⭐
            </span>

            <span class="user-menu-item-text">
                Favorites
            </span>

        </button>


        <!-- ==================================
             SETTINGS
        ================================== -->

        <button
            id="settings-btn"
            class="user-menu-item"
        >

            <span class="user-menu-item-icon">
                ⚙️
            </span>

            <span class="user-menu-item-text">
                Settings
            </span>

        </button>


        <!-- ==================================
             UPDATES
        ================================== -->

        <button
            id="updates-btn"
            class="user-menu-item"
        >

            <span class="user-menu-item-icon">
                📢
            </span>

            <span class="user-menu-item-text">
                Updates
            </span>

        </button>


        <div class="user-menu-divider"></div>


        <!-- ==================================
             LOGOUT
        ================================== -->

        <button
            id="logout-btn"
            class="user-menu-item logout-item"
        >

            <span class="user-menu-item-icon">
                🚪
            </span>

            <span class="user-menu-item-text">
                Logout
            </span>

        </button>

    `;


    document.body.appendChild(
        menu
    );


    // ==========================================
    // POSITION MENU
    // ==========================================

    const loginButton =
        document.getElementById(
            "login-btn"
        );


    if (loginButton) {

        const rect =
            loginButton.getBoundingClientRect();


        const menuWidth =
            menu.offsetWidth ||
            300;


        let left =
            rect.right -
            menuWidth;


        // Prevent overflow left

        if (left < 10) {

            left = 10;

        }


        // Prevent overflow right

        if (
            left + menuWidth >
            window.innerWidth - 10
        ) {

            left =
                window.innerWidth -
                menuWidth -
                10;

        }


        menu.style.top =
            `${rect.bottom + 10}px`;


        menu.style.left =
            `${left}px`;

    }


    // ==========================================
    // LOGOUT
    // ==========================================

    const logoutButton =
        document.getElementById(
            "logout-btn"
        );


    if (logoutButton) {

        logoutButton.onclick = () => {

            logout();

        };

    }


    // ==========================================
    // CLOSE OUTSIDE
    // ==========================================

    setTimeout(
        () => {

            document.addEventListener(
                "click",
                closeUserMenu
            );

        },
        100
    );

}


// ==========================================
// CLOSE MENU
// ==========================================

function closeUserMenu(event) {

    const menu =
        document.getElementById(
            "user-menu"
        );


    const button =
        document.getElementById(
            "login-btn"
        );


    if (!menu) return;


    if (
        menu.contains(
            event.target
        )
    ) {

        return;

    }


    if (
        button &&
        button.contains(
            event.target
        )
    ) {

        return;

    }


    menu.remove();


    document.removeEventListener(
        "click",
        closeUserMenu
    );

}
