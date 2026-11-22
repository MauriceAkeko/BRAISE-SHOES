"use client";
import { useCallback, useRef } from "react";

// Effet 3D : incline l'élément selon la souris (variables CSS --rx --ry --gx --gy).
// Aucune re-render React → très fluide.
export default function useTilt(max = 10) {
  const ref = useRef(null);

  const onPointerMove = useCallback(
    (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", `${(px - 0.5) * 2 * max}deg`);
      el.style.setProperty("--rx", `${-(py - 0.5) * 2 * max}deg`);
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
    },
    [max]
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}