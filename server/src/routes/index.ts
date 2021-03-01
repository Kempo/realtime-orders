import express from 'express';

const routes = express.Router();

routes.get('/checkout', (req, res) => {
  res.send('Checkout flow');
})

export default routes;