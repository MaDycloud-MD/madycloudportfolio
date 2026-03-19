const mongoose = require('mongoose');

// Only one resume document at a time (singleton)
const resumeSchema = new mongoose.Schema({
  cloudinaryPublicId: { type: String, required: true },
  url:                { type: String, required: true },
  filename:           { type: String, required: true },
  uploadedAt:         { type: Date, default: Date.now },
});

module.exports = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
