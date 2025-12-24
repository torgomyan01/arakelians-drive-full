import MainTemplate from '@/components/layout/main-template/main-template';
import { getSetting } from '@/app/actions/admin-settings';
import LearnRulesRoadContent from './LearnRulesRoadContent';

export default async function Page() {
  const phoneNumber = (await getSetting('phone_number')) || '+374 77 76-96-68';

  return (
    <MainTemplate phoneNumber={phoneNumber}>
      <LearnRulesRoadContent />
    </MainTemplate>
  );
}
