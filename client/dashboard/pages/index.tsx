import Head from 'next/head'
import styles from '../styles/Home.module.css'
import OrdersList from '../components/OrdersList'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Cedars of Lebanon</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Incoming Orders
        </h1>
        <p className={styles.description}>
          Real-time order updates straight from your website.
        </p>
        <OrdersList />
      </main>

      <footer className={styles.footer}>
        <p>Powered by <b>K</b></p>
      </footer>
    </div>
  )
}
