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
    const updatedCategory = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
    return updatedCategory;
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

  async delete(id) {
    return await Category.findByIdAndDelete(id).exec();
  }
}

export default new CategoryService();
