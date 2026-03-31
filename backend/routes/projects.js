const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Project = require('../models/Project');
const { requireAdmin } = require('../middleware/auth');

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
  body('details').optional().isArray(),
  body('techStack').optional().isArray(),
  body('links.github').optional({ checkFalsy: true }).isURL().withMessage('Invalid GitHub URL'),
  body('links.live').optional({ checkFalsy: true }).isURL().withMessage('Invalid live URL'),
  body('links.youtube').optional({ checkFalsy: true }).isURL().withMessage('Invalid YouTube URL'),
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
    const { title, details, techStack, links, featured, order } = req.body;

    const project = await Project.create({
      title, details, techStack, links, featured, order,
    });
    res.status(201).json({ success: true, data: project });
  } catch (err) {
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
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;