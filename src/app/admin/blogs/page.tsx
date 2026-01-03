import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllBlogPosts } from '@/app/actions/admin-blogs';
import BlogsList from '@/components/admin/blogs-list';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminBlogsPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const posts = await getAllBlogPosts(true);

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <BlogsList posts={posts} />
    </div>
  );
}
