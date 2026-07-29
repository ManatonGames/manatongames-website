document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // CREATE WELCOME SCREEN
    // ==========================================

    document.body.insertAdjacentHTML("afterbegin", `

        <div id="welcome-screen" class="welcome-screen">

        <div class="welcome-background">

    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>

</div>

            <div class="welcome-card">

                <div class="welcome-left">

                    <img
                        src="assets/logo/logo.png"
                        class="welcome-logo"
                        alt="Manaton Games Logo"
                    >

                    <h1>Manaton Games</h1>

                    <p>Create • Play • Discover</p>

                    <img
                        id="featured-game-image"
                        src="assets/games/pd3.png"
                        class="featured-game"
                        alt="Featured Game"
                    >

                    <h3
                        id="featured-game-title"
                        class="featured-title"
                    >
                        PLS DONATE 3
                    </h3>

                </div>

                <div class="welcome-right">

                    <h2>Welcome Back 👋</h2>

                    <button
                        id="signin-btn"
                        class="welcome-btn primary"
                    >
                        Sign In
                    </button>

                    <button
                        id="register-btn"
                        class="welcome-btn secondary"
                    >
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

                    <button
                        id="guest-btn"
                        class="guest-btn"
                    >

                        Continue as Guest

                    </button>

                </div>

            </div>

        </div>

    `);

    // ==========================================
    // FEATURED GAMES
    // ==========================================

    const featuredGames = [

        {

            image: "assets/games/pd3.png",

            title: "PLS DONATE 3"

        },

        {

            image: "assets/games/pd2.png",

            title: "PLS DONATE 2"

        },

        {

            image: "assets/games/growagarden.png",

            title: "Grow a Garden Modded 2.0"

        },

        {

            image: "assets/games/rsc.png",

            title: "MG | Ranks Shopping Center"

        },

        {

            image: "assets/games/speedescape.png",

            title: "+1 Speed Escape"

        }

    ];

    let currentGame = 0;

setInterval(() => {

    const image = document.getElementById("featured-game-image");
    const title = document.getElementById("featured-game-title");

    image.classList.add("fade");
    title.classList.add("fade");

    setTimeout(() => {

        currentGame++;

        if(currentGame >= featuredGames.length){

            currentGame = 0;

        }

        image.src = featuredGames[currentGame].image;

        title.textContent =
            featuredGames[currentGame].title;

        image.classList.remove("fade");
        title.classList.remove("fade");

    },450);

},5000);

});
