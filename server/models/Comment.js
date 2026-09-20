const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
    authorEmail: { type: String, required: true },
    authorName: { type: String, required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);
