'use client';

import { useState, useMemo } from 'react';

interface RuleItem {
  number: string;
  content: string;
  type?: 'rule' | 'prohibition' | 'requirement' | 'definition' | 'note';
  important?: boolean;
}

interface RuleSearchProps {
  content: string;
  onHighlight?: (searchTerm: string) => void;
}

export default function RuleSearch({ content, onHighlight }: RuleSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const highlightText = (text: string, term: string) => {
    if (!term) return text;

    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={index} className="bg-yellow-300 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const filteredContent = useMemo(() => {
    if (!searchTerm) return content;

    const lines = content.split('\n');
    const filtered: string[] = [];
    let currentRule = '';

    lines.forEach((line) => {
      const trimmed = line.trim();

      // Check if it's a new rule
      if (/^\d+\.\s+/.test(trimmed)) {
        if (
          currentRule &&
          currentRule.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          filtered.push(currentRule);
        }
        currentRule = line;
      } else if (currentRule) {
        currentRule += '\n' + line;
      } else if (trimmed.toLowerCase().includes(searchTerm.toLowerCase())) {
        filtered.push(line);
      }
    });

    if (
      currentRule &&
      currentRule.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      filtered.push(currentRule);
    }

    return filtered.join('\n');
  }, [content, searchTerm]);

  return (
    <div className="mb-6">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onHighlight?.(e.target.value);
          }}
          placeholder="Որոնել կանոններում..."
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
            onClick={() => {
              setSearchTerm('');
              onHighlight?.('');
            }}
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
      {searchTerm && (
        <div className="mt-2 text-sm text-gray-600">
          Գտնվել է {filteredContent.split('\n').filter((l) => l.trim()).length}{' '}
          արդյունք
        </div>
      )}
    </div>
  );
}
