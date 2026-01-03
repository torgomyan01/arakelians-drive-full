import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ճանապարհային Գծանշումներ | Arakelians Drive',
  description:
    'Հայաստանի Հանրապետության ճանապարհային գծանշումների ամբողջական ցանկ: Բոլոր գծանշումները բաժանված են խմբերի: Ավտոդպրոց, վարորդական իրավունք, երթևեկության գծանշումներ:',
  keywords:
    'ճանապարհային գծանշումներ, երթևեկության գծանշումներ, վարորդական իրավունք, Հայաստան, ավտոդպրոց, ճանապարհային գծանշումներ Հայաստան, երթևեկության գծանշումներ Հայաստան',
  openGraph: {
    title: 'Ճանապարհային Գծանշումներ | Arakelians Drive',
    description:
      'Հայաստանի Հանրապետության ճանապարհային գծանշումների ամբողջական ցանկ: Բոլոր գծանշումները բաժանված են խմբերի:',
    type: 'website',
    siteName: 'Arakelians Drive',
  },
  twitter: {
    card: 'summary',
    title: 'Ճանապարհային Գծանշումներ | Arakelians Drive',
    description:
      'Հայաստանի Հանրապետության ճանապարհային գծանշումների ամբողջական ցանկ: Բոլոր գծանշումները բաժանված են խմբերի:',
  },
};

export default function RoadMarkingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
