import Stripe from "stripe";
import { Context } from "../context";

/**
 * 
 * Fulfills the provided order details, given by Stripe
 * and formats the payload to save it into Prisma.
 * 
 * TODO: switch over to Stripe Product API
 * 
 * @param sessionId 
 * @param context 
 * @returns Prisma order payload to be saved
 */
export async function fulfillOrder(sessionId: string, context: Context) {
  const purchasedItems: Stripe.ApiList<Stripe.LineItem> = await context.stripe.checkout.sessions.listLineItems(sessionId);

  if(!purchasedItems || !purchasedItems.data) {
    return [];
  }

  const itemTitles = reduceToTitles(purchasedItems.data);

  const connectedItems = await fetchPrismaItems(itemTitles, context);

  if(connectedItems.length !== itemTitles.length) {
    throw new Error('Original item length does not match with connected items.');
  }

  // TODO: avoid extra itemId computation
  const formattedPayload = purchasedItems.data.map(stripeItem => {

    if(!stripeItem.quantity) {
      throw new Error('No quantity provided.');
    }

    const connected = connectedItems.find(el => el.title === stripeItem.description);

    if(!connected) {
      throw new Error('Unable to match item titles.');
    }

    return {
      quantity: stripeItem.quantity,
      itemId: connected.id
    };
  });

  return formattedPayload;
}

function reduceToTitles(items: Stripe.LineItem[]) {
  return items.reduce((acc: string[], curr) => {
    if(curr.description.length == 0) {
      throw new Error('Blank item title provided by Stripe.');
    }

    return [...acc, curr.description];
  }, []);
}

async function fetchPrismaItems(titles: string[], ctx: Context) {
  // TODO: avoid matching by titles
  return ctx.prisma.item.findMany({
    where: {
      title: {
        in: titles
      }
    },
    select: {
      id: true,
      title: true
    }
  });
}
