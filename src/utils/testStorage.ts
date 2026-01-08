const TEST_STORAGE_KEY = 'test_answers';
const TEST_TIMER_KEY = 'test_timer';
const TEST_SCREENING_KEY = 'test_screening';
const TEST_SCREENING_QUESTIONS_KEY = 'test_screening_questions';

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

// Pre-test screening storage functions
export interface ScreeningAnswer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  testId: number;
}

export function saveScreeningAnswer(
  testId: number,
  answer: Omit<ScreeningAnswer, 'testId'>
): void {
  if (typeof window === 'undefined') return;

  try {
    const existingAnswers = getScreeningAnswers(testId);
    const updatedAnswers = existingAnswers.filter(
      (a) => a.questionId !== answer.questionId
    );
    updatedAnswers.push({ ...answer, testId });
    const allScreenings = getAllScreeningAnswers();
    const otherScreenings = allScreenings.filter((a) => a.testId !== testId);
    localStorage.setItem(
      TEST_SCREENING_KEY,
      JSON.stringify([...otherScreenings, ...updatedAnswers])
    );
  } catch (error) {
    console.error('Error saving screening answer:', error);
  }
}

export function getScreeningAnswers(testId: number): ScreeningAnswer[] {
  if (typeof window === 'undefined') return [];

  try {
    const allAnswers = getAllScreeningAnswers();
    return allAnswers.filter((a) => a.testId === testId);
  } catch (error) {
    console.error('Error reading screening answers:', error);
    return [];
  }
}

function getAllScreeningAnswers(): ScreeningAnswer[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(TEST_SCREENING_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading all screening answers:', error);
    return [];
  }
}

export function getScreeningAnswer(
  testId: number,
  questionId: number
): ScreeningAnswer | null {
  const answers = getScreeningAnswers(testId);
  return answers.find((a) => a.questionId === questionId) || null;
}

export function clearScreeningAnswers(testId: number): void {
  if (typeof window === 'undefined') return;

  try {
    const allAnswers = getAllScreeningAnswers();
    const filtered = allAnswers.filter((a) => a.testId !== testId);
    localStorage.setItem(TEST_SCREENING_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error clearing screening answers:', error);
  }
}

export function isScreeningPassed(testId: number): boolean {
  const answers = getScreeningAnswers(testId);
  if (answers.length !== 3) return false;
  return answers.every((a) => a.isCorrect);
}

// Store and retrieve screening question IDs to ensure same questions are shown until screening is passed
export function saveScreeningQuestionIds(
  testId: number,
  questionIds: number[]
): void {
  if (typeof window === 'undefined') return;

  try {
    const allScreenings = getAllScreeningQuestionIds();
    const otherScreenings = allScreenings.filter((s) => s.testId !== testId);
    localStorage.setItem(
      TEST_SCREENING_QUESTIONS_KEY,
      JSON.stringify([...otherScreenings, { testId, questionIds }])
    );
  } catch (error) {
    console.error('Error saving screening question IDs:', error);
  }
}

export function getScreeningQuestionIds(testId: number): number[] | null {
  if (typeof window === 'undefined') return null;

  try {
    const allScreenings = getAllScreeningQuestionIds();
    const screening = allScreenings.find((s) => s.testId === testId);
    return screening ? screening.questionIds : null;
  } catch (error) {
    console.error('Error reading screening question IDs:', error);
    return null;
  }
}

function getAllScreeningQuestionIds(): Array<{
  testId: number;
  questionIds: number[];
}> {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(TEST_SCREENING_QUESTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading all screening question IDs:', error);
    return [];
  }
}

export function clearScreeningQuestionIds(testId: number): void {
  if (typeof window === 'undefined') return;

  try {
    const allScreenings = getAllScreeningQuestionIds();
    const filtered = allScreenings.filter((s) => s.testId !== testId);
    localStorage.setItem(
      TEST_SCREENING_QUESTIONS_KEY,
      JSON.stringify(filtered)
    );
  } catch (error) {
    console.error('Error clearing screening question IDs:', error);
  }
}
