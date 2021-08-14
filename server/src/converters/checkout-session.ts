import { Item } from "@prisma/client";
import Stripe from "stripe";
import { Context } from "../context";
import type { CheckoutSessionPayload, PrismaItemWithQuantity } from '../types'; 

/**
 * 
 * Converts the client checkout payload into
 * a preprocessed output for the Stripe API.
 * 
 * @param payload 
 * @param context 
 * @returns properly formed line items response 
 */
export async function convertCheckoutPayloadToStripe(payload: CheckoutSessionPayload[], context: Context) {
  const dbIds = reduceToDatabaseIds(payload);
  const connected = await connectToPrismaItems(context, dbIds);

  if(connected.length !== dbIds.length) {
    // TODO: error handling
    return [];
  }

  // TODO: remove additional `find` operation
  const filled = connected.map(item => ({
    ...item,
    quantity: payload.find(original => original.itemId === item.id)!.quantity
  }))

  return mapToStripeLineItems(filled);
}

function reduceToDatabaseIds(input: CheckoutSessionPayload[]): number[] {
  return input.reduce((prev: number[], curr) => [...prev, curr.itemId], []);
}

async function connectToPrismaItems(ctx: Context, ids: number[]): Promise<Item[]> {
  return ctx.prisma.item.findMany({
    where: {
      id: {
        in: ids
      }
    }
  });
}

function mapToStripeLineItems(items: PrismaItemWithQuantity[]): Stripe.Checkout.SessionCreateParams.LineItem[]  {

  return items.map(item => {
    let unit_amount = item.unitPrice;
    let quantity = item.quantity;

    // Specifically for tips where the quantity is used as the price of the tip.
    if(item.id === -1) {
      // Convert the single digit quantity to a "unit price"
      unit_amount = item.quantity * 100;
      quantity = 1;
    }

    return {
      price_data: {
        currency: 'USD',
        product_data: {
          name: item.title,
          images: ['https://www.recipetineats.com/wp-content/uploads/2018/01/Lamb-Shawarma-Wrap.jpg'],
        },
        unit_amount: unit_amount,
      },
      quantity: quantity
    }
  })
}