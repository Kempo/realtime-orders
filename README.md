# Real-time Orders

A real-time orders dashboard for a local restaurant in Seattle.

**Status**: Work in progress

## Client
1. Orders Dashboard (dynamic)
2. Customer-Facing Website (static)

Stack: Next.js, Typescript, Apollo Client

## Server
Stack: Node.js, Typescript, Apollo Server, Postgresql, Prisma, Express

## Deployment
1. Server is deployed on Heroku using the [Heroku Monorepo buildpack](https://github.com/lstoll/heroku-buildpack-monorepo) with a Postgres database attached.
2. Both dashboard and main customer website are deployed on Vercel using sub-directories.

## Running locally
Navigate to the following subdirectories and run the following commands for each:

1. Orders Dashboard / Customer Website (ports `3001` and `3000`):
```
yarn dev
```
2. Server (on port `4000`): 

```
npm run dev
```

If you're testing out Stripe webhooks, be sure to also run:
```
stripe listen --forward-to localhost:4000/v1/payment/complete
```

## Migration, Reseeding, and ad-hoc changes

1. To reseed the database: `npx prisma db seed`
2. To run the ad-hoc script: `npx ts-node ad-hoc.ts`
3. Migrations are auto-applied during production deployment
  - To run migrations locally, `npx prisma migrate dev`
## Version 0 (Skateboard)
Accept and view orders from the restaurant site and receive payments online.

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
  - [x] Checkout flow (customer-facing)
    - [x] Stripe Checkout
    - [x] Multiple Quantity Cart
    - [x] 5 menu items
    - [x] ~~1 pager~~
    - [x] Basic styling for fulfillment page
      - [x] `Loading` and `Error` displays
    - [x] Basic styling for menu selection
    - [x] Client fetches from server (`getStaticProps`)
    - [x] Remove HTTP route for `/checkout`
    - [x] Connect checkout with Prisma
      - [x] Add `createCheckoutSession` -> sends back `sessionId` for web client
      - [x] On confirmation, get order details with `sessionId`
      - [x] Fulfill order on the backend
      - [x] Order Fulfilled Page
  - [x] Order component refactor
  - [x] Paid status interface
  - [x] Basic date display on orders (**Note**: for now, and not a permanent solution)
- [x] Switch to local Postgres db
- [x] Heroku Deployment (server)
- [x] Vercel (frontends)
- [x] Set actual development webhook URL (update env variable)
- [x] Client website switchover (add menu page) 
- [x] Google Analytics (Client)
- [x] Ignore Builds Setting (Client and Dashboard)
- [x] Update menu work flow on production (add items, update prices)
  - [x] Ad-hoc script / `upsert` seeding
  - [x] Reseed with new menu (with fixed `itemId` matching)
  - [x] Dataloader Fix (proper batch ordering)
- [x] **Final Actions**: 
  - [x] Connect Stripe to bank account
  - [x] Add production webhook
  - [x] Basic tests
  - [x] Version push to Heroku 
  - [x] Add logging
  - [x] Seed production database + clear out existing orders
  - [x] Switch over to production keys
    - [x] Heroku Stripe Keys 
    - [x] Vercel Client Environment variables
  - [x] Run first transaction (wahoo! 🎉)
  - [x] Publish client domain officially (and remove Netlify connection)
## Version 1 (Bicycle)
Update order statuses, order filtering, fine-grained order information, sidebar and main order focus UI, more menu selection, fast static order site

- [x] Event notifications on Checkout
- [ ] Prices in Dashboard
  - [x] `totalPrice` column migration
  - [ ] Non-null migration revert
  - [ ] Setup `totalPrice` integration on order creation
- [x] New order notification
- [x] "Most Popular" items
- [x] Workflow for ad-hoc database updates (eg. updating item descriptions or adding new items)
- [ ] Menu Interface
  - [x] Prices & Tax update
  - [x] Dietary labels
  - [x] Section Shortcuts
  - [x] Quantity Selection Buttons
  - [ ] Large item orders handling status
  - [x] Item Categories Migration
  - [x] Dietary Field Migration
  - [ ] Item descriptions
    - [ ] Description Migration
    - [ ] Update existing items
- [x] Update Prisma
- [x] Ad-hoc scripts re-organize
- [ ] Email Receipt
- [ ] Yelp Reviews on Order page (?)
- [ ] Shared types between server and frontend (?)
- [ ] Align Postgres db to table structure of Stripe
- [x] Specify acceptable domains (cross-origin)
- [ ] `checkoutSessionId` field to `Order` (match `orderId` with `checkoutSessionId`)
- [ ] Menu item pictures (served through CloudFront?)
  - [ ] Column addition (migration)
  - [ ] File serving
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
    - [x] Include all menu items
    - [ ] 5 - 10 pictures included

## Version 2 (Car)
End-of-day transaction summary, dev and production environments, speedy and efficient data fetching, service observability

- [ ] Item search
- [ ] Pricing for Menu Items Migration
- [ ] Stripe Product/Prices Integration (backend-aligned item IDs)
- [ ] Websockets Integration (?)
- [ ] UUID schema migration
- [ ] Production / Dev environments
- [ ] End-of-day Transactional Summary (email)
- [ ] Migrate schema/DB from integer IDs to hashes

And beyond...

### Miscellaneous
- [x] `.gitignore` for all `node_modules`

If dealing with simultaneous client-server changes:
1. Deploy server first (`git commit` and `git push heroku`)
2. Update core seeds after migration is applied
2. Verify server changes
3. Deploy client (`git push master`)
4. Verify client changes

If working on a non-nullable column migration:
1. Add the column as optional or set a default value to it (migration)
2. Modify the ad-hoc script to update values
3. Run it locally
4. Confirm changes and then deploy to server
5. Run script on production
5. Revert the column back with another migration
6. Run it locally 
7. Deploy after verification

### To address
1. Multi-restaurant integration
2. Next.js API in-house routes vs. separate server-client architecture
- Related: hefty, opaque Apollo client implementation for client-side fetching
3. Stripe and Prisma model misalignment (eg. line items and `StripeLineItemResponse` type)

### Answered
1. How should a restaurant owner update their menu?
- Manual in-line updates through a reseeding procedure (soon to be on Stripe)