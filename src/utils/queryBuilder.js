// ==========================================
//
// Description: Buil Query
//
// File: queryBuilder.js
// Author: Anthony Bañon
// Created: 2025-11-07
// Last Updated: 2025-11-07
// ==========================================

export const buildQuery = (filters = {}, defaultQuery = {}) => {
  const query = { ...defaultQuery };
  const { name, is_active, minPrice, maxPrice, category } = filters;

  if (name) query.name = { $regex: name, $options: 'i' };
  if (is_active !== undefined) query.is_active = is_active;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (category) query.category = category;

  return query;
};
