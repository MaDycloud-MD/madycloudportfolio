const mongoose = require('mongoose');

const techStackItemSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  logoUrl: { type: String, required: true }, // Cloudinary URL
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: {
    type: String, required: true, trim: true,
  },
  slug: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
  },
  description: {
    type: String, required: true,
  },
  details: [{ type: String }],        // bullet points
  techStack: [techStackItemSchema],
  links: {
    github:  { type: String, default: '' },
    live:    { type: String, default: '' },
    youtube: { type: String, default: '' },
  },
  coverImage:          { type: String, default: '' }, // Cloudinary URL
  coverImagePublicId:  { type: String, default: '' }, // for deletion
  featured:            { type: Boolean, default: false },
  order:               { type: Number, default: 0 },
}, { timestamps: true });

// Auto-generate slug from title before saving
projectSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
  next();
});

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);
