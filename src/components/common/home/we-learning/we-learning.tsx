'use client';

import { motion, Variants } from 'framer-motion';

function WeLearning() {
  const textColorPrimary = 'text-[#1A2229]';
  const textColorDark = 'text-[#222]';
  const borderDivider =
    'max-md:border-b max-md:border-[#ECECEC] max-md:border-b-[1px]';
  const statText = `${textColorDark} text-[70px] font-bold leading-[100%]`;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="my-[100px] max-[1024px]:my-[60px] max-[767px]:my-5">
      <h2 className="global-title none relative inline-flex max-[1024px]:max-w-[230px] max-[1024px]:text-2xl max-md:max-w-full max-md:text-[30px] max-md:mb-0">
        Սովորեցնում ենք
        <img
          src="images/title-style.svg"
          alt=""
          className="absolute top-0 -right-[70px] max-[1024px]:-right-5 max-md:hidden"
        />
      </h2>

      <motion.div
        className="mt-5 flex justify-around max-md:flex-col"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div
          className={`${borderDivider} py-10`}
          variants={itemVariants}
        >
          <p className="flex flex-wrap items-end max-w-[140px] max-md:mx-auto">
            <span className={`${textColorPrimary} text-[17px]`}>Սկսած</span>{' '}
            <b className={`${statText} ml-1 mb-[-15px]`}>25</b>
            <br />{' '}
            <span className={`${textColorPrimary} text-[17px]`}>
              Հազար դրամից
            </span>
          </p>
        </motion.div>

        <motion.div
          className={`flex flex-col items-center ${borderDivider} py-10`}
          variants={itemVariants}
        >
          <b className={statText}>10 - 20</b>
          <span>Օրում</span>
        </motion.div>

        <motion.div
          className={`flex flex-col items-center ${borderDivider} py-10`}
          variants={itemVariants}
        >
          <b className={statText}>99.9%</b>
          <span>Հանձնելու ես</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default WeLearning;
