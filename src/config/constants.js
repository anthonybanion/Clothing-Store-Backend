export const ROLE = {
  ADMIN: 'admin', // Admin user with full permissions
  USER: 'user', // Regular user with limited permissions
};

export const CODE = {
  //Success
  SUCCESS: 200, // GET successful, PUT/PATCH successful (with data in response)
  CREATED: 201, // POST successful (resource created)
  NO_CONTENT: 204, // DELETE successful, PUT/PATCH successful (no data in response)

  // Client errors
  BAD_REQUEST: 400, // Validation failed, malformed data
  UNAUTHORIZED: 401, // Not authenticated (token missing)
  FORBIDDEN: 403, // Authenticated but no permissions
  NOT_FOUND: 404, // Resource does not exist
  METHOD_NOT_ALLOWED: 405, // HTTP method not allowed
  CONFLICT: 409, // Conflict (e.g. duplicate email)
  UNPROCESSABLE_ENTITY: 422, // Validation failed (semantic errors)
  TOO_MANY_REQUESTS: 429, // Rate limiting

  // Server errors
  INTERNAL_ERROR: 500, // Generic server error
  SERVICE_UNAVAILABLE: 503, // Maintenance, third-party service down
};

export const PAGINATION = {
  DEFAULT_LIMIT: 10, // Default items per page
  MAX_LIMIT: 100, // Maximum items per page
  DEFAULT_PAGE: 1, // Default page number
};

export const LIMIT = {
  PROFILE_IMAGE: 5 * 1024 * 1024, // 5 MB
};
