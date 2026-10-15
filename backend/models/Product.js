import mongoose from 'mongoose';
import { computeProductScore } from '../utils/productScore.js';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    price: { type: Number, required: true, default: 0 },
    discountedPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    category: { type: String, required: true },
    brand: { type: String },
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ score: -1 });

productSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('rating') || this.isModified('numReviews')) {
    this.score = computeProductScore(this.rating, this.numReviews);
  }
  next();
});

export default mongoose.model('Product', productSchema);