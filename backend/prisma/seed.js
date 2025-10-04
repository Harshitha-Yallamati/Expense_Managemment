const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'ADMIN',
      company: 'Test Company',
      isActive: true,
    },
  });

  // Create company
  const company = await prisma.company.create({
    data: {
      name: 'Test Company',
      defaultCurrency: 'USD',
      adminId: admin.id,
      workflowType: 'SEQUENTIAL',
      percentageRequired: 100,
    },
  });

  console.log('✅ Mock admin created successfully!');
  console.log('📧 Email: admin@test.com');
  console.log('🔑 Password: admin123');
  console.log('🏢 Company: Test Company');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });