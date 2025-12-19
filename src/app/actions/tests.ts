'use server';

import { prisma } from '@/lib/prisma';

export interface TestQuestion {
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

export interface Test {
  id: number;
  questions: TestQuestion[];
  questionCount: number;
}

/**
 * Generate a test by taking 2 random questions from each category
 * Ensures questions don't repeat across tests by tracking used question IDs
 */
export async function generateTest(testId: number): Promise<TestQuestion[]> {
  try {
    const categories = await prisma.lessonCategory.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    const allQuestions: TestQuestion[] = [];

    // Get 2 random questions from each category
    for (const category of categories) {
      const categoryQuestions = await prisma.question.findMany({
        where: {
          lessonCategoryId: category.id,
        },
        orderBy: {
          id: 'asc',
        },
        select: {
          id: true,
          jsonId: true,
          title: true,
          img: true,
          correctAnswerIndex: true,
          options: {
            orderBy: {
              order: 'asc',
            },
            select: {
              id: true,
              text: true,
              order: true,
            },
          },
        },
      });

      // Shuffle and take 2 questions
      const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 2);
      allQuestions.push(...selected);
    }

    // Shuffle all questions to mix them up
    const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);

    return shuffledQuestions;
  } catch (error) {
    console.error('Error generating test:', error);
    return [];
  }
}

/**
 * Get all available tests (we'll generate them on-demand)
 * Calculates maximum number of tests based on total questions available
 * Each test MUST have exactly 20 questions
 * All questions must be included in tests (no questions left out)
 * When a category runs out of questions, we take more from other categories
 * Similar to xdrive.am logic: tests are numbered 1, 2, 3... up to max possible
 */
export async function getAllTests(): Promise<
  { id: number; questionCount: number }[]
> {
  try {
    // Get total categories with question counts
    const categories = await prisma.lessonCategory.findMany({
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    if (categories.length === 0) {
      return [];
    }

    const questionsPerTest = 20; // Fixed: each test must have exactly 20 questions

    // Calculate total available questions
    const totalQuestions = categories.reduce(
      (sum, cat) => sum + cat._count.questions,
      0
    );

    // Calculate number of tests: ceil(totalQuestions / 20) to include all questions
    // But we prefer tests with exactly 20 questions, so we use floor for full tests
    // and add one more test if there are remaining questions
    const fullTests = Math.floor(totalQuestions / questionsPerTest);
    const remainingQuestions = totalQuestions % questionsPerTest;
    const numberOfTests = remainingQuestions > 0 ? fullTests + 1 : fullTests;

    console.log('Total questions:', totalQuestions);
    console.log('Questions per test:', questionsPerTest);
    console.log('Full tests (20 questions each):', fullTests);
    console.log('Remaining questions:', remainingQuestions);
    console.log('Total tests:', numberOfTests);

    // Generate all possible tests (1, 2, 3, ... numberOfTests)
    // Similar to xdrive.am where tests are numbered sequentially
    const tests = Array.from({ length: numberOfTests }, (_, i) => ({
      id: i + 1,
      questionCount:
        i < fullTests
          ? questionsPerTest
          : remainingQuestions || questionsPerTest, // Last test may have fewer questions
    }));

    return tests;
  } catch (error) {
    console.error('Error getting all tests:', error);
    return [];
  }
}

/**
 * Get a specific test by ID
 * Uses a deterministic approach to ensure same test ID always returns same questions
 * Ensures questions don't repeat across tests by using sequential distribution
 * Each test MUST have exactly 20 questions
 * Test 1 gets questions 0,1 from each category (if available)
 * Test 2 gets questions 2,3 from each category (if available)
 * When a category runs out, we take more questions from other categories
 */
export async function getTestById(testId: number): Promise<TestQuestion[]> {
  try {
    const categories = await prisma.lessonCategory.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    const questionsPerTest = 20; // Fixed: each test must have exactly 20 questions
    const idealQuestionsPerCategory = 2; // Ideally 2 questions per category

    // First, try to get 2 questions from each category
    const categoryQuestionsMap: Map<number, TestQuestion[]> = new Map();
    const questionsFromCategories: TestQuestion[] = [];

    for (const category of categories) {
      const categoryQuestions = await prisma.question.findMany({
        where: {
          lessonCategoryId: category.id,
        },
        orderBy: {
          id: 'asc',
        },
        select: {
          id: true,
          jsonId: true,
          title: true,
          img: true,
          correctAnswerIndex: true,
          options: {
            orderBy: {
              order: 'asc',
            },
            select: {
              id: true,
              text: true,
              order: true,
            },
          },
        },
      });

      if (categoryQuestions.length === 0) continue;

      // Calculate start index: Test 1 -> 0, Test 2 -> 2, Test 3 -> 4, etc.
      const startIndex = (testId - 1) * idealQuestionsPerCategory;

      // Get questions for this category
      if (startIndex < categoryQuestions.length) {
        const endIndex = Math.min(
          startIndex + idealQuestionsPerCategory,
          categoryQuestions.length
        );
        const selected = categoryQuestions.slice(startIndex, endIndex);
        categoryQuestionsMap.set(category.id, selected);
        questionsFromCategories.push(...selected);
      }
    }

    // Calculate how many questions we need for this test
    // Get total questions to determine if this is the last test
    const totalQuestions = await prisma.question.count();
    const fullTests = Math.floor(totalQuestions / questionsPerTest);
    const remainingQuestions = totalQuestions % questionsPerTest;
    const isLastTest = testId > fullTests;
    const questionsNeededForThisTest = isLastTest
      ? remainingQuestions || questionsPerTest
      : questionsPerTest;

    // If we have less than needed questions, we need to get more from categories that have remaining questions
    if (questionsFromCategories.length < questionsNeededForThisTest) {
      const needed =
        questionsNeededForThisTest - questionsFromCategories.length;

      // Get all remaining questions from all categories (not already used in this test)
      const remainingQuestionsList: TestQuestion[] = [];
      for (const category of categories) {
        const categoryQuestions = await prisma.question.findMany({
          where: {
            lessonCategoryId: category.id,
          },
          orderBy: {
            id: 'asc',
          },
          select: {
            id: true,
            jsonId: true,
            title: true,
            img: true,
            correctAnswerIndex: true,
            options: {
              orderBy: {
                order: 'asc',
              },
              select: {
                id: true,
                text: true,
                order: true,
              },
            },
          },
        });

        if (categoryQuestions.length === 0) continue;

        const alreadyUsed = categoryQuestionsMap.get(category.id) || [];
        const alreadyUsedIds = new Set(alreadyUsed.map((q) => q.id));

        // Get remaining questions from this category (not already used in this test)
        const remaining = categoryQuestions.filter(
          (q) => !alreadyUsedIds.has(q.id)
        );
        remainingQuestionsList.push(...remaining);
      }

      // Take needed questions from remaining questions
      const additionalQuestions = remainingQuestionsList.slice(0, needed);
      questionsFromCategories.push(...additionalQuestions);
    }

    // Trim to exactly the number of questions needed for this test
    if (questionsFromCategories.length > questionsNeededForThisTest) {
      questionsFromCategories.splice(questionsNeededForThisTest);
    }

    // Ensure we have the correct number of questions
    if (questionsFromCategories.length !== questionsNeededForThisTest) {
      console.warn(
        `Test ${testId}: Expected ${questionsNeededForThisTest} questions, got ${questionsFromCategories.length}`
      );
    }

    // Shuffle and return
    return shuffleQuestions(questionsFromCategories, testId);
  } catch (error) {
    console.error('Error getting test by ID:', error);
    return [];
  }
}

/**
 * Shuffle questions deterministically based on testId
 */
function shuffleQuestions(
  questions: TestQuestion[],
  testId: number
): TestQuestion[] {
  return questions.sort((a, b) => {
    // Use a deterministic hash based on question ID and testId
    const hashA = (a.id * testId + a.id) % 10000;
    const hashB = (b.id * testId + b.id) % 10000;
    if (hashA !== hashB) {
      return hashA - hashB;
    }
    // If hash is same, use question ID as tiebreaker
    return a.id - b.id;
  });
}
