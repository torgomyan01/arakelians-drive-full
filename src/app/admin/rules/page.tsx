import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllRulesSections } from '@/app/actions/admin-rules';
import RulesList from '@/components/admin/rules-list';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminRulesPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const sections = await getAllRulesSections();

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <RulesList sections={sections} />
    </div>
  );
}
