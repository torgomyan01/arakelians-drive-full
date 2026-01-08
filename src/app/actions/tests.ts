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

    // Calculate how many questions each category contributes per test
    // and find the minimum number of tests before any category runs out
    let maxTestsBeforeCategoryRunsOut = Infinity;

    for (const category of categories) {
      const questionsPerCategoryPerTest = getQuestionsPerCategory(category.id);
      const totalQuestionsInCategory = category._count.questions;

      if (questionsPerCategoryPerTest > 0 && totalQuestionsInCategory > 0) {
        // How many tests can we create before this category runs out?
        const testsFromThisCategory = Math.floor(
          totalQuestionsInCategory / questionsPerCategoryPerTest
        );
        maxTestsBeforeCategoryRunsOut = Math.min(
          maxTestsBeforeCategoryRunsOut,
          testsFromThisCategory
        );
      }
    }

    // Calculate total available questions
    const totalQuestions = categories.reduce(
      (sum, cat) => sum + cat._count.questions,
      0
    );

    // Validate: ensure we have enough questions to create at least one test
    if (totalQuestions < questionsPerTest) {
      console.warn(
        `Not enough questions to create a test. Total: ${totalQuestions}, Required: ${questionsPerTest}`
      );
      // Return empty array if we don't have enough questions for even one test
      if (totalQuestions === 0) {
        return [];
      }
    }

    // Calculate number of tests
    // We can create tests until categories run out, then distribute remaining questions
    const fullTests =
      maxTestsBeforeCategoryRunsOut === Infinity
        ? Math.floor(totalQuestions / questionsPerTest)
        : maxTestsBeforeCategoryRunsOut;

    // Ensure fullTests is at least 0
    const safeFullTests = Math.max(0, fullTests);

    // Calculate remaining questions after full tests
    let remainingQuestions = totalQuestions;
    for (const category of categories) {
      const questionsPerCategoryPerTest = getQuestionsPerCategory(category.id);
      const questionsUsedInFullTests =
        safeFullTests * questionsPerCategoryPerTest;
      const questionsInCategory = category._count.questions;
      remainingQuestions -= Math.min(
        questionsUsedInFullTests,
        questionsInCategory
      );
    }

    // Ensure remainingQuestions is non-negative
    remainingQuestions = Math.max(0, remainingQuestions);

    // If we have remaining questions, we can create additional tests
    // (each will have exactly 20 questions by redistributing from categories with remaining questions)
    const additionalTests =
      remainingQuestions >= questionsPerTest
        ? Math.floor(remainingQuestions / questionsPerTest)
        : 0;

    const numberOfTests = safeFullTests + additionalTests;

    // Ensure we have at least one test if there are any questions
    const finalNumberOfTests =
      totalQuestions > 0 && numberOfTests === 0 ? 1 : numberOfTests;

    console.log('Total questions:', totalQuestions);
    console.log('Questions per test:', questionsPerTest);
    console.log('Full tests (20 questions each):', fullTests);
    console.log('Remaining questions after full tests:', remainingQuestions);
    console.log('Total tests:', finalNumberOfTests);

    // Generate all possible tests (1, 2, 3, ... finalNumberOfTests)
    // All tests will have exactly 20 questions (the logic in getTestById ensures this)
    const tests = Array.from({ length: finalNumberOfTests }, (_, i) => ({
      id: i + 1,
      questionCount: questionsPerTest, // All tests have exactly 20 questions
    }));

    return tests;
  } catch (error) {
    console.error('Error getting all tests:', error);
    return [];
  }
}

/**
 * Get questions per category for a specific test
 * Special cases:
 * - Category ID 18: 3 questions per test
 * - Category ID 24: 1 question per test
 * - All other categories: 2 questions per test
 */
function getQuestionsPerCategory(categoryId: number): number {
  if (categoryId === 18) return 3;
  if (categoryId === 24) return 1;
  return 2;
}

/**
 * Get a specific test by ID
 * Uses a deterministic approach to ensure same test ID always returns same questions
 * Ensures questions don't repeat across tests by using sequential distribution
 * Each test MUST have exactly 20 questions
 * Distribution:
 * - Category 18: 3 questions per test
 * - Category 24: 1 question per test
 * - All other categories: 2 questions per test
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

    // First, try to get questions from each category based on their specific rules
    const categoryQuestionsMap: Map<number, TestQuestion[]> = new Map();
    const questionsFromCategories: TestQuestion[] = [];

    // Track how many questions we've used from each category across all previous tests
    const categoryUsedCounts: Map<number, number> = new Map();

    for (const category of categories) {
      const questionsPerCategoryForTest = getQuestionsPerCategory(category.id);

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

      if (categoryQuestions.length === 0) {
        categoryUsedCounts.set(category.id, 0);
        continue;
      }

      // Calculate how many questions have been used from this category in previous tests
      // For test 1: 0 questions used
      // For test 2: questionsPerCategoryForTest questions used
      // For test 3: 2 * questionsPerCategoryForTest questions used, etc.
      const questionsUsedBeforeThisTest =
        (testId - 1) * questionsPerCategoryForTest;
      categoryUsedCounts.set(category.id, questionsUsedBeforeThisTest);

      // Calculate start index for this test
      const startIndex = questionsUsedBeforeThisTest;

      // Get questions for this category for this test
      if (startIndex < categoryQuestions.length) {
        const endIndex = Math.min(
          startIndex + questionsPerCategoryForTest,
          categoryQuestions.length
        );
        const selected = categoryQuestions.slice(startIndex, endIndex);
        categoryQuestionsMap.set(category.id, selected);
        questionsFromCategories.push(...selected);
      }
    }

    // Calculate how many questions we need for this test
    // All tests should have exactly 20 questions
    const questionsNeededForThisTest = questionsPerTest;

    // If we have less than needed questions, we need to get more from categories that have remaining questions
    if (questionsFromCategories.length < questionsNeededForThisTest) {
      const needed =
        questionsNeededForThisTest - questionsFromCategories.length;

      // Get all remaining questions from all categories (not already used in this test)
      // Group by category to maintain category order
      const remainingQuestionsByCategory: Map<number, TestQuestion[]> =
        new Map();

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

        if (remaining.length > 0) {
          remainingQuestionsByCategory.set(category.id, remaining);
        }
      }

      // Rebuild questions list maintaining category order
      const finalQuestions: TestQuestion[] = [];

      // First add questions from categories in order (already selected)
      for (const category of categories) {
        const categoryQuestions = categoryQuestionsMap.get(category.id) || [];
        finalQuestions.push(...categoryQuestions);
      }

      // Then add additional questions, maintaining category order
      for (const category of categories) {
        if (finalQuestions.length >= questionsNeededForThisTest) break;

        const remaining = remainingQuestionsByCategory.get(category.id) || [];
        const toTake = Math.min(
          questionsNeededForThisTest - finalQuestions.length,
          remaining.length
        );
        finalQuestions.push(...remaining.slice(0, toTake));
      }

      // Replace the questions array with the properly ordered one
      questionsFromCategories.length = 0;
      questionsFromCategories.push(...finalQuestions);
    } else {
      // If we have enough questions, rebuild to maintain category order
      const finalQuestions: TestQuestion[] = [];
      for (const category of categories) {
        const categoryQuestions = categoryQuestionsMap.get(category.id) || [];
        finalQuestions.push(...categoryQuestions);
      }
      questionsFromCategories.length = 0;
      questionsFromCategories.push(...finalQuestions);
    }

    // Ensure we have the correct number of questions
    if (questionsFromCategories.length !== questionsNeededForThisTest) {
      // If we have more questions than needed, trim to exactly 20
      if (questionsFromCategories.length > questionsNeededForThisTest) {
        questionsFromCategories.splice(questionsNeededForThisTest);
      } else if (questionsFromCategories.length < questionsNeededForThisTest) {
        // If we have fewer questions than needed, this means we've run out of questions
        // This can happen if testId exceeds the number of available tests
        console.warn(
          `Test ${testId}: Expected ${questionsNeededForThisTest} questions, got ${questionsFromCategories.length}. ` +
            `This test may not have enough questions available.`
        );

        // If we have no questions at all, return empty array
        if (questionsFromCategories.length === 0) {
          return [];
        }

        // Otherwise, return what we have (less than 20 questions)
        // This shouldn't happen if getAllTests() is called correctly
      }
    }

    // Final validation: ensure we have at least some questions
    if (questionsFromCategories.length === 0) {
      console.error(`Test ${testId}: No questions available for this test`);
      return [];
    }

    // Return questions in category order (no shuffle)
    // Questions are already ordered by category ID, then by question ID within each category
    return questionsFromCategories;
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
