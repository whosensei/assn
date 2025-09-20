const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('notifications');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.notifications.sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    console.error('Notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.patch('/:notificationId/read', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notification = user.notifications.id(req.params.notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await user.save();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notifications.forEach(notification => {
      notification.read = true;
    });

    await user.save();

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new notification (for admin/system use)
router.post('/', auth, async (req, res) => {
  try {
    const { type, title, message } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.notifications.push({
      type,
      title,
      message,
      read: false
    });

    await user.save();

    res.status(201).json({ message: 'Notification added successfully' });
  } catch (error) {
    console.error('Add notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;