import express from 'express';
import Stripe from 'stripe';

interface LineItem {
  id: number;
  quantity: number;
}

if(!process.env.STRIPE_TEST_KEY) {
  throw new Error('Unable to read environment variables.');
}

const stripe = new Stripe(process.env.STRIPE_TEST_KEY, {
  apiVersion: '2020-08-27'
});

const routes = express.Router();

const items = [
  {
    "id": 1,
    "name": "Lamb Shawarma",
    "price": 750
  },
  {
    "id": 2,
    "name": "French Fries",
    "price": 300
  },
  {
    "id": 3,
    "name": "Beef Gyro",
    "price": 750
  },
  {
    "id": 4,
    "name": "Falafel Sandwich",
    "price": 750
  },
  {
    "id": 5,
    "name": "Tabouli Salad",
    "price": 650
  }
]

// add middleware to specific /checkout -> convert data
routes.use('/checkout', (req, res, next) => {
  if(!req.body) {
    throw new Error('No request body provided.');
  }

  const payload: any[] = req.body;

  console.log(payload);

  const processed = payload.map(item => {

    // TODO: fix parsing here
    // Eventually switch over to Prisma db
    const found = items.find((el) => parseInt(item.id) === el.id);

    if(!found) {
      throw Error('Unable to read menu items.');
    }

    return {
      price_data: {
        currency: 'USD',
        product_data: {
          name: found.name,
          images: ['https://www.recipetineats.com/wp-content/uploads/2018/01/Lamb-Shawarma-Wrap.jpg'],
        },
        unit_amount: found.price,
      },
      quantity: item.quantity
    };
  });

  req.body = processed; // update the request body

  next();
});

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

routes.post('/webhook/order-complete', async (req, res) => {
  // TODO: finish with Stripe
  console.log(req.body);
  res.send('webhook!');
});

export default routes;