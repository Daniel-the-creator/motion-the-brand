import { useState } from 'react';
import { placeholder } from '../../config/images';

/** Image with lazy-loading and a branded fallback if the URL is broken. */
export default function SafeImage({ src, alt = '', className = '', label = 'MOTION', ...rest }) {
  const [failed, setFailed] = useState(false);
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

