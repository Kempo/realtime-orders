import express from 'express';
import Stripe from 'stripe';
import { Context, getContext } from '../context';
interface LineItem {
  id: number;
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

const items = [
  {
    "id": 1,
    "title": "French Fries",
    "unitPrice": 300
  },
  {
    "id": 2,
    "title": "Lamb Shawarma",
    "unitPrice": 750
  },
  {
    "id": 3,
    "title": "Beef Gyro",
    "unitPrice": 750
  },
  {
    "id": 4,
    "title": "Tabouli Salad",
    "unitPrice": 650
  },
  {
    "id": 5,
    "title": "Falafel Sandwich",
    "unitPrice": 750
  }
];

// add middleware to specific /checkout -> convert data
routes.use('/checkout', express.json(), (req, res, next) => {
  if(!req.body) {
    // TODO: throwing errors vs. sending a 500 response?
    throw new Error('No request body provided.');
  }

  const payload: LineItem[] = req.body;

  console.log(payload);

  const processed = payload.map(item => {

    // TODO: fix parsing here
    // Eventually switch over to Prisma db
    const found = items.find((el) => item.id === el.id);

    if(!found) {
      throw Error('Unable to read menu items.');
    }

    return {
      price_data: {
        currency: 'USD',
        product_data: {
          name: found.title,
          images: ['https://www.recipetineats.com/wp-content/uploads/2018/01/Lamb-Shawarma-Wrap.jpg'],
        },
        unit_amount: found.unitPrice,
      },
      quantity: item.quantity
    };
  });

  req.body = processed; // update the request body

  next();
});

// Refactor out below to Apollo
routes.post('/checkout', async (req, res) => {

  // QUESTION: do this?
  // Generate product + prices beforehand: https://stripe.com/docs/payments/accept-a-payment#create-product-prices-upfront
  //    - Create Product + create Price obj
  //    - Use `price`field in `line_items` to identify by `price_id` of the item 
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: req.body,
    mode: 'payment',
    success_url: 'http://localhost:3000/order?success=true', // frontend starts on port 3000
    cancel_url: 'http://localhost:3000/order?canceled=true'
  });

  // Sessions are created through Stripe
  // Not saved to DB
  // When the checkout is completed -> hit webhook `/webhook/order-complete` with session data, save order into db
  // - Add `sessionId` to `Order` object so we can identify it on the confirmation page?
  // - So we do need Express!

  res.json({ id: session.id });
})

const endpointSecret = process.env.WEBHOOK_SECRET;

const fulfillOrder = (session: Stripe.Event.Data.Object) => {
  console.log(session);
}

routes.post('/v1/payment/complete', express.raw({ type: 'application/json' }), (req, res) => {

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
    const session = event.data.object;

    console.log(event.type);
    // Fulfill the purchase...
    fulfillOrder(session);
  }

  res.status(200).json({received: true});
});

export default routes;