const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./test.db"
    }
  }
});

describe("cascading database deletes", () => {
  it("should delete line items when an order is deleted", async () => {
    const orderWithLineItems = await prisma.order.create({
      data: {
        lineItems: {
          create: [
            {
              item: {
                connect: {
                  id: 1
                }
              },
              quantity: 2,
            },
            {
              item: {
                connect: {
                  id: 2
                }
              },
              quantity: 1,
            }
          ]
        }
      }
    });

    const totalOrders = await prisma.order.findMany();
    const totalLineItems = await prisma.lineItem.findMany();
    expect(totalOrders.length).toBe(3);
    expect(totalLineItems.length).toBe(5);

    const deletedOrder = await prisma.order.delete({
      where: { id: orderWithLineItems.id },
    });

    const updatedOrders = await prisma.order.findMany();
    const updatedLineItems = await prisma.lineItem.findMany();
    expect(updatedOrders.length).toBe(2);
    expect(updatedLineItems.length).toBe(3);

    await prisma.$disconnect();
  });
});