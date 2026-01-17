'use client';

import { motion } from 'framer-motion';

const socialLinks = [
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@autodrive47?_r=1&_t=ZS-92sG2BOk7Fa',
    icon: 'fa-tiktok',
    color: 'hover:text-[#000000]',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/arsen.arakelian23?igsh=MXhlNzVzY3l2aGo4cg%3D%3D&utm_source=qr',
    icon: 'fa-instagram',
    color: 'hover:text-[#E4405F]',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/share/1BPhfou8Fg/?mibextid=wwXIfr',
    icon: 'fa-facebook',
    color: 'hover:text-[#1877F2]',
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@arakeliansdrive?si=Mul_5jM_xOnj_3qR',
    icon: 'fa-youtube',
    color: 'hover:text-[#FF0000]',
  },
];

function SocialMediaIcons() {
  return (
    <motion.div
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 max-md:hidden"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
        delay: 0.3,
      }}
    >
      {socialLinks.map((social, index) => (
        <motion.a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            w-12 h-12 rounded-full bg-white shadow-lg
            flex items-center justify-center
            text-[#1A2229] transition-all duration-300
            ${social.color}
            hover:scale-110 hover:shadow-xl
            border border-gray-100
          `}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.4 + index * 0.1,
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`${social.name} հղում`}
        >
          <i className={`fa-brands ${social.icon} text-xl`}></i>
        </motion.a>
      ))}
    </motion.div>
  );
}

export default SocialMediaIcons;
