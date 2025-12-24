import './globals.scss';
import '../icons/icons.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './tailwind.css';

import NextTopLoader from 'nextjs-toploader';
import type { Metadata } from 'next';

import { Providers } from '@/app/providers';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Arakelians.Drive',
    description:
      'Arakelians.Drive - Your trusted partner in digital transformation',
    keywords:
      'Arakelians.Drive, digital transformation, trusted partner, digital solutions',
    alternates: {
      canonical: 'https://torgomyan.studio',
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
      </body>
    </html>
  );
}
