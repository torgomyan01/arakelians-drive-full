import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllComments } from '@/app/actions/admin-comments';
import CommentsList from '@/components/admin/comments-list';

export default async function AdminCommentsPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const comments = await getAllComments();

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <CommentsList comments={comments} />
    </div>
  );
}
