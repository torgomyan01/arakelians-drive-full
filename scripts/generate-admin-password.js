/**
 * Script to generate bcrypt hash for admin password
 * Usage: node scripts/generate-admin-password.js <password>
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/generate-admin-password.js <password>');
  process.exit(1);
}

if (password.length < 8) {
  console.warn('Warning: Password should be at least 8 characters long');
}

bcrypt.hash(password, 12, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }

  console.log('\n✅ Password hash generated successfully!\n');
  console.log('Add these to your .env file:\n');
  console.log(`ADMIN_USERNAME=your_admin_username`);
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log(
    `ADMIN_JWT_SECRET=${require('crypto').randomBytes(32).toString('hex')}\n`
  );
  console.log(
    '⚠️  Keep these credentials secure and never commit them to version control!\n'
  );
});
