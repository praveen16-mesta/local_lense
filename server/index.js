const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const Issue = require('./models/Issue');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// Root test endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LocalLens Backend API Running' });
});

// Seed mock initial issues if DB is empty
const seedSampleIssues = async () => {
  try {
    const count = await Issue.countDocuments();
    if (count === 0) {
      console.log('Seeding initial community issues...');
      await Issue.insertMany([
        {
          title: 'Dangerous Pothole on Main Street & 5th Ave',
          description: 'Large deep pothole creating hazard for cars and cyclists near the intersection. Multiple vehicles have damaged tires here.',
          category: 'Potholes',
          location: 'Main Street & 5th Ave, Ward 4',
          distance: '0.3 km away',
          status: 'Reported',
          urgency: 'High',
          reporterName: 'Sarah Jenkins',
          reporterEmail: 'sarah.j@example.com',
          upvotes: ['alex@example.com', 'mesta@example.com', 'user1@example.com'],
          imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'
        },
        {
          title: 'Broken Streetlights along Oak Park Trail',
          description: 'Three consecutive street lights have been out for the past week, making the night walk unsafe for evening commuters.',
          category: 'Electricity',
          location: 'Oak Park West Entrance',
          distance: '0.8 km away',
          status: 'In Progress',
          urgency: 'Medium',
          reporterName: 'David Chen',
          reporterEmail: 'david.c@example.com',
          upvotes: ['sarah.j@example.com', 'community@example.com'],
          imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80'
        },
        {
          title: 'Water Pipe Leak causing localized flooding',
          description: 'Clean water is leaking heavily from the underground municipal pipe line near the public park playground.',
          category: 'Water Supply',
          location: 'Greenwood Park Playground',
          distance: '1.2 km away',
          status: 'Resolved',
          urgency: 'High',
          reporterName: 'Priya Sharma',
          reporterEmail: 'priya.s@example.com',
          upvotes: ['citizen@example.com'],
          imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?w=800&auto=format&fit=crop&q=80'
        }
      ]);
      console.log('Sample community issues seeded successfully!');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
};

app.listen(PORT, async () => {
  console.log(`LocalLens Server running on http://localhost:${PORT}`);
  await seedSampleIssues();
});
