import { Item } from ".prisma/client";

export interface CheckoutSessionPayload {
  itemId: number;
  quantity: number;
}

export interface PrismaItemWithQuantity extends Item {
  quantity: number;
}

