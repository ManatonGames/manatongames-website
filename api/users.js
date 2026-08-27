// ==========================================
// MANATON GAMES - USERS API
// ==========================================

import { neon } from "@neondatabase/serverless";


// ==========================================
// DATABASE CONNECTION
// ==========================================

const sql = neon(process.env.DATABASE_URL);


// ==========================================
// API HANDLER
// ==========================================

export default async function handler(req, res) {

    // --------------------------------------
    // CORS / BASIC HEADERS
    // --------------------------------------

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


    // --------------------------------------
    // OPTIONS
    // --------------------------------------

    if (req.method === "OPTIONS") {

        return res.status(200).end();

    }


    try {

        // ==================================
        // GET USERS
        // ==================================

        if (req.method === "GET") {

            const users = await sql`
                SELECT
                    id,
                    username,
                    roblox_user_id,
                    login_type,
                    role,
                    display_name,
                    avatar_url,
                    created_at,
                    updated_at
                FROM users
                ORDER BY created_at DESC
            `;


            return res.status(200).json({

                success: true,

                users

            });

        }


        // ==================================
        // POST USER
        // ==================================

        if (req.method === "POST") {

            const {
                username,
                roblox_user_id,
                login_type,
                display_name,
                avatar_url
            } = req.body || {};


            // --------------------------------
            // VALIDATE USERNAME
            // --------------------------------

            if (
                !username ||
                typeof username !== "string"
            ) {

                return res.status(400).json({

                    success: false,

                    error: "Username is required."

                });

            }


            // --------------------------------
            // CREATE USER
            // --------------------------------

            const result = await sql`
                INSERT INTO users (
                    username,
                    roblox_user_id,
                    login_type,
                    display_name,
                    avatar_url
                )
                VALUES (
                    ${username},
                    ${roblox_user_id || null},
                    ${login_type || "registered"},
                    ${display_name || username},
                    ${avatar_url || null}
                )
                RETURNING
                    id,
                    username,
                    roblox_user_id,
                    login_type,
                    role,
                    display_name,
                    avatar_url,
                    created_at,
                    updated_at
            `;


            return res.status(201).json({

                success: true,

                user: result[0]

            });

        }


        // ==================================
        // METHOD NOT ALLOWED
        // ==================================

        return res.status(405).json({

            success: false,

            error: "Method not allowed."

        });

    }

    catch (error) {

        console.error(
            "❌ Users API error:",
            error
        );


        return res.status(500).json({

            success: false,

            error: "Internal server error."

        });

    }

}
