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

        // Avisar al resto de la página
        window.dispatchEvent(
            new CustomEvent(
                "favoritesUpdated"
            )
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

    if (!game || !game.id) {

        console.error(
            "❌ Cannot add favorite: invalid game."
        );

        return false;

    }


    const favorites =
        getFavorites();


    // Ya existe
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

        id:
            game.id,

        name:
            game.name ||
            "Unknown Game",

        thumbnail:
            game.thumbnail ||
            game.image ||
            "assets/logo/logo.png",

        universeId:
            game.universeId ||
            null,

        status:
            game.status ||
            "Unknown"

    });


    const saved =
        saveFavorites(
            favorites
        );


    if (saved) {

        console.log(
            "⭐ Game added to favorites:",
            game.name
        );

    }


    return saved;

}


// ==========================================
// REMOVE FAVORITE
// ==========================================

function removeFavorite(gameId) {

    if (!gameId) {

        return false;

    }


    const favorites =
        getFavorites();


    const updated =
        favorites.filter(
            favorite =>
                Number(favorite.id) !==
                Number(gameId)
        );


    const saved =
        saveFavorites(
            updated
        );


    if (saved) {

        console.log(
            "🗑️ Game removed from favorites:",
            gameId
        );

    }


    return saved;

}


// ==========================================
// TOGGLE FAVORITE
// ==========================================

function toggleFavorite(game) {

    if (!game || !game.id) {

        console.error(
            "❌ toggleFavorite recibió un juego inválido:",
            game
        );

        return false;

    }


    const gameId =
        game.id;


    // ==========================================
    // REMOVE
    // ==========================================

    if (
        isFavorite(gameId)
    ) {

        removeFavorite(
            gameId
        );

    }

    // ==========================================
    // ADD
    // ==========================================

    else {

        addFavorite(
            game
        );

    }


    // ==========================================
    // DEVOLVER ESTADO REAL
    // ==========================================

    const newState =
        isFavorite(
            gameId
        );


    console.log(
        newState
            ? "⭐ Favorited:"
            : "☆ Unfavorited:",
        game.name
    );


    return newState;

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
                type="button"
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


    const closeButton =
        document.getElementById(
            "close-favorites"
        );


    if (closeButton) {

        closeButton.onclick = () => {

            modal.remove();

        };

    }


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


    if (!container) {

        return;

    }


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
                                data-game-id="${game.id}"
                                type="button"
                            >
                                🎮 Play
                            </button>


                            <button
                                class="favorite-remove-btn"
                                data-game-id="${game.id}"
                                type="button"
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

                    const gameId =
                        button.dataset.gameId;


                    if (!gameId) {

                        return;

                    }


                    window.open(
                        `https://www.roblox.com/games/${gameId}`,
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

                    const gameId =
                        button.dataset.gameId;


                    removeFavorite(
                        gameId
                    );


                    renderFavorites();


                    // Actualizar botones de las tarjetas
                    if (
                        typeof refreshFavoriteButtons ===
                        "function"
                    ) {

                        refreshFavoriteButtons();

                    }

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


                if (!button) {

                    return;

                }


                event.preventDefault();


                openFavorites();

            }
        );

    }
);
