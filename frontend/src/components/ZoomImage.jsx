import { useRef, useState } from 'react';
import ImageWithFallback from './ImageWithFallback.jsx';

const ZoomImage = ({ src, alt, zoomScale = 2.2, className = '' }) => {
  const containerRef = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState('center');

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <ImageWithFallback
        src={src}
        alt={alt}
        className="w-full h-full object-contain cursor-zoom-in"
        style={{
          transform: zoomed ? `scale(${zoomScale})` : 'scale(1)',
          transformOrigin: origin,
          transition: zoomed ? 'none' : 'transform 0.2s ease-out',
        }}
      />
    </div>
  );
};

export default ZoomImage;