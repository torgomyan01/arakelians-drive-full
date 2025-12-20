/**
 * Script to create an admin user
 * Usage: node scripts/create-admin.js <email> <password> <name>
 * Example: node scripts/create-admin.js admin@example.com password123 "Admin User"
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = process.argv[2];
    const password = process.argv[3];
    const name = process.argv[4] || 'Admin';

    if (!email || !password) {
      console.error(
        '❌ Usage: node scripts/create-admin.js <email> <password> [name]'
      );
      console.error(
        'Example: node scripts/create-admin.js admin@example.com password123 "Admin User"'
      );
      process.exit(1);
    }

    console.log('🔐 Creating admin user...');
    console.log(`Email: ${email}`);
    console.log(`Name: ${name}`);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('⚠️  User with this email already exists');
      console.log('Updating user to admin role...');

      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: 'admin',
          name: name,
        },
      });

      console.log('✅ User updated to admin successfully!');
      console.log(`User ID: ${updatedUser.id}`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'admin',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log(`User ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createAdmin()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
