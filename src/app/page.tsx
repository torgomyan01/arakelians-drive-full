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
import { getSetting } from '@/app/actions/admin-settings';
import { Metadata } from 'next';

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
  const phoneNumber = (await getSetting('phone_number')) || '+374 77 76-96-68';
  const address = (await getSetting('address')) || 'Ք․ Սիսիան';
  const telegram = await getSetting('telegram');
  const whatsapp = await getSetting('whatsapp');

  return (
    <MainTemplate>
      <Header phoneNumber={phoneNumber} address={address} />

      <main className="overflow-hidden">
        <WeLearning />

        <Category />

        <AboutUs />

        <Reviews />

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
