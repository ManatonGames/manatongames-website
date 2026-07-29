document.addEventListener("DOMContentLoaded", () => {

    document.body.insertAdjacentHTML("afterbegin", `

        <div id="welcome-screen" class="welcome-screen">

            <div class="welcome-card">

                <img src="assets/logo/logo.png" class="welcome-logo">

                <h1>Manaton Games</h1>

                <p>Create • Play • Discover</p>

                <button class="welcome-btn primary">
                    Sign In
                </button>

                <button class="welcome-btn secondary">
                    Create Account
                </button>

                <div class="welcome-divider">
                    <span>OR</span>
                </div>

                <button class="oauth-btn">
                    Continue with Google
                </button>

                <button class="oauth-btn">
                    Continue with Discord
                </button>

                <button id="guest-btn" class="guest-btn">
                    Continue as Guest
                </button>

            </div>

        </div>

    `);

});
