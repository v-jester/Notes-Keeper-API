const { validationResult, body } = require('express-validator');
const logger = require('../utils/logger');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation error', { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

const noteValidationRules = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('content').notEmpty().withMessage('Content is required'),
    body('status')
      .optional()
      .isIn(['active', 'archived', 'deleted'])
      .withMessage('Invalid note status'),
  ],
  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('status')
      .optional()
      .isIn(['active', 'archived', 'deleted'])
      .withMessage('Invalid note status'),
  ],
};

module.exports = {
  validate,
  noteValidationRules,
};
