import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllUsers } from '@/app/actions/admin-users';
import UsersList from '@/components/admin/users-list';

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const users = await getAllUsers();

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <UsersList users={users} />
    </div>
  );
}
