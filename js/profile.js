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

        </div>

    `;

    document.body.appendChild(modal);


    // ==========================================
    // CLOSE BUTTON
    // ==========================================

    document
        .getElementById("close-profile")
        .onclick = () => {

            modal.remove();

        };


    // ==========================================
    // CHECK ROBLOX ACCOUNT
    // ==========================================

    const roleElement =
        document.getElementById("roblox-role");

    const rankElement =
        document.getElementById("roblox-rank");


    // Guest = no Roblox account

    if(
        !session.robloxUserId
    ){

        roleElement.textContent =
            "Not linked";

        rankElement.textContent =
            "—";

        return;

    }


    // ==========================================
    // GET ROBLOX PROFILE
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
        // DISPLAY ROLE
        // ==========================================

        roleElement.textContent =
            data.user.groupRole || "Not in group";


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
