const mongoose = require('mongoose');

const skillItemSchema = new mongoose.Schema({
  label:   { type: String, required: true, trim: true },
  logoUrl: { type: String, required: true },  // Cloudinary URL
  logoPublicId: { type: String, default: '' },
}, { _id: false });

const skillSchema = new mongoose.Schema({
  category: {
    type: String, required: true,
    enum: ['Programming', 'DevOps', 'Databases', 'Operating Systems', 'Tools'],
  },
  title:  { type: String, required: true, trim: true },
  items:  [skillItemSchema],
  order:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.Skill || mongoose.model('Skill', skillSchema);
