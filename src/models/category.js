const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxLength: [100, 'Category name cannot be longer than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [500, 'Description cannot be longer than 500 characters'],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ parentId: 1 });
categorySchema.index({ name: 1, parentId: 1 }, { unique: true });

categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId',
});

categorySchema.virtual('noteCount', {
  ref: 'Note',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

function getParentIds(categories, currentId, result = []) {
  const category = categories.find((cat) => cat._id.equals(currentId));
  if (!category || !category.parentId) {
    return result;
  }
  result.push(category.parentId);
  return getParentIds(categories, category.parentId, result);
}

categorySchema.methods.getPath = async function getPath() {
  const path = [this];

  if (!this.parentId) {
    return path;
  }

  try {
    const allCategories = await this.constructor.find({}).select('_id parentId');

    const parentIds = getParentIds(allCategories, this._id);

    if (parentIds.length > 0) {
      const parents = await this.constructor
        .find({ _id: { $in: parentIds } })
        .sort({ createdAt: 1 });

      path.unshift(...parents);
    }

    return path;
  } catch (error) {
    console.error('Error retrieving category path:', error);
    throw new Error('Failed to retrieve category path');
  }
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
