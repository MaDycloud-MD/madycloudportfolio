const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree:      { type: String, required: true, trim: true },
  institution: { type: String, required: true, trim: true },
  score:       { type: String, default: '' },
  year:        { type: String, default: '' },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.Education || mongoose.model('Education', educationSchema);
