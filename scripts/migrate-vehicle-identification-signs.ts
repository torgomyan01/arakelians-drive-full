import { PrismaClient } from '@prisma/client';
import { vehicleIdentificationSigns } from '../src/utils/vehicleIdentificationSigns';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting vehicle identification signs migration...');

  let created = 0;
  let skipped = 0;

  for (const sign of vehicleIdentificationSigns) {
    try {
      // Check if sign already exists by number
      const existing = await prisma.vehicleIdentificationSign.findFirst({
        where: { number: sign.number },
      });

      if (existing) {
        console.log(`Skipping sign ${sign.number} - already exists`);
        skipped++;
        continue;
      }

      await prisma.vehicleIdentificationSign.create({
        data: {
          number: sign.number,
          name: sign.name,
          description: sign.description || '',
          image: sign.image || null,
          order: parseInt(sign.number) || 0,
        },
      });

      created++;
      console.log(`Created sign: ${sign.number} - ${sign.name}`);
    } catch (error) {
      console.error(
        `Error creating sign ${sign.number}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(`\nMigration completed!`);
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total: ${vehicleIdentificationSigns.length}`);
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
