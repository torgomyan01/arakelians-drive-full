import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllVehicleIdentificationSigns } from '@/app/actions/admin-vehicle-identification-signs';
import VehicleIdentificationSignsList from '@/components/admin/vehicle-identification-signs-list';

export default async function AdminVehicleIdentificationSignsPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const signs = await getAllVehicleIdentificationSigns();

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <VehicleIdentificationSignsList signs={signs} />
    </div>
  );
}
