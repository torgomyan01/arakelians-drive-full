'use server';

import { prisma } from '@/lib/prisma';

export interface Comment {
  id: number;
  questionId: number;
  authorName: string;
  text: string;
  createdAt: Date;
}

export async function createComment(
  questionId: number,
  authorName: string,
  text: string
) {
  try {
    const comment = await prisma.questionComment.create({
      data: {
        questionId,
        authorName: authorName.trim(),
        text: text.trim(),
      },
    });

    return { success: true, comment };
  } catch (error) {
    console.error('Error creating comment:', error);
    return { success: false, error: 'Failed to create comment' };
  }
}

export async function getCommentsByQuestion(
  questionId: number
): Promise<Comment[]> {
  try {
    const comments = await prisma.questionComment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        questionId: true,
        authorName: true,
        text: true,
        createdAt: true,
      },
    });

    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}
