import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe("test-key-here", {
  apiVersion: '2020-08-27'
});

const routes = express.Router();

routes.get('/', (req, res) => {
  res.send('Home');
});

routes.post('/checkout', async (req, res) => {

  // Generate product + prices beforehand: https://stripe.com/docs/payments/accept-a-payment#create-product-prices-upfront
  //    - Create Product + create Price obj
  //    - Use `price`field in `line_items` to identify by `price_id` of the item 

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Beef & Lamb Shawarma',
            images: ['https://www.recipetineats.com/wp-content/uploads/2018/01/Lamb-Shawarma-Wrap.jpg'],
          },
          unit_amount: 7000,
        },
        quantity: 2
      }
    ],
    success_url: 'http://localhost:3000/order?success=true', // frontend starts on port 3000
    cancel_url: 'http://localhost:3000/order/canceled=true'
  });

  res.json({ id: session.id });
})

export default routes;