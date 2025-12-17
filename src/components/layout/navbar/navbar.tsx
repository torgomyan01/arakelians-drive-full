'use client';

import { SITE_URL } from '@/utils/consts';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const navItems = [
  {
    label: 'Ուսուցում',
    href: SITE_URL.TRAINING,
  },
  {
    label: 'ՃԵԿ',
    href: SITE_URL.QUIZ,
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
              <img src="images/logo.svg" alt="" className="w-[39px]" />
              <span className={`${linkBase} logo-text ml-4 mr-2.5`}>
                Գլխավոր
              </span>
            </Link>

            <ul
              className={`header-menu flex items-center ${glassEffect} px-8 py-4 max-md:fixed max-md:top-[72px] max-md:left-0 max-md:flex-col max-md:w-full max-md:h-[calc(100vh-87px)] max-md:rounded-none max-md:bg-white max-md:opacity-0 max-md:scale-0`}
            >
              {navItems.map((item) => (
                <li key={item.href} className="mr-4 max-md:mb-5 last:mr-0">
                  <Link
                    href={item.href}
                    className={`${linkBase} text-base max-md:text-2xl max-md:text-white`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="drop-menu hidden max-md:flex">
              <span className="line"></span>
              <span className="line"></span>
              <span className="line"></span>
            </div>
          </div>
        </div>
      </nav>
      <div className="w-full h-[94px]"></div>
    </>
  );
}

export default Navbar;
