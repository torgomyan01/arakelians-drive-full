import MainTemplate from '@/components/layout/main-template/main-template';
import { getSetting } from '@/app/actions/admin-settings';
import TestContent from './TestContent';
import { Metadata } from 'next';

interface TestPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: TestPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Վարորդական Քննություն | Arakelians Drive`,
    description:
      'Պատրաստվեք վարորդական քննությանը: Առցանց թեստ վարորդական իրավունքի համար: Տեսական քննության պատրաստություն, պրակտիկ հարցեր:',
    keywords:
      'վարորդական քննություն, վարորդական թեստ, վարորդական քննություն առցանց, տեսական քննություն, վարորդական հարցեր',
    openGraph: {
      title: `Վարորդական Քննություն | Arakelians Drive`,
      description:
        'Պատրաստվեք վարորդական քննությանը: Առցանց թեստ և պրակտիկ հարցեր:',
      type: 'website',
      siteName: 'Arakelians Drive',
    },
    twitter: {
      card: 'summary',
      title: `Վարորդական Քննություն | Arakelians Drive`,
      description:
        'Պատրաստվեք վարորդական քննությանը: Առցանց թեստ և պրակտիկ հարցեր:',
    },
  };
}

export default async function TestPage({ params }: TestPageProps) {
  const { id } = await params;
  const testId = parseInt(id, 10);
  const phoneNumber = (await getSetting('phone_number')) || '+374 77 76-96-68';

  return (
    <MainTemplate phoneNumber={phoneNumber}>
      <TestContent testId={testId} />
    </MainTemplate>
  );
}
