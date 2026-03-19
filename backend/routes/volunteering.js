const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const Volunteering = require('../models/Volunteering');
const { requireAdmin } = require('../middleware/auth');
const { createCRUD } = require('../lib/crudFactory');

const { getAll, getOne, create, update, remove } = createCRUD(Volunteering);

const validation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
];

router.get('/',       getAll);
router.get('/:id',    getOne);
router.post('/',      requireAdmin, validation, create);
router.put('/:id',    requireAdmin, validation, update);
router.delete('/:id', requireAdmin, remove);

module.exports = router;
