import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const menuItems = [
  {
    title: "Lamb Shawarma",
    unitPrice: 750,
  },
  {
    title: "French Fries",
    unitPrice: 300
  },
  {
    title: "Beef Gyro",
    unitPrice: 650
  },
  {
    title: "Falafel Sandwich",
    unitPrice: 650
  },
  {
    title: "Tabouli Salad",
    unitPrice: 650
  }
]

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
  // TODO: distinguish between production and dev seeds
  menuItems.forEach(async (item) => {
    await prisma.item.create({
      data: item
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