import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllStudents } from '@/app/actions/admin-students';
import StudentsList from '@/components/admin/students-list';

export default async function AdminStudentsPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const students = await getAllStudents();

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <StudentsList students={students} />
    </div>
  );
}
