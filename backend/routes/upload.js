// backend/routes/upload.js
const express = require('express');
const router  = express.Router();
const cloudinary = require('../lib/cloudinary');
const { requireAdmin } = require('../middleware/auth');

router.post('/sign', requireAdmin, (req, res) => {
  try {
    const { folder = 'portfolio', filename = '', resourceType: bodyResourceType } = req.body;

    const isSvg        = filename.toLowerCase().endsWith('.svg');
    const resourceType = bodyResourceType || (isSvg ? 'raw' : 'image');

    const timestamp    = Math.round(Date.now() / 1000);
    const paramsToSign = { timestamp, folder };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      success: true,
      signature,
      timestamp,
      cloudName:    process.env.CLOUDINARY_CLOUD_NAME,
      apiKey:       process.env.CLOUDINARY_API_KEY,
      folder,
      resourceType,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/', requireAdmin, async (req, res) => {
  const { publicId, resourceType = 'image' } = req.body;
  if (!publicId) {
    return res.status(400).json({ success: false, error: 'publicId is required' });
  }
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;