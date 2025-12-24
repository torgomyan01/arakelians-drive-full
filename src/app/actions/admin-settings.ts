'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface Setting {
  id: number;
  key: string;
  value: string;
  updatedAt: Date;
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key },
    });
    return setting?.value || null;
  } catch (error) {
    console.error('Error fetching setting:', error);
    return null;
  }
}

export async function getAllSettings(): Promise<Setting[]> {
  try {
    const settings = await prisma.setting.findMany({
      orderBy: {
        key: 'asc',
      },
    });
    return settings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return [];
  }
}

export async function updateSetting(key: string, value: string) {
  try {
    if (!key.trim()) {
      return {
        success: false,
        error: 'Բանալին պարտադիր է',
      };
    }

    if (!value.trim()) {
      return {
        success: false,
        error: 'Արժեքը պարտադիր է',
      };
    }

    // Use upsert to create if doesn't exist, update if exists
    const setting = await prisma.setting.upsert({
      where: { key },
      update: {
        value: value.trim(),
      },
      create: {
        key: key.trim(),
        value: value.trim(),
      },
    });

    revalidatePath('/admin/settings');
    // Revalidate pages that use settings
    revalidatePath('/');
    revalidatePath('/contact');
    return { success: true, setting };
  } catch (error: any) {
    console.error('Error updating setting:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

export async function updateMultipleSettings(
  settings: { key: string; value: string }[]
) {
  try {
    const results = await Promise.all(
      settings.map(({ key, value }) => updateSetting(key, value))
    );

    const hasError = results.some((result) => !result.success);
    if (hasError) {
      const errorMessages = results
        .filter((result) => !result.success)
        .map((result) => result.error)
        .join(', ');
      return {
        success: false,
        error: errorMessages || 'Սխալ է տեղի ունեցել',
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating multiple settings:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}
