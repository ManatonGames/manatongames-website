const GAMES = [
    {
        id: 119931726939482,
        name: "Roblox Universe",
        status: "In Development"
    },
    {
        id: 90485309557694,
        name: "PLS DONATE 3",
        status: "In Development"
    },
    {
        id: 85429358558858,
        name: "PLS DONATE 2",
        status: "Released"
    },
    {
        id: 96375607261155,
        name: "PLS DONATE 1",
        status: "In Development"
    },
    {
        id: 101466148396273,
        name: "Grow a Garden Modded 2.0",
        status: "Released"
    },
    {
        id: 89252171510608,
        name: "MG | Ranks Shopping Center",
        status: "Released"
    },
    {
        id: 91290129805346,
        name: "+1 Speed Escape",
        status: "In Development"
    }
];

const GROUP_ID = 15973191;


// ==========================================
// FORMAT NUMBER
// ==========================================

function formatNumber(number){

    if(number === null || number === undefined){

        return "0";

    }

    return Number(number).toLocaleString("en-US");

}


// ==========================================
// GET UNIVERSE ID
// ==========================================

async function getUniverseId(placeId){

    try{

        const response = await fetch(
            `https://apis.roblox.com/universes/v1/places/${placeId}/universe`
        );

        if(!response.ok){

            console.error(
                `Universe API error for ${placeId}:`,
                response.status
            );

            return null;

        }

        const data = await response.json();

        return data.universeId || null;

    }catch(error){

        console.error(
            `Universe lookup failed for ${placeId}:`,
            error
        );

        return null;

    }

}


// ==========================================
// GET GAME DATA
// ==========================================

async function getGameData(game){

    try{

        const universeId =
            await getUniverseId(game.id);

        if(!universeId){

            return {

                ...game,

                universeId:null,

                players:"Coming Soon",

                visits:"Coming Soon",

                favorites:"Coming Soon",

                maxPlayers:0

            };

        }

        const response = await fetch(
            `https://games.roblox.com/v1/games?universeIds=${universeId}`
        );

        if(!response.ok){

            console.error(
                `Game API error for ${game.name}:`,
                response.status
            );

            return {

                ...game,

                universeId,

                players:"Unavailable",

                visits:"Unavailable",

                favorites:"Unavailable",

                maxPlayers:0

            };

        }

        const data = await response.json();

        const robloxGame =
            data.data?.[0];

        if(!robloxGame){

            return {

                ...game,

                universeId,

                players:"Unavailable",

                visits:"Unavailable",

                favorites:"Unavailable",

                maxPlayers:0

            };

        }

        return {

    ...game,

    universeId,

    players:
        formatNumber(
            robloxGame.playing
        ),

    maxPlayers:
        formatNumber(
            robloxGame.maxPlayers
        ),

    visits:
        formatNumber(
            robloxGame.visits
        ),

    favorites:
        formatNumber(
            robloxGame.favoritedCount
        ),

    genre:
        robloxGame.genre || "Unknown"

};

    }catch(error){

        console.error(
            `Failed to load ${game.name}:`,
            error
        );

        return {

            ...game,

            universeId:null,

            players:"Unavailable",

            visits:"Unavailable",

            favorites:"Unavailable",

            maxPlayers:0

        };

    }

}


// ==========================================
// HANDLER
// ==========================================

export default async function handler(req, res){

    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Cache-Control",
        "s-maxage=60, stale-while-revalidate=120"
    );

    try{

        // ==========================
        // GROUP
        // ==========================

        let members = 0;

        try{

            const groupResponse =
                await fetch(
                    `https://groups.roblox.com/v1/groups/${GROUP_ID}`
                );

            if(groupResponse.ok){

                const groupData =
                    await groupResponse.json();

                members =
                    groupData.memberCount || 0;

            }

        }catch(error){

            console.error(
                "Group API error:",
                error
            );

        }


        // ==========================
        // GAMES
        // ==========================

        const games =
            await Promise.all(
                GAMES.map(
                    game =>
                        getGameData(game)
                )
            );


        // ==========================
        // TOTAL STATS
        // ==========================

        const totalVisits =
            games.reduce(
                (total, game) =>
                    total +
                    (
                        Number(
                            String(game.visits)
                                .replace(/,/g, "")
                        ) || 0
                    ),
                0
            );

        const totalFavorites =
            games.reduce(
                (total, game) =>
                    total +
                    (
                        Number(
                            String(game.favorites)
                                .replace(/,/g, "")
                        ) || 0
                    ),
                0
            );

        const totalPlaying =
            games.reduce(
                (total, game) =>
                    total +
                    (
                        Number(
                            String(game.players)
                                .replace(/,/g, "")
                        ) || 0
                    ),
                0
            );


        // ==========================
        // RESPONSE
        // ==========================

        const data = {

            success:true,

            studio:"Manaton Games",

            version:"2.2.0",

            group:{

                id:GROUP_ID,

                members

            },

            stats:{

                totalGames:games.length,

                totalVisits,

                totalFavorites,

                totalPlaying

            },

            games

        };


        res.status(200).json(data);

    }catch(error){

        console.error(
            "Roblox API Handler Error:",
            error
        );

        res.status(500).json({

            success:false,

            error:
                "Failed to fetch Roblox data."

        });

    }

}
