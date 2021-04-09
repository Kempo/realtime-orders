import { PrismaClient } from '@prisma/client';
import menuItems from './seeds/menu';

const prisma = new PrismaClient();

async function seed() {
  menuItems.forEach(async (item) => {
    await prisma.item.upsert({
      where: {
        title: item.title
      },
      create: item,
      update: item
    }).catch(err => {
      console.log(err);
    });
  });

  console.log('Seeding finished!');
}

// starts seeding the db
seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })