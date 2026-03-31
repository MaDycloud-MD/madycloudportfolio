const mongoose = require('mongoose');

const techStackItemSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  logoUrl: { type: String, required: true }, 
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: {
    type: String, required: true, trim: true,
  },
  details: [{ type: String }],        
  techStack: [techStackItemSchema],
  links: {
    github:  { type: String, default: '' },
    live:    { type: String, default: '' },
    youtube: { type: String, default: '' },
  },
  featured: { type: Boolean, default: false },
  order:    { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);