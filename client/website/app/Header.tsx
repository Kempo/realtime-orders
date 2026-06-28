"use client";

import Link from "next/link";
import Image from "next/image";
import hours from "../lib/restaurantDetails.json";
import { handleEvent } from "../lib/gtag";
import styles from "../styles/Layout.module.scss";
import treeSvg from "../public/tree.svg";

export default function Header() {
  function handleNavigation(page: string, action: string) {
    handleEvent({
      category: "navigation",
      action,
      label: page,
    });
  }

  return (
    <header>
      <div className={styles.notice}>
        <p>TAKEOUT & DINE-IN</p>
        <span className={styles.separator} />
        <p>
          {hours.openTime} - {hours.closeTime} DAILY
        </p>
        <span className={styles.separator} />
        <p>CLOSED SUNDAY</p>
      </div>
      <div className={styles.nav}>
        <Link href="/">
          <Image
            src={treeSvg}
            alt="Cedars of Lebanon Tree"
            width={64}
            height={64}
          />
        </Link>
        <ul>
          <li onClick={() => handleNavigation("Menu PDF", "navigate_menu")}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://drive.google.com/file/d/1FAVEoCMvY4z19s1H9nc3MoyMvzpmHtRb/view?usp=sharing"
            >
              Menu
            </a>
          </li>
          <li onClick={() => handleNavigation("Contact", "navigate_contact")}>
            <Link href="/#contact">Contact</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
