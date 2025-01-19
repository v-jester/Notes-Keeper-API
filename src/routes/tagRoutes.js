const express = require('express');

const router = express.Router();
router.get('/', (_req, res) => {
  res.status(200).json({ message: 'Get all tags - Not implemented yet' });
});

router.post('/', (_req, res) => {
  res.status(201).json({ message: 'Create tag - Not implemented yet' });
});

router.put('/:id', (_req, res) => {
  res.status(200).json({ message: 'Update tag - Not implemented yet' });
});

router.delete('/:id', (_req, res) => {
  res.status(200).json({ message: 'Delete tag - Not implemented yet' });
});

router.get('/:id/notes', (_req, res) => {
  res.status(200).json({ message: 'Get notes by tag - Not implemented yet' });
});

module.exports = router;
