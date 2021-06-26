import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearOrders() {
  console.log('Clearing orders...');

  const res = await prisma.order.deleteMany();

  console.log(`Deleted ${res.count} order(s).`);
}

async function updatePrices() {
  console.log('Updating prices...');
  const result = await prisma.order.findMany({
    include: {
      lineItems: {
        include: {
          item: true
        }
      }
    }
  });

  result.forEach(async order => {
    const totalPrice = order.lineItems.reduce((sum, cur) => {
      return sum + (cur.quantity * cur.item.unitPrice);
    }, 0);

    await prisma.order.update({
      where: {
        id: order.id
      },
      data: {
        totalPrice
      }
    });
  });
}

export default async function execute() {
  updatePrices().catch(err => {
    console.log(err);
    process.exit(0);
  }).finally(async () => {
    await prisma.$disconnect();
    console.log('Finished!');
  });
}