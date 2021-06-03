import React, { useState } from 'react'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js'
import { gql, useMutation } from '@apollo/client'
import client from '../lib/apolloClient'
import styles from '../styles/Menu.module.scss'
import MenuItem from '../components/MenuItem'

// TODO: load Stripe via library?
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_TEST_STRIPE_KEY);

// TODO: organize types between server/client
interface LineItem {
  itemId: number;
  quantity: number;
}

interface MenuItemType {
  id: number;
  title: string;
  unitPrice: number;
  category: string;
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
        <h1>Order Online</h1>
        <div className={styles.businessInfo}>
          <Image src="/location-sharp.svg" alt="Location" width="18" height="18" />
          <a href="https://www.google.com/maps/place/Cedars+of+Lebanon/@47.6597139,-122.3134208,19.17z/data=!4m5!3m4!1s0x0:0x91c70c3f32afc6f5!8m2!3d47.6597151!4d-122.3135296" target="_blank" rel="noopener noreferrer">1319 NE 43rd St, Seattle, WA 98105</a>
        </div>
        <div className={styles.subhero}>
          <div className={styles.orderType}>
            <span className={styles.badge}>Pickup</span>
          </div>
          <br />
          <p>Estimated Time: ~<b>15 - 20</b> minutes</p>
        </div>
        <div className={styles.sectionNavigation}>
          {
            Object.keys(props.categorized).map(category => (
              <a key={category} className={styles.sectionLink} href={`#${category}`}>{category}</a>
            ))
          }
        </div>
        <div className={styles.menuContainer}>
            {/*
            {
              props.menu.map((item: MenuItemType, index) => (
                <li className={styles.listItem} key={`${item.title}-${item.id}`}>
                  <MenuItem {...item} onQuantityUpdate={handleQuantityUpdate} />
                </li>
              ))
            }*/}
            {
              Object.keys(props.categorized).map(category => (
                <div id={`${category}`} key={`menu-${category}`}>
                  <h1 className={styles.categoryTitle}>{category}</h1>
                  <hr />
                  <ul className={styles.menuSection}>
                  {
                    props.categorized[`${category}`].map(item => (
                      <li className={styles.listItem} key={`${item.title}-${item.id}`}>
                        <MenuItem {...item} onQuantityUpdate={handleQuantityUpdate} />
                      </li>
                    ))
                  }
                  </ul>
                </div>
              ))
            }
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
            category
          }
        }
      `
    }
  );

  // TODO: fix, fetch fields from server
  const categorized = {
    sandwiches: [],
    salads: [],
    sides: [],
    beverages: [],
    desert: [],
    specials: []
  }

  let fieldNotExist = false;

  data.menu.forEach((item: MenuItemType) => {
    if(categorized[`${item.category.toLowerCase()}`] !== undefined) {
      categorized[`${item.category.toLowerCase()}`].push(item);
    }else{
      fieldNotExist = true;
    }
  });
  
  // If there's an HTTP error OR if there's a field error and it's a test environment
  // then throw notFound status.
  if (error || (fieldNotExist && process.env.NEXT_PUBLIC_TEST_STRIPE_KEY.indexOf('test') !== -1)) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      ...data,
      categorized
    },
  }
}