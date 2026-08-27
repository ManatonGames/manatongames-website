// ==========================================
// MANATON GAMES - API MANAGER
// ==========================================


// ==========================================
// ROBLOX API
// ==========================================

class RobloxAPI {

    // ==========================================
    // ROBLOX STATS
    // ==========================================

    static async getStats() {

        try {

            const response =
                await fetch(
                    "/api/roblox",
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Stats API returned ${response.status}`
                );

            }


            return await response.json();

        }

        catch (error) {

            console.error(
                "❌ Stats API Error:",
                error
            );

            return null;

        }

    }


    // ==========================================
    // GAMES
    // ==========================================

    static async getGames() {

        try {

            const response =
                await fetch(
                    "/data/games.json",
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Games API returned ${response.status}`
                );

            }


            return await response.json();

        }

        catch (error) {

            console.error(
                "❌ Games API Error:",
                error
            );

            return [];

        }

    }


    // ==========================================
    // NEWS
    // ==========================================

    static async getNews() {

        try {

            const response =
                await fetch(
                    "/data/news.json",
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `News API returned ${response.status}`
                );

            }


            return await response.json();

        }

        catch (error) {

            console.error(
                "❌ News API Error:",
                error
            );

            return [];

        }

    }


    // ==========================================
    // WEBSITE VERSION
    // ==========================================

    static async getVersion() {

        try {

            const response =
                await fetch(
                    "/data/version.json",
                    {
                        cache: "no-store"
                    }
                );


            // ==========================================
            // CHECK HTTP RESPONSE
            // ==========================================

            if (!response.ok) {

                throw new Error(
                    `Version API returned ${response.status}`
                );

            }


            // ==========================================
            // READ RAW RESPONSE
            // ==========================================

            const text =
                await response.text();


            console.log(
                "📦 version.json response:",
                text
            );


            // ==========================================
            // PARSE JSON
            // ==========================================

            try {

                return JSON.parse(text);

            }

            catch (jsonError) {

                console.error(
                    "❌ version.json contains invalid JSON:",
                    jsonError
                );

                console.error(
                    "📄 Received content:",
                    text
                );

                return null;

            }

        }

        catch (error) {

            console.error(
                "❌ Version API Error:",
                error
            );

            return null;

        }

    }

}


// ==========================================
// MANATON GAMES - DATABASE API
// ==========================================

class MGApi {

    // ==========================================
    // BASE REQUEST
    // ==========================================

    static async request(
        endpoint,
        options = {}
    ) {

        try {

            const response =
                await fetch(
                    `/api${endpoint}`,
                    {
                        ...options,

                        headers: {

                            "Content-Type":
                                "application/json",

                            ...(options.headers || {})

                        }

                    }
                );


            // ==========================================
            // READ RESPONSE
            // ==========================================

            const data =
                await response.json();


            // ==========================================
            // CHECK RESPONSE
            // ==========================================

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    `API returned ${response.status}`
                );

            }


            return data;

        }

        catch (error) {

            console.error(
                "❌ Manaton Games API Error:",
                error
            );

            throw error;

        }

    }


    // ==========================================
    // GET USERS
    // ==========================================

    static async getUsers() {

        return await this.request(
            "/users",
            {
                method: "GET"
            }
        );

    }


    // ==========================================
    // CREATE USER
    // ==========================================

    static async createUser(
        userData
    ) {

        return await this.request(
            "/users",
            {
                method: "POST",

                body:
                    JSON.stringify(
                        userData
                    )

            }
        );

    }

}


// ==========================================
// MANATON GAMES API READY
// ==========================================

console.log(
    "✅ Manaton Games API Manager loaded."
);
