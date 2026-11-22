"use client";
import { useState } from "react";
import styles from "./Hero.module.css";
import base from "@/app/page.module.css";
import SmartImage from "@/components/ui/SmartImage";
import useTilt from "@/hooks/useTilt";
import { SNEAKERS } from "@/data/products";
import { SITE } from "@/data/site";
import { formatPrice } from "@/lib/utils";
import { IconArrowLeft, IconArrowRight, IconArrowUpRight } from "@/lib/icons";

// Section d'accueil : grande basket 3D flottante + titre géant + vignettes (vidéo 2)
export default function Hero({ onAdd }) {
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState(null);
  const [shake, setShake] = useState(false);
  const tilt = useTilt(12);

  const total = SNEAKERS.length;
  const p = SNEAKERS[index];

  const go = (i) => {
    setIndex((i + total) % total);
    setSize(null);
  };

  const add = () => {
    if (!size) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onAdd(p, size);
  };

  let n = 0; // compteur de lettres pour l'animation en cascade

  return (
    <section id="accueil" className={styles.hero} style={{ "--accent": p.accent }}>
      <div className={styles.heroGrain} aria-hidden="true" />

      <p className={styles.heroSlogan}>{SITE.slogan}</p>

      <h1 className={styles.heroTitle} key={p.id} aria-label={p.name} style={{ "--len": Math.max(...p.name.split(" ").map((w) => w.length)) }}>
        {p.name.toUpperCase().split(" ").map((word, w) => (
          <span className={styles.line} key={w} aria-hidden="true">
            {word.split("").map((ch) => (
              <span key={n} className={styles.letter} style={{ "--i": n++ }}>{ch}</span>
            ))}
          </span>
        ))}
      </h1>

      <div
        className={styles.stage}
        ref={tilt.ref}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
      >
        <div className={styles.stageInner}>
          <div className={styles.disc} key={`d-${p.id}`} />
          <div className={styles.shoeWrap} key={p.id}>
            <SmartImage src={p.image} alt={`${p.name} – basket ${p.category}`} className={styles.shoeImg} />
          </div>
          <div className={styles.shadow} />
          {p.badge && <span className={styles.chip}>{p.badge}</span>}
        </div>
      </div>

      <aside className={styles.heroInfo} key={`i-${p.id}`}>
        <span className={styles.infoCat}>{p.category}</span>
        <p className={styles.infoPrice}>{formatPrice(p.price)}</p>

        <div className={`${styles.heroSizes} ${shake ? styles.shake : ""}`} role="group" aria-label="Choisis ta pointure">
          {p.sizes.map((s) => (
            <button
              key={s}
              className={`${styles.sizeBtn} ${size === s ? styles.sizeOn : ""}`}
              onClick={() => setSize(s)}
              aria-pressed={size === s}
            >
              {s}
            </button>
          ))}
        </div>

        <button className={`${base.btn} ${base.btnRed}`} onClick={add}>
          {size ? "Ajouter au panier" : "Choisis ta pointure"}
        </button>
        <a href="#sneakers" className={styles.infoLink}>Voir toute la collection <IconArrowUpRight aria-hidden="true" /></a>
      </aside>

      <div className={styles.thumbs} role="tablist" aria-label="Choisir une basket">
        <button className={styles.arrow} onClick={() => go(index - 1)} aria-label="Précédente"><IconArrowLeft aria-hidden="true" /></button>
        {SNEAKERS.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === index}
            className={`${styles.thumb} ${i === index ? styles.thumbOn : ""}`}
            onClick={() => go(i)}
            aria-label={s.name}
          >
            <SmartImage src={s.image} alt="" className={styles.thumbImg} />
          </button>
        ))}
        <button className={styles.arrow} onClick={() => go(index + 1)} aria-label="Suivante"><IconArrowRight aria-hidden="true" /></button>
      </div>

      <div className={styles.counter} aria-hidden="true">
        {String(index + 1).padStart(2, "0")}<small>/{String(total).padStart(2, "0")}</small>
      </div>
    </section>
  );
}