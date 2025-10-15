// ==========================================
//
// Description: Product services for managing products
//
// File: product.services.js
// Author: Anthony Bañon
// Created: 2025-10-14
// Last Updated: 2025-10-14
// ==========================================

// In-memory product storage for demonstration purposes
let products = [
  { id: 1, name: 'Banana', price: 50 },
  { id: 2, name: 'Apple', price: 100 },
  { id: 3, name: 'Orange', price: 150 },
  { id: 4, name: 'Mango', price: 200 },
  { id: 5, name: 'Pineapple', price: 250 },
];

export const productsService = () => {
  function getOne(id) {
    // Logic to retrieve a product by ID
    return products.find((product) => product.id === id);
  }

  function getAll() {
    // Logic to retrieve all products
    return products;
  }

  function create(name, price) {
    // Logic to create a new product
    const newProduct = {
      id: products.length + 1,
      name,
      price,
    };
    products.push(newProduct);
    return newProduct;
  }

  function update(id, name, price) {
    // Logic to update an existing product
    const product = products.find((product) => product.id === id);

    // If the product exists, update its details
    if (product) {
      product.name = name;
      product.price = price;
      return product;
    }
    return null;
  }

  function updatePartial(id, updates) {
    // Logic to partially update an existing product
    const product = products.find((product) => product.id === id);

    // If the product exists, update its details
    if (product) {
      // Update the product with the new values
      Object.assign(product, updates);
      return product;
    }
    return null;
  }

  function deleted(id) {
    // Logic to delete a product by ID
    const index = products.findIndex((product) => product.id === id);

    // If the product exists, remove it from the array
    if (index !== -1) {
      // Remove the product
      products.splice(index, 1);
      return true;
    }
    return false;
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
