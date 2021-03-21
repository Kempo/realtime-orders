import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import { Context, createContext } from './context';
import { resolvers } from './resolvers';
import routes from './routes';

require('dotenv').config();

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
    unitPrice: Int
  }

  type Query {
    orders: [Order]
    menu: [Item]
  }

  input LineItemInput {
    itemId: Int
    quantity: Int
  }

  input CreateOrderInput {
    title: String
    lineItems: [LineItemInput]
  }

  input CreateCheckoutSessionInput {
    lineItems: [LineItemInput]
  }

  type CreateOrderPayload {
    order: Order
    errors: [String]
  }

  type CreateCheckoutSessionPayload {
    session: CheckoutSession
    errors: [String]
  }

  type CheckoutSession {
    id: String
    order: Order
  }

  type Mutation {
    createOrder(input: CreateOrderInput): CreateOrderPayload
    createCheckoutSession(input: CreateCheckoutSessionInput): CreateCheckoutSessionPayload
  }
`;

const ctx: Context = createContext();

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context: ctx
});

server.applyMiddleware({ app });

// TODO: specify domain
// Setup the cross-origin resource sharing
// Sends back the requirements to this server when hit with pre-flight
const crossOriginOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}

app.use(cors(crossOriginOptions));

app.use(express.json());
app.use('/', routes);

app.listen({ port: PORT }, () => {
  console.log(`🚀  Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});

process.on('SIGINT', async () => {
  await ctx.prisma.$disconnect().then(() => {
    console.log('\n👋  Exiting...');
    process.exit(1);
  });
});