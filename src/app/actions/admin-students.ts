'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export interface StudentWithStats {
  id: number;
  name: string | null;
  photo: string | null;
  examResult: string | null;
  uniqueToken: string;
  review: string | null;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function generateUniqueToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function getAllStudents(): Promise<StudentWithStats[]> {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return students;
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}

export async function getApprovedStudents(): Promise<StudentWithStats[]> {
  try {
    const students = await prisma.student.findMany({
      where: {
        isApproved: true,
        name: {
          not: null,
        },
        examResult: {
          not: null,
        },
        review: {
          not: null,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return students;
  } catch (error) {
    console.error('Error fetching approved students:', error);
    return [];
  }
}

export async function getStudentById(
  id: number
): Promise<StudentWithStats | null> {
  try {
    const student = await prisma.student.findUnique({
      where: { id },
    });

    return student;
  } catch (error) {
    console.error('Error fetching student:', error);
    return null;
  }
}

export async function getStudentByToken(
  token: string
): Promise<StudentWithStats | null> {
  try {
    const student = await prisma.student.findUnique({
      where: { uniqueToken: token },
    });

    return student;
  } catch (error) {
    console.error('Error fetching student by token:', error);
    return null;
  }
}

export async function createStudent() {
  try {
    // Generate unique token
    let uniqueToken = generateUniqueToken();
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure token is unique
    while (attempts < maxAttempts) {
      const existing = await prisma.student.findUnique({
        where: { uniqueToken },
      });

      if (!existing) {
        break;
      }

      uniqueToken = generateUniqueToken();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return {
        success: false,
        error: 'Չհաջողվեց ստեղծել ունիկալ հղում',
      };
    }

    const student = await prisma.student.create({
      data: {
        uniqueToken,
      },
    });

    revalidatePath('/admin/students');
    return { success: true, student };
  } catch (error: any) {
    console.error('Error creating student:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}

export async function updateStudent(
  id: number,
  data: {
    name?: string;
    photo?: string | null;
    examResult?: string;
    review?: string | null;
    isApproved?: boolean;
  }
) {
  try {
    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return { success: false, error: 'Աշակերտը չի գտնվել' };
    }

    const updatedStudent = await prisma.student.update({
      where: { id },
      data,
    });

    revalidatePath('/admin/students');
    revalidatePath(`/student/${student.uniqueToken}`);
    return { success: true, student: updatedStudent };
  } catch (error: any) {
    console.error('Error updating student:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}

export async function updateStudentInfo(
  token: string,
  data: {
    name?: string | null;
    photo?: string | null;
    examResult?: string | null;
    review?: string | null;
  }
) {
  try {
    const student = await prisma.student.findUnique({
      where: { uniqueToken: token },
    });

    if (!student) {
      return { success: false, error: 'Աշակերտը չի գտնվել' };
    }

    const updatedStudent = await prisma.student.update({
      where: { uniqueToken: token },
      data,
    });

    revalidatePath(`/student/${token}`);
    revalidatePath('/admin/students');
    return { success: true, student: updatedStudent };
  } catch (error: any) {
    console.error('Error updating student info:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}

export async function updateStudentReview(token: string, review: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { uniqueToken: token },
    });

    if (!student) {
      return { success: false, error: 'Աշակերտը չի գտնվել' };
    }

    const updatedStudent = await prisma.student.update({
      where: { uniqueToken: token },
      data: { review },
    });

    revalidatePath(`/student/${token}`);
    return { success: true, student: updatedStudent };
  } catch (error: any) {
    console.error('Error updating student review:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}

export async function deleteStudent(id: number) {
  try {
    await prisma.student.delete({
      where: { id },
    });

    revalidatePath('/admin/students');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting student:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}
