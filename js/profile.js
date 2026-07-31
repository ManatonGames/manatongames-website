document.addEventListener("DOMContentLoaded", () => {

    document.addEventListener("click", (event) => {

        if (event.target.id !== "profile-btn") return;

        openProfile();

    });

});

function openProfile(){

    if(document.getElementById("profile-modal")) return;

    const session =
        JSON.parse(localStorage.getItem("mg_session"));

    const modal = document.createElement("div");

    modal.id = "profile-modal";

    modal.innerHTML = `

    <div class="profile-card">

        <button id="close-profile">
            ✕
        </button>

        <img
            src="${session?.avatar || "assets/logo/logo.png"}"
            class="profile-avatar"
        >

        <h2>${session?.username || "Guest"}</h2>

        <p>${session?.loginType || "Guest"} Account</p>

        <div class="profile-info">

            <div>

                <span>Username</span>

                <strong>${session?.username || "Guest"}</strong>

            </div>

            <div>

                <span>Account Type</span>

                <strong>${session?.loginType || "Guest"}</strong>

            </div>

            <div>

                <span>Status</span>

                <strong>🟢 Online</strong>

            </div>

            <div>

                <span>Website</span>

                <strong>v1.0.2</strong>

            </div>

        </div>

    </div>

    `;

    document.body.appendChild(modal);

    document
        .getElementById("close-profile")
        .onclick = () => {

            modal.remove();

        };

}
