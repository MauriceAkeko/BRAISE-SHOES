"use client";
import { useState } from "react";
import styles from "./Lookbook.module.css";
import base from "@/app/page.module.css";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/ui/Reveal";
import { BY_ID } from "@/data/products";
import { formatPrice } from "@/lib/utils";

// « Essaie le look » : la tenue choisie devient nette, les autres se floutent (vidéo 2)
export default function Lookbook({ looks, onAddLook }) {
  const [active, setActive] = useState(0);
  const look = looks[active];
  const items = look.items.map((id) => BY_ID[id]).filter(Boolean);
  const total = items.reduce((s, p) => s + p.price, 0);

  return (
    <section id="look" className={`${base.section} ${styles.look}`}>
      <div className={base.container}>
        <Reveal>
          <span className={base.kicker}>Lookbook</span>
          <h2 className={base.title}>Essaie <em>le look</em>.</h2>
        </Reveal>

        <div className={styles.lookLayout}>
          <div className={styles.lookRow} role="tablist" aria-label="Choisir un look">
            {looks.map((l, i) => (
              <button
                key={l.id}
                role="tab"
                aria-selected={i === active}
                aria-label={l.name}
                className={`${styles.lookFig} ${i === active ? styles.lookFigOn : ""}`}
                onClick={() => setActive(i)}
              >
                <SmartImage src={l.image} alt={l.name} className={styles.lookImg} />
              </button>
            ))}
            <span className={styles.lookFloor} aria-hidden="true" />
          </div>

          <div className={styles.lookPanel} key={look.id}>
            <h3 className={styles.lookName}>{look.name}</h3>
            <ul className={styles.lookItems}>
              {items.map((p) => (
                <li key={p.id}>
                  <SmartImage src={p.image} alt="" className={styles.lookThumb} />
                  <span>{p.name}</span>
                  <b>{formatPrice(p.price)}</b>
                </li>
              ))}
            </ul>
            <p className={styles.lookTotal}>
              <span>Total du look</span> <b>{formatPrice(total)}</b>
            </p>
            <button className={`${base.btn} ${base.btnRed}`} onClick={() => onAddLook(items)}>
              Ajouter tout le look
            </button>
            <p className={styles.lookNote}>Tu pourras modifier les tailles dans le panier.</p>
          </div>
        </div>
      </div>
    </section>
  );
}