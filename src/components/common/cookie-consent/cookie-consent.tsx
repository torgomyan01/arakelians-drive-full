'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a small delay for better UX
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] border-t border-gray-200 p-4 md:p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#1A2229] mb-2">
              Cookie-ների օգտագործում
            </h3>
            <p className="text-sm text-[#8D8D8D] leading-relaxed">
              Մենք օգտագործում ենք cookie-ներ և localStorage՝ կայքի
              գործունեությունը բարելավելու, օգտատիրոջ փորձը հարմարեցնելու և
              վիճակագրական տվյալներ հավաքելու համար: Շարունակելով օգտագործել
              կայքը, դուք համաձայնում եք cookie-ների օգտագործմանը:{' '}
              <Link
                href="/privacy-policy"
                className="text-[#FA8604] hover:underline font-semibold"
              >
                Գաղտնիության քաղաքականություն
              </Link>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 min-w-[200px] sm:min-w-[280px]">
            <button
              onClick={handleAccept}
              className="px-6 py-3 bg-gradient-to-r from-[#FA8604] to-[#FFA64D] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-sm whitespace-nowrap"
            >
              Համաձայն եմ
            </button>
            <button
              onClick={handleDecline}
              className="px-6 py-3 bg-gray-200 text-[#1A2229] rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold text-sm whitespace-nowrap"
            >
              Մերժել
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
