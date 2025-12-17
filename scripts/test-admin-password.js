/**
 * Script to test admin password hash
 * Usage: node scripts/test-admin-password.js <password>
 */

const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env' });

const password = process.argv[2];
const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
const username = process.env.ADMIN_USERNAME?.trim();

if (!password) {
  console.error('Usage: node scripts/test-admin-password.js <password>');
  process.exit(1);
}

if (!hash) {
  console.error('ERROR: ADMIN_PASSWORD_HASH not found in .env file');
  process.exit(1);
}

if (!username) {
  console.error('ERROR: ADMIN_USERNAME not found in .env file');
  process.exit(1);
}

console.log('\n🔍 Testing admin credentials...\n');
console.log('Username from .env:', username);
console.log('Hash from .env:', hash.substring(0, 20) + '...');
console.log('Password to test:', '*'.repeat(password.length));
console.log('');

bcrypt.compare(password, hash, (err, result) => {
  if (err) {
    console.error('❌ Error comparing password:', err);
    process.exit(1);
  }

  if (result) {
    console.log('✅ Password matches!');
    console.log('✅ Username:', username);
    console.log('\nYou can use these credentials to login.');
  } else {
    console.log('❌ Password does NOT match!');
    console.log('\nPlease check:');
    console.log('1. The password you entered');
    console.log('2. The ADMIN_PASSWORD_HASH in .env file');
    console.log('\nTo generate a new hash, run:');
    console.log('node scripts/generate-admin-password.js "your_password"');
  }
});
