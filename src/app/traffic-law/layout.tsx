import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'Օրենք Ճանապարհային Երթևեկության Անվտանգության Ապահովման Մասին | Arakelians.Drive',
  description:
    'Հայաստանի Հանրապետության Օրենքը Ճանապարհային Երթևեկության Անվտանգության Ապահովման Մասին: Հասկացություններ և հոդվածներ:',
  keywords:
    'ճանապարհային երթևեկություն, օրենք, անվտանգություն, վարորդական իրավունք, Հայաստան',
  openGraph: {
    title: 'Օրենք Ճանապարհային Երթևեկության Անվտանգության Ապահովման Մասին',
    description:
      'Հայաստանի Հանրապետության Օրենքը Ճանապարհային Երթևեկության Անվտանգության Ապահովման Մասին',
    type: 'website',
  },
};

export default function TrafficLawLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
