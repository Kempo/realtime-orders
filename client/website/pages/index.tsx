import Image from 'next/image';
import Link from 'next/link';
import Contact from '../components/Contact';
import styles from '../styles/Home.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.landing}>
        <div className={styles.logo}>
          <Image src="/main.svg" alt="Cedars of Lebanon Logo" width="490" height="320" />
        </div>
        <Link href="/menu">
          <a>
            <button className={styles.orderButton}>
              Order Online
            </button>
          </a>
        </Link>
      </div>
      <div id="about" className={styles.about}>
          <h1>About Us</h1>
          <p>
            <b>Cedars of Lebanon</b> has been serving Seattle since 1976. 
            <br /> 
            We are family-run and serve the best gyros and falafels in town. We use fresh ingredients and take pride in making a delicious meal for you!
            <br /> 
            <br />
            Come stop by and say hello! We'd love to see you.
          </p>
      </div>
      <div className={styles.picture}>
        <Image src="https://d7xe6a0v1wpai.cloudfront.net/restaurant.jpeg" alt="Cedars of Lebanon Logo" width="901" height="591" />
      </div>
      <div id="contact" className={styles.contact}>
        <h1>
          Contact Us
        </h1>
        <Contact />
      </div>
    </div>
  )
}