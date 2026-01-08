'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { deleteImageFile } from '@/utils/image-delete';

export interface PsychologicalQuestionWithOptions {
  id: number;
  jsonId: string;
  title: string;
  img: string | null;
  correctAnswerIndex: number;
  isRealPsychological: boolean;
  options: {
    id: number;
    text: string;
    order: number;
  }[];
}

export async function getAllPsychologicalQuestions(): Promise<
  PsychologicalQuestionWithOptions[]
> {
  try {
    const questions = await prisma.psychologicalQuestion.findMany({
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
    console.error('Error fetching psychological questions:', error);
    return [];
  }
}

export async function getPsychologicalQuestionById(
  id: number
): Promise<PsychologicalQuestionWithOptions | null> {
  try {
    const question = await prisma.psychologicalQuestion.findUnique({
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
    console.error('Error fetching psychological question:', error);
    return null;
  }
}

export async function createPsychologicalQuestion(data: {
  jsonId?: string;
  title: string;
  img?: string;
  correctAnswerIndex: number;
  isRealPsychological: boolean;
  options: { text: string; order: number }[];
}) {
  try {
    // Auto-generate jsonId if not provided
    let jsonId = data.jsonId?.trim();
    if (!jsonId) {
      // Get the count of questions and generate ID
      const questionCount = await prisma.psychologicalQuestion.count();
      jsonId = `pq_${questionCount + 1}`;
    }

    // Check if question with same jsonId exists
    const existing = await prisma.psychologicalQuestion.findUnique({
      where: {
        jsonId: jsonId,
      },
    });

    if (existing) {
      return {
        success: false,
        error: 'Հարցը արդեն գոյություն ունի',
      };
    }

    const question = await prisma.psychologicalQuestion.create({
      data: {
        jsonId: jsonId,
        title: data.title,
        img: data.img || null,
        correctAnswerIndex: data.correctAnswerIndex,
        isRealPsychological: data.isRealPsychological,
        options: {
          create: data.options,
        },
      },
      include: {
        options: true,
      },
    });

    revalidatePath('/admin/psychological-questions');
    return { success: true, question };
  } catch (error: any) {
    console.error('Error creating psychological question:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}

export async function updatePsychologicalQuestion(
  id: number,
  data: {
    jsonId?: string;
    title?: string;
    img?: string | null;
    correctAnswerIndex?: number;
    isRealPsychological?: boolean;
    options?: { id?: number; text: string; order: number }[];
  }
) {
  try {
    const question = await prisma.psychologicalQuestion.findUnique({
      where: { id },
    });

    if (!question) {
      return { success: false, error: 'Հարցը չի գտնվել' };
    }

    // Check jsonId uniqueness if it's being changed
    if (data.jsonId && data.jsonId !== question.jsonId) {
      const existing = await prisma.psychologicalQuestion.findUnique({
        where: {
          jsonId: data.jsonId,
        },
      });

      if (existing) {
        return {
          success: false,
          error: 'Հարցը արդեն գոյություն ունի',
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
    if (data.isRealPsychological !== undefined)
      updateData.isRealPsychological = data.isRealPsychological;

    // Handle options update
    if (data.options) {
      // Delete existing options
      await prisma.psychologicalQuestionOption.deleteMany({
        where: { questionId: id },
      });

      // Create new options
      updateData.options = {
        create: data.options,
      };
    }

    const updatedQuestion = await prisma.psychologicalQuestion.update({
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

    revalidatePath('/admin/psychological-questions');
    return { success: true, question: updatedQuestion };
  } catch (error: any) {
    console.error('Error updating psychological question:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}

export async function deletePsychologicalQuestion(id: number) {
  try {
    // Get question first to check if it has an image
    const questionToDelete = await prisma.psychologicalQuestion.findUnique({
      where: { id },
      select: { img: true },
    });

    if (!questionToDelete) {
      return { success: false, error: 'Հարցը չի գտնվել' };
    }

    // Delete the image file if it exists
    if (questionToDelete.img) {
      await deleteImageFile(questionToDelete.img);
    }

    // Delete the question from database
    await prisma.psychologicalQuestion.delete({
      where: { id },
    });

    revalidatePath('/admin/psychological-questions');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting psychological question:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}
