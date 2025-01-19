const Category = require('../models/category');
const Note = require('../models/note');
const logger = require('../utils/logger');

function buildCategoryTree(categories, parentId = null) {
  return categories
    .filter((category) =>
      parentId ? category.parentId?.toString() === parentId.toString() : !category.parentId
    )
    .map((category) => ({
      ...category.toObject(),
      children: buildCategoryTree(categories, category._id),
    }));
}

async function createCategory(req, res) {
  try {
    if (req.body.parentId) {
      const parentExists = await Category.exists({ _id: req.body.parentId });
      if (!parentExists) {
        logger.warn('Attempt to create category with non-existent parent', {
          parentId: req.body.parentId,
        });
        return res.status(400).json({
          error: 'Parent category not found',
        });
      }
    }

    const category = new Category(req.body);
    await category.save();

    logger.info('Category created successfully', { categoryId: category._id });
    return res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      logger.warn('Attempt to create category with duplicate name', {
        name: req.body.name,
      });
      return res.status(400).json({
        error: 'Category with this name already exists',
      });
    }

    logger.error('Error creating category:', error);
    return res.status(500).json({ error: 'Error creating category' });
  }
}

async function getCategories(req, res) {
  try {
    const { flat = false, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = Category.find();

    if (flat) {
      const categories = await query.skip(skip).limit(limit).sort({ order: 1, name: 1 });

      const total = await Category.countDocuments();

      return res.status(200).json({
        categories,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCategories: total,
      });
    }
    const allCategories = await query.sort({ order: 1, name: 1 });
    const categoryTree = buildCategoryTree(allCategories);
    return res.status(200).json(categoryTree);
  } catch (error) {
    logger.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Error fetching categories' });
  }
}

async function getCategoryById(req, res) {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      logger.warn('Attempt to fetch non-existent category', {
        categoryId: req.params.id,
      });
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.status(200).json(category);
  } catch (error) {
    logger.error('Error fetching category:', error);
    return res.status(500).json({ error: 'Error fetching category' });
  }
}

async function getCategoryPath(req, res) {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const path = await category.getPath();
    return res.status(200).json(path);
  } catch (error) {
    logger.error('Error getting category path:', error);
    return res.status(500).json({ error: 'Error getting category path' });
  }
}

async function getCategoryNotes(req, res) {
  try {
    const { id } = req.params;
    const { includeSubcategories = false, page = 1, limit = 10 } = req.query;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    let categoryIds = [id];
    if (includeSubcategories) {
      const subcategories = await Category.find({
        $or: [{ _id: id }, { parentId: id }],
      });
      categoryIds = subcategories.map((cat) => cat._id);
    }

    const notes = await Note.find({ category: { $in: categoryIds } })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ updatedAt: -1 });

    const total = await Note.countDocuments({
      category: { $in: categoryIds },
    });

    return res.status(200).json({
      notes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalNotes: total,
    });
  } catch (error) {
    logger.error('Error fetching category notes:', error);
    return res.status(500).json({
      error: 'Error fetching category notes',
    });
  }
}

async function updateCategory(req, res) {
  try {
    if (req.body.parentId === req.params.id) {
      return res.status(400).json({
        error: 'Category cannot be its own parent',
      });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    logger.info('Category updated successfully', { categoryId: category._id });
    return res.status(200).json(category);
  } catch (error) {
    logger.error('Error updating category:', error);
    return res.status(500).json({ error: 'Error updating category' });
  }
}

async function deleteCategory(req, res) {
  try {
    const { force = false } = req.query;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const hasSubcategories = await Category.exists({ parentId: req.params.id });
    if (hasSubcategories && !force) {
      return res.status(400).json({
        error: 'Cannot delete category containing subcategories',
      });
    }

    if (hasSubcategories && force) {
      await Category.deleteMany({ parentId: req.params.id });
    }

    await category.deleteOne();

    logger.info('Category deleted successfully', { categoryId: req.params.id });
    return res.status(200).json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting category:', error);
    return res.status(500).json({ error: 'Error deleting category' });
  }
}

async function reorderCategories(req, res) {
  try {
    const { orders } = req.body;

    await Promise.all(
      orders.map(({ id, order }) => Category.findByIdAndUpdate(id, { $set: { order } }))
    );

    logger.info('Categories order updated successfully');
    return res.status(200).json({
      message: 'Categories order updated successfully',
    });
  } catch (error) {
    logger.error('Error reordering categories:', error);
    return res.status(500).json({
      error: 'Error reordering categories',
    });
  }
}

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryNotes,
  reorderCategories,
  getCategoryPath,
};
