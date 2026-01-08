import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAllPsychologicalQuestions } from '@/app/actions/admin-psychological-questions';
import PsychologicalQuestionsList from '@/components/admin/psychological-questions-list';

export default async function AdminPsychologicalQuestionsPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/admin/login');
  }

  const questions = await getAllPsychologicalQuestions();

  return (
    <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
      <PsychologicalQuestionsList questions={questions} />
    </div>
  );
}
