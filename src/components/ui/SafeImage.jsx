import { useEffect, useState } from 'react';
import { placeholder } from '../../config/images';

/** Image with lazy-loading and a branded fallback if the URL is broken. */
export default function SafeImage({ src, alt = '', className = '', label = 'MOTION', ...rest }) {
  const [failed, setFailed] = useState(false);

  // Reset error state whenever `src` changes (e.g. when switching color swatches)
  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <img
      src={failed || !src ? placeholder(label) : src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
