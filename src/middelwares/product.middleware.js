import { validateProduct } from '../validations/product.validation.js';

export const productValidator = (req, res, next) => {
  const { error } = validateProduct(req.body);
  if (error) {
    return res.status(400).json({
      errors: error.details.map((d) => d.message),
    });
  }
  next();
};
