// ==========================================
// MANATON GAMES - ROBLOX API
// VERSION 2.5.0
// ==========================================


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

function formatNumber(number) {

    if (
        number === null ||
        number === undefined
    ) {

        return "0";

    }

    return Number(number).toLocaleString("en-US");

}


// ==========================================
// GET UNIVERSE ID
// ==========================================

async function getUniverseId(placeId) {

    try {

        const response = await fetch(
            `https://apis.roblox.com/universes/v1/places/${placeId}/universe`
        );

        if (!response.ok) {

            console.error(
                `Universe API error for ${placeId}:`,
                response.status
            );

            return null;

        }

        const data =
            await response.json();

        return data.universeId || null;

    }

    catch (error) {

        console.error(
            `Universe lookup failed for ${placeId}:`,
            error
        );

        return null;

    }

}


// ==========================================
// GET GAME THUMBNAIL
// ==========================================

async function getGameThumbnail(placeId) {

    try {

        const response = await fetch(
            `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${placeId}&size=512x512&format=Png&isCircular=false`
        );

        if (!response.ok) {

            console.error(
                `Thumbnail API error for ${placeId}:`,
                response.status
            );

            return null;

        }

        const data =
            await response.json();

        return (
            data.data?.[0]?.imageUrl ||
            null
        );

    }

    catch (error) {

        console.error(
            `Thumbnail lookup failed for ${placeId}:`,
            error
        );

        return null;

    }

}


// ==========================================
// GET GAME DATA
// ==========================================

async function getGameData(game) {

    try {

        const universeId =
            await getUniverseId(game.id);

        const thumbnail =
            await getGameThumbnail(game.id);


        if (!universeId) {

            return {

                ...game,

                universeId: null,

                thumbnail,

                players: "Coming Soon",

                visits: "Coming Soon",

                favorites: "Coming Soon",

                maxPlayers: "0",

                genre: "Unknown"

            };

        }


        const response =
            await fetch(
                `https://games.roblox.com/v1/games?universeIds=${universeId}`
            );


        if (!response.ok) {

            console.error(
                `Game API error for ${game.name}:`,
                response.status
            );

            return {

                ...game,

                universeId,

                thumbnail,

                players: "Unavailable",

                visits: "Unavailable",

                favorites: "Unavailable",

                maxPlayers: "0",

                genre: "Unknown"

            };

        }


        const data =
            await response.json();


        const robloxGame =
            data.data?.[0];


        if (!robloxGame) {

            return {

                ...game,

                universeId,

                thumbnail,

                players: "Unavailable",

                visits: "Unavailable",

                favorites: "Unavailable",

                maxPlayers: "0",

                genre: "Unknown"

            };

        }


        return {

            ...game,

            universeId,

            thumbnail,

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
                robloxGame.genre ||
                "Unknown"

        };

    }

    catch (error) {

        console.error(
            `Failed to load ${game.name}:`,
            error
        );

        return {

            ...game,

            universeId: null,

            thumbnail: null,

            players: "Unavailable",

            visits: "Unavailable",

            favorites: "Unavailable",

            maxPlayers: "0",

            genre: "Unknown"

        };

    }

}


// ==========================================
// GET ROBLOX USER BY USERNAME
// ==========================================

async function getRobloxUserByUsername(username) {

    try {

        const response =
            await fetch(
                "https://users.roblox.com/v1/usernames/users",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        usernames: [
                            username
                        ],

                        excludeBannedUsers: false

                    })

                }
            );


        if (!response.ok) {

            console.error(
                "Roblox username API error:",
                response.status
            );

            return null;

        }


        const data =
            await response.json();


        const user =
            data.data?.[0];


        if (!user) {

            return null;

        }


        return {

            id: user.id,

            username:
                user.name,

            displayName:
                user.displayName,

            requestedUsername:
                username

        };

    }

    catch (error) {

        console.error(
            "Roblox username lookup error:",
            error
        );

        return null;

    }

}


// ==========================================
// GET ROBLOX USER INFORMATION
// ==========================================

async function getRobloxUser(userId) {

    try {

        const response =
            await fetch(
                `https://users.roblox.com/v1/users/${userId}`
            );


        if (!response.ok) {

            return null;

        }


        const user =
            await response.json();


        return user;

    }

    catch (error) {

        console.error(
            "Roblox user information error:",
            error
        );

        return null;

    }

}


// ==========================================
// GET ROBLOX AVATAR
// ==========================================

async function getRobloxAvatar(userId) {

    try {

        const response =
            await fetch(
                `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`
            );


        if (!response.ok) {

            return null;

        }


        const data =
            await response.json();


        return (
            data.data?.[0]?.imageUrl ||
            null
        );

    }

    catch (error) {

        console.error(
            "Roblox avatar error:",
            error
        );

        return null;

    }

}


// ==========================================
// GET MANATON GAMES ROLE
// ==========================================

async function getRobloxGroupRole(userId) {

    try {

        const response =
            await fetch(
                `https://groups.roblox.com/v2/users/${userId}/groups/roles`
            );


        if (!response.ok) {

            return {

                groupRole: "Not in group",

                groupRank: 0

            };

        }


        const data =
            await response.json();


        const group =
            (data.data || []).find(
                item =>
                    Number(item.group?.id) ===
                    Number(GROUP_ID)
            );


        if (!group) {

            return {

                groupRole: "Not in group",

                groupRank: 0

            };

        }


        return {

            groupRole:
                group.role?.name ||
                "Not in group",

            groupRank:
                group.role?.rank ||
                0

        };

    }

    catch (error) {

        console.error(
            "Manaton Games group role error:",
            error
        );

        return {

            groupRole: "Unavailable",

            groupRank: 0

        };

    }

}


// ==========================================
// GET COMPLETE ROBLOX PROFILE
// ==========================================

async function getRobloxUserProfile(userId) {

    try {

        const user =
            await getRobloxUser(userId);


        if (!user) {

            return null;

        }


        const avatarPromise =
            getRobloxAvatar(userId);


        const rolePromise =
            getRobloxGroupRole(userId);


        const [
            avatar,
            role
        ] = await Promise.all([
            avatarPromise,
            rolePromise
        ]);


        return {

            id:
                user.id,

            username:
                user.name,

            displayName:
                user.displayName,

            avatar:
                avatar,

            groupRole:
                role.groupRole,

            groupRank:
                role.groupRank

        };

    }

    catch (error) {

        console.error(
            "Complete Roblox profile error:",
            error
        );

        return null;

    }

}


// ==========================================
// SEARCH USER BY USERNAME
// ==========================================

async function searchRobloxUser(username) {

    const user =
        await getRobloxUserByUsername(
            username
        );


    if (!user) {

        return null;

    }


    return await getRobloxUserProfile(
        user.id
    );

}


// ==========================================
// HANDLER
// ==========================================

export default async function handler(req, res) {

    // ==========================================
    // CORS
    // ==========================================

    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    // ==========================================
    // OPTIONS
    // ==========================================

    if (req.method === "OPTIONS") {

        return res.status(200).end();

    }


    // ==========================================
    // CACHE
    // ==========================================

    res.setHeader(
        "Cache-Control",
        "s-maxage=60, stale-while-revalidate=120"
    );


    // ==========================================
    // USER BY USERNAME
    // ==========================================

    if (req.query.username) {

        const username =
            String(
                req.query.username
            ).trim();


        if (!username) {

            return res.status(400).json({

                success: false,

                error:
                    "Username is required."

            });

        }


        const user =
            await searchRobloxUser(
                username
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                error:
                    "Roblox user not found."

            });

        }


        return res.status(200).json({

            success: true,

            user

        });

    }


    // ==========================================
    // USER BY USER ID
    // ==========================================

    if (req.query.userId) {

        const userId =
            Number(
                req.query.userId
            );


        if (
            !Number.isInteger(userId) ||
            userId <= 0
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "Invalid Roblox User ID."

            });

        }


        const user =
            await getRobloxUserProfile(
                userId
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                error:
                    "Roblox user could not be found."

            });

        }


        return res.status(200).json({

            success: true,

            user

        });

    }


    // ==========================================
    // NORMAL MANATON GAMES API
    // ==========================================

    try {

        // ==========================================
        // GROUP
        // ==========================================

        let members = 0;


        try {

            const groupResponse =
                await fetch(
                    `https://groups.roblox.com/v1/groups/${GROUP_ID}`
                );


            if (groupResponse.ok) {

                const groupData =
                    await groupResponse.json();


                members =
                    groupData.memberCount ||
                    0;

            }

        }

        catch (error) {

            console.error(
                "Group API error:",
                error
            );

        }


        // ==========================================
        // GAMES
        // ==========================================

        const games =
            await Promise.all(
                GAMES.map(
                    game =>
                        getGameData(game)
                )
            );


        // ==========================================
        // TOTAL VISITS
        // ==========================================

        const totalVisits =
            games.reduce(
                (total, game) => {

                    return (
                        total +
                        (
                            Number(
                                String(
                                    game.visits
                                ).replace(
                                    /,/g,
                                    ""
                                )
                            ) || 0
                        )
                    );

                },
                0
            );


        // ==========================================
        // TOTAL FAVORITES
        // ==========================================

        const totalFavorites =
            games.reduce(
                (total, game) => {

                    return (
                        total +
                        (
                            Number(
                                String(
                                    game.favorites
                                ).replace(
                                    /,/g,
                                    ""
                                )
                            ) || 0
                        )
                    );

                },
                0
            );


        // ==========================================
        // TOTAL PLAYING
        // ==========================================

        const totalPlaying =
            games.reduce(
                (total, game) => {

                    return (
                        total +
                        (
                            Number(
                                String(
                                    game.players
                                ).replace(
                                    /,/g,
                                    ""
                                )
                            ) || 0
                        )
                    );

                },
                0
            );


        // ==========================================
        // RESPONSE
        // ==========================================

        const data = {

            success: true,

            studio:
                "Manaton Games",

            version:
                "2.5.0",

            group: {

                id:
                    GROUP_ID,

                members

            },

            stats: {

                totalGames:
                    games.length,

                totalVisits,

                totalFavorites,

                totalPlaying

            },

            games

        };


        return res.status(200).json(
            data
        );

    }

    catch (error) {

        console.error(
            "Roblox API Handler Error:",
            error
        );


        return res.status(500).json({

            success: false,

            error:
                "Failed to fetch Roblox data."

        });

    }

}
