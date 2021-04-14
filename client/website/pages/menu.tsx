import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { gql, useMutation } from '@apollo/client'
import client from '../lib/apolloClient'
import styles from '../styles/Menu.module.css'
import MenuItem from '../components/MenuItem'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_TEST_STRIPE_KEY);

interface LineItem {
  itemId: number;
  quantity: number;
}

interface MenuItemType {
  id: number;
  title: string;
  unitPrice: number;
}

const CREATE_CHECKOUT_MUTATION = gql`
  mutation CreateCheckout($lineItems: [LineItemInput]) {
    createCheckoutSession(input: {
      lineItems: $lineItems
    }) {
      sessionId
    }
  }
`;

export default function Menu(props) {

  const [cart, updateCart] = useState<LineItem[]>([]);
  const [createCheckoutSession] = useMutation(CREATE_CHECKOUT_MUTATION, { 
    client
  });

  async function handleClick(_) {
    // TODO: refactor out into singleton
    const stripe = await stripePromise;

    if(cart.length > 0) {
      const { data } = await createCheckoutSession({
        variables: {
          lineItems: cart
        }
      });
  
      // When the customer clicks on the button, redirect them to Checkout.
      const result = await stripe.redirectToCheckout({
        sessionId: data.createCheckoutSession.sessionId
      });
  
      if (result.error) {
        console.log(result.error.message);
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
      }
    }else{
      alert('Please select a dish to order from the menu!');
    }
  }

  function handleQuantityUpdate(itemId) {
    return (event) => {
      const quantity: number = parseInt(event.target.value);

      const isTracked = cart.some(item => item.itemId === itemId);

      if(quantity === 0 && isTracked) {
        // remove item from cart
        const updated = cart.reduce((prev, current) => {
          return current.itemId !== itemId ? [...prev, current] : prev;
        }, []);

        updateCart(updated);
      }else if (quantity > 0 && !isTracked) {

        // append item to the cart
        updateCart([...cart, { itemId: itemId, quantity }])
      }else if (quantity > 0 && isTracked) {

        // update item quantity in the cart
        updateCart(cart.map(lineItem => lineItem.itemId === itemId ? { itemId: itemId, quantity } : lineItem))
      }
    };
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Menu Selection</h1>
        <p className={styles.description}>
          <b>Please note:</b> when you order online, you are expected to pick up the order at Cedars of Lebanon.
          <br />
          <br />
          On average, orders typically take 15 minutes to fulfill. When you arrive, please let the cashier know what you ordered.
        </p>
        <div className={styles.menuContainer}>
          <ul className={styles.menu}>
            {
              props.menu.map((item: MenuItemType, index) => (
                <li className={styles.listItem} key={`${item.title}-${item.id}`}>
                  <MenuItem {...item} onQuantityUpdate={handleQuantityUpdate} />
                </li>
              ))
            }
          </ul>
        </div>
        <button onClick={handleClick}>
          Checkout
        </button>
      </main>
    </div>
  )
}

export async function getStaticProps(context) {
  const { data, error } = await client.query(
    {
      query: gql`
        query MenuItems {
          menu {
            id
            title
            unitPrice
          }
        }
      `
    }
  )

  if (error) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      ...data
    },
  }
}