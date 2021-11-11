import Image from 'next/image';
import Link from 'next/link';
import Contact from '../components/Contact';
import styles from '../styles/Home.module.scss';

const images = [
  {
    title: 'chicken-&-breakfast-gyros.jpeg',
    width: 200,
    height: 150
  },
  {
    title: 'gyro-salad-1.jpeg',
    width: 200,
    height: 266
  },
  {
    title: 'gyro-salad.jpeg',
    width: 200,
    height: 266
  },
  {
    title: 'gyro-plate.jpeg',
    width: 200,
    height: 150
  },
];

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.landing}>
        <div className={styles.logo}>
          <Image src="/main.svg" alt="Cedars of Lebanon Logo" width="490" height="320" />
        </div>
        <p style={{ color: "red" }}><b>Owner's note: We will closed 11/25 and 12/22 to 1/3.</b></p>
        <h2 className={styles.description}>Serving the best gyros, shawarmas, and falafels since 1976.</h2>
        <Link href="/menu">
          <a>
            <button className={styles.orderButton}>
              Order Online
            </button>
          </a>
        </Link>
      </div>
      <div className={styles.pictures}>
        <div className={styles.gallery}>
          {images.map(image => <div key={image.title} className={styles.image}><Image alt={image.title} src={`/images/${image.title}`} width={image.width} height={image.height} /></div>)}
        </div>
      </div>
      <div id="contact" className={styles.contact}>
        <h1>
          Try us out
        </h1>
          <Contact />
      </div>
      <div className={styles.store}>
        <Image src="https://d7xe6a0v1wpai.cloudfront.net/restaurant.jpeg" alt="Cedars of Lebanon Restaurant View" width="901" height="591" />
      </div>
      <div id="about" className={styles.about}>
          <h1>About Us</h1>
          <p>
            <b>Cedars of Lebanon</b> has been serving Seattle since 1976. 
            <br /> 
            We make the best gyros and shawarmas in the University District and
            take pride in providing affordable, delicious, and fresh food to you.
            <br /> 
            <br />
            Come stop by and say hello! We'd love to see you.
          </p>
      </div>
      <div className={styles.takeout}>
        <Image src="https://d7xe6a0v1wpai.cloudfront.net/takeout.jpeg" alt="Cedars of Lebanon Takeout Window" width="801" height="534" />
      </div>
    </div>
  )
}