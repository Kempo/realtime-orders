import express from 'express';
import Stripe from 'stripe';
import { Context, getContext } from '../context';
import { fulfillOrder } from '../converters';

if(!process.env.STRIPE_TEST_KEY || !process.env.WEBHOOK_SECRET) {
  throw new Error('Unable to read environment variables.');
}

const ctx: Context = getContext();

const stripe = new Stripe(process.env.STRIPE_TEST_KEY, {
  apiVersion: '2020-08-27'
});

const routes = express.Router();

const endpointSecret = process.env.WEBHOOK_SECRET;

const saveOrder = async (session: Stripe.Checkout.Session) => {
  console.log('Fulfilling order...');

  const createPayload = await fulfillOrder(session.id, ctx);

  return ctx.prisma.order.create({
    data: {
      lineItems: {
        create: createPayload
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
    const res = await saveOrder(session).catch(err => {

      // TODO: what if the checkout session is completed, but the order fulfillment fails?
      console.log('Error \n', err);
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