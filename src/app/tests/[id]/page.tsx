import MainTemplate from '@/components/layout/main-template/main-template';
import { getSetting } from '@/app/actions/admin-settings';
import TestContent from './TestContent';

interface TestPageProps {
  params: {
    id: string;
  };
}

export default async function TestPage({ params }: TestPageProps) {
  const testId = parseInt(params.id, 10);
  const phoneNumber = (await getSetting('phone_number')) || '+374 77 76-96-68';

  return (
    <MainTemplate phoneNumber={phoneNumber}>
      <TestContent testId={testId} />
    </MainTemplate>
  );
}
