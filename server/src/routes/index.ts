import express from 'express';
import Stripe from 'stripe';
import { Context, getContext } from '../context';

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
  /**
   * FUTURE UPDATE: 
   * 
   * Change from this:
   * 1. Fetch Stripe LineItems with sessionId
   * 2. Reduce response to the titles of each LineItem
   * 3. Fetch the respective Prisma itemId's associated with each title
   * 4. Use those itemIds to create the proper payload to create an order
   * 5. Create an order
   * 
   * ---
   * 
   * To this:
   * 1. Fetch Stripe LineItems with sessionId
   * 2. Map to proper payload identifying with the LineItem.id field (match with db itemId)
   */

  console.log('Fulfilling order...');

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

  console.log('ids', dbIds);

  const toCreate = lineItems.data.map(stripeItem => {
    return {
      quantity: stripeItem.quantity ?? 1,
      itemId: dbIds.find(el => el.title === stripeItem.description)!.id
    };
  });

  console.log(JSON.stringify(toCreate));

  return ctx.prisma.order.create({
    data: {
      lineItems: {
        create: toCreate
      }
    },
    include: {
      lineItems: true
    }
  });
}

routes.post('/v1/payment/complete', express.raw({ type: 'application/json' }), async (req, res) => {

  const payload = req.body;
  const sig = req.headers['stripe-signature'];

  if(!sig) {
    console.log('Stripe signature not found');
    return res.status(400).send(`Stripe signature not found.`);
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Fulfill the purchase
    const res = await fulfillOrder(session).catch(err => {

      // TODO: what if the checkout session is completed, but the order fulfillment fails?
      console.log('Order fulfillment error', err);
    });
    console.log('Order saved: \n', res);
  }

  res.status(200).json({received: true});
});

routes.get('/health', (req, res) => {
  res.status(200).json({
    prisma: ctx.prisma ? true : false
  })
})

export default routes;