import { ApolloError } from "apollo-server-express";
import { convertCheckoutPayloadToStripe } from './converters';
import { Context } from "./context";

export const resolvers = {
  Query: {
    orders: async (_, __, context: Context, ___) => { 
      return context.prisma.order.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    },
    order: async (_, { sessionId }, context: Context, ___) => {
      if(!sessionId) {
        throw new ApolloError('No sessionId specified.')
      }

      const stripeResponse = await context.stripe.checkout.sessions.listLineItems(sessionId);

      // TODO: add `sessionId` to order object. Prefer database to API call
      const transformed = stripeResponse.data.map(el => ({
        title: el.description,
        amountTotal: el.amount_total,
        quantity: el.quantity
      }));

      return transformed;
    },
    menu: async (_, __, context: Context, ___) => {
      // TODO: pagination
      const menuItems = await context.prisma.item.findMany({
        orderBy: {
          id: 'asc'
        }
      }).catch(err => {
        console.log(err);
        throw new ApolloError('Unable to query database');
      });

      return menuItems;
    }
  },
  Mutation: {
    createCheckoutSession: async (_, { input }, context: Context, __) => {
      if(!input.lineItems) {
        throw new ApolloError('No line items provided');
      }

      const line_items = await convertCheckoutPayloadToStripe(input.lineItems, context);

      if(line_items.length === 0) {
        throw new ApolloError('Unable to parse line items.');
      }

      const session = await context.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${process.env.BASE_URL}/order?success=true&id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}`
      }).catch(err => { 
        console.log(err);
        throw new ApolloError('Unable to create checkout session.');
      });

      return {
        sessionId: session.id
      }
    }
  },
  Order: {
    lineItems: async (order, _, context: Context, __) => {
      if(!order) {
        throw new ApolloError('Undefined parent!');
      }

      return context.loaders['lineItems'].load(order.id);
    }
  },
  LineItem: {
    item: async (lineItem, _, context: Context, __) => {
      if(!lineItem) {
        throw new ApolloError('Undefined parent!');
      }

      return context.loaders['item'].load(lineItem.itemId);
    }
  }
}