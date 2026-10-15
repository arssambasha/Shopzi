import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';
import { CartContext } from '../context/CartContext.jsx';
import Loader from '../components/Loader.jsx';
import ImageWithFallback from '../components/ImageWithFallback.jsx';
import ZoomImage from '../components/ZoomImage.jsx';
import StarRating from '../components/StarRating.jsx';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setSelectedImage(data.images?.[0] || data.image);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <p className="text-center py-10">Product not found</p>;

  const gallery = product.images?.length ? product.images : [product.image];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-8 items-start">
      <div className="flex gap-3 min-w-0">
        <div className="flex flex-col gap-2 shrink-0">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img)}
              className={`w-16 h-16 rounded border-2 overflow-hidden shrink-0 ${selectedImage === img ? 'border-orange-500' : 'border-gray-200'
                }`}
            >
              <ImageWithFallback
                src={img}
                alt={`${product.name} ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0 aspect-square border rounded-lg overflow-hidden bg-gray-50">
          <ZoomImage src={selectedImage} alt={product.name} className="w-full h-full" />
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

        {product.rating > 0 && (
          <div className="mb-3">
            <StarRating rating={product.rating} numReviews={product.numReviews} />
          </div>
        )}

        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-2xl font-bold">₹{product.discountedPrice}</p>
          {product.discount > 0 && (
            <>
              <p className="text-lg text-gray-400 line-through">₹{product.price}</p>
              <p className="text-sm text-green-600 font-medium">{product.discount}% off</p>
            </>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-4">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
        <div className="flex items-center gap-3 mb-4">
          <label htmlFor="qty">Qty:</label>
          <input
            id="qty"
            type="number"
            min="1"
            max={product.stock}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="border rounded px-2 py-1 w-16"
          />
        </div>
        <button
          onClick={() => addToCart(product, qty)}
          disabled={product.stock === 0}
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;