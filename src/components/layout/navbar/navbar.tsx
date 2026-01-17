'use client';

import { SITE_URL } from '@/utils/consts';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import TestsDropdown from './TestsDropdown';

const navItems = [
  {
    label: 'Ուսուցում',
    href: SITE_URL.TRAINING,
    icon: 'fa-graduation-cap',
  },
  {
    label: 'ՃԵԿ',
    href: SITE_URL.RULES,
    icon: 'fa-book',
  },
  {
    label: 'Թեստեր',
    href: SITE_URL.TESTS,
    icon: 'fa-clipboard-question',
  },
  {
    label: 'Բլոգ',
    href: SITE_URL.BLOG,
    icon: 'fa-blog',
  },
  {
    label: 'Կոնտակտ',
    href: SITE_URL.CONTACT,
    icon: 'fa-envelope',
  },
  {
    label: 'Մեր մասին',
    href: SITE_URL.ABOUT,
    icon: 'fa-user',
  },
];

const socialLinks = [
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@autodrive47?_r=1&_t=ZS-92sG2BOk7Fa',
    icon: 'fa-tiktok',
    color: 'hover:text-[#000000] hover:bg-[#000000]/10',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/arsen.arakelian23?igsh=MXhlNzVzY3l2aGo4cg%3D%3D&utm_source=qr',
    icon: 'fa-instagram',
    color: 'hover:text-[#E4405F] hover:bg-[#E4405F]/10',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/share/1BPhfou8Fg/?mibextid=wwXIfr',
    icon: 'fa-facebook',
    color: 'hover:text-[#1877F2] hover:bg-[#1877F2]/10',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@arakeliansdrive?si=Mul_5jM_xOnj_3qR',
    icon: 'fa-youtube',
    color: 'hover:text-[#FF0000] hover:bg-[#FF0000]/10',
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuVariants: Variants = {
    closed: {
      x: '-100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    closed: {
      x: -20,
      opacity: 0,
    },
    open: {
      x: 0,
      opacity: 1,
    },
  };

  const overlayVariants: Variants = {
    closed: {
      opacity: 0,
      pointerEvents: 'none' as const,
    },
    open: {
      opacity: 1,
      pointerEvents: 'auto' as const,
    },
  };

  return (
    <>
      <nav
        id="header"
        className={`top-0 w-full fixed ${isScrolled ? 'shadow-md' : ''} z-100 py-5 max-md:py-2.5 bg-white transition-shadow duration-300`}
      >
        <div className="container md:px-0!">
          <div className="flex items-center justify-between">
            <Link
              href={SITE_URL.HOME}
              className={`flex items-center ${glassEffect} px-2.5 py-2 transition-transform duration-200 hover:scale-105`}
            >
              <Image src="/images/logo.svg" alt="logo" width={39} height={39} />
              <span className={`${linkBase} logo-text ml-4 mr-2.5`}>
                Գլխավոր
              </span>
            </Link>

            {/* Desktop Menu */}
            <ul
              className={`header-menu flex items-center ${glassEffect} px-8 py-4 max-md:hidden`}
            >
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + '/');

                if (item.label === 'Թեստեր') {
                  return (
                    <TestsDropdown
                      key={item.href}
                      onClose={closeMenu}
                      linkBase={linkBase}
                    />
                  );
                }

                return (
                  <li key={item.href} className="mr-4 last:mr-0">
                    <Link
                      href={item.href}
                      className={`${linkBase} ${isActive ? 'text-[#FA8604]' : ''} text-base`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Menu Button */}
            <button
              className={`drop-menu hidden max-md:flex z-50 relative items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 ${
                isMenuOpen
                  ? 'bg-[#FA8604] shadow-lg'
                  : 'bg-transparent hover:bg-gray-100'
              }`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <motion.span
                className="line w-6 h-[2px] bg-[#1A2229] rounded-full origin-center absolute"
                animate={
                  isMenuOpen
                    ? { 
                        rotate: 45, 
                        y: 0,
                        backgroundColor: '#ffffff',
                        width: '24px'
                      }
                    : { 
                        rotate: 0, 
                        y: -8,
                        backgroundColor: '#1A2229',
                        width: '24px'
                      }
                }
                transition={{ 
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1]
                }}
              />
              <motion.span
                className="line w-6 h-[2px] bg-[#1A2229] rounded-full origin-center absolute"
                animate={
                  isMenuOpen
                    ? { 
                        opacity: 0, 
                        scale: 0,
                        backgroundColor: '#ffffff'
                      }
                    : { 
                        opacity: 1, 
                        scale: 1,
                        backgroundColor: '#1A2229'
                      }
                }
                transition={{ 
                  duration: 0.2,
                  ease: 'easeInOut'
                }}
              />
              <motion.span
                className="line w-6 h-[2px] bg-[#1A2229] rounded-full origin-center absolute"
                animate={
                  isMenuOpen
                    ? { 
                        rotate: -45, 
                        y: 0,
                        backgroundColor: '#ffffff',
                        width: '24px'
                      }
                    : { 
                        rotate: 0, 
                        y: 8,
                        backgroundColor: '#1A2229',
                        width: '24px'
                      }
                }
                transition={{ 
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1]
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 max-md:block hidden"
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              onClick={closeMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              className="fixed top-[68px] left-0 w-full h-[calc(100dvh-68px)] bg-gradient-to-br from-white via-gray-50/50 to-white z-50 max-md:block hidden overflow-y-auto"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              <div className="flex flex-col h-full px-6 py-8">
                {/* Menu Items */}
                <motion.ul className="flex-1 space-y-2">
                  {navItems.map((item, index) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + '/');

                    if (item.label === 'Թեստեր') {
                      return (
                        <motion.li
                          key={item.href}
                          variants={itemVariants}
                          className="mb-2"
                        >
                          <TestsDropdown
                            onClose={closeMenu}
                            linkBase="text-[#1A2229] transition-colors duration-300 hover:text-[#FA8604]"
                          />
                        </motion.li>
                      );
                    }

                    return (
                      <motion.li
                        key={item.href}
                        variants={itemVariants}
                        className="mb-2"
                      >
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className={`
                            flex items-center gap-4 px-6 py-4 rounded-2xl
                            text-lg font-semibold transition-all duration-300
                            ${
                              isActive
                                ? 'bg-gradient-to-r from-[#FA8604] to-[#FF9A2E] text-white shadow-lg shadow-[#FA8604]/30'
                                : 'text-[#1A2229] bg-white/80 hover:bg-[#FA8604]/10 hover:text-[#FA8604] hover:shadow-md'
                            }
                          `}
                        >
                          <i
                            className={`fa-solid ${item.icon} text-xl ${
                              isActive ? 'text-white' : 'text-[#FA8604]'
                            }`}
                          ></i>
                          <span>{item.label}</span>
                          {isActive && (
                            <motion.div
                              className="ml-auto w-2 h-2 rounded-full bg-white"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2 }}
                            />
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>

                {/* Social Media Section */}
                <motion.div
                  variants={itemVariants}
                  className="mt-auto pt-8 border-t border-gray-200/50 mb-8"
                >
                  <p className="text-center text-sm font-medium text-gray-500 mb-4">
                    Հետևեք մեզ
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                          w-14 h-14 rounded-2xl bg-white shadow-md
                          flex items-center justify-center
                          text-[#1A2229] transition-all duration-300
                          ${social.color}
                          hover:scale-110 hover:shadow-lg
                          border border-gray-100
                        `}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: 0.4 + index * 0.1,
                          type: 'spring',
                          stiffness: 200,
                        }}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`${social.name} հղում`}
                      >
                        <i className={`fa-brands ${social.icon} text-xl`}></i>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="w-full h-[70px] sm:h-[94px]"></div>
    </>
  );
}

export default Navbar;
