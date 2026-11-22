"use client";
import { useEffect, useRef } from "react";
import styles from "./Showcase.module.css";
import base from "@/app/page.module.css";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/ui/Reveal";
import { SNEAKERS } from "@/data/products";
import { formatPrice } from "@/lib/utils";

// Positions des basket flottantes. d = profondeur (plus grand = bouge plus), r = rotation
const SPOTS = [
  { x: "4%",  y: "32%", w: "clamp(150px,22vw,330px)", d: 40, r: -14 },
  { x: "34%", y: "6%",  w: "clamp(130px,18vw,280px)", d: 70, r: 8 },
  { x: "60%", y: "28%", w: "clamp(160px,24vw,360px)", d: 30, r: -6 },
  { x: "22%", y: "66%", w: "clamp(120px,15vw,230px)", d: 90, r: 18 },
  { x: "70%", y: "70%", w: "clamp(110px,14vw,210px)", d: 55, r: -20 },
];

// Basket dispersées en profondeur : parallax souris + scroll (le "4D")
export default function Showcase() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5) * 2);
      el.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5) * 2);
    };
    const onLeave = () => {
      el.style.setProperty("--mx", 0);
      el.style.setProperty("--my", 0);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const c = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        el.style.setProperty("--sy", Math.max(-1, Math.min(1, c)));
      });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className={`${base.section} ${styles.showcase}`} ref={ref}>
      <div className={base.container}>
        <Reveal>
          <span className={base.kicker}>La sélection</span>
          <h2 className={base.title}>
            Obsédé par<br />la <em>braise</em>.
          </h2>
        </Reveal>
      </div>

      <div className={styles.floatField}>
        {SPOTS.map((s, i) => {
          const p = SNEAKERS[i % SNEAKERS.length];
          return (
            <a
              key={p.id}
              href="#sneakers"
              className={styles.floater}
              style={{ "--x": s.x, "--y": s.y, "--w": s.w, "--d": s.d, "--r": `${s.r}deg`, "--delay": `${i * -1.1}s` }}
              aria-label={`${p.name} – ${formatPrice(p.price)}`}
            >
              <span className={styles.floaterInner}>
                <SmartImage src={p.image} alt={p.name} className={styles.floaterImg} />
                <span className={styles.floaterLabel}>{p.name} · {formatPrice(p.price)}</span>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}