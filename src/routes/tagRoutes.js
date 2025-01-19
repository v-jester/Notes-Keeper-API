const express = require('express');
const { validate, tagValidationRules, commonValidationRules } = require('../middleware/validation');
const {
  createTag,
  getTags,
  updateTag,
  deleteTag,
  getNotesByTag,
} = require('../controllers/tagController');

const router = express.Router();

router.post('/', tagValidationRules.create, validate, createTag);

router.get('/', commonValidationRules.pagination, validate, getTags);

router.put('/:id', [commonValidationRules.checkId, tagValidationRules.update], validate, updateTag);

router.delete('/:id', commonValidationRules.checkId, validate, deleteTag);

router.get(
  '/:id/notes',
  [commonValidationRules.checkId, commonValidationRules.pagination],
  validate,
  getNotesByTag
);

module.exports = router;
