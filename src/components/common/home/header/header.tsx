'use client';

import { motion, Variants } from 'framer-motion';

function Header() {
  const textColorDark = 'text-[#222]';
  const title = 'ARAKELIANS DRIVE';
  const letters = title.split('');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.8,
      },
    },
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <div className="bg-white shadow-[0_4px_164px_0_rgba(0,0,0,0.25)] h-[400px] sm:h-[570px] mb-[60px] max-[1300px]:mb-0">
      <motion.img
        src="/images/circle.svg"
        alt=""
        className="circle-img"
        initial={{ scale: 0, x: '-50%' }}
        animate={{ scale: 1, x: '-50%' }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
      />

      <div className="container relative h-[400px] sm:h-[560px] pt-[100px] max-[1100px]:pt-[120px]">
        <img
          src="/images/car-style.svg"
          alt=""
          className="style-img max-[767px]:top-20"
        />
        <motion.img
          src="/images/car-img.png"
          alt=""
          className="car-img"
          initial={{ x: '-80vw', opacity: 0 }}
          animate={{ x: '-100px', opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 50,
            damping: 15,
            mass: 1.5,
            delay: 0.2,
          }}
        />

        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-[#1A2229] relative z-1 pt-5 sm:pt-0 w-full max-w-[610px] ml-[140px] text-[90px] font-extrabold leading-[100%]! max-[1100px]:ml-[60px] max-[1100px]:text-[64px] max-[767px]:ml-5 max-[767px]:max-w-[280px] max-[767px]:text-[42px]"
        >
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              style={{ display: 'inline-block' }}
              className="leading-[100%]!"
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </motion.h1>

        <div className="absolute bottom-10 right-10 flex flex-col items-end">
          <img src="/images/right-arrow.svg" alt="" />
          <motion.b
            className={`${textColorDark} text-[34px] font-bold max-[767px]:text-2xl cursor-pointer z-10`}
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -5, 5, -5, 5, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.15 }}
          >
            093-77-31-41
          </motion.b>
          <span className={`${textColorDark} text-base`}>
            Ք․ Սիսյան Գնունի Փ․ 34 տ․
          </span>
        </div>
      </div>
    </div>
  );
}

export default Header;
