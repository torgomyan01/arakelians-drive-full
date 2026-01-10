import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllRoadSigns } from '@/app/actions/admin-road-signs';
import RoadSignsList from '@/components/admin/road-signs-list';

export default async function AdminRoadSignsPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const signs = await getAllRoadSigns();

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <RoadSignsList signs={signs} />
    </div>
  );
}
