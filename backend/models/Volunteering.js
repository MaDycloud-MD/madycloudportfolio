const mongoose = require('mongoose');

const volunteeringSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.Volunteering || mongoose.model('Volunteering', volunteeringSchema);
