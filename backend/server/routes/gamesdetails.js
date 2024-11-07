const express = require("express");
const router = express.Router();
require('dotenv').config();
const axios = require("axios");

const GAME_API_BASE_URL = 'https://games-details.p.rapidapi.com';
router.get('/game/name', async (req, res) => {
    const gameName = req.params;
    const apiKey = process.env.GAME_API_KEY;
    const apiUrl = `https://games-details.p.rapidapi.com/games/${gameName}`;

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'x-rapidapi-key': '417d64baecmsh79798f9984757ebp1fd1f6jsn82142ba39f42',
                'x-rapidapi-host': 'games-details.p.rapidapi.com'
            }
        });
        res.json(response.data); // Return all games
    } catch (error) {
        res.status(500).send(error.message);
    }
});
// Route to fetch game details by ID
router.get('/game/:id', async (req, res) => {
    const gameId = req.params.id;
    const apiKey = process.env.GAME_API_KEY; // Assuming you store your API key in .env
    const apiUrl = `https://games-details.p.rapidapi.com/single_game/${gameId}`; // Define the API URL with the gameId

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'x-rapidapi-key': '417d64baecmsh79798f9984757ebp1fd1f6jsn82142ba39f42', // Use the environment variable for the API key
                'x-rapidapi-host': 'games-details.p.rapidapi.com' // Correct RapidAPI host
            }
        });

        const gameData = response.data;

        
        // Return the game details in JSON format
        res.json(gameData);
    } catch (error) {
        console.error('Error fetching game details:', error);

        // Handle errors (e.g., game not found, API issues)
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: 'Game not found' });
        } else {
            res.status(500).json({ error: 'Failed to fetch game details' });
        }
    }
})

module.exports = router;
