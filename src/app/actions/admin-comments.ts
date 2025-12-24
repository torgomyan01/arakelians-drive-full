'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface CommentWithQuestion {
  id: number;
  questionId: number;
  authorName: string;
  text: string;
  createdAt: Date;
  question: {
    id: number;
    jsonId: string;
    title: string;
    img: string | null;
    lessonCategoryId: number;
    lessonCategory: {
      id: number;
      name: string;
    };
  };
}

export async function getAllComments(): Promise<CommentWithQuestion[]> {
  try {
    const comments = await prisma.questionComment.findMany({
      include: {
        question: {
          select: {
            id: true,
            jsonId: true,
            title: true,
            img: true,
            lessonCategoryId: true,
            lessonCategory: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function deleteComment(id: number) {
  try {
    await prisma.questionComment.delete({
      where: { id },
    });

    revalidatePath('/admin/comments');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}

export async function replyToComment(
  commentId: number,
  replyText: string,
  adminName: string = 'Ադմին'
) {
  try {
    // Get the original comment to find the question
    const originalComment = await prisma.questionComment.findUnique({
      where: { id: commentId },
      include: {
        question: true,
      },
    });

    if (!originalComment) {
      return { success: false, error: 'Մեկնաբանությունը չի գտնվել' };
    }

    // Create reply as a new comment with admin prefix
    const reply = await prisma.questionComment.create({
      data: {
        questionId: originalComment.questionId,
        authorName: `${adminName} (Պատասխան)`,
        text: `@${originalComment.authorName}: ${replyText}`,
      },
    });

    revalidatePath('/admin/comments');
    return { success: true, reply };
  } catch (error: any) {
    console.error('Error replying to comment:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}
