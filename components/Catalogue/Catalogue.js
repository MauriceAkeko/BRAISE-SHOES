"use client";
import { useMemo, useState } from "react";
import styles from "./Catalogue.module.css";
import base from "@/app/page.module.css";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/ui/Reveal";
import useTilt from "@/hooks/useTilt";
import { formatPrice } from "@/lib/utils";

function ProductCard({ p, onAdd, delay }) {
  const tilt = useTilt(9);
  return (
    <Reveal delay={delay} className={styles.card}>
      <div
        ref={tilt.ref}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
        className={styles.cardInner}
        style={{ "--accent": p.accent }}
      >
        {p.badge && <span className={styles.badge}>{p.badge}</span>}

        <div className={styles.cardMedia}>
          <SmartImage src={p.image} alt={p.name} className={styles.cardImg} />
        </div>

        <div className={styles.cardBody}>
          <span className={styles.cardCat}>{p.category}</span>
          <h3 className={styles.cardName}>{p.name}</h3>
          <p className={styles.cardPrice}>{formatPrice(p.price)}</p>

          <div className={styles.cardSizes}>
            <span>Ajouter en :</span>
            <div>
              {p.sizes.map((s) => (
                <button key={s} className={styles.sizeBtn} onClick={() => onAdd(p, s)} aria-label={`Ajouter ${p.name} taille ${s}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <span className={styles.glare} aria-hidden="true" />
      </div>
    </Reveal>
  );
}

// Grille de produits réutilisable (basket ET vêtements)
export default function Catalogue({ id, kicker, title, accent, items, filterable = false, onAdd }) {
  const cats = useMemo(() => ["Tout", ...new Set(items.map((i) => i.category))], [items]);
  const [cat, setCat] = useState("Tout");
  const shown = cat === "Tout" ? items : items.filter((i) => i.category === cat);

  return (
    <section id={id} className={base.section}>
      <div className={base.container}>
        <Reveal>
          <span className={base.kicker}>{kicker}</span>
          <h2 className={base.title}>
            {title} <em>{accent}</em>
          </h2>
        </Reveal>

        {filterable && (
          <div className={styles.filters} role="group" aria-label="Filtrer par catégorie">
            {cats.map((c) => (
              <button
                key={c}
                className={`${styles.chipBtn} ${c === cat ? styles.chipOn : ""}`}
                onClick={() => setCat(c)}
                aria-pressed={c === cat}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className={styles.grid}>
          {shown.map((p, i) => (
            <ProductCard key={`${cat}-${p.id}`} p={p} onAdd={onAdd} delay={i * 70} />
          ))}
        </div>
      </div>
    </section>
  );
}