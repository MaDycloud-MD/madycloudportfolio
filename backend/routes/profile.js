// backend/routes/profile.js
const express  = require('express');
const router   = express.Router();
const Profile  = require('../models/Profile');
const cloudinary = require('../lib/cloudinary');
const { requireAdmin } = require('../middleware/auth');

// GET /api/profile — public
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne({});
    // Auto-create default profile if none exists
    if (!profile) {
      profile = await Profile.create({});
    }
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/profile — admin only (update everything except photo)
router.put('/', requireAdmin, async (req, res) => {
  try {
    let profile = await Profile.findOne({});
    if (!profile) profile = new Profile({});

    const { name, taglines, bio, techStack, location, links } = req.body;
    if (name      !== undefined) profile.name      = name;
    if (taglines  !== undefined) profile.taglines  = taglines;
    if (bio       !== undefined) profile.bio       = bio;
    if (location  !== undefined) profile.location  = location;
    if (techStack !== undefined) profile.techStack = techStack;
    if (links     !== undefined) profile.links     = { ...profile.links.toObject(), ...links };

    await profile.save();
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/profile/photo — admin only (update profile photo)
// Body: { photoUrl, photoPublicId }
router.put('/photo', requireAdmin, async (req, res) => {
  try {
    const { photoUrl, photoPublicId } = req.body;
    if (!photoUrl) return res.status(400).json({ success: false, error: 'photoUrl is required' });

    let profile = await Profile.findOne({});
    if (!profile) profile = new Profile({});

    // Delete old photo from Cloudinary
    if (profile.photoPublicId) {
      await cloudinary.uploader.destroy(profile.photoPublicId).catch(console.error);
    }

    profile.photoUrl      = photoUrl;
    profile.photoPublicId = photoPublicId || '';
    await profile.save();
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/profile/photo — admin only
router.delete('/photo', requireAdmin, async (req, res) => {
  try {
    const profile = await Profile.findOne({});
    if (profile?.photoPublicId) {
      await cloudinary.uploader.destroy(profile.photoPublicId).catch(console.error);
      profile.photoUrl      = '';
      profile.photoPublicId = '';
      await profile.save();
    }
    res.json({ success: true, message: 'Photo removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;