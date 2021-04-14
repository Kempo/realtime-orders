import Head from 'next/head'
import styles from '../styles/Home.module.css'
import OrdersList from '../components/orders/List'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Incoming Orders | Cedars of Lebanon</title>
      </Head>

      <main className={styles.main}>
        <OrdersList />
      </main>

      <footer className={styles.footer}>
        <p>Bottom of page.</p>
      </footer>
    </div>
  )
}
