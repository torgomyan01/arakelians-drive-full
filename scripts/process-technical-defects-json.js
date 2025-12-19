/**
 * Script to process vehicle technical defects JSON data and generate vehicleTechnicalDefects.ts
 *
 * Usage:
 * node scripts/process-technical-defects-json.js vehicle-technical-defects-data.json
 *
 * This script:
 * 1. Processes JSON data
 * 2. Generates the updated vehicleTechnicalDefects.ts file
 */

const fs = require('fs-extra');
const path = require('path');

const TECHNICAL_DEFECTS_TS_PATH = path.join(
  __dirname,
  '../src/utils/vehicleTechnicalDefects.ts'
);

// Read JSON data from file
let defectsData = [];
if (process.argv[2]) {
  const jsonFile = path.resolve(process.argv[2]);
  if (!fs.existsSync(jsonFile)) {
    console.error(`\n❌ Error: File not found: ${jsonFile}\n`);
    process.exit(1);
  }
  try {
    defectsData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    if (!Array.isArray(defectsData)) {
      console.error(
        'Error: JSON file must contain an array of technical defects'
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
    '  node scripts/process-technical-defects-json.js vehicle-technical-defects-data.json'
  );
  process.exit(1);
}

// Map type to category
function mapTypeToCategory(type) {
  const typeMap = {
    'ԱՐԳԵԼԱԿԱՅԻՆ ՀԱՄԱԿԱՐԳԵՐԻ ԱՆՍԱՐՔՈՒԹՅՈՒՆՆԵՐԻ ՈՒ ՊԱՅՄԱՆՆԵՐԻ ՑԱՆԿ': 'braking',
    'ՂԵԿԱՅԻՆ ԿԱՌԱՎԱՐՄԱՆ ՀԱՄԱԿԱՐԳԵՐԻ ԱՆՍԱՐՔՈՒԹՅՈՒՆՆԵՐԻ ՈՒ ՊԱՅՄԱՆՆԵՐԻ ՑԱՆԿ':
      'steering',
    'ԱՐՏԱՔԻՆ ԼՈՒՍԱՅԻՆ ՍԱՐՔԵՐԻ ԱՆՍԱՐՔՈՒԹՅՈՒՆՆԵՐԻ ՈՒ ՊԱՅՄԱՆՆԵՐԻ ՑԱՆԿ': 'lighting',
    'ԱՆԻՎՆԵՐԻ ՈՒ ԴՈՂԵՐԻ ԱՆՍԱՐՔՈՒԹՅՈՒՆՆԵՐԻ ՈՒ ՊԱՅՄԱՆՆԵՐԻ ՑԱՆԿ': 'wheels',
    'ՇԱՐԺԻՉԻ ԱՆՍԱՐՔՈՒԹՅՈՒՆՆԵՐԻ ՈՒ ՊԱՅՄԱՆՆԵՐԻ ՑԱՆԿ': 'engine',
    'ԱՅԼ ԱՆՍԱՐՔՈՒԹՅՈՒՆՆԵՐԻ ՈՒ ՊԱՅՄԱՆՆԵՐԻ ՑԱՆԿ': 'other',
  };
  return typeMap[type] || 'other';
}

function extractNumber(title) {
  // Extract number from title like "1) ..." or "1. ..."
  const match = title.match(/^(\d+)\)/);
  return match ? match[1] : null;
}

function cleanTitle(title) {
  // Remove extra whitespace and newlines
  return title.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
}

function generateTechnicalDefectsTS(defects) {
  const categoryComments = {
    braking: 'ԱՐԳԵԼԱԿԱՅԻՆ ՀԱՄԱԿԱՐԳԵՐԻ ԱՆՍԱՐՔՈՒԹՅՈՒՆՆԵՐԻ ՈՒ ՊԱՅՄԱՆՆԵՐԻ ՑԱՆԿ',
    steering:
      'ՂԵԿԱՅԻՆ ԿԱՌԱՎԱՐՄԱՆ ՀԱՄԱԿԱՐԳԵՐԻ ԱՆՍԱՐՔՈՒԹՅՈՒՆՆԵՐԻ ՈՒ ՊԱՅՄԱՆՆԵՐԻ ՑԱՆԿ',
    lighting: 'ԱՐՏԱՔԻՆ ԼՈՒՍԱՅԻՆ ՍԱՐՔԵՐԻ ԱՆՍԱՐՔՈՒԹՅՈՒՆՆԵՐԻ ՈՒ ՊԱՅՄԱՆՆԵՐԻ ՑԱՆԿ',
    wheels: 'ԱՆԻՎՆԵՐԻ ՈՒ ԴՈՂԵՐԻ ԱՆՍԱՐՔՈՒԹՅՈՒՆՆԵՐԻ ՈՒ ՊԱՅՄԱՆՆԵՐԻ ՑԱՆԿ',
    engine: 'ՇԱՐԺԻՉԻ ԱՆՍԱՐՔՈՒԹՅՈՒՆՆԵՐԻ ՈՒ ՊԱՅՄԱՆՆԵՐԻ ՑԱՆԿ',
    other: 'ԱՅԼ ԱՆՍԱՐՔՈՒԹՅՈՒՆՆԵՐԻ ՈՒ ՊԱՅՄԱՆՆԵՐԻ ՑԱՆԿ',
  };

  let currentCategory = null;
  let content = `export interface VehicleTechnicalDefect {
  id: string;
  number: string; // e.g., "1", "2"
  description: string;
  category:
    | 'braking'
    | 'steering'
    | 'lighting'
    | 'wheels'
    | 'engine'
    | 'other';
}

export const vehicleTechnicalDefects: VehicleTechnicalDefect[] = [
`;

  for (const defect of defects) {
    if (defect.category !== currentCategory) {
      if (currentCategory !== null) {
        content += '\n';
      }
      currentCategory = defect.category;
      content += `  // ${categoryComments[defect.category]}\n`;
    }

    const descStr = (defect.description || '').replace(/'/g, "\\'");

    content += `  {
    id: '${defect.id}',
    number: '${defect.number}',
    description: '${descStr}',
    category: '${defect.category}',
  },\n`;
  }

  content += `];

// Helper functions
export function getAllTechnicalDefects(): VehicleTechnicalDefect[] {
  return vehicleTechnicalDefects;
}

export function getTechnicalDefectsByCategory(
  category: VehicleTechnicalDefect['category']
): VehicleTechnicalDefect[] {
  return vehicleTechnicalDefects.filter((defect) => defect.category === category);
}

export function getTechnicalDefectById(id: string): VehicleTechnicalDefect | undefined {
  return vehicleTechnicalDefects.find((defect) => defect.id === id);
}

export function getTechnicalDefectByNumber(
  number: string
): VehicleTechnicalDefect | undefined {
  return vehicleTechnicalDefects.find((defect) => defect.number === number);
}

export const categoryLabels: Record<VehicleTechnicalDefect['category'], string> = {
  braking: 'Արգելակային համակարգ',
  steering: 'Ղեկային կառավարման համակարգ',
  lighting: 'Արտաքին լուսային սարքեր',
  wheels: 'Անիվներ և դողեր',
  engine: 'Շարժիչ',
  other: 'Այլ',
};
`;

  return content;
}

async function processDefects() {
  try {
    console.log(
      `Processing ${defectsData.length} vehicle technical defects...\n`
    );

    // Process each defect
    const processedDefects = [];

    for (let i = 0; i < defectsData.length; i++) {
      const defect = defectsData[i];

      // Extract number from title
      let number = extractNumber(defect.title);
      if (!number) {
        // Fallback to index + 1
        number = `${i + 1}`;
      }

      const description = cleanTitle(defect.title);
      const category = mapTypeToCategory(defect.type);
      const id = `${category}-${number}`;

      processedDefects.push({
        id: id,
        number: number,
        description: description,
        category: category,
      });
    }

    // Generate vehicleTechnicalDefects.ts file
    console.log('\n📝 Generating vehicleTechnicalDefects.ts...');
    const tsContent = generateTechnicalDefectsTS(processedDefects);
    await fs.writeFile(TECHNICAL_DEFECTS_TS_PATH, tsContent, 'utf-8');
    console.log(`✓ Generated ${TECHNICAL_DEFECTS_TS_PATH}`);

    console.log(
      `\n✅ Process complete! Processed ${processedDefects.length} defects.`
    );
  } catch (error) {
    console.error('Error processing defects:', error.message);
    console.error(error.stack);
  }
}

// Run the script
if (require.main === module) {
  processDefects();
}

module.exports = { processDefects };
