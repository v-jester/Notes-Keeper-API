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
      .withMessage('Invalid status value'),
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
      .withMessage('Invalid status value'),
  ],
};

const tagValidationRules = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Tag name is required')
      .isLength({ max: 50 })
      .withMessage('Tag name cannot exceed 50 characters')
      .matches(/^[a-zA-Zа-яА-Я0-9\s-]+$/)
      .withMessage('Tag name can only contain letters, numbers, spaces, and hyphens'),
    body('color')
      .optional()
      .isHexColor()
      .withMessage('Color must be in HEX format (e.g., #FF0000)'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Description cannot exceed 200 characters'),
  ],
  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Tag name cannot exceed 50 characters')
      .matches(/^[a-zA-Zа-яА-Я0-9\s-]+$/)
      .withMessage('Tag name can only contain letters, numbers, spaces, and hyphens'),
    body('color')
      .optional()
      .isHexColor()
      .withMessage('Color must be in HEX format (e.g., #FF0000)'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Description cannot exceed 200 characters'),
  ],
};

module.exports = {
  validate,
  noteValidationRules,
  tagValidationRules,
};
