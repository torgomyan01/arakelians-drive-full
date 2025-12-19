import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ճանապարհային Նշաններ | Arakelians.Drive',
  description:
    'Հայաստանի Հանրապետության ճանապարհային նշանների ամբողջական ցանկ: Բոլոր նշանները բաժանված են 8 խմբի:',
  keywords:
    'ճանապարհային նշաններ, երթևեկության նշաններ, վարորդական իրավունք, Հայաստան',
  openGraph: {
    title: 'Ճանապարհային Նշաններ',
    description:
      'Հայաստանի Հանրապետության ճանապարհային նշանների ամբողջական ցանկ',
    type: 'website',
  },
};

export default function RoadSignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
