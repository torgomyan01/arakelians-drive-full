'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface RulesSection {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  order: number;
  icon: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: RuleItem[];
}

export interface RuleItem {
  id: number;
  number: string;
  title: string | null;
  content: string;
  type: string;
  important: boolean;
  order: number;
  sectionId: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllRulesSections() {
  try {
    const sections = await prisma.rulesSection.findMany({
      include: {
        items: {
          orderBy: [{ order: 'asc' }],
        },
      },
      orderBy: [{ order: 'asc' }],
    });

    return sections;
  } catch (error) {
    console.error('Error fetching rules sections:', error);
    return [];
  }
}

export async function getRulesSectionBySlug(slug: string) {
  try {
    const section = await prisma.rulesSection.findUnique({
      where: { slug },
      include: {
        items: {
          orderBy: [{ order: 'asc' }],
        },
      },
    });

    return section;
  } catch (error) {
    console.error('Error fetching rules section:', error);
    return null;
  }
}

export async function getRulesSectionById(id: number) {
  try {
    const section = await prisma.rulesSection.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: [{ order: 'asc' }],
        },
      },
    });

    return section;
  } catch (error) {
    console.error('Error fetching rules section:', error);
    return null;
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\u0561-\u0587\u0531-\u0556a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createRulesSection(data: {
  title: string;
  slug?: string;
  description: string;
  content: string;
  order?: number;
  icon?: string | null;
  color?: string | null;
  items?: Array<{
    number: string;
    title?: string | null;
    content: string;
    type?: string;
    important?: boolean;
    order?: number;
  }>;
}) {
  try {
    let slug = data.slug?.trim() || generateSlug(data.title);

    // Ensure slug is unique
    let counter = 1;
    let uniqueSlug = slug;
    while (
      await prisma.rulesSection.findUnique({ where: { slug: uniqueSlug } })
    ) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    // Get max order if not provided
    let order = data.order;
    if (order === undefined) {
      const maxOrder = await prisma.rulesSection.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = maxOrder ? maxOrder.order + 1 : 0;
    }

    const section = await prisma.rulesSection.create({
      data: {
        title: data.title,
        slug: uniqueSlug,
        description: data.description,
        content: data.content,
        order: order,
        icon: data.icon || null,
        color: data.color || null,
        items: data.items
          ? {
              create: data.items.map((item, index) => ({
                number: item.number,
                title: item.title || null,
                content: item.content,
                type: item.type || 'rule',
                important: item.important || false,
                order: item.order !== undefined ? item.order : index,
              })),
            }
          : undefined,
      },
      include: {
        items: true,
      },
    });

    revalidatePath('/rules');
    revalidatePath(`/rules/${section.slug}`);
    return { success: true, section };
  } catch (error: any) {
    console.error('Error creating rules section:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

export async function updateRulesSection(
  id: number,
  data: {
    title?: string;
    slug?: string;
    description?: string;
    content?: string;
    order?: number;
    icon?: string | null;
    color?: string | null;
  }
) {
  try {
    const existingSection = await prisma.rulesSection.findUnique({
      where: { id },
    });

    if (!existingSection) {
      return { success: false, error: 'Բաժինը չի գտնվել' };
    }

    let slug = data.slug?.trim();
    if (data.title && !slug) {
      slug = generateSlug(data.title);
    } else if (!slug) {
      slug = existingSection.slug;
    }

    // Check slug uniqueness if it's being changed
    if (slug !== existingSection.slug) {
      let counter = 1;
      let uniqueSlug = slug;
      while (
        await prisma.rulesSection.findFirst({
          where: { slug: uniqueSlug, id: { not: id } },
        })
      ) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
      slug = uniqueSlug;
    }

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (slug !== undefined) updateData.slug = slug;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.color !== undefined) updateData.color = data.color;

    const updatedSection = await prisma.rulesSection.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          orderBy: [{ order: 'asc' }],
        },
      },
    });

    revalidatePath('/rules');
    revalidatePath(`/rules/${existingSection.slug}`);
    if (updatedSection.slug !== existingSection.slug) {
      revalidatePath(`/rules/${updatedSection.slug}`);
    }

    return { success: true, section: updatedSection };
  } catch (error: any) {
    console.error('Error updating rules section:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

export async function deleteRulesSection(id: number) {
  try {
    const sectionToDelete = await prisma.rulesSection.findUnique({
      where: { id },
      select: { slug: true },
    });

    if (!sectionToDelete) {
      return { success: false, error: 'Բաժինը չի գտնվել' };
    }

    await prisma.rulesSection.delete({
      where: { id },
    });

    revalidatePath('/rules');
    revalidatePath(`/rules/${sectionToDelete.slug}`);

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting rules section:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

// RuleItem CRUD operations
export async function createRuleItem(
  sectionId: number,
  data: {
    number: string;
    title?: string | null;
    content: string;
    type?: string;
    important?: boolean;
    order?: number;
  }
) {
  try {
    const section = await prisma.rulesSection.findUnique({
      where: { id: sectionId },
    });

    if (!section) {
      return { success: false, error: 'Բաժինը չի գտնվել' };
    }

    // Get max order if not provided
    let order = data.order;
    if (order === undefined) {
      const maxOrder = await prisma.ruleItem.findFirst({
        where: { sectionId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = maxOrder ? maxOrder.order + 1 : 0;
    }

    const item = await prisma.ruleItem.create({
      data: {
        number: data.number,
        title: data.title || null,
        content: data.content,
        type: data.type || 'rule',
        important: data.important || false,
        order: order,
        sectionId: sectionId,
      },
    });

    revalidatePath('/rules');
    revalidatePath(`/rules/${section.slug}`);
    return { success: true, item };
  } catch (error: any) {
    console.error('Error creating rule item:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

export async function updateRuleItem(
  id: number,
  data: {
    number?: string;
    title?: string | null;
    content?: string;
    type?: string;
    important?: boolean;
    order?: number;
  }
) {
  try {
    const existingItem = await prisma.ruleItem.findUnique({
      where: { id },
      include: { section: true },
    });

    if (!existingItem) {
      return { success: false, error: 'Կանոնը չի գտնվել' };
    }

    const updateData: any = {};
    if (data.number !== undefined) updateData.number = data.number;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.important !== undefined) updateData.important = data.important;
    if (data.order !== undefined) updateData.order = data.order;

    const updatedItem = await prisma.ruleItem.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/rules');
    revalidatePath(`/rules/${existingItem.section.slug}`);
    return { success: true, item: updatedItem };
  } catch (error: any) {
    console.error('Error updating rule item:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}

export async function deleteRuleItem(id: number) {
  try {
    const itemToDelete = await prisma.ruleItem.findUnique({
      where: { id },
      include: { section: true },
    });

    if (!itemToDelete) {
      return { success: false, error: 'Կանոնը չի գտնվել' };
    }

    await prisma.ruleItem.delete({
      where: { id },
    });

    revalidatePath('/rules');
    revalidatePath(`/rules/${itemToDelete.section.slug}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting rule item:', error);
    return {
      success: false,
      error: error.message || 'Սխալ է տեղի ունեցել',
    };
  }
}
