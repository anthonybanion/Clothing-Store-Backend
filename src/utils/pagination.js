// ==========================================
//
// Description: Pagination
//
// File: pagination.js
// Author: Anthony Bañon
// Created: 2025-11-07
// Last Updated: 2025-11-07
// ==========================================

import { PAGINATION } from '../config/constants.js';

export const buildPagination = (filters = {}) => {
  const {
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
    sortBy = PAGINATION.DEFAULT_SORT_BY,
    sortOrder = PAGINATION.DEFAULT_SORT_ORDER,
  } = filters;

  const offset = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  return {
    page: Number(page),
    limit: Number(limit),
    offset,
    sort,
  };
};
