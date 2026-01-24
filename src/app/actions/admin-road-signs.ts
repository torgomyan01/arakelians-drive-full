'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { deleteImageFile } from '@/utils/image-delete';
import type { RoadSignCategory } from '@/utils/road-signs-utils';

export interface RoadSign {
  id: number;
  number: string;
  name: string;
  description: string;
  category: RoadSignCategory;
  image: string | null;
  placement: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllRoadSigns(): Promise<RoadSign[]> {
  try {
    const signs = await prisma.roadSign.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { number: 'asc' }],
    });

    return signs.map((sign) => ({
      ...sign,
      category: sign.category as RoadSignCategory,
    }));
  } catch (error) {
    console.error('Error fetching road signs:', error);
    return [];
  }
}

export async function getRoadSignById(id: number): Promise<RoadSign | null> {
  try {
    const sign = await prisma.roadSign.findUnique({
      where: { id },
    });

    if (!sign) return null;

    return {
      ...sign,
      category: sign.category as RoadSignCategory,
    };
  } catch (error) {
    console.error('Error fetching road sign:', error);
    return null;
  }
}

export async function getRoadSignsByCategory(
  category: RoadSignCategory
): Promise<RoadSign[]> {
  try {
    const signs = await prisma.roadSign.findMany({
      where: { category },
      orderBy: [{ order: 'asc' }, { number: 'asc' }],
    });

    return signs.map((sign) => ({
      ...sign,
      category: sign.category as RoadSignCategory,
    }));
  } catch (error) {
    console.error('Error fetching road signs by category:', error);
    return [];
  }
}

export async function createRoadSign(data: {
  number: string;
  name: string;
  description: string;
  category: RoadSignCategory;
  image?: string | null;
  placement?: string | null;
  order?: number;
}) {
  try {
    const sign = await prisma.roadSign.create({
      data: {
        number: data.number,
        name: data.name,
        description: data.description,
        category: data.category,
        image: data.image || null,
        placement: data.placement || null,
        order: data.order || 0,
      },
    });

    revalidatePath('/road-signs');
    revalidatePath('/admin/road-signs');

    return {
      success: true,
      sign: {
        ...sign,
        category: sign.category as RoadSignCategory,
      },
    };
  } catch (error: any) {
    console.error('Error creating road sign:', error);
    return {
      success: false,
      error: error.message || 'Failed to create road sign',
    };
  }
}

export async function updateRoadSign(
  id: number,
  data: {
    number?: string;
    name?: string;
    description?: string;
    category?: RoadSignCategory;
    image?: string | null;
    placement?: string | null;
    order?: number;
  }
) {
  try {
    const sign = await prisma.roadSign.update({
      where: { id },
      data: {
        ...(data.number !== undefined && { number: data.number }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.placement !== undefined && { placement: data.placement }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });

    revalidatePath('/road-signs');
    revalidatePath('/admin/road-signs');

    return {
      success: true,
      sign: {
        ...sign,
        category: sign.category as RoadSignCategory,
      },
    };
  } catch (error: any) {
    console.error('Error updating road sign:', error);
    return {
      success: false,
      error: error.message || 'Failed to update road sign',
    };
  }
}

export async function updateRoadSignsOrder(
  updates: { id: number; order: number }[]
) {
  try {
    // Use a transaction to update all signs at once
    await prisma.$transaction(
      updates.map(({ id, order }) =>
        prisma.roadSign.update({
          where: { id },
          data: { order },
        })
      )
    );

    revalidatePath('/road-signs');
    revalidatePath('/admin/road-signs');

    return { success: true };
  } catch (error: any) {
    console.error('Error updating road signs order:', error);
    return {
      success: false,
      error: error.message || 'Failed to update road signs order',
    };
  }
}

export async function deleteRoadSign(id: number) {
  try {
    // Get the sign to delete image if exists
    const sign = await prisma.roadSign.findUnique({
      where: { id },
    });

    if (!sign) {
      return { success: false, error: 'Road sign not found' };
    }

    // Delete the sign
    await prisma.roadSign.delete({
      where: { id },
    });

    // Delete image file if exists
    if (sign.image) {
      try {
        await deleteImageFile(sign.image);
      } catch (imageError) {
        console.error('Error deleting image file:', imageError);
        // Continue even if image deletion fails
      }
    }

    revalidatePath('/road-signs');
    revalidatePath('/admin/road-signs');

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting road sign:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete road sign',
    };
  }
}
