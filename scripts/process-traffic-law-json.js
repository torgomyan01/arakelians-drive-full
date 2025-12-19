/**
 * Script to process traffic law JSON data and generate trafficLaw.ts
 *
 * Usage:
 * node scripts/process-traffic-law-json.js traffic-law-data.json
 *
 * This script:
 * 1. Processes JSON data
 * 2. Generates the updated trafficLaw.ts file
 */

const fs = require('fs-extra');
const path = require('path');

const TRAFFIC_LAW_TS_PATH = path.join(__dirname, '../src/utils/trafficLaw.ts');

// Read JSON data from file
let lawData = [];
if (process.argv[2]) {
  const jsonFile = path.resolve(process.argv[2]);
  if (!fs.existsSync(jsonFile)) {
    console.error(`\n❌ Error: File not found: ${jsonFile}\n`);
    process.exit(1);
  }
  try {
    lawData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    if (!Array.isArray(lawData)) {
      console.error('Error: JSON file must contain an array of law items');
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Error reading JSON file: ${error.message}\n`);
    process.exit(1);
  }
} else {
  console.error('No JSON file provided. Usage:');
  console.error(
    '  node scripts/process-traffic-law-json.js traffic-law-data.json'
  );
  process.exit(1);
}

// Map type to category
function mapTypeToCategory(type) {
  // Check if it's a concept
  if (type === 'Օրենքում կիրառվող հասկացություններ') {
    return 'concepts';
  }

  // Check if it's an article
  if (type.startsWith('Հոդված')) {
    // Extract article number from type like "Հոդված 13․ Տրանսպորտային միջոցների պետական գրանցումը..."
    const articleMatch = type.match(/Հոդված\s+(\d+)/);
    if (articleMatch) {
      return `article-${articleMatch[1]}`;
    }
    return 'article-other';
  }

  return 'other';
}

function extractName(title) {
  // Extract name from title - usually the first word/phrase before newline or description
  // For concepts, it's usually the first word/phrase
  // For articles, it might be a number like "1.", "1.1.", etc.

  // Clean title first
  const cleaned = cleanTitle(title);

  // Try to extract concept name (usually first word/phrase)
  // For concepts: "Անբավարար տեսանելիություն" or "Ավտոդրոմ"
  // For articles: "1.", "1.1.", "2.", etc.

  // Check if it starts with a number (article)
  const numberMatch = cleaned.match(/^(\d+(?:\.\d+)*)\.?\s*(.+)/);
  if (numberMatch) {
    return numberMatch[1]; // Return the number
  }

  // Try to extract concept name (first word/phrase, usually ends before description)
  const conceptMatch = cleaned.match(/^([Ա-Ֆա-ֆ]+(?:\s+[Ա-Ֆա-ֆ]+)*)/);
  if (conceptMatch) {
    return conceptMatch[1].trim();
  }

  // Fallback: return first 50 characters
  return cleaned.substring(0, 50).trim();
}

function cleanTitle(title) {
  // Remove extra whitespace and newlines
  return title.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
}

function generateTrafficLawTS(items) {
  const categoryComments = {
    concepts: 'Օրենքում կիրառվող հասկացություններ',
    'article-13':
      'Հոդված 13․ Տրանսպորտային միջոցների պետական գրանցումը, պետական հաշվառումը և սահմանափակումները',
    'article-14':
      'Հոդված 14. Տրանսպորտային միջոցների շահագործման ընթացքում ճանապարհային երթևեկության անվտանգության ապահովման հիմնական պահանջները',
    'article-24':
      'Հոդված 24. Տրանսպորտային միջոցների սեփականատերերի և վարորդների հիմնական պարտականությունները',
    'article-27':
      'Հոդված 27. Տրանսպորտային միջոցների դասակարգումը և դրանք վարելու իրավունքը',
    'article-28':
      'Հոդված 28. Տրանսպորտային միջոցի վարորդի ուսուցման հիմնական պահանջները',
    'article-other': 'Այլ հոդվածներ',
    other: 'Այլ',
  };

  // Collect all unique categories
  const categories = new Set();
  items.forEach((item) => {
    categories.add(item.category);
  });

  let currentCategory = null;
  let content = `export interface TrafficLawItem {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const trafficLawItems: TrafficLawItem[] = [
`;

  for (const item of items) {
    if (item.category !== currentCategory) {
      if (currentCategory !== null) {
        content += '\n';
      }
      currentCategory = item.category;
      const comment = categoryComments[currentCategory] || currentCategory;
      content += `  // ${comment}\n`;
    }

    const descStr = (item.description || '').replace(/'/g, "\\'");

    content += `  {
    id: '${item.id}',
    name: '${item.name.replace(/'/g, "\\'")}',
    description: '${descStr}',
    category: '${item.category}',
  },\n`;
  }

  content += `];

// Helper functions
export function getAllTrafficLawItems(): TrafficLawItem[] {
  return trafficLawItems;
}

export function getTrafficLawItemsByCategory(
  category: string
): TrafficLawItem[] {
  return trafficLawItems.filter((item) => item.category === category);
}

export function getTrafficLawItemById(id: string): TrafficLawItem | undefined {
  return trafficLawItems.find((item) => item.id === id);
}

export const categoryLabels: Record<string, string> = {
  concepts: 'Օրենքում կիրառվող հասկացություններ',
  'article-13': 'Հոդված 13',
  'article-14': 'Հոդված 14',
  'article-24': 'Հոդված 24',
  'article-27': 'Հոդված 27',
  'article-28': 'Հոդված 28',
  'article-other': 'Այլ հոդվածներ',
  other: 'Այլ',
};
`;

  return content;
}

async function processLawItems() {
  try {
    console.log(`Processing ${lawData.length} traffic law items...\n`);

    // Process each item
    const processedItems = [];

    for (let i = 0; i < lawData.length; i++) {
      const item = lawData[i];

      const name = extractName(item.title);
      const description = cleanTitle(item.title);
      const category = mapTypeToCategory(item.type);
      const id = `${category}-${i + 1}`;

      processedItems.push({
        id: id,
        name: name,
        description: description,
        category: category,
      });
    }

    // Generate trafficLaw.ts file
    console.log('\n📝 Generating trafficLaw.ts...');
    const tsContent = generateTrafficLawTS(processedItems);
    await fs.writeFile(TRAFFIC_LAW_TS_PATH, tsContent, 'utf-8');
    console.log(`✓ Generated ${TRAFFIC_LAW_TS_PATH}`);

    console.log(
      `\n✅ Process complete! Processed ${processedItems.length} items.`
    );
  } catch (error) {
    console.error('Error processing law items:', error.message);
    console.error(error.stack);
  }
}

// Run the script
if (require.main === module) {
  processLawItems();
}

module.exports = { processLawItems };
