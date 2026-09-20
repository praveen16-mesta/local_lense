const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Otp = require('../models/Otp');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'Signup successful', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login / Check Password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "You haven't signed up yet" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send OTP
router.post('/sendotp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const newOtp = new Otp({ email, otp: generatedOtp, expiresAt });
    await newOtp.save();

    res.json({ saved: true, otp: generatedOtp, message: `OTP ${generatedOtp} sent to ${email} (valid 5 mins)` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify OTP
router.post('/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (record && record.otp === otp.toString() && new Date() < record.expiresAt) {
      res.json({ Isverified: true });
    } else {
      res.json({ Isverified: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Password
router.post('/updatepass', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOneAndUpdate({ email }, { password }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Profile
router.get('/profile/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
