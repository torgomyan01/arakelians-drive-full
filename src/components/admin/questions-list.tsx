'use client';

import { useState, useMemo, useEffect } from 'react';
import { QuestionWithOptions } from '@/app/actions/admin-questions';
import QuestionEditModal from './question-edit-modal';

interface QuestionsListProps {
  questions: QuestionWithOptions[];
  categories: { id: number; name: string; questionCount: number }[];
}

const ITEMS_PER_PAGE = 10;

export default function QuestionsList({
  questions,
  categories,
}: QuestionsListProps) {
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionWithOptions | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredQuestions = useMemo(
    () =>
      filterCategory
        ? questions.filter((q) => q.lessonCategoryId === filterCategory)
        : questions,
    [questions, filterCategory]
  );

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

  // Reset page when filter changes
  const handleFilterChange = (value: number | null) => {
    setFilterCategory(value);
    setCurrentPage(1);
  };

  const handleEdit = (question: QuestionWithOptions) => {
    setSelectedQuestion(question);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedQuestion(null);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedQuestion(null);
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-[#1A2229]">Հարցեր</h1>
          <button
            onClick={handleCreate}
            className="rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white px-6 py-2 font-medium transition-colors"
          >
            + Նոր հարց
          </button>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[#8D8D8D]">
            Ընդամենը {filteredQuestions.length} հարց
            {filteredQuestions.length !== questions.length &&
              ` (${questions.length} ընդամենը)`}
          </p>
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium text-[#1A2229]">
              Հարցաշար:
            </label>
            <select
              value={filterCategory || ''}
              onChange={(e) =>
                handleFilterChange(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
            >
              <option value="">Բոլորը</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.questionCount})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {paginatedQuestions.length === 0 ? (
          <div className="text-center py-12 text-[#8D8D8D]">
            Հարցեր չեն գտնվել
          </div>
        ) : (
          paginatedQuestions.map((question) => (
            <div
              key={question.id}
              className="border border-gray-200 rounded-[10px] p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm text-[#8D8D8D]">
                      {categories.find(
                        (c) => c.id === question.lessonCategoryId
                      )?.name || `Հարցաշար ${question.lessonCategoryId}`}{' '}
                      • ID: {question.jsonId}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1A2229] mb-3">
                    {question.title}
                  </h3>
                  {question.img && (
                    <div className="mb-3">
                      <img
                        src={`/lessons/images/${question.img}`}
                        alt="Question"
                        className="max-w-xs rounded-[10px]"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    {question.options.map((option, index) => (
                      <div
                        key={option.id}
                        className={`p-3 rounded-[10px] ${
                          index === question.correctAnswerIndex
                            ? 'bg-green-50 border-2 border-green-500'
                            : 'bg-gray-50'
                        }`}
                      >
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + index)}:
                        </span>
                        {option.text}
                        {index === question.correctAnswerIndex && (
                          <span className="ml-2 text-green-600 font-semibold">
                            ✓ Ճիշտ
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(question)}
                  className="ml-4 px-4 py-2 rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white font-medium transition-colors"
                >
                  Խմբագրել
                </button>
              </div>
            </div>
          ))
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
              // Show first page, last page, current page, and pages around current
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
        <QuestionEditModal
          question={selectedQuestion}
          categories={categories}
          onClose={handleCloseModal}
          isOpen={isEditModalOpen || isCreateModalOpen}
        />
      )}
    </>
  );
}
