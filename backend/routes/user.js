const express = require('express');
const cloudinary = require('../utils/cloudinary');
const verifyToken = require('../middleware/authMiddleware');
const uploadProfilePic = require('../middleware/cloudinaryProfileStorage');
const User = require('../models/UserModel');

const router = express.Router();

router.put('/update-profile', verifyToken, uploadProfilePic.single('profilePicture'), async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updatedData = { name };

    if (typeof phone === 'string' && phone.trim() !== '' && !isNaN(Number(phone))) {
      updatedData.phone = Number(phone);
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.file) {
      // Delete old Cloudinary image
      if (user.profilePicture && user.profilePicture.public_id) {
        await cloudinary.uploader.destroy(user.profilePicture.public_id);
      }

      // Set new Cloudinary image
      updatedData.profilePicture = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updatedData,
      { new: true }
    );

    // Send only URL in the response
    let userObj = updatedUser.toObject();
    if (userObj.profilePicture && userObj.profilePicture.url) {
      userObj.profilePicture = userObj.profilePicture.url;
    }

    res.json({ user: userObj });
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
