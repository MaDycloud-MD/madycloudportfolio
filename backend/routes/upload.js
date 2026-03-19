const express = require('express');
const router = express.Router();
const cloudinary = require('../lib/cloudinary');
const { requireAdmin } = require('../middleware/auth');

/**
 * POST /api/upload/sign
 * Returns a signed upload signature so the frontend can upload
 * directly to Cloudinary without proxying through our server.
 * Body: { folder?: string, resourceType?: string }
 */
router.post('/sign', requireAdmin, (req, res) => {
  try {
    const { folder = 'portfolio', resourceType = 'image' } = req.body;

    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = { timestamp, folder };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      success:   true,
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey:    process.env.CLOUDINARY_API_KEY,
      folder,
      resourceType,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/upload
 * Destroy a Cloudinary asset by publicId.
 * Body: { publicId: string, resourceType?: 'image' | 'raw' | 'video' }
 */
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
