# Real-time Orders

A real-time orders dashboard for a local restaurant in Seattle.

**Status**: Work in progress

## Client
1. Orders Dashboard (dynamic)
2. Customer-Facing Website (static)

Stack: Next.js, Typescript, Apollo Client

## Server
Stack: Node.js, Typescript, Apollo Server (GraphQL), Sqlite3, Prisma, Express

## Version 0 (Skateboard)
Accept and view orders from the restaurant site and receive payment.
Allow customers to buy online from the top 5 most popular menu items.

- [x] DB Seeding
- [x] Nodemon, Typescript, dev setup
- [x] Apollo Server
- [x] Schema + Resolvers
- [x] Prisma and Sqlite3 setup
- [x] Schema / DB Migration (multiple item orders)
- [x] N+1 Queries (Dataloader)
- [x] DB cascading deletes (one to many)
- [x] Jest Installation
  - [x] Cascading Deletes testing
- [x] `title` field for order (and migration)
- [x] `createOrder` mutation
- [x] Stripe `/checkout` endpoint
- [x] Pricing Migration
- [x] Centralized Menu (server-sided)
- [x] Most recent order sorting default
- [x] Menu Item mismatch (gyro vs. shawarma)
- **Frontends**
  - [x] Orders Dashboard
    - [x] Apollo Client
    - [x] HTTP Polling
    - [x] OrdersList Component
    - [x] Basic Retry
  - [ ] Checkout flow (customer-facing)
    - [x] Stripe Checkout
    - [x] Multiple Quantity Cart
    - [x] 5 menu items
    - [ ] Pictures Included
    - [ ] 1 pager
    - [ ] Basic styling for fulfillment page
    - [ ] Styling for menu selection
    - [x] Client fetches from server (`getStaticProps`)
    - [x] Remove HTTP route for `/checkout`
    - [x] Connect checkout with Prisma
      - [x] Add `createCheckoutSession` -> sends back `sessionId` for web client
      - [x] On confirmation, get order details with `sessionId`
      - [x] Fulfill order on the backend
      - [x] Order Fulfilled Page
  - [x] Order component refactor
  - [x] Paid status interface
  - [x] Basic date display on orders (for now)
- [x] Switch to local Postgres db
- [ ] Heroku Deployment (server)
  - [ ] GraphQL: `api.cedarsoflebanonuw.com/graphql`
  - [ ] HTTP: `api.cedarsoflebanonuw.com/`
- [ ] Vercel (frontends)

## Version 1 (Bicycle)
Update order statuses, order filtering, fine-grained order information, sidebar and main order focus UI, more menu selection, fast static order site

- [ ] Timestamped orders sorting (per-day orders)
- [ ] Server-sent Events (SSE) for app-wide notifications
- [ ] Fix `orderId` in schema to required instead of nullable
- [ ] Filtering by status, time, and order titles
- [ ] `updateOrder` mutation
  - [ ] Enum for order status: `READY`, `WAITING`, `FINISHED`
- **Frontends**
  - [ ] Orders Dashboard
     - [ ] Sidebar interface and main view
     - [ ] Update Order status
  - [ ] Checkout flow (customer-facing)
    - [ ] Include all menu items
    - [ ] 5 - 10 pictures included

## Version 2 (Car)
End-of-day transaction summary, dev and production environments, speedy and efficient data fetching, service observability

- [ ] Pricing for Menu Items Migration
- [ ] Idempotency
- [ ] Stripe Product/Prices Integration (backend-aligned item IDs)
- [ ] Websockets Integration (?)
- [ ] UUID schema migration
- [ ] Production / Dev environments
- [ ] End-of-day Transactional Summary (email)
- [ ] Migrate schema/DB from integer IDs to hashes

And beyond...

### Miscellaneous
- [x] `.gitignore` for all `node_modules`

### To address
1. How should a restaurant owner update their menu?
- This includes prices, new menu items, and deleting old ones
2. Multi-restaurant integration
3. Next.js API in-house routes vs. separate server-client architecture
- Related: hefty, opaque Apollo client implementation for client-side fetching
4. Stripe and Prisma model misalignment (eg. line items and `StripeLineItemResponse` type)
