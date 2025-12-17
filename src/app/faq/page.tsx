'use client';

import { useState, useRef, useEffect } from 'react';
import { allFaqItems } from '@/data/faq-data';
import Navbar from '@/components/layout/navbar/navbar';
import Footer from '@/components/layout/footer/footer';

function FaqPage() {
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleToggle = (id: string) => {
    setOpenFaqId((prevId) => (prevId === id ? null : id));
  };

  // Update max-height when FAQ opens or window resizes
  useEffect(() => {
    const updateMaxHeight = () => {
      if (openFaqId && contentRefs.current[openFaqId]) {
        const contentElement = contentRefs.current[openFaqId];
        if (contentElement) {
          contentElement.style.maxHeight = `${contentElement.scrollHeight}px`;
        }
      }
    };

    updateMaxHeight();

    const handleResize = () => {
      updateMaxHeight();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [openFaqId]);

  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        <div className="container mx-auto px-4 py-[60px] max-md:py-[40px]">
          <h1 className="global-title mb-[50px] max-md:mb-[30px] text-center">
            Հաճախ Տրվող Հարցեր (FAQ)
          </h1>
          <div className="max-w-[900px] mx-auto">
            <div id="faq-container">
              <ul>
                {allFaqItems.map((item) => {
                  const isOpen = openFaqId === item.id;
                  return (
                    <li
                      key={item.id}
                      className={`relative border border-[#FA8604] rounded-[50px] mb-[15px] max-md:rounded-[24px] ${
                        isOpen ? 'active' : ''
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggle(item.id)}
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
                        ref={(el) => {
                          contentRefs.current[item.id] = el;
                        }}
                        className="relative overflow-hidden transition-all duration-700 ease-in-out"
                        style={{
                          maxHeight: isOpen
                            ? `${contentRefs.current[item.id]?.scrollHeight || 0}px`
                            : '0px',
                        }}
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
                })}
              </ul>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}

export default FaqPage;
