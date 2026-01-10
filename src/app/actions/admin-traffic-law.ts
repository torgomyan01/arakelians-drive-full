'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface TrafficLawItem {
  id: number;
  name: string;
  description: string;
  category: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllTrafficLawItems(): Promise<TrafficLawItem[]> {
  try {
    const items = await prisma.trafficLawItem.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    });

    return items;
  } catch (error) {
    console.error('Error fetching traffic law items:', error);
    return [];
  }
}

export async function getTrafficLawItemById(
  id: number
): Promise<TrafficLawItem | null> {
  try {
    const item = await prisma.trafficLawItem.findUnique({
      where: { id },
    });

    return item;
  } catch (error) {
    console.error('Error fetching traffic law item:', error);
    return null;
  }
}

export async function getTrafficLawItemsByCategory(
  category: string
): Promise<TrafficLawItem[]> {
  try {
    const items = await prisma.trafficLawItem.findMany({
      where: { category },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    return items;
  } catch (error) {
    console.error('Error fetching traffic law items by category:', error);
    return [];
  }
}

export async function createTrafficLawItem(data: {
  name: string;
  description: string;
  category: string;
  order?: number;
}): Promise<{
  success: boolean;
  error?: string;
  item?: TrafficLawItem;
}> {
  try {
    const item = await prisma.trafficLawItem.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        order: data.order || 0,
      },
    });

    revalidatePath('/traffic-law');
    revalidatePath('/admin/traffic-law');

    return {
      success: true,
      item,
    };
  } catch (error: any) {
    console.error('Error creating traffic law item:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

export async function updateTrafficLawItem(
  id: number,
  data: {
    name: string;
    description: string;
    category: string;
    order?: number;
  }
): Promise<{
  success: boolean;
  error?: string;
  item?: TrafficLawItem;
}> {
  try {
    const existingItem = await prisma.trafficLawItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return {
        success: false,
        error: 'Նյութը չի գտնվել',
      };
    }

    const item = await prisma.trafficLawItem.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        order: data.order !== undefined ? data.order : existingItem.order,
      },
    });

    revalidatePath('/traffic-law');
    revalidatePath('/admin/traffic-law');

    return {
      success: true,
      item,
    };
  } catch (error: any) {
    console.error('Error updating traffic law item:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

export async function deleteTrafficLawItem(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const item = await prisma.trafficLawItem.findUnique({
      where: { id },
    });

    if (!item) {
      return {
        success: false,
        error: 'Նյութը չի գտնվել',
      };
    }

    await prisma.trafficLawItem.delete({
      where: { id },
    });

    revalidatePath('/traffic-law');
    revalidatePath('/admin/traffic-law');

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting traffic law item:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}
