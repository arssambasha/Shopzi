import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import Category from './models/Category.js';

dotenv.config();
connectDB();

const CSV_PATH = path.resolve("D:\\My Projects\\am\\dataset\\flipkart_com-ecommerce_sample.csv"); // adjust to your file

const toNumber = (val) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : 0;
};

const parseImages = (raw) => {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const normalizeForCompare = (str) =>
  (str || '')
    .toLowerCase()
    .replace(/\.\.\.$/, '')
    .replace(/\s+/g, ' ')
    .trim();

const isCategoryJustProductName = (category, productName) => {
  const normCategory = normalizeForCompare(category);
  const normName = normalizeForCompare(productName);
  if (!normCategory || !normName) return false;
  return normName.startsWith(normCategory) || normCategory.startsWith(normName);
};

const getFirstCategorySegment = (raw) => {
  try {
    const arr = JSON.parse(raw);
    const tree = Array.isArray(arr) ? arr[0] : String(raw);
    return tree.split('>>')[0].trim();
  } catch {
    return null;
  }
};

const randomRating = () => Number((Math.random() * 4 + 1).toFixed(1)); // 1.0–5.0
const randomReviews = () => Math.floor(Math.random() * 500);
const randomStock = () => Math.floor(Math.random() * 100) + 1;

const transformRow = (row) => {
  const name = row.product_name?.trim();
  const firstSegment = getFirstCategorySegment(row.product_category_tree);

  // no real category — the "tree" is just the product name (possibly truncated)
  if (!firstSegment || isCategoryJustProductName(firstSegment, name)) {
    return null;
  }

  const images = parseImages(row.image);
  const price = toNumber(row.retail_price);
  const discountedPrice = toNumber(row.discounted_price) || price;
  const discount =
    price > 0 && discountedPrice > 0 && discountedPrice < price
      ? Math.round(((price - discountedPrice) / price) * 100)
      : 0;

  return {
    name,
    description: row.description?.trim() || name,
    image: images[0] || '',
    images,
    price,
    discountedPrice,
    discount,
    category: firstSegment,
    brand: row.brand?.trim() || 'Generic',
    stock: randomStock(),
    rating: randomRating(),
    numReviews: randomReviews(),
  };
};

const buildCategoryImageMap = (products) => {
  const map = {};
  for (const p of products) {
    if (!map[p.category]) map[p.category] = p.image; // first product's image wins
  }
  return map;
};


const importData = async () => {
  try {
    const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const rows = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    });

    const products = rows
      .map(transformRow)
      .filter(Boolean)
      .filter((p) => p.name && p.image);

    await Product.deleteMany();
    await Product.insertMany(products);

    await Category.deleteMany();
    const categoryImages = buildCategoryImageMap(products);
    const categories = Object.entries(categoryImages).map(([name, image]) => ({ name, image }));
    await Category.insertMany(categories);

    console.log(
      `${products.length} products imported, ${categories.length} categories created (${rows.length - products.length} skipped)`
    );
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();