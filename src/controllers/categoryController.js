const Category = require('../models/category');
const logger = require('../utils/logger');

async function createCategory(req, res) {
  try {
    if (req.body.parentId) {
      const parentCategory = await Category.findById(req.body.parentId);
      if (!parentCategory) {
        logger.warn('Attempt to create a category with a non-existent parent', {
          parentId: req.body.parentId,
        });
        return res.status(400).json({
          error: 'Parent category not found',
        });
      }
    }

    const category = new Category(req.body);
    await category.save();

    logger.info('Category successfully created', { categoryId: category._id });
    return res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      logger.warn('Attempt to create a category with an existing name', {
        name: req.body.name,
        parentId: req.body.parentId,
      });
      return res.status(400).json({
        error: 'Category with this name already exists at this level',
      });
    }

    logger.error('Error creating category:', error);
    return res.status(400).json({ error: error.message });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await Category.find({}).sort({ order: 1, name: 1 });

    const categoryTree = categories.reduce((tree, category) => {
      if (!category.parentId) {
        tree.push({
          ...category.toObject(),
          children: categories
            .filter((c) => c.parentId?.toString() === category._id.toString())
            .map((child) => ({
              ...child.toObject(),
              children: categories.filter((c) => c.parentId?.toString() === child._id.toString()),
            })),
        });
      }
      return tree;
    }, []);

    logger.info('Categories successfully retrieved');
    return res.status(200).json(categoryTree);
  } catch (error) {
    logger.error('Error retrieving category list:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function updateCategory(req, res) {
  try {
    if (req.body.parentId === req.params.id) {
      logger.warn('Attempt to set a category as its own parent', {
        categoryId: req.params.id,
      });
      return res.status(400).json({
        error: 'A category cannot be its own parent',
      });
    }

    if (req.body.parentId) {
      const parentCategory = await Category.findById(req.body.parentId);
      if (!parentCategory) {
        return res.status(400).json({
          error: 'Parent category not found',
        });
      }
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!category) {
      logger.warn('Attempt to update a non-existent category', {
        categoryId: req.params.id,
      });
      return res.status(404).json({ error: 'Category not found' });
    }

    logger.info('Category successfully updated', { categoryId: category._id });
    return res.status(200).json(category);
  } catch (error) {
    logger.error('Error updating category:', error);
    return res.status(400).json({ error: error.message });
  }
}

async function deleteCategory(req, res) {
  try {
    const childCategories = await Category.find({ parentId: req.params.id });
    if (childCategories.length > 0) {
      logger.warn('Attempt to delete a category with child elements', {
        categoryId: req.params.id,
        childCount: childCategories.length,
      });
      return res.status(400).json({
        error: 'Cannot delete a category that contains subcategories',
      });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      logger.warn('Attempt to delete a non-existent category', {
        categoryId: req.params.id,
      });
      return res.status(404).json({ error: 'Category not found' });
    }

    await category.deleteOne();

    logger.info('Category successfully deleted', { categoryId: req.params.id });
    return res.status(200).json({ message: 'Category successfully deleted' });
  } catch (error) {
    logger.error('Error deleting category:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
