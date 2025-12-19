/**
 * Helper script to create JSON file from data and run process-signs-json.js
 *
 * Usage:
 *   node scripts/create-and-run.js <json-file-path> <json-data-as-string>
 *   OR pipe JSON data:
 *   echo '[{"title":"..."}]' | node scripts/create-and-run.js road-signs-data.json
 */

const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

const jsonFilePath = process.argv[2];
const jsonDataArg = process.argv[3];

if (!jsonFilePath) {
  console.error(
    'Usage: node scripts/create-and-run.js <json-file-path> [json-data]'
  );
  console.error(
    'Example: node scripts/create-and-run.js road-signs-data.json \'[{"title":"..."}]\''
  );
  console.error(
    "Or pipe: echo '[...]' | node scripts/create-and-run.js road-signs-data.json"
  );
  process.exit(1);
}

let jsonData = null;

// Try to get JSON data from command line argument
if (jsonDataArg) {
  try {
    jsonData = JSON.parse(jsonDataArg);
  } catch (e) {
    console.error('Error: Invalid JSON in command line argument');
    process.exit(1);
  }
} else {
  // Try to read from stdin
  try {
    const stdin = fs.readFileSync(0, 'utf-8');
    if (stdin.trim()) {
      jsonData = JSON.parse(stdin);
    }
  } catch (e) {
    // No stdin data
  }
}

// If we have JSON data, write it to file
if (jsonData) {
  const fullPath = path.resolve(jsonFilePath);
  try {
    if (!Array.isArray(jsonData)) {
      console.error('Error: JSON data must be an array');
      process.exit(1);
    }
    fs.writeFileSync(fullPath, JSON.stringify(jsonData, null, 2), 'utf-8');
    console.log(
      `✓ Created JSON file: ${fullPath} (${jsonData.length} signs)\n`
    );
  } catch (error) {
    console.error(`Error writing file: ${error.message}`);
    process.exit(1);
  }
} else {
  // No data provided, check if file exists
  const fullPath = path.resolve(jsonFilePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`Error: File not found: ${fullPath}`);
    console.error('Please provide JSON data either as:');
    console.error(
      "  1. Command line argument: node scripts/create-and-run.js file.json '[...]'"
    );
    console.error(
      "  2. Piped input: echo '[...]' | node scripts/create-and-run.js file.json"
    );
    console.error('  3. Or create the file manually first');
    process.exit(1);
  }
}

// Run the processing script
const fullPath = path.resolve(jsonFilePath);
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
