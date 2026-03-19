const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const Project = require('../models/Project');
const { requireAdmin } = require('../middleware/auth');
const cloudinary = require('../lib/cloudinary');

// ── Validation helpers ────────────────────────────────────────────────────────
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  return null;
};

const projectValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('details').optional().isArray(),
  body('techStack').optional().isArray(),
  body('links.github').optional().isURL().withMessage('Invalid GitHub URL'),
  body('links.live').optional().isURL().withMessage('Invalid live URL'),
  body('links.youtube').optional().isURL().withMessage('Invalid YouTube URL'),
];

// ── GET /api/projects — public ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/projects/:id — public ────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/projects — admin ────────────────────────────────────────────
router.post('/', requireAdmin, projectValidation, async (req, res) => {
  const invalid = handleValidation(req, res);
  if (invalid) return;

  try {
    const { title, description, details, techStack, links, coverImage, coverImagePublicId, featured, order } = req.body;

    // Auto-generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

    const project = await Project.create({
      title, slug, description, details, techStack, links,
      coverImage, coverImagePublicId, featured, order,
    });
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: 'A project with this title already exists' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PUT /api/projects/:id — admin ─────────────────────────────────────────
router.put('/:id', requireAdmin, projectValidation, async (req, res) => {
  const invalid = handleValidation(req, res);
  if (invalid) return;

  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DELETE /api/projects/:id — admin ──────────────────────────────────────
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });

    // Delete cover image from Cloudinary if exists
    if (project.coverImagePublicId) {
      await cloudinary.uploader.destroy(project.coverImagePublicId);
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
