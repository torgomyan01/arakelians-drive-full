'use client';

import Link from 'next/link';
import { homeFaqItems } from '@/data/faq-data';
import { SITE_URL } from '@/utils/consts';
import FaqList from '@/components/common/faq/FaqList';

function Faq() {
  return (
    <div className="my-[40px]">
      <h2 className="global-title mb-[50px] max-md:mb-[30px]">
        Հաճախ Տրվող Հարցեր (FAQ)
      </h2>
      <div className="flex items-start max-md:flex-col justify-between">
        <div className="flex max-w-[430px] w-full mr-[50px] max-md:hidden">
          <img src="/images/faq-img.svg" alt="" className="w-full" />
        </div>
        <div className="max-w-[610px] w-full">
          <div id="faq-container">
            <FaqList items={homeFaqItems} />
            <div className="mt-[30px] text-center">
              <Link
                href={SITE_URL.FAQ}
                className="inline-block px-[40px] py-[15px] bg-[#FA8604] text-white rounded-[50px] 
                  hover:bg-[#e67503] transition-colors duration-300 font-medium text-lg
                  max-md:px-[30px] max-md:py-[12px] max-md:text-base"
              >
                Տեսնել բոլոր հարցերը
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faq;
