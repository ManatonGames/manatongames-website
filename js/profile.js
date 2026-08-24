// ==========================================
// MANATON GAMES - PROFILE
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

    if (document.getElementById("profile-modal")) return;

    const session = getSession();

    if (!session) return;


    const modal =
        document.createElement("div");

    modal.id = "profile-modal";


    modal.innerHTML = `

        <div class="profile-card">

            <button
                id="close-profile"
                class="profile-close-btn"
                type="button"
            >
                ✕
            </button>


            <!-- ==================================
                 PROFILE HEADER
            ================================== -->

            <div class="profile-header">

                <img
                    src="${session.avatar || "assets/logo/logo.png"}"
                    class="profile-avatar"
                    alt="Profile Avatar"
                >

                <h2>
                    ${escapeHTML(session.username || "Guest")}
                </h2>

                <p>
                    ${escapeHTML(
                        session.loginType || "Guest"
                    )} Account
                </p>

            </div>


            <!-- ==================================
                 PROFILE INFORMATION
            ================================== -->

            <div class="profile-info">

                <div class="profile-info-item">

                    <span>Username</span>

                    <strong>
                        ${escapeHTML(
                            session.username || "Guest"
                        )}
                    </strong>

                </div>


                <div class="profile-info-item">

                    <span>Account Type</span>

                    <strong>
                        ${escapeHTML(
                            session.loginType || "Guest"
                        )}
                    </strong>

                </div>


                <div class="profile-info-item">

                    <span>Status</span>

                    <strong>
                        🟢 Online
                    </strong>

                </div>


                <div class="profile-info-item">

                    <span>Manaton Games Role</span>

                    <strong id="roblox-role">
                        ${
                            session.robloxUserId
                                ? "🔄 Loading..."
                                : "Not linked"
                        }
                    </strong>

                </div>


                <div class="profile-info-item">

                    <span>Roblox Rank</span>

                    <strong id="roblox-rank">
                        ${
                            session.robloxUserId
                                ? "🔄 Loading..."
                                : "—"
                        }
                    </strong>

                </div>


                <div class="profile-info-item">

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

                    <span>🎮</span>

                    <span>Roblox Account</span>

                </div>


                ${
                    session.robloxUserId
                    ? `

                        <div class="roblox-linked-account">

                            <img
                                src="${
                                    session.robloxAvatar ||
                                    getRobloxAvatarURL(
                                        session.robloxUserId
                                    )
                                }"
                                class="roblox-linked-avatar"
                                alt="Roblox Avatar"
                            >

                            <div class="roblox-linked-info">

                                <strong>
                                    ${escapeHTML(
                                        session.robloxUsername ||
                                        "Roblox User"
                                    )}
                                </strong>

                                ${
                                    session.robloxDisplayName
                                    ? `
                                        <span>
                                            ${escapeHTML(
                                                session.robloxDisplayName
                                            )}
                                        </span>
                                    `
                                    : ""
                                }

                                <small>
                                    User ID:
                                    ${session.robloxUserId}
                                </small>

                            </div>

                        </div>

                    `
                    : `

                        <div
                            id="roblox-account-status"
                            class="roblox-account-status"
                        >
                            🔗 No Roblox account linked
                        </div>

                    `
                }


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

        closeButton.onclick = () => {

            modal.remove();

        };

    }


    // ==========================================
    // CLOSE WHEN CLICKING OUTSIDE
    // ==========================================

    modal.addEventListener(
        "click",
        (event) => {

            if (event.target === modal) {

                modal.remove();

            }

        }
    );


    // ==========================================
    // LINK ROBLOX
    // ==========================================

    const linkButton =
        document.getElementById(
            "link-roblox-btn"
        );

    if (linkButton) {

        linkButton.onclick = () => {

            openRobloxLinkModal();

        };

    }


    // ==========================================
    // LOAD ROBLOX ROLE
    // ==========================================

    await loadRobloxRole(session);

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


    if (!roleElement || !rankElement) {

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
    // REQUEST API
    // ==========================================

    try {

        const response =
            await fetch(
                `/api/roblox?userId=${encodeURIComponent(
                    session.robloxUserId
                )}`
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
                "Invalid Roblox API response"
            );

        }


        // ==========================================
        // SAVE EXTRA ROBLOX DATA
        // ==========================================

        session.robloxUsername =
            data.user.username ||
            session.robloxUsername;

        session.robloxDisplayName =
            data.user.displayName ||
            session.robloxDisplayName;

        session.robloxUserId =
            data.user.id ||
            session.robloxUserId;


        saveSession(session);


        // ==========================================
        // DISPLAY ROLE
        // ==========================================

        roleElement.textContent =
            data.user.groupRole ||
            "Not in group";


        rankElement.textContent =
            data.user.groupRank !== undefined
                ? data.user.groupRank
                : "0";


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

    if (
        document.getElementById(
            "roblox-link-modal"
        )
    ) {

        return;

    }


    const modal =
        document.createElement("div");

    modal.id =
        "roblox-link-modal";


    modal.innerHTML = `

        <div class="roblox-link-card">

            <button
                id="close-roblox-link"
                class="roblox-close-btn"
                type="button"
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
                Enter your Roblox username to
                find your account.
            </p>


            <input
                id="roblox-username-input"
                type="text"
                placeholder="Roblox username"
                autocomplete="off"
                maxlength="20"
            >


            <button
                id="search-roblox-btn"
                class="profile-action-btn"
                type="button"
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

    const closeButton =
        document.getElementById(
            "close-roblox-link"
        );

    if (closeButton) {

        closeButton.onclick = () => {

            modal.remove();

        };

    }


    // ==========================================
    // CLOSE OUTSIDE
    // ==========================================

    modal.addEventListener(
        "click",
        (event) => {

            if (event.target === modal) {

                modal.remove();

            }

        }
    );


    // ==========================================
    // SEARCH BUTTON
    // ==========================================

    const searchButton =
        document.getElementById(
            "search-roblox-btn"
        );

    if (searchButton) {

        searchButton.onclick =
            searchRobloxUser;

    }


    // ==========================================
    // ENTER KEY
    // ==========================================

    const input =
        document.getElementById(
            "roblox-username-input"
        );

    if (input) {

        input.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter"
                ) {

                    searchRobloxUser();

                }

            }
        );


        setTimeout(() => {

            input.focus();

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

    const button =
        document.getElementById(
            "search-roblox-btn"
        );


    if (!input || !result) return;


    const username =
        input.value.trim();


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

    if (button) {

        button.disabled = true;

        button.textContent =
            "🔄 Searching...";

    }


    result.innerHTML = `

        <div class="roblox-loading">

            <span class="roblox-loading-icon">
                🔄
            </span>

            <span>
                Searching Roblox...
            </span>

        </div>

    `;


    try {

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


        if (!response.ok) {

            throw new Error(
                `Roblox returned ${response.status}`
            );

        }


        const data =
            await response.json();


        const user =
            data.data?.[0];


        if (!user) {

            result.innerHTML = `

                <div class="roblox-error">

                    ❌ Roblox user not found.

                    <small>
                        Check the username and try again.
                    </small>

                </div>

            `;

            return;

        }


        // ==========================================
        // GET ROBLOX AVATAR
        // ==========================================

        let avatarURL =
            getRobloxAvatarURL(user.id);


        try {

            const avatarResponse =
                await fetch(
                    `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=false`
                );


            if (avatarResponse.ok) {

                const avatarData =
                    await avatarResponse.json();

                const image =
                    avatarData.data?.[0]?.imageUrl;

                if (image) {

                    avatarURL = image;

                }

            }

        }

        catch (avatarError) {

            console.warn(
                "⚠️ Could not load Roblox avatar:",
                avatarError
            );

        }


        // ==========================================
        // SHOW ACCOUNT
        // ==========================================

        result.innerHTML = `

            <div class="roblox-found">

                <div class="roblox-found-header">

                    <img
                        src="${avatarURL}"
                        class="roblox-found-avatar"
                        alt="Roblox Avatar"
                    >

                    <div class="roblox-found-info">

                        <h3>
                            ${escapeHTML(
                                user.name
                            )}
                        </h3>

                        ${
                            user.displayName
                            ? `
                                <p>
                                    ${escapeHTML(
                                        user.displayName
                                    )}
                                </p>
                            `
                            : ""
                        }

                        <span>
                            User ID:
                            <strong>
                                ${user.id}
                            </strong>
                        </span>

                    </div>

                </div>


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
        // SELECT ACCOUNT
        // ==========================================

        const confirmButton =
            document.getElementById(
                "confirm-roblox-btn"
            );


        if (confirmButton) {

            confirmButton.onclick = () => {

                selectRobloxAccount(
                    user,
                    avatarURL
                );

            };

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

                <small>
                    Please try again in a moment.
                </small>

            </div>

        `;

    }

    finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "🔍 Find Account";

        }

    }

}


// ==========================================
// SELECT ROBLOX ACCOUNT
// ==========================================

function selectRobloxAccount(
    user,
    avatarURL
) {

    const session =
        getSession();


    if (!session) return;


    // ==========================================
    // SAVE ROBLOX INFORMATION
    // ==========================================

    session.robloxUserId =
        user.id;

    session.robloxUsername =
        user.name;

    session.robloxDisplayName =
        user.displayName ||
        user.name;

    session.robloxAvatar =
        avatarURL;


    // ==========================================
    // SAVE SESSION
    // ==========================================

    const saved =
        saveSession(session);


    if (!saved) {

        console.error(
            "❌ Could not save Roblox account."
        );

        return;

    }


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
    // REFRESH PROFILE
    // ==========================================

    const profileModal =
        document.getElementById(
            "profile-modal"
        );

    if (profileModal) {

        profileModal.remove();

    }


    openProfile();

}


// ==========================================
// ROBLOX AVATAR FALLBACK
// ==========================================

function getRobloxAvatarURL(userId) {

    return (
        `https://tr.rbxcdn.com/`
        +
        `avatar-headshot?userId=`
        +
        encodeURIComponent(userId)
    );

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
