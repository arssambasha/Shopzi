import Product from '../models/Product.js';

export const SORT_OPTIONS = {
  top: '-score',
  new: '-createdAt',
  priceLow: 'price',
  priceHigh: '-price',
};

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const findProducts = async ({
  keyword,
  category,
  maxPrice,
  sort,
  page = 1,
  limit = 24,
  select = '-images -description',
}) => {
  const filter = {};

  if (typeof keyword === 'string' && keyword.trim()) {
    filter.name = { $regex: escapeRegex(keyword.trim()), $options: 'i' };
  }
  if (typeof category === 'string' && category) {
    filter.category = category;
  }
  if (Number(maxPrice) > 0) {
    filter.price = { $lte: Number(maxPrice) };
  }

  const sortBy = Object.hasOwn(SORT_OPTIONS, sort) ? SORT_OPTIONS[sort] : SORT_OPTIONS.top;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .select(select)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return { products, total, pages: Math.ceil(total / limit) || 1 };
};