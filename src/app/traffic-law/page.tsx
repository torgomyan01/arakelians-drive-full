'use client';

import { useState, useMemo } from 'react';
import MainTemplate from '@/components/layout/main-template/main-template';
import {
  getAllTrafficLawItems,
  getTrafficLawItemsByCategory,
  categoryLabels,
  TrafficLawItem,
} from '@/utils/trafficLaw';
import { SITE_URL } from '@/utils/consts';

export default function TrafficLawPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>(
    'all'
  );
  const [searchTerm, setSearchTerm] = useState('');

  const allItems = getAllTrafficLawItems();

  // Get unique categories
  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    allItems.forEach((item) => {
      cats.add(item.category);
    });
    return Array.from(cats).sort();
  }, [allItems]);

  const categories: (string | 'all')[] = ['all', ...uniqueCategories];

  const filteredItems = useMemo(() => {
    // Start with a fresh copy of all items
    let items: TrafficLawItem[] = [...allItems];

    // Filter by category first
    if (selectedCategory !== 'all') {
      items = items.filter((item) => item.category === selectedCategory);
    }

    // Then apply search filter if search term exists
    const trimmedSearch = searchTerm.trim();
    if (trimmedSearch) {
      const term = trimmedSearch.toLowerCase();
      items = items.filter((item) => {
        const description = item.description?.toLowerCase() || '';
        const name = item.name?.toLowerCase() || '';

        return description.includes(term) || name.includes(term);
      });
    }

    // Return a new array reference to ensure React detects the change
    return [...items];
  }, [selectedCategory, searchTerm, allItems]);

  const getCategoryColor = (category: string) => {
    if (category === 'concepts') {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
    if (category.startsWith('article-')) {
      return 'bg-green-100 text-green-800 border-green-300';
    }
    return 'bg-gray-100 text-gray-800 border-gray-300';
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
              <span className="text-[#8D8D8D] text-base ml-1">
                / Օրենք Ճանապարհային Երթևեկության Անվտանգության Ապահովման Մասին
              </span>
            </li>
          </ul>

          <h1 className="global-title mb-[60px] max-[1024px]:mb-8">
            Օրենք Ճանապարհային Երթևեկության Անվտանգության Ապահովման Մասին
          </h1>

          <div className="mb-8">
            <p className="text-[#222] text-lg leading-relaxed max-w-4xl">
              Հայաստանի Հանրապետության Օրենքը Ճանապարհային Երթևեկության
              Անվտանգության Ապահովման Մասին: Այստեղ կարող եք գտնել օրենքում
              կիրառվող հասկացությունները և հոդվածները:
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Որոնել հասկացություններում և հոդվածներում..."
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
                    : categoryLabels[category] || category}
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
                  {filteredItems.length}
                </span>{' '}
                հոդված
                {selectedCategory !== 'all' && (
                  <span className="ml-2">
                    ({categoryLabels[selectedCategory] || selectedCategory})
                  </span>
                )}
              </>
            ) : (
              <>
                Ընդամենը{' '}
                <span className="font-semibold text-[#222]">
                  {allItems.length}
                </span>{' '}
                հոդված
              </>
            )}
          </div>

          {/* Items List */}
          {filteredItems.length === 0 ? (
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
                Հոդվածներ չգտնվեցին
              </h3>
              <p className="text-[#8D8D8D] mb-6">
                {searchTerm.trim()
                  ? 'Փորձեք փոխել որոնման տերմինը կամ ֆիլտրը'
                  : 'Ընտրված կատեգորիայում հոդվածներ չկան'}
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
              key={`items-list-${selectedCategory}-${searchTerm}`}
              className="space-y-4 mb-[100px] max-[767px]:mb-8"
            >
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#FA8604] p-6"
                >
                  <div className="flex items-start gap-4 flex-col md:flex-row">
                    {/* Category Badge */}
                    <div className="flex-shrink-0">
                      <span
                        className={`${getCategoryColor(
                          item.category
                        )} px-3 py-1 rounded-full text-xs font-semibold border`}
                      >
                        {categoryLabels[item.category] || item.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#222] mb-2">
                        {item.name}
                      </h3>
                      <p className="text-[#222] leading-relaxed whitespace-pre-wrap">
                        {item.description}
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
