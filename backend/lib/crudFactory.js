const { validationResult } = require('express-validator');
const cloudinary = require('../lib/cloudinary');

/**
 * Creates standard CRUD route handlers for a given Mongoose model.
 * Usage: const { getAll, getOne, create, update, remove } = createCRUD(Model, validation, imageFields)
 *
 * imageFields: array of { field, publicIdField } for Cloudinary cleanup on delete
 */
function createCRUD(Model, imageFields = []) {
  const handleValidation = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    return null;
  };

  const getAll = async (req, res) => {
    try {
      const docs = await Model.find({}).sort({ order: 1, createdAt: -1 });
      res.json({ success: true, data: docs });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  const getOne = async (req, res) => {
    try {
      const doc = await Model.findById(req.params.id);
      if (!doc) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: doc });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  const create = async (req, res) => {
    const invalid = handleValidation(req, res);
    if (invalid) return;
    try {
      const doc = await Model.create(req.body);
      res.status(201).json({ success: true, data: doc });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  const update = async (req, res) => {
    const invalid = handleValidation(req, res);
    if (invalid) return;
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: doc });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  const remove = async (req, res) => {
    try {
      const doc = await Model.findById(req.params.id);
      if (!doc) return res.status(404).json({ success: false, error: 'Not found' });

      // Clean up Cloudinary assets
      for (const { publicIdField } of imageFields) {
        const publicId = doc[publicIdField];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId).catch(console.error);
        }
      }

      await Model.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  return { getAll, getOne, create, update, remove };
}

module.exports = { createCRUD };
