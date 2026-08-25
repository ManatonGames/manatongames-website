// ==========================================
// MANATON GAMES - FAVORITES SYSTEM
// ==========================================

const MG_FAVORITES_KEY = "mg_favorites";


// ==========================================
// GET FAVORITES
// ==========================================

function getFavorites() {

    try {

        const favorites =
            localStorage.getItem(
                MG_FAVORITES_KEY
            );

        if (!favorites) {

            return [];

        }

        const parsed =
            JSON.parse(favorites);

        return Array.isArray(parsed)
            ? parsed
            : [];

    }

    catch (error) {

        console.error(
            "❌ Error reading favorites:",
            error
        );

        return [];

    }

}


// ==========================================
// SAVE FAVORITES
// ==========================================

function saveFavorites(favorites) {

    try {

        localStorage.setItem(
            MG_FAVORITES_KEY,
            JSON.stringify(favorites)
        );

        return true;

    }

    catch (error) {

        console.error(
            "❌ Error saving favorites:",
            error
        );

        return false;

    }

}


// ==========================================
// CHECK FAVORITE
// ==========================================

function isFavorite(gameId) {

    const favorites =
        getFavorites();

    return favorites.some(
        favorite =>
            Number(favorite.id) ===
            Number(gameId)
    );

}


// ==========================================
// ADD FAVORITE
// ==========================================

function addFavorite(game) {

    if (!game || !game.id) return false;


    const favorites =
        getFavorites();


    if (
        favorites.some(
            favorite =>
                Number(favorite.id) ===
                Number(game.id)
        )
    ) {

        return true;

    }


    favorites.push({

        id: game.id,

        name:
            game.name ||
            "Unknown Game",

        thumbnail:
            game.thumbnail ||
            "assets/logo/logo.png",

        universeId:
            game.universeId ||
            null,

        status:
            game.status ||
            "Unknown"

    });


    return saveFavorites(
        favorites
    );

}


// ==========================================
// REMOVE FAVORITE
// ==========================================

function removeFavorite(gameId) {

    const favorites =
        getFavorites();


    const updated =
        favorites.filter(
            favorite =>
                Number(favorite.id) !==
                Number(gameId)
        );


    return saveFavorites(
        updated
    );

}


// ==========================================
// TOGGLE FAVORITE
// ==========================================

function toggleFavorite(game) {

    if (!game || !game.id) {

        return false;

    }


    if (
        isFavorite(game.id)
    ) {

        return removeFavorite(
            game.id
        );

    }


    return addFavorite(
        game
    );

}


// ==========================================
// OPEN FAVORITES
// ==========================================

function openFavorites() {

    if (
        document.getElementById(
            "favorites-modal"
        )
    ) {

        return;

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "favorites-modal";


    modal.innerHTML = `

        <div class="favorites-card">

            <button
                id="close-favorites"
                class="favorites-close-btn"
            >
                ✕
            </button>


            <div class="favorites-header">

                <div class="favorites-icon">
                    ⭐
                </div>

                <div>

                    <h2>
                        Favorites
                    </h2>

                    <p>
                        Your favorite Manaton Games
                    </p>

                </div>

            </div>


            <div
                id="favorites-list"
                class="favorites-list"
            ></div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    document
        .getElementById(
            "close-favorites"
        )
        .onclick = () => {

            modal.remove();

        };


    renderFavorites();

}


// ==========================================
// RENDER FAVORITES
// ==========================================

function renderFavorites() {

    const container =
        document.getElementById(
            "favorites-list"
        );


    if (!container) return;


    const favorites =
        getFavorites();


    // ==========================================
    // EMPTY
    // ==========================================

    if (!favorites.length) {

        container.innerHTML = `

            <div class="favorites-empty">

                <div class="favorites-empty-icon">
                    ⭐
                </div>

                <h3>
                    No Favorites Yet
                </h3>

                <p>
                    Favorite a game to see it here.
                </p>

            </div>

        `;

        return;

    }


    // ==========================================
    // GAMES
    // ==========================================

    container.innerHTML =
        favorites.map(
            game => `

                <div
                    class="favorite-game"
                    data-game-id="${game.id}"
                >

                    <img
                        src="${
                            game.thumbnail ||
                            "assets/logo/logo.png"
                        }"
                        class="favorite-game-thumbnail"
                        alt="${game.name}"
                    >


                    <div
                        class="favorite-game-info"
                    >

                        <strong>
                            ${game.name}
                        </strong>


                        <span>
                            ${game.status}
                        </span>


                        <div
                            class="favorite-game-actions"
                        >

                            <button
                                class="favorite-play-btn"
                                data-universe-id="${
                                    game.universeId || ""
                                }"
                            >
                                🎮 Play
                            </button>


                            <button
                                class="favorite-remove-btn"
                                data-game-id="${game.id}"
                            >
                                🗑️ Remove
                            </button>

                        </div>

                    </div>

                </div>

            `
        ).join("");


    // ==========================================
    // PLAY
    // ==========================================

    container
        .querySelectorAll(
            ".favorite-play-btn"
        )
        .forEach(
            button => {

                button.onclick = () => {

                    const universeId =
                        button.dataset.universeId;


                    if (!universeId) {

                        return;

                    }


                    window.open(
                        `https://www.roblox.com/games/${universeId}`,
                        "_blank"
                    );

                };

            }
        );


    // ==========================================
    // REMOVE
    // ==========================================

    container
        .querySelectorAll(
            ".favorite-remove-btn"
        )
        .forEach(
            button => {

                button.onclick = () => {

                    removeFavorite(
                        button.dataset.gameId
                    );

                    renderFavorites();

                };

            }
        );

}


// ==========================================
// FAVORITES BUTTON
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "#favorites-btn"
                    );


                if (!button) return;


                openFavorites();

            }
        );

    }
);
