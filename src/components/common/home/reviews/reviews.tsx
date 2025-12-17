'use client';

import { useEffect, useRef } from 'react';
import Swiper from 'swiper';

function Reviews() {
  const swiperRef = useRef<Swiper | null>(null);

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

  return (
    <div className="my-[80px] text-center max-md:my-[40px]">
      <h2 className="global-title">
        Իրավական Խորհրդեքներ և Հաճախորդյան Պատմություններ
      </h2>

      <div className="swiper mySwiper ">
        <div className="swiper-wrapper">
          <div className="swiper-slide">
            <div className="bg-white rounded-[50px] overflow-hidden border border-[#FA8604]">
              <img
                src="/images/history-img1.png"
                className="w-[100%] h-[100%] object-cover"
              />
            </div>
          </div>
          <div className="swiper-slide">
            <div className="bg-white rounded-[50px] overflow-hidden border border-[#FA8604]">
              <img
                src="/images/history-img2.png"
                className="w-[100%] h-[100%] object-cover"
              />
            </div>
          </div>
          <div className="swiper-slide">
            <div className="bg-white rounded-[50px] overflow-hidden border border-[#FA8604]">
              <img
                src="/images/history-img3.png"
                className="w-[100%] h-[100%] object-cover"
              />
            </div>
          </div>
          <div className="swiper-slide">
            <div className="bg-white rounded-[50px] overflow-hidden border border-[#FA8604]">
              <img
                src="/images/history-img1.png"
                className="w-[100%] h-[100%] object-cover"
              />
            </div>
          </div>
          <div className="swiper-slide">
            <div className="bg-white rounded-[50px] overflow-hidden border border-[#FA8604]">
              <img
                src="/images/history-img2.png"
                className="w-[100%] h-[100%] object-cover"
              />
            </div>
          </div>
          <div className="swiper-slide">
            <div className="bg-white rounded-[50px] overflow-hidden border border-[#FA8604]">
              <img
                src="/images/history-img3.png"
                className="w-[100%] h-[100%] object-cover"
              />
            </div>
          </div>
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
    </div>
  );
}

export default Reviews;
