const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const Skill = require('../models/Skill');
const { requireAdmin } = require('../middleware/auth');
const { createCRUD } = require('../lib/crudFactory');

const { getAll, getOne, create, update, remove } = createCRUD(Skill);

const validation = [
  body('category')
    .trim().notEmpty()
    .isIn(['Programming', 'DevOps', 'Databases', 'Operating Systems', 'Tools'])
    .withMessage('Invalid category'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one skill item is required'),
  body('items.*.label').trim().notEmpty().withMessage('Each item needs a label'),
  body('items.*.logoUrl').trim().notEmpty().withMessage('Each item needs a logoUrl'),
];

router.get('/',       getAll);
router.get('/:id',    getOne);
router.post('/',      requireAdmin, validation, create);
router.put('/:id',    requireAdmin, validation, update);
router.delete('/:id', requireAdmin, remove);

module.exports = router;
