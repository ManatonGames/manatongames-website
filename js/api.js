class RobloxAPI {

    static async getStats(){

        try{

            const response = await fetch("/api/roblox");

            return await response.json();

        }

        catch(error){

            console.error(error);

            return null;

        }

    }

}
