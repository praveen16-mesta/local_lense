const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Get comments for a specific issue
router.get('/:issueId', async (req, res) => {
  try {
    const comments = await Comment.find({ issueId: req.params.issueId }).sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add comment
router.post('/', async (req, res) => {
  try {
    const { issueId, authorEmail, authorName, text } = req.body;
    if (!issueId || !text) {
      return res.status(400).json({ message: 'issueId and text are required' });
    }

    const comment = new Comment({
      issueId,
      authorEmail: authorEmail || 'guest@locallens.org',
      authorName: authorName || 'Neighbor',
      text
    });

    const saved = await comment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete comment
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
