import Image from "next/image";
import Contact from "../components/Contact";
import styles from "../styles/Home.module.scss";
import mainSvg from "../public/main.svg";
import chickenAndBreakfastGyros from "../public/images/chicken-&-breakfast-gyros.jpeg";
import gyroSalad1 from "../public/images/gyro-salad-1.jpeg";
import gyroSalad2 from "../public/images/gyro-salad.jpeg";
import gyroPlate from "../public/images/gyro-plate.jpeg";
import cloudfrontLoader from "../loader";

const images = [
  {
    title: "chicken-&-breakfast-gyros.jpeg",
    source: chickenAndBreakfastGyros,
    width: 200,
    height: 150,
  },
  {
    title: "gyro-salad-1.jpeg",
    source: gyroSalad1,
    width: 200,
    height: 266,
  },
  {
    title: "gyro-salad-2.jpeg",
    source: gyroSalad2,
    width: 200,
    height: 266,
  },
  {
    title: "gyro-plate.jpeg",
    source: gyroPlate,
    width: 200,
    height: 150,
  },
];

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.landing}>
        <div className={styles.logo}>
          <Image
            src={mainSvg}
            alt="Cedars of Lebanon Logo"
            width="490"
            height="320"
          />
        </div>
        <h2 className={styles.description}>
          Serving the best gyros, shawarmas, and falafels since 1976.
        </h2>
      </div>
      <div className={styles.pictures}>
        <div className={styles.gallery}>
          {images.map((image) => (
            <div key={image.title} className={styles.image}>
              <Image
                alt={image.title}
                src={image.source}
                width={image.width}
                height={image.height}
              />
            </div>
          ))}
        </div>
      </div>
      <div id="contact" className={styles.contact}>
        <h1>Try us out</h1>
        <Contact />
      </div>
      <div className={styles.store}>
        <Image
          src="restaurant.jpeg"
          alt="Cedars of Lebanon Restaurant View"
          loader={cloudfrontLoader}
          width="901"
          height="591"
        />
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
        <Image
          src="takeout.jpeg"
          loader={cloudfrontLoader}
          alt="Cedars of Lebanon Takeout Window"
          width="801"
          height="534"
        />
      </div>
    </div>
  );
}
