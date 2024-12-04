const express = require('express');
const axios = require('axios');
require('dotenv').config();
const router = express.Router();

// Example database or in-memory store for reviews
const reviews = [];

// GET route to fetch game details from RapidAPI
router.get('/game/:id', async (req, res) => {
  const { id: gameId } = req.params;
  const apiKey = process.env.GAME_API_KEY;
  let apiUrl = `https://games-details.p.rapidapi.com/single_game`;

  try {
    console.log(`Fetching game details from URL: ${apiUrl}`);
    apiUrl = `${apiUrl}/${encodeURIComponent(gameId)}`;
    const response = await axios.get(apiUrl, {
        headers: {
            'x-rapidapi-key': '417d64baecmsh79798f9984757ebp1fd1f6jsn82142ba39f42', // Replace with your actual key
            'x-rapidapi-host': 'games-details.p.rapidapi.com',
        },
    });
    console.log("API Response:", response.data);
    const gameData = response.data;

    res.json(gameData);
  } catch (error) {
    console.error('Error fetching game details:', err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to fetch game details.' });
  }
});

// POST route to submit a review
router.post('/', async (req, res) => {
  const { gameId, rating, review } = req.body;

  if (!gameId || !rating || !review) {
    return res.status(400).json({ message: 'Game ID, rating, and review are required.' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5 stars.' });
  }

  try {
    const newReview = {
      gameId,
      rating,
      review,
      createdAt: new Date(),
    };

    // Push to in-memory array or save to database
    reviews.push(newReview);

    res.status(201).json({ message: 'Review submitted successfully!', review: newReview });
  } catch (err) {
    console.error('Error saving review:', err.message);
    res.status(500).json({ message: 'An error occurred while saving the review.' });
  }
});

// GET route to fetch reviews for a specific game
router.get('/reviews/:id', async (req, res) => {
  const { gameId } = req.params;

  try {
    // Fetch reviews for the game
    const gameReviews = reviews.filter((review) => review.gameId === gameId);

    res.status(200).json({ reviews: gameReviews });
  } catch (err) {
    console.error('Error fetching reviews:', err.message);
    res.status(500).json({ message: 'An error occurred while fetching reviews.' });
  }
});

module.exports = router;
