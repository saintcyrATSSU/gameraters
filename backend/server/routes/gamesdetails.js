const express = require("express");
const router = express.Router();
require('dotenv').config();
const axios = require("axios");

const GAME_API_BASE_URL = 'https://games-details.p.rapidapi.com';


router.get('/game/:name', async (req, res) => {
    const gameName = req.params.name;
    const apiKey = process.env.GAME_API_KEY;
    let apiUrl = `https://games-details.p.rapidapi.com/search`;

    console.log("Received game name:", gameName);

    if (!gameName) {
        return res.status(400).json({ error: 'Game name is required' });
    }

    try {
        apiUrl = `${apiUrl}?sugg=${encodeURIComponent(gameName)}`;
        console.log("Updated API URL:", apiUrl);
        const response = await axios.get(apiUrl, {
            headers: {
                'x-rapidapi-key': '417d64baecmsh79798f9984757ebp1fd1f6jsn82142ba39f42',
                'x-rapidapi-host': 'games-details.p.rapidapi.com'
            },
            params: { sugg: gameName } // Pass gameName in the sugg parameter
        });

        console.log("RapidAPI response data:", response.data);

        // Handle both array and single object response structures
        if (response.data) {
            if (Array.isArray(response.data)) {
                // If it's an array of games, send it directly
                res.json(response.data);
            } else if (response.data.name) {
                // If it's a single game object, wrap it in an array
                res.json([response.data]);
            } else {
                res.status(404).json({ error: 'No games found' });
            }
        } else {
            res.status(404).json({ error: 'No games found' });
        }
    } catch (error) {
        console.error('Error fetching game list:', error.message);
        res.status(500).json({ error: 'Failed to fetch game list' });
    }
});


module.exports = router;
