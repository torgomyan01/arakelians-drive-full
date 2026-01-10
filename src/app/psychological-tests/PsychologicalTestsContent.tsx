'use client';

import { useEffect, useState, useRef } from 'react';
import QuestionCard from '@/components/common/learn-rules-road/QuestionCard';
import { getEducationalPsychologicalQuestions } from '@/app/actions/psychological-tests';
import {
  saveQuestionAnswer,
  getQuestionAnswer,
  clearQuestionAnswers,
} from '@/utils/questionStorage';
import { Tooltip } from '@heroui/tooltip';
import { SITE_URL } from '@/utils/consts';

interface PsychologicalQuestion {
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

export default function PsychologicalTestsContent() {
  // Style constants
  const textColorGray = 'text-[#8D8D8D]';
  const textColorDark = 'text-[#222]';
  const textColorBlack = 'text-black';
  const textColorWhite = 'text-white';
  const bgOrange = 'bg-[#FA8604]';
  const questionItemBase = 'rounded-[10px] p-2.5 mb-2 max-[1200px]:text-sm';

  // State for questions
  const [questions, setQuestions] = useState<PsychologicalQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  // State for selected answers: questionId -> selectedOptionIndex
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});

  // Track if questions have been fetched to prevent duplicate requests
  const questionsFetchedRef = useRef(false);

  // Fetch educational psychological questions
  useEffect(() => {
    // Prevent duplicate fetches (especially in React Strict Mode)
    if (questionsFetchedRef.current) return;

    async function fetchQuestions() {
      try {
        questionsFetchedRef.current = true;
        const fetchedQuestions = await getEducationalPsychologicalQuestions();
        setQuestions(fetchedQuestions);

        // Load saved answers from localStorage
        const answersMap: Record<number, number> = {};
        fetchedQuestions.forEach((question) => {
          const savedAnswer = getQuestionAnswer(question.id);
          if (savedAnswer !== null) {
            answersMap[question.id] = savedAnswer.selectedAnswer;
          }
        });
        setSelectedAnswers(answersMap);

        // Set first question as selected by default
        if (fetchedQuestions.length > 0) {
          setSelectedQuestionId(fetchedQuestions[0].id);
        }
      } catch (error) {
        console.error('Error fetching psychological questions:', error);
        questionsFetchedRef.current = false; // Reset on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);

  const handleResetAnswers = () => {
    // Clear localStorage
    clearQuestionAnswers();
    // Reset selected answers state
    setSelectedAnswers({});
    // Reload answers
    const answersMap: Record<number, number> = {};
    questions.forEach((question) => {
      const savedAnswer = getQuestionAnswer(question.id);
      if (savedAnswer !== null) {
        answersMap[question.id] = savedAnswer.selectedAnswer;
      }
    });
    setSelectedAnswers(answersMap);
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
              / Հոգեբանական Թեստեր{' '}
            </span>
          </li>
        </ul>

        <h1 className="global-title mb-[60px] max-[1024px]:mb-8">
          Հոգեբանական Թեստեր
        </h1>

        {/* Main Content */}
        <div className="rounded-2xl bg-white shadow-xl p-9 pr-5 max-[1200px]:p-5 max-[767px]:p-0 max-[767px]:shadow-none">
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
          {isLoading ? (
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
            <div className="flex max-[767px]:flex-col">
              <div className="grow">
                <QuestionCard
                  question={selectedQuestion}
                  selectedAnswer={selectedAnswers[selectedQuestion.id]}
                  onAnswerSelect={(questionId, optionIndex) => {
                    setSelectedAnswers((prev) => ({
                      ...prev,
                      [questionId]: optionIndex,
                    }));

                    // Save answer to localStorage
                    const question = questions.find((q) => q.id === questionId);
                    if (question) {
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
                        categoryId: 0, // Use 0 for psychological questions
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
                    <img src="images/back-arr.svg" alt="" className="mr-2.5" />
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
          ) : questions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Հոգեբանական թեստեր չեն գտնվել
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Ընտրեք հարց դիտելու համար
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
