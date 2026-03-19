const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true, lowercase: true },
  subject:   { type: String, trim: true, default: '' },
  message:   { type: String, required: true },
  read:      { type: Boolean, default: false },
  ipAddress: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);
