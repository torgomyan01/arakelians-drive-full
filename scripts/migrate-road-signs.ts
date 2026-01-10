/**
 * Migration script to migrate road signs from utils/roadSigns.ts to database
 * Run this script once to populate the database with existing road signs
 */

import { prisma } from '../src/lib/prisma';
import { roadSigns } from '../src/utils/roadSigns';

async function migrateRoadSigns() {
  console.log('Starting road signs migration...');
  console.log(`Total signs to migrate: ${roadSigns.length}`);

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const sign of roadSigns) {
    try {
      // Check if sign already exists by number
      const existing = await prisma.roadSign.findFirst({
        where: { number: sign.number },
      });

      if (existing) {
        console.log(`Skipping ${sign.number} - already exists`);
        skipped++;
        continue;
      }

      // Create the sign
      await prisma.roadSign.create({
        data: {
          number: sign.number,
          name: sign.name,
          description: sign.description,
          category: sign.category,
          image: sign.image || null,
          placement: sign.placement || null,
          order: 0,
        },
      });

      migrated++;
      console.log(`Migrated: ${sign.number} - ${sign.name}`);
    } catch (error: any) {
      console.error(`Error migrating ${sign.number}:`, error.message);
      errors++;
    }
  }

  console.log('\nMigration completed!');
  console.log(`Migrated: ${migrated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);
}

// Run migration
migrateRoadSigns()
  .then(() => {
    console.log('Migration script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
