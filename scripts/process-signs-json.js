/**
 * Script to process road signs JSON data, download images, and generate roadSigns.ts
 *
 * Usage:
 * node scripts/process-signs-json.js
 *
 * This script:
 * 1. Downloads all images from the JSON data
 * 2. Generates the updated roadSigns.ts file
 */

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/road-signs');
const ROAD_SIGNS_TS_PATH = path.join(__dirname, '../src/utils/roadSigns.ts');

// Read JSON data from stdin or file
let signsData = [];
if (process.argv[2]) {
  // Read from file
  const jsonFile = path.resolve(process.argv[2]);
  if (!fs.existsSync(jsonFile)) {
    console.error(`\n❌ Error: File not found: ${jsonFile}\n`);
    console.error('Please create a JSON file with your road signs data.');
    console.error('The file should contain a JSON array with objects like:');
    console.error(
      JSON.stringify(
        {
          title: '1.1. «Երկաթուղային գծանց` ուղեփակոցով»',
          description: '...',
          imageUrl: 'https://varord.am/images/sign/n1/1_1.png',
          type: '1. ՆԱԽԱԶԳՈՒՇԱՑՆՈՂ ՆՇԱՆՆԵՐ',
        },
        null,
        2
      )
    );
    console.error('\nUsage:');
    console.error('  node scripts/process-signs-json.js <json-file-path>');
    process.exit(1);
  }
  try {
    signsData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    if (!Array.isArray(signsData)) {
      console.error('Error: JSON file must contain an array of road signs');
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Error reading JSON file: ${error.message}\n`);
    process.exit(1);
  }
} else {
  // Try to read from stdin (for piping JSON)
  try {
    const stdin = fs.readFileSync(0, 'utf-8');
    if (stdin.trim()) {
      signsData = JSON.parse(stdin);
    }
  } catch (e) {
    // If no stdin, use embedded data (will be empty, user needs to provide data)
    console.error('No JSON data provided. Usage:');
    console.error('  node scripts/process-signs-json.js < data.json');
    console.error('  node scripts/process-signs-json.js data.json');
    process.exit(1);
  }
}

// Map type to category
function mapTypeToCategory(type) {
  const typeMap = {
    '1. ՆԱԽԱԶԳՈՒՇԱՑՆՈՂ ՆՇԱՆՆԵՐ': 'warning',
    '2. ԱՌԱՎԵԼՈՒԹՅԱՆ ՆՇԱՆՆԵՐ': 'priority',
    '3. ԱՐԳԵԼՈՂ ՆՇԱՆՆԵՐ': 'prohibitory',
    '4. ԹԵԼԱԴՐՈՂ ՆՇԱՆՆԵՐ': 'mandatory',
    '5. ՀԱՏՈՒԿ ԹԵԼԱԴՐԱՆՔԻ ՆՇԱՆՆԵՐ': 'special',
    '6. ՏԵՂԵԿԱՏՎՈՒԹՅԱՆ ՆՇԱՆՆԵՐ': 'information',
    '7. ՍՊԱՍԱՐԿՄԱՆ ՆՇԱՆՆԵՐ': 'service',
    '8. ԼՐԱՑՈՒՑԻՉ ՏԵՂԵԿԱՏՎՈՒԹՅԱՆ ՆՇԱՆՆԵՐ (ՑՈՒՑԱՆԱԿՆԵՐ)': 'additional',
  };
  return typeMap[type] || 'warning';
}

function extractNumber(title) {
  // Extract number from title like "1.1. «...»" or "1.34.1«...»" or "1.34.1.«...»"
  const match = title.match(/^(\d+\.\d+(?:\.\d+)?)\.?/);
  return match ? match[1] : null;
}

function extractName(title) {
  // Extract name from title like "1.1. «Երկաթուղային գծանց` ուղեփակոցով»"
  const match = title.match(/«([^»]+)»/);
  return match
    ? match[1]
    : title.replace(/^\d+\.\d+(?:\.\d+)?\.?\s*/, '').trim();
}

function getFilenameFromUrl(imageUrl) {
  // Extract filename from URL like "https://varord.am/images/sign/n1/1_1.png"
  // Convert "1_1.png" to "1.1.png"
  const urlParts = imageUrl.split('/');
  const filename = urlParts[urlParts.length - 1];

  // Convert underscores to dots for the number part
  const nameWithoutExt = filename.replace(/\.(png|jpg|jpeg)$/i, '');
  const ext = filename.match(/\.(png|jpg|jpeg)$/i)?.[1] || 'png';

  // Replace underscores with dots
  const convertedName = nameWithoutExt.replace(/_/g, '.');

  return `${convertedName}.${ext}`;
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

function generateRoadSignsTS(signs) {
  const categoryComments = {
    warning: '1. ՆԱԽԱԶԳՈՒՇԱՑՆՈՂ ՆՇԱՆՆԵՐ',
    priority: '2. ԱՌԱՎԵԼՈՒԹՅԱՆ ՆՇԱՆՆԵՐ',
    prohibitory: '3. ԱՐԳԵԼՈՂ ՆՇԱՆՆԵՐ',
    mandatory: '4. ԹԵԼԱԴՐՈՂ ՆՇԱՆՆԵՐ',
    special: '5. ՀԱՏՈՒԿ ԹԵԼԱԴՐԱՆՔԻ ՆՇԱՆՆԵՐ',
    information: '6. ՏԵՂԵԿԱՏՎՈՒԹՅԱՆ ՆՇԱՆՆԵՐ',
    service: '7. ՍՊԱՍԱՐԿՄԱՆ ՆՇԱՆՆԵՐ',
    additional: '8. ԼՐԱՑՈՒՑԻՉ ՏԵՂԵԿԱՏՎՈՒԹՅԱՆ ՆՇԱՆՆԵՐ (ՑՈՒՑԱՆԱԿՆԵՐ)',
  };

  let currentCategory = null;
  let content = `export interface RoadSign {
  id: string;
  number: string; // e.g., "1.1", "3.24"
  name: string;
  description: string;
  category:
    | 'warning'
    | 'priority'
    | 'prohibitory'
    | 'mandatory'
    | 'special'
    | 'information'
    | 'service'
    | 'additional';
  image?: string; // Path to image in public folder
  placement?: string; // Placement instructions
}

export const roadSigns: RoadSign[] = [
`;

  for (const sign of signs) {
    if (sign.category !== currentCategory) {
      if (currentCategory !== null) {
        content += '\n';
      }
      currentCategory = sign.category;
      content += `  // ${categoryComments[sign.category]}\n`;
    }

    const nameStr = sign.name.replace(/'/g, "\\'");
    const descStr = sign.description.replace(/'/g, "\\'");

    content += `  {
    id: '${sign.id}',
    number: '${sign.number}',
    name: '${nameStr}',
    description: '${descStr}',
    category: '${sign.category}',
    image: '${sign.image}',
  },\n`;
  }

  content += `];

// Helper functions
export function getAllSigns(): RoadSign[] {
  return roadSigns;
}

export function getSignsByCategory(category: RoadSign['category']): RoadSign[] {
  return roadSigns.filter((sign) => sign.category === category);
}

export function getSignById(id: string): RoadSign | undefined {
  return roadSigns.find((sign) => sign.id === id);
}

export function getSignByNumber(number: string): RoadSign | undefined {
  return roadSigns.find((sign) => sign.number === number);
}

export const categoryLabels: Record<RoadSign['category'], string> = {
  warning: 'Նախազգուշացնող',
  priority: 'Առավելության',
  prohibitory: 'Արգելող',
  mandatory: 'Թելադրող',
  special: 'Հատուկ թելադրանքի',
  information: 'Տեղեկատվության',
  service: 'Սպասարկման',
  additional: 'Լրացուցիչ տեղեկատվության',
};
`;

  return content;
}

async function processSigns() {
  try {
    // Ensure output directory exists
    await fs.ensureDir(OUTPUT_DIR);

    console.log(`Processing ${signsData.length} road signs...\n`);

    // Process each sign
    const processedSigns = [];
    let downloaded = 0;
    let skipped = 0;
    let failed = 0;

    for (const sign of signsData) {
      const number = extractNumber(sign.title);
      if (!number) {
        console.warn(`⚠ Could not extract number from: ${sign.title}`);
        continue;
      }

      const name = extractName(sign.title);
      const category = mapTypeToCategory(sign.type);
      const filename = getFilenameFromUrl(sign.imageUrl);
      const imagePath = `/road-signs/${filename}`;

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
        category: category,
        image: imagePath,
      });
    }

    console.log(`\n📊 Download Summary:`);
    console.log(`   ✓ Downloaded: ${downloaded}`);
    console.log(`   ⊘ Skipped: ${skipped}`);
    console.log(`   ✗ Failed: ${failed}`);

    // Generate roadSigns.ts file
    console.log('\n📝 Generating roadSigns.ts...');
    const tsContent = generateRoadSignsTS(processedSigns);
    await fs.writeFile(ROAD_SIGNS_TS_PATH, tsContent, 'utf-8');
    console.log(`✓ Generated ${ROAD_SIGNS_TS_PATH}`);

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
