import { ApolloError } from "apollo-server-express";
import { Context } from "./context";

/**
 * Sample Query:
 * 
 * Query (orders)
 *  - Order1
 *    - LineItem1
 *      - Item1
 *  - Order2
 *    - LineItem2
 *      - Item2
 *    - LineItem3
 *      - Item3
 */

export const resolvers = {
  Query: {
    orders: async (_, __, context: Context, ___) => { 
      return context.prisma.order.findMany({
        where: {
          isReady: false
        }
      });
    },
    menu: async(_, __, context: Context, ___) => {
      return context.prisma.item.findMany();
    }
  },
  Mutation: {
    createOrder: async(_, { input }, context: Context, ___) => {
      if(input == null || input.lineItems == null) {
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
    }
  },
  Order: {
    lineItems: async (order, _, context: Context, __) => {
      return context.loaders['lineItems'].load(order.id);
    }
  },
  LineItem: {
    item: async (lineItem, _, context: Context, __) => {
      return context.loaders['item'].load(lineItem.itemId);
    }
  }
}