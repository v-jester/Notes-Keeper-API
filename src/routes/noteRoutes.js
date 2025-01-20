const express = require('express');
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

router.post('/', createNote);

router.get('/', getNotes);

router.get('/search', searchNotes);

router.get('/:id', getNoteById);

router.put('/:id', updateNote);

router.delete('/:id', deleteNote);

router.patch('/:id/archive', archiveNote);

router.patch('/:id/restore', restoreNote);

module.exports = router;
