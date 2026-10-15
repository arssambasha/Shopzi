import { useContext, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios.js';
import { CategoriesContext } from '../context/CategoriesContext.jsx';
import ProductCard from './ProductCard.jsx';
import Loader from './Loader.jsx';

const priceOptions = [
  { label: 'Under ₹99', value: 99 },
  { label: 'Under ₹499', value: 499 },
  { label: 'Under ₹999', value: 999 },
  { label: 'Under ₹1999', value: 1999 },
];

const sortOptions = [
  { label: 'Top Rated', value: 'top' },
  { label: 'Newest', value: 'new' },
  { label: 'Price: Low to High', value: 'priceLow' },
  { label: 'Price: High to Low', value: 'priceHigh' },
];

const LIMIT = 24;

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const keyword = searchParams.get('keyword') || '';
  const sort = searchParams.get('sort') || 'top';

  const { categories: categoryOptions } = useContext(CategoriesContext);

  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const sentinelRef = useRef(null);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);

  const fetchProducts = useCallback(
    async (pageNum, signal) => {
      loadingRef.current = true;
      try {
        setLoading(true);
        setError('');
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (keyword) params.set('keyword', keyword);
        params.set('sort', sort);
        params.set('page', pageNum);
        params.set('limit', LIMIT);
        const { data } = await api.get(`/products?${params.toString()}`, { signal });
        setProducts((prev) => (pageNum === 1 ? data.products : [...prev, ...data.products]));
        setHasMore(pageNum < data.pages);
        setTotal(data.total);
      } catch (err) {
        if (!signal.aborted) setError('Could not load products');
      } finally {
        loadingRef.current = false;
        if (!signal.aborted) setLoading(false);
      }
    },
    [category, maxPrice, keyword, sort]
  );

  useEffect(() => {
    const controller = new AbortController();
    pageRef.current = 1;
    setProducts([]);
    setHasMore(true);
    fetchProducts(1, controller.signal);
    return () => controller.abort();
  }, [fetchProducts]);

  useEffect(() => {
    if (!hasMore || !sentinelRef.current) return;
    const controller = new AbortController();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingRef.current) {
          pageRef.current += 1;
          fetchProducts(pageRef.current, controller.signal);
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(sentinelRef.current);
    return () => {
      observer.disconnect();
      controller.abort();
    };
  }, [hasMore, fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
      <aside className="w-56 flex-none hidden sm:block sticky top-4 self-start">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Filters</h2>
          {(category || maxPrice) && (
            <button onClick={() => setSearchParams({})} className="text-xs text-blue-600">
              Clear all
            </button>
          )}
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-sm mb-2">Category</h3>
          <ul className="space-y-1">
            {categoryOptions.map((c) => (
              <li key={c}>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={category === c}
                    onChange={() => updateParam('category', c)}
                  />
                  {c}
                </label>
              </li>
            ))}
            {category && (
              <li>
                <button onClick={() => updateParam('category', '')} className="text-xs text-blue-600 mt-1">
                  Clear category
                </button>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-sm mb-2">Price</h3>
          <ul className="space-y-1">
            {priceOptions.map((p) => (
              <li key={p.value}>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="maxPrice"
                    checked={Number(maxPrice) === p.value}
                    onChange={() => updateParam('maxPrice', p.value)}
                  />
                  {p.label}
                </label>
              </li>
            ))}
            {maxPrice && (
              <li>
                <button onClick={() => updateParam('maxPrice', '')} className="text-xs text-blue-600 mt-1">
                  Clear price
                </button>
              </li>
            )}
          </ul>
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <p className="text-sm text-gray-500">
            {keyword && `"${keyword}" `}
            {category && `in "${category}" `}
            {maxPrice && `under ₹${maxPrice} `}
            {total > 0 && `(${total} results)`}
          </p>
          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              {sortOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <Link to="/" className="text-sm text-blue-600">Back to Home</Link>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {!loading && products.length === 0 && <p className="text-gray-500">No products found.</p>}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        {loading && <Loader />}
        {hasMore && <div ref={sentinelRef} className="h-1" />}
        {!hasMore && products.length > 0 && (
          <p className="text-center text-sm text-gray-400 py-4">No more products</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;