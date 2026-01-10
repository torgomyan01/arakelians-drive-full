import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllTrafficLawItems } from '@/app/actions/admin-traffic-law';
import TrafficLawList from '@/components/admin/traffic-law-list';

export default async function AdminTrafficLawPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const items = await getAllTrafficLawItems();

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <TrafficLawList items={items} />
    </div>
  );
}
