"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";

import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Marquee from "@/components/Marquee/Marquee";
import Showcase from "@/components/Showcase/Showcase";
import Catalogue from "@/components/Catalogue/Catalogue";
import Lookbook from "@/components/Lookbook/Lookbook";
import CartDrawer from "@/components/CartDrawer/CartDrawer";
import Footer from "@/components/Footer/Footer";

import { SNEAKERS, CLOTHES, LOOKS, BY_ID } from "@/data/products";
import { clampQty } from "@/lib/utils";
import { IconCheck } from "@/lib/icons";

const STORAGE_KEY = "braise_cart_v1";

// Taille par défaut quand on ajoute un look entier
const defaultSize = (p) => (p.sizes.includes("M") ? "M" : p.sizes[Math.floor(p.sizes.length / 2)]);

export default function Home() {
  // Le panier ne garde que { id, size, qty }. Les prix viennent TOUJOURS du catalogue (🔒 anti-triche).
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");
  const ready = useRef(false);
  const toastTimer = useRef(0);

  // Chargement du panier sauvegardé (revalidé contre le catalogue)
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(raw)) {
        const safe = raw
          .filter((l) => l && BY_ID[l.id] && BY_ID[l.id].sizes.map(String).includes(String(l.size)))
          .map((l) => ({ id: l.id, size: String(l.size), qty: clampQty(l.qty) }))
          .slice(0, 30);
        setCart(safe);
      }
    } catch {}
    ready.current = true;
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch {}
  }, [cart]);

  const notify = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  }, []);

  const addLines = useCallback((entries) => {
    setCart((c) => {
      const next = [...c];
      entries.forEach(([p, size]) => {
        const i = next.findIndex((l) => l.id === p.id && String(l.size) === String(size));
        if (i >= 0) next[i] = { ...next[i], qty: clampQty(next[i].qty + 1) };
        else next.push({ id: p.id, size: String(size), qty: 1 });
      });
      return next;
    });
  }, []);

  const add = useCallback((p, size) => {
    addLines([[p, size]]);
    notify(`${p.name} (T.${size}) ajouté`);
  }, [addLines, notify]);

  const addLook = useCallback((items) => {
    addLines(items.map((p) => [p, defaultSize(p)]));
    notify("Look ajouté au panier");
    setOpen(true);
  }, [addLines, notify]);

  const key = (l) => `${l.id}|${l.size}`;

  const onQty = (k, d) =>
    setCart((c) => c.map((l) => (key(l) === k ? { ...l, qty: clampQty(l.qty + d) } : l)));

  const onRemove = (k) => setCart((c) => c.filter((l) => key(l) !== k));

  const onSize = (k, size) =>
    setCart((c) => {
      const cur = c.find((l) => key(l) === k);
      if (!cur) return c;
      const rest = c.filter((l) => key(l) !== k);
      const twin = rest.find((l) => l.id === cur.id && l.size === String(size));
      if (twin) return rest.map((l) => (l === twin ? { ...l, qty: clampQty(l.qty + cur.qty) } : l));
      return c.map((l) => (key(l) === k ? { ...l, size: String(size) } : l));
    });

  const lines = useMemo(
    () => cart.map((l) => ({ key: key(l), product: BY_ID[l.id], size: l.size, qty: l.qty })).filter((l) => l.product),
    [cart]
  );
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const closeCart = useCallback(() => setOpen(false), []);

  return (
    <>
      <Header count={count} onCart={() => setOpen(true)} />

      <main>
        <Hero onAdd={add} />
        <Marquee />
        <Showcase />
        <Catalogue id="sneakers" kicker="Collection" title="Les" accent="basket" items={SNEAKERS} filterable onAdd={add} />
        <Lookbook looks={LOOKS} onAddLook={addLook} />
        <Catalogue id="vetements" kicker="Streetwear" title="Les" accent="vêtements" items={CLOTHES} onAdd={add} />
      </main>

      <Footer />

      <CartDrawer open={open} onClose={closeCart} lines={lines} onQty={onQty} onSize={onSize} onRemove={onRemove} />

      <div className={`${styles.toast} ${toast ? styles.toastOn : ""}`} role="status" aria-live="polite"><IconCheck aria-hidden="true" /> {toast}</div>
    </>
  );
}