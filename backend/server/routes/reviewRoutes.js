const express = require('express');
const router = express.Router();
const Review = require('../models/reviewModel');

const rapidAPIHeaders = {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,  // Set your RapidAPI key in .env
    'X-RapidAPI-Host': 'games-details.p.rapidapi.com'
};

// POST route to create a new review
router.post('/create', async (req, res) => {
    const { gameId, userId, rating, reviewText } = req.body;

    try {
        const response = await axios.post(`https://games-details.p.rapidapi.com/reviews`, {
            gameId,
            userId,
            rating,
            reviewText
        }, { headers: rapidAPIHeaders });

        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// GET route to fetch reviews for a specific game
router.get('/game/:id', async (req, res) => {
    const gameId = req.params.gameId;

    try {
        const response = await axios.get(`https://games-details.p.rapidapi.com/games/${gameId}/reviews`, {
            headers: rapidAPIHeaders
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

module.exports = router;