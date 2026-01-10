'use server';

import { prisma } from '@/lib/prisma';
import type { VehicleTechnicalDefectCategory } from '@/utils/vehicle-technical-defects-utils';

export interface VehicleTechnicalDefect {
  id: string | number;
  number: string;
  description: string;
  category: VehicleTechnicalDefectCategory;
}

export async function getAllVehicleTechnicalDefects(): Promise<
  VehicleTechnicalDefect[]
> {
  try {
    const defects = await prisma.vehicleTechnicalDefect.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { number: 'asc' }],
    });

    return defects.map((defect) => ({
      id: defect.id,
      number: defect.number,
      description: defect.description,
      category: defect.category as VehicleTechnicalDefectCategory,
    }));
  } catch (error) {
    console.error('Error fetching vehicle technical defects:', error);
    return [];
  }
}

export async function getVehicleTechnicalDefectsByCategory(
  category: VehicleTechnicalDefectCategory
): Promise<VehicleTechnicalDefect[]> {
  try {
    const defects = await prisma.vehicleTechnicalDefect.findMany({
      where: { category },
      orderBy: [{ order: 'asc' }, { number: 'asc' }],
    });

    return defects.map((defect) => ({
      id: defect.id,
      number: defect.number,
      description: defect.description,
      category: defect.category as VehicleTechnicalDefectCategory,
    }));
  } catch (error) {
    console.error(
      'Error fetching vehicle technical defects by category:',
      error
    );
    return [];
  }
}
