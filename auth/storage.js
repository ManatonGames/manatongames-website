// ==========================================
// MANATON GAMES - STORAGE MANAGER
// VERSION 1.0.0
// ==========================================


// ==========================================
// STORAGE PREFIX
// ==========================================

const MG_STORAGE_PREFIX = "mg_";


// ==========================================
// GET DATA
// ==========================================

function storageGet(key) {

    if (!key) {
        return null;
    }

    try {

        const value =
            localStorage.getItem(
                MG_STORAGE_PREFIX + key
            );

        if (value === null) {
            return null;
        }

        return JSON.parse(value);

    }

    catch (error) {

        console.error(
            "❌ Storage read error:",
            error
        );

        return null;

    }

}


// ==========================================
// SAVE DATA
// ==========================================

function storageSet(key, value) {

    if (!key) {

        console.error(
            "❌ Storage key is required."
        );

        return false;

    }

    try {

        localStorage.setItem(

            MG_STORAGE_PREFIX + key,

            JSON.stringify(value)

        );

        return true;

    }

    catch (error) {

        console.error(
            "❌ Storage save error:",
            error
        );

        return false;

    }

}


// ==========================================
// REMOVE DATA
// ==========================================

function storageRemove(key) {

    if (!key) {
        return false;
    }

    try {

        localStorage.removeItem(
            MG_STORAGE_PREFIX + key
        );

        return true;

    }

    catch (error) {

        console.error(
            "❌ Storage remove error:",
            error
        );

        return false;

    }

}


// ==========================================
// CHECK DATA
// ==========================================

function storageHas(key) {

    if (!key) {
        return false;
    }

    return (
        localStorage.getItem(
            MG_STORAGE_PREFIX + key
        ) !== null
    );

}


// ==========================================
// CLEAR MANATON GAMES STORAGE
// ==========================================

function storageClear() {

    try {

        const keys = [];

        for (
            let i = 0;
            i < localStorage.length;
            i++
        ) {

            const key =
                localStorage.key(i);

            if (
                key &&
                key.startsWith(
                    MG_STORAGE_PREFIX
                )
            ) {

                keys.push(key);

            }

        }


        keys.forEach(
            key => {

                localStorage.removeItem(
                    key
                );

            }
        );


        return true;

    }

    catch (error) {

        console.error(
            "❌ Storage clear error:",
            error
        );

        return false;

    }

}
