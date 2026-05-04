import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getDashboardStats,
} from '../controllers/productController.js';

const router = express.Router();

// Public — frontend can fetch these
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin — create / update / delete
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
export { getDashboardStats };
