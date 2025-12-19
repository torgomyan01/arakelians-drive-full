/**
 * Script to process vehicle identification signs JSON data, download images, and generate vehicleIdentificationSigns.ts
 *
 * Usage:
 * node scripts/process-vehicle-signs-json.js vehicle-identification-signs-data.json
 *
 * This script:
 * 1. Downloads all images from the JSON data
 * 2. Generates the updated vehicleIdentificationSigns.ts file
 */

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const OUTPUT_DIR = path.join(
  __dirname,
  '../public/vehicle-identification-signs'
);
const VEHICLE_SIGNS_TS_PATH = path.join(
  __dirname,
  '../src/utils/vehicleIdentificationSigns.ts'
);

// Read JSON data from file
let signsData = [];
if (process.argv[2]) {
  const jsonFile = path.resolve(process.argv[2]);
  if (!fs.existsSync(jsonFile)) {
    console.error(`\n❌ Error: File not found: ${jsonFile}\n`);
    process.exit(1);
  }
  try {
    signsData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    if (!Array.isArray(signsData)) {
      console.error(
        'Error: JSON file must contain an array of vehicle identification signs'
      );
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Error reading JSON file: ${error.message}\n`);
    process.exit(1);
  }
} else {
  console.error('No JSON file provided. Usage:');
  console.error(
    '  node scripts/process-vehicle-signs-json.js vehicle-identification-signs-data.json'
  );
  process.exit(1);
}

function extractName(title) {
  // Extract name from title like "«Ավտոգնացք»`" or "«Բժիշկ»`"
  const match = title.match(/«([^»]+)»/);
  return match ? match[1] : title.trim();
}

function extractNumber(imageUrl) {
  // Extract number from URL like "https://varord.am/images/sign/n9/9_1.png"
  // Convert "9_1.png" to "1"
  const urlParts = imageUrl.split('/');
  const filename = urlParts[urlParts.length - 1];

  // Extract number from filename like "9_1.png" -> "1"
  const match = filename.match(/\d+_(\d+)\./);
  return match ? match[1] : null;
}

function getFilenameFromUrl(imageUrl) {
  // Extract filename from URL like "https://varord.am/images/sign/n9/9_1.png"
  // Keep original filename
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

function generateVehicleSignsTS(signs) {
  let content = `export interface VehicleIdentificationSign {
  id: string;
  number: string; // e.g., "1", "2", "13"
  name: string;
  description: string;
  image?: string; // Path to image in public folder
}

export const vehicleIdentificationSigns: VehicleIdentificationSign[] = [
`;

  for (const sign of signs) {
    const nameStr = (sign.name || '').replace(/'/g, "\\'");
    const descStr = (sign.description || '').replace(/'/g, "\\'");

    content += `  {
    id: '${sign.id}',
    number: '${sign.number}',
    name: '${nameStr}',
    description: '${descStr}',
    image: '${sign.image}',
  },\n`;
  }

  content += `];

// Helper functions
export function getAllVehicleSigns(): VehicleIdentificationSign[] {
  return vehicleIdentificationSigns;
}

export function getVehicleSignById(id: string): VehicleIdentificationSign | undefined {
  return vehicleIdentificationSigns.find((sign) => sign.id === id);
}

export function getVehicleSignByNumber(number: string): VehicleIdentificationSign | undefined {
  return vehicleIdentificationSigns.find((sign) => sign.number === number);
}
`;

  return content;
}

async function processSigns() {
  try {
    // Ensure output directory exists
    await fs.ensureDir(OUTPUT_DIR);

    console.log(
      `Processing ${signsData.length} vehicle identification signs...\n`
    );

    // Process each sign
    const processedSigns = [];
    let downloaded = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < signsData.length; i++) {
      const sign = signsData[i];

      // Extract number from image URL
      let number = extractNumber(sign.imageUrl);
      if (!number) {
        // Fallback to index + 1
        number = `${i + 1}`;
      }

      const name = extractName(sign.title);
      const filename = getFilenameFromUrl(sign.imageUrl);
      const imagePath = `/vehicle-identification-signs/${filename}`;

      const filepath = path.join(OUTPUT_DIR, filename);

      // Download image if it doesn't exist
      if (!(await fs.pathExists(filepath))) {
        let success = await downloadImage(sign.imageUrl, filename);
        if (!success) {
          // Retry once
          console.log(`   Retrying ${filename}...`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          success = await downloadImage(sign.imageUrl, filename);
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

      processedSigns.push({
        id: number,
        number: number,
        name: name,
        description: sign.description,
        image: imagePath,
      });
    }

    console.log(`\n📊 Download Summary:`);
    console.log(`   ✓ Downloaded: ${downloaded}`);
    console.log(`   ⊘ Skipped: ${skipped}`);
    console.log(`   ✗ Failed: ${failed}`);

    // Generate vehicleIdentificationSigns.ts file
    console.log('\n📝 Generating vehicleIdentificationSigns.ts...');
    const tsContent = generateVehicleSignsTS(processedSigns);
    await fs.writeFile(VEHICLE_SIGNS_TS_PATH, tsContent, 'utf-8');
    console.log(`✓ Generated ${VEHICLE_SIGNS_TS_PATH}`);

    console.log(
      `\n✅ Process complete! Processed ${processedSigns.length} signs.`
    );
  } catch (error) {
    console.error('Error processing signs:', error.message);
    console.error(error.stack);
  }
}

// Run the script
if (require.main === module) {
  processSigns();
}

module.exports = { processSigns };
