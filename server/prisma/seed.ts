import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const orders = [
  {
    title: "Mark",
    lineItems: {
      create: [
        {
          quantity: 3,
          item: {
            create: {
              title: "Lamb Shawarma",
              unitPrice: 750
            }
          }
        },
        {
          quantity: 2,
          item: {
            create: {
              title: "French Fries",
              unitPrice: 300
            }
          }
        }
      ]
    }
  },
  {
    title: "Sam",
    lineItems: {
      create: [
        {
          quantity: 1,
          item: {
            create: {
              title: "Beef Gyro",
              unitPrice: 750
            }
          }
        }
      ]
    }
  },
  {
    title: "John",
    lineItems: {
      create: [
        {
          quantity: 3,
          item: {
            create: {
              title: "Falafel Sandwich",
              unitPrice: 750
            }
          }
        },
        {
          quantity: 1,
          item: {
            create: {
              title: "Tabouli Salad",
              unitPrice: 650
            }
          }
        }
      ]
    }
  }
];

async function seed() {
  orders.forEach(async (order) => {
    await prisma.order.create({
      data: order
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