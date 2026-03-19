const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const Education = require('../models/Education');
const { requireAdmin } = require('../middleware/auth');
const { createCRUD } = require('../lib/crudFactory');

const { getAll, getOne, create, update, remove } = createCRUD(Education);

const validation = [
  body('degree').trim().notEmpty().withMessage('Degree is required'),
  body('institution').trim().notEmpty().withMessage('Institution is required'),
];

router.get('/',       getAll);
router.get('/:id',    getOne);
router.post('/',      requireAdmin, validation, create);
router.put('/:id',    requireAdmin, validation, update);
router.delete('/:id', requireAdmin, remove);

module.exports = router;
