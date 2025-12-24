'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface LessonCategoryWithCount {
  id: number;
  name: string;
  questionCount: number;
}

export async function getAllLessonCategories(): Promise<
  LessonCategoryWithCount[]
> {
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

export async function getLessonCategoryById(
  id: number
): Promise<LessonCategoryWithCount | null> {
  try {
    const category = await prisma.lessonCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    if (!category) return null;

    return {
      id: category.id,
      name: category.name,
      questionCount: category._count.questions,
    };
  } catch (error) {
    console.error('Error fetching lesson category:', error);
    return null;
  }
}

export async function createLessonCategory(data: { name: string }) {
  try {
    if (!data.name.trim()) {
      return {
        success: false,
        error: 'Անվանումը պարտադիր է',
      };
    }

    const category = await prisma.lessonCategory.create({
      data: {
        name: data.name.trim(),
      },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/admin/questions');
    revalidatePath('/learn-rules-road');
    return { success: true, category };
  } catch (error: any) {
    console.error('Error creating lesson category:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

export async function updateLessonCategory(id: number, data: { name: string }) {
  try {
    const category = await prisma.lessonCategory.findUnique({
      where: { id },
    });

    if (!category) {
      return { success: false, error: 'Կատեգորիան չի գտնվել' };
    }

    if (!data.name.trim()) {
      return {
        success: false,
        error: 'Անվանումը պարտադիր է',
      };
    }

    const updatedCategory = await prisma.lessonCategory.update({
      where: { id },
      data: {
        name: data.name.trim(),
      },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/admin/questions');
    revalidatePath('/learn-rules-road');
    return { success: true, category: updatedCategory };
  } catch (error: any) {
    console.error('Error updating lesson category:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

export async function deleteLessonCategory(id: number) {
  try {
    const category = await prisma.lessonCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    if (!category) {
      return { success: false, error: 'Կատեգորիան չի գտնվել' };
    }

    if (category._count.questions > 0) {
      return {
        success: false,
        error: 'Չի կարելի ջնջել կատեգորիան, քանի որ այն պարունակում է հարցեր',
      };
    }

    await prisma.lessonCategory.delete({
      where: { id },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/admin/questions');
    revalidatePath('/learn-rules-road');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting lesson category:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}
