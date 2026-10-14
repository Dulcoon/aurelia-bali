'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

export function SafeImage({
  src,
  fallbackSrc = '/images/fallback-hero.jpg',
  alt,
  className = '',
  fill = true,
  width,
  height,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  React.useEffect(() => {
    setImgSrc(src || fallbackSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        unoptimized
        onError={handleError}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 1200}
      height={height || 800}
      priority={priority}
      sizes={sizes}
      unoptimized
      onError={handleError}
      className={`object-cover ${className}`}
    />
  );
}
