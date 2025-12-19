/**
 * Script to download road sign images from varord.am
 *
 * Usage:
 * node scripts/download-road-signs.js
 *
 * This script will download road sign images and save them to public/road-signs/
 *
 * Note: You may need to install dependencies:
 * npm install axios cheerio fs-extra
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

const BASE_URL = 'https://www.varord.am';
const ROAD_SIGNS_URL = `${BASE_URL}/գիտելիքի-բազա/ճանապարհային-նշաններ`;
const OUTPUT_DIR = path.join(__dirname, '../public/road-signs');

// Helper function to get all signs from roadSigns.ts file

async function downloadImage(imageUrl, filename) {
  try {
    // Handle relative URLs
    let fullUrl = imageUrl;
    if (!imageUrl.startsWith('http')) {
      if (imageUrl.startsWith('//')) {
        fullUrl = `https:${imageUrl}`;
      } else if (imageUrl.startsWith('/')) {
        fullUrl = `${BASE_URL}${imageUrl}`;
      } else {
        fullUrl = `${BASE_URL}/${imageUrl}`;
      }
    }

    const response = await axios({
      method: 'GET',
      url: fullUrl,
      responseType: 'arraybuffer',
      timeout: 30000, // Increased timeout
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

async function scrapeRoadSigns() {
  try {
    console.log('Fetching road signs page...');
    const response = await axios.get(ROAD_SIGNS_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 30000,
    });
    const $ = cheerio.load(response.data);

    // Debug: Save HTML for inspection
    const debugHtmlPath = path.join(OUTPUT_DIR, 'debug-page.html');
    await fs.writeFile(debugHtmlPath, response.data);
    console.log(`Debug: Saved HTML to ${debugHtmlPath}`);

    // Debug: Count all images
    const allImages = $('img').length;
    console.log(`Debug: Found ${allImages} total images on page`);

    // Ensure output directory exists
    await fs.ensureDir(OUTPUT_DIR);

    // Get all expected sign numbers from our data
    const allSigns = getAllSigns();
    const expectedNumbers = new Set(allSigns.map((s) => s.number));
    console.log(`Expected ${expectedNumbers.size} road signs`);
    console.log(
      `Sample numbers: ${Array.from(expectedNumbers).slice(0, 5).join(', ')}...`
    );

    // Map to store found images: number -> url
    const foundImages = new Map();

    // Strategy 0: Extract from alt attribute (most reliable - images have alt like "1.1. «...»")
    console.log('\n🔍 Strategy 0: Extracting from alt attributes...');
    let strategy0Found = 0;
    $('img[alt]').each((i, img) => {
      const $img = $(img);
      const alt = $img.attr('alt') || '';
      const src =
        $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src');

      if (!src) return;

      // Extract number from alt: "1.1. «Երկաթուղային գծանց` ուղեփակոցով»"
      const numberMatch = alt.match(/^(\d+\.\d+(?:\.\d+)?)/);
      if (numberMatch) {
        const signNumber = numberMatch[1];
        if (expectedNumbers.has(signNumber) && !foundImages.has(signNumber)) {
          foundImages.set(signNumber, src);
          strategy0Found++;
        }
      }
    });
    console.log(`   Found ${strategy0Found} images from alt attributes`);

    // Strategy 1: Look for images in div.div128 before h4 headings
    console.log('🔍 Strategy 1: Searching div.div128 before h4 headings...');
    let strategy1Found = 0;
    $('h4').each((i, heading) => {
      const headingText = $(heading).text();
      const numberMatch = headingText.match(/^(\d+\.\d+(?:\.\d+)?)/);
      if (numberMatch) {
        const signNumber = numberMatch[1];
        if (expectedNumbers.has(signNumber) && !foundImages.has(signNumber)) {
          // Look for image in div.div128 before the heading
          const $prevDiv = $(heading).prev('div.div128');
          if ($prevDiv.length > 0) {
            $prevDiv.find('img').each((j, img) => {
              const $img = $(img);
              const src = $img.attr('src') || $img.attr('data-src');
              if (src) {
                foundImages.set(signNumber, src);
                strategy1Found++;
              }
            });
          }
        }
      }
    });
    console.log(`   Found ${strategy1Found} images near headings`);

    // Strategy 2: Look for all images and try to match with nearby text
    console.log('🔍 Strategy 2: Searching all images with nearby text...');
    let strategy2Found = 0;
    $('img').each((i, elem) => {
      const $img = $(elem);
      const src =
        $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src');
      if (!src || src.includes('logo') || src.includes('icon')) return;

      // Try to find sign number in nearby elements (check parent, siblings, and nearby text)
      const $parent = $img.closest('div, p, section, article, li');
      const parentText = $parent.text();

      // Also check previous sibling (often contains the number)
      const $prevSibling = $img.prev();
      const prevText = $prevSibling.text();
      const combinedText = parentText + ' ' + prevText;

      // Look for number patterns
      const numberMatches = combinedText.matchAll(/(\d+\.\d+(?:\.\d+)?)/g);
      for (const match of numberMatches) {
        const signNumber = match[1];
        if (expectedNumbers.has(signNumber) && !foundImages.has(signNumber)) {
          foundImages.set(signNumber, src);
          strategy2Found++;
          break;
        }
      }
    });
    console.log(`   Found ${strategy2Found} images`);

    // Strategy 3: Look for images in specific containers (common patterns)
    $('[class*="sign"], [id*="sign"], [class*="նշան"]').each((i, container) => {
      const $container = $(container);
      const containerText = $container.text();
      const numberMatch = containerText.match(/(\d+\.\d+(?:\.\d+)?)/);
      if (numberMatch) {
        const signNumber = numberMatch[1];
        $container.find('img').each((j, img) => {
          const src = $(img).attr('src') || $(img).attr('data-src');
          if (
            src &&
            expectedNumbers.has(signNumber) &&
            !foundImages.has(signNumber)
          ) {
            foundImages.set(signNumber, src);
          }
        });
      }
    });

    console.log(`\n📊 Found ${foundImages.size} road sign images total`);

    // Download found images
    let downloaded = 0;
    let skipped = 0;
    let failed = 0;

    for (const [number, url] of foundImages.entries()) {
      const extension = path.extname(url) || '.jpg';
      const filename = `${number}${extension}`;
      const filepath = path.join(OUTPUT_DIR, filename);

      // Skip if already exists (unless it's a failed download)
      if (await fs.pathExists(filepath)) {
        const stats = await fs.stat(filepath);
        // If file is very small (< 1KB), it might be corrupted, try again
        if (stats.size < 1024) {
          console.log(`⚠ File ${filename} seems corrupted, re-downloading...`);
          await fs.remove(filepath);
        } else {
          console.log(`⊘ Skipped (exists): ${filename}`);
          skipped++;
          continue;
        }
      }

      let success = await downloadImage(url, filename);
      if (!success) {
        // Retry once for failed downloads
        console.log(`   Retrying ${filename}...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        success = await downloadImage(url, filename);
      }

      if (success) {
        downloaded++;
      } else {
        failed++;
      }

      // Add delay to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✓ Downloaded: ${downloaded}`);
    console.log(`   ⊘ Skipped: ${skipped}`);
    console.log(`   ✗ Failed: ${failed}`);
    console.log(`   📋 Expected: ${expectedNumbers.size}`);
    console.log(`   🔍 Found: ${foundImages.size}`);

    // List missing signs
    const missing = Array.from(expectedNumbers).filter(
      (n) => !foundImages.has(n)
    );
    if (missing.length > 0) {
      console.log(`\n⚠ Missing images for ${missing.length} signs:`);
      missing.slice(0, 10).forEach((n) => console.log(`   - ${n}`));
      if (missing.length > 10) {
        console.log(`   ... and ${missing.length - 10} more`);
      }
    }

    console.log('\n✓ Download process complete!');
  } catch (error) {
    console.error('Error scraping road signs:', error.message);
    console.error(error.stack);
    console.log(
      '\nNote: You may need to manually download images from varord.am'
    );
    console.log(
      'Place them in public/road-signs/ with filenames like: 1.1.jpg, 1.2.jpg, etc.'
    );
  }
}

// Helper function to get all signs from roadSigns.ts file
function getAllSigns() {
  try {
    const roadSignsPath = path.join(__dirname, '../src/utils/roadSigns.ts');
    const content = fs.readFileSync(roadSignsPath, 'utf-8');

    // Extract sign numbers using regex - look for number: 'X.X' or number: "X.X"
    const signMatches = [];
    const regex = /number:\s*['"]([\d.]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      signMatches.push({ number: match[1] });
    }

    return signMatches;
  } catch (error) {
    console.error('Error reading roadSigns.ts:', error.message);
    return [];
  }
}

// Run the script
if (require.main === module) {
  scrapeRoadSigns();
}

module.exports = { scrapeRoadSigns, downloadImage, getAllSigns };
