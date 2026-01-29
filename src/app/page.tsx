import AboutUs from '@/components/common/home/about-us/about-us';
import Category from '@/components/common/home/category/category';
import Faq from '@/components/common/home/faq/faq';
import Header from '@/components/common/home/header/header';
import Reviews from '@/components/common/home/reviews/reviews';
import WeLearning from '@/components/common/home/we-learning/we-learning';
import FeaturedBlogs from '@/components/common/home/featured-blogs/featured-blogs';
import Contact from '@/components/layout/contact/contact';
import MainTemplate from '@/components/layout/main-template/main-template';
import { getSetting } from '@/app/actions/admin-settings';
import { getAllBlogPosts } from '@/app/actions/admin-blogs';
import { getApprovedStudents } from '@/app/actions/admin-students';
import { Metadata } from 'next';
import { unstable_noStore } from 'next/cache';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Arakelians Drive - Ավտոդպրոց Հայաստանում | Վարորդական Իրավունք',
  description:
    'Arakelians Drive - Հայաստանի լավագույն ավտոդպրոցը: Վարորդական իրավունք ստանալու ամբողջական ծառայություններ: 2000+ շրջանավարտ, 98% հաջողություն առաջին փորձից: Ժամանակակից նավատորմ, փորձառու հրահանգիչներ, անհատական մոտեցում:',
  keywords:
    'ավտոդպրոց, վարորդական իրավունք, Arakelians Drive, ավտոդպրոց Երևանում, ավտոդպրոց Հայաստանում, վարորդական դասեր, վարորդական քննություն, վարորդական իրավունք ստանալ, վարորդական իրավունք Երևան, վարորդական իրավունք Սիսիան, ավտոդպրոց Սիսիան',
  openGraph: {
    title: 'Arakelians Drive - Ավտոդպրոց Հայաստանում',
    description:
      'Arakelians Drive - Հայաստանի լավագույն ավտոդպրոցը: 2000+ շրջանավարտ, 98% հաջողություն առաջին փորձից',
    type: 'website',
    siteName: 'Arakelians Drive',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arakelians Drive - Ավտոդպրոց Հայաստանում',
    description:
      'Arakelians Drive - Հայաստանի լավագույն ավտոդպրոցը: 2000+ շրջանավարտ, 98% հաջողություն առաջին փորձից',
  },
};

export default async function Page() {
  // Disable caching for this page to always get fresh data
  unstable_noStore();

  const phoneNumber = (await getSetting('phone_number')) || '+374 77 76-96-68';
  const address = (await getSetting('address')) || 'Ք․ Սիսիան';
  const telegram = await getSetting('telegram');
  const whatsapp = await getSetting('whatsapp');

  // Get latest blog posts
  const blogPosts = await getAllBlogPosts(false);

  // Get approved students with reviews (always fresh)
  const approvedStudents = await getApprovedStudents();

  console.log(approvedStudents);

  return (
    <MainTemplate>
      <Header phoneNumber={phoneNumber} address={address} />

      <main className="overflow-hidden">
        <WeLearning />

        <Category />

        <AboutUs />

        <Reviews students={approvedStudents} />

        <FeaturedBlogs posts={blogPosts} />

        <Faq />

        <Contact
          phoneNumber={phoneNumber}
          address={address}
          telegram={telegram || undefined}
          whatsapp={whatsapp || undefined}
        />
      </main>
    </MainTemplate>
  );
}
