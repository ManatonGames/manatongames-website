// ==========================================
// MANATON GAMES - PROFILE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    document.addEventListener("click", (event) => {

        if (event.target.id !== "profile-btn") return;

        openProfile();

    });

});


// ==========================================
// OPEN PROFILE
// ==========================================

async function openProfile(){

    if(document.getElementById("profile-modal")) return;

    const session = getSession();

    if(!session) return;


    // ==========================================
    // CREATE MODAL
    // ==========================================

    const modal = document.createElement("div");

    modal.id = "profile-modal";

    modal.innerHTML = `

        <div class="profile-card">

            <button id="close-profile">
                ✕
            </button>

            <img
                src="${session.avatar || "assets/logo/logo.png"}"
                class="profile-avatar"
                alt="Profile"
            >

            <h2>
                ${session.username || "Guest"}
            </h2>

            <p>
                ${session.loginType || "Guest"} Account
            </p>


            <div class="profile-info">

                <div>

                    <span>Username</span>

                    <strong>
                        ${session.username || "Guest"}
                    </strong>

                </div>


                <div>

                    <span>Account Type</span>

                    <strong>
                        ${session.loginType || "Guest"}
                    </strong>

                </div>


                <div>

                    <span>Status</span>

                    <strong>
                        🟢 Online
                    </strong>

                </div>


                <div>

                    <span>Manaton Games Role</span>

                    <strong id="roblox-role">
                        🔄 Loading...
                    </strong>

                </div>


                <div>

                    <span>Roblox Rank</span>

                    <strong id="roblox-rank">
                        🔄 Loading...
                    </strong>

                </div>


                <div>

                    <span>Website</span>

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

                    ${session.robloxUserId
                        ? "✅ Roblox account linked"
                        : "🔗 No Roblox account linked"
                    }

                </div>


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
    // CLOSE
    // ==========================================

    document
        .getElementById("close-profile")
        .onclick = () => {

            modal.remove();

        };


    // ==========================================
    // LINK ROBLOX BUTTON
    // ==========================================

    document
        .getElementById("link-roblox-btn")
        .onclick = () => {

            openRobloxLinkModal();

        };


    // ==========================================
    // LOAD ROBLOX ROLE
    // ==========================================

    loadRobloxRole(session);

}


// ==========================================
// LOAD ROBLOX ROLE
// ==========================================

async function loadRobloxRole(session){

    const roleElement =
        document.getElementById("roblox-role");

    const rankElement =
        document.getElementById("roblox-rank");


    if(!roleElement || !rankElement) return;


    // ==========================================
    // NO ROBLOX ACCOUNT
    // ==========================================

    if(!session.robloxUserId){

        roleElement.textContent =
            "Not linked";

        rankElement.textContent =
            "—";

        return;

    }


    // ==========================================
    // REQUEST ROBLOX API
    // ==========================================

    try{

        const response =
            await fetch(
                `/api/roblox?userId=${session.robloxUserId}`
            );


        if(!response.ok){

            throw new Error(
                "Roblox API request failed"
            );

        }


        const data =
            await response.json();


        if(
            !data.success ||
            !data.user
        ){

            throw new Error(
                "Invalid Roblox profile"
            );

        }


        // ==========================================
        // DISPLAY
        // ==========================================

        roleElement.textContent =
            data.user.groupRole ||
            "Not in group";


        rankElement.textContent =
            data.user.groupRank || "0";


    }

    catch(error){

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

function openRobloxLinkModal(){

    if(document.getElementById("roblox-link-modal"))
        return;


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
                your account.
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

    document
        .getElementById("close-roblox-link")
        .onclick = () => {

            modal.remove();

        };


    // ==========================================
    // SEARCH
    // ==========================================

    document
        .getElementById("search-roblox-btn")
        .onclick = searchRobloxUser;


    // ENTER KEY
    // ==========================================

    document
        .getElementById("roblox-username-input")
        .addEventListener(
            "keydown",
            event => {

                if(event.key === "Enter"){

                    searchRobloxUser();

                }

            }
        );

}


// ==========================================
// SEARCH ROBLOX USER
// ==========================================

async function searchRobloxUser(){

    const input =
        document.getElementById(
            "roblox-username-input"
        );

    const result =
        document.getElementById(
            "roblox-search-result"
        );


    if(!input || !result) return;


    const username =
        input.value.trim();


    if(!username){

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


    try{

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

                        usernames: [username],

                        excludeBannedUsers: false

                    })

                }
            );


        if(!response.ok){

            throw new Error(
                "Roblox username search failed"
            );

        }


        const data =
            await response.json();


        const user =
            data.data?.[0];


        if(!user){

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

                <strong>
                    🎮 ${user.name}
                </strong>

                <span>
                    User ID: ${user.id}
                </span>

                <button
                    id="confirm-roblox-btn"
                    class="profile-action-btn"
                >

                    ✅ Select This Account

                </button>

            </div>

        `;


        document
            .getElementById("confirm-roblox-btn")
            .onclick = () => {

                selectRobloxAccount(user);

            };


    }

    catch(error){

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

function selectRobloxAccount(user){

    const session =
        getSession();


    if(!session) return;


    // ==========================================
    // SAVE ROBLOX DATA
    // ==========================================

    session.robloxUserId =
        user.id;

    session.robloxUsername =
        user.name;


    saveSession(session);


    // ==========================================
    // CLOSE LINK MODAL
    // ==========================================

    const linkModal =
        document.getElementById(
            "roblox-link-modal"
        );

    if(linkModal){

        linkModal.remove();

    }


    // ==========================================
    // REFRESH PROFILE
    // ==========================================

    const profileModal =
        document.getElementById(
            "profile-modal"
        );

    if(profileModal){

        profileModal.remove();

    }


    openProfile();

}
