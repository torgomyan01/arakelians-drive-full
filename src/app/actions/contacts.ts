'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface ContactData {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  message: string;
  createdAt: Date;
}

export async function createContact(
  firstName: string,
  lastName: string,
  phone: string,
  message: string
) {
  try {
    const contact = await prisma.contact.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        message: message.trim(),
      },
    });

    return { success: true, contact };
  } catch (error: any) {
    console.error('Error creating contact:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

export async function getAllContacts(): Promise<ContactData[]> {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
}

export async function deleteContact(id: number) {
  try {
    await prisma.contact.delete({
      where: { id },
    });

    revalidatePath('/admin/contacts');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting contact:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}
