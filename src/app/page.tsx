import AboutUs from '@/components/common/home/about-us/about-us';
import Category from '@/components/common/home/category/category';
import Faq from '@/components/common/home/faq/faq';
import Header from '@/components/common/home/header/header';
import Reviews from '@/components/common/home/reviews/reviews';
import WeLearning from '@/components/common/home/we-learning/we-learning';
import Contact from '@/components/layout/contact/contact';
import Footer from '@/components/layout/footer/footer';
import MainTemplate from '@/components/layout/main-template/main-template';
import Navbar from '@/components/layout/navbar/navbar';

export default function Page() {
  return (
    <MainTemplate>
      <Header />

      <main className="overflow-hidden">
        <WeLearning />

        <Category />

        <AboutUs />

        <Reviews />

        <Faq />

        <Contact />
      </main>
    </MainTemplate>
  );
}
