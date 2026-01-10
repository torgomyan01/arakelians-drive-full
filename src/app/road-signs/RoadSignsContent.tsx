'use client';

import { useState, useMemo } from 'react';
import { RoadSign } from '@/app/actions/road-signs';
import {
  categoryLabels,
  type RoadSignCategory,
} from '@/utils/road-signs-utils';
import { SITE_URL } from '@/utils/consts';
import Image from 'next/image';
import { getImageUrl } from '@/utils/image-utils';

interface RoadSignsContentProps {
  initialSigns: RoadSign[];
}

export default function RoadSignsContent({
  initialSigns,
}: RoadSignsContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    RoadSignCategory | 'all'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [signs] = useState<RoadSign[]>(initialSigns);

  const categories: (RoadSignCategory | 'all')[] = [
    'all',
    'warning',
    'priority',
    'prohibitory',
    'mandatory',
    'special',
    'information',
    'service',
    'additional',
  ];

  const filteredSigns = useMemo(() => {
    // Start with a fresh copy of all signs
    let filtered: RoadSign[] = [...signs];

    // Filter by category first
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((sign) => sign.category === selectedCategory);
    }

    // Then apply search filter if search term exists
    const trimmedSearch = searchTerm.trim();
    if (trimmedSearch) {
      const term = trimmedSearch.toLowerCase();
      filtered = filtered.filter((sign) => {
        const name = sign.name?.toLowerCase() || '';
        const description = sign.description?.toLowerCase() || '';
        const number = sign.number?.toLowerCase() || '';

        return (
          name.includes(term) ||
          description.includes(term) ||
          number.includes(term)
        );
      });
    }

    // Return a new array reference to ensure React detects the change
    return [...filtered];
  }, [signs, selectedCategory, searchTerm]);

  const getCategoryColor = (category: RoadSignCategory) => {
    switch (category) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'priority':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'prohibitory':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'mandatory':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'special':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'information':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'service':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'additional':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="container-full pt-[100px] max-w-[1350px] w-full max-[767px]:pt-[90px]">
      <div>
        {/* Breadcrumb */}
        <ul className="flex mb-8 max-[767px]:mb-5">
          <li>
            <a href={SITE_URL.HOME} className="text-[#8D8D8D] text-base">
              Գլխաոր էջ{' '}
            </a>
          </li>
          <li>
            <span className="text-[#8D8D8D] text-base ml-1">
              / Ճանապարհային Նշաններ
            </span>
          </li>
        </ul>

        <h1 className="global-title mb-[60px] max-[1024px]:mb-8">
          Ճանապարհային Նշաններ
        </h1>

        <div className="mb-8">
          <p className="text-[#222] text-lg leading-relaxed max-w-4xl">
            Հայաստանի Հանրապետության ճանապարհային նշանների ամբողջական ցանկ:
            Բոլոր նշանները բաժանված են 8 խմբի՝ նախազգուշացնող, առավելության,
            արգելող, թելադրող, հատուկ թելադրանքի, տեղեկատվության, սպասարկման և
            լրացուցիչ տեղեկատվության:
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Որոնել նշաններում..."
              className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-[#FA8604] focus:outline-none text-[#222] placeholder-gray-400"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  // Clear search when changing category to ensure clean filter
                  if (searchTerm) {
                    setSearchTerm('');
                  }
                  setSelectedCategory(category);
                }}
                type="button"
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-[#FA8604] text-white shadow-md'
                    : 'bg-white text-[#222] border-2 border-gray-200 hover:border-[#FA8604]'
                }`}
              >
                {category === 'all'
                  ? 'Բոլորը'
                  : categoryLabels[category as RoadSignCategory]}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-[#8D8D8D]">
          {searchTerm.trim() || selectedCategory !== 'all' ? (
            <>
              Գտնվել է{' '}
              <span className="font-semibold text-[#222]">
                {filteredSigns.length}
              </span>{' '}
              նշան
              {selectedCategory !== 'all' && (
                <span className="ml-2">
                  ({categoryLabels[selectedCategory as RoadSign['category']]})
                </span>
              )}
            </>
          ) : (
            <>
              Ընդամենը{' '}
              <span className="font-semibold text-[#222]">{signs.length}</span>{' '}
              նշան
            </>
          )}
        </div>

        {/* Signs Grid */}
        {filteredSigns.length === 0 ? (
          <div className="text-center py-16 mb-[100px] max-[767px]:mb-8">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-24 h-24 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#222] mb-2">
              Նշաններ չգտնվեցին
            </h3>
            <p className="text-[#8D8D8D] mb-6">
              {searchTerm.trim()
                ? 'Փորձեք փոխել որոնման տերմինը կամ ֆիլտրը'
                : 'Ընտրված կատեգորիայում նշաններ չկան'}
            </p>
            {(searchTerm.trim() || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-3 bg-[#FA8604] text-white rounded-lg font-semibold hover:bg-[#FF9500] transition-colors duration-200"
              >
                Մաքրել բոլոր ֆիլտրերը
              </button>
            )}
          </div>
        ) : (
          <div
            key={`signs-grid-${selectedCategory}-${searchTerm}`}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-[100px] max-[767px]:mb-8"
          >
            {filteredSigns.map((sign) => (
              <div
                key={sign.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#FA8604]"
              >
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className={`${getCategoryColor(
                      sign.category
                    )} px-3 py-1 rounded-full text-xs font-semibold border`}
                  >
                    {categoryLabels[sign.category]}
                  </span>
                </div>

                {/* Number Badge */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-[#FA8604] text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                  {sign.number}
                </div>

                <div className="p-6 pt-16">
                  {/* Sign Image */}
                  <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center mb-4 overflow-hidden relative">
                    {sign.image ? (
                      <Image
                        src={getImageUrl(sign.image)}
                        alt={sign.name}
                        width={200}
                        height={200}
                        className="object-contain w-full h-full filter-[brightness(1.5)]"
                        onError={(e) => {
                          // Fallback if image doesn't exist
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center text-gray-400">
                                <div class="text-center">
                                  <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <p class="text-sm">Նկար ավելացնել</p>
                                </div>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <svg
                            className="w-16 h-16 mx-auto mb-2"
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
                          <p className="text-sm">Նկար ավելացնել</p>
                        </div>
                      </div>
                    )}

                    {/* <div className="absolute bottom-0 left-0 w-full h-full bg-white "></div> */}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-[#1A2229] mb-3 group-hover:text-[#FA8604] transition-colors duration-300 line-clamp-2">
                    {sign.name}
                  </h2>

                  {/* Description */}
                  <p className="text-[#8D8D8D] text-sm leading-relaxed line-clamp-4 mb-4">
                    {sign.description}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FA8604]/0 to-[#FA8604]/0 group-hover:from-[#FA8604]/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="bg-gradient-to-r from-[#FA8604] to-[#FFA64D] rounded-2xl p-8 text-white mb-8">
          <h3 className="text-2xl font-bold mb-4">Կարևոր տեղեկություն</h3>
          <p className="text-lg leading-relaxed opacity-95">
            Ճանապարհային նշանները բաժանվում են 8 խմբի: Յուրաքանչյուր նշան ունի
            իր համարը և նշանակությունը: Նշանները տեղադրվում են ճանապարհի եզրին և
            կարևոր են երթևեկության անվտանգության ապահովման համար: Բոլոր նշանները
            պետք է ճանաչել և պահպանել վարորդական իրավունքի քննության հաջող
            հանձնման համար:
          </p>
        </div>

        {/* Attribution Section */}
        <div className="border-t border-gray-200 pt-6 pb-[100px] max-[767px]:pb-8">
          <p className="text-sm text-[#8D8D8D] text-center leading-relaxed">
            <span className="inline-block mb-2">
              Տեղեկատվությունը և նկարները վերցված են{' '}
              <a
                href="https://varord.am"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FA8604] hover:text-[#FF9500] underline transition-colors duration-200"
              >
                varord.am
              </a>{' '}
              կայքից
            </span>
            <br />
            <span className="text-xs opacity-75">
              Բոլոր նշանները և նկարագրությունները պատկանում են համապատասխան
              հեղինակներին
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
