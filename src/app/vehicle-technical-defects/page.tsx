'use client';

import { useState, useMemo } from 'react';
import MainTemplate from '@/components/layout/main-template/main-template';
import {
  getAllTechnicalDefects,
  getTechnicalDefectsByCategory,
  categoryLabels,
  VehicleTechnicalDefect,
} from '@/utils/vehicleTechnicalDefects';
import { SITE_URL } from '@/utils/consts';

export default function VehicleTechnicalDefectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    VehicleTechnicalDefect['category'] | 'all'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories: (VehicleTechnicalDefect['category'] | 'all')[] = [
    'all',
    'braking',
    'steering',
    'lighting',
    'wheels',
    'engine',
    'other',
  ];

  const allDefects = getAllTechnicalDefects();

  const filteredDefects = useMemo(() => {
    // Start with a fresh copy of all defects
    let defects: VehicleTechnicalDefect[] = [...allDefects];

    // Filter by category first
    if (selectedCategory !== 'all') {
      defects = defects.filter(
        (defect) => defect.category === selectedCategory
      );
    }

    // Then apply search filter if search term exists
    const trimmedSearch = searchTerm.trim();
    if (trimmedSearch) {
      const term = trimmedSearch.toLowerCase();
      defects = defects.filter((defect) => {
        const description = defect.description?.toLowerCase() || '';
        const number = defect.number?.toLowerCase() || '';

        return description.includes(term) || number.includes(term);
      });
    }

    // Return a new array reference to ensure React detects the change
    return [...defects];
  }, [selectedCategory, searchTerm, allDefects]);

  const getCategoryColor = (category: VehicleTechnicalDefect['category']) => {
    switch (category) {
      case 'braking':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'steering':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'lighting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'wheels':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'engine':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'other':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <MainTemplate>
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
              <span className="text-[#8D8D8D] text-base ml-1 ">
                / Տրանսպորտային Միջոցների Տեխնիկական Անսարքություններ
              </span>
            </li>
          </ul>

          <h1 className="global-title mb-[60px] max-[1024px]:mb-8">
            Տրանսպորտային Միջոցների Տեխնիկական Անսարքություններ
          </h1>

          <div className="mb-8">
            <p className="text-[#222] text-lg leading-relaxed max-w-4xl">
              Տրանսպորտային միջոցների տեխնիկական անսարքությունների և պայմանների
              ցանկ, որոնք արգելում են երթևեկությունը: Բոլոր անսարքությունները
              բաժանված են 6 խմբի՝ արգելակային համակարգ, ղեկային կառավարման
              համակարգ, արտաքին լուսային սարքեր, անիվներ և դողեր, շարժիչ և այլ:
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Որոնել անսարքություններում..."
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
                    : categoryLabels[
                        category as VehicleTechnicalDefect['category']
                      ]}
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
                  {filteredDefects.length}
                </span>{' '}
                անսարքություն
                {selectedCategory !== 'all' && (
                  <span className="ml-2">
                    (
                    {
                      categoryLabels[
                        selectedCategory as VehicleTechnicalDefect['category']
                      ]
                    }
                    )
                  </span>
                )}
              </>
            ) : (
              <>
                Ընդամենը{' '}
                <span className="font-semibold text-[#222]">
                  {allDefects.length}
                </span>{' '}
                անսարքություն
              </>
            )}
          </div>

          {/* Defects List */}
          {filteredDefects.length === 0 ? (
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
                Անսարքություններ չգտնվեցին
              </h3>
              <p className="text-[#8D8D8D] mb-6">
                {searchTerm.trim()
                  ? 'Փորձեք փոխել որոնման տերմինը կամ ֆիլտրը'
                  : 'Ընտրված կատեգորիայում անսարքություններ չկան'}
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
              key={`defects-list-${selectedCategory}-${searchTerm}`}
              className="space-y-4 mb-[100px] max-[767px]:mb-8"
            >
              {filteredDefects.map((defect) => (
                <div
                  key={defect.id}
                  className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#FA8604] p-6"
                >
                  <div className="flex items-start gap-4 flex-col md:flex-row">
                    {/* Category Badge */}
                    <div className="flex-shrink-0">
                      <span
                        className={`${getCategoryColor(
                          defect.category
                        )} px-3 py-1 rounded-full text-xs font-semibold border`}
                      >
                        {categoryLabels[defect.category]}
                      </span>
                    </div>

                    {/* Number Badge */}
                    <div className="flex-shrink-0 w-8 h-8 bg-[#FA8604] text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {defect.number}
                    </div>

                    {/* Description */}
                    <div className="flex-1">
                      <p className="text-[#222] leading-relaxed whitespace-pre-wrap">
                        {defect.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FA8604]/0 to-[#FA8604]/0 group-hover:from-[#FA8604]/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainTemplate>
  );
}
