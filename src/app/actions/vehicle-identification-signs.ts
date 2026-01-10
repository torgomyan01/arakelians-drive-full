'use server';

import { prisma } from '@/lib/prisma';

export interface VehicleIdentificationSign {
  id: string | number;
  number: string;
  name: string;
  description: string;
  image?: string | null;
}

export async function getAllVehicleIdentificationSigns(): Promise<
  VehicleIdentificationSign[]
> {
  try {
    const signs = await prisma.vehicleIdentificationSign.findMany({
      orderBy: [{ order: 'asc' }, { number: 'asc' }],
    });

    return signs.map((sign) => ({
      id: sign.id,
      number: sign.number,
      name: sign.name,
      description: sign.description,
      image: sign.image,
    }));
  } catch (error) {
    console.error('Error fetching vehicle identification signs:', error);
    return [];
  }
}
