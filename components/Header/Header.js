"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import { SITE } from "@/data/site";
import { IconBag, IconMenu, IconClose } from "@/lib/icons";

const LINKS = [
  { href: "#accueil", label: "Accueil" },
  { href: "#sneakers", label: "Basket" },
  { href: "#look", label: "Essaie le look" },
  { href: "#vetements", label: "Vêtements" },
  { href: "#contact", label: "Livraison" },
];

export default function Header({ count, onCart }) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const bar = useRef(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 30);
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
      <a href="#accueil" className={styles.logo} aria-label={`${SITE.name} – accueil`}>
        <img
          src={SITE.logo}
          alt=""
          className={styles.logoImg}
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <span>{SITE.name}</span>
      </a>

      <nav className={`${styles.nav} ${menu ? styles.navOpen : ""}`} aria-label="Navigation principale">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className={styles.navLink} onClick={() => setMenu(false)}>
            {l.label}
          </a>
        ))}
      </nav>

      <div className={styles.headerRight}>
        <button className={styles.cartBtn} onClick={onCart} aria-label={`Ouvrir le panier (${count} article${count > 1 ? "s" : ""})`}>
          <IconBag size={22} aria-hidden="true" />
          <span key={count} className={`${styles.count} ${count ? styles.countOn : ""}`}>{count}</span>
        </button>
        <button className={styles.burger} onClick={() => setMenu((m) => !m)} aria-label="Menu" aria-expanded={menu}>
          {menu ? <IconClose size={22} aria-hidden="true" /> : <IconMenu size={22} aria-hidden="true" />}
        </button>
      </div>

      <span ref={bar} className={styles.progress} aria-hidden="true" />
    </header>
  );
}