import { useState, useEffect, useRef } from 'react';
import { NO_IMAGE_URL } from '../constants/images.js';

const ImageWithFallback = ({ src, alt, className = '', style, ...rest }) => {
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setErrored(false);
  }, [src]);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={errored || !src ? NO_IMAGE_URL : src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      style={{
        ...(loaded ? {} : { backgroundColor: '#e5e7eb', animation: 'img-pulse 1.4s ease-in-out infinite' }),
        ...style,
      }}
      onLoad={() => setLoaded(true)}
      onError={() => {
        setErrored(true);
        setLoaded(true);
      }}
      {...rest}
    />
  );
};

export default ImageWithFallback;