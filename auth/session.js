// ==========================================
// MANATON GAMES - SESSION MANAGER
// ==========================================


// ==========================================
// CONFIG
// ==========================================

const MG_SESSION_KEY = "mg_session";


// ==========================================
// OWNER
// ==========================================

// Roblox User ID del Owner de Manaton Games

const MG_OWNER_ROBLOX_ID = "6187500560";


// ==========================================
// GET SESSION
// ==========================================

function getSession() {

    try {

        const session =
            localStorage.getItem(
                MG_SESSION_KEY
            );


        if (!session) {

            return null;

        }


        const parsed =
            JSON.parse(session);


        if (
            !parsed ||
            typeof parsed !== "object"
        ) {

            localStorage.removeItem(
                MG_SESSION_KEY
            );

            return null;

        }


        // ==========================================
        // NORMALIZAR ROBLOX USER ID
        // ==========================================

        const robloxUserId =
            parsed.robloxUserId ||
            parsed.robloxId ||
            parsed.userId ||
            null;


        if (robloxUserId) {

            parsed.robloxUserId =
                String(
                    robloxUserId
                );

        }


        // ==========================================
        // COMPROBAR OWNER
        // ==========================================

        parsed.isOwner =
            !!(
                parsed.robloxUserId &&
                String(
                    parsed.robloxUserId
                ) ===
                MG_OWNER_ROBLOX_ID
            );


        // ==========================================
        // NORMALIZAR ROLE
        // ==========================================

        if (parsed.isOwner) {

            parsed.role =
                "owner";

        }


        return parsed;

    }

    catch (error) {

        console.error(
            "❌ Error reading session:",
            error
        );


        localStorage.removeItem(
            MG_SESSION_KEY
        );


        return null;

    }

}


// ==========================================
// SAVE SESSION
// ==========================================

function saveSession(session) {

    if (
        !session ||
        typeof session !== "object"
    ) {

        console.error(
            "❌ Cannot save empty session."
        );

        return false;

    }


    try {

        // ==========================================
        // NORMALIZAR ROBLOX ID
        // ==========================================

        const robloxUserId =
            session.robloxUserId ||
            session.robloxId ||
            session.userId ||
            null;


        const normalizedSession = {

            ...session

        };


        if (robloxUserId) {

            normalizedSession.robloxUserId =
                String(
                    robloxUserId
                );

        }


        // ==========================================
        // OWNER
        // ==========================================

        normalizedSession.isOwner =
            !!(
                normalizedSession.robloxUserId &&
                String(
                    normalizedSession.robloxUserId
                ) ===
                MG_OWNER_ROBLOX_ID
            );


        if (
            normalizedSession.isOwner
        ) {

            normalizedSession.role =
                "owner";

        }


        localStorage.setItem(
            MG_SESSION_KEY,
            JSON.stringify(
                normalizedSession
            )
        );


        return true;

    }

    catch (error) {

        console.error(
            "❌ Error saving session:",
            error
        );


        return false;

    }

}


// ==========================================
// UPDATE SESSION
// ==========================================

function updateSession(data) {

    if (
        !data ||
        typeof data !== "object"
    ) {

        console.error(
            "❌ Invalid session update data."
        );

        return null;

    }


    const currentSession =
        getSession() || {};


    const newSession = {

        ...currentSession,

        ...data

    };


    const saved =
        saveSession(
            newSession
        );


    if (!saved) {

        return null;

    }


    return getSession();

}


// ==========================================
// SET ROBLOX USER ID
// ==========================================

function setRobloxUserId(
    robloxUserId
) {

    if (
        robloxUserId === undefined ||
        robloxUserId === null ||
        robloxUserId === ""
    ) {

        console.error(
            "❌ Invalid Roblox User ID."
        );

        return null;

    }


    const session =
        getSession();


    if (!session) {

        console.error(
            "❌ Cannot set Roblox User ID without an active session."
        );

        return null;

    }


    const updatedSession = {

        ...session,

        robloxUserId:
            String(
                robloxUserId
            )

    };


    if (
        String(
            robloxUserId
        ) ===
        MG_OWNER_ROBLOX_ID
    ) {

        updatedSession.isOwner =
            true;

        updatedSession.role =
            "owner";

    }

    else {

        updatedSession.isOwner =
            false;

    }


    if (
        !saveSession(
            updatedSession
        )
    ) {

        return null;

    }


    return getSession();

}


// ==========================================
// CHECK OWNER
// ==========================================

function isOwner() {

    const session =
        getSession();


    if (!session) {

        return false;

    }


    return !!(
        session.loggedIn === true &&
        session.isOwner === true &&
        String(
            session.robloxUserId
        ) ===
        MG_OWNER_ROBLOX_ID
    );

}


// ==========================================
// CHECK LOGIN
// ==========================================

function isLoggedIn() {

    const session =
        getSession();


    return !!(
        session &&
        session.loggedIn === true
    );

}


// ==========================================
// CHECK GUEST
// ==========================================

function isGuest() {

    const session =
        getSession();


    return !!(
        session &&
        session.loggedIn === true &&
        session.loginType === "guest"
    );

}


// ==========================================
// CHECK REGISTERED USER
// ==========================================

function isRegisteredUser() {

    const session =
        getSession();


    return !!(
        session &&
        session.loggedIn === true &&
        session.loginType !== "guest"
    );

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    clearSession();

    window.location.reload();

}


// ==========================================
// DELETE SESSION
// ==========================================

function clearSession() {

    localStorage.removeItem(
        MG_SESSION_KEY
    );

}


// ==========================================
// SESSION DEBUG
// ==========================================

function debugSession() {

    const session =
        getSession();


    console.log(
        "========== MANATON GAMES SESSION =========="
    );


    if (!session) {

        console.log(
            "🔴 No active session."
        );

    }

    else {

        console.log(
            "🟢 Active session:",
            session
        );


        console.log(
            "🎮 Roblox User ID:",
            session.robloxUserId ||
            "Not linked"
        );


        console.log(
            "👑 Owner:",
            isOwner()
                ? "YES"
                : "NO"
        );

    }


    console.log(
        "==========================================="
    );

}
