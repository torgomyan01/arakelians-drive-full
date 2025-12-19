/**
 * Script to populate database with lessons data from lesons.json
 * Usage: node scripts/populate-lessons.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function populateLessons() {
  try {
    console.log('📖 Reading lesons.json file...');
    const jsonPath = path.join(__dirname, '../src/lesons.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    const categories = JSON.parse(jsonData);

    console.log(`✅ Found ${categories.length} categories\n`);

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await prisma.questionOption.deleteMany({});
    await prisma.question.deleteMany({});
    await prisma.lessonCategory.deleteMany({});
    console.log('✅ Existing data cleared\n');

    let totalQuestions = 0;
    let totalOptions = 0;

    // Process each category
    for (const categoryData of categories) {
      console.log(
        `📚 Processing category ID: ${categoryData.id} (${categoryData.lessons?.length || 0} lessons)`
      );

      // Create lesson category
      const category = await prisma.lessonCategory.create({
        data: {
          id: categoryData.id,
        },
      });

      // Process each lesson/question in the category
      if (categoryData.lessons && Array.isArray(categoryData.lessons)) {
        for (const lesson of categoryData.lessons) {
          // Create question
          const question = await prisma.question.create({
            data: {
              jsonId: lesson.id,
              title: lesson.title,
              img: lesson.img || null,
              correctAnswerIndex: lesson.true,
              lessonCategoryId: category.id,
              options: {
                create: lesson.questions.map((optionText, index) => ({
                  text: optionText,
                  order: index + 1, // 1-based order
                })),
              },
            },
          });

          totalQuestions++;
          totalOptions += lesson.questions.length;
        }
      }

      console.log(`✅ Category ${categoryData.id} processed\n`);
    }

    console.log('🎉 Database population completed!');
    console.log(`📊 Statistics:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Questions: ${totalQuestions}`);
    console.log(`   - Options: ${totalOptions}`);
  } catch (error) {
    console.error('❌ Error populating database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
populateLessons()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
