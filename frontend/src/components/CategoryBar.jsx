import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CategoriesContext } from '../context/CategoriesContext.jsx';

const CategoryBar = () => {
  const { categories } = useContext(CategoriesContext);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
  }, [categories]);

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({ left: direction * 220, behavior: 'smooth' });
  };

  return (
    <div className="relative bg-slate-800 text-white">
      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-r from-slate-800 to-transparent"
        >
          ‹
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="no-scrollbar flex items-center gap-5 overflow-x-auto text-sm px-6 py-2"
      >
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`/products?category=${encodeURIComponent(cat)}`}
            className="whitespace-nowrap hover:underline"
          >
            {cat}
          </Link>
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-l from-slate-800 to-transparent"
        >
          ›
        </button>
      )}
    </div>
  );
};

export default CategoryBar;