const GAMES = [
    {
        id: 90485309557694,
        name: "PLS DONATE 3",
        status: "In Development"
    },
    {
        id: 91290129805346,
        name: "+1 Speed Escape",
        status: "Released"
    }
];

export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");

    const data = {

        success: true,

        studio: "Manaton Games",

        version: "2.1.0",

        group: {

            id: 15973191,

            members: 0

        },

        stats: {

            totalGames: GAMES.length,

            totalVisits: 0,

            totalFavorites: 0,

            totalPlaying: 0

        },

        games: GAMES

    };

    res.status(200).json(data);

}
