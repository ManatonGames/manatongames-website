// ==========================================
// MANATON GAMES - PROFILE
// VERSION 2.6.0
// ==========================================


// ==========================================
// PROFILE BUTTON
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
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


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
    // PROFILE DATA
    // ==========================================

    const username =
        session.robloxUsername ||
        session.username ||
        "Guest";


    const avatar =
        session.robloxAvatar ||
        session.avatar ||
        "assets/logo/logo.png";


    const accountType =
        session.robloxUserId
            ? "Roblox Account"
            : "Guest Account";


    // ==========================================
    // CREATE MODAL
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
                type="button"
            >
                ✕
            </button>


            <!-- ==================================
                 AVATAR
            ================================== -->

            <div class="profile-avatar-wrapper">

                <img
                    src="${escapeHTML(avatar)}"
                    class="profile-avatar"
                    alt="Profile Avatar"
                    onerror="
                        this.onerror=null;
                        this.src='assets/logo/logo.png';
                    "
                >

                <span class="profile-online-dot">
                    ●
                </span>

            </div>


            <!-- ==================================
                 NAME
            ================================== -->

            <h2 class="profile-name">

                ${escapeHTML(username)}

            </h2>


            <p class="profile-account-type">

                ${accountType}

            </p>


            <!-- ==================================
                 INFORMATION
            ================================== -->

            <div class="profile-info">


                <!-- USERNAME -->

                <div class="profile-info-row">

                    <span>
                        Username
                    </span>

                    <strong id="profile-username">

                        ${escapeHTML(username)}

                    </strong>

                </div>


                <!-- ACCOUNT TYPE -->

                <div class="profile-info-row">

                    <span>
                        Account Type
                    </span>

                    <strong>

                        ${accountType}

                    </strong>

                </div>


                <!-- STATUS -->

                <div class="profile-info-row">

                    <span>
                        Status
                    </span>

                    <strong class="profile-online">

                        🟢 Online

                    </strong>

                </div>


                <!-- MANATON GAMES ROLE -->

                <div class="profile-info-row">

                    <span>
                        Manaton Games Role
                    </span>

                    <strong id="roblox-role">

                        🔄 Loading...

                    </strong>

                </div>


                <!-- ROBLOX RANK -->

                <div class="profile-info-row">

                    <span>
                        Roblox Rank
                    </span>

                    <strong id="roblox-rank">

                        🔄 Loading...

                    </strong>

                </div>


                <!-- WEBSITE -->

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

                    <span>
                        🎮
                    </span>

                    <span>
                        Roblox Account
                    </span>

                </div>


                ${
                    session.robloxUserId
                    ?

                    `

                    <div
                        id="roblox-account-status"
                        class="roblox-account-status linked"
                    >

                        <div class="roblox-linked-user">

                            <img
                                src="${
                                    escapeHTML(
                                        session.robloxAvatar ||
                                        "assets/logo/logo.png"
                                    )
                                }"
                                class="roblox-linked-avatar"
                                alt="Roblox Avatar"
                                onerror="
                                    this.onerror=null;
                                    this.src='assets/logo/logo.png';
                                "
                            >

                            <div>

                                <strong>
                                    ${escapeHTML(
                                        session.robloxUsername ||
                                        "Roblox User"
                                    )}
                                </strong>

                                <span>
                                    ID:
                                    ${escapeHTML(
                                        session.robloxUserId
                                    )}
                                </span>

                            </div>

                        </div>

                    </div>

                    `

                    :

                    `

                    <div
                        id="roblox-account-status"
                        class="roblox-account-status"
                    >

                        🔗 No Roblox account linked

                    </div>

                    `
                }


                <!-- ==================================
                     LINK / CHANGE BUTTON
                ================================== -->

                <button
                    id="link-roblox-btn"
                    class="profile-action-btn"
                    type="button"
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
    // CLOSE WHEN CLICKING BACKDROP
    // ==========================================

    modal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === modal
            ) {

                modal.remove();

            }

        }
    );


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

    loadRobloxRole(
        session
    );

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
                "Invalid Roblox profile"
            );

        }


        // ==========================================
        // UPDATE ROLE
        // ==========================================

        roleElement.textContent =
            data.user.groupRole ||
            "Not in group";


        rankElement.textContent =
            data.user.groupRank ??
            "0";


        // ==========================================
        // UPDATE AVATAR
        // ==========================================

        if (
            data.user.avatar &&
            session.robloxAvatar !==
            data.user.avatar
        ) {

            session.robloxAvatar =
                data.user.avatar;


            saveSession(
                session
            );

        }

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


            <!-- CLOSE -->

            <button
                id="close-roblox-link"
                class="roblox-close-btn"
                type="button"
            >

                ✕

            </button>


            <!-- ICON -->

            <div class="roblox-link-icon">

                🎮

            </div>


            <!-- TITLE -->

            <h2>

                Link Roblox Account

            </h2>


            <p>

                Enter your Roblox username to find
                your account.

            </p>


            <!-- INPUT -->

            <div class="roblox-input-wrapper">

                <span>
                    👤
                </span>

                <input
                    id="roblox-username-input"
                    type="text"
                    placeholder="Roblox username"
                    autocomplete="off"
                    maxlength="20"
                >

            </div>


            <!-- SEARCH BUTTON -->

            <button
                id="search-roblox-btn"
                class="profile-action-btn"
                type="button"
            >

                🔍 Find Account

            </button>


            <!-- RESULT -->

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
    // BACKDROP
    // ==========================================

    modal.addEventListener(
        "click",
        (event) => {

            if (
                event.target === modal
            ) {

                modal.remove();

            }

        }
    );


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

        button.disabled =
            true;

        button.innerHTML =
            "🔄 Searching...";

    }


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

        // ==========================================
        // USE MANATON GAMES API
        // ==========================================

        const response =
            await fetch(
                `/api/roblox?username=${encodeURIComponent(
                    username
                )}`
            );


        const data =
            await response.json();


        // ==========================================
        // USER NOT FOUND
        // ==========================================

        if (
            response.status === 404 ||
            !data.success ||
            !data.user
        ) {

            result.innerHTML = `

                <div class="roblox-error">

                    ❌ Roblox user not found.

                    <small>
                        Check the username and try again.
                    </small>

                </div>

            `;

            return;

        }


        // ==========================================
        // API ERROR
        // ==========================================

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Roblox API error"
            );

        }


        const user =
            data.user;


        // ==========================================
        // SHOW ACCOUNT
        // ==========================================

        result.innerHTML = `

            <div class="roblox-found">


                <!-- AVATAR -->

                <div class="roblox-found-avatar-wrapper">

                    <img
                        src="${
                            escapeHTML(
                                user.avatar ||
                                "assets/logo/logo.png"
                            )
                        }"
                        class="roblox-found-avatar"
                        alt="Roblox Avatar"
                        onerror="
                            this.onerror=null;
                            this.src='assets/logo/logo.png';
                        "
                    >

                </div>


                <!-- USER -->

                <div class="roblox-found-info">

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


                    <span>

                        User ID:
                        ${escapeHTML(
                            user.id
                        )}

                    </span>


                    <span>

                        🎮
                        ${
                            escapeHTML(
                                user.groupRole ||
                                "Not in group"
                            )
                        }

                    </span>


                    <span>

                        Roblox Rank:
                        ${
                            escapeHTML(
                                user.groupRank ??
                                0
                            )
                        }

                    </span>

                </div>


                <!-- SELECT -->

                <button
                    id="confirm-roblox-btn"
                    class="profile-action-btn"
                    type="button"
                >

                    ✅ Select This Account

                </button>


            </div>

        `;


        // ==========================================
        // SELECT BUTTON
        // ==========================================

        const confirmButton =
            document.getElementById(
                "confirm-roblox-btn"
            );


        if (confirmButton) {

            confirmButton.onclick =
                () => {

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

    finally {

        if (button) {

            button.disabled =
                false;

            button.innerHTML =
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
    // SAVE ROBLOX DATA
    // ==========================================

    session.robloxUserId =
        user.id;


    session.robloxUsername =
        user.username ||
        user.name ||
        "Roblox User";


    session.robloxDisplayName =
        user.displayName ||
        user.username ||
        user.name ||
        "Roblox User";


    session.robloxAvatar =
        user.avatar ||
        "assets/logo/logo.png";


    session.robloxGroupRole =
        user.groupRole ||
        "Not in group";


    session.robloxGroupRank =
        user.groupRank ??
        0;


    // ==========================================
    // SAVE SESSION
    // ==========================================

    const saved =
        saveSession(
            session
        );


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
    // REFRESH PROFILE
    // ==========================================

    openProfile();


    // ==========================================
    // UPDATE USER PANEL
    // ==========================================

    if (
        typeof updateUserPanel ===
        "function"
    ) {

        updateUserPanel();

    }

}


// ==========================================
// EXPORT FUNCTIONS
// ==========================================

window.openProfile =
    openProfile;

window.openRobloxLinkModal =
    openRobloxLinkModal;

window.searchRobloxUser =
    searchRobloxUser;

window.selectRobloxAccount =
    selectRobloxAccount;
