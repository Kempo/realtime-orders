import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.TEST_STRIPE_KEY);

export default function Home() {

  async function handleClick(event) {
    const stripe = await stripePromise;

    const response = await fetch("localhost:4000/checkout", {
      method: "POST",
    });

    const session = await response.json();

    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    if (result.error) {
      console.log(result.error.message);
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Cedars of Lebanon</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p>Order a Lamb Shawarma now.</p>
        <button onClick={handleClick}>
          Checkout
        </button>
      </main>

      <footer className={styles.footer}>
        <p>Made by K.</p>
      </footer>
    </div>
  )
}
