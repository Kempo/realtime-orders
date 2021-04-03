import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Contact from '../components/Contact';
import styles from '../styles/Layout.module.scss';

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Head>
        <title>Cedars of Lebanon | Seattle's Best Gyro and Falafels</title>
        <meta charSet="utf-8" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://cedarsoflebanonuw.com/takeout.jpeg" />
        <meta property="og:url" content="https://cedarsoflebanonuw.com/" />
        <meta property="og:title" content="Cedars of Lebanon | Seattle's Best Gyro and Falafels" />
        <meta property="og:description" content="Cedars of Lebanon serves the best gyros, falafels, and shawarmas in Seattle. We are family-run since 1976 and do takeout and dine-in everyday except Sunday." />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <header>
        <div className={styles.notice}>
          <p>TAKEOUT & DINE-IN</p>
          <span className={styles.separator} />
          <p>11 - 8 DAILY</p>
          <span className={styles.separator} />
          <p>CLOSED SUNDAY</p>
        </div>
        <div className={styles.nav}>
          <Link href="/">
            <a className={styles.home}>
              <Image
                src="/tree.svg"
                alt="Cedars of Lebanon Tree"
                width={64}
                height={64}
              />
            </a>
          </Link>
          <ul>
            <li>
              <a target="_blank" rel="noopener noreferrer" href="https://d7xe6a0v1wpai.cloudfront.net/Cedars_Takeout%20Menu_FINALJUN5.pdf">
                Menu
              </a>
            </li>
            <li>
              <Link href="/menu">
                <a>
                  Order
                </a>
              </Link>
            </li> 
            <li>
              <Link href="/#contact">
                <a>
                  Contact
                </a>
              </Link>
            </li>    
          </ul>
        </div>
      </header>
      <main>
        <div className={styles.main}>
          {children}
        </div>
      </main>
      <footer>
        <h1>Cedars of Lebanon</h1>
        <Contact />
      </footer>
    </div>
  )
}