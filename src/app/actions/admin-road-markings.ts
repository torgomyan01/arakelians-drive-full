'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { deleteImageFile } from '@/utils/image-delete';
import type { RoadMarkingCategory } from '@/utils/road-markings-utils';

export interface RoadMarking {
  id: number;
  number: string;
  name: string;
  description: string;
  category: RoadMarkingCategory;
  image: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllRoadMarkings(): Promise<RoadMarking[]> {
  try {
    const markings = await prisma.roadMarking.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { number: 'asc' }],
    });

    return markings.map((marking) => ({
      ...marking,
      category: marking.category as RoadMarkingCategory,
    }));
  } catch (error) {
    console.error('Error fetching road markings:', error);
    return [];
  }
}

export async function getRoadMarkingById(
  id: number
): Promise<RoadMarking | null> {
  try {
    const marking = await prisma.roadMarking.findUnique({
      where: { id },
    });

    if (!marking) return null;

    return {
      ...marking,
      category: marking.category as RoadMarkingCategory,
    };
  } catch (error) {
    console.error('Error fetching road marking:', error);
    return null;
  }
}

export async function getRoadMarkingsByCategory(
  category: RoadMarkingCategory
): Promise<RoadMarking[]> {
  try {
    const markings = await prisma.roadMarking.findMany({
      where: { category },
      orderBy: [{ order: 'asc' }, { number: 'asc' }],
    });

    return markings.map((marking) => ({
      ...marking,
      category: marking.category as RoadMarkingCategory,
    }));
  } catch (error) {
    console.error('Error fetching road markings by category:', error);
    return [];
  }
}

export async function createRoadMarking(data: {
  number: string;
  name: string;
  description: string;
  category: RoadMarkingCategory;
  image?: string | null;
  order?: number;
}): Promise<{ success: boolean; error?: string; marking?: RoadMarking }> {
  try {
    const marking = await prisma.roadMarking.create({
      data: {
        number: data.number,
        name: data.name,
        description: data.description,
        category: data.category,
        image: data.image || null,
        order: data.order || 0,
      },
    });

    revalidatePath('/road-markings');
    revalidatePath('/admin/road-markings');

    return {
      success: true,
      marking: {
        ...marking,
        category: marking.category as RoadMarkingCategory,
      },
    };
  } catch (error: any) {
    console.error('Error creating road marking:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

export async function updateRoadMarking(
  id: number,
  data: {
    number: string;
    name: string;
    description: string;
    category: RoadMarkingCategory;
    image?: string | null;
    order?: number;
  }
): Promise<{ success: boolean; error?: string; marking?: RoadMarking }> {
  try {
    // Get existing marking to check for image deletion
    const existingMarking = await prisma.roadMarking.findUnique({
      where: { id },
    });

    if (!existingMarking) {
      return {
        success: false,
        error: 'Գծանշումը չի գտնվել',
      };
    }

    // Delete old image if it's being replaced
    if (
      existingMarking.image &&
      data.image &&
      existingMarking.image !== data.image
    ) {
      await deleteImageFile(existingMarking.image);
    }

    const marking = await prisma.roadMarking.update({
      where: { id },
      data: {
        number: data.number,
        name: data.name,
        description: data.description,
        category: data.category,
        image: data.image || null,
        order: data.order !== undefined ? data.order : existingMarking.order,
      },
    });

    revalidatePath('/road-markings');
    revalidatePath('/admin/road-markings');

    return {
      success: true,
      marking: {
        ...marking,
        category: marking.category as RoadMarkingCategory,
      },
    };
  } catch (error: any) {
    console.error('Error updating road marking:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

export async function deleteRoadMarking(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const marking = await prisma.roadMarking.findUnique({
      where: { id },
    });

    if (!marking) {
      return {
        success: false,
        error: 'Գծանշումը չի գտնվել',
      };
    }

    // Delete associated image file
    if (marking.image) {
      await deleteImageFile(marking.image);
    }

    await prisma.roadMarking.delete({
      where: { id },
    });

    revalidatePath('/road-markings');
    revalidatePath('/admin/road-markings');

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting road marking:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}
