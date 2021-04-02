import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import { Context, getContext } from './context';
import { resolvers } from './resolvers';
import routes from './routes';

const PORT = process.env.PORT || 3000;
const app = express();

const typeDefs = gql`
  type Order {
    id: Int
    isReady: Boolean
    createdAt: String 
    lineItems: [LineItem]
    title: String
  }

  type LineItem {
    id: Int
    item: Item
    quantity: Int
  }

  type Item {
    id: Int
    title: String
    unitPrice: Int
  }

  type Query {
    orders: [Order]
    menu: [Item]
    order(sessionId: String): [StripeLineItemResponse]
  }

  type StripeLineItemResponse {
    title: String
    quantity: Int
    totalPrice: Int
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
    sessionId: String
    errors: [String]
  }

  type Mutation {
    createCheckoutSession(input: CreateCheckoutSessionInput): CreateCheckoutSessionPayload
  }
`;

const ctx: Context = getContext();

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

// Set cross origin requirements
app.use(cors(crossOriginOptions));

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