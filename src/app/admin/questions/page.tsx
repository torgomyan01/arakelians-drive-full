import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import {
  getAllQuestions,
  getLessonCategories,
} from '@/app/actions/admin-questions';
import QuestionsList from '@/components/admin/questions-list';

export default async function AdminQuestionsPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const questions = await getAllQuestions();
  const categories = await getLessonCategories();

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <QuestionsList questions={questions} categories={categories} />
    </div>
  );
}
