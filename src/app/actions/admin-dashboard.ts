'use server';

import { prisma } from '@/lib/prisma';

export interface DashboardStats {
  usersCount: number;
  questionsCount: number;
  commentsCount: number;
  registrationsCount: number;
  contactsCount: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      usersCount,
      questionsCount,
      commentsCount,
      registrationsCount,
      contactsCount,
    ] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.question.count().catch(() => 0),
      prisma.questionComment.count().catch(() => 0),
      prisma.registration.count().catch(() => 0),
      prisma.contact.count().catch(() => 0),
    ]);

    return {
      usersCount,
      questionsCount,
      commentsCount,
      registrationsCount,
      contactsCount,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      usersCount: 0,
      questionsCount: 0,
      commentsCount: 0,
      registrationsCount: 0,
      contactsCount: 0,
    };
  }
}
