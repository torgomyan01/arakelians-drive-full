'use client';

import { allFaqItems } from '@/data/faq-data';
import Navbar from '@/components/layout/navbar/navbar';
import Footer from '@/components/layout/footer/footer';
import FaqList from '@/components/common/faq/FaqList';

function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        <div className="container mx-auto px-4 py-[60px] max-md:py-[40px]">
          <h1 className="global-title mb-[50px] max-md:mb-[30px] text-center">
            Հաճախ Տրվող Հարցեր (FAQ)
          </h1>
          <div className="max-w-[900px] mx-auto">
            <div id="faq-container">
              <FaqList items={allFaqItems} />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}

export default FaqPage;
