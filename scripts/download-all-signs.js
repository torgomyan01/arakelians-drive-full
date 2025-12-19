/**
 * Script to download all road sign images from the provided JSON data
 *
 * Usage:
 * node scripts/download-all-signs.js
 *
 * This script downloads images from varord.am and saves them to public/road-signs/
 */

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/road-signs');

// JSON data provided by user
const signsData = require('../signs-data.json');

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

function extractNumber(title) {
  // Extract number from title like "1.1. «...»" or "1.34.1«...»"
  const match = title.match(/^(\d+\.\d+(?:\.\d+)?)/);
  return match ? match[1] : null;
}

function getFilenameFromUrl(imageUrl) {
  // Extract filename from URL like "https://varord.am/images/sign/n1/1_1.png"
  // Convert "1_1.png" to "1.1.png"
  const urlParts = imageUrl.split('/');
  const filename = urlParts[urlParts.length - 1];

  // Convert underscores to dots for the number part
  // e.g., "1_1.png" -> "1.1.png", "1_34_1.png" -> "1.34.1.png"
  const nameWithoutExt = filename.replace(/\.(png|jpg|jpeg)$/i, '');
  const ext = filename.match(/\.(png|jpg|jpeg)$/i)?.[1] || 'png';

  // Replace underscores with dots
  const convertedName = nameWithoutExt.replace(/_/g, '.');

  return `${convertedName}.${ext}`;
}

async function downloadAllImages() {
  try {
    // Ensure output directory exists
    await fs.ensureDir(OUTPUT_DIR);

    console.log(
      `Starting download of ${signsData.length} road sign images...\n`
    );

    let downloaded = 0;
    let skipped = 0;
    let failed = 0;

    for (const sign of signsData) {
      const number = extractNumber(sign.title);
      if (!number) {
        console.warn(`⚠ Could not extract number from: ${sign.title}`);
        continue;
      }

      const filename = getFilenameFromUrl(sign.imageUrl);
      const filepath = path.join(OUTPUT_DIR, filename);

      // Skip if already exists
      if (await fs.pathExists(filepath)) {
        const stats = await fs.stat(filepath);
        if (stats.size < 1024) {
          console.log(`⚠ File ${filename} seems corrupted, re-downloading...`);
          await fs.remove(filepath);
        } else {
          console.log(`⊘ Skipped (exists): ${filename}`);
          skipped++;
          continue;
        }
      }

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
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✓ Downloaded: ${downloaded}`);
    console.log(`   ⊘ Skipped: ${skipped}`);
    console.log(`   ✗ Failed: ${failed}`);
    console.log(`   📋 Total: ${signsData.length}`);

    console.log('\n✓ Download process complete!');
  } catch (error) {
    console.error('Error downloading images:', error.message);
    console.error(error.stack);
  }
}

// Run the script
if (require.main === module) {
  downloadAllImages();
}

module.exports = { downloadAllImages, extractNumber, getFilenameFromUrl };
