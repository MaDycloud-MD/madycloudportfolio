const mongoose = require('mongoose');

// Singleton — only one profile document
const profileSchema = new mongoose.Schema({
  name:        { type: String, default: 'Mohammed Shoaib. Makandar' },
  taglines:    [{ type: String }],  // TypeAnimation sequence
  bio:         { type: String, default: '' },
  techStack:   { type: String, default: '' },
  photoUrl:    { type: String, default: '' },
  photoPublicId: { type: String, default: '' },
  location:    { type: String, default: 'Belagavi, Karnataka, India.' },
  links: {
    linkedin:  { type: String, default: '' },
    github:    { type: String, default: '' },
    instagram: { type: String, default: '' },
    telegram:  { type: String, default: '' },
    email:     { type: String, default: 'md.shoaib.i.makandar@gmail.com' },
    leetcode:  { type: String, default: '' },
    twitter:   { type: String, default: '' },
    youtube:   { type: String, default: '' },
    website:   { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.models.Profile || mongoose.model('Profile', profileSchema);