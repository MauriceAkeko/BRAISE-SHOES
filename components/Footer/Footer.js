import styles from "./Footer.module.css";
import base from "@/app/page.module.css";
import { SITE } from "@/data/site";
import { IconWhatsapp, IconInstagram, IconMail, IconPin } from "@/lib/icons";

export default function Footer() {
  return (
    <footer id="contact" className={styles.footer}>
      <div className={base.container}>
        <p className={styles.footerBig} aria-hidden="true">{SITE.name}</p>

        <div className={styles.footerGrid}>
          <div>
            <h3>Livraison à Abidjan</h3>
            <ul className={styles.zones}>
              {SITE.deliveryZones.map((z) => (<li key={z}><IconPin size={13} aria-hidden="true" /> {z}</li>))}
            </ul>
          </div>
          <div>
            <h3>Contact</h3>
            <p><a href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"><IconWhatsapp aria-hidden="true" /> WhatsApp</a></p>
            <p><a href={SITE.instagram} target="_blank" rel="noopener noreferrer"><IconInstagram aria-hidden="true" /> Instagram</a></p>
            <p><a href={`mailto:${SITE.email}`}><IconMail aria-hidden="true" /> {SITE.email}</a></p>
          </div>
          <div>
            <h3>{SITE.slogan}</h3>
            <p>Paiement à la livraison · Échange sous 7 jours · Paires 100 % authentiques.</p>
          </div>
        </div>

        <p className={styles.copy}>© {new Date().getFullYear()} {SITE.name} — Abidjan, Côte d’Ivoire. Site fictif.</p>
      </div>
    </footer>
  );
}