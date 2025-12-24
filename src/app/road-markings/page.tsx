import MainTemplate from '@/components/layout/main-template/main-template';
import { getSetting } from '@/app/actions/admin-settings';
import RoadMarkingsContent from './RoadMarkingsContent';

export default async function RoadMarkingsPage() {
  const phoneNumber = (await getSetting('phone_number')) || '+374 77 76-96-68';

  return (
    <MainTemplate phoneNumber={phoneNumber}>
      <RoadMarkingsContent />
    </MainTemplate>
  );
}
