'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QuestionCard from '@/components/common/learn-rules-road/QuestionCard';
import { getTestById, TestQuestion } from '@/app/actions/tests';
import {
  saveTestAnswer,
  getTestAnswer,
  getTestAnswers,
  clearTestAnswers,
  startTestTimer,
  getRemainingTime,
  clearTestTimer,
} from '@/utils/testStorage';
import { SITE_URL } from '@/utils/consts';
import Image from 'next/image';

interface TestContentProps {
  testId: number;
}

export default function TestContent({ testId }: TestContentProps) {
  const router = useRouter();

  const textColorGray = 'text-[#8D8D8D]';
  const textColorDark = 'text-[#222]';
  const textColorBlack = 'text-black';
  const textColorWhite = 'text-white';
  const bgOrange = 'bg-[#FA8604]';

  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [timeRemaining, setTimeRemaining] = useState(30 * 60 * 1000); // 30 minutes in milliseconds
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResults, setTestResults] = useState<{
    total: number;
    correct: number;
  } | null>(null);

  // Initialize test timer
  useEffect(() => {
    if (isNaN(testId)) return;

    // Check if timer already exists
    const existingTimer = getRemainingTime(testId);
    if (existingTimer > 0) {
      setTimeRemaining(existingTimer);
    } else {
      // Start new timer
      startTestTimer(testId, 30);
      setTimeRemaining(30 * 60 * 1000);
    }

    // Update timer every second
    const interval = setInterval(() => {
      const remaining = getRemainingTime(testId);
      setTimeRemaining(remaining);

      if (remaining === 0 && !testCompleted) {
        handleTestComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [testId, testCompleted]);

  // Fetch test questions
  useEffect(() => {
    if (isNaN(testId)) return;

    async function fetchTest() {
      setIsLoading(true);
      try {
        const fetchedQuestions = await getTestById(testId);
        setQuestions(fetchedQuestions);

        // Load saved answers
        const savedAnswers = getTestAnswers(testId);
        const answersMap: Record<number, number> = {};
        savedAnswers.forEach((answer) => {
          answersMap[answer.questionId] = answer.selectedAnswer;
        });
        setSelectedAnswers(answersMap);

        // Check if test was already completed
        if (savedAnswers.length === fetchedQuestions.length) {
          calculateResults();
          setTestCompleted(true);
        }
      } catch (error) {
        console.error('Error fetching test:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTest();
  }, [testId]);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    if (testCompleted) return;

    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));

    // Determine if answer is correct
    const selectedOption = question.options[optionIndex];
    const correctByOrder = question.options.find(
      (opt) => opt.order === question.correctAnswerIndex
    );
    const isCorrect = correctByOrder
      ? selectedOption.order === question.correctAnswerIndex
      : optionIndex === question.correctAnswerIndex;

    // Save answer
    saveTestAnswer(testId, {
      questionId,
      selectedAnswer: optionIndex,
      isCorrect,
    });

    // Check if all questions are answered
    const updatedAnswers = { ...selectedAnswers, [questionId]: optionIndex };
    if (Object.keys(updatedAnswers).length === questions.length) {
      // All questions answered, but don't complete yet - user can still change answers
    }
  };

  const handleTestComplete = () => {
    if (testCompleted) return;

    setTestCompleted(true);
    calculateResults();
    clearTestTimer();
  };

  const calculateResults = () => {
    const answers = getTestAnswers(testId);
    const correct = answers.filter((a) => a.isCorrect).length;
    const total = questions.length;
    setTestResults({ total, correct });
  };

  const handleSubmitTest = () => {
    if (testCompleted) return;

    // Ensure all questions are answered
    if (Object.keys(selectedAnswers).length < questions.length) {
      const confirmSubmit = window.confirm(
        'Դուք դեռ չեք պատասխանել բոլոր հարցերին: Այնուամենայնիվ ցանկանու՞մ եք ավարտել թեստը:'
      );
      if (!confirmSubmit) return;
    }

    handleTestComplete();
  };

  const selectedQuestion = questions[selectedQuestionIndex];

  if (isLoading) {
    return (
      <div className="container-full pt-[100px] max-w-[1350px] w-full max-[767px]:pt-[90px]">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-[20px] mb-6" />
          <div className="h-8 bg-gray-200 rounded mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container-full pt-[100px] max-w-[1350px] w-full max-[767px]:pt-[90px]">
        <div className="text-center py-12 text-gray-500">Թեստը չի գտնվել</div>
      </div>
    );
  }

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
            <span className={`${textColorGray} text-base ml-1`}>/ </span>
          </li>
          <li>
            <a href={SITE_URL.TESTS} className={`${textColorGray} text-base`}>
              Թեստեր{' '}
            </a>
          </li>
          <li>
            <span className={`${textColorGray} text-base ml-1`}>
              / Թեստ #{testId}
            </span>
          </li>
        </ul>

        <div className="flex justify-between items-center mb-8 max-[767px]:flex-col max-[767px]:items-start max-[767px]:gap-4">
          <h1 className="global-title max-[1024px]:mb-0">Թեստ #{testId}</h1>

          {/* Timer */}
          <div
            className={`${bgOrange} text-white px-6 py-3 rounded-[20px] text-xl font-bold ${
              timeRemaining < 5 * 60 * 1000 ? 'animate-pulse' : ''
            }`}
          >
            <i className="fa-solid fa-clock mr-2"></i>
            {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Results Display */}
        {testCompleted && testResults && (
          <div className="mb-8 p-8 bg-gradient-to-r from-[#FA8604] to-[#FFA64D] rounded-[20px] text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Թեստը ավարտված է</h2>
            <div className="text-5xl font-bold">
              {testResults.correct} / {testResults.total}
            </div>
            <p className="text-xl mt-2">
              Ճիշտ պատասխաններ: {testResults.correct}
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push(SITE_URL.TESTS)}
                className="bg-white text-[#FA8604] px-8 py-3 rounded-[20px] font-bold hover:opacity-90 transition-opacity mr-4"
              >
                Վերադառնալ թեստերին
              </button>
              <button
                onClick={() => {
                  // Clear all test data
                  clearTestAnswers(testId);
                  clearTestTimer();

                  // Reset all state to initial values
                  setSelectedQuestionIndex(0);
                  setSelectedAnswers({});
                  setTestCompleted(false);
                  setTestResults(null);
                  setTimeRemaining(30 * 60 * 1000);

                  // Start new timer
                  startTestTimer(testId, 30);
                }}
                className="bg-white/20 text-white px-8 py-3 rounded-[20px] font-bold hover:bg-white/30 transition-colors border-2 border-white"
              >
                Կրկնել թեստը
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="rounded-2xl bg-white shadow-xl p-9 pr-5 max-[1200px]:p-5 max-[767px]:p-0 max-[767px]:shadow-none mb-[100px] max-[767px]:mb-8">
          {selectedQuestion ? (
            <div className="flex max-[767px]:flex-col">
              <div className="grow">
                <QuestionCard
                  question={selectedQuestion}
                  selectedAnswer={selectedAnswers[selectedQuestion.id]}
                  onAnswerSelect={(questionId, optionIndex) =>
                    handleAnswerSelect(questionId, optionIndex)
                  }
                  showResults={testCompleted}
                />

                <div className="flex justify-between items-center my-6">
                  <button
                    onClick={() => {
                      if (selectedQuestionIndex > 0) {
                        setSelectedQuestionIndex(selectedQuestionIndex - 1);
                      }
                    }}
                    disabled={selectedQuestionIndex === 0}
                    className={`flex items-center ${textColorBlack} text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                  >
                    <Image
                      src="/images/back-arr.svg"
                      width={20}
                      height={20}
                      alt=""
                      className="mr-2.5"
                    />
                    հետ
                  </button>

                  <button
                    onClick={() => {
                      if (selectedQuestionIndex < questions.length - 1) {
                        setSelectedQuestionIndex(selectedQuestionIndex + 1);
                      }
                    }}
                    disabled={selectedQuestionIndex === questions.length - 1}
                    className="inline-flex rounded-[30px] cursor-pointer bg-[linear-gradient(90deg,#FA8604_0%,rgba(250,134,4,0.6)_100%)] px-6 py-2 text-[17px] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Հաջորդ
                    <img
                      src="images/arr-w-right.svg"
                      alt=""
                      className="ml-2.5"
                    />
                  </button>
                </div>

                <div className="flex justify-center">
                  {!testCompleted && (
                    <button
                      onClick={handleSubmitTest}
                      className="inline-flex rounded-[30px] cursor-pointer bg-[linear-gradient(90deg,#FA8604_0%,rgba(250,134,4,0.6)_100%)] px-6 py-2 text-[17px] text-white hover:opacity-90 transition-opacity"
                    >
                      Ավարտել թեստը
                    </button>
                  )}
                </div>
              </div>

              {/* Questions Navigation Sidebar */}
              <div className="min-w-[312px] w-[312px] max-h-[800px] pr-2 overflow-y-auto pl-4 ml-4 border-l border-l-[#E6E6E6] max-[1200px]:min-w-[270px] max-[767px]:min-w-full max-[767px]:ml-0 max-[767px]:pl-0 max-[767px]:border-none max-[767px]:mt-6">
                {questions.map((question, index) => {
                  const isSelected = index === selectedQuestionIndex;
                  const savedAnswer = getTestAnswer(testId, question.id);
                  const isAnswered = savedAnswer !== null;

                  let bgColor = 'bg-[#ECECEC]';
                  let textColor = textColorBlack;

                  if (isSelected) {
                    bgColor = bgOrange;
                    textColor = textColorWhite;
                  } else if (isAnswered && testCompleted) {
                    if (savedAnswer.isCorrect) {
                      bgColor = 'bg-[#0AB113]';
                      textColor = textColorWhite;
                    } else {
                      bgColor = 'bg-[#EB6258]';
                      textColor = textColorWhite;
                    }
                  } else if (isAnswered) {
                    bgColor = 'bg-[#FA8604]/30';
                    textColor = textColorBlack;
                  }

                  return (
                    <div
                      key={question.id}
                      onClick={() => setSelectedQuestionIndex(index)}
                      className={`rounded-[10px] p-2.5 mb-2 max-[1200px]:text-sm ${bgColor} ${textColor} cursor-pointer hover:opacity-80 transition-opacity`}
                    >
                      {index + 1}.{' '}
                      {question.title.length > 25
                        ? `${question.title.substring(0, 25)}...`
                        : question.title}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Հարցեր չեն գտնվել
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
