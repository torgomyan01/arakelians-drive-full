import { PrismaClient } from '@prisma/client';
import { trafficLawItems } from '../src/utils/trafficLaw';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting traffic law items migration...');

  let created = 0;
  let skipped = 0;

  for (const item of trafficLawItems) {
    try {
      // Check if item already exists by name and category
      const existing = await prisma.trafficLawItem.findFirst({
        where: {
          name: item.name,
          category: item.category,
        },
      });

      if (existing) {
        console.log(
          `Skipping item "${item.name.substring(0, 30)}..." (${item.category}) - already exists`
        );
        skipped++;
        continue;
      }

      await prisma.trafficLawItem.create({
        data: {
          name: item.name,
          description: item.description,
          category: item.category,
          order: 0,
        },
      });

      created++;
      console.log(
        `Created item: "${item.name.substring(0, 50)}..." (${item.category})`
      );
    } catch (error) {
      console.error(
        `Error creating item "${item.name}":`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(`\nMigration completed!`);
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total: ${trafficLawItems.length}`);
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
