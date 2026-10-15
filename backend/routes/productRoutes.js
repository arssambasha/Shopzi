import express from 'express';
import { getProducts, getProductById, getCategoryDeals, getPriceDeals } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/category-deals', getCategoryDeals);
router.get('/price-deals', getPriceDeals);
router.get('/:id', getProductById);

export default router;