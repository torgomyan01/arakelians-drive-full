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
