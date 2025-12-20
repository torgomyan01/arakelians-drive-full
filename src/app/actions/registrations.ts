'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface RegistrationData {
  id: number;
  name: string;
  phone: string;
  hasDiscount: boolean;
  createdAt: Date;
}

export async function createRegistration(
  name: string,
  phone: string,
  hasDiscount: boolean = false
) {
  try {
    const registration = await prisma.registration.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        hasDiscount,
      },
    });

    return { success: true, registration };
  } catch (error: any) {
    console.error('Error creating registration:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

export async function getAllRegistrations(): Promise<RegistrationData[]> {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return registrations;
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return [];
  }
}

export async function deleteRegistration(id: number) {
  try {
    await prisma.registration.delete({
      where: { id },
    });

    revalidatePath('/admin/registrations');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting registration:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}
