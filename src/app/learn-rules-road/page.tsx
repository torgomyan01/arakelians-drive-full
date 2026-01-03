import MainTemplate from '@/components/layout/main-template/main-template';
import { getSetting } from '@/app/actions/admin-settings';
import LearnRulesRoadContent from './LearnRulesRoadContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Սովորել Ճանապարհային Կանոնները | Arakelians Drive',
  description:
    'Սովորեք ճանապարհային կանոնները առցանց: Ամբողջական ուսումնական նյութեր, ինտերակտիվ դասեր, վարորդական իրավունքի պատրաստություն:',
  keywords:
    'ճանապարհային կանոններ, սովորել ճանապարհային կանոններ, վարորդական իրավունք սովորել, առցանց ուսուցում, վարորդական դասեր առցանց',
  openGraph: {
    title: 'Սովորել Ճանապարհային Կանոնները | Arakelians Drive',
    description:
      'Սովորեք ճանապարհային կանոնները առցանց: Ամբողջական ուսումնական նյութեր և ինտերակտիվ դասեր:',
    type: 'website',
    siteName: 'Arakelians Drive',
  },
  twitter: {
    card: 'summary',
    title: 'Սովորել Ճանապարհային Կանոնները | Arakelians Drive',
    description:
      'Սովորեք ճանապարհային կանոնները առցանց: Ամբողջական ուսումնական նյութեր և ինտերակտիվ դասեր:',
  },
};

export default async function Page() {
  const phoneNumber = (await getSetting('phone_number')) || '+374 77 76-96-68';

  return (
    <MainTemplate phoneNumber={phoneNumber}>
      <LearnRulesRoadContent />
    </MainTemplate>
  );
}
