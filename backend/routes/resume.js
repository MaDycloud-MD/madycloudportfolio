const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const { requireAdmin } = require('../middleware/auth');
const cloudinary = require('../lib/cloudinary');

router.get('/', async (req, res) => {
  try {
    const resume = await Resume.findOne({}).sort({ uploadedAt: -1 });
    if (!resume) return res.status(404).json({ success: false, error: 'No resume uploaded yet' });
    res.json({ success: true, data: { url: resume.url, filename: resume.filename } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/signed-url', async (req, res) => {
  try {
    const resume = await Resume.findOne({}).sort({ uploadedAt: -1 });
    if (!resume) return res.status(404).json({ success: false, error: 'No resume uploaded yet' });

    const signedUrl = cloudinary.utils.private_download_url(
      resume.cloudinaryPublicId,
      'pdf',
      {
        resource_type: 'raw',
        expires_at:    Math.floor(Date.now() / 1000) + 60,
        attachment:    true,
      }
    );

    res.json({ success: true, data: { signedUrl, filename: resume.filename } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  const { cloudinaryPublicId, url, filename } = req.body;
  if (!cloudinaryPublicId || !url || !filename) {
    return res.status(400).json({ success: false, error: 'cloudinaryPublicId, url and filename are required' });
  }
  try {
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

router.delete('/', requireAdmin, async (req, res) => {
  try {
    const resume = await Resume.findOne({});
    if (!resume) return res.status(404).json({ success: false, error: 'No resume to delete' });
    await cloudinary.uploader.destroy(resume.cloudinaryPublicId, { resource_type: 'raw' }).catch(console.error);
    await Resume.deleteMany({});
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;