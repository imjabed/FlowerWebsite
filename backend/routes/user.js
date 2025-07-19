const express = require('express');
const fs = require('fs');
const path = require('path');

const upload = require('../middleware/upload');
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/UserModel');

const router = express.Router();

router.put('/update-profile', verifyToken, upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, phone } = req.body;

    const updatedData = { name };

    if (typeof phone === 'string' && phone.trim() !== '' && !isNaN(Number(phone))) {
      updatedData.phone = Number(phone);
    }


    if (req.file) {
      const user = await User.findById(req.user.id);
      if (user && user.profilePicture) {
        const oldPath = path.join(__dirname, '..', 'uploads', user.profilePicture);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      updatedData.profilePicture = req.file.filename;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,         
      updatedData,
      { new: true }
    );
    console.log("Incoming updated data:", updatedData);


    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let userObj = updatedUser.toObject();
    if (userObj.profilePicture) {
      userObj.profilePicture = `${req.protocol}://${req.get('host')}/uploads/${userObj.profilePicture}`;
    }
    res.json({ user: userObj });
    console.log(userObj)

  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ message: "Update failed" });
  }
}
);

module.exports = router;
