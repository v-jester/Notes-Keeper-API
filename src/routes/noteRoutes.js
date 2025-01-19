const express = require('express');
const {
  validate,
  noteValidationRules,
  commonValidationRules,
} = require('../middleware/validation');
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  archiveNote,
  restoreNote,
  searchNotes,
} = require('../controllers/noteController');

const router = express.Router();

router.post('/', noteValidationRules.create, validate, createNote);

router.get('/', commonValidationRules.pagination, validate, getNotes);

router.get('/search', noteValidationRules.search, validate, searchNotes);

router.get('/:id', commonValidationRules.checkId, validate, getNoteById);

router.put(
  '/:id',
  [commonValidationRules.checkId, noteValidationRules.update],
  validate,
  updateNote
);

router.delete('/:id', commonValidationRules.checkId, validate, deleteNote);

router.patch('/:id/archive', commonValidationRules.checkId, validate, archiveNote);

router.patch('/:id/restore', commonValidationRules.checkId, validate, restoreNote);

module.exports = router;
