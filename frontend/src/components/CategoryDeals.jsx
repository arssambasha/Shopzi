import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import ImageWithFallback from './ImageWithFallback.jsx';

const LIMIT = 8;

const CategoryDeals = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  const fetchCategories = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/category-deals?page=${pageNum}&limit=${LIMIT}`);
      setCategories((prev) => {
        const seen = new Set(prev.map((c) => c.name));
        return [...prev, ...data.categories.filter((c) => !seen.has(c.name))];
      });
      setHasMore(data.hasMore);
    } catch (err) {
      console.error('Failed to fetch category deals', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories(1);
  }, [fetchCategories]);

  useEffect(() => {
    if (!hasMore || loading || !sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((prev) => {
            const next = prev + 1;
            fetchCategories(next);
            return next;
          });
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchCategories]);

  return (
    <div className="w-full px-4 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
            className="border rounded-lg p-4 bg-white hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
            <p className="text-xs text-gray-500 mb-3">{cat.label}</p>
            <div className="grid grid-cols-2 gap-1">
              {cat.images.map((img) => (
                <Link key={img.id} to={`/product/${img.id}`} onClick={(e) => e.stopPropagation()}>
                  <ImageWithFallback
                    src={img.image}
                    alt={cat.name}
                    className="w-full aspect-square object-cover rounded"
                  />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="text-center text-sm text-gray-400 py-4">Loading more categories...</p>}
      {hasMore && <div ref={sentinelRef} className="h-1" />}
      {!hasMore && categories.length > 0 && (
        <p className="text-center text-sm text-gray-400 py-4">No more categories</p>
      )}
    </div>
  );
};

export default CategoryDeals;