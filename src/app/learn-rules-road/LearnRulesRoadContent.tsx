'use client';

import { useEffect, useState, useRef } from 'react';
import QuestionSetSidebar from '@/components/common/learn-rules-road/QuestionSetSidebar';
import QuestionCard from '@/components/common/learn-rules-road/QuestionCard';
import {
  getLessonCategories,
  getQuestionsByCategory,
} from '@/app/actions/lessons';
import {
  saveQuestionAnswer,
  getQuestionAnswer,
  getAnswersByCategory,
  clearQuestionAnswers,
} from '@/utils/questionStorage';
import { Tooltip } from '@heroui/tooltip';
import { SITE_URL } from '@/utils/consts';
import CommentForm from '@/components/common/learn-rules-road/CommentForm';
import Image from 'next/image';
import { getImageUrl, imageLoader } from '@/utils/image-utils';

interface LessonCategory {
  id: number;
  name: string;
  questionCount: number;
}

interface Question {
  id: number;
  jsonId: string;
  title: string;
  img: string | null;
  correctAnswerIndex: number;
  options: {
    id: number;
    text: string;
    order: number;
  }[];
}

export default function LearnRulesRoadContent() {
  // Style constants
  const textColorGray = 'text-[#8D8D8D]';
  const textColorDark = 'text-[#222]';
  const textColorBlack = 'text-black';
  const textColorWhite = 'text-white';
  const bgOrange = 'bg-[#FA8604]';
  const questionItemBase = 'rounded-[10px] p-2.5 mb-2 max-[1200px]:text-sm';
  const commentCard =
    'flex rounded-[32px_32px_32px_0] bg-white p-5 mb-5 shadow-[0_1px_6px_0_rgba(0,0,0,0.2),0_4px_6px_0_rgba(0,0,0,0.1)] max-[767px]:p-4';
  const glassEffect =
    'rounded-[50px] bg-[rgba(0,0,0,0.08)] backdrop-blur-[4px]';

  // State for lesson categories
  const [lessonCategories, setLessonCategories] = useState<LessonCategory[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  // State for selected category and questions
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  // State for selected answers: questionId -> selectedOptionIndex
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});

  // Track if categories have been fetched to prevent duplicate requests
  const categoriesFetchedRef = useRef(false);

  // Fetch lesson categories from database
  useEffect(() => {
    // Prevent duplicate fetches (especially in React Strict Mode)
    if (categoriesFetchedRef.current) return;

    async function fetchCategories() {
      try {
        categoriesFetchedRef.current = true;
        const categories = await getLessonCategories();
        setLessonCategories(categories);
        // Set first category as selected by default
        if (categories.length > 0) {
          setSelectedCategoryId(categories[0].id);
        }
      } catch (error) {
        console.error('Error fetching lesson categories:', error);
        categoriesFetchedRef.current = false; // Reset on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Track last fetched category to prevent duplicate requests
  const lastFetchedCategoryRef = useRef<number | null>(null);

  // Fetch questions when category is selected
  useEffect(() => {
    if (selectedCategoryId === null) return;

    // Prevent duplicate fetches for the same category
    if (lastFetchedCategoryRef.current === selectedCategoryId) return;

    async function fetchQuestions() {
      setIsLoadingQuestions(true);
      try {
        lastFetchedCategoryRef.current = selectedCategoryId!;
        const fetchedQuestions = await getQuestionsByCategory(
          selectedCategoryId!
        );
        setQuestions(fetchedQuestions);

        // Load saved answers from localStorage for this category
        const savedAnswers = getAnswersByCategory(selectedCategoryId!);
        const answersMap: Record<number, number> = {};
        savedAnswers.forEach((answer) => {
          answersMap[answer.questionId] = answer.selectedAnswer;
        });
        setSelectedAnswers(answersMap);

        // Set first question as selected by default
        if (fetchedQuestions.length > 0) {
          setSelectedQuestionId(fetchedQuestions[0].id);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        lastFetchedCategoryRef.current = null; // Reset on error
      } finally {
        setIsLoadingQuestions(false);
      }
    }

    fetchQuestions();
  }, [selectedCategoryId]);

  // Preload all question images using link tags for maximum speed
  useEffect(() => {
    if (questions.length === 0) return;

    const links: HTMLLinkElement[] = [];

    questions.forEach((question) => {
      if (!question.img) return;
      const imageUrl = getImageUrl(question.img);
      if (!imageUrl) return;

      // Create and append preload link
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageUrl;
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
      links.push(link);
    });

    // Cleanup function
    return () => {
      links.forEach((link) => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, [questions]);

  const sidebarItems = lessonCategories.map((category) => category.id);
  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);

  const handleResetAnswers = () => {
    // Clear localStorage
    clearQuestionAnswers();
    // Reset selected answers state
    setSelectedAnswers({});
    // Reload questions to update sidebar colors
    if (selectedCategoryId !== null) {
      const savedAnswers = getAnswersByCategory(selectedCategoryId);
      const answersMap: Record<number, number> = {};
      savedAnswers.forEach((answer) => {
        answersMap[answer.questionId] = answer.selectedAnswer;
      });
      setSelectedAnswers(answersMap);
    }
  };

  return (
    <div className="container-full pt-[100px] max-w-[1350px] w-full max-[767px]:pt-[90px]">
      <div>
        {/* Breadcrumb */}
        <ul className="flex mb-8 max-[767px]:mb-5">
          <li>
            <a href={SITE_URL.HOME} className={`${textColorGray} text-base`}>
              Գլխաոր էջ{' '}
            </a>
          </li>
          <li>
            <span className={`${textColorGray} text-base ml-1`}>
              / ՈՒսուցում{' '}
            </span>
          </li>
        </ul>

        <h1 className="global-title mb-[60px] max-[1024px]:mb-8">
          Վարորդական իրավունքի ուսուցում
        </h1>

        <div className="flex gap-8 items-start mb-[100px] max-[1200px]:gap-5 max-[1024px]:flex-col max-[767px]:gap-0 max-[767px]:mb-8">
          {isLoading ? (
            <>
              {/* Mobile Select Loading */}
              <div className="hidden max-[1024px]:block w-full mb-5 h-[55px] rounded-[10px] border border-[#222] animate-pulse bg-gray-200" />

              {/* Desktop Sidebar Loading */}
              <div className="py-5 px-4 bg-[#FA8604] flex-js-s flex-col rounded-[20px] min-w-[290px] w-[290px] max-[1200px]:w-[250px] max-[1200px]:min-w-[250px] max-[1024px]:min-w-full max-[1024px]:w-full max-[1024px]:hidden">
                <div className="animate-pulse space-y-3 w-full">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-10 bg-white/30 rounded-[30px] w-full"
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <QuestionSetSidebar
              items={sidebarItems}
              categories={lessonCategories}
              activeItem={selectedCategoryId ?? sidebarItems[0] ?? 1}
              onItemSelect={(categoryId) => setSelectedCategoryId(categoryId)}
            />
          )}

          {/* Main Content */}
          <div className="grow rounded-2xl bg-white shadow-xl p-9 pr-5 max-[1200px]:p-5 max-[767px]:p-0 max-[767px]:shadow-none">
            <div className="flex-je-c mb-4">
              <Tooltip content="Ջնջել, սկսել 0 ից">
                <button
                  onClick={handleResetAnswers}
                  className="bg-[#FA8604] text-white px-4 py-2 rounded-[10px] cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <i className="fa-solid fa-refresh"></i>
                </button>
              </Tooltip>
            </div>
            {isLoadingQuestions ? (
              <div className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-[20px] mb-6" />
                <div className="h-8 bg-gray-200 rounded mb-8" />
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
            ) : selectedQuestion ? (
              <div className="flex max-[767px]:flex-col relative">
                {/* Preload all question images using Next.js Image for optimization */}
                <div className="absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
                  {questions.map((q) => {
                    if (!q.img || q.id === selectedQuestion.id) return null;
                    return (
                      <Image
                        key={`preload-all-${q.id}`}
                        src={getImageUrl(q.img)}
                        alt=""
                        width={644}
                        height={300}
                        loader={imageLoader}
                        priority
                        fetchPriority="high"
                        unoptimized
                      />
                    );
                  })}
                </div>
                <div className="grow ">
                  <QuestionCard
                    question={selectedQuestion}
                    selectedAnswer={selectedAnswers[selectedQuestion.id]}
                    allQuestions={questions}
                    onAnswerSelect={(questionId, optionIndex) => {
                      setSelectedAnswers((prev) => ({
                        ...prev,
                        [questionId]: optionIndex,
                      }));

                      // Save answer to localStorage
                      const question = questions.find(
                        (q) => q.id === questionId
                      );
                      if (question && selectedCategoryId) {
                        // Use the same logic as QuestionCard to determine if answer is correct
                        // correctAnswerIndex might be 1-based (order-based) or 0-based (array index)
                        const selectedOption = question.options[optionIndex];
                        const correctByOrder = question.options.find(
                          (opt) => opt.order === question.correctAnswerIndex
                        );
                        const isCorrect = correctByOrder
                          ? selectedOption.order === question.correctAnswerIndex
                          : optionIndex === question.correctAnswerIndex;

                        saveQuestionAnswer({
                          questionId,
                          selectedAnswer: optionIndex,
                          isCorrect,
                          categoryId: selectedCategoryId,
                        });
                      }
                    }}
                  />

                  <div className="flex justify-between items-center my-6">
                    <button
                      onClick={() => {
                        const currentIndex = questions.findIndex(
                          (q) => q.id === selectedQuestionId
                        );
                        if (currentIndex > 0) {
                          setSelectedQuestionId(questions[currentIndex - 1].id);
                        }
                      }}
                      disabled={
                        questions.findIndex(
                          (q) => q.id === selectedQuestionId
                        ) === 0
                      }
                      className={`flex items-center ${textColorBlack} text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                    >
                      <img
                        src="images/back-arr.svg"
                        alt=""
                        className="mr-2.5"
                      />
                      հետ
                    </button>
                    <button
                      onClick={() => {
                        const currentIndex = questions.findIndex(
                          (q) => q.id === selectedQuestionId
                        );
                        if (currentIndex < questions.length - 1) {
                          setSelectedQuestionId(questions[currentIndex + 1].id);
                        }
                      }}
                      disabled={
                        questions.findIndex(
                          (q) => q.id === selectedQuestionId
                        ) ===
                        questions.length - 1
                      }
                      className="inline-flex rounded-[30px] cursor-pointer bg-[linear-gradient(90deg,#FA8604_0%,rgba(250,134,4,0.6)_100%)] px-6 py-2 text-[17px] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Հաջորդ
                      <img
                        src="/images/arr-w-right.svg"
                        alt=""
                        className="ml-2.5"
                      />
                    </button>
                  </div>
                </div>

                {/* Questions Sidebar */}
                <div className="min-w-[312px] w-[312px] max-h-[800px] pr-2 overflow-y-auto pl-4 ml-4 border-l border-l-[#E6E6E6] max-[1200px]:min-w-[270px] max-[767px]:min-w-full max-[767px]:ml-0 max-[767px]:pl-0 max-[767px]:border-none">
                  {questions.map((question) => {
                    const isSelected = question.id === selectedQuestionId;
                    const savedAnswer = getQuestionAnswer(question.id);
                    const isAnswered = savedAnswer !== null;
                    const isCorrect = savedAnswer?.isCorrect || false;

                    let bgColor = 'bg-[#ECECEC]';
                    let textColor = textColorBlack;

                    if (isSelected) {
                      bgColor = bgOrange;
                      textColor = textColorWhite;
                    } else if (isAnswered) {
                      if (isCorrect) {
                        bgColor = 'bg-[#0AB113]';
                        textColor = textColorWhite;
                      } else {
                        bgColor = 'bg-[#EB6258]';
                        textColor = textColorWhite;
                      }
                    }

                    return (
                      <div
                        key={question.id}
                        onClick={() => setSelectedQuestionId(question.id)}
                        className={`${questionItemBase} ${bgColor} ${textColor} cursor-pointer hover:opacity-80 transition-opacity`}
                      >
                        {question.title.length > 27
                          ? `${question.title.substring(0, 27)}...`
                          : question.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Ընտրեք հարցաշար հարցերը դիտելու համար
              </div>
            )}

            {/* Comment Form and Comments */}
            {selectedQuestion && (
              <CommentForm questionId={selectedQuestion.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
