'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Swiper from 'swiper';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const reviews = Array.from({ length: 7 });

function Reviews() {
  const swiperRef = useRef<Swiper | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    const swiper = new Swiper('.mySwiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      speed: 800,
      loop: true,
      centerInsufficientSlides: true,

      breakpoints: {
        575: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      },
    });

    swiperRef.current = swiper;

    // Custom arrow navigation
    const prevBtn = document.querySelector('.swiper-button-prev-custom');
    const nextBtn = document.querySelector('.swiper-button-next-custom');

    const handlePrevClick = () => swiper.slidePrev();
    const handleNextClick = () => swiper.slideNext();

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', handlePrevClick);
      nextBtn.addEventListener('click', handleNextClick);
    }

    // Correct pagination update
    function updatePagination() {
      const loopedSlides = swiper.loopedSlides || 0;
      const realSlides = swiper.slides.length - loopedSlides * 2;
      const current = (swiper.realIndex % realSlides) + 1;

      const paginationEl = document.getElementById('paginationText');
      if (paginationEl) {
        paginationEl.textContent = `${current}/${realSlides}`;
      }
    }

    swiper.on('slideChange', updatePagination);
    updatePagination();

    // Cleanup
    return () => {
      if (prevBtn && nextBtn) {
        prevBtn.removeEventListener('click', handlePrevClick);
        nextBtn.removeEventListener('click', handleNextClick);
      }
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
      }
    };
  }, []);

  const handlePrevImage = useCallback(() => {
    if (selectedImage === null) return;
    const prevIndex = selectedImage === 1 ? reviews.length : selectedImage - 1;
    setSelectedImage(prevIndex);
  }, [selectedImage]);

  const handleNextImage = useCallback(() => {
    if (selectedImage === null) return;
    const nextIndex = selectedImage === reviews.length ? 1 : selectedImage + 1;
    setSelectedImage(nextIndex);
  }, [selectedImage]);

  // Handle keyboard navigation and ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;

      if (e.key === 'Escape') {
        setSelectedImage(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    if (selectedImage !== null) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, handlePrevImage, handleNextImage]);

  return (
    <div className="my-[80px] text-center max-md:my-[40px]">
      <h2 className="global-title">Ավարտված ուսանողական պատմություններ</h2>

      <div className="swiper mySwiper ">
        <div className="swiper-wrapper py-2">
          {reviews.map((review, index) => (
            <div className="swiper-slide" key={`review-${index}`}>
              <div className="bg-white rounded-[50px] overflow-hidden border border-[#FA8604] cursor-pointer transition-all duration-100 hover:scale-[1.01]">
                <Image
                  src={`/images/reviews/review-${index + 1}.png`}
                  alt={`Review ${index + 1}`}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full max-h-[300px]"
                  onClick={() => setSelectedImage(index + 1)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="inline-flex w-[200px] mt-[30px] flex-jsb-c bg-[#FA8604] rounded-[50px] p-[10px]">
        <button className="swiper-button-prev-custom w-10 h-10 flex items-center justify-center rounded-full text-white text-xl cursor-pointer">
          <img
            src="/images/slider-arrow.svg"
            alt=""
            className="rotate-180 w-[15px]"
          />
        </button>

        <div id="paginationText" className="text-white font-bold text-[26px]">
          1/3
        </div>

        <button className="swiper-button-next-custom w-10 h-10 flex items-center justify-center rounded-full text-white text-xl cursor-pointer">
          <img src="/images/slider-arrow.svg" alt="" className="w-[15px]" />
        </button>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center bg-white/80 rounded-[20px] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 md:top-4 md:right-4 z-10 w-10 h-10 md:w-12 md:h-12 bg-[#FA8604] hover:bg-[#e67503] rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer"
                aria-label="Close modal"
              >
                <i className="fa-solid fa-xmark text-white text-[15px] md:text-[17px]"></i>
              </button>

              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-2 md:left-4 z-10 w-10 h-10 md:w-14 md:h-14 bg-[#FA8604] hover:bg-[#e67503] rounded-full flex items-center justify-center transition-all shadow-lg group cursor-pointer"
                aria-label="Previous image"
              >
                <img
                  src="/images/slider-arrow.svg"
                  alt=""
                  className="rotate-180 w-[12px] md:w-[14px] group-hover:scale-110 transition-all duration-100 mr-1"
                />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-2 md:right-4 z-10 w-10 h-10 md:w-14 md:h-14 bg-[#FA8604] hover:bg-[#e67503] rounded-full flex items-center justify-center transition-all shadow-lg group cursor-pointer"
                aria-label="Next image"
              >
                <img
                  src="/images/slider-arrow.svg"
                  alt=""
                  className="w-[12px] md:w-[14px] group-hover:scale-110 transition-all duration-100"
                />
              </button>

              {/* Image Container */}
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <img
                    src={`/images/reviews/review-${selectedImage}.png`}
                    alt={`Review ${selectedImage}`}
                    className="object-contain max-w-full max-h-[85vh] rounded-[20px] shadow-2xl"
                  />
                </motion.div>

                {/* Pagination */}
                <div className="absolute bottom-4 md:bottom-6 inline-flex w-[180px] md:w-[200px] flex-jsb-c bg-[#FA8604] rounded-[50px] p-[8px] md:p-[10px] shadow-lg">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-white text-xl cursor-pointer hover:bg-opacity-20 transition-all"
                    aria-label="Previous"
                  >
                    <img
                      src="/images/slider-arrow.svg"
                      alt=""
                      className="rotate-180 w-[12px] md:w-[15px]"
                    />
                  </button>

                  <div className="text-white font-bold text-[22px] md:text-[26px]">
                    {selectedImage}/{reviews.length}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-white text-xl cursor-pointer  hover:bg-opacity-20 transition-all"
                    aria-label="Next"
                  >
                    <img
                      src="/images/slider-arrow.svg"
                      alt=""
                      className="w-[12px] md:w-[15px]"
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Reviews;
