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
