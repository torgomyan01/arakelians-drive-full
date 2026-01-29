import { notFound } from 'next/navigation';
import { getStudentByToken } from '@/app/actions/admin-students';
import MainTemplate from '@/components/layout/main-template/main-template';
import StudentReviewForm from '@/components/student/student-review-form';
import { getImageUrl } from '@/utils/image-utils';
import { Metadata } from 'next';

interface StudentPageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({
  params,
}: StudentPageProps): Promise<Metadata> {
  const { token } = await params;
  const student = await getStudentByToken(token);

  if (!student) {
    return {
      title: 'Աշակերտ չի գտնվել | Arakelians Drive',
    };
  }

  return {
    title: `${student.name || 'Student'} - Review | Arakelians Drive`,
    description: `${student.name || 'Student'} - ${student.examResult || 'N/A'}`,
  };
}

export default async function StudentPage({ params }: StudentPageProps) {
  const { token } = await params;
  const student = await getStudentByToken(token);

  if (!student) {
    notFound();
  }

  return (
    <MainTemplate>
      <div className="container mx-auto px-4 py-[60px] max-md:py-[40px]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-[20px] shadow-[0_0_60px_30px_rgba(0,0,0,0.03)] p-8">
            {/* Student Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 pb-8 border-b border-gray-200">
              {student.photo ? (
                <img
                  src={getImageUrl(student.photo)}
                  alt={student.name || 'Student'}
                  className="w-24 h-24 object-cover rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <i className="fas fa-user text-gray-400 text-3xl"></i>
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-[#1A2229] mb-2">
                  {student.name || 'Անանուն'}
                </h1>
                {student.examResult && (
                  <p className="text-[#8D8D8D] text-lg">
                    Քննական արդյունք:{' '}
                    <span className="font-semibold text-[#FA8604]">
                      {student.examResult}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Review Form */}
            <StudentReviewForm student={student} />
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}
