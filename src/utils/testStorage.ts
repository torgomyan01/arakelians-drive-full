const TEST_STORAGE_KEY = 'test_answers';
const TEST_TIMER_KEY = 'test_timer';

export interface TestAnswer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  testId: number;
}

export interface TestTimer {
  testId: number;
  startTime: number;
  duration: number; // in milliseconds (30 minutes = 30 * 60 * 1000)
}

export function saveTestAnswer(
  testId: number,
  answer: Omit<TestAnswer, 'testId'>
): void {
  if (typeof window === 'undefined') return;

  try {
    const existingAnswers = getTestAnswers(testId);
    const updatedAnswers = existingAnswers.filter(
      (a) => a.questionId !== answer.questionId
    );
    updatedAnswers.push({ ...answer, testId });
    const allTests = getAllTestAnswers();
    const otherTests = allTests.filter((a) => a.testId !== testId);
    localStorage.setItem(
      TEST_STORAGE_KEY,
      JSON.stringify([...otherTests, ...updatedAnswers])
    );
  } catch (error) {
    console.error('Error saving test answer:', error);
  }
}

export function getTestAnswers(testId: number): TestAnswer[] {
  if (typeof window === 'undefined') return [];

  try {
    const allAnswers = getAllTestAnswers();
    return allAnswers.filter((a) => a.testId === testId);
  } catch (error) {
    console.error('Error reading test answers:', error);
    return [];
  }
}

function getAllTestAnswers(): TestAnswer[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(TEST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading all test answers:', error);
    return [];
  }
}

export function getTestAnswer(
  testId: number,
  questionId: number
): TestAnswer | null {
  const answers = getTestAnswers(testId);
  return answers.find((a) => a.questionId === questionId) || null;
}

export function clearTestAnswers(testId: number): void {
  if (typeof window === 'undefined') return;

  try {
    const allAnswers = getAllTestAnswers();
    const filtered = allAnswers.filter((a) => a.testId !== testId);
    localStorage.setItem(TEST_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error clearing test answers:', error);
  }
}

export function startTestTimer(
  testId: number,
  durationMinutes: number = 30
): void {
  if (typeof window === 'undefined') return;

  try {
    const timer: TestTimer = {
      testId,
      startTime: Date.now(),
      duration: durationMinutes * 60 * 1000,
    };
    localStorage.setItem(TEST_TIMER_KEY, JSON.stringify(timer));
  } catch (error) {
    console.error('Error starting test timer:', error);
  }
}

export function getTestTimer(testId: number): TestTimer | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(TEST_TIMER_KEY);
    if (!stored) return null;
    const timer: TestTimer = JSON.parse(stored);
    if (timer.testId !== testId) return null;
    return timer;
  } catch (error) {
    console.error('Error reading test timer:', error);
    return null;
  }
}

export function clearTestTimer(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TEST_TIMER_KEY);
}

export function getRemainingTime(testId: number): number {
  const timer = getTestTimer(testId);
  if (!timer) return 0;

  const elapsed = Date.now() - timer.startTime;
  const remaining = timer.duration - elapsed;
  return Math.max(0, remaining);
}

export function isTestTimeUp(testId: number): boolean {
  return getRemainingTime(testId) === 0;
}

export interface TestResult {
  testId: number;
  total: number;
  correct: number;
  isCompleted: boolean;
  isPerfect: boolean; // true if all answers are correct
}

export function getTestResult(
  testId: number,
  totalQuestions: number
): TestResult | null {
  if (typeof window === 'undefined') return null;

  try {
    const answers = getTestAnswers(testId);

    // Test is completed if we have answers for all questions
    const isCompleted = answers.length === totalQuestions && totalQuestions > 0;

    if (!isCompleted) {
      return null; // Test not completed yet
    }

    const correct = answers.filter((a) => a.isCorrect).length;
    const isPerfect = correct === totalQuestions;

    return {
      testId,
      total: totalQuestions,
      correct,
      isCompleted: true,
      isPerfect,
    };
  } catch (error) {
    console.error('Error getting test result:', error);
    return null;
  }
}
