'use server';

import { prisma } from '@/lib/prisma';
import type { RoadMarkingCategory } from '@/utils/road-markings-utils';

export interface RoadMarking {
  id: string | number;
  number: string;
  name: string;
  description: string;
  category: RoadMarkingCategory;
  image?: string | null;
}

export async function getAllRoadMarkings(): Promise<RoadMarking[]> {
  try {
    const markings = await prisma.roadMarking.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { number: 'asc' }],
    });

    return markings.map((marking) => ({
      id: marking.id,
      number: marking.number,
      name: marking.name,
      description: marking.description,
      category: marking.category as RoadMarkingCategory,
      image: marking.image,
    }));
  } catch (error) {
    console.error('Error fetching road markings:', error);
    return [];
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
      id: marking.id,
      number: marking.number,
      name: marking.name,
      description: marking.description,
      category: marking.category as RoadMarkingCategory,
      image: marking.image,
    }));
  } catch (error) {
    console.error('Error fetching road markings by category:', error);
    return [];
  }
}
