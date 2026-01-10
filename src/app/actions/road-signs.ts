'use server';

import { prisma } from '@/lib/prisma';
import type { RoadSignCategory } from '@/utils/road-signs-utils';

export interface RoadSign {
  id: string | number;
  number: string;
  name: string;
  description: string;
  category: RoadSignCategory;
  image?: string | null;
  placement?: string | null;
}

export async function getAllRoadSigns(): Promise<RoadSign[]> {
  try {
    const signs = await prisma.roadSign.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { number: 'asc' }],
    });

    // Convert to match the expected format
    return signs.map((sign) => ({
      id: sign.id.toString(),
      number: sign.number,
      name: sign.name,
      description: sign.description,
      category: sign.category as RoadSignCategory,
      image: sign.image || null,
      placement: sign.placement || null,
    }));
  } catch (error) {
    console.error('Error fetching road signs:', error);
    return [];
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
      id: sign.id.toString(),
      number: sign.number,
      name: sign.name,
      description: sign.description,
      category: sign.category as RoadSignCategory,
      image: sign.image || null,
      placement: sign.placement || null,
    }));
  } catch (error) {
    console.error('Error fetching road signs by category:', error);
    return [];
  }
}
