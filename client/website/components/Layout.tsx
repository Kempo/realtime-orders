import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import hours from '../lib/restaurantDetails.json';
import Contact from '../components/Contact';
import { handleEvent } from '../lib/gtag';
import styles from '../styles/Layout.module.scss';

export default function Layout({ children }) {

  function handleNavigation(page, action) {
    handleEvent({
      category: 'navigation',
      action,
      label: page,
    });
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>Cedars of Lebanon | Seattle's Best Gyro and Falafels</title>
        <meta charSet="utf-8" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://cedarsoflebanonuw.com/takeout.jpeg" />
        <meta property="og:url" content="https://cedarsoflebanonuw.com/" />
        <meta property="og:title" content="Cedars of Lebanon | Seattle's Best Gyro and Falafels" />
        <meta property="og:description" content="Cedars of Lebanon serves the best gyros, falafels, and shawarmas in UW. We are family-run since 1976 and do takeout and dine-in everyday except Sunday." />
        <meta name="description" content="Cedars of Lebanon serves the best gyros, falafels, and shawarmas in UW. We are family-run since 1976 and do takeout and dine-in everyday except Sunday." />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="keywords" content="gyros uw, best gyros uw, falafels uw, lebanese food" />
        <meta name="author" content="Aaron Chen" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <header>
        <div className={styles.notice}>
          <p>TAKEOUT & DINE-IN</p>
          <span className={styles.separator} />
          <p>{hours.openTime} - {hours.closeTime} DAILY</p>
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
            <li onClick={() => handleNavigation('Menu PDF', 'navigate_menu')}>
              <a target="_blank" rel="noopener noreferrer" href="https://drive.google.com/file/d/1bMC-ugNmb8UzdNTVR5H6CLTn8Ggnruuo/view?usp=sharing">
                Menu
              </a>
            </li>
            <li onClick={() => handleNavigation('Online Orders', 'navigate_orders')}>
              <Link href="/menu">
                <a>
                  Order
                </a>
              </Link>
            </li> 
            <li onClick={() => handleNavigation('Contact', 'navigate_contact')}>
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