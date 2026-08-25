// ==========================================
// MANATON GAMES - PRIVATE MODE
// ==========================================

function initializePrivateMode() {

    const privateMode =
        document.getElementById(
            "private-mode"
        );


    if (!privateMode) {

        return;

    }


    // ==========================================
    // PUBLIC
    // ==========================================

    if (
        typeof WEBSITE_MODE === "undefined" ||
        WEBSITE_MODE !== "private"
    ) {

        privateMode.classList.remove(
            "active"
        );

        return;

    }


    // ==========================================
    // PRIVATE
    // ==========================================

    privateMode.classList.add(
        "active"
    );


    // ==========================================
    // TEXT
    // ==========================================

    if (
        typeof PRIVATE_MODE_CONFIG !==
        "undefined"
    ) {

        const title =
            document.getElementById(
                "private-title"
            );


        const brand =
            document.getElementById(
                "private-brand"
            );


        const subtitle =
            document.getElementById(
                "private-subtitle"
            );


        const description =
            document.getElementById(
                "private-description"
            );


        const footer =
            document.getElementById(
                "private-footer"
            );


        if (title) {

            title.textContent =
                PRIVATE_MODE_CONFIG.title;

        }


        if (brand) {

            brand.textContent =
                PRIVATE_MODE_CONFIG.brand;

        }


        if (subtitle) {

            subtitle.textContent =
                PRIVATE_MODE_CONFIG.subtitle;

        }


        if (description) {

            description.textContent =
                PRIVATE_MODE_CONFIG.description;

        }


        if (footer) {

            footer.textContent =
                PRIVATE_MODE_CONFIG.footer;

        }

    }


    // ==========================================
    // BLOQUEAR SCROLL
    // ==========================================

    document.body.style.overflow =
        "hidden";


    // ==========================================
    // OCULTAR CONTENIDO
    // ==========================================

    const websiteContent =
        document.getElementById(
            "website-content"
        );


    if (websiteContent) {

        websiteContent.style.display =
            "none";

    }

}
