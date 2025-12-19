import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Տրանսպորտային Միջոցների Ճանաչման Նշաններ | Arakelians.Drive',
  description:
    'Հայաստանի Հանրապետության տրանսպորտային միջոցների վրա տեղադրվող ճանաչման նշանների ամբողջական ցանկ:',
  keywords:
    'տրանսպորտային միջոցների ճանաչման նշաններ, վարորդական իրավունք, Հայաստան, ավտոմոբիլի նշաններ',
  openGraph: {
    title: 'Տրանսպորտային Միջոցների Ճանաչման Նշաններ',
    description:
      'Հայաստանի Հանրապետության տրանսպորտային միջոցների վրա տեղադրվող ճանաչման նշանների ամբողջական ցանկ',
    type: 'website',
  },
};

export default function VehicleIdentificationSignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
