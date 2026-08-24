// ==========================================
// MANATON GAMES - PROFILE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    document.addEventListener("click", (event) => {

        const profileButton =
            event.target.closest("#profile-btn");

        if (!profileButton) return;

        openProfile();

    });

});


// ==========================================
// OPEN PROFILE
// ==========================================

async function openProfile() {

    if (document.getElementById("profile-modal")) return;

    const session = getSession();

    if (!session) return;


    const robloxLinked =
        !!session.robloxUserId;


    const robloxUsername =
        session.robloxUsername || null;


    const robloxAvatar =
        session.robloxAvatar ||
        "assets/logo/logo.png";


    // ==========================================
    // CREATE MODAL
    // ==========================================

    const modal =
        document.createElement("div");

    modal.id = "profile-modal";


    modal.innerHTML = `

        <div class="profile-card">

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
                    src="${robloxAvatar}"
                    class="profile-avatar"
                    id="profile-avatar"
                    alt="Profile Avatar"
                >

                <div class="profile-header-info">

                    <h2 id="profile-display-name">
                        ${robloxUsername || session.username || "Guest"}
                    </h2>

                    <p class="profile-account-type">

                        ${
                            robloxLinked
                                ? "Roblox Account"
                                : "Guest Account"
                        }

                    </p>

                </div>

            </div>


            <!-- ==================================
                 PROFILE INFORMATION
            ================================== -->

            <div class="profile-info">


                <div class="profile-info-row">

                    <span>
                        Username
                    </span>

                    <strong>
                        ${robloxUsername || session.username || "Guest"}
                    </strong>

                </div>


                <div class="profile-info-row">

                    <span>
                        Account Type
                    </span>

                    <strong>
                        ${
                            robloxLinked
                                ? "Roblox"
                                : "Guest"
                        }
                    </strong>

                </div>


                <div class="profile-info-row">

                    <span>
                        Status
                    </span>

                    <strong class="online-status">
                        🟢 Online
                    </strong>

                </div>


                <div class="profile-info-row">

                    <span>
                        Manaton Games Role
                    </span>

                    <strong id="roblox-role">

                        ${
                            robloxLinked
                                ? "🔄 Loading..."
                                : "Not linked"
                        }

                    </strong>

                </div>


                <div class="profile-info-row">

                    <span>
                        Roblox Rank
                    </span>

                    <strong id="roblox-rank">

                        ${
                            robloxLinked
                                ? "🔄 Loading..."
                                : "—"
                        }

                    </strong>

                </div>


                <div class="profile-info-row">

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

                    <span class="roblox-title-icon">
                        🎮
                    </span>

                    <span>
                        Roblox Account
                    </span>

                </div>


                ${
                    robloxLinked

                    ? `

                    <div class="roblox-linked-account">

                        <img
                            src="${robloxAvatar}"
                            class="roblox-linked-avatar"
                            alt="Roblox Avatar"
                        >

                        <div class="roblox-linked-info">

                            <strong>
                                ${robloxUsername}
                            </strong>

                            <span>
                                ID: ${session.robloxUserId}
                            </span>

                        </div>

                    </div>

                    `

                    : `

                    <div class="roblox-not-linked">

                        🔗 No Roblox account linked

                    </div>

                    `
                }


                <button
                    id="link-roblox-btn"
                    class="profile-action-btn"
                >

                    ${
                        robloxLinked
                            ? "🔄 Change Roblox Account"
                            : "🔗 Link Roblox Account"
                    }

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    // ==========================================
    // CLOSE
    // ==========================================

    const closeButton =
        document.getElementById("close-profile");

    if (closeButton) {

        closeButton.onclick = () => {

            modal.remove();

        };

    }


    // ==========================================
    // LINK / CHANGE ROBLOX
    // ==========================================

    const linkButton =
        document.getElementById("link-roblox-btn");

    if (linkButton) {

        linkButton.onclick = () => {

            openRobloxLinkModal();

        };

    }


    // ==========================================
    // LOAD ROBLOX ROLE
    // ==========================================

    if (robloxLinked) {

        loadRobloxRole(
            session
        );

    }

}


// ==========================================
// LOAD ROBLOX ROLE
// ==========================================

async function loadRobloxRole(session) {

    const roleElement =
        document.getElementById("roblox-role");

    const rankElement =
        document.getElementById("roblox-rank");


    if (!roleElement || !rankElement) return;


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
                `API Error: ${response.status}`
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


        roleElement.textContent =
            data.user.groupRole ||
            "Not in group";


        rankElement.textContent =
            data.user.groupRank ??
            "0";


        // ======================================
        // UPDATE ROBLOX USERNAME
        // ======================================

        if (data.user.username) {

            session.robloxUsername =
                data.user.username;

        }


        // ======================================
        // UPDATE DISPLAY NAME
        // ======================================

        if (data.user.displayName) {

            session.robloxDisplayName =
                data.user.displayName;

        }


        // ======================================
        // AVATAR
        // ======================================

        if (data.user.avatar) {

            session.robloxAvatar =
                data.user.avatar;


            const avatar =
                document.getElementById(
                    "profile-avatar"
                );

            if (avatar) {

                avatar.src =
                    data.user.avatar;

            }


            const linkedAvatar =
                document.querySelector(
                    ".roblox-linked-avatar"
                );

            if (linkedAvatar) {

                linkedAvatar.src =
                    data.user.avatar;

            }

        }


        saveSession(session);


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
                Enter your Roblox username to
                find your Roblox account.
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
            event => {

                if (
                    event.key === "Enter"
                ) {

                    searchRobloxUser();

                }

            }
        );


        setTimeout(() => {

            input.focus();

        }, 100);

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


    if (!input || !result) return;


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


    // ==========================================
    // LOADING
    // ==========================================

    result.innerHTML = `

        <div class="roblox-loading">

            <span>
                🔄
            </span>

            <span>
                Searching Roblox...
            </span>

        </div>

    `;


    try {

        // ======================================
        // USE OUR SERVER API
        // ======================================

        const response =
            await fetch(
                `/api/roblox?username=${encodeURIComponent(
                    username
                )}`
            );


        if (!response.ok) {

            throw new Error(
                `API Error: ${response.status}`
            );

        }


        const data =
            await response.json();


        if (
            !data.success ||
            !data.user
        ) {

            result.innerHTML = `

                <div class="roblox-error">

                    ❌ Roblox user not found.

                </div>

            `;

            return;

        }


        const user =
            data.user;


        // ======================================
        // SHOW ACCOUNT
        // ======================================

        result.innerHTML = `

            <div class="roblox-found">

                <div class="roblox-found-header">

                    ${
                        user.avatar

                        ? `

                        <img
                            src="${user.avatar}"
                            class="roblox-found-avatar"
                            alt="Roblox Avatar"
                        >

                        `

                        : `

                        <div class="roblox-found-avatar-placeholder">
                            🎮
                        </div>

                        `
                    }


                    <div class="roblox-found-user">

                        <strong>
                            ${user.username}
                        </strong>

                        <span>
                            ${
                                user.displayName &&
                                user.displayName !==
                                user.username

                                ? user.displayName

                                : "Roblox User"
                            }
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


        // ======================================
        // SELECT
        // ======================================

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

                <small>
                    Please try again in a moment.
                </small>

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
    // SAVE ROBLOX DATA
    // ==========================================

    session.robloxUserId =
        user.id;


    session.robloxUsername =
        user.username ||
        user.name;


    session.robloxDisplayName =
        user.displayName ||
        user.username ||
        user.name;


    session.robloxAvatar =
        user.avatar ||
        "assets/logo/logo.png";


    saveSession(session);


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
    // REOPEN PROFILE
    // ==========================================

    await openProfile();

}
