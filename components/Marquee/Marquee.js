import styles from "./Marquee.module.css";
import { SITE } from "@/data/site";
import { IconFlame } from "@/lib/icons";

// Bandeau noir qui défile (texte modifiable dans data/site.js)
export default function Marquee() {
  const items = [...SITE.marquee, ...SITE.marquee];
  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.marqueeTrack}>
        {[0, 1].map((k) => (
          <ul key={k} className={styles.marqueeList}>
            {items.map((t, i) => (
              <li key={i}>{t}<IconFlame className={styles.marqueeIcon} aria-hidden="true" /></li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}