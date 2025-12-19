const STORAGE_KEY = 'question_answers';

export interface QuestionAnswer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  categoryId: number;
}

export function saveQuestionAnswer(answer: QuestionAnswer): void {
  if (typeof window === 'undefined') return;

  try {
    const existingAnswers = getQuestionAnswers();
    const updatedAnswers = existingAnswers.filter(
      (a) => a.questionId !== answer.questionId
    );
    updatedAnswers.push(answer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAnswers));
  } catch (error) {
    console.error('Error saving question answer:', error);
  }
}

export function getQuestionAnswers(): QuestionAnswer[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading question answers:', error);
    return [];
  }
}

export function getQuestionAnswer(questionId: number): QuestionAnswer | null {
  const answers = getQuestionAnswers();
  return answers.find((a) => a.questionId === questionId) || null;
}

export function getAnswersByCategory(categoryId: number): QuestionAnswer[] {
  const answers = getQuestionAnswers();
  return answers.filter((a) => a.categoryId === categoryId);
}

export function clearQuestionAnswers(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
