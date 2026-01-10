import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllRoadMarkings } from '@/app/actions/admin-road-markings';
import RoadMarkingsList from '@/components/admin/road-markings-list';

export default async function AdminRoadMarkingsPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const markings = await getAllRoadMarkings();

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <RoadMarkingsList markings={markings} />
    </div>
  );
}
