// ==========================================
// MANATON GAMES - PROFILE
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
// OPEN PROFILE
// ==========================================

async function openProfile() {

    if (
        document.getElementById("profile-modal")
    ) {
        return;
    }


    const session =
        getSession();


    if (!session) {

        console.warn(
            "⚠️ No active session."
        );

        return;

    }


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


            <!-- AVATAR -->

            <img
                src="${session.avatar || "assets/logo/logo.png"}"
                class="profile-avatar"
                alt="Profile"
            >


            <!-- USERNAME -->

            <h2>
                ${session.username || "Guest"}
            </h2>


            <p>
                ${session.loginType || "Guest"} Account
            </p>


            <!-- ==================================
                 PROFILE INFORMATION
            ================================== -->

            <div class="profile-info">


                <!-- USERNAME -->

                <div>

                    <span>
                        Username
                    </span>

                    <strong>
                        ${session.username || "Guest"}
                    </strong>

                </div>


                <!-- ACCOUNT TYPE -->

                <div>

                    <span>
                        Account Type
                    </span>

                    <strong>
                        ${session.loginType || "Guest"}
                    </strong>

                </div>


                <!-- STATUS -->

                <div>

                    <span>
                        Status
                    </span>

                    <strong>
                        🟢 Online
                    </strong>

                </div>


                <!-- MANATON GAMES ROLE -->

                <div>

                    <span>
                        Manaton Games Role
                    </span>

                    <strong id="roblox-role">

                        🔄 Loading...

                    </strong>

                </div>


                <!-- ROBLOX RANK -->

                <div>

                    <span>
                        Roblox Rank
                    </span>

                    <strong id="roblox-rank">

                        🔄 Loading...

                    </strong>

                </div>


                <!-- WEBSITE VERSION -->

                <div>

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


                <!-- LINK BUTTON -->

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


    document.body.appendChild(modal);


    // ==========================================
    // CLOSE PROFILE
    // ==========================================

    const closeButton =
        document.getElementById(
            "close-profile"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                modal.remove();

            }
        );

    }


    // ==========================================
    // LINK ROBLOX BUTTON
    // ==========================================

    const linkRobloxButton =
        document.getElementById(
            "link-roblox-btn"
        );


    console.log(
        "🎮 Roblox link button:",
        linkRobloxButton
    );


    if (linkRobloxButton) {

        linkRobloxButton.addEventListener(
            "click",
            () => {

                console.log(
                    "🔗 Opening Roblox link modal..."
                );

                openRobloxLinkModal();

            }
        );

    }
    else {

        console.error(
            "❌ Roblox link button was not found."
        );

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
    // ROBLOX API
    // ==========================================

    try {

        const response =
            await fetch(
                `/api/roblox?userId=${session.robloxUserId}`
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
                "Invalid Roblox user response"
            );

        }


        // ==========================================
        // ROLE
        // ==========================================

        roleElement.textContent =
            data.user.groupRole ||
            "Not in group";


        // ==========================================
        // RANK
        // ==========================================

        rankElement.textContent =
            data.user.groupRank ??
            "0";


        console.log(
            "✅ Roblox role loaded:",
            data.user
        );

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


    // ==========================================
    // PREVENT DUPLICATE MODALS
    // ==========================================

    if (
        document.getElementById(
            "roblox-link-modal"
        )
    ) {

        return;

    }


    // ==========================================
    // CREATE MODAL
    // ==========================================

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


            <!-- DESCRIPTION -->

            <p>

                Enter your Roblox username to find
                your account.

            </p>


            <!-- USERNAME -->

            <input
                id="roblox-username-input"
                type="text"
                placeholder="Roblox username"
                autocomplete="off"
            >


            <!-- SEARCH -->

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
            >

            </div>


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

        closeButton.addEventListener(
            "click",
            () => {

                modal.remove();

            }
        );

    }


    // ==========================================
    // SEARCH BUTTON
    // ==========================================

    const searchButton =
        document.getElementById(
            "search-roblox-btn"
        );


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchRobloxUser
        );

    }


    // ==========================================
    // ENTER KEY
    // ==========================================

    const usernameInput =
        document.getElementById(
            "roblox-username-input"
        );


    if (usernameInput) {

        usernameInput.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter"
                ) {

                    searchRobloxUser();

                }

            }
        );


        // Automatically focus input

        setTimeout(() => {

            usernameInput.focus();

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
                `Roblox API returned ${response.status}`
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
        // SHOW USER
        // ==========================================

        result.innerHTML = `

            <div class="roblox-found">


                <strong>

                    🎮 ${user.name}

                </strong>


                <span>

                    User ID: ${user.id}

                </span>


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
        // CONFIRM
        // ==========================================

        const confirmButton =
            document.getElementById(
                "confirm-roblox-btn"
            );


        if (confirmButton) {

            confirmButton.addEventListener(
                "click",
                () => {

                    selectRobloxAccount(user);

                }
            );

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


    if (!session) {

        return;

    }


    // ==========================================
    // SAVE ROBLOX ACCOUNT
    // ==========================================

    session.robloxUserId =
        user.id;


    session.robloxUsername =
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


    console.log(
        "✅ Roblox account linked:",
        user
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
    // REOPEN PROFILE
    // ==========================================

    openProfile();

}
