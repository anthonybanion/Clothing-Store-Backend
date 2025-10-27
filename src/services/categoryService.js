import Category from '../models/categoryModel.js';

class CategoryService {
  /**
   * Get one category by ID
   * param {string} id - Category ID
   * returns {Promise<Object>} Category document
   */
  async getOne(id) {
    return await Category.findById(id).exec();
  }

  /**
   * Get all active categories
   * returns {Promise<Array>} List of categories
   */
  async getAll() {
    return await Category.find({ is_active: true }).exec();
  }

  /**
   * Create a new category
   * param {Object} data - Category data
   * returns {Promise<Object>} Created category
   */
  async create(data) {
    const category = new Category(data);
    return await category.save();
  }

  /**
   * Update a category completely
   * param {string} id - Category ID
   * param {Object} data - Complete category data
   * returns {Promise<Object>} Updated category
   */
  async update(id, data) {
    const category = await Category.findById(id);
    if (!category) return null;

    // Replace all fields with new data
    Object.assign(category, data);
    // Validates entire schema with save()
    return await category.save();
  }

  /**
   * Partially update a category
   * param {string} id - Category ID
   * param {Object} updates - Partial category data
   * returns {Promise<Object>} Updated category
   */
  async updatePartial(id, updates) {
    const updatedCategory = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).exec();
    return updatedCategory;
  }

  /**
   *  Soft delete a category by setting is_active to false
   * param {string} id - Category ID
   * returns {Promise<Object>} Deleted category
   */
  async delete(id) {
    return await Category.findByIdAndUpdate(
      id,
      { is_active: false },
      { new: true }
    ).exec();
  }
}

export default new CategoryService();
