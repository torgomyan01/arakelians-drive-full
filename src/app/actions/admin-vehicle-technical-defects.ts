'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { VehicleTechnicalDefectCategory } from '@/utils/vehicle-technical-defects-utils';

export interface VehicleTechnicalDefect {
  id: number;
  number: string;
  description: string;
  category: VehicleTechnicalDefectCategory;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllVehicleTechnicalDefects(): Promise<
  VehicleTechnicalDefect[]
> {
  try {
    const defects = await prisma.vehicleTechnicalDefect.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { number: 'asc' }],
    });

    return defects.map((defect) => ({
      ...defect,
      category: defect.category as VehicleTechnicalDefectCategory,
    }));
  } catch (error) {
    console.error('Error fetching vehicle technical defects:', error);
    return [];
  }
}

export async function getVehicleTechnicalDefectById(
  id: number
): Promise<VehicleTechnicalDefect | null> {
  try {
    const defect = await prisma.vehicleTechnicalDefect.findUnique({
      where: { id },
    });

    if (!defect) return null;

    return {
      ...defect,
      category: defect.category as VehicleTechnicalDefectCategory,
    };
  } catch (error) {
    console.error('Error fetching vehicle technical defect:', error);
    return null;
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
      ...defect,
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

export async function createVehicleTechnicalDefect(data: {
  number: string;
  description: string;
  category: VehicleTechnicalDefectCategory;
  order?: number;
}): Promise<{
  success: boolean;
  error?: string;
  defect?: VehicleTechnicalDefect;
}> {
  try {
    const defect = await prisma.vehicleTechnicalDefect.create({
      data: {
        number: data.number,
        description: data.description,
        category: data.category,
        order: data.order || 0,
      },
    });

    revalidatePath('/vehicle-technical-defects');
    revalidatePath('/admin/vehicle-technical-defects');

    return {
      success: true,
      defect: {
        ...defect,
        category: defect.category as VehicleTechnicalDefectCategory,
      },
    };
  } catch (error: any) {
    console.error('Error creating vehicle technical defect:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

export async function updateVehicleTechnicalDefect(
  id: number,
  data: {
    number: string;
    description: string;
    category: VehicleTechnicalDefectCategory;
    order?: number;
  }
): Promise<{
  success: boolean;
  error?: string;
  defect?: VehicleTechnicalDefect;
}> {
  try {
    const existingDefect = await prisma.vehicleTechnicalDefect.findUnique({
      where: { id },
    });

    if (!existingDefect) {
      return {
        success: false,
        error: 'Անսարքությունը չի գտնվել',
      };
    }

    const defect = await prisma.vehicleTechnicalDefect.update({
      where: { id },
      data: {
        number: data.number,
        description: data.description,
        category: data.category,
        order: data.order !== undefined ? data.order : existingDefect.order,
      },
    });

    revalidatePath('/vehicle-technical-defects');
    revalidatePath('/admin/vehicle-technical-defects');

    return {
      success: true,
      defect: {
        ...defect,
        category: defect.category as VehicleTechnicalDefectCategory,
      },
    };
  } catch (error: any) {
    console.error('Error updating vehicle technical defect:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

export async function deleteVehicleTechnicalDefect(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const defect = await prisma.vehicleTechnicalDefect.findUnique({
      where: { id },
    });

    if (!defect) {
      return {
        success: false,
        error: 'Անսարքությունը չի գտնվել',
      };
    }

    await prisma.vehicleTechnicalDefect.delete({
      where: { id },
    });

    revalidatePath('/vehicle-technical-defects');
    revalidatePath('/admin/vehicle-technical-defects');

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting vehicle technical defect:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}
