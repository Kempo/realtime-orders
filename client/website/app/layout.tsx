import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Contact from "../components/Contact";
import Header from "./Header";
import WebVitals from "./WebVitals";
import styles from "../styles/Layout.module.scss";
import "../styles/globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const DESCRIPTION =
  "Cedars of Lebanon serves the best gyros, falafels, and shawarmas in UW. We are family-run since 1976 and do takeout and dine-in everyday except Sunday.";
const TITLE = "Cedars of Lebanon | Seattle's Best Gyro and Falafels";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: "gyros uw, best gyros uw, falafels uw, lebanese food",
  authors: [{ name: "Aaron Chen" }],
  icons: { icon: "/favicon.png" },
  openGraph: {
    type: "website",
    url: "https://cedarsoflebanonuw.com/",
    title: TITLE,
    description: DESCRIPTION,
    images: ["https://cedarsoflebanonuw.com/takeout.jpeg"],
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className={styles.layout}>
          <Header />
          <main>
            <div className={styles.main}>{children}</div>
          </main>
          <footer>
            <h1>Cedars of Lebanon</h1>
            <Contact />
          </footer>
        </div>
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
        <WebVitals />
      </body>
    </html>
  );
}
