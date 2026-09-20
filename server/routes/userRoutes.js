const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Issue = require('../models/Issue');

// Follow user
router.post('/follow', async (req, res) => {
  try {
    const { followerEmail, targetEmail } = req.body;
    if (!followerEmail || !targetEmail) {
      return res.status(400).json({ message: 'followerEmail and targetEmail required' });
    }

    await User.findOneAndUpdate(
      { email: followerEmail },
      { $addToSet: { following: targetEmail } }
    );
    await User.findOneAndUpdate(
      { email: targetEmail },
      { $addToSet: { followers: followerEmail } }
    );

    res.json({ message: 'Successfully followed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Unfollow user
router.post('/unfollow', async (req, res) => {
  try {
    const { followerEmail, targetEmail } = req.body;

    await User.findOneAndUpdate(
      { email: followerEmail },
      { $pull: { following: targetEmail } }
    );
    await User.findOneAndUpdate(
      { email: targetEmail },
      { $pull: { followers: followerEmail } }
    );

    res.json({ message: 'Successfully unfollowed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user count/stats
router.get('/stats/:email', async (req, res) => {
  try {
    const count = await Issue.countDocuments({ reporterEmail: req.params.email });
    const user = await User.findOne({ email: req.params.email });
    res.json({
      email: req.params.email,
      reportedCount: count,
      followersCount: user?.followers?.length || 0,
      followingCount: user?.following?.length || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
