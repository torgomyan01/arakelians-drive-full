'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Swiper from 'swiper';
import { motion, AnimatePresence } from 'framer-motion';
import { StudentWithStats } from '@/app/actions/admin-students';
import { getImageUrl } from '@/utils/image-utils';

interface ReviewsProps {
  students: StudentWithStats[];
}

function Reviews({ students }: ReviewsProps) {
  const swiperRef = useRef<Swiper | null>(null);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentWithStats | null>(null);

  useEffect(() => {
    if (students.length === 0) return;

    const swiper = new Swiper('.mySwiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      speed: 800,
      loop: students.length > 3,
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
  }, [students.length]);

  const handlePrevStudent = useCallback(() => {
    if (!selectedStudent) return;
    const currentIndex = students.findIndex((s) => s.id === selectedStudent.id);
    const prevIndex =
      currentIndex === 0 ? students.length - 1 : currentIndex - 1;
    setSelectedStudent(students[prevIndex]);
  }, [selectedStudent, students]);

  const handleNextStudent = useCallback(() => {
    if (!selectedStudent) return;
    const currentIndex = students.findIndex((s) => s.id === selectedStudent.id);
    const nextIndex =
      currentIndex === students.length - 1 ? 0 : currentIndex + 1;
    setSelectedStudent(students[nextIndex]);
  }, [selectedStudent, students]);

  // Handle keyboard navigation and ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedStudent) return;

      if (e.key === 'Escape') {
        setSelectedStudent(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrevStudent();
      } else if (e.key === 'ArrowRight') {
        handleNextStudent();
      }
    };

    if (selectedStudent) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedStudent, handlePrevStudent, handleNextStudent]);

  return (
    <div className="my-[80px] text-center max-md:my-[40px]">
      <h2 className="global-title">Ավարտված ուսանողական պատմություններ</h2>

      {students.length === 0 ? (
        <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-12 text-center">
          <p className="text-[#8D8D8D] text-lg">
            Դեռ կարծիքներ չկան: Շուտով կավելանան նոր կարծիքներ:
          </p>
        </div>
      ) : (
        <div className="swiper mySwiper ">
          <div className="swiper-wrapper py-2">
            {students.map((student) => (
              <div className="swiper-slide" key={`student-${student.id}`}>
                <div className="bg-white rounded-[50px] overflow-hidden border border-[#FA8604] cursor-pointer transition-all duration-100 hover:scale-[1.01] h-full flex flex-col">
                  {student.photo ? (
                    <div className="relative w-full h-[200px] overflow-hidden">
                      <img
                        src={getImageUrl(student.photo)}
                        alt={student.name || 'Student'}
                        className="object-cover w-full h-full"
                        onClick={() => setSelectedStudent(student)}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center">
                      <i className="fas fa-user text-gray-400 text-4xl"></i>
                    </div>
                  )}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-[#1A2229] text-lg mb-1">
                      {student.name || 'Անանուն'}
                    </h3>
                    {student.examResult && (
                      <p className="text-[#FA8604] text-sm mb-2">
                        Արդյունք: {student.examResult}
                      </p>
                    )}
                    {student.review && (
                      <p className="text-[#8D8D8D] text-sm line-clamp-3 flex-1">
                        {student.review}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {students.length > 0 && (
        <div className="inline-flex w-[200px] mt-[30px] flex-jsb-c bg-[#FA8604] rounded-[50px] p-[10px]">
          <button className="swiper-button-prev-custom w-10 h-10 flex items-center justify-center rounded-full text-white text-xl cursor-pointer">
            <img
              src="/images/slider-arrow.svg"
              alt=""
              className="rotate-180 w-[15px]"
            />
          </button>

          <div id="paginationText" className="text-white font-bold text-[26px]">
            1/{students.length}
          </div>

          <button className="swiper-button-next-custom w-10 h-10 flex items-center justify-center rounded-full text-white text-xl cursor-pointer">
            <img src="/images/slider-arrow.svg" alt="" className="w-[15px]" />
          </button>
        </div>
      )}

      {/* Student Review Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={() => setSelectedStudent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-4xl max-h-[90vh] w-full bg-white rounded-[20px] p-6 md:p-8 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-2 right-2 md:top-4 md:right-4 z-10 w-10 h-10 md:w-12 md:h-12 bg-[#FA8604] hover:bg-[#e67503] rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer"
                aria-label="Close modal"
              >
                <i className="fa-solid fa-xmark text-white text-[15px] md:text-[17px]"></i>
              </button>

              {/* Previous Button */}
              {students.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevStudent();
                  }}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-14 md:h-14 bg-[#FA8604] hover:bg-[#e67503] rounded-full flex items-center justify-center transition-all shadow-lg group cursor-pointer"
                  aria-label="Previous student"
                >
                  <img
                    src="/images/slider-arrow.svg"
                    alt=""
                    className="rotate-180 w-[12px] md:w-[14px] group-hover:scale-110 transition-all duration-100 mr-1"
                  />
                </button>
              )}

              {/* Next Button */}
              {students.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextStudent();
                  }}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-14 md:h-14 bg-[#FA8604] hover:bg-[#e67503] rounded-full flex items-center justify-center transition-all shadow-lg group cursor-pointer"
                  aria-label="Next student"
                >
                  <img
                    src="/images/slider-arrow.svg"
                    alt=""
                    className="w-[12px] md:w-[14px] group-hover:scale-110 transition-all duration-100"
                  />
                </button>
              )}

              {/* Student Info */}
              <motion.div
                key={selectedStudent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                  {selectedStudent.photo ? (
                    <img
                      src={getImageUrl(selectedStudent.photo)}
                      alt={selectedStudent.name || 'Student'}
                      className="w-32 h-32 object-cover rounded-full border-4 border-[#FA8604]"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-[#FA8604]">
                      <i className="fas fa-user text-gray-400 text-4xl"></i>
                    </div>
                  )}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#1A2229] mb-2">
                      {selectedStudent.name || 'Անանուն'}
                    </h3>
                    {selectedStudent.examResult && (
                      <p className="text-[#FA8604] text-lg font-semibold">
                        Քննական արդյունք: {selectedStudent.examResult}
                      </p>
                    )}
                  </div>
                </div>

                {selectedStudent.review && (
                  <div className="bg-gray-50 rounded-[20px] p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-[#1A2229] mb-4">
                      Կարծիք
                    </h4>
                    <p className="text-[#1A2229] whitespace-pre-wrap leading-relaxed">
                      {selectedStudent.review}
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {students.length > 1 && (
                  <div className="mt-6 flex justify-center">
                    <div className="inline-flex w-[180px] md:w-[200px] flex-jsb-c bg-[#FA8604] rounded-[50px] p-[8px] md:p-[10px] shadow-lg">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevStudent();
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
                        {students.findIndex(
                          (s) => s.id === selectedStudent.id
                        ) + 1}
                        /{students.length}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextStudent();
                        }}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-white text-xl cursor-pointer hover:bg-opacity-20 transition-all"
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
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Reviews;
