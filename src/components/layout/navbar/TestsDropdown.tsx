'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_URL } from '@/utils/consts';

interface TestsDropdownProps {
  onClose?: () => void;
  linkBase: string;
}

export default function TestsDropdown({
  onClose,
  linkBase,
}: TestsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ========== DESKTOP: Hover functionality ==========
  const handleDesktopMouseEnter = () => {
    if (isMobile) return;

    // Clear any pending close timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleDesktopMouseLeave = () => {
    if (isMobile) return;

    // Add delay before closing
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      timeoutRef.current = null;
    }, 150);
  };

  // Desktop: Click outside handler
  useEffect(() => {
    if (isMobile || !isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        buttonRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isMobile]);

  // ========== MOBILE: Click toggle functionality ==========
  const handleMobileToggle = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isMobile) return;

    e.preventDefault();
    e.stopPropagation();

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Toggle state
    setIsOpen((prev) => !prev);
  };

  // Mobile: Click outside handler with delay
  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Don't close if clicking on button
      if (buttonRef.current?.contains(target)) {
        return;
      }

      // Don't close if clicking on dropdown
      if (dropdownRef.current?.contains(target)) {
        return;
      }

      // Close if clicking outside
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsOpen(false);
    };

    // Wait before adding listener to prevent immediate closing
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside, true);
      document.addEventListener('touchstart', handleClickOutside, true);
    }, 300);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [isOpen, isMobile]);

  // ========== COMMON: Link click handler ==========
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsOpen(false);

    // Close mobile menu if needed
    if (isMobile && onClose) {
      setTimeout(() => {
        onClose();
      }, 100);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const isTestsActive =
    pathname === SITE_URL.TESTS ||
    pathname === SITE_URL.PSYCHOLOGICAL_TESTS ||
    pathname.startsWith(SITE_URL.TESTS + '/') ||
    pathname.startsWith(SITE_URL.PSYCHOLOGICAL_TESTS + '/');

  const isTestsPageActive = pathname === SITE_URL.TESTS || pathname.startsWith(SITE_URL.TESTS + '/');
  const isPsychologicalTestsPageActive = pathname === SITE_URL.PSYCHOLOGICAL_TESTS || pathname.startsWith(SITE_URL.PSYCHOLOGICAL_TESTS + '/');

  return (
    <li
      className="mr-4 max-md:mb-2 max-md:mr-0 last:mr-0 max-md:w-full relative"
      onMouseEnter={handleDesktopMouseEnter}
      onMouseLeave={handleDesktopMouseLeave}
      ref={dropdownRef}
    >
      <div className="relative">
        {/* Desktop Button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={handleMobileToggle}
          onMouseEnter={handleDesktopMouseEnter}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className={`${linkBase} ${
            isTestsActive ? 'text-[#FA8604]' : ''
          } text-base max-md:hidden flex items-center gap-1 transition-colors hover:text-[#FA8604]`}
        >
          Թեստեր
          <i
            className={`fas fa-chevron-down text-xs transition-all duration-300 ml-2 ease-in-out ${
              isOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
            }`}
            aria-hidden="true"
          ></i>
        </button>

        {/* Mobile Button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={handleMobileToggle}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className={`
            hidden max-md:flex items-center gap-4 px-6 py-4 rounded-2xl
            text-lg font-semibold transition-all duration-300 w-full
            ${
              isTestsActive
                ? 'bg-gradient-to-r from-[#FA8604] to-[#FF9A2E] text-white shadow-lg shadow-[#FA8604]/30'
                : 'text-[#1A2229] bg-white/80 hover:bg-[#FA8604]/10 hover:text-[#FA8604] hover:shadow-md'
            }
          `}
        >
          <i
            className={`fa-solid fa-clipboard-question text-xl ${
              isTestsActive ? 'text-white' : 'text-[#FA8604]'
            }`}
          ></i>
          <span className="flex-1 text-left">Թեստեր</span>
          <i
            className={`fas fa-chevron-down text-sm transition-all duration-300 ease-in-out ${
              isOpen ? 'rotate-180' : 'rotate-0'
            } ${isTestsActive ? 'text-white' : 'text-[#FA8604]'}`}
            aria-hidden="true"
          ></i>
        </button>

        {/* Desktop: Invisible bridge */}
        {isOpen && !isMobile && (
          <div
            className="absolute top-full left-0 w-full h-1 z-40"
            onMouseEnter={handleDesktopMouseEnter}
            onMouseLeave={handleDesktopMouseLeave}
            aria-hidden="true"
          />
        )}

        {/* Desktop Dropdown Menu */}
        <div
          className={`absolute top-full left-0 mt-1 bg-white rounded-[10px] shadow-lg min-w-[300px] z-50 overflow-hidden max-md:hidden transition-all duration-300 ease-out ${
            isOpen
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
          }`}
          onMouseEnter={handleDesktopMouseEnter}
          onMouseLeave={handleDesktopMouseLeave}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            <Link
              href={SITE_URL.TESTS}
              onClick={handleLinkClick}
              role="menuitem"
              className={`block px-4 py-2.5 hover:bg-[#FA8604]/10 transition-all duration-200 rounded-t-[10px] transform hover:translate-x-1 hover:scale-[1.02] ${
                isTestsPageActive
                  ? 'text-[#FA8604] font-medium bg-[#FA8604]/5'
                  : linkBase
              }`}
            >
              <span className="flex items-center gap-2">
                <i className="fas fa-graduation-cap text-sm"></i>
                <span>Քննական թեստեր</span>
              </span>
            </Link>
            <Link
              href={SITE_URL.PSYCHOLOGICAL_TESTS}
              onClick={handleLinkClick}
              role="menuitem"
              className={`block px-4 py-2.5 hover:bg-[#FA8604]/10 transition-all duration-200 rounded-b-[10px] transform hover:translate-x-1 hover:scale-[1.02] ${
                isPsychologicalTestsPageActive
                  ? 'text-[#FA8604] font-medium bg-[#FA8604]/5'
                  : linkBase
              }`}
            >
              <span className="flex items-center gap-2">
                <i className="fas fa-brain text-sm"></i>
                <span>Հոգեբանական Թեստեր</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isOpen && isMobile && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="hidden max-md:block overflow-hidden"
            >
              <div className="mt-2 space-y-2 pl-4">
                <Link
                  href={SITE_URL.TESTS}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center gap-4 px-6 py-4 rounded-2xl
                    text-lg font-semibold transition-all duration-300
                    ${
                      isTestsPageActive
                        ? 'bg-gradient-to-r from-[#FA8604] to-[#FF9A2E] text-white shadow-lg shadow-[#FA8604]/30'
                        : 'text-[#1A2229] bg-white/80 hover:bg-[#FA8604]/10 hover:text-[#FA8604] hover:shadow-md'
                    }
                  `}
                >
                  <i
                    className={`fa-solid fa-graduation-cap text-xl ${
                      isTestsPageActive ? 'text-white' : 'text-[#FA8604]'
                    }`}
                  ></i>
                  <span>Քննական թեստեր</span>
                  {isTestsPageActive && (
                    <motion.div
                      className="ml-auto w-2 h-2 rounded-full bg-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    />
                  )}
                </Link>
                <Link
                  href={SITE_URL.PSYCHOLOGICAL_TESTS}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center gap-4 px-6 py-4 rounded-2xl
                    text-lg font-semibold transition-all duration-300
                    ${
                      isPsychologicalTestsPageActive
                        ? 'bg-gradient-to-r from-[#FA8604] to-[#FF9A2E] text-white shadow-lg shadow-[#FA8604]/30'
                        : 'text-[#1A2229] bg-white/80 hover:bg-[#FA8604]/10 hover:text-[#FA8604] hover:shadow-md'
                    }
                  `}
                >
                  <i
                    className={`fa-solid fa-brain text-xl ${
                      isPsychologicalTestsPageActive ? 'text-white' : 'text-[#FA8604]'
                    }`}
                  ></i>
                  <span>Հոգեբանական Թեստեր</span>
                  {isPsychologicalTestsPageActive && (
                    <motion.div
                      className="ml-auto w-2 h-2 rounded-full bg-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    />
                  )}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </li>
  );
}
