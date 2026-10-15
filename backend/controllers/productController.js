import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { findProducts } from '../services/productService.js';

const PRICE_BUCKETS = [99, 399, 499, 699, 999, 1499, 1999];

// @desc   Get products (paginated, supports ?keyword=, ?category=, ?maxPrice=, ?sort=, ?page=, ?limit=)
// @route  GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 24, 100);

  const { products, total, pages } = await findProducts({
    keyword: req.query.keyword,
    category: req.query.category,
    maxPrice: req.query.maxPrice,
    sort: req.query.sort,
    page,
    limit,
  });

  res.json({ products, page, pages, total });
});

// @desc   Get single product by id
// @route  GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc   Get randomized product deals grouped by category (paginated)
// @route  GET /api/products/category-deals
export const getCategoryDeals = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const imagesPerCategory = parseInt(req.query.imagesPerCategory) || 4;

  const allCategories = await Category.find({}).sort('name').lean();
  const start = (page - 1) * limit;
  const pageCategories = allCategories.slice(start, start + limit).map((c) => c.name);

  if (pageCategories.length === 0) {
    return res.json({ categories: [], hasMore: false });
  }

  const facet = {};
  pageCategories.forEach((name, i) => {
    facet[`c${i}`] = [
      { $match: { category: name } },
      { $sample: { size: imagesPerCategory } },
      { $project: { image: 1, discount: 1 } },
    ];
  });

  const [result] = await Product.aggregate([{ $facet: facet }]);

  const categories = pageCategories.map((name, i) => {
    const products = result[`c${i}`] || [];
    const maxDiscount = products.reduce((max, p) => Math.max(max, p.discount || 0), 0);
    return {
      name,
      label: maxDiscount > 0 ? `Min ${maxDiscount}% Off` : 'Explore Deals',
      images: products.map((p) => ({ id: p._id, image: p.image })),
    };
  });

  res.json({ categories, hasMore: start + limit < allCategories.length });
});

// @desc   Get randomized "under ₹X" deal cards
// @route  GET /api/products/price-deals
export const getPriceDeals = asyncHandler(async (req, res) => {
  const count = Math.min(parseInt(req.query.count) || 10, 20);

  const allCategories = await Category.find({}).select('name').lean();
  const shuffled = [...allCategories].sort(() => Math.random() - 0.5).slice(0, count);

  if (shuffled.length === 0) {
    return res.json({ deals: [] });
  }

  const facet = {};
  const picks = shuffled.map((c, i) => {
    const bucketPrice = PRICE_BUCKETS[Math.floor(Math.random() * PRICE_BUCKETS.length)];
    facet[`d${i}`] = [
      { $match: { category: c.name, price: { $lte: bucketPrice } } },
      { $sample: { size: 1 } },
      { $project: { image: 1 } },
    ];
    return { category: c.name, maxPrice: bucketPrice };
  });

  const [result] = await Product.aggregate([{ $facet: facet }]);

  const deals = picks
    .map((pick, i) => {
      const match = result[`d${i}`]?.[0];
      if (!match) return null;
      return { category: pick.category, maxPrice: pick.maxPrice, image: match.image };
    })
    .filter(Boolean);

  res.json({ deals });
});