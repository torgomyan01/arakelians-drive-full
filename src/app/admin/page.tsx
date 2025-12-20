import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getDashboardStats } from '@/app/actions/admin-dashboard';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const stats = await getDashboardStats();

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A2229] mb-2">
          Ադմինի վահանակ
        </h1>
        <p className="text-[#8D8D8D]">
          Բարև, {session.user?.name || session.user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/users"
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-[10px] p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <h3 className="text-xl font-semibold text-[#1A2229] mb-2">
            Օգտատերեր
          </h3>
          <p className="text-3xl font-bold text-blue-600">{stats.usersCount}</p>
        </Link>

        <Link
          href="/admin/questions"
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-[10px] p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <h3 className="text-xl font-semibold text-[#1A2229] mb-2">Հարցեր</h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.questionsCount}
          </p>
        </Link>

        <Link
          href="/admin/comments"
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-[10px] p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <h3 className="text-xl font-semibold text-[#1A2229] mb-2">
            Մեկնաբանություններ
          </h3>
          <p className="text-3xl font-bold text-orange-600">
            {stats.commentsCount}
          </p>
        </Link>

        <Link
          href="/admin/registrations"
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-[10px] p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <h3 className="text-xl font-semibold text-[#1A2229] mb-2">
            Գրանցումներ
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats.registrationsCount}
          </p>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-[#1A2229] mb-4">
          Արագ գործողություններ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/users"
            className="bg-white border-2 border-[#FA8604] text-[#FA8604] rounded-[10px] py-3 px-6 font-medium hover:bg-[#FA8604] hover:text-white transition-colors text-center"
          >
            Օգտատերեր կառավարել
          </Link>
          <Link
            href="/admin/questions"
            className="bg-white border-2 border-[#FA8604] text-[#FA8604] rounded-[10px] py-3 px-6 font-medium hover:bg-[#FA8604] hover:text-white transition-colors text-center"
          >
            Հարցեր կառավարել
          </Link>
          <Link
            href="/admin/comments"
            className="bg-white border-2 border-[#FA8604] text-[#FA8604] rounded-[10px] py-3 px-6 font-medium hover:bg-[#FA8604] hover:text-white transition-colors text-center"
          >
            Մեկնաբանություններ կառավարել
          </Link>
          <Link
            href="/admin/registrations"
            className="bg-white border-2 border-[#FA8604] text-[#FA8604] rounded-[10px] py-3 px-6 font-medium hover:bg-[#FA8604] hover:text-white transition-colors text-center"
          >
            Գրանցումներ կառավարել
          </Link>
          <Link
            href="/admin/settings"
            className="bg-white border-2 border-[#FA8604] text-[#FA8604] rounded-[10px] py-3 px-6 font-medium hover:bg-[#FA8604] hover:text-white transition-colors text-center"
          >
            Կարգավորումներ
          </Link>
        </div>
      </div>
    </div>
  );
}
