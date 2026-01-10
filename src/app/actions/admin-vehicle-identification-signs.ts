'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { deleteImageFile } from '@/utils/image-delete';

export interface VehicleIdentificationSign {
  id: number;
  number: string;
  name: string;
  description: string;
  image: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllVehicleIdentificationSigns(): Promise<
  VehicleIdentificationSign[]
> {
  try {
    const signs = await prisma.vehicleIdentificationSign.findMany({
      orderBy: [{ order: 'asc' }, { number: 'asc' }],
    });

    return signs;
  } catch (error) {
    console.error('Error fetching vehicle identification signs:', error);
    return [];
  }
}

export async function getVehicleIdentificationSignById(
  id: number
): Promise<VehicleIdentificationSign | null> {
  try {
    const sign = await prisma.vehicleIdentificationSign.findUnique({
      where: { id },
    });

    return sign;
  } catch (error) {
    console.error('Error fetching vehicle identification sign:', error);
    return null;
  }
}

export async function createVehicleIdentificationSign(data: {
  number: string;
  name: string;
  description: string;
  image?: string | null;
  order?: number;
}): Promise<{
  success: boolean;
  error?: string;
  sign?: VehicleIdentificationSign;
}> {
  try {
    const sign = await prisma.vehicleIdentificationSign.create({
      data: {
        number: data.number,
        name: data.name,
        description: data.description,
        image: data.image || null,
        order: data.order || 0,
      },
    });

    revalidatePath('/vehicle-identification-signs');
    revalidatePath('/admin/vehicle-identification-signs');

    return {
      success: true,
      sign,
    };
  } catch (error: any) {
    console.error('Error creating vehicle identification sign:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

export async function updateVehicleIdentificationSign(
  id: number,
  data: {
    number: string;
    name: string;
    description: string;
    image?: string | null;
    order?: number;
  }
): Promise<{
  success: boolean;
  error?: string;
  sign?: VehicleIdentificationSign;
}> {
  try {
    // Get existing sign to check for image deletion
    const existingSign = await prisma.vehicleIdentificationSign.findUnique({
      where: { id },
    });

    if (!existingSign) {
      return {
        success: false,
        error: 'Նշանը չի գտնվել',
      };
    }

    // Delete old image if it's being replaced
    if (existingSign.image && data.image && existingSign.image !== data.image) {
      await deleteImageFile(existingSign.image);
    }

    const sign = await prisma.vehicleIdentificationSign.update({
      where: { id },
      data: {
        number: data.number,
        name: data.name,
        description: data.description,
        image: data.image || null,
        order: data.order !== undefined ? data.order : existingSign.order,
      },
    });

    revalidatePath('/vehicle-identification-signs');
    revalidatePath('/admin/vehicle-identification-signs');

    return {
      success: true,
      sign,
    };
  } catch (error: any) {
    console.error('Error updating vehicle identification sign:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

export async function deleteVehicleIdentificationSign(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const sign = await prisma.vehicleIdentificationSign.findUnique({
      where: { id },
    });

    if (!sign) {
      return {
        success: false,
        error: 'Նշանը չի գտնվել',
      };
    }

    // Delete associated image file
    if (sign.image) {
      await deleteImageFile(sign.image);
    }

    await prisma.vehicleIdentificationSign.delete({
      where: { id },
    });

    revalidatePath('/vehicle-identification-signs');
    revalidatePath('/admin/vehicle-identification-signs');

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting vehicle identification sign:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}
