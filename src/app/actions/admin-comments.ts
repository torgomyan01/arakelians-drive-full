'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface CommentWithQuestion {
  id: number;
  questionId: number;
  authorName: string;
  text: string;
  isReported: boolean;
  isApproved: boolean;
  createdAt: Date;
  reports?: {
    id: number;
    reason: string | null;
    createdAt: Date;
  }[];
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
        reports: {
          orderBy: {
            createdAt: 'desc',
          },
        } as any,
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

    return comments.map((comment: any) => ({
      id: comment.id,
      questionId: comment.questionId,
      authorName: comment.authorName,
      text: comment.text,
      isReported: comment.isReported || false,
      isApproved: comment.isApproved !== undefined ? comment.isApproved : true,
      createdAt: comment.createdAt,
      reports: comment.reports || [],
      question: comment.question,
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function getReportedCommentsCount(): Promise<number> {
  try {
    const count = await prisma.questionComment.count({
      where: {
        isReported: true,
        isApproved: false,
      } as any,
    });
    return count;
  } catch (error) {
    console.error('Error fetching reported comments count:', error);
    return 0;
  }
}

export async function getReportedComments(): Promise<CommentWithQuestion[]> {
  try {
    const comments = await prisma.questionComment.findMany({
      where: {
        isReported: true,
        isApproved: false,
      } as any,
      include: {
        reports: {
          orderBy: {
            createdAt: 'desc',
          },
        } as any,
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
      } as any,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments.map((comment: any) => ({
      id: comment.id,
      questionId: comment.questionId,
      authorName: comment.authorName,
      text: comment.text,
      isReported: comment.isReported || false,
      isApproved: comment.isApproved !== undefined ? comment.isApproved : true,
      createdAt: comment.createdAt,
      reports: comment.reports || [],
      question: comment.question,
    }));
  } catch (error) {
    console.error('Error fetching reported comments:', error);
    return [];
  }
}

export async function approveComment(id: number) {
  try {
    await prisma.questionComment.update({
      where: { id },
      data: {
        isApproved: true,
        isReported: false,
      } as any,
    });

    revalidatePath('/admin/comments');
    revalidatePath('/admin/reported-comments');
    return { success: true };
  } catch (error: any) {
    console.error('Error approving comment:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}

export async function rejectComment(id: number) {
  try {
    await prisma.questionComment.delete({
      where: { id },
    });

    revalidatePath('/admin/comments');
    revalidatePath('/admin/reported-comments');
    return { success: true };
  } catch (error: any) {
    console.error('Error rejecting comment:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
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
