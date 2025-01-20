const { categories } = require('../data/mockData');

class CategoryService {
  static getAllCategories() {
    return categories;
  }

  static getCategoryById(id) {
    return categories.find((cat) => cat._id === id);
  }

  static getCategoryPath(id) {
    const path = [];
    let currentCategory = this.getCategoryById(id);

    while (currentCategory) {
      path.unshift(currentCategory);
      currentCategory = currentCategory.parentId
        ? this.getCategoryById(currentCategory.parentId)
        : null;
    }

    return path;
  }

  static createCategory(data) {
    const newCategory = {
      _id: (categories.length + 1).toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    categories.push(newCategory);
    return newCategory;
  }

  static updateCategory(id, data) {
    const index = categories.findIndex((cat) => cat._id === id);
    if (index === -1) return null;

    if (data.parentId === id) {
      throw new Error('Category cannot be its own parent');
    }

    const updatedCategory = {
      ...categories[index],
      ...data,
      _id: id,
      updatedAt: new Date().toISOString(),
    };

    categories[index] = updatedCategory;
    return updatedCategory;
  }

  static deleteCategory(id) {
    const index = categories.findIndex((cat) => cat._id === id);
    if (index === -1) return false;

    const hasSubcategories = categories.some((cat) => cat.parentId === id);
    if (hasSubcategories) {
      throw new Error('Cannot delete category with subcategories');
    }

    categories.splice(index, 1);
    return true;
  }

  static buildCategoryTree(parentId = null) {
    return categories
      .filter((category) => category.parentId === parentId)
      .map((category) => ({
        ...category,
        children: this.buildCategoryTree(category._id),
      }));
  }

  static reorderCategories(orderedIds) {
    orderedIds.forEach((id, index) => {
      const category = categories.find((cat) => cat._id === id);
      if (category) {
        category.order = index + 1;
        category.updatedAt = new Date().toISOString();
      }
    });
    return this.getAllCategories();
  }
}

module.exports = CategoryService;
