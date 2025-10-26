import Product from '../models/product.model.js';

export const productsService = () => {
  async function getOne(id) {
    return Product.findById(id).exec();
  }

  async function getAll() {
    return Product.find().exec();
  }

  async function create(data) {
    // data already validated by middleware
    const product = new Product(data);

    //  Save the new product to the database
    return product.save();
  }

  async function update(id, data) {
    // Replace the entire document
    return Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async function updatePartial(id, updates) {
    // Update only the fields present
    return Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async function deleted(id) {
    // Soft delete a product by ID
    const result = await Product.findByIdAndUpdate(id, { state: false }).exec();
    return result ? true : false;
  }

  return {
    getOne,
    getAll,
    create,
    update,
    updatePartial,
    deleted,
  };
};
