const express = require("express");
const router = express.Router();
const commentModel = require("../models/commentModel");

router.get('/', (req, res) => {
    res.send('Comment Route');
});


router.get('/game/:gameId', async (req, res) => {
  try {
    const comments = await Comment.find({ game: req.params.gameId })
                                  .populate('user', 'username') // populate user details
                                  .sort({ createdAt: -1 }); // most recent first

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments', error: err.message });
  }
});

module.exports = router;