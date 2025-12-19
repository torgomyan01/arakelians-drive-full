/**
 * Helper script to accept JSON data and run process-signs-json.js
 *
 * Usage:
 *   node scripts/run-with-json.js <json-file-path>
 *   OR
 *   node scripts/run-with-json.js (will prompt for file path)
 */

const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

const jsonFilePath = process.argv[2];

if (!jsonFilePath) {
  console.error('Usage: node scripts/run-with-json.js <json-file-path>');
  console.error('Example: node scripts/run-with-json.js road-signs-data.json');
  process.exit(1);
}

const fullPath = path.resolve(jsonFilePath);

if (!fs.existsSync(fullPath)) {
  console.error(`Error: File not found: ${fullPath}`);
  console.error(
    '\nPlease create the JSON file first with your road signs data.'
  );
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
  process.exit(1);
}

// Validate JSON
try {
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  if (!Array.isArray(data)) {
    console.error('Error: JSON file must contain an array of road signs');
    process.exit(1);
  }
  console.log(`✓ Found ${data.length} road signs in JSON file\n`);
} catch (error) {
  console.error('Error: Invalid JSON file:', error.message);
  process.exit(1);
}

// Run the processing script
console.log('Running process-signs-json.js...\n');
const processScript = spawn(
  'node',
  [path.join(__dirname, 'process-signs-json.js'), fullPath],
  {
    stdio: 'inherit',
    shell: true,
  }
);

processScript.on('close', (code) => {
  process.exit(code);
});
