const express = require("express");
const router = express.Router();
const z = require('zod')
const bcrypt = require("bcrypt");
const newUserModel = require('../models/userModel')
const { newUserValidation } = require('../models/userValidator');
const { generateAccessToken } = require('../utilities/generateToken');
const multer = require("multer");
const path = require("path");

// Set up storage engine for Multer
const storage = multer.diskStorage({
    destination: "./uploads/profileImages",
    filename: (req, file, cb) => {
      cb(null, `${req.body.username}-${Date.now()}${path.extname(file.originalname)}`);
    },
  });
  
  const upload = multer({ storage });

router.post('/editUser', upload.single("profileImage"), async (req, res) =>
{
    const { bio } = req.body;
    const { username } = req.params;
    try {
        const userId = req.params.id;

        // Find the profile by ID
        const user = await userModel.findOne(username);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
     
        if (bio) {
            user.bio = bio;
          }

          // Update the profile image if a file was uploaded
        if (req.file) {
        user.profileImage = `/uploads/profileImages/${req.file.filename}`;
      }
     res.json({ message: "Profile updated successfully", profile });
 } catch (error) {
     console.error(error);
     res.status(500).json({ error: "Internal server error" });
 }
})


module.exports = router;