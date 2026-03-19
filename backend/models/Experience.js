const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  role:        { type: String, required: true, trim: true },
  company:     { type: String, required: true, trim: true },
  duration:    { type: String, required: true },   // display string e.g. "Mar 2023 – Jun 2023"
  startDate:   { type: Date },
  endDate:     { type: Date },
  current:     { type: Boolean, default: false },
  points:      [{ type: String }],
  companyLogo: { type: String, default: '' },       // Cloudinary URL
  companyLogoPublicId: { type: String, default: '' },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.Experience || mongoose.model('Experience', experienceSchema);
