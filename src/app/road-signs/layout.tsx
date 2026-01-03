import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ճանապարհային Նշաններ | Arakelians Drive',
  description:
    'Հայաստանի Հանրապետության ճանապարհային նշանների ամբողջական ցանկ: Բոլոր նշանները բաժանված են 8 խմբի: Ավտոդպրոց, վարորդական իրավունք, երթևեկության նշաններ:',
  keywords:
    'ճանապարհային նշաններ, երթևեկության նշաններ, վարորդական իրավունք, Հայաստան, ավտոդպրոց, ճանապարհային նշաններ Հայաստան, երթևեկության նշաններ Հայաստան',
  openGraph: {
    title: 'Ճանապարհային Նշաններ | Arakelians Drive',
    description:
      'Հայաստանի Հանրապետության ճանապարհային նշանների ամբողջական ցանկ: Բոլոր նշանները բաժանված են 8 խմբի:',
    type: 'website',
    siteName: 'Arakelians Drive',
  },
  twitter: {
    card: 'summary',
    title: 'Ճանապարհային Նշաններ | Arakelians Drive',
    description:
      'Հայաստանի Հանրապետության ճանապարհային նշանների ամբողջական ցանկ: Բոլոր նշանները բաժանված են 8 խմբի:',
  },
};

export default function RoadSignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
