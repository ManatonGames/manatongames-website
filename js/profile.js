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

function openProfile(){

    if(document.getElementById("profile-modal")) return;

    const session =
        getSession();

    const modal =
        document.createElement("div");

    modal.id =
        "profile-modal";

    modal.innerHTML = `

        <div class="profile-card">

            <button
                id="close-profile"
                class="close-profile"
            >
                ✕
            </button>


            <!-- ========================= -->
            <!-- AVATAR -->
            <!-- ========================= -->

            <img
                src="${
                    session?.avatar ||
                    "assets/logo/logo.png"
                }"
                class="profile-avatar"
                id="profile-avatar"
            >


            <!-- ========================= -->
            <!-- USERNAME -->
            <!-- ========================= -->

            <h2 id="profile-username">

                ${
                    session?.username ||
                    "Guest"
                }

            </h2>


            <p id="profile-account-type">

                ${
                    session?.loginType ||
                    "Guest"
                }
                Account

            </p>


            <!-- ========================= -->
            <!-- PROFILE INFO -->
            <!-- ========================= -->

            <div class="profile-info">

                <div>

                    <span>Username</span>

                    <strong id="profile-username-info">

                        ${
                            session?.username ||
                            "Guest"
                        }

                    </strong>

                </div>


                <div>

                    <span>Account Type</span>

                    <strong>

                        ${
                            session?.loginType ||
                            "Guest"
                        }

                    </strong>

                </div>


                <div>

                    <span>Status</span>

                    <strong>

                        🟢 Online

                    </strong>

                </div>


                <div>

                    <span>Website</span>

                    <strong>

                        v1.0.2

                    </strong>

                </div>

            </div>


            <!-- ========================= -->
            <!-- ROBLOX -->
            <!-- ========================= -->

            <div
                class="profile-roblox"
                id="profile-roblox"
            >

                <div class="roblox-header">

                    <h3>

                        🎮 Roblox

                    </h3>

                </div>


                <div
                    id="roblox-profile-content"
                    class="roblox-profile-content"
                >

                    ${
                        session?.robloxUserId

                        ?

                        `
                        <p>
                            🔄 Loading Roblox profile...
                        </p>
                        `

                        :

                        `
                        <p>
                            Roblox account not connected.
                        </p>

                        <button
                            id="connect-roblox-btn"
                            class="connect-roblox-btn"
                        >
                            🔗 Connect Roblox Account
                        </button>
                        `
                    }

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    // ==========================================
    // CLOSE
    // ==========================================

    document
        .getElementById("close-profile")
        .onclick = () => {

            modal.remove();

        };


    // ==========================================
    // CONNECT ROBLOX
    // ==========================================

    const connectButton =
        document.getElementById(
            "connect-roblox-btn"
        );

    if(connectButton){

        connectButton.onclick =
            connectRobloxAccount;

    }


    // ==========================================
    // LOAD ROBLOX PROFILE
    // ==========================================

    if(session?.robloxUserId){

        loadRobloxProfile(
            session.robloxUserId
        );

    }

}


// ==========================================
// CONNECT ROBLOX ACCOUNT
// ==========================================

async function connectRobloxAccount(){

    const username =
        prompt(
            "Enter your Roblox username:"
        );

    if(!username){

        return;

    }


    const button =
        document.getElementById(
            "connect-roblox-btn"
        );

    if(button){

        button.disabled = true;

        button.textContent =
            "🔄 Connecting...";

    }


    try{

        // ==========================================
        // FIND ROBLOX USER
        // ==========================================

        const response =
            await fetch(
                "/api/roblox-user?username=" +
                encodeURIComponent(username)
            );


        if(!response.ok){

            throw new Error(
                "Roblox user not found."
            );

        }


        const data =
            await response.json();


        if(!data.success){

            throw new Error(
                data.error ||
                "Unable to find Roblox user."
            );

        }


        // ==========================================
        // SAVE ROBLOX DATA
        // ==========================================

        updateSession({

            robloxUserId:
                data.user.id,

            robloxUsername:
                data.user.username,

            robloxDisplayName:
                data.user.displayName

        });


        // ==========================================
        // LOAD PROFILE
        // ==========================================

        loadRobloxProfile(
            data.user.id
        );


    }

    catch(error){

        console.error(
            "Roblox connection error:",
            error
        );

        alert(
            "❌ Could not connect this Roblox account."
        );


        if(button){

            button.disabled = false;

            button.textContent =
                "🔗 Connect Roblox Account";

        }

    }

}


// ==========================================
// LOAD ROBLOX PROFILE
// ==========================================

async function loadRobloxProfile(userId){

    const content =
        document.getElementById(
            "roblox-profile-content"
        );

    if(!content){

        return;

    }


    content.innerHTML = `

        <p>
            🔄 Loading Roblox information...
        </p>

    `;


    try{

        const response =
            await fetch(
                "/api/roblox?userId=" +
                encodeURIComponent(userId)
            );


        if(!response.ok){

            throw new Error(
                "Roblox API error"
            );

        }


        const data =
            await response.json();


        if(
            !data.success ||
            !data.user
        ){

            throw new Error(
                data.error ||
                "Roblox user unavailable."
            );

        }


        const user =
            data.user;


        // ==========================================
        // UPDATE SESSION WITH ROLE
        // ==========================================

        updateSession({

            robloxUserId:
                user.id,

            robloxUsername:
                user.username,

            robloxDisplayName:
                user.displayName,

            groupRole:
                user.groupRole,

            groupRank:
                user.groupRank

        });


        // ==========================================
        // GROUP STATUS
        // ==========================================

        const isMember =
            user.groupRole !==
            "Not in group";


        // ==========================================
        // DISPLAY
        // ==========================================

        content.innerHTML = `

            <div class="roblox-user">

                <div class="roblox-user-name">

                    <strong>

                        ${escapeHTML(
                            user.displayName
                        )}

                    </strong>

                    <span>

                        @${escapeHTML(
                            user.username
                        )}

                    </span>

                </div>


                <div class="roblox-info">

                    <div>

                        <span>Manaton Games Role</span>

                        <strong>

                            ${
                                isMember
                                ? "🛡️ " +
                                    escapeHTML(
                                        user.groupRole
                                    )
                                : "⚪ Not in group"
                            }

                        </strong>

                    </div>


                    <div>

                        <span>Group Rank</span>

                        <strong>

                            ${
                                isMember
                                ? user.groupRank
                                : "—"
                            }

                        </strong>

                    </div>


                    <div>

                        <span>Group Status</span>

                        <strong>

                            ${
                                isMember
                                ? "🟢 Member"
                                : "⚪ Not a member"
                            }

                        </strong>

                    </div>

                </div>

            </div>

        `;

    }

    catch(error){

        console.error(
            "Roblox profile error:",
            error
        );


        content.innerHTML = `

            <p>

                ❌ Unable to load Roblox profile.

            </p>

        `;

    }

}


// ==========================================
// HTML ESCAPE
// ==========================================

function escapeHTML(value){

    if(value === null ||
       value === undefined){

        return "";

    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
