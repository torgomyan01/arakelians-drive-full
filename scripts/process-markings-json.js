/**
 * Script to process road markings JSON data, download images, and generate roadMarkings.ts
 *
 * Usage:
 * node scripts/process-markings-json.js road-markings-data.json
 *
 * This script:
 * 1. Downloads all images from the JSON data
 * 2. Generates the updated roadMarkings.ts file
 */

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/road-markings');
const ROAD_MARKINGS_TS_PATH = path.join(
  __dirname,
  '../src/utils/roadMarkings.ts'
);

// Read JSON data from file
let markingsData = [];
if (process.argv[2]) {
  const jsonFile = path.resolve(process.argv[2]);
  if (!fs.existsSync(jsonFile)) {
    console.error(`\n❌ Error: File not found: ${jsonFile}\n`);
    process.exit(1);
  }
  try {
    markingsData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    if (!Array.isArray(markingsData)) {
      console.error('Error: JSON file must contain an array of road markings');
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Error reading JSON file: ${error.message}\n`);
    process.exit(1);
  }
} else {
  console.error('No JSON file provided. Usage:');
  console.error(
    '  node scripts/process-markings-json.js road-markings-data.json'
  );
  process.exit(1);
}

// Map type to category (for road markings, we'll use simpler categories)
function mapTypeToCategory(type) {
  // Since we only have one type in the provided data, we'll create categories based on type
  // You can expand this later if more types are added
  const typeMap = {
    'I. ՀՈՐԻԶՈՆԱԿԱՆ ԳԾԱՆՇՈՒՄ': 'horizontal',
    'II. ՈՒՂՂԱՀԱՅԱՑ ԳԾԱՆՇՈՒՄ': 'vertical',
    // Add more types as needed
  };
  return typeMap[type] || 'horizontal';
}

function extractNumber(imageUrl) {
  // Extract number from URL like "https://varord.am/images/sign/gc/gc1_1.png"
  // Convert "gc1_1.png" to "1.1"
  const urlParts = imageUrl.split('/');
  const filename = urlParts[urlParts.length - 1];

  // Remove "gc" prefix and extension
  const nameWithoutExt = filename.replace(/\.(png|jpg|jpeg)$/i, '');
  const match = nameWithoutExt.match(/gc(\d+)(?:_(\d+))?(?:_(\d+))?/);

  if (match) {
    const part1 = match[1];
    const part2 = match[2] || '';
    const part3 = match[3] || '';

    if (part3) {
      return `${part1}.${part2}.${part3}`;
    } else if (part2) {
      return `${part1}.${part2}`;
    } else {
      return part1;
    }
  }

  return null;
}

function getFilenameFromUrl(imageUrl) {
  // Extract filename from URL like "https://varord.am/images/sign/gc/gc1_1.png"
  // Keep original filename but ensure .png extension
  const urlParts = imageUrl.split('/');
  const filename = urlParts[urlParts.length - 1];
  return filename;
}

async function downloadImage(imageUrl, filename) {
  try {
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'arraybuffer',
      timeout: 30000,
      maxRedirects: 5,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
      },
    });

    const filepath = path.join(OUTPUT_DIR, filename);
    await fs.writeFile(filepath, response.data);
    console.log(`✓ Downloaded: ${filename}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to download ${filename}:`, error.message);
    return false;
  }
}

function generateRoadMarkingsTS(markings) {
  const categoryComments = {
    horizontal: 'I. ՀՈՐԻԶՈՆԱԿԱՆ ԳԾԱՆՇՈՒՄ',
    // Add more categories as needed
  };

  let currentCategory = null;
  let content = `export interface RoadMarking {
  id: string;
  number: string; // e.g., "1.1", "1.2.1"
  name: string;
  description: string;
  category: 'horizontal' | 'vertical' | 'other';
  image?: string; // Path to image in public folder
}

export const roadMarkings: RoadMarking[] = [
`;

  for (const marking of markings) {
    if (marking.category !== currentCategory) {
      if (currentCategory !== null) {
        content += '\n';
      }
      currentCategory = marking.category;
      content += `  // ${categoryComments[marking.category] || marking.category}\n`;
    }

    const nameStr = (marking.name || '').replace(/'/g, "\\'");
    const descStr = (marking.description || '').replace(/'/g, "\\'");

    content += `  {
    id: '${marking.id}',
    number: '${marking.number}',
    name: '${nameStr}',
    description: '${descStr}',
    category: '${marking.category}',
    image: '${marking.image}',
  },\n`;
  }

  content += `];

// Helper functions
export function getAllMarkings(): RoadMarking[] {
  return roadMarkings;
}

export function getMarkingsByCategory(category: RoadMarking['category']): RoadMarking[] {
  return roadMarkings.filter((marking) => marking.category === category);
}

export function getMarkingById(id: string): RoadMarking | undefined {
  return roadMarkings.find((marking) => marking.id === id);
}

export function getMarkingByNumber(number: string): RoadMarking | undefined {
  return roadMarkings.find((marking) => marking.number === number);
}

export const categoryLabels: Record<RoadMarking['category'], string> = {
  horizontal: 'Հորիզոնական',
  vertical: 'Ուղղահայաց',
  other: 'Այլ',
};
`;

  return content;
}

async function processMarkings() {
  try {
    // Ensure output directory exists
    await fs.ensureDir(OUTPUT_DIR);

    console.log(`Processing ${markingsData.length} road markings...\n`);

    // Process each marking
    const processedMarkings = [];
    let downloaded = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < markingsData.length; i++) {
      const marking = markingsData[i];

      // Extract number from image URL if title is empty
      let number = null;
      if (marking.title && marking.title.trim()) {
        // Try to extract from title if available
        const match = marking.title.match(/^(\d+\.\d+(?:\.\d+)?)\.?/);
        number = match ? match[1] : null;
      }

      // If no number from title, extract from image URL
      if (!number) {
        number = extractNumber(marking.imageUrl);
      }

      // Fallback to index if still no number
      if (!number) {
        number = `${i + 1}`;
      }

      // Format name: if title is just a number (like "2.1.1"), format it as "Գծանշում 2.1.1"
      // Otherwise use title as-is or fallback to "Գծանշում {number}"
      let name = marking.title?.trim() || `Գծանշում ${number}`;
      if (name && /^\d+\.?\d*(\.\d+)?\.?$/.test(name.trim())) {
        // Title is just a number, format it
        name = `Գծանշում ${name.replace(/\.$/, '')}`;
      }
      const category = mapTypeToCategory(marking.type);
      const filename = getFilenameFromUrl(marking.imageUrl);
      const imagePath = `/road-markings/${filename}`;

      const filepath = path.join(OUTPUT_DIR, filename);

      // Download image if it doesn't exist
      if (!(await fs.pathExists(filepath))) {
        let success = await downloadImage(marking.imageUrl, filename);
        if (!success) {
          // Retry once
          console.log(`   Retrying ${filename}...`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          success = await downloadImage(marking.imageUrl, filename);
        }

        if (success) {
          downloaded++;
        } else {
          failed++;
        }

        // Add delay to avoid overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 300));
      } else {
        skipped++;
      }

      processedMarkings.push({
        id: number,
        number: number,
        name: name,
        description: marking.description || '',
        category: category,
        image: imagePath,
      });
    }

    console.log(`\n📊 Download Summary:`);
    console.log(`   ✓ Downloaded: ${downloaded}`);
    console.log(`   ⊘ Skipped: ${skipped}`);
    console.log(`   ✗ Failed: ${failed}`);

    // Generate roadMarkings.ts file
    console.log('\n📝 Generating roadMarkings.ts...');
    const tsContent = generateRoadMarkingsTS(processedMarkings);
    await fs.writeFile(ROAD_MARKINGS_TS_PATH, tsContent, 'utf-8');
    console.log(`✓ Generated ${ROAD_MARKINGS_TS_PATH}`);

    console.log(
      `\n✅ Process complete! Processed ${processedMarkings.length} markings.`
    );
  } catch (error) {
    console.error('Error processing markings:', error.message);
    console.error(error.stack);
  }
}

// Run the script
if (require.main === module) {
  processMarkings();
}

module.exports = { processMarkings };
