import './globals.scss';
import '../icons/icons.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './tailwind.css';

import NextTopLoader from 'nextjs-toploader';
import type { Metadata } from 'next';

import { Providers } from '@/app/providers';
import CookieConsent from '@/components/common/cookie-consent/cookie-consent';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Arakelians Drive - Ավտոդպրոց Հայաստանում | Վարորդական Իրավունք',
    description:
      'Arakelians Drive - Հայաստանի լավագույն ավտոդպրոցը: Վարորդական իրավունք ստանալու ամբողջական ծառայություններ: 2000+ շրջանավարտ, 98% հաջողություն առաջին փորձից: Ժամանակակից նավատորմ, փորձառու հրահանգիչներ, անհատական մոտեցում:',
    keywords:
      'ավտոդպրոց, վարորդական իրավունք, Arakelians Drive, ավտոդպրոց Երևանում, ավտոդպրոց Հայաստանում, վարորդական դասեր, վարորդական քննություն, վարորդական իրավունք ստանալ, վարորդական իրավունք Երևան, վարորդական իրավունք Սիսիան',
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
    alternates: {
      canonical: 'https://arakeliansdrive.am',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning={true} className="light">
      <body className="text-foreground bg-background">
        <NextTopLoader />
        <Providers>{children}</Providers>
        <CookieConsent />
      </body>
    </html>
  );
}
