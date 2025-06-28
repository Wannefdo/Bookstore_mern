// routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// GET /api/user/profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/user/profile
router.put("/profile", auth, async (req, res) => {
  const { name, phone, address, bio, avatarUrl } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address, bio, avatarUrl },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;
