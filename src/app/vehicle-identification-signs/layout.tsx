import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Տրանսպորտային Միջոցների Ճանաչման Նշաններ | Arakelians Drive',
  description:
    'Հայաստանի Հանրապետության տրանսպորտային միջոցների վրա տեղադրվող ճանաչման նշանների ամբողջական ցանկ: Ավտոդպրոց, վարորդական իրավունք, ավտոմոբիլի նշաններ:',
  keywords:
    'տրանսպորտային միջոցների ճանաչման նշաններ, վարորդական իրավունք, Հայաստան, ավտոմոբիլի նշաններ, ավտոդպրոց, մեքենայի նշաններ, տրանսպորտային միջոցների նշաններ',
  openGraph: {
    title: 'Տրանսպորտային Միջոցների Ճանաչման Նշաններ | Arakelians Drive',
    description:
      'Հայաստանի Հանրապետության տրանսպորտային միջոցների վրա տեղադրվող ճանաչման նշանների ամբողջական ցանկ',
    type: 'website',
    siteName: 'Arakelians Drive',
  },
  twitter: {
    card: 'summary',
    title: 'Տրանսպորտային Միջոցների Ճանաչման Նշաններ | Arakelians Drive',
    description:
      'Հայաստանի Հանրապետության տրանսպորտային միջոցների վրա տեղադրվող ճանաչման նշանների ամբողջական ցանկ',
  },
};

export default function VehicleIdentificationSignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
