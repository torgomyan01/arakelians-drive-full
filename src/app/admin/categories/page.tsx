import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllLessonCategories } from '@/app/actions/admin-categories';
import CategoriesList from '@/components/admin/categories-list';

export default async function AdminCategoriesPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const categories = await getAllLessonCategories();

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <CategoriesList categories={categories} />
    </div>
  );
}
