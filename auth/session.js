// ==========================================
// MANATON GAMES - SESSION MANAGER
// ==========================================

const MG_SESSION_KEY = "mg_session";


// ==========================================
// GET SESSION
// ==========================================

function getSession() {

    try {

        const session =
            localStorage.getItem(MG_SESSION_KEY);

        if (!session) {

            return null;

        }

        return JSON.parse(session);

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

    if (!session) {

        console.error(
            "❌ Cannot save empty session."
        );

        return false;

    }

    try {

        localStorage.setItem(
            MG_SESSION_KEY,
            JSON.stringify(session)
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

    if (!data || typeof data !== "object") {

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
        saveSession(newSession);

    if (!saved) {

        return null;

    }

    return newSession;

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

    }

    console.log(
        "==========================================="
    );

}
