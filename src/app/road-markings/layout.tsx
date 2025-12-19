import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ճանապարհային Գծանշումներ | Arakelians.Drive',
  description:
    'Հայաստանի Հանրապետության ճանապարհային գծանշումների ամբողջական ցանկ: Բոլոր գծանշումները բաժանված են խմբերի:',
  keywords:
    'ճանապարհային գծանշումներ, երթևեկության գծանշումներ, վարորդական իրավունք, Հայաստան',
  openGraph: {
    title: 'Ճանապարհային Գծանշումներ',
    description:
      'Հայաստանի Հանրապետության ճանապարհային գծանշումների ամբողջական ցանկ',
    type: 'website',
  },
};

export default function RoadMarkingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
