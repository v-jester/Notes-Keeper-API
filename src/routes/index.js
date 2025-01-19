const express = require('express');
const noteRoutes = require('./noteRoutes');
const tagRoutes = require('./tagRoutes');
const categoryRoutes = require('./categoryRoutes');

const router = express.Router();

router.use('/notes', noteRoutes);
router.use('/tags', tagRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;
