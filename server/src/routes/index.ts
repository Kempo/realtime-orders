import express from 'express';
import Stripe from 'stripe';
import { Context, getContext } from '../context';
interface LineItem {
  itemId: number;
  quantity: number;
}

if(!process.env.STRIPE_TEST_KEY || !process.env.WEBHOOK_SECRET) {
  throw new Error('Unable to read environment variables.');
}

const ctx: Context = getContext();

const stripe = new Stripe(process.env.STRIPE_TEST_KEY, {
  apiVersion: '2020-08-27'
});

const routes = express.Router();

const endpointSecret = process.env.WEBHOOK_SECRET;

const fulfillOrder = async (session: Stripe.Checkout.Session) => {

  // fetch the Stripe LineItems
  const lineItems: Stripe.ApiList<Stripe.LineItem> = await stripe.checkout.sessions.listLineItems(session.id);

  // Reduce the Stripe response to the names associated with each order
  // TODO: fix this, in favor of using a centralized Stripe Product API to handle ids
  const names: string[] = lineItems.data.reduce((prev: string[], curr) => {
    return [...prev, curr.description];
  }, [])

  // Fetch the items that have the same names in the Stripe response
  const dbIds = await ctx.prisma.item.findMany({
    where: {
      title: {
        in: names
      }
    },
    select: {
      id: true,
      title: true
    }
  });

  // Transform into the right form
  // We could also the the `connect` relation instead of identifying
  // by foreign key `itemId` directly. Either works.
  const toCreate: LineItem[] = lineItems.data.map(stripeItem => {
    return {
      quantity: stripeItem.quantity ?? 1, // default quantity size, but that should already be listed
      itemId: dbIds.find(el => el.title === stripeItem.description)!.id
    };
  });

  console.log(toCreate);
  
  return await ctx.prisma.order.create({
    data: {
      // title: '', - optional
      lineItems: {
        create: toCreate
      }
    }
  });
}

routes.post('/v1/payment/complete', express.raw({ type: 'application/json' }), async (req, res) => {

  const payload = req.body;
  const sig = req.headers['stripe-signature'];

  if(!sig) {
    return res.status(400).send(`Stripe signature not found.`);
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Fulfill the purchase
    await fulfillOrder(session).catch(err => {

      // TODO: what if the checkout session is completed, but the order fulfillment fails?
      console.log(err);
    });
  }

  res.status(200).json({received: true});
});

export default routes;