// ==========================================
// MANATON GAMES - PROFILE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    document.addEventListener("click", (event) => {

        if (
            event.target.id !== "profile-btn" &&
            !event.target.closest("#profile-btn")
        ) {
            return;
        }

        openProfile();

    });

});


// ==========================================
// OPEN PROFILE
// ==========================================

async function openProfile() {

    if (
        document.getElementById("profile-modal")
    ) {
        return;
    }


    const session = getSession();

    if (!session) {
        return;
    }


    // ==========================================
    // USER INFORMATION
    // ==========================================

    const displayUsername =
        session.robloxUsername ||
        session.username ||
        "Guest";

    const accountType =
        session.robloxUserId
            ? "Roblox Account Linked"
            : `${session.loginType || "Guest"} Account`;


    // ==========================================
    // CREATE MODAL
    // ==========================================

    const modal =
        document.createElement("div");

    modal.id =
        "profile-modal";


    modal.innerHTML = `

        <div class="profile-card">

            <!-- ==================================
                 CLOSE
            ================================== -->

            <button
                id="close-profile"
                class="profile-close-btn"
            >
                ✕
            </button>


            <!-- ==================================
                 PROFILE HEADER
            ================================== -->

            <div class="profile-header">

                <img
                    src="${session.avatar || "assets/logo/logo.png"}"
                    class="profile-avatar"
                    alt="Profile Avatar"
                >

                <h2>
                    ${displayUsername}
                </h2>

                <p>
                    ${accountType}
                </p>

            </div>


            <!-- ==================================
                 PROFILE INFORMATION
            ================================== -->

            <div class="profile-info">


                <!-- USERNAME -->

                <div class="profile-info-item">

                    <span>
                        Username
                    </span>

                    <strong>
                        ${displayUsername}
                    </strong>

                </div>


                <!-- ACCOUNT TYPE -->

                <div class="profile-info-item">

                    <span>
                        Account Type
                    </span>

                    <strong>
                        ${session.loginType || "guest"}
                    </strong>

                </div>


                <!-- STATUS -->

                <div class="profile-info-item">

                    <span>
                        Status
                    </span>

                    <strong>
                        🟢 Online
                    </strong>

                </div>


                <!-- MANATON GAMES ROLE -->

                <div class="profile-info-item">

                    <span>
                        Manaton Games Role
                    </span>

                    <strong id="roblox-role">
                        🔄 Loading...
                    </strong>

                </div>


                <!-- ROBLOX RANK -->

                <div class="profile-info-item">

                    <span>
                        Roblox Rank
                    </span>

                    <strong id="roblox-rank">
                        🔄 Loading...
                    </strong>

                </div>


                <!-- WEBSITE VERSION -->

                <div class="profile-info-item">

                    <span>
                        Website
                    </span>

                    <strong>
                        v1.0.2
                    </strong>

                </div>

            </div>


            <!-- ==================================
                 ROBLOX ACCOUNT
            ================================== -->

            <div class="roblox-profile-section">


                <div class="roblox-profile-title">

                    <span>
                        🎮
                    </span>

                    <span>
                        Roblox Account
                    </span>

                </div>


                <!-- ACCOUNT STATUS -->

                <div
                    id="roblox-account-status"
                    class="roblox-account-status"
                >

                    ${
                        session.robloxUserId
                            ? "✅ Roblox account linked"
                            : "🔗 No Roblox account linked"
                    }

                </div>


                <!-- LINKED ACCOUNT -->

                ${
                    session.robloxUserId
                        ? `

                            <div class="roblox-linked-account">

                                <strong>
                                    ${session.robloxUsername || "Roblox User"}
                                </strong>

                                <span>
                                    ID: ${session.robloxUserId}
                                </span>

                            </div>

                        `
                        : ""
                }


                <!-- LINK BUTTON -->

                <button
                    id="link-roblox-btn"
                    class="profile-action-btn"
                >

                    ${
                        session.robloxUserId
                            ? "🔄 Change Roblox Account"
                            : "🔗 Link Roblox Account"
                    }

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    // ==========================================
    // CLOSE PROFILE
    // ==========================================

    const closeButton =
        document.getElementById(
            "close-profile"
        );


    if (closeButton) {

        closeButton.onclick = () => {

            modal.remove();

        };

    }


    // ==========================================
    // LINK ROBLOX
    // ==========================================

    const linkButton =
        document.getElementById(
            "link-roblox-btn"
        );


    if (linkButton) {

        linkButton.onclick = () => {

            openRobloxLinkModal();

        };

    }


    // ==========================================
    // LOAD ROBLOX ROLE
    // ==========================================

    loadRobloxRole(session);

}


// ==========================================
// LOAD ROBLOX ROLE
// ==========================================

async function loadRobloxRole(session) {

    const roleElement =
        document.getElementById(
            "roblox-role"
        );

    const rankElement =
        document.getElementById(
            "roblox-rank"
        );


    if (
        !roleElement ||
        !rankElement
    ) {
        return;
    }


    // ==========================================
    // NO ROBLOX ACCOUNT
    // ==========================================

    if (!session.robloxUserId) {

        roleElement.textContent =
            "Not linked";

        rankElement.textContent =
            "—";

        return;

    }


    // ==========================================
    // LOADING
    // ==========================================

    roleElement.textContent =
        "🔄 Loading...";

    rankElement.textContent =
        "🔄 Loading...";


    // ==========================================
    // REQUEST API
    // ==========================================

    try {

        const response =
            await fetch(
                `/api/roblox?userId=${encodeURIComponent(
                    session.robloxUserId
                )}`
            );


        if (!response.ok) {

            throw new Error(
                `Roblox API returned ${response.status}`
            );

        }


        const data =
            await response.json();


        if (
            !data.success ||
            !data.user
        ) {

            throw new Error(
                "Invalid Roblox profile response"
            );

        }


        // ==========================================
        // UPDATE ROLE
        // ==========================================

        roleElement.textContent =
            data.user.groupRole ||
            "Not in group";


        // ==========================================
        // UPDATE RANK
        // ==========================================

        rankElement.textContent =
            data.user.groupRank !== undefined
                ? data.user.groupRank
                : "0";


    }

    catch (error) {

        console.error(
            "❌ Failed to load Roblox role:",
            error
        );


        roleElement.textContent =
            "Unavailable";

        rankElement.textContent =
            "Unavailable";

    }

}


// ==========================================
// ROBLOX LINK MODAL
// ==========================================

function openRobloxLinkModal() {

    if (
        document.getElementById(
            "roblox-link-modal"
        )
    ) {
        return;
    }


    const modal =
        document.createElement("div");

    modal.id =
        "roblox-link-modal";


    modal.innerHTML = `

        <div class="roblox-link-card">


            <!-- ==================================
                 CLOSE
            ================================== -->

            <button
                id="close-roblox-link"
                class="roblox-close-btn"
            >
                ✕
            </button>


            <!-- ==================================
                 ICON
            ================================== -->

            <div class="roblox-link-icon">
                🎮
            </div>


            <!-- ==================================
                 TITLE
            ================================== -->

            <h2>
                Link Roblox Account
            </h2>


            <p>
                Enter your Roblox username to find
                your account.
            </p>


            <!-- ==================================
                 INPUT
            ================================== -->

            <input
                id="roblox-username-input"
                type="text"
                placeholder="Roblox username"
                autocomplete="off"
            >


            <!-- ==================================
                 SEARCH BUTTON
            ================================== -->

            <button
                id="search-roblox-btn"
                class="profile-action-btn"
            >

                🔍 Find Account

            </button>


            <!-- ==================================
                 SEARCH RESULT
            ================================== -->

            <div
                id="roblox-search-result"
                class="roblox-search-result"
            ></div>


        </div>

    `;


    document.body.appendChild(modal);


    // ==========================================
    // CLOSE
    // ==========================================

    const closeButton =
        document.getElementById(
            "close-roblox-link"
        );


    if (closeButton) {

        closeButton.onclick = () => {

            modal.remove();

        };

    }


    // ==========================================
    // SEARCH BUTTON
    // ==========================================

    const searchButton =
        document.getElementById(
            "search-roblox-btn"
        );


    if (searchButton) {

        searchButton.onclick =
            searchRobloxUser;

    }


    // ==========================================
    // ENTER KEY
    // ==========================================

    const input =
        document.getElementById(
            "roblox-username-input"
        );


    if (input) {

        input.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter"
                ) {

                    searchRobloxUser();

                }

            }
        );

    }

}


// ==========================================
// SEARCH ROBLOX USER
// ==========================================

async function searchRobloxUser() {

    const input =
        document.getElementById(
            "roblox-username-input"
        );

    const result =
        document.getElementById(
            "roblox-search-result"
        );


    if (
        !input ||
        !result
    ) {
        return;
    }


    const username =
        input.value.trim();


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!username) {

        result.innerHTML = `

            <div class="roblox-error">

                ❌ Enter a Roblox username.

            </div>

        `;

        return;

    }


    // ==========================================
    // LOADING
    // ==========================================

    result.innerHTML = `

        <div class="roblox-loading">

            🔄 Searching Roblox...

        </div>

    `;


    try {

        // ==========================================
        // ROBLOX USERNAME API
        // ==========================================

        const response =
            await fetch(
                "https://users.roblox.com/v1/usernames/users",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        usernames: [
                            username
                        ],

                        excludeBannedUsers:
                            false

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                `Roblox username API returned ${response.status}`
            );

        }


        const data =
            await response.json();


        const user =
            data.data?.[0];


        // ==========================================
        // USER NOT FOUND
        // ==========================================

        if (!user) {

            result.innerHTML = `

                <div class="roblox-error">

                    ❌ Roblox user not found.

                </div>

            `;

            return;

        }


        // ==========================================
        // SHOW ACCOUNT
        // ==========================================

        result.innerHTML = `

            <div class="roblox-found">

                <div class="roblox-found-header">

                    <div class="roblox-found-icon">
                        🎮
                    </div>

                    <div>

                        <strong>
                            ${user.name}
                        </strong>

                        <span>
                            ${user.displayName || user.name}
                        </span>

                    </div>

                </div>


                <div class="roblox-found-id">

                    User ID

                    <strong>
                        ${user.id}
                    </strong>

                </div>


                <button
                    id="confirm-roblox-btn"
                    class="profile-action-btn"
                >

                    ✅ Select This Account

                </button>

            </div>

        `;


        // ==========================================
        // CONFIRM
        // ==========================================

        const confirmButton =
            document.getElementById(
                "confirm-roblox-btn"
            );


        if (confirmButton) {

            confirmButton.onclick = () => {

                selectRobloxAccount(user);

            };

        }

    }

    catch (error) {

        console.error(
            "❌ Roblox search error:",
            error
        );


        result.innerHTML = `

            <div class="roblox-error">

                ❌ Unable to contact Roblox.

                <span>
                    Please try again in a moment.
                </span>

            </div>

        `;

    }

}


// ==========================================
// SELECT ROBLOX ACCOUNT
// ==========================================

function selectRobloxAccount(user) {

    const session =
        getSession();


    if (!session) {
        return;
    }


    // ==========================================
    // SAVE ROBLOX INFORMATION
    // ==========================================

    session.robloxUserId =
        Number(user.id);

    session.robloxUsername =
        user.name;

    session.robloxDisplayName =
        user.displayName ||
        user.name;


    // ==========================================
    // SAVE SESSION
    // ==========================================

    const saved =
        saveSession(session);


    if (!saved) {

        console.error(
            "❌ Failed to save Roblox account."
        );

        return;

    }


    // ==========================================
    // CLOSE LINK MODAL
    // ==========================================

    const linkModal =
        document.getElementById(
            "roblox-link-modal"
        );


    if (linkModal) {

        linkModal.remove();

    }


    // ==========================================
    // CLOSE PROFILE
    // ==========================================

    const profileModal =
        document.getElementById(
            "profile-modal"
        );


    if (profileModal) {

        profileModal.remove();

    }


    // ==========================================
    // REFRESH USER PANEL
    // ==========================================

    const userMenu =
        document.getElementById(
            "user-menu"
        );


    if (userMenu) {

        userMenu.remove();

    }


    // ==========================================
    // REFRESH LOGIN BUTTON
    // ==========================================

    const loginButton =
        document.getElementById(
            "login-btn"
        );


    if (loginButton) {

        loginButton.innerHTML = `

            <span class="user-panel-icon">
                👤
            </span>

            <span>
                ${session.robloxUsername}
            </span>

            <span class="user-panel-arrow">
                ▼
            </span>

        `;

    }


    // ==========================================
    // OPEN PROFILE AGAIN
    // ==========================================

    setTimeout(() => {

        openProfile();

    }, 100);

}
