import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';

// @desc   Get all categories
// @route  GET /api/categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort('name').lean();
  res.json(categories);
});