"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./CartDrawer.module.css";
import base from "@/app/page.module.css";
import SmartImage from "@/components/ui/SmartImage";
import { SITE } from "@/data/site";
import {
  buildOrderMessage, buildWhatsAppUrl, formatPrice,
  isValidPhoneCI, normalizePhone, sanitizeText,
} from "@/lib/utils";
import { IconBag, IconClose, IconTrash, IconMinus, IconPlus, IconWhatsapp } from "@/lib/icons";

// Panier + commande par WhatsApp (pas de serveur, pas de paiement en ligne = surface d'attaque minimale)
export default function CartDrawer({ open, onClose, lines, onQty, onSize, onRemove }) {
  const [form, setForm] = useState({ name: "", phone: "", zone: "", address: "", website: "" }); // "website" = piège à robots
  const [errors, setErrors] = useState({});
  const lastSent = useRef(0);
  const closeBtn = useRef(null);

  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Échap pour fermer + blocage du scroll + focus
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const submit = (e) => {
    e.preventDefault();
    if (form.website) return;                                  // un robot a rempli le champ caché
    if (Date.now() - lastSent.current < 5000) return;          // anti double-clic / spam

    const clean = {
      name: sanitizeText(form.name, 60),
      phone: normalizePhone(form.phone),
      zone: form.zone,
      address: sanitizeText(form.address, 120),
    };
    const errs = {};
    if (clean.name.length < 2) errs.name = "Entre ton nom.";
    if (!isValidPhoneCI(form.phone)) errs.phone = "Numéro invalide (10 chiffres, ex : 07 00 00 00 00).";
    if (!SITE.deliveryZones.includes(clean.zone)) errs.zone = "Choisis ta commune.";
    if (clean.address.length < 3) errs.address = "Indique ton quartier / un repère.";
    if (!lines.length) errs.form = "Ton panier est vide.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const url = buildWhatsAppUrl(SITE.whatsapp, buildOrderMessage(lines, clean));
    if (!url) return setErrors({ form: "Numéro WhatsApp de la boutique non configuré (data/site.js)." });

    lastSent.current = Date.now();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div className={`${styles.overlay} ${open ? styles.overlayOn : ""}`} onClick={onClose} aria-hidden="true" />
      <aside
        className={`${styles.drawer} ${open ? styles.drawerOn : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
      >
        <div className={styles.drawerHead}>
          <h2>Mon panier</h2>
          <button ref={closeBtn} className={styles.close} onClick={onClose} aria-label="Fermer le panier"><IconClose aria-hidden="true" /></button>
        </div>

        {lines.length === 0 ? (
          <p className={styles.empty}><IconBag size={44} aria-hidden="true" /><br />Ton panier est vide.<br />Choisis une paire !</p>
        ) : (
          <>
            <ul className={styles.lines}>
              {lines.map((l) => (
                <li key={l.key} className={styles.line2}>
                  <SmartImage src={l.product.image} alt="" className={styles.lineImg} />
                  <div className={styles.lineInfo}>
                    <b>{l.product.name}</b>
                    <span>{formatPrice(l.product.price)}</span>
                    <div className={styles.lineCtrl}>
                      <select value={l.size} onChange={(e) => onSize(l.key, e.target.value)} aria-label="Taille">
                        {l.product.sizes.map((s) => (<option key={s} value={s}>T. {s}</option>))}
                      </select>
                      <div className={styles.qty}>
                        <button onClick={() => onQty(l.key, -1)} aria-label="Moins"><IconMinus aria-hidden="true" /></button>
                        <span>{l.qty}</span>
                        <button onClick={() => onQty(l.key, 1)} aria-label="Plus"><IconPlus aria-hidden="true" /></button>
                      </div>
                    </div>
                  </div>
                  <button className={styles.remove} onClick={() => onRemove(l.key)} aria-label={`Retirer ${l.product.name}`}><IconTrash aria-hidden="true" /></button>
                </li>
              ))}
            </ul>

            <form className={styles.form} onSubmit={submit} noValidate>
              <p className={styles.totalRow}><span>Total</span><b>{formatPrice(total)}</b></p>

              <label>Nom complet
                <input value={form.name} onChange={set("name")} autoComplete="name" maxLength={60} placeholder="Kouassi Awa" />
                {errors.name && <em className={styles.err}>{errors.name}</em>}
              </label>
              <label>Téléphone
                <input value={form.phone} onChange={set("phone")} autoComplete="tel" inputMode="tel" maxLength={20} placeholder="07 00 00 00 00" />
                {errors.phone && <em className={styles.err}>{errors.phone}</em>}
              </label>
              <label>Commune
                <select value={form.zone} onChange={set("zone")}>
                  <option value="">— Choisir —</option>
                  {SITE.deliveryZones.map((z) => (<option key={z} value={z}>{z}</option>))}
                </select>
                {errors.zone && <em className={styles.err}>{errors.zone}</em>}
              </label>
              <label>Quartier / repère
                <input value={form.address} onChange={set("address")} maxLength={120} placeholder="Riviera Palmeraie, près de la pharmacie…" />
                {errors.address && <em className={styles.err}>{errors.address}</em>}
              </label>

              {/* Champ piège : invisible pour les humains, rempli par les robots */}
              <input className={styles.honeypot} name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden="true" />

              {errors.form && <em className={styles.err}>{errors.form}</em>}
              <button type="submit" className={`${base.btn} ${base.btnRed} ${base.btnWide}`}><IconWhatsapp aria-hidden="true" /> Commander sur WhatsApp</button>
              <p className={styles.note}>Paiement à la livraison. Aucune donnée bancaire demandée.</p>
            </form>
          </>
        )}
      </aside>
    </>
  );
}