const categoryService = require('../services/categoryService');
const logger = require('../utils/logger');

async function createCategory(req, res) {
  try {
    const category = categoryService.createCategory(req.body);
    logger.info('Category created successfully', { categoryId: category._id });
    return res.status(201).json(category);
  } catch (error) {
    logger.error('Error creating category:', error);
    return res.status(400).json({ error: error.message });
  }
}

async function getCategories(req, res) {
  try {
    const { flat = false } = req.query;
    let categories;

    if (flat) {
      categories = categoryService.getAllCategories();
    } else {
      categories = categoryService.buildCategoryTree();
    }

    return res.status(200).json(categories);
  } catch (error) {
    logger.error('Error retrieving categories:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function getCategoryById(req, res) {
  try {
    const category = categoryService.getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.status(200).json(category);
  } catch (error) {
    logger.error('Error retrieving category:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function getCategoryPath(req, res) {
  try {
    const path = categoryService.getCategoryPath(req.params.id);

    if (!path.length) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.status(200).json(path);
  } catch (error) {
    logger.error('Error retrieving category path:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function updateCategory(req, res) {
  try {
    const category = categoryService.updateCategory(req.params.id, req.body);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    logger.info('Category updated successfully', { categoryId: category._id });
    return res.status(200).json(category);
  } catch (error) {
    logger.error('Error updating category:', error);
    return res.status(400).json({ error: error.message });
  }
}

async function deleteCategory(req, res) {
  try {
    const success = categoryService.deleteCategory(req.params.id);

    if (!success) {
      return res.status(404).json({ error: 'Category not found' });
    }

    logger.info('Category deleted successfully', { categoryId: req.params.id });
    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    if (error.message === 'Cannot delete category with subcategories') {
      return res.status(400).json({ error: error.message });
    }

    logger.error('Error deleting category:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function reorderCategories(req, res) {
  try {
    const { orders } = req.body;
    const updatedCategories = categoryService.reorderCategories(orders);

    logger.info('Categories reordered successfully');
    return res.status(200).json(updatedCategories);
  } catch (error) {
    logger.error('Error reordering categories:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryPath,
  reorderCategories,
};
