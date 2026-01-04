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
        // Only show comments that are not reported or are approved
        OR: [
          { isReported: false } as any,
          { isReported: true, isApproved: true } as any,
        ],
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

export async function reportComment(
  commentId: number,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if comment exists
    const comment = await prisma.questionComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return { success: false, error: 'Comment not found' };
    }

    // Create report
    await (prisma as any).commentReport.create({
      data: {
        commentId,
        reason: reason || null,
      },
    });

    // Mark comment as reported
    await prisma.questionComment.update({
      where: { id: commentId },
      data: {
        isReported: true,
        isApproved: false, // Hide until admin approves
      } as any,
    });

    return { success: true };
  } catch (error) {
    console.error('Error reporting comment:', error);
    return { success: false, error: 'Failed to report comment' };
  }
}
