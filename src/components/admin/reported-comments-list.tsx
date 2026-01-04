'use client';

import { useState, useMemo, useEffect } from 'react';
import { CommentWithQuestion } from '@/app/actions/admin-comments';
import { approveComment, rejectComment } from '@/app/actions/admin-comments';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getImageUrl } from '@/utils/image-utils';

interface ReportedCommentsListProps {
  comments: CommentWithQuestion[];
}

const ITEMS_PER_PAGE = 10;

export default function ReportedCommentsList({
  comments,
}: ReportedCommentsListProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [filterQuestionId, setFilterQuestionId] = useState<number | null>(null);

  // Group comments by question
  const groupedComments = useMemo(() => {
    const groups = new Map<
      number,
      {
        question: CommentWithQuestion['question'];
        comments: CommentWithQuestion[];
      }
    >();

    comments.forEach((comment) => {
      if (!groups.has(comment.questionId)) {
        groups.set(comment.questionId, {
          question: comment.question,
          comments: [],
        });
      }
      groups.get(comment.questionId)!.comments.push(comment);
    });

    return Array.from(groups.values()).map((group) => ({
      ...group,
      comments: group.comments.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    }));
  }, [comments]);

  // Get unique questions for filter
  const uniqueQuestions = useMemo(() => {
    return groupedComments.map((group) => group.question);
  }, [groupedComments]);

  const filteredGroups = useMemo(
    () =>
      filterQuestionId
        ? groupedComments.filter((g) => g.question.id === filterQuestionId)
        : groupedComments,
    [groupedComments, filterQuestionId]
  );

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterQuestionId]);

  // Calculate pagination for question groups
  const totalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedGroups = filteredGroups.slice(startIndex, endIndex);

  // Count total comments for display
  const totalComments = useMemo(
    () => filteredGroups.reduce((sum, group) => sum + group.comments.length, 0),
    [filteredGroups]
  );

  const handleApprove = async (id: number) => {
    if (!confirm('Վստահ ե՞ք, որ ցանկանում եք հաստատել այս մեկնաբանությունը:')) {
      return;
    }

    setApprovingId(id);
    try {
      const result = await approveComment(id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    } catch (error: any) {
      alert(error.message || 'Սխալ է տեղի ունեցել');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (id: number) => {
    if (
      !confirm(
        'Վստահ ե՞ք, որ ցանկանում եք մերժել և ջնջել այս մեկնաբանությունը:'
      )
    ) {
      return;
    }

    setRejectingId(id);
    try {
      const result = await rejectComment(id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    } catch (error: any) {
      alert(error.message || 'Սխալ է տեղի ունեցել');
    } finally {
      setRejectingId(null);
    }
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

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <p className="text-[#8D8D8D]">
            Ընդամենը {totalComments} բողոքարկված մեկնաբանություն{' '}
            {filteredGroups.length} հարցում
          </p>
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium text-[#1A2229]">Հարց:</label>
            <select
              value={filterQuestionId || ''}
              onChange={(e) =>
                setFilterQuestionId(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604] w-[200px]"
            >
              <option value="">Բոլորը</option>
              {uniqueQuestions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.lessonCategory?.name || `Հարցաշար ${q.lessonCategoryId}`} •{' '}
                  {q.jsonId}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {paginatedGroups.length === 0 ? (
          <div className="text-center py-12 text-[#8D8D8D]">
            Բողոքարկված մեկնաբանություններ չեն գտնվել
          </div>
        ) : (
          paginatedGroups.map((group) => (
            <div
              key={group.question.id}
              className="border border-red-200 rounded-[10px] overflow-hidden bg-red-50/30"
            >
              {/* Question Header */}
              <div className="bg-gradient-to-r from-red-100 to-red-50 p-4 border-b border-red-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-red-700">
                        {group.question.lessonCategory?.name ||
                          `Հարցաշար ${group.question.lessonCategoryId}`}{' '}
                        • ID: {group.question.jsonId}
                      </span>
                      <span className="text-xs text-red-600 bg-white px-2 py-1 rounded-[10px] border border-red-200">
                        {group.comments.length} բողոքարկված
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#1A2229] mb-3">
                      {group.question.title}
                    </h3>
                    {group.question.img && (
                      <div className="mt-3">
                        <img
                          src={getImageUrl(group.question.img)}
                          alt="Question"
                          className="max-w-md rounded-[10px] border border-gray-300"
                        />
                      </div>
                    )}
                  </div>
                  <Link
                    href="/admin/questions"
                    className="text-sm text-[#FA8604] hover:underline whitespace-nowrap shrink-0"
                  >
                    Դեպի հարցեր →
                  </Link>
                </div>
              </div>

              {/* Comments List */}
              <div className="p-4 space-y-4">
                {group.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 rounded-[10px] bg-white border-2 border-red-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-[#1A2229]">
                            {comment.authorName}
                          </span>
                          <span className="text-xs text-[#8D8D8D]">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-[#1A2229] whitespace-pre-wrap mb-3">
                          {comment.text}
                        </p>
                        {comment.reports && comment.reports.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-red-200">
                            <p className="text-xs font-semibold text-red-700 mb-2">
                              Բողոքարկումներ ({comment.reports.length}):
                            </p>
                            <div className="space-y-1">
                              {comment.reports.map((report) => (
                                <div
                                  key={report.id}
                                  className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded"
                                >
                                  {formatDate(report.createdAt)} -{' '}
                                  {report.reason || 'Առանց պատճառի'}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleApprove(comment.id)}
                        disabled={approvingId === comment.id}
                        className="px-4 py-2 rounded-[10px] bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {approvingId === comment.id ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Հաստատվում է...</span>
                          </>
                        ) : (
                          <>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>Հաստատել</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(comment.id)}
                        disabled={rejectingId === comment.id}
                        className="px-4 py-2 rounded-[10px] bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {rejectingId === comment.id ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Մերժվում է...</span>
                          </>
                        ) : (
                          <>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                            <span>Մերժել</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
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
    </>
  );
}
