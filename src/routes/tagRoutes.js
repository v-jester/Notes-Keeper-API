const express = require('express');
const { validate, tagValidationRules } = require('../middleware/validation');
const {
  createTag,
  getTags,
  updateTag,
  deleteTag,
  getNotesByTag,
} = require('../controllers/tagController');

const router = express.Router();

router.post('/', tagValidationRules.create, validate, createTag);
router.get('/', getTags);
router.put('/:id', tagValidationRules.update, validate, updateTag);
router.delete('/:id', deleteTag);
router.get('/:id/notes', getNotesByTag);

module.exports = router;
