import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const users = [
    {
      email: 'user1@example.com',
      name: 'User One',
      password: passwordHash,
    },
    {
      email: 'user2@example.com',
      name: 'User Two',
      password: passwordHash,
    },
    {
      email: 'user3@example.com',
      name: 'User Three',
      password: passwordHash,
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log('Dummy users created');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });