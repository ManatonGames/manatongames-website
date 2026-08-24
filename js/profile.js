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

    if (document.getElementById("profile-modal")) {
        return;
    }

    const session = getSession();

    if (!session) {
        return;
    }


    // ==========================================
    // CREATE PROFILE MODAL
    // ==========================================

    const modal =
        document.createElement("div");

    modal.id =
        "profile-modal";

    modal.innerHTML = `

        <div class="profile-card">

            <button
                id="close-profile"
                class="profile-close-btn"
            >
                ✕
            </button>


            <!-- ==================================
                 HEADER
            ================================== -->

            <div class="profile-header">

                <img
                    src="${session.avatar || "assets/logo/logo.png"}"
                    class="profile-avatar"
                    alt="Profile Avatar"
                >

                <div class="profile-header-info">

                    <h2>
                        ${escapeHTML(
                            session.username || "Guest"
                        )}
                    </h2>

                    <p>
                        ${escapeHTML(
                            session.loginType || "Guest"
                        )} Account
                    </p>

                </div>

            </div>


            <!-- ==================================
                 PROFILE INFORMATION
            ================================== -->

            <div class="profile-info">


                <div class="profile-info-item">

                    <span>
                        Username
                    </span>

                    <strong>
                        ${escapeHTML(
                            session.username || "Guest"
                        )}
                    </strong>

                </div>


                <div class="profile-info-item">

                    <span>
                        Account Type
                    </span>

                    <strong>
                        ${escapeHTML(
                            session.loginType || "Guest"
                        )}
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


            <!-- ==================================
                 ROBLOX ACCOUNT
            ================================== -->

            <div class="roblox-profile-section">

                <div class="roblox-profile-title">

                    🎮 Roblox Account

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
                        <div class="roblox-linked-info">

                            <strong>
                                ${escapeHTML(
                                    session.robloxUsername ||
                                    "Roblox Account"
                                )}
                            </strong>

                            <span>
                                ID: ${session.robloxUserId}
                            </span>

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
    // LOAD ROLE
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
    // NO LINKED ACCOUNT
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


    try {

        const response =
            await fetch(
                `/api/roblox?userId=${encodeURIComponent(
                    session.robloxUserId
                )}`
            );


        if (!response.ok) {

            throw new Error(
                `API returned ${response.status}`
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
                Enter your Roblox username to connect
                your Roblox account with Manaton Games.
            </p>


            <input
                id="roblox-username-input"
                type="text"
                placeholder="Roblox username"
                autocomplete="off"
                maxlength="20"
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
            (event) => {

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

    const button =
        document.getElementById(
            "search-roblox-btn"
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
    // EMPTY USERNAME
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

    if (button) {

        button.disabled = true;

        button.textContent =
            "🔄 Searching...";

    }


    result.innerHTML = `

        <div class="roblox-loading">

            🔄 Searching Roblox...

        </div>

    `;


    try {

        // ======================================
        // USE OUR API
        // ======================================

        const response =
            await fetch(
                `/api/roblox?username=${encodeURIComponent(
                    username
                )}`
            );


        const data =
            await response.json();


        // ======================================
        // USER NOT FOUND
        // ======================================

        if (
            response.status === 404 ||
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


        // ======================================
        // API ERROR
        // ======================================

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Roblox API error"
            );

        }


        const user =
            data.user;


        // ======================================
        // SHOW ACCOUNT
        // ======================================

        result.innerHTML = `

            <div class="roblox-found">

                <div class="roblox-found-header">

                    <div class="roblox-found-avatar">
                        🎮
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(
                                user.username
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                user.displayName ||
                                user.username
                            )}
                        </span>

                    </div>

                </div>


                <div class="roblox-found-info">

                    <div>

                        <span>
                            User ID
                        </span>

                        <strong>
                            ${user.id}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Manaton Games Role
                        </span>

                        <strong>
                            ${escapeHTML(
                                user.groupRole ||
                                "Not in group"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Roblox Rank
                        </span>

                        <strong>
                            ${user.groupRank ?? 0}
                        </strong>

                    </div>

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
        // CONFIRM
        // ======================================

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
                <br>
                Please try again in a moment.

            </div>

        `;

    }

    finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "🔍 Find Account";

        }

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
        user.id;

    session.robloxUsername =
        user.username ||
        user.name;

    session.robloxDisplayName =
        user.displayName ||
        user.username ||
        user.name;

    session.robloxGroupRole =
        user.groupRole ||
        "Not in group";

    session.robloxGroupRank =
        user.groupRank ??
        0;


    // ==========================================
    // SAVE SESSION
    // ==========================================

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

    setTimeout(() => {

        openProfile();

    }, 100);

}


// ==========================================
// HTML ESCAPE
// ==========================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
