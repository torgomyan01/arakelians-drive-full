'use client';

import { motion } from 'framer-motion';

function CallButton() {
  const phoneNumber = '093-77-31-41';

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <motion.button
      onClick={handleCall}
      className="fixed bottom-6 right-6 z-50 bg-[#08993f] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center group w-14 h-14 sm:w-16 sm:h-16 max-[640px]:w-12 max-[640px]:h-12 max-[640px]:bottom-4 max-[640px]:right-4 cursor-pointer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
        delay: 0.5,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Զանգահարել ${phoneNumber}`}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:rotate-12 transition-transform max-[640px]:w-6 max-[640px]:h-6"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </motion.svg>

      {/* Pulse animation ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[#1E4A2F]"
        animate={{
          scale: [1, 1.5, 1.5],
          opacity: [0.5, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
    </motion.button>
  );
}

export default CallButton;
