const express = require("express");
const router = express.Router();
const z = require('zod')
const bcrypt = require("bcrypt");
const newUserModel = require('../models/userModel')
const { newUserValidation } = require('../models/userValidator');
const { generateAccessToken } = require('../utilities/generateToken');

router.post('/editUser', async (req, res) =>
{
    const { bio } = req.body;
    const { username } = req.params;
    try {
        const profileId = req.params.id;

        // Find the profile by ID
        const profile = await profileModel.findOne(username);

        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }
     
     profile.bio = bio;
     await profile.save();

     res.json({ message: "Profile updated successfully", profile });
 } catch (error) {
     console.error(error);
     res.status(500).json({ error: "Internal server error" });
 }
})


module.exports = router;