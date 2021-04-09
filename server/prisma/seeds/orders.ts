export default [
  {
    title: "Mark",
    lineItems: {
      create: [
        {
          quantity: 3,
          item: {
            create: {
              title: "Lamb Shawarma",
              unitPrice: 750
            }
          }
        },
        {
          quantity: 2,
          item: {
            create: {
              title: "French Fries",
              unitPrice: 300
            }
          }
        }
      ]
    }
  },
  {
    title: "Sam",
    lineItems: {
      create: [
        {
          quantity: 1,
          item: {
            create: {
              title: "Beef Gyro",
              unitPrice: 750
            }
          }
        }
      ]
    }
  },
  {
    title: "John",
    lineItems: {
      create: [
        {
          quantity: 3,
          item: {
            create: {
              title: "Falafel Sandwich",
              unitPrice: 750
            }
          }
        },
        {
          quantity: 1,
          item: {
            create: {
              title: "Tabouli Salad",
              unitPrice: 650
            }
          }
        }
      ]
    }
  }
];