const games = [
    {
        id: 90485309557694,
        name: "PLS DONATE 3",
        status: "In Development",
        url: "https://www.roblox.com/games/90485309557694/PLS-DONATE-3"
    },
    {
        id: 91290129805346,
        name: "+1 Speed Escape",
        status: "Released",
        url: "https://www.roblox.com/games/91290129805346"
    }
];

export default async function handler(req, res) {

    res.status(200).json({

        success: true,

        studio: {
            name: "Manaton Games",
            version: "2.1.0"
        },

        group: {
            id: 15973191,
            url: "https://www.roblox.com/communities/15973191"
        },

        social: {

            youtube: "https://www.youtube.com/@ManatonGames",

            twitch: "https://www.twitch.tv/manatongames2026",

            discord: "https://discord.gg/uYRCyAtWp5"

        },

        games

    });

}
