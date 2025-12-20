'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export interface UserWithStats {
  id: number;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllUsers(): Promise<UserWithStats[]> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function getUserById(id: number): Promise<UserWithStats | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function createUser(data: {
  email: string;
  name?: string;
  password: string;
  role?: string;
}) {
  try {
    // Check if user with same email exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return {
        success: false,
        error: 'Օգտատեր այս email-ով արդեն գոյություն ունի',
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name || null,
        password: hashedPassword,
        role: data.role || 'user',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    revalidatePath('/admin/users');
    return { success: true, user };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}

export async function updateUser(
  id: number,
  data: {
    email?: string;
    name?: string | null;
    password?: string;
    role?: string;
  }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return { success: false, error: 'Օգտատերը չի գտնվել' };
    }

    // Check email uniqueness if it's being changed
    if (data.email && data.email !== user.email) {
      const existing = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existing) {
        return {
          success: false,
          error: 'Օգտատեր այս email-ով արդեն գոյություն ունի',
        };
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (data.email !== undefined) updateData.email = data.email;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    revalidatePath('/admin/users');
    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error('Error updating user:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}

export async function deleteUser(id: number) {
  try {
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message || 'Սխալ է տեղի ունեցել' };
  }
}
