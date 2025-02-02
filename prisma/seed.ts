import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Limpiar la base de datos
  await prisma.logMessage.deleteMany()
  await prisma.chatTitle.deleteMany()
  await prisma.user.deleteMany()
  await prisma.userType.deleteMany()
  await prisma.customer.deleteMany()

  // Crear tipos de usuario
  const userTypes = await Promise.all([
    prisma.userType.create({
      data: {
        name: 'ADMIN',
      },
    }),
    prisma.userType.create({
      data: {
        name: 'USER',
      },
    }),
  ])

  // Crear customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Customer 1',
        desc: 'Description for Customer 1',
        urlRoute: 'customer-1',
        publicId: 'CUST1',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Customer 2',
        desc: 'Description for Customer 2',
        urlRoute: 'customer-2',
        publicId: 'CUST2',
      },
    }),
  ])

  // Crear usuarios
  const hashedPassword = await hash('password123', 12)

  const users = await Promise.all([
    // Admin user
    prisma.user.create({
      data: {
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: hashedPassword,
        status: true,
        userTypeId: userTypes[0].id, // ADMIN
        customerId: customers[0].id,
      },
    }),
    // Regular user
    prisma.user.create({
      data: {
        username: 'user1',
        firstName: 'Regular',
        lastName: 'User',
        email: 'user@example.com',
        password: hashedPassword,
        status: true,
        userTypeId: userTypes[1].id, // USER
        customerId: customers[1].id,
      },
    }),
  ])

  // Crear chats y mensajes
  const chats = await Promise.all([
    prisma.chatTitle.create({
      data: {
        title: 'First Chat',
        logMessages: {
          create: {
            userId: users[0].id,
            messageIn: 'Hello, how can I help?',
            messageOut: 'Hi! I need assistance.',
            response: 'OK',
            tokenRead: 10,
            tokenGen: 15,
          },
        },
      },
    }),
    prisma.chatTitle.create({
      data: {
        title: 'Second Chat',
        logMessages: {
          create: {
            userId: users[1].id,
            messageIn: 'What can you do?',
            messageOut: 'I can help you with many things!',
            response: 'OK',
            tokenRead: 8,
            tokenGen: 12,
          },
        },
      },
    }),
  ])

  console.log({
    userTypes,
    customers,
    users,
    chats,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })