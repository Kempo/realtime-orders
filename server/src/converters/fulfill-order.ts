import Stripe from "stripe";
import { Context } from "../context";

// TODO: switch over to Stripe Product API
export async function fulfillOrder(sessionId: string, stripe: Stripe, context: Context) {
  const purchasedItems: Stripe.ApiList<Stripe.LineItem> = await stripe.checkout.sessions.listLineItems(sessionId);

  if(!purchasedItems) {
    return [];
  }

  const itemTitles = reduceToTitles(purchasedItems.data);

  const connectedItems = await fetchPrismaItems(itemTitles, context);

  // TODO: avoid extra itemId computation
  const formattedPayload = purchasedItems.data.map(stripeItem => {
    return {
      quantity: stripeItem.quantity ?? 1,
      itemId: connectedItems.find(el => el.title === stripeItem.description)!.id
    };
  });

  return formattedPayload;
}

function reduceToTitles(items: Stripe.LineItem[]) {
  return items.reduce((acc: string[], curr) => {
    return [...acc, curr.description];
  }, []);
}

async function fetchPrismaItems(titles: string[], ctx: Context) {
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
