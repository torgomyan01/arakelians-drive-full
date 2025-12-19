'use client';

import Navbar from '@/components/layout/navbar/navbar';
import Footer from '@/components/layout/footer/footer';
import Contact from '@/components/layout/contact/contact';

function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden rounded-[20px]">
        <div className="container mx-auto px-4 py-[60px] max-md:py-[40px]">
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ContactPage;
