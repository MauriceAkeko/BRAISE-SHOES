"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";

// Image avec secours : si ton fichier n'existe pas encore,
// l'image par défaut /images/placeholder.svg s'affiche à la place.
export default function SmartImage({ src, alt = "", ...rest }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    // Si l'image a échoué AVANT que React soit prêt, onError n'est jamais déclenché :
    // on vérifie donc ici si elle est déjà en erreur.
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, [src]);

  return (
    <img
      ref={ref}
      src={failed ? "/images/placeholder.svg" : src}
      alt={alt}
      draggable={false}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}