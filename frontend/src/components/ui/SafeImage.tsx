'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

export function SafeImage({ src, alt, fallbackSrc = '/default-image.png', ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || ''}
      onError={handleError}
    />
  );
}
