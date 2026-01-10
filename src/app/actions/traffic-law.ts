'use server';

import { prisma } from '@/lib/prisma';

export interface TrafficLawItem {
  id: string | number;
  name: string;
  description: string;
  category: string;
}

export async function getAllTrafficLawItems(): Promise<TrafficLawItem[]> {
  try {
    const items = await prisma.trafficLawItem.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    });

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
    }));
  } catch (error) {
    console.error('Error fetching traffic law items:', error);
    return [];
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

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
    }));
  } catch (error) {
    console.error('Error fetching traffic law items by category:', error);
    return [];
  }
}
