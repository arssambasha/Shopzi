import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import { BASELINE_RATING, MIN_VOTES } from '../utils/productScore.js';

const run = async () => {
  await connectDB();

  const result = await Product.updateMany({}, [
    {
      $set: {
        score: {
          $divide: [
            { $add: [{ $multiply: ['$rating', '$numReviews'] }, BASELINE_RATING * MIN_VOTES] },
            { $add: ['$numReviews', MIN_VOTES] },
          ],
        },
      },
    },
  ]);

  console.log(`Backfilled score on ${result.modifiedCount} products.`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('Backfill failed:', err);
  process.exit(1);
});