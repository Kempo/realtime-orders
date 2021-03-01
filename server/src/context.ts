import { Item, LineItem, PrismaClient } from '@prisma/client'
import DataLoader from 'dataloader'

const prisma = new PrismaClient({
  log: ['query']
});

// batch all the items in every LineItem in 1 request
async function batchItems(batchItemIds) {
  const result = prisma.item.findMany({
    where: {
      id: {
        in: batchItemIds as number[]
      }
    }
  })

  return result;
}

// batch all the LineItems in every order in 1 request
async function batchLines(batchOrderIds) {
  const allLineItems = await prisma.lineItem.findMany({
    where: {
      orderId: {
        in: batchOrderIds as number[]
      }
    }
  })
  
  const partitions: any[] = []; // fix typing

  batchOrderIds.forEach(orderId => {
    const connectedLineItems = allLineItems.filter((line) => line.orderId == orderId);
    partitions.push(connectedLineItems);
  });

  return Promise.all(partitions);
}

export interface Context {
  prisma: PrismaClient
  loaders: {
    item: DataLoader<Number, Item>,
    lineItems: DataLoader<Number, LineItem[][]>
  }
}

export function createContext(): Context {
  return { 
    prisma,  
    loaders: {
      item: new DataLoader<Number, Item>((keys) => batchItems(keys)),
      lineItems: new DataLoader<Number, LineItem[][]>((keys) => batchLines(keys))
    }
  }
}