import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getReportedComments } from '@/app/actions/admin-comments';
import ReportedCommentsList from '@/components/admin/reported-comments-list';

export const revalidate = 0;

export default async function AdminReportedCommentsPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const comments = await getReportedComments();

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A2229] mb-2">
          Բողոքարկված Մեկնաբանություններ
        </h1>
        <p className="text-[#8D8D8D]">
          Ստուգեք և հաստատեք կամ մերժեք բողոքարկված մեկնաբանությունները
        </p>
      </div>
      <ReportedCommentsList comments={comments} />
    </div>
  );
}
