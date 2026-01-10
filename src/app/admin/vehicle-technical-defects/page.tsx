import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllVehicleTechnicalDefects } from '@/app/actions/admin-vehicle-technical-defects';
import VehicleTechnicalDefectsList from '@/components/admin/vehicle-technical-defects-list';

export default async function AdminVehicleTechnicalDefectsPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const defects = await getAllVehicleTechnicalDefects();

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <VehicleTechnicalDefectsList defects={defects} />
    </div>
  );
}
