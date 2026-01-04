'use client';

import { useState, useEffect } from 'react';
import {
  createComment,
  getCommentsByQuestion,
  reportComment,
  Comment,
} from '@/app/actions/comments';
import { saveAuthorName, getAuthorName } from '@/utils/userNameStorage';
import { isArmenian, validateArmenianInput } from '@/utils/armenianValidation';
import moment from 'moment';
import 'moment/locale/hy-am';

interface CommentFormProps {
  questionId: number;
}

export default function CommentForm({ questionId }: CommentFormProps) {
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [nameWarning, setNameWarning] = useState('');
  const [commentWarning, setCommentWarning] = useState('');

  // Load saved author name from localStorage
  useEffect(() => {
    const savedName = getAuthorName();
    if (savedName) {
      setAuthorName(savedName);
    }
  }, []);

  // Load comments for this question
  useEffect(() => {
    async function loadComments() {
      const fetchedComments = await getCommentsByQuestion(questionId);
      setComments(fetchedComments);
    }
    loadComments();
  }, [questionId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Check if user is typing non-Armenian characters
    if (value.trim() && !isArmenian(value.trim())) {
      setNameWarning('Խնդրում ենք գրել միայն հայատառ');
    } else {
      setNameWarning('');
    }

    // Only allow Armenian characters
    const validated = validateArmenianInput(value);
    setAuthorName(validated);

    // Save to localStorage
    if (validated.trim()) {
      saveAuthorName(validated);
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    // Check if user is typing non-Armenian characters
    if (value.trim() && !isArmenian(value.trim())) {
      setCommentWarning('Խնդրում ենք գրել միայն հայատառ');
    } else {
      setCommentWarning('');
    }

    // Only allow Armenian characters
    const validated = validateArmenianInput(value);
    setCommentText(validated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!authorName.trim()) {
      setError('Խնդրում ենք մուտքագրել ձեր անունը');
      return;
    }

    if (!isArmenian(authorName)) {
      setError('Անունը պետք է լինի հայատառ');
      return;
    }

    if (!commentText.trim()) {
      setError('Խնդրում ենք մուտքագրել մեկնաբանություն');
      return;
    }

    if (!isArmenian(commentText)) {
      setError('Մեկնաբանությունը պետք է լինի հայատառ');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createComment(
        questionId,
        authorName.trim(),
        commentText.trim()
      );

      if (result.success) {
        // Clear comment text
        setCommentText('');
        // Reload comments
        const fetchedComments = await getCommentsByQuestion(questionId);
        setComments(fetchedComments);
      } else {
        setError('Սխալ է տեղի ունեցել: ' + (result.error || 'Անհայտ սխալ'));
      }
    } catch (err) {
      setError('Սխալ է տեղի ունեցել մեկնաբանությունը պահելիս');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    moment.locale('hy-am');
    return moment(date).fromNow();
  };

  return (
    <div className="mt-6 pt-6 border-t border-t-[#ECECEC] mb-12">
      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-[#222] mb-4">
            Քննարկումներ հարցի վերաբերյալ ({comments.length})
          </h4>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex rounded-2xl bg-white p-6 shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.12)] transition-all border border-gray-100 max-[767px]:p-4"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FA8604] to-[#FF9A3C] flex items-center justify-center shrink-0 mr-4 shadow-md">
                <span className="text-white font-bold text-lg">
                  {comment.authorName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <b className="text-xl text-[#191919] font-semibold max-[767px]:text-lg">
                    {comment.authorName}
                  </b>
                  <span className="text-sm text-[rgba(25,25,25,0.5)] max-[767px]:text-xs flex items-center gap-1">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-base text-[#191919] leading-relaxed max-[767px]:text-sm">
                  {comment.text}
                </p>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={async () => {
                      if (
                        confirm(
                          'Դուք ցանկանու՞մ եք բողոքարկել այս մեկնաբանությունը:'
                        )
                      ) {
                        const result = await reportComment(comment.id);
                        if (result.success) {
                          // Reload comments to hide reported one
                          const fetchedComments =
                            await getCommentsByQuestion(questionId);
                          setComments(fetchedComments);
                          alert(
                            'Մեկնաբանությունը բողոքարկվել է: Այն կստուգվի ադմինի կողմից:'
                          );
                        } else {
                          alert(
                            result.error || 'Սխալ է տեղի ունեցել բողոքարկելիս'
                          );
                        }
                      }
                    }}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
                    title="Բողոքարկել մեկնաբանությունը"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    Բողոքարկել
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="w-full mt-6 rounded-2xl border-2 border-[#FA8604]/30 bg-gradient-to-br from-white to-orange-50/30 shadow-[0_4px_12px_0_rgba(250,134,4,0.15)] p-6 flex flex-col max-[1024px]:max-w-full mb-8 transition-all hover:shadow-[0_6px_16px_0_rgba(250,134,4,0.2)]">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FA8604] to-[#FF9A3C] flex items-center justify-center mr-3 shadow-md">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#222]">Քննարկել հարցը</h3>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-5">
            <label
              htmlFor="author-name"
              className="block text-sm font-semibold text-[#222] mb-2.5"
            >
              Անուն <span className="text-red-500">*</span>
            </label>
            <input
              id="author-name"
              type="text"
              value={authorName}
              onChange={handleNameChange}
              placeholder="Մուտքագրեք ձեր անունը"
              className={`w-full px-5 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FA8604]/50 focus:border-[#FA8604] transition-all bg-white placeholder:text-gray-400 ${
                nameWarning
                  ? 'border-orange-400 bg-orange-50/30'
                  : 'border-[#E6E6E6]'
              }`}
              required
            />
            {nameWarning && (
              <div className="mt-2 p-3 bg-orange-50 border-l-4 border-orange-400 rounded-lg text-orange-700 text-sm flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{nameWarning}</span>
              </div>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="comment-text"
              className="block text-sm font-semibold text-[#222] mb-2.5"
            >
              Մեկնաբանություն <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment-text"
              value={commentText}
              onChange={handleCommentChange}
              placeholder="Գրեք ձեր մեկնաբանությունը..."
              rows={5}
              className={`w-full px-5 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FA8604]/50 focus:border-[#FA8604] transition-all resize-none bg-white placeholder:text-gray-400 ${
                commentWarning
                  ? 'border-orange-400 bg-orange-50/30'
                  : 'border-[#E6E6E6]'
              }`}
              required
            />
            {commentWarning && (
              <div className="mt-2 p-3 bg-orange-50 border-l-4 border-orange-400 rounded-lg text-orange-700 text-sm flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{commentWarning}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm flex items-start">
              <svg
                className="w-5 h-5 mr-2 mt-0.5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto py-3 px-8 text-white rounded-xl bg-gradient-to-r cursor-pointer from-[#FA8604] to-[#FF9A3C] mt-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 transition-all font-semibold text-base flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
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
                <span>Ուղարկվում է...</span>
              </>
            ) : (
              <>
                <span>Ուղարկել</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
