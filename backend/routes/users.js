const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      credits: user.credits,
      notifications: user.notifications
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Deduct credits for sending a message
router.post('/deduct-message-credit', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has enough credits
    if (user.credits < 1) {
      return res.status(400).json({ 
        message: 'Insufficient credits',
        credits: user.credits 
      });
    }

    // Deduct 1 credit for the message
    user.credits -= 1;
    await user.save();

    res.json({
      credits: user.credits,
      message: 'Credit deducted successfully'
    });
  } catch (error) {
    console.error('Credit deduction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user credits
router.patch('/credits', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.credits += amount;
    await user.save();

    res.json({
      credits: user.credits,
      message: 'Credits updated successfully'
    });
  } catch (error) {
    console.error('Credits update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;