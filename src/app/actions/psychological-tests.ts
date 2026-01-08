'use server';

import { prisma } from '@/lib/prisma';

export interface PsychologicalQuestion {
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

/**
 * Get all educational psychological questions (isRealPsychological = false)
 */
export async function getEducationalPsychologicalQuestions(): Promise<
  PsychologicalQuestion[]
> {
  try {
    const questions = await prisma.psychologicalQuestion.findMany({
      where: {
        isRealPsychological: false, // Only educational questions
      },
      include: {
        options: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    return questions;
  } catch (error) {
    console.error('Error fetching educational psychological questions:', error);
    return [];
  }
}

/**
 * Get real psychological questions by IDs
 */
export async function getRealPsychologicalQuestionsByIds(
  questionIds: number[]
): Promise<PsychologicalQuestion[]> {
  try {
    const questions = await prisma.psychologicalQuestion.findMany({
      where: {
        id: { in: questionIds },
        isRealPsychological: true,
      },
      include: {
        options: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    // Sort by the order of IDs in questionIds array and filter out undefined
    const result: PsychologicalQuestion[] = [];
    for (const id of questionIds) {
      const question = questions.find((q) => q.id === id);
      if (question) {
        result.push(question);
      }
    }
    return result;
  } catch (error) {
    console.error('Error fetching real psychological questions by IDs:', error);
    return [];
  }
}

/**
 * Get 3 random real psychological questions for pre-test screening (isRealPsychological = true)
 * Returns different questions each time
 */
export async function getRealPsychologicalQuestions(): Promise<
  PsychologicalQuestion[]
> {
  try {
    // Get all real psychological questions
    const allQuestions = await prisma.psychologicalQuestion.findMany({
      where: {
        isRealPsychological: true, // Only real psychological questions
      },
      include: {
        options: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    // If we have less than 3 questions, return all
    if (allQuestions.length <= 3) {
      return allQuestions;
    }

    // Shuffle array randomly using Fisher-Yates algorithm
    const shuffled = [...allQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Return first 3 questions
    return shuffled.slice(0, 3);
  } catch (error) {
    console.error('Error fetching real psychological questions:', error);
    return [];
  }
}
