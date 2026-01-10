import { PrismaClient } from '@prisma/client';
import { roadMarkings } from '../src/utils/roadMarkings';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting road markings migration...');

  let created = 0;
  let skipped = 0;

  for (const marking of roadMarkings) {
    try {
      // Check if marking already exists by number
      const existing = await prisma.roadMarking.findFirst({
        where: { number: marking.number },
      });

      if (existing) {
        console.log(`Skipping marking ${marking.number} - already exists`);
        skipped++;
        continue;
      }

      await prisma.roadMarking.create({
        data: {
          number: marking.number,
          name: marking.name,
          description: marking.description || '',
          category: marking.category,
          image: marking.image || null,
          order: 0,
        },
      });

      created++;
      console.log(`Created marking: ${marking.number} - ${marking.name}`);
    } catch (error) {
      console.error(
        `Error creating marking ${marking.number}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(`\nMigration completed!`);
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total: ${roadMarkings.length}`);
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
