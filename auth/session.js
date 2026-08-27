// ==========================================
// MANATON GAMES - SESSION MANAGER
// VERSION 2.0.0
// ==========================================


// ==========================================
// SESSION STORAGE KEY
// ==========================================

const MG_SESSION_STORAGE_KEY = "session";


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
            storageGet(
                MG_SESSION_STORAGE_KEY
            );


        if (!session) {

            return null;

        }


        if (
            typeof session !== "object" ||
            Array.isArray(session)
        ) {

            storageRemove(
                MG_SESSION_STORAGE_KEY
            );

            return null;

        }


        // ==========================================
        // NORMALIZAR ROBLOX USER ID
        // ==========================================

        const robloxUserId =
            session.robloxUserId ||
            session.robloxId ||
            session.userId ||
            null;


        if (robloxUserId !== null) {

            session.robloxUserId =
                String(
                    robloxUserId
                );

        }


        // ==========================================
        // COMPROBAR OWNER
        // ==========================================

        session.isOwner =
            !!(
                session.robloxUserId &&
                String(
                    session.robloxUserId
                ) ===
                MG_OWNER_ROBLOX_ID
            );


        // ==========================================
        // NORMALIZAR ROLE
        // ==========================================

        if (session.isOwner) {

            session.role =
                "owner";

        }


        return session;

    }

    catch (error) {

        console.error(
            "❌ Error reading session:",
            error
        );

        storageRemove(
            MG_SESSION_STORAGE_KEY
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
        typeof session !== "object" ||
        Array.isArray(session)
    ) {

        console.error(
            "❌ Cannot save invalid session."
        );

        return false;

    }


    try {

        // ==========================================
        // COPY SESSION
        // ==========================================

        const normalizedSession = {

            ...session

        };


        // ==========================================
        // NORMALIZE ROBLOX ID
        // ==========================================

        const robloxUserId =
            normalizedSession.robloxUserId ||
            normalizedSession.robloxId ||
            normalizedSession.userId ||
            null;


        if (robloxUserId !== null) {

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


        // ==========================================
        // SAVE
        // ==========================================

        return storageSet(
            MG_SESSION_STORAGE_KEY,
            normalizedSession
        );

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
        typeof data !== "object" ||
        Array.isArray(data)
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


    // ==========================================
    // OWNER
    // ==========================================

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

    storageRemove(
        MG_SESSION_STORAGE_KEY
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
