import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllSettings } from '@/app/actions/admin-settings';
import SettingsForm from '@/components/admin/settings-form';

export default async function AdminSettingsPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const settings = await getAllSettings();

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A2229] mb-2">
          Կարգավորումներ
        </h1>
        <p className="text-[#8D8D8D]">
          Կառավարեք կայքի հիմնական կարգավորումները
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
