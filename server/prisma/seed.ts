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
              title: "Lamb and Beef Gyro"
            }
          }
        },
        {
          quantity: 2,
          item: {
            create: {
              title: "Ham and Cheese Sandwich"
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
              title: "French Fries"
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
              title: "Falafel"
            }
          }
        },
        {
          quantity: 1,
          item: {
            create: {
              title: "Sprite"
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

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })