const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const Certification = require('../models/Certification');
const { requireAdmin } = require('../middleware/auth');
const { createCRUD } = require('../lib/crudFactory');

const { getAll, getOne, create, update, remove } = createCRUD(
  Certification,
  [{ field: 'logoUrl', publicIdField: 'logoPublicId' }]
);

const validation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('logoUrl').trim().notEmpty().withMessage('Logo is required'),
  body('url').trim().notEmpty().isURL().withMessage('Valid credential URL is required'),
];

router.get('/',       getAll);
router.get('/:id',    getOne);
router.post('/',      requireAdmin, validation, create);
router.put('/:id',    requireAdmin, validation, update);
router.delete('/:id', requireAdmin, remove);

module.exports = router;
