import { PrismaClient } from '@prisma/client';
import { vehicleTechnicalDefects } from '../src/utils/vehicleTechnicalDefects';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting vehicle technical defects migration...');

  let created = 0;
  let skipped = 0;

  for (const defect of vehicleTechnicalDefects) {
    try {
      // Check if defect already exists by number and category
      const existing = await prisma.vehicleTechnicalDefect.findFirst({
        where: {
          number: defect.number,
          category: defect.category,
        },
      });

      if (existing) {
        console.log(
          `Skipping defect ${defect.number} (${defect.category}) - already exists`
        );
        skipped++;
        continue;
      }

      await prisma.vehicleTechnicalDefect.create({
        data: {
          number: defect.number,
          description: defect.description,
          category: defect.category,
          order: parseInt(defect.number) || 0,
        },
      });

      created++;
      console.log(
        `Created defect: ${defect.number} (${defect.category}) - ${defect.description.substring(0, 50)}...`
      );
    } catch (error) {
      console.error(
        `Error creating defect ${defect.number}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(`\nMigration completed!`);
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total: ${vehicleTechnicalDefects.length}`);
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
