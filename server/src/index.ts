import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import { Context, createContext } from './context';
import { resolvers } from './resolvers';
import routes from './routes';

const PORT = 4000;
const app = express();

const typeDefs = gql`
  type Order {
    id: ID
    isReady: Boolean
    createdAt: String 
    lineItems: [LineItem]
    title: String
  }

  type LineItem {
    id: ID
    item: Item
    quantity: Int
  }

  type Item {
    id: ID
    title: String
  }

  type Query {
    orders: [Order]
    menuItems: [Item]
  }

  input LineItemInput {
    itemId: Int
    quantity: Int
  }

  input CreateOrderInput {
    title: String
    lineItems: [LineItemInput]
  }

  type CreateOrderPayload {
    order: Order
    errors: [String]
  }

  type Mutation {
    createOrder(input: CreateOrderInput): CreateOrderPayload
  }
`;

const ctx: Context = createContext();

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context: ctx
});

server.applyMiddleware({ app });

app.use('/', routes);

app.listen({ port: PORT }, () => {
  console.log(`🚀  Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});

process.on('SIGINT', async () => {
  await ctx.prisma.$disconnect();
  
  console.log('\n👋  Exiting...');
  process.exit(1);
});