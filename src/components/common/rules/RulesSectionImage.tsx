'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl, imageLoader } from '@/utils/image-utils';

interface RulesSectionImageProps {
  image: string;
  alt: string;
}

export default function RulesSectionImage({
  image,
  alt,
}: RulesSectionImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  if (!image || !image.trim()) {
    return null;
  }

  const imageUrl = getImageUrl(image);

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="shrink-0 max-[767px]:w-full">
      <div className="relative w-full max-w-md h-48 md:h-64 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
        {isLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        {!imageError && (
          <img
            src={imageUrl}
            alt={alt}
            className="object-contain p-4 transition-opacity duration-300 w-full h-full rounded-[20px]"
            onError={() => {
              setImageError(true);
              setIsLoading(false);
            }}
            onLoad={() => {
              setIsLoading(false);
              setImageError(false);
            }}
          />
        )}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center text-white/50">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
