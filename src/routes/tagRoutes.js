const express = require('express');
const {
  createTag,
  getTags,
  updateTag,
  deleteTag,
  getNotesByTag,
} = require('../controllers/tagController');

const router = express.Router();

router.post('/', createTag);

router.get('/', getTags);

router.put('/:id', updateTag);

router.delete('/:id', deleteTag);

router.get('/:id/notes', getNotesByTag);

module.exports = router;
