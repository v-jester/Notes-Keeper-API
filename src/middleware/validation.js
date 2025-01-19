const { validationResult, body, param, query } = require('express-validator');
const logger = require('../utils/logger');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation error', {
      path: req.path,
      method: req.method,
      errors: errors.array(),
    });
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
      .withMessage('Title cannot be longer than 200 characters'),

    body('content')
      .notEmpty()
      .withMessage('Content is required')
      .isLength({ max: 10000 })
      .withMessage('Content cannot be longer than 10000 characters'),

    body('status')
      .optional()
      .isIn(['active', 'archived', 'deleted'])
      .withMessage('Invalid note status'),

    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array')
      .custom((tags) => tags.every((tag) => typeof tag === 'string'))
      .withMessage('Each tag must be a string'),

    body('category').optional().isMongoId().withMessage('Invalid category ID format'),

    body('isPinned').optional().isBoolean().withMessage('isPinned must be a boolean'),

    body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
  ],

  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Title cannot be longer than 200 characters'),

    body('content')
      .optional()
      .isLength({ max: 10000 })
      .withMessage('Content cannot be longer than 10000 characters'),

    body('status')
      .optional()
      .isIn(['active', 'archived', 'deleted'])
      .withMessage('Invalid note status'),

    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array')
      .custom((tags) => tags.every((tag) => typeof tag === 'string'))
      .withMessage('Each tag must be a string'),

    body('category').optional().isMongoId().withMessage('Invalid category ID format'),
  ],

  search: [
    query('q')
      .optional()
      .isString()
      .withMessage('Search query must be a string')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Search query must be at least 2 characters long'),

    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page number must be a positive integer'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be a number between 1 and 100'),
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
      .withMessage('Description cannot be longer than 200 characters'),
  ],

  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Tag name cannot be longer than 50 characters')
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
      .withMessage('Description cannot be longer than 200 characters'),
  ],

  list: [
    query('search')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Search query must be at least 2 characters long'),
  ],
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

    body('parentId').optional().isMongoId().withMessage('Invalid parent category ID format'),

    body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative number'),
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

    body('parentId').optional().isMongoId().withMessage('Invalid parent category ID format'),

    body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative number'),
  ],
};

const commonValidationRules = {
  checkId: [param('id').isMongoId().withMessage('Invalid ID format')],

  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page number must be a positive integer'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be a number between 1 and 100'),
  ],
};

module.exports = {
  validate,
  noteValidationRules,
  tagValidationRules,
  categoryValidationRules,
  commonValidationRules,
};
