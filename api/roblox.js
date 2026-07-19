export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");

    return res.status(200).json({

        success: true,

        studio: "Manaton Games",

        version: "2.0.0",

        roblox: {

            groupId: 15973191,

            games: [

                {
                    id: 90485309557694,
                    name: "PLS DONATE 3"
                },

                {
                    id: 91290129805346,
                    name: "+1 Speed Escape"
                }

            ]

        }

    });

}
