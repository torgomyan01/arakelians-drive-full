'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl, imageLoader } from '@/utils/image-utils';

interface RulesSectionCardProps {
  section: {
    id: number;
    title: string;
    description: string;
    slug: string;
    image?: string | null;
  };
  index: number;
}

export default function RulesSectionCard({
  section,
  index,
}: RulesSectionCardProps) {
  const sectionWithImage = section as typeof section & { image?: string | null };
  const hasImage = sectionWithImage.image && sectionWithImage.image.trim();

  return (
    <Link
      href={`/rules/${section.slug}`}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#FA8604]"
    >
      {/* Card Number Badge */}
      <div className="absolute top-4 right-4 w-10 h-10 bg-[#FA8604] text-white rounded-full flex items-center justify-center font-bold text-lg z-10">
        {index + 1}
      </div>

      {/* Image Section */}
      {hasImage ? (
        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
          <Image
            src={getImageUrl(sectionWithImage.image!)}
            alt={section.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loader={imageLoader}
            unoptimized
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-[#FA8604] to-[#FFA64D] flex items-center justify-center">
          <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {section.title.charAt(0)}
            </span>
          </div>
        </div>
      )}

      <div className="p-6">

        {/* Title */}
        <h2 className="text-xl font-bold text-[#1A2229] mb-3 group-hover:text-[#FA8604] transition-colors duration-300 line-clamp-2">
          {section.title}
        </h2>

        {/* Description */}
        <p className="text-[#8D8D8D] text-sm leading-relaxed line-clamp-3 mb-4">
          {section.description}
        </p>

        {/* Read More Link */}
        <div className="flex items-center text-[#FA8604] font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
          <span>Կարդալ ավելին</span>
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FA8604]/0 to-[#FA8604]/0 group-hover:from-[#FA8604]/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
    </Link>
  );
}
