# Website

Static-site Generated (SSG)
- Menu items

Client and Server both keep track of
- `itemId`, `itemName`, `quantity`, `unitPrice`
- But client only sends: `itemId`, `quantity`

# Running the client
`yarn dev`
## Flow
- Create Order (a list of `itemId`, `quantity`) -> 
- `/checkout` server endpoint -> 
- `redirectToCheckout` w/ session -> 
- Order Confirmation -> Homepage

## Interface
Item box, order count (increment)

### Menu Items
1. Lamb Shawarma
2. Fries
3. Beef Gyro
4. Falafel Sandwich
5. Tabouli Salad