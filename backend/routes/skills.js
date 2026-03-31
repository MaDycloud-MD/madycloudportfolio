const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const Skill = require('../models/Skill');
const { requireAdmin } = require('../middleware/auth');
const { createCRUD } = require('../lib/crudFactory');

const { getAll, getOne, create, update, remove } = createCRUD(Skill);

const validation = [
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one skill item is required'),
  body('items.*.label').trim().notEmpty().withMessage('Each item needs a label'),
  body('items.*.logoUrl').trim().notEmpty().withMessage('Each item needs a logoUrl'),
];

router.get('/categories', async (req, res) => {
  try {
    const categories = await Skill.distinct('category');
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/',       getAll);
router.get('/:id',    getOne);
router.post('/',      requireAdmin, validation, create);
router.put('/:id',    requireAdmin, validation, update);
router.delete('/:id', requireAdmin, remove);

module.exports = router;