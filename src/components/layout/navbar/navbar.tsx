'use client';

import { SITE_URL } from '@/utils/consts';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const navItems = [
  {
    label: 'Ուսուցում',
    href: SITE_URL.TRAINING,
  },
  {
    label: 'ՃԵԿ',
    href: SITE_URL.RULES,
  },
  {
    label: 'Թեստեր',
    href: SITE_URL.TESTS,
  },
  {
    label: 'Կոնտակտ',
    href: SITE_URL.CONTACT,
  },
  {
    label: 'Մեր մասին',
    href: SITE_URL.ABOUT,
  },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const glassEffect = 'rounded-[50px] bg-black/8 backdrop-blur-xs';
  const linkBase =
    'text-[#1A2229] transition-colors duration-300 hover:text-[#FA8604]';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow');
    } else {
      document.body.classList.remove('overflow');
    }
    return () => {
      document.body.classList.remove('overflow');
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav
        id="header"
        className={`top-0 w-full fixed ${isScrolled ? 'shadow' : ''} z-10 py-5 max-md:py-2.5 bg-white`}
      >
        <div className="container">
          <div className="flex items-center justify-between">
            <Link
              href={SITE_URL.HOME}
              className={`flex items-center ${glassEffect} px-2.5 py-2`}
            >
              <Image src="/images/logo.svg" alt="logo" width={39} height={39} />
              <span className={`${linkBase} logo-text ml-4 mr-2.5`}>
                Գլխավոր
              </span>
            </Link>

            <ul
              className={`header-menu flex items-center ${glassEffect} px-8 py-4 max-md:fixed max-md:top-[68px] max-md:left-0 max-md:flex-col max-md:w-full max-md:h-[calc(100dvh-68px)] max-md:rounded-none max-md:bg-gradient-to-b max-md:from-white max-md:via-white max-md:to-gray-50 max-md:shadow-2xl max-md:transition-all max-md:duration-300 max-md:ease-in-out max-md:z-20 max-md:overflow-y-auto max-md:py-8 max-md:backdrop-blur-none max-md:bg-black/0 ${
                isMenuOpen
                  ? 'open max-md:opacity-100 max-md:scale-100 max-md:translate-x-0'
                  : 'max-md:opacity-0 max-md:scale-95 max-md:-translate-x-full'
              }`}
            >
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + '/');
                return (
                  <li
                    key={item.href}
                    className="mr-4 max-md:mb-4 max-md:mr-0 last:mr-0 max-md:w-full max-md:text-center"
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        // Only close menu on mobile
                        if (window.innerWidth < 768) {
                          closeMenu();
                        }
                      }}
                      className={`${linkBase} ${
                        isActive ? 'text-[#FA8604]' : ''
                      } text-base max-md:text-xl max-md:text-[#1A2229] max-md:font-semibold max-md:py-3 max-md:block max-md:hover:bg-[#FA8604]/10 max-md:rounded-xl max-md:px-6 max-md:transition-all max-md:duration-200 max-md:border-l-4 max-md:border-transparent max-md:hover:text-[#FA8604] ${
                        isActive
                          ? 'max-md:border-[#FA8604] max-md:bg-[#FA8604]/5'
                          : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div
              className={`drop-menu hidden max-md:flex z-30 ${isMenuOpen ? 'is-active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className="line"></span>
              <span className="line"></span>
              <span className="line"></span>
            </div>
          </div>
        </div>
      </nav>
      <div className="w-full h-[70px] sm:h-[94px]"></div>
    </>
  );
}

export default Navbar;
