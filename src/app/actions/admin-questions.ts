'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface QuestionWithOptions {
  id: number;
  jsonId: string;
  title: string;
  img: string | null;
  correctAnswerIndex: number;
  lessonCategoryId: number;
  options: {
    id: number;
    text: string;
    order: number;
  }[];
}

export async function getAllQuestions(): Promise<QuestionWithOptions[]> {
  try {
    const questions = await prisma.question.findMany({
      include: {
        options: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: [{ lessonCategoryId: 'asc' }, { id: 'asc' }],
    });

    return questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

export async function getQuestionById(
  id: number
): Promise<QuestionWithOptions | null> {
  try {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        options: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return question;
  } catch (error) {
    console.error('Error fetching question:', error);
    return null;
  }
}

export async function createQuestion(data: {
  jsonId?: string;
  title: string;
  img?: string;
  correctAnswerIndex: number;
  lessonCategoryId: number;
  options: { text: string; order: number }[];
}) {
  try {
    // Auto-generate jsonId if not provided
    let jsonId = data.jsonId?.trim();
    if (!jsonId) {
      // Get the count of questions in this category and generate ID
      const questionCount = await prisma.question.count({
        where: { lessonCategoryId: data.lessonCategoryId },
      });
      jsonId = `q${data.lessonCategoryId}_${questionCount + 1}`;
    }

    // Check if question with same jsonId exists in this category
    const existing = await prisma.question.findUnique({
      where: {
        lessonCategoryId_jsonId: {
          lessonCategoryId: data.lessonCategoryId,
          jsonId: jsonId,
        },
      },
    });

    if (existing) {
      return {
        success: false,
        error: 'Հարցը այս հարցաշարում արդեն գոյություն ունի',
      };
    }

    const question = await prisma.question.create({
      data: {
        jsonId: jsonId,
        title: data.title,
        img: data.img || null,
        correctAnswerIndex: data.correctAnswerIndex,
        lessonCategoryId: data.lessonCategoryId,
        options: {
          create: data.options,
        },
      },
      include: {
        options: true,
      },
    });

    revalidatePath('/admin/questions');
    return { success: true, question };
  } catch (error: any) {
    console.error('Error creating question:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}

export async function updateQuestion(
  id: number,
  data: {
    jsonId?: string;
    title?: string;
    img?: string | null;
    correctAnswerIndex?: number;
    lessonCategoryId?: number;
    options?: { id?: number; text: string; order: number }[];
  }
) {
  try {
    const question = await prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      return { success: false, error: 'Հարցը չի գտնվել' };
    }

    // Check jsonId uniqueness if it's being changed
    if (data.jsonId && data.jsonId !== question.jsonId) {
      const existing = await prisma.question.findUnique({
        where: {
          lessonCategoryId_jsonId: {
            lessonCategoryId:
              data.lessonCategoryId || question.lessonCategoryId,
            jsonId: data.jsonId,
          },
        },
      });

      if (existing) {
        return {
          success: false,
          error: 'Հարցը այս հարցաշարում արդեն գոյություն ունի',
        };
      }
    }

    // Update question
    const updateData: any = {};
    if (data.jsonId !== undefined) updateData.jsonId = data.jsonId;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.img !== undefined) updateData.img = data.img;
    if (data.correctAnswerIndex !== undefined)
      updateData.correctAnswerIndex = data.correctAnswerIndex;
    if (data.lessonCategoryId !== undefined)
      updateData.lessonCategoryId = data.lessonCategoryId;

    // Handle options update
    if (data.options) {
      // Delete existing options
      await prisma.questionOption.deleteMany({
        where: { questionId: id },
      });

      // Create new options
      updateData.options = {
        create: data.options,
      };
    }

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: updateData,
      include: {
        options: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    revalidatePath('/admin/questions');
    return { success: true, question: updatedQuestion };
  } catch (error: any) {
    console.error('Error updating question:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}

export async function deleteQuestion(id: number) {
  try {
    await prisma.question.delete({
      where: { id },
    });

    revalidatePath('/admin/questions');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting question:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}

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
      questionCount: category._count.questions,
    }));
  } catch (error) {
    console.error('Error fetching lesson categories:', error);
    return [];
  }
}
