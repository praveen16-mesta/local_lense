const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Potholes', 'Water Supply', 'Electricity', 'Waste Management', 'Safety', 'Roads', 'Other'],
      default: 'Other'
    },
    location: { type: String, required: true },
    distance: { type: String, default: '0.5 km away' },
    imageUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Reported', 'In Progress', 'Resolved'],
      default: 'Reported'
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    reporterName: { type: String, required: true },
    reporterEmail: { type: String, required: true },
    upvotes: [{ type: String }], // Array of user emails who upvoted
  },
  { timestamps: true }
);

module.exports = mongoose.model('Issue', IssueSchema);
