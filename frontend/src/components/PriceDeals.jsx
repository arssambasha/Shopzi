import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import ImageWithFallback from './ImageWithFallback.jsx';

const PriceDeals = () => {
  const [deals, setDeals] = useState([]);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    api
      .get('/products/price-deals?count=10')
      .then(({ data }) => setDeals(data.deals))
      .catch((err) => console.error('Failed to load price deals', err));
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
  }, [deals]);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const firstItem = container.firstElementChild;
    if (!firstItem) return;
    const itemWidth = firstItem.getBoundingClientRect().width;
    const gap = 16;
    const scrollAmount = container.clientWidth - itemWidth - gap;
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  };

  if (deals.length === 0) return null;

  return (
    <div className="relative px-4 py-6">
      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-4 top-1/2 z-20 flex h-[120px] items-center -translate-y-1/2 rounded-r-xl bg-white p-4 shadow border border-gray-400"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M7.04 22L18 12 7.04 2"
              stroke="#0F1111"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="scale(-1, 1) translate(-24, 0)"
            />
          </svg>
        </button>
      )}

      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory"
        onScroll={checkScroll}
      >
        {deals.map((deal, i) => (
          <Link
            key={i}
            to={`/products?category=${encodeURIComponent(deal.category)}&maxPrice=${deal.maxPrice}`}
            className="flex-none w-64 h-80 snap-start rounded-lg relative overflow-hidden hover:shadow-lg transition-shadow"
          >
            <ImageWithFallback
              src={deal.image}
              alt={`${deal.category} under ₹${deal.maxPrice}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-4">
              <p className="text-lg font-bold text-white">Under ₹{deal.maxPrice}</p>
              <p className="text-sm text-white/90 mt-1">{deal.category}</p>
            </div>
          </Link>
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-4 top-1/2 z-20 flex h-[120px] items-center -translate-y-1/2 rounded-l-xl bg-white p-4 shadow border border-gray-400"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M7.04 22L18 12 7.04 2"
              stroke="#0F1111"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PriceDeals;