'use client';

import { useState, useMemo, useEffect } from 'react';
import { CommentWithQuestion } from '@/app/actions/admin-comments';
import { deleteComment, replyToComment } from '@/app/actions/admin-comments';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CommentsListProps {
  comments: CommentWithQuestion[];
}

const ITEMS_PER_PAGE = 10;

export default function CommentsList({ comments }: CommentsListProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
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

  const handleDelete = async (id: number) => {
    if (!confirm('Վստահ ե՞ք, որ ցանկանում եք ջնջել այս մեկնաբանությունը?')) {
      return;
    }

    setDeletingId(id);
    try {
      const result = await deleteComment(id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    } catch (error: any) {
      alert(error.message || 'Սխալ է տեղի ունեցել');
    } finally {
      setDeletingId(null);
    }
  };

  const handleReply = async (commentId: number) => {
    if (!replyText.trim()) {
      alert('Մուտքագրեք պատասխան');
      return;
    }

    try {
      const result = await replyToComment(commentId, replyText.trim());
      if (result.success) {
        setReplyingTo(null);
        setReplyText('');
        router.refresh();
      } else {
        alert(result.error || 'Սխալ է տեղի ունեցել');
      }
    } catch (error: any) {
      alert(error.message || 'Սխալ է տեղի ունեցել');
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-[#1A2229]">
            Մեկնաբանություններ
          </h1>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[#8D8D8D]">
            Ընդամենը {totalComments} մեկնաբանություն {filteredGroups.length}{' '}
            հարցում
            {totalComments !== comments.length &&
              ` (${comments.length} ընդամենը)`}
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
              className="border border-gray-300 rounded-[10px] px-4 py-2 focus:outline-none focus:border-[#FA8604]"
            >
              <option value="">Բոլորը</option>
              {uniqueQuestions.map((q) => (
                <option key={q.id} value={q.id}>
                  Հարցաշար {q.lessonCategoryId} • {q.jsonId}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {paginatedGroups.length === 0 ? (
          <div className="text-center py-12 text-[#8D8D8D]">
            Մեկնաբանություններ չեն գտնվել
          </div>
        ) : (
          paginatedGroups.map((group) => (
            <div
              key={group.question.id}
              className="border border-gray-200 rounded-[10px] overflow-hidden"
            >
              {/* Question Header */}
              <div className="bg-gradient-to-r from-[#FA8604]/10 to-[#FA8604]/5 p-4 border-b border-gray-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-[#FA8604]">
                        Հարցաշար {group.question.lessonCategoryId} • ID:{' '}
                        {group.question.jsonId}
                      </span>
                      <span className="text-xs text-[#8D8D8D] bg-white px-2 py-1 rounded-[10px]">
                        {group.comments.length} մեկնաբանություն
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#1A2229] mb-3">
                      {group.question.title}
                    </h3>
                    {group.question.img && (
                      <div className="mt-3">
                        <img
                          src={`/lessons/images/${group.question.img}`}
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
                    className={`p-4 rounded-[10px] ${
                      comment.authorName.includes('(Պատասխան)')
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`font-semibold ${
                              comment.authorName.includes('(Պատասխան)')
                                ? 'text-blue-700'
                                : 'text-[#1A2229]'
                            }`}
                          >
                            {comment.authorName}
                          </span>
                          <span className="text-xs text-[#8D8D8D]">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-[#1A2229] whitespace-pre-wrap">
                          {comment.text}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {!comment.authorName.includes('(Պատասխան)') && (
                          <button
                            onClick={() =>
                              setReplyingTo(
                                replyingTo === comment.id ? null : comment.id
                              )
                            }
                            className="px-3 py-1.5 rounded-[10px] bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium transition-colors"
                          >
                            {replyingTo === comment.id
                              ? 'Չեղարկել'
                              : 'Պատասխանել'}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(comment.id)}
                          disabled={deletingId === comment.id}
                          className="px-3 py-1.5 rounded-[10px] bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          {deletingId === comment.id ? '...' : '×'}
                        </button>
                      </div>
                    </div>

                    {replyingTo === comment.id && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Մուտքագրեք ձեր պատասխանը..."
                          rows={2}
                          className="w-full border border-gray-300 rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:border-[#FA8604] mb-2"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            className="px-3 py-1.5 rounded-[10px] border border-gray-300 text-[#1A2229] text-xs font-medium hover:bg-gray-50 transition-colors"
                          >
                            Չեղարկել
                          </button>
                          <button
                            onClick={() => handleReply(comment.id)}
                            className="px-3 py-1.5 rounded-[10px] bg-[#FA8604] hover:bg-[#FA8604]/90 text-white text-xs font-medium transition-colors"
                          >
                            Ուղարկել
                          </button>
                        </div>
                      </div>
                    )}
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
