import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  console.log('Running ad-hoc delete script...');
  const res = await prisma.order.deleteMany();

  console.log(`Deleted ${res.count} order(s).`);
}

run().catch(err => {
  console.log(err);
  process.exit(0);
}).finally(async () => {
  await prisma.$disconnect();
});