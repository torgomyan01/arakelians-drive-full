'use client';

import { useState, useMemo, useEffect } from 'react';
import { StudentWithStats } from '@/app/actions/admin-students';
import StudentEditModal from './student-edit-modal';
import { getImageUrl } from '@/utils/image-utils';

interface StudentsListProps {
  students: StudentWithStats[];
}

const ITEMS_PER_PAGE = 10;

export default function StudentsList({ students }: StudentsListProps) {
  const [selectedStudent, setSelectedStudent] =
    useState<StudentWithStats | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = useMemo(() => {
    let filtered = students;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          (s.name && s.name.toLowerCase().includes(query)) ||
          (s.examResult && s.examResult.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [students, searchQuery]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  const handleEdit = (student: StudentWithStats) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedStudent(null);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedStudent(null);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('hy-AM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyStudentLink = (token: string) => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/student/${token}`;
    navigator.clipboard.writeText(url);
    alert('Հղումը պատճենվել է');
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-[#1A2229]">Աշակերտներ</h1>
          <button
            onClick={handleCreate}
            className="rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white px-6 py-2 font-medium transition-colors"
          >
            + Նոր աշակերտ
          </button>
        </div>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <p className="text-[#8D8D8D]">
            Ընդամենը {filteredStudents.length} աշակերտ
            {filteredStudents.length !== students.length &&
              ` (${students.length} ընդամենը)`}
          </p>
          <div className="flex gap-4 items-center flex-wrap">
            <input
              type="text"
              placeholder="Փնտրել..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {paginatedStudents.length === 0 ? (
          <div className="text-center py-12 text-[#8D8D8D]">
            Աշակերտներ չեն գտնվել
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A2229]">
                    Նկար
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A2229]">
                    Անուն
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A2229]">
                    Քննական արդյունք
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A2229]">
                    Հղում
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A2229]">
                    Կարգավիճակ
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A2229]">
                    Ստեղծվել է
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[#1A2229]">
                    Գործողություններ
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      {student.photo ? (
                        <img
                          src={getImageUrl(student.photo)}
                          alt={student.name || 'Student'}
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <i className="fas fa-user text-gray-400"></i>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#1A2229] font-medium">
                      {student.name || (
                        <span className="text-[#8D8D8D] italic">
                          Տվյալներ չկան
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#1A2229]">
                      {student.examResult || (
                        <span className="text-[#8D8D8D] italic">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => copyStudentLink(student.uniqueToken)}
                        className="text-[#FA8604] hover:text-[#FA8604]/80 text-sm flex items-center gap-1"
                        title="Պատճենել հղումը"
                      >
                        <i className="fas fa-link"></i>
                        <span>Հղում</span>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-[10px] text-xs font-medium ${
                          student.isApproved
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {student.isApproved ? 'Հաստատված' : 'Սպասում'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#8D8D8D]">
                      {formatDate(student.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="px-4 py-2 rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white text-sm font-medium transition-colors"
                        >
                          Խմբագրել
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-[10px] border border-gray-300 text-[#1A2229] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Նախորդ
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-[10px] font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#FA8604] text-white'
                        : 'border border-gray-300 text-[#1A2229] hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="px-2 text-[#8D8D8D]">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-[10px] border border-gray-300 text-[#1A2229] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Հաջորդ
          </button>
        </div>
      )}

      {(isEditModalOpen || isCreateModalOpen) && (
        <StudentEditModal
          student={selectedStudent}
          onClose={handleCloseModal}
          isOpen={isEditModalOpen || isCreateModalOpen}
        />
      )}
    </>
  );
}
