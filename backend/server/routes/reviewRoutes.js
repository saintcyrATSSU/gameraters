const express = require('express');
const axios = require('axios');
require('dotenv').config();
const router = express.Router();
const Review = require('../models/reviewModel');
const userModel = require('../models/userModel');


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
  const { gameId, userId, rating, review, username, gameName } = req.body;

  if (!gameId || !rating || !review || !username || !gameName) {
    return res.status(400).json({ message: 'Game ID, rating, and review are required.' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5 stars.' });
  }

  try {
    const newReview = new Review( {
      userId,
      gameId,
      username,
      gameName,
      rating,
      review,
      createdAt: new Date(),
    });

    // Push to in-memory array or save to database
    const savedReview = await newReview.save();

    res.status(201).json({ message: 'Review submitted successfully!', review: savedReview });
  } catch (err) {
    console.error('Error saving review:', err.message);
    res.status(500).json({ message: 'An error occurred while saving the review.' });
  }
});

// GET route to fetch reviews for a specific game
router.get('/reviews/:id', async (req, res) => {
  const { id: gameId } = req.params;

  try {
    // Fetch reviews for the game
    const gameReviews = await Review.find({ gameId }).sort({ createdAt: -1 });
    res.status(200).json({ reviews: gameReviews });
  } catch (err) {
    console.error('Error fetching reviews:', err.message);
    res.status(500).json({ message: 'An error occurred while fetching reviews.' });
  }
});

//Fetch reviews by user
router.get('/user/:username', async (req, res) => {
    const { username } = req.params;
  
    try {
      const userReviews = await Review.find({ username }).sort({ createdAt: -1});
      res.status(200).json(userReviews);
    } catch (err) {
      console.error('Error fetching user reviews:', err.message);
      res.status(500).json({ message: 'An error occurred while fetching user reviews.' });
    }
  });

router.get('/getAll', async (req, res) => {
    try {
      const reviews = await Review.find().sort({ createdAt: -1 });
      res.status(200).json(reviews);
    } catch (err) {
      console.error('Error fetching all reviews:', err.message);
      res.status(500).json({message: 'An error occurred while fetching reviews.'});
    }
    
});  
  

module.exports = router;
