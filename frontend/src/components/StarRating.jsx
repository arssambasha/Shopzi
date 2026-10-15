const Star = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const StarRating = ({ rating, numReviews = 0, size = 'md' }) => {
  if (!rating || rating <= 0) return null;

  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const fillPercent = Math.min(Math.max(rating - (star - 1), 0), 1) * 100;
          return (
            <div key={star} className={`relative ${starSize}`}>
              <Star className={`${starSize} text-gray-300`} />
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <Star className={`${starSize} text-yellow-400 fill-yellow-400`} />
              </div>
            </div>
          );
        })}
      </div>
      <span className={`${textSize} text-gray-600`}>
        {rating.toFixed(1)} ({numReviews} reviews)
      </span>
    </div>
  );
};

export default StarRating;