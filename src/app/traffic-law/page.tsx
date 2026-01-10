import MainTemplate from '@/components/layout/main-template/main-template';
import { getSetting } from '@/app/actions/admin-settings';
import { getAllTrafficLawItems } from '@/app/actions/traffic-law';
import TrafficLawContent from './TrafficLawContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'Օրենք Ճանապարհային Երթևեկության Անվտանգության Ապահովման Մասին | Arakelians Drive',
  description:
    'Հայաստանի Հանրապետության Օրենքը Ճանապարհային Երթևեկության Անվտանգության Ապահովման Մասին: Հասկացություններ և հոդվածներ:',
  keywords:
    'ճանապարհային երթևեկություն, օրենք, անվտանգություն, վարորդական իրավունք, Հայաստան, երթևեկության օրենք, ճանապարհային երթևեկության օրենք',
  openGraph: {
    title:
      'Օրենք Ճանապարհային Երթևեկության Անվտանգության Ապահովման Մասին | Arakelians Drive',
    description:
      'Հայաստանի Հանրապետության Օրենքը Ճանապարհային Երթևեկության Անվտանգության Ապահովման Մասին',
    type: 'website',
  },
};

export default async function TrafficLawPage() {
  const phoneNumber = (await getSetting('phone_number')) || '+374 77 76-96-68';
  const items = await getAllTrafficLawItems();

  return (
    <MainTemplate phoneNumber={phoneNumber}>
      <TrafficLawContent initialItems={items} />
    </MainTemplate>
  );
}
