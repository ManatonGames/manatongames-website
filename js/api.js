class RobloxAPI {

    // ==========================
    // ROBLOX STATS
    // ==========================

    static async getStats(){

        try{

            const response = await fetch("/api/roblox");

            return await response.json();

        }

        catch(error){

            console.error("Stats API Error:", error);

            return null;

        }

    }

    // ==========================
    // GAMES
    // ==========================

    static async getGames(){

        try{

            const response = await fetch("/data/games.json");

            return await response.json();

        }

        catch(error){

            console.error("Games API Error:", error);

            return [];

        }

    }

    // ==========================
    // NEWS
    // ==========================

    static async getNews(){

        try{

            const response = await fetch("/data/news.json");

            return await response.json();

        }

        catch(error){

            console.error("News API Error:", error);

            return [];

        }

    }

}
