import { PrismaClient } from '@prisma/client';
import menuItems from './seeds/menu';

const prisma = new PrismaClient();

async function seed() {
  menuItems.forEach(async (item) => {
    console.log(item);

    const t = await prisma.item.upsert({
      where: {
        id: item.id
      },
      create: item,
      update: item
    }).catch(err => {
      console.log(err);
    });

    console.log(t);
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
  });