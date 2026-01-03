import MainTemplate from '@/components/layout/main-template/main-template';
import { getSetting } from '@/app/actions/admin-settings';
import TestsContent from './TestsContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Վարորդական Քննություններ | Arakelians Drive',
  description:
    'Պատրաստվեք վարորդական քննությանը: Առցանց թեստեր վարորդական իրավունքի համար: Տեսական քննության պատրաստություն, պրակտիկ թեստեր, հարցերի բանկ:',
  keywords:
    'վարորդական քննություն, վարորդական թեստ, վարորդական քննություն առցանց, տեսական քննություն, վարորդական հարցեր, վարորդական քննություն պատրաստություն',
  openGraph: {
    title: 'Վարորդական Քննություններ | Arakelians Drive',
    description:
      'Պատրաստվեք վարորդական քննությանը: Առցանց թեստեր և պրակտիկ հարցեր:',
    type: 'website',
    siteName: 'Arakelians Drive',
  },
  twitter: {
    card: 'summary',
    title: 'Վարորդական Քննություններ | Arakelians Drive',
    description:
      'Պատրաստվեք վարորդական քննությանը: Առցանց թեստեր և պրակտիկ հարցեր:',
  },
};

export default async function TestsPage() {
  const phoneNumber = (await getSetting('phone_number')) || '+374 77 76-96-68';

  return (
    <MainTemplate phoneNumber={phoneNumber}>
      <TestsContent />
    </MainTemplate>
  );
}
