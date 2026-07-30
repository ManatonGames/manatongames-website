// ==========================================
// GOOGLE AUTH
// ==========================================

const GOOGLE_CLIENT_ID =
"567381341593-u40i0pbsefkihmhluo87d805lc2tbr6v.apps.googleusercontent.com";

window.addEventListener("load", () => {

    google.accounts.id.initialize({

        client_id: GOOGLE_CLIENT_ID,

        callback: handleGoogleLogin

    });

    const googleButton = document.getElementById("google-login-btn");

    if (!googleButton) return;

    googleButton.addEventListener("click", () => {

        google.accounts.id.prompt();

    });

});

function handleGoogleLogin(response){

    console.log(response);

}
