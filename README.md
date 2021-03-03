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
- [ ] Stripe `/checkout` endpoint
  - [ ] Pricing (5 items) 
- **Frontends**
  - [ ] Orders Dashboard
    - [x] Apollo Client
    - [x] HTTP Polling
    - [x] OrdersList Component
  - [ ] Checkout flow (customer-facing)
    - [ ] Stripe Checkout
    - [ ] 3 - 5 most popular menu items
    - [ ] Pictures Included
    - [ ] 1 pager
- [ ] Heroku Deployment (server)
- [ ] Netlify (frontends)

## Version 1 (Bicycle)
Update order statuses, order filtering, fine-grained order information, sidebar and main order focus UI, more menu selection, fast static order site

- [ ] Timestamped orders
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
    - [ ] Basic SSG / SSR 

## Version 2 (Car)
End-of-day transaction summary, dev and production environments, speedy and efficient data fetching, service observability

- [ ] Pricing for Menu Items Migration
- [ ] Idempotency
- [ ] Websockets Integration
- [ ] UUID schema migration
- [ ] Production / Dev environments
- [ ] End-of-day Transactional Summary (email)
- [ ] Migrate schema/DB from integer IDs to hashes

And beyond...

### Miscellaneous
- [x] `.gitignore` for all `node_modules`

