import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllRegistrations } from '@/app/actions/registrations';
import RegistrationsList from '@/components/admin/registrations-list';

export default async function AdminRegistrationsPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const registrations = await getAllRegistrations();

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <RegistrationsList registrations={registrations} />
    </div>
  );
}
