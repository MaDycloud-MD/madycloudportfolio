const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const Experience = require('../models/Experience');
const { requireAdmin } = require('../middleware/auth');
const { createCRUD } = require('../lib/crudFactory');

const { getAll, getOne, create, update, remove } = createCRUD(
  Experience,
  [{ field: 'companyLogo', publicIdField: 'companyLogoPublicId' }]
);

const validation = [
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('points').optional().isArray(),
];

router.get('/',     getAll);
router.get('/:id',  getOne);
router.post('/',    requireAdmin, validation, create);
router.put('/:id',  requireAdmin, validation, update);
router.delete('/:id', requireAdmin, remove);

module.exports = router;
