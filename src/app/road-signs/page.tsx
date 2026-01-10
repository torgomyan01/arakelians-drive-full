import MainTemplate from '@/components/layout/main-template/main-template';
import { getSetting } from '@/app/actions/admin-settings';
import { getAllRoadSigns } from '@/app/actions/road-signs';
import RoadSignsContent from './RoadSignsContent';

export default async function RoadSignsPage() {
  const phoneNumber = (await getSetting('phone_number')) || '+374 77 76-96-68';
  const signs = await getAllRoadSigns();

  return (
    <MainTemplate phoneNumber={phoneNumber}>
      <RoadSignsContent initialSigns={signs} />
    </MainTemplate>
  );
}
