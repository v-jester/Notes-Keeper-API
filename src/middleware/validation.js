const { validationResult, body, param, query } = require('express-validator');
const logger = require('../utils/logger');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation error', { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

const categoryValidationRules = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Category name is required')
      .isLength({ max: 100 })
      .withMessage('Category name cannot be longer than 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot be longer than 500 characters'),
    body('parentId')
      .optional()
      .custom((value) => {
        if (value === null) return true;
        if (typeof value === 'string') return true;
        throw new Error('Parent ID must be a string or null');
      }),
    body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  ],
  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Category name cannot be longer than 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description cannot be longer than 500 characters'),
    body('parentId').optional().isString().withMessage('Parent ID must be a string'),
    body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
  ],
};

const noteValidationRules = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot be longer than 200 characters'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').optional().isString().withMessage('Category ID must be a string'),
    body('tags').optional().isArray().withMessage('Tags must be an array of strings'),
    body('tags.*').optional().isString().withMessage('Each tag ID must be a string'),
    body('isPinned').optional().isBoolean().withMessage('isPinned must be a boolean'),
    body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
  ],
  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Title cannot be longer than 200 characters'),
    body('content').optional(),
    body('category').optional().isString().withMessage('Category ID must be a string'),
    body('tags').optional().isArray().withMessage('Tags must be an array of strings'),
    body('tags.*').optional().isString().withMessage('Each tag ID must be a string'),
    body('isPinned').optional().isBoolean().withMessage('isPinned must be a boolean'),
    body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
  ],
  search: [
    query('q')
      .optional()
      .isString()
      .withMessage('Search query must be a string')
      .isLength({ min: 2 })
      .withMessage('Search query must be at least 2 characters long'),
  ],
};

const tagValidationRules = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Tag name is required')
      .isLength({ max: 50 })
      .withMessage('Tag name cannot be longer than 50 characters')
      .matches(/^[a-zA-Z0-9\s-]+$/)
      .withMessage('Tag name can only contain letters, numbers, spaces, and hyphens'),
    body('color').optional().isHexColor().withMessage('Color must be a valid hex color code'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Description cannot be longer than 200 characters'),
  ],
  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Tag name cannot be longer than 50 characters')
      .matches(/^[a-zA-Z0-9\s-]+$/)
      .withMessage('Tag name can only contain letters, numbers, spaces, and hyphens'),
    body('color').optional().isHexColor().withMessage('Color must be a valid hex color code'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Description cannot be longer than 200 characters'),
  ],
};

const commonValidationRules = {
  pagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],
  checkId: [
    param('id')
      .notEmpty()
      .withMessage('ID is required')
      .isString()
      .withMessage('ID must be a string'),
  ],
};

module.exports = {
  validate,
  categoryValidationRules,
  noteValidationRules,
  tagValidationRules,
  commonValidationRules,
};
