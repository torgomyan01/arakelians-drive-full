import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'Տրանսպորտային Միջոցների Տեխնիկական Անսարքություններ | Arakelians.Drive',
  description:
    'Հայաստանի Հանրապետության տրանսպորտային միջոցների տեխնիկական անսարքությունների և պայմանների ամբողջական ցանկ:',
  keywords:
    'տրանսպորտային միջոցների անսարքություններ, տեխնիկական անսարքություններ, վարորդական իրավունք, Հայաստան',
  openGraph: {
    title: 'Տրանսպորտային Միջոցների Տեխնիկական Անսարքություններ',
    description:
      'Հայաստանի Հանրապետության տրանսպորտային միջոցների տեխնիկական անսարքությունների և պայմանների ամբողջական ցանկ',
    type: 'website',
  },
};

export default function VehicleTechnicalDefectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
