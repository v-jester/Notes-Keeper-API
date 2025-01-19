const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({ message: 'Get all categories - Not implemented yet' });
});

router.post('/', (_req, res) => {
  res.status(201).json({ message: 'Create category - Not implemented yet' });
});

router.put('/:id', (_req, res) => {
  res.status(200).json({ message: 'Update category - Not implemented yet' });
});

router.delete('/:id', (_req, res) => {
  res.status(200).json({ message: 'Delete category - Not implemented yet' });
});

module.exports = router;
