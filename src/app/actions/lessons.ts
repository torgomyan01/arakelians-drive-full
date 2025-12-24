'use server';

import { prisma } from '@/lib/prisma';

export async function getLessonCategories() {
  try {
    const categories = await prisma.lessonCategory.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      questionCount: category._count.questions,
    }));
  } catch (error) {
    console.error('Error fetching lesson categories:', error);
    return [];
  }
}

export async function getQuestionsByCategory(categoryId: number) {
  try {
    const questions = await prisma.question.findMany({
      where: {
        lessonCategoryId: categoryId,
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

    return questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}
