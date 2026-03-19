const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  logoUrl:    { type: String, required: true },
  logoPublicId: { type: String, default: '' },
  url:        { type: String, required: true },
  issuer:     { type: String, default: '' },
  issueDate:  { type: Date },
  inProgress: { type: Boolean, default: false },
  order:      { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.models.Certification || mongoose.model('Certification', certificationSchema);
