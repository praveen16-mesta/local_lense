const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Get issues feed with optional category and search
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const issues = await Issue.find(filter).sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new issue
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, location, urgency, reporterName, reporterEmail } = req.body;
    
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const newIssue = new Issue({
      title,
      description,
      category: category || 'Other',
      location: location || 'Local Area',
      urgency: urgency || 'Medium',
      reporterName: reporterName || 'Anonymous Citizen',
      reporterEmail: reporterEmail || 'citizen@locallens.org',
      imageUrl
    });

    const saved = await newIssue.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upvote issue toggle
router.post('/:id/upvote', async (req, res) => {
  try {
    const { userEmail } = req.body;
    if (!userEmail) return res.status(400).json({ message: 'User email required' });

    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const index = issue.upvotes.indexOf(userEmail);
    if (index === -1) {
      issue.upvotes.push(userEmail);
    } else {
      issue.upvotes.splice(index, 1);
    }

    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin status change
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Reported', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const issue = await Issue.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete issue
router.delete('/:id', async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json({ message: 'Issue deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
