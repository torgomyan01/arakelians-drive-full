import MainTemplate from '@/components/layout/main-template/main-template';
import { getSetting } from '@/app/actions/admin-settings';
import PsychologicalTestsContent from './PsychologicalTestsContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Հոգեբանական Թեստեր | Arakelians Drive',
  description:
    'Հոգեբանական թեստեր վարորդների համար: Ուսուցողական հոգեբանական հարցեր և թեստեր:',
  keywords:
    'հոգեբանական թեստեր, վարորդական հոգեբանական թեստեր, ուսուցողական հոգեբանական հարցեր',
  openGraph: {
    title: 'Հոգեբանական Թեստեր | Arakelians Drive',
    description:
      'Հոգեբանական թեստեր վարորդների համար: Ուսուցողական հոգեբանական հարցեր և թեստեր:',
    type: 'website',
    siteName: 'Arakelians Drive',
  },
  twitter: {
    card: 'summary',
    title: 'Հոգեբանական Թեստեր | Arakelians Drive',
    description:
      'Հոգեբանական թեստեր վարորդների համար: Ուսուցողական հոգեբանական հարցեր և թեստեր:',
  },
};

export default async function Page() {
  const phoneNumber = (await getSetting('phone_number')) || '+374 77 76-96-68';

  return (
    <MainTemplate phoneNumber={phoneNumber}>
      <PsychologicalTestsContent />
    </MainTemplate>
  );
}
