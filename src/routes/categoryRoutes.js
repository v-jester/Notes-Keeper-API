const express = require('express');
const {
  validate,
  categoryValidationRules,
  commonValidationRules,
} = require('../middleware/validation');
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryPath,
} = require('../controllers/categoryController');

const router = express.Router();

router.post('/', categoryValidationRules.create, validate, createCategory);

router.get('/', commonValidationRules.pagination, validate, getCategories);

router.get('/:id', commonValidationRules.checkId, validate, getCategoryById);

router.get('/:id/path', commonValidationRules.checkId, validate, getCategoryPath);

router.put(
  '/:id',
  [commonValidationRules.checkId, categoryValidationRules.update],
  validate,
  updateCategory
);

router.delete('/:id', commonValidationRules.checkId, validate, deleteCategory);

module.exports = router;
