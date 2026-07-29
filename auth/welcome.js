document.addEventListener("DOMContentLoaded", () => {

    document.body.insertAdjacentHTML("afterbegin", `

        <div id="welcome-screen" class="welcome-screen">

           <div class="welcome-left">

    <img
        src="assets/logo/logo.png"
        class="welcome-logo"
    >

    <h1>Manaton Games</h1>

    <p>Create • Play • Discover</p>

<img
    id="featured-game-image"
    src="assets/games/pd3.png"
    class="featured-game"
    alt="Featured Game"
>

<h3 id="featured-game-title" class="featured-title">
    PLS DONATE 3
</h3>

</div>

<div class="welcome-right">

    <h2>Welcome Back 👋</h2>

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

    <button class="guest-btn">

        Continue as Guest

    </button>

</div>

        </div>

    `);

});
