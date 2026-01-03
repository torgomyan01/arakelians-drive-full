'use client';

import { getImageUrl } from '@/utils/image-utils';

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
}

export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  showResults = true,
}: QuestionCardProps) {
  const handleAnswerSelect = (optionIndex: number) => {
    onAnswerSelect(question.id, optionIndex);
  };

  return (
    <>
      {question.img && (
        <div className="flex-jc-c">
          <img
            src={getImageUrl(question.img)}
            alt=""
            className="rounded-[20px] mb-6"
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
    </>
  );
}
