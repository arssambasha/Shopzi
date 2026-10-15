import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback.jsx';
import StarRating from './StarRating.jsx';

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product._id}`}
      className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
    >
      <ImageWithFallback
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded mb-3"
      />
      <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
      <div className="mt-1">
        <StarRating rating={product.rating} numReviews={product.numReviews} size="sm" />
      </div>
      <div className="flex items-center gap-2 mt-1 flex-wrap">
        <p className="text-lg font-bold">₹{product.discountedPrice}</p>
        {product.discount > 0 && (
          <>
            <p className="text-xs text-gray-400 line-through">₹{product.price}</p>
            <p className="text-xs text-green-600 font-medium">{product.discount}% off</p>
          </>
        )}
      </div>
      <p className="text-xs text-gray-500">{product.category}</p>
    </Link>
  );
};

export default ProductCard;