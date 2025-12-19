'use client';

import { useRef, useEffect, useState } from 'react';
import { FaqItem as FaqItemType } from '@/data/faq-data';

interface FaqItemProps {
  item: FaqItemType;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FaqItem({ item, isOpen, onToggle }: FaqItemProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<string>('0px');

  // Update max-height when FAQ opens or window resizes
  useEffect(() => {
    const updateMaxHeight = () => {
      if (isOpen && contentRef.current) {
        setMaxHeight(`${contentRef.current.scrollHeight}px`);
      } else {
        setMaxHeight('0px');
      }
    };

    updateMaxHeight();

    const handleResize = () => {
      updateMaxHeight();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <li
      className={`relative border border-[#FA8604] rounded-[50px] mb-[15px] max-md:rounded-[24px] ${
        isOpen ? 'active' : ''
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-[25px] py-[20px] text-left max-md:py-[20px] max-md:p-[15px] cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="mr-[10px]">{item.question}</span>
          <svg
            className={`w-5 h-5 text-gray-500 min-w-[20px] transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </button>

      <div
        ref={contentRef}
        className="relative overflow-hidden transition-all duration-700 ease-in-out"
        style={{ maxHeight }}
      >
        <div
          className="py-[15px] px-[10px] border-t border-[#D1D1D1] w-[calc(100%-60px)] 
            ml-[30px] max-md:w-[calc(100%-30px)] max-md:ml-[15px]"
        >
          {item.answer}
        </div>
      </div>
    </li>
  );
}
