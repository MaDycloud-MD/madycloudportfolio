const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const { requireAdmin } = require('../middleware/auth');
const cloudinary = require('../lib/cloudinary');

// ── GET /api/resume — public (get current resume URL) ────────────────────
router.get('/', async (req, res) => {
  try {
    const resume = await Resume.findOne({}).sort({ uploadedAt: -1 });
    if (!resume) {
      return res.status(404).json({ success: false, error: 'No resume uploaded yet' });
    }
    res.json({ success: true, data: { url: resume.url, filename: resume.filename } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/resume — admin only (save after Cloudinary upload) ──────────
// Body: { cloudinaryPublicId, url, filename }
router.post('/', requireAdmin, async (req, res) => {
  const { cloudinaryPublicId, url, filename } = req.body;
  if (!cloudinaryPublicId || !url || !filename) {
    return res.status(400).json({ success: false, error: 'cloudinaryPublicId, url and filename are required' });
  }

  try {
    // Delete old resume from Cloudinary + DB
    const existing = await Resume.findOne({});
    if (existing) {
      await cloudinary.uploader.destroy(existing.cloudinaryPublicId, { resource_type: 'raw' }).catch(console.error);
      await Resume.deleteMany({});
    }

    const resume = await Resume.create({ cloudinaryPublicId, url, filename, uploadedAt: new Date() });
    res.status(201).json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE /api/resume — admin only ──────────────────────────────────────
router.delete('/', requireAdmin, async (req, res) => {
  try {
    const resume = await Resume.findOne({});
    if (!resume) {
      return res.status(404).json({ success: false, error: 'No resume to delete' });
    }
    await cloudinary.uploader.destroy(resume.cloudinaryPublicId, { resource_type: 'raw' }).catch(console.error);
    await Resume.deleteMany({});
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
