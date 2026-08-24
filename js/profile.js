// ==========================================
// MANATON GAMES - PROFILE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document.addEventListener(
            "click",
            (event) => {

                if (
                    event.target.id !== "profile-btn" &&
                    !event.target.closest("#profile-btn")
                ) {

                    return;

                }

                openProfile();

            }
        );

    }
);


// ==========================================
// OPEN PROFILE
// ==========================================

async function openProfile() {

    if (
        document.getElementById(
            "profile-modal"
        )
    ) {

        return;

    }


    const session =
        getSession();


    if (!session) return;


    // ==========================================
    // DISPLAY NAME
    // ==========================================

    const displayUsername =
        session.robloxUsername ||
        session.username ||
        "Guest";


    // ==========================================
    // ACCOUNT TYPE
    // ==========================================

    const accountType =
        session.robloxUserId
            ? "Roblox Linked"
            : "Guest Account";


    // ==========================================
    // AVATAR
    // ==========================================

    const avatar =
        session.robloxAvatar ||
        session.avatar ||
        "assets/logo/logo.png";


    // ==========================================
    // CREATE MODAL
    // ==========================================

    const modal =
        document.createElement("div");


    modal.id =
        "profile-modal";


    modal.innerHTML = `

        <div class="profile-card">

            <!-- CLOSE -->

            <button
                id="close-profile"
                class="profile-close-btn"
            >
                ✕
            </button>


            <!-- PROFILE HEADER -->

            <div class="profile-header">

                <img
                    src="${avatar}"
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


            <!-- PROFILE INFORMATION -->

            <div class="profile-info">

                <div class="profile-info-item">

                    <span>
                        Username
                    </span>

                    <strong>
                        ${displayUsername}
                    </strong>

                </div>


                <div class="profile-info-item">

                    <span>
                        Account Type
                    </span>

                    <strong>
                        ${accountType}
                    </strong>

                </div>


                <div class="profile-info-item">

                    <span>
                        Status
                    </span>

                    <strong>
                        🟢 Online
                    </strong>

                </div>


                <div class="profile-info-item">

                    <span>
                        Manaton Games Role
                    </span>

                    <strong id="roblox-role">
                        🔄 Loading...
                    </strong>

                </div>


                <div class="profile-info-item">

                    <span>
                        Roblox Rank
                    </span>

                    <strong id="roblox-rank">
                        🔄 Loading...
                    </strong>

                </div>


                <div class="profile-info-item">

                    <span>
                        Website
                    </span>

                    <strong>
                        v1.0.2
                    </strong>

                </div>

            </div>


            <!-- ROBLOX ACCOUNT -->

            <div class="roblox-profile-section">

                <div class="roblox-profile-title">

                    <span>
                        🎮
                    </span>

                    <span>
                        Roblox Account
                    </span>

                </div>


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


                ${
                    session.robloxUserId
                        ? `

                            <div class="roblox-linked-account">

                                <img
                                    src="${
                                        session.robloxAvatar ||
                                        "assets/logo/logo.png"
                                    }"
                                    class="roblox-mini-avatar"
                                    alt="Roblox Avatar"
                                >

                                <div>

                                    <strong>
                                        ${
                                            session.robloxUsername ||
                                            "Roblox User"
                                        }
                                    </strong>

                                    <span>
                                        ID: ${session.robloxUserId}
                                    </span>

                                </div>

                            </div>

                        `
                        : ""
                }


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


    document.body.appendChild(
        modal
    );


    // ==========================================
    // CLOSE
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
    // LOAD ROBLOX DATA
    // ==========================================

    loadRobloxRole(
        session
    );

}


// ==========================================
// LOAD ROBLOX PROFILE
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
    // NOT LINKED
    // ==========================================

    if (!session.robloxUserId) {

        roleElement.textContent =
            "Not linked";

        rankElement.textContent =
            "—";

        return;

    }


    try {

        const response =
            await fetch(
                `/api/roblox?userId=${encodeURIComponent(
                    session.robloxUserId
                )}`
            );


        if (!response.ok) {

            throw new Error(
                `API Error ${response.status}`
            );

        }


        const data =
            await response.json();


        if (
            !data.success ||
            !data.user
        ) {

            throw new Error(
                "Invalid Roblox API response"
            );

        }


        // ======================================
        // UPDATE ROLE
        // ======================================

        roleElement.textContent =
            data.user.groupRole ||
            "Not in group";


        // ======================================
        // UPDATE RANK
        // ======================================

        rankElement.textContent =
            data.user.groupRank !== undefined
                ? data.user.groupRank
                : "0";


        // ======================================
        // SAVE ROBLOX DATA
        // ======================================

        const currentSession =
            getSession();


        if (currentSession) {

            currentSession.robloxUsername =
                data.user.username ||
                currentSession.robloxUsername;


            currentSession.robloxDisplayName =
                data.user.displayName ||
                currentSession.robloxDisplayName;


            currentSession.robloxAvatar =
                data.user.avatar ||
                currentSession.robloxAvatar;


            saveSession(
                currentSession
            );


            // ======================================
            // UPDATE PROFILE AVATAR
            // ======================================

            const profileAvatar =
                document.querySelector(
                    "#profile-modal .profile-avatar"
                );


            if (
                profileAvatar &&
                data.user.avatar
            ) {

                profileAvatar.src =
                    data.user.avatar;

            }


            // ======================================
            // UPDATE MINI AVATAR
            // ======================================

            const miniAvatar =
                document.querySelector(
                    "#profile-modal .roblox-mini-avatar"
                );


            if (
                miniAvatar &&
                data.user.avatar
            ) {

                miniAvatar.src =
                    data.user.avatar;

            }

        }

    }

    catch (error) {

        console.error(
            "❌ Failed to load Roblox profile:",
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

            <button
                id="close-roblox-link"
                class="roblox-close-btn"
            >
                ✕
            </button>


            <div class="roblox-link-icon">
                🎮
            </div>


            <h2>
                Link Roblox Account
            </h2>


            <p>
                Enter your Roblox username to find
                your Roblox account.
            </p>


            <input
                id="roblox-username-input"
                type="text"
                placeholder="Roblox username"
                autocomplete="off"
            >


            <button
                id="search-roblox-btn"
                class="profile-action-btn"
            >
                🔍 Find Account
            </button>


            <div
                id="roblox-search-result"
                class="roblox-search-result"
            ></div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


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
    // SEARCH
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
    // ENTER
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


    if (!username) {

        result.innerHTML = `

            <div class="roblox-error">

                ❌ Enter a Roblox username.

            </div>

        `;

        return;

    }


    result.innerHTML = `

        <div class="roblox-loading">

            🔄 Searching Roblox...

        </div>

    `;


    try {

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
                `Roblox API ${response.status}`
            );

        }


        const data =
            await response.json();


        const user =
            data.data?.[0];


        if (!user) {

            result.innerHTML = `

                <div class="roblox-error">

                    ❌ Roblox user not found.

                </div>

            `;

            return;

        }


        // ======================================
        // SHOW USER
        // ======================================

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


        const confirmButton =
            document.getElementById(
                "confirm-roblox-btn"
            );


        if (confirmButton) {

            confirmButton.onclick = () => {

                selectRobloxAccount(
                    user
                );

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

async function selectRobloxAccount(user) {

    const session =
        getSession();


    if (!session) return;


    // ==========================================
    // BASIC DATA
    // ==========================================

    session.robloxUserId =
        Number(user.id);


    session.robloxUsername =
        user.name;


    session.robloxDisplayName =
        user.displayName ||
        user.name;


    // ==========================================
    // GET FULL ROBLOX PROFILE
    // ==========================================

    try {

        const response =
            await fetch(
                `/api/roblox?userId=${encodeURIComponent(
                    user.id
                )}`
            );


        if (response.ok) {

            const data =
                await response.json();


            if (
                data.success &&
                data.user
            ) {

                session.robloxUsername =
                    data.user.username ||
                    session.robloxUsername;


                session.robloxDisplayName =
                    data.user.displayName ||
                    session.robloxDisplayName;


                session.robloxAvatar =
                    data.user.avatar ||
                    null;

            }

        }

    }

    catch (error) {

        console.error(
            "❌ Could not load Roblox profile:",
            error
        );

    }


    // ==========================================
    // SAVE SESSION
    // ==========================================

    saveSession(
        session
    );


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
    // CLOSE USER MENU
    // ==========================================

    const userMenu =
        document.getElementById(
            "user-menu"
        );


    if (userMenu) {

        userMenu.remove();

    }


    // ==========================================
    // UPDATE TOP LOGIN BUTTON
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
                ${
                    session.robloxUsername ||
                    session.username ||
                    "Guest"
                }
            </span>

            <span class="user-panel-arrow">
                ▼
            </span>

        `;

    }


    // ==========================================
    // REOPEN PROFILE
    // ==========================================

    setTimeout(
        () => {

            openProfile();

        },
        100
    );

}
