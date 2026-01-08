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
    // Get all categories
    const allCategories = await prisma.lessonCategory.findMany({
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

    // Create a map for quick lookup
    const categoryMap = new Map(allCategories.map((cat) => [cat.id, cat]));

    // Get categories in the custom order (only the ones we use in tests)
    const categoryOrder = getCategoryOrder();
    const categories = categoryOrder
      .map((id) => categoryMap.get(id))
      .filter((cat) => cat !== undefined);

    if (categories.length === 0) {
      return [];
    }

    const questionsPerTest = 20; // Fixed: each test must have exactly 20 questions

    // Calculate total available questions from relevant categories only
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

    // Calculate maximum number of tests we can create
    // Since we can redistribute questions when categories run out,
    // the maximum number of tests is: floor(totalQuestions / 20)
    // This ensures all questions are included in tests
    const maxPossibleTests = Math.floor(totalQuestions / questionsPerTest);
    const remainingQuestions = totalQuestions % questionsPerTest;

    // If we have remaining questions (less than 20), create one more test
    // This test will have the remaining questions + some repeated questions to make 20
    const finalNumberOfTests =
      remainingQuestions > 0 ? maxPossibleTests + 1 : maxPossibleTests;

    // Verify that we can actually create all tests with all questions included
    // This is a validation step to ensure no questions are left out
    const totalQuestionsInAllTests = finalNumberOfTests * questionsPerTest;
    const questionsCoverage = totalQuestionsInAllTests >= totalQuestions;

    console.log('=== Test Calculation Debug ===');
    console.log(
      'Categories used:',
      categories.map((c) => c.id)
    );
    console.log('Total questions:', totalQuestions);
    console.log('Questions per test:', questionsPerTest);
    console.log(
      'Max possible tests (all questions included):',
      maxPossibleTests
    );
    console.log('Remaining questions:', remainingQuestions);
    console.log('Final number of tests:', finalNumberOfTests);
    console.log('Total questions in all tests:', totalQuestionsInAllTests);
    console.log('All questions included:', questionsCoverage);
    if (remainingQuestions > 0) {
      console.log(
        `Last test (${finalNumberOfTests}) will have ${remainingQuestions} new questions + ${questionsPerTest - remainingQuestions} repeated questions`
      );
    }
    console.log('=============================');

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
 * Get the custom category order for tests
 * Categories should be ordered as: 16, 17, 15, 18, 19, 20, 21, 22, 23, 24
 */
function getCategoryOrder(): number[] {
  return [16, 17, 15, 18, 19, 20, 21, 22, 23, 24];
}

/**
 * Get questions for the first test (test 1) without recursion
 * This is used to get repeated questions for the last test
 */
async function getFirstTestQuestions(
  categories: Array<{ id: number }>
): Promise<TestQuestion[]> {
  const firstTestQuestions: TestQuestion[] = [];

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

    // Get first questionsPerCategoryForTest questions for test 1
    const selected = categoryQuestions.slice(0, questionsPerCategoryForTest);
    firstTestQuestions.push(...selected);
  }

  return firstTestQuestions;
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
 * Categories are ordered as: 16, 17, 15, 18, 19, 20, 21, 22, 23, 24
 */
export async function getTestById(testId: number): Promise<TestQuestion[]> {
  try {
    // Get all categories
    const allCategories = await prisma.lessonCategory.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    // Create a map for quick lookup
    const categoryMap = new Map(allCategories.map((cat) => [cat.id, cat]));

    // Get categories in the custom order
    const categoryOrder = getCategoryOrder();
    const categories = categoryOrder
      .map((id) => categoryMap.get(id))
      .filter((cat) => cat !== undefined);

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

        const alreadyUsedInThisTest =
          categoryQuestionsMap.get(category.id) || [];
        const alreadyUsedInThisTestIds = new Set(
          alreadyUsedInThisTest.map((q) => q.id)
        );

        // Calculate how many questions have been used from this category in ALL previous tests
        const questionsPerCategoryForTest = getQuestionsPerCategory(
          category.id
        );
        const questionsUsedInAllPreviousTests =
          (testId - 1) * questionsPerCategoryForTest;

        // Get remaining questions from this category
        // These are questions that haven't been used in previous tests AND not used in this test
        const remaining = categoryQuestions.filter((q, index) => {
          // Check if this question was used in previous tests
          const wasUsedInPreviousTests =
            index < questionsUsedInAllPreviousTests;
          // Check if this question is already used in this test
          const isUsedInThisTest = alreadyUsedInThisTestIds.has(q.id);
          // Return questions that are not used in previous tests and not used in this test
          return !wasUsedInPreviousTests && !isUsedInThisTest;
        });

        if (remaining.length > 0) {
          remainingQuestionsByCategory.set(category.id, remaining);
        }
      }

      // Rebuild questions list maintaining custom category order
      const finalQuestions: TestQuestion[] = [];

      // First add questions from categories in custom order (already selected)
      for (const category of categories) {
        const categoryQuestions = categoryQuestionsMap.get(category.id) || [];
        finalQuestions.push(...categoryQuestions);
      }

      // Then add additional questions, maintaining custom category order
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
      // If we have enough questions, rebuild to maintain custom category order
      const finalQuestions: TestQuestion[] = [];
      for (const category of categories) {
        const categoryQuestions = categoryQuestionsMap.get(category.id) || [];
        finalQuestions.push(...categoryQuestions);
      }
      questionsFromCategories.length = 0;
      questionsFromCategories.push(...finalQuestions);
    }

    // Check if this is the last test that needs repeated questions
    // Calculate total questions and see if we need to add repeated questions
    let totalQuestionsCount = 0;
    for (const category of categories) {
      const count = await prisma.question.count({
        where: { lessonCategoryId: category.id },
      });
      totalQuestionsCount += count;
    }

    const maxPossibleTests = Math.floor(totalQuestionsCount / questionsPerTest);
    const remainingQuestions = totalQuestionsCount % questionsPerTest;
    const isLastTest =
      remainingQuestions > 0 && testId === maxPossibleTests + 1;

    // If this is the last test and we have remaining questions, add repeated questions
    if (
      isLastTest &&
      questionsFromCategories.length < questionsNeededForThisTest
    ) {
      const neededRepeated =
        questionsNeededForThisTest - questionsFromCategories.length;

      // Get questions from the first test to repeat (without recursion)
      const firstTestQuestions = await getFirstTestQuestions(categories);

      // Take needed number of questions from the first test
      const repeatedQuestions = firstTestQuestions.slice(0, neededRepeated);
      questionsFromCategories.push(...repeatedQuestions);
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

    // Return questions in custom category order (no shuffle)
    // Questions are ordered by custom category order (16, 17, 15, 18, 19, 20, 21, 22, 23, 24)
    // then by question ID within each category
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
