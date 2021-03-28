import { ApolloError } from "apollo-server-express";
import { Context } from "./context";

export const resolvers = {
  Query: {
    orders: async (_, __, context: Context, ___) => { 
      // Fetches orders created on the specific day it was called 
      // and ordered by most recent.
      return await context.prisma.order.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          lineItems: {
            select: {
              id: true,
              quantity: true,
              item: true
            }
          }
        }
      });
    },
    order: async (_, { sessionId }, context: Context, ___) => {
      const stripeResponse = await context.stripe.checkout.sessions.listLineItems(sessionId);

      // TODO: do we need to seriously fetch Stripe, then transform again?
      const transformed = stripeResponse.data.map(el => ({
        title: el.description,
        totalPrice: el.amount_total,
        quantity: el.quantity
      }));

      return transformed;
    },
    menu: async (_, __, context: Context, ___) => {
      return context.prisma.item.findMany();
    }
  },
  Mutation: {
    // TODO remove?
    createOrder: async (_, { input }, context: Context, __) => {
      if(input === null || input.lineItems === null) {
        throw new ApolloError("Null data provided to create order.");
      }

      const order = await context.prisma.order.create({
        data: {
          isReady: false,
          lineItems: {
            create: input.lineItems
          }
        }
      });

      return {
        order: order,
        errors: []
      };
    },
    createCheckoutSession: async (_, { input }, context: Context, __) => {
      if(input === null) {
        throw new ApolloError('Null data provided to create checkout session.');
      }

      const payload: { itemId, quantity }[] = input.lineItems;

      // fetch all ids with reduce
      const providedIds = payload.reduce((prev: number[], curr: { itemId, quantity }) => {

        if(!curr.itemId) {
          throw new ApolloError('Incorrect line item format provided. No itemId field.')
        }

        return [...prev, curr.itemId]
      }, []);

      const menuItems = await context.prisma.item.findMany({
        where: {
          id: {
            in: providedIds // use ids here
          }
        }
      }).then(res => {
        // append the quantity on top of the found menu items
        return res.map(el => ({
          ...el,
          quantity: payload.find(original => original.itemId === el.id)!.quantity
        }))
      })

      if(menuItems.length !== payload.length) {
        throw new ApolloError('At least one specified menu item is unreadable.');
      }

      // process payload into Stripe line item objects
      const processed = menuItems.map(el => {
    
        return {
          price_data: {
            currency: 'USD',
            product_data: {
              name: el.title,
              images: ['https://www.recipetineats.com/wp-content/uploads/2018/01/Lamb-Shawarma-Wrap.jpg'],
            },
            unit_amount: el.unitPrice,
          },
          quantity: el.quantity
        };
      });

      const session = await context.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: processed,
        mode: 'payment',
        success_url: 'http://localhost:3000/order?success=true&id={CHECKOUT_SESSION_ID}', // frontend starts on port 3000
        cancel_url: 'http://localhost:3000/' // just redirect to home page now
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