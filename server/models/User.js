const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    followers: [{ type: String }], // Array of follower emails
    following: [{ type: String }], // Array of following emails
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
