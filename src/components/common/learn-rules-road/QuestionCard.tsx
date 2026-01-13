'use client';

import { useEffect } from 'react';
import { getImageUrl, imageLoader } from '@/utils/image-utils';
import Image from 'next/image';

interface QuestionOption {
  id: number;
  text: string;
  order: number;
}

interface Question {
  id: number;
  jsonId: string;
  title: string;
  img: string | null;
  correctAnswerIndex: number;
  options: QuestionOption[];
}

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | undefined;
  onAnswerSelect: (questionId: number, optionIndex: number) => void;
  showResults?: boolean; // If false, don't show correct/wrong indicators
  allQuestions?: Question[]; // All questions for preloading upcoming images
  isTestPage?: boolean; // If true, this is a test page (not learning page)
  testPassed?: boolean; // If true, test was passed successfully
  onNextTest?: () => void; // Callback to navigate to next test
}

export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  showResults = true,
  allQuestions = [],
  isTestPage = false,
  testPassed = false,
  onNextTest,
}: QuestionCardProps) {
  const handleAnswerSelect = (optionIndex: number) => {
    onAnswerSelect(question.id, optionIndex);
  };

  console.log(question);

  // Find current question index
  const currentIndex =
    allQuestions.length > 0
      ? allQuestions.findIndex((q) => q.id === question.id)
      : -1;

  // Get next questions to preload (next 5 questions for better coverage)
  const nextQuestions =
    currentIndex >= 0 && allQuestions.length > 0
      ? allQuestions.slice(currentIndex + 1, currentIndex + 6)
      : [];

  // Preload images using link tags in head for maximum speed
  useEffect(() => {
    const links: HTMLLinkElement[] = [];

    nextQuestions.forEach((nextQuestion) => {
      if (!nextQuestion.img) return;
      const imageUrl = getImageUrl(nextQuestion.img);
      if (!imageUrl) return;

      // Create and append preload link
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageUrl;
      link.setAttribute('fetchpriority', 'high');
      link.setAttribute('crossorigin', 'anonymous');
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
  }, [nextQuestions]);

  return (
    <>
      {/* Preload next questions' images using Next.js Image for optimization */}
      <div className="absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
        {nextQuestions.map((nextQuestion) => {
          if (!nextQuestion.img) return null;
          return (
            <Image
              key={`preload-${nextQuestion.id}`}
              src={getImageUrl(nextQuestion.img)}
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

      {/* Current question image */}
      {question.img && (
        <div className="flex-jc-c">
          <Image
            src={getImageUrl(question.img)}
            alt={question.title}
            width={644}
            height={300}
            loader={imageLoader}
            priority
            fetchPriority="high"
            className="rounded-[20px] mb-6"
            unoptimized
          />
        </div>
      )}
      <h3 className="mb-8 text-2xl font-bold text-black max-[1200px]:text-[22px] max-[767px]:text-xl max-[767px]:mb-5">
        {question.title}
      </h3>

      <div className="radio-group">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;

          // correctAnswerIndex might be 1-based (order-based) or 0-based (array index)
          // First check if any option matches by order (1-based), if not, check by index (0-based)
          const correctByOrder = question.options.find(
            (opt) => opt.order === question.correctAnswerIndex
          );
          const isCorrect = correctByOrder
            ? option.order === question.correctAnswerIndex
            : index === question.correctAnswerIndex;

          const isWrong = isSelected && !isCorrect;

          // Check if user selected a wrong answer
          const selectedOption =
            selectedAnswer !== undefined
              ? question.options[selectedAnswer]
              : null;
          const selectedIsCorrect =
            selectedOption !== null &&
            (correctByOrder
              ? selectedOption.order === question.correctAnswerIndex
              : selectedAnswer === question.correctAnswerIndex);
          const userSelectedWrong =
            selectedAnswer !== undefined && !selectedIsCorrect;

          // Show correct answer if user selected wrong answer
          const showCorrectAnswer = userSelectedWrong && isCorrect;

          let backgroundColor = '';
          let textColor = '';

          if (showResults && selectedAnswer !== undefined) {
            // Priority: 1. Correct answer selected (green), 2. Wrong answer (red), 3. Show correct answer when wrong selected (green)
            if (isCorrect && isSelected) {
              // User selected correct answer - green
              backgroundColor = '#0AB113';
              textColor = 'text-white';
            } else if (isWrong) {
              // User selected wrong answer - red
              backgroundColor = '#EB6258';
              textColor = 'text-white';
            } else if (showCorrectAnswer) {
              // Show correct answer when user selected wrong - green
              backgroundColor = '#0AB113';
              textColor = 'text-white';
            }
          }

          return (
            <label
              key={option.id}
              className={`radio-card ${
                isSelected && selectedAnswer === undefined
                  ? 'border-2 border-[#FA8604]'
                  : ''
              } transition-colors cursor-pointer ${showResults && selectedAnswer !== undefined ? 'cursor-default' : ''}`}
              style={{
                ...(backgroundColor
                  ? ({
                      backgroundColor: backgroundColor,
                      background: backgroundColor,
                      '--radio-bg-color': backgroundColor,
                    } as React.CSSProperties)
                  : {}),
              }}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={index}
                checked={isSelected}
                onChange={() => handleAnswerSelect(index)}
                disabled={showResults && selectedAnswer !== undefined}
              />
              <span className="radio-circle"></span>
              <span className={`radio-text ${textColor}`}>{option.text}</span>
              {showResults && showCorrectAnswer && (
                <span className="ml-2 text-white text-sm font-semibold">
                  ✓ Ճիշտ պատասխան
                </span>
              )}
            </label>
          );
        })}
      </div>

      {/* Show "Next Test" button only on test pages when test is passed */}
      {isTestPage && testPassed && onNextTest && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onNextTest}
            className="inline-flex items-center rounded-[30px] cursor-pointer bg-[linear-gradient(90deg,#FA8604_0%,rgba(250,134,4,0.6)_100%)] px-8 py-3 text-lg text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            <span>Անցնել հաջորդ թեստին</span>
            <img src="/images/arr-w-right.svg" alt="" className="ml-2.5" />
          </button>
        </div>
      )}
    </>
  );
}
